import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const { responses, additionalFeedback } = req.body;

    const dbUser = await prisma.user.findUnique({
      where: { cognitoSub: user.userId },
      select: { organizationId: true },
    });

    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
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
