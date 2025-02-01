import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const {
    userId,
    organizationId,
    question1Score,
    question2Score,
    question3Score,
    surveyDate,
  } = req.body;

  if (
    !userId ||
    !organizationId ||
    !question1Score ||
    !question2Score ||
    !question3Score ||
    !surveyDate
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Simple placeholder AI logic for engagement score
    const engagementScore =
      (question1Score + question2Score + question3Score) / 3;

    const survey = await prisma.survey.create({
      data: {
        userId,
        organizationId,
        question1Score,
        question2Score,
        question3Score,
        engagementScore,
        surveyDate: new Date(surveyDate), // Add surveyDate to the data
      },
    });

    res.status(200).json({
      message: "Survey submitted successfully",
      engagementScore,
      surveyId: survey.id,
    });
  } catch (error) {
    console.error("Error submitting survey:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
