import { getCurrentUser } from "@/lib/auth-utils";
import { sendSurveyInvitation } from "@/lib/email";
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.signInDetails?.loginId },
      select: { id: true, organizationId: true, role: true }, // Select the user's ID as well
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Create a new survey with placeholder values for required fields
    const newSurvey = await prisma.survey.create({
      data: {
        organizationId: dbUser.organizationId,
        userId: dbUser.id, // Use the admin's ID as a placeholder
        question1Score: 0, // Placeholder value
        question2Score: 0, // Placeholder value
        question3Score: 0, // Placeholder value
        status: "ACTIVE",
      },
    });

    // Get all users in the organization
    const organizationUsers = await prisma.user.findMany({
      where: { organizationId: dbUser.organizationId },
    });

    // Send email invitations
    for (const user of organizationUsers) {
      await sendSurveyInvitation(user.email, newSurvey.id);
    }

    res
      .status(200)
      .json({
        message: "New survey generated and invitations sent",
        surveyId: newSurvey.id,
      });
  } catch (error) {
    console.error("Error generating new survey:", error);
    res.status(500).json({ message: "Error generating new survey" });
  }
}
