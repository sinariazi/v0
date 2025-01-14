import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { configureAmplify } from "@/lib/amplify-config";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import jwt from "jsonwebtoken";

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
      select: { organizationId: true },
    });

    if (!dbUser) {
      return res
        .status(404)
        .json({ message: "User not found in the database" });
    }

    const survey = await prisma.survey.create({
      data: {
        organizationId: dbUser.organizationId,
        additionalFeedback,
        responses: {
          create: responses.map(
            (response: { question: string; answer: number }) => ({
              question: response.question,
              answer: response.answer,
            })
          ),
        },
      },
    });

    res
      .status(201)
      .json({ message: "Survey submitted successfully", surveyId: survey.id });
  } catch (error) {
    console.error("Error submitting survey:", error);
    res.status(500).json({ message: "Error submitting survey" });
  }
}
