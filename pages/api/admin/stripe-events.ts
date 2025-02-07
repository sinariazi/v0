import { getCurrentUser } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as const,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Check if the user has admin privileges
    const dbUser = await prisma.user.findUnique({
      where: { cognitoSub: user.username },
      select: { role: true },
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Forbidden: Admin access required" });
    }

    const events = await stripe.events.list({
      limit: 20,
      types: [
        "customer.subscription.created",
        "customer.subscription.updated",
        "customer.subscription.deleted",
        "customer.subscription.trial_will_end",
        "invoice.payment_succeeded",
        "invoice.payment_failed",
        "invoice.upcoming",
        "customer.created",
        "customer.updated",
        "charge.succeeded",
        "charge.failed",
        "charge.refunded",
      ],
    });

    res.status(200).json({ events: events.data });
  } catch (error) {
    console.error("Error fetching Stripe events:", error);
    res.status(500).json({ message: "Error fetching Stripe events" });
  }
}
