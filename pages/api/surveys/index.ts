import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-utils";
import { AuthUser } from "aws-amplify/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const user: AuthUser | null = await getCurrentUser(req);
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.signInDetails?.loginId },
      select: { organizationId: true },
    });

    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const surveys = await prisma.survey.findMany({
      where: { organizationId: dbUser.organizationId },
      include: {
        responses: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(surveys);
  } catch (error) {
    console.error("Error fetching surveys:", error);
    res.status(500).json({ message: "Error fetching surveys" });
  }
}
