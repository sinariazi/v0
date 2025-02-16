import { getCurrentUser } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { cognitoSub: currentUser.userId },
      include: { customer: true },
    });

    if (!user || !user.customer) {
      return res.status(404).json({ message: "User or customer not found" });
    }

    const { trialEndDate, trialStatus } = user.customer;

    if (!trialEndDate) {
      return res.status(400).json({ message: "Trial end date not set" });
    }

    const now = new Date();
    const isTrialExpired = now > trialEndDate;

    if (isTrialExpired && trialStatus === "ACTIVE") {
      await prisma.customer.update({
        where: { id: user.customer.id },
        data: { trialStatus: "EXPIRED" },
      });
    }

    res.status(200).json({
      trialStatus: isTrialExpired ? "EXPIRED" : "ACTIVE",
      trialEndDate,
    });
  } catch (error) {
    console.error("Error checking trial status:", error);
    res.status(500).json({ message: "Error checking trial status" });
  }
}
