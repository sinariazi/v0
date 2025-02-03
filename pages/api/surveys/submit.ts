import { configureAmplify } from "@/lib/amplify-config";
import prisma from "@/lib/prisma";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

configureAmplify();

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID!,
  tokenUse: "access",
  clientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    const token = authHeader.split(" ")[1];

    let decodedToken;
    try {
      await verifier.verify(token);
      decodedToken = jwt.decode(token);
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    if (!decodedToken || typeof decodedToken === "string") {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const cognitoSub = decodedToken.sub;

    const { responses, additionalFeedback } = req.body;

    const dbUser = await prisma.user.findUnique({
      where: { cognitoSub },
      select: { id: true, organizationId: true },
    });

    if (!dbUser) {
      return res
        .status(404)
        .json({ message: "User not found in the database" });
    }

    const result = await prisma.$transaction(async (prisma) => {
      // Create the survey
      const survey = await prisma.survey.create({
        data: {
          organizationId: dbUser.organizationId,
          userId: dbUser.id,
          additionalFeedback,
          question1Score:
            responses.find((r: { factor: string }) => r.factor === "question1")
              ?.score || 0,
          question2Score:
            responses.find((r: { factor: string }) => r.factor === "question2")
              ?.score || 0,
          question3Score:
            responses.find((r: { factor: string }) => r.factor === "question3")
              ?.score || 0,
          status: "COMPLETED",
          responses: {
            create: responses.map(
              (response: { factor: string; score: number }) => ({
                factor: response.factor,
                score: response.score,
              })
            ),
          },
        },
      });

      // Calculate and update average scores for each factor
      for (const response of responses) {
        const existingScore = await prisma.averageEngagementScore.findUnique({
          where: {
            organizationId_factor: {
              organizationId: dbUser.organizationId,
              factor: response.factor,
            },
          },
        });

        if (existingScore) {
          const newTotalScore = existingScore.totalScore + response.score;
          const newResponseCount = existingScore.responseCount + 1;
          const newAverageScore = newTotalScore / newResponseCount;

          await prisma.averageEngagementScore.update({
            where: {
              organizationId_factor: {
                organizationId: dbUser.organizationId,
                factor: response.factor,
              },
            },
            data: {
              totalScore: newTotalScore,
              responseCount: newResponseCount,
              averageScore: newAverageScore,
            },
          });
        } else {
          await prisma.averageEngagementScore.create({
            data: {
              organizationId: dbUser.organizationId,
              factor: response.factor,
              totalScore: response.score,
              responseCount: 1,
              averageScore: response.score,
            },
          });
        }
      }

      return survey;
    });

    res
      .status(201)
      .json({ message: "Survey submitted successfully", surveyId: result.id });
  } catch (error) {
    console.error("Error submitting survey:", error);
    res.status(500).json({ message: "Error submitting survey" });
  }
}
