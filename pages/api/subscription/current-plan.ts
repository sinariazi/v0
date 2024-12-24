import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@auth0/nextjs-auth0";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia" as const,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getSession(req, res);
  if (!session || !session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { customer: true },
    });

    if (!user || !user.customer) {
      return res.status(200).json({ plan: null });
    }

    const subscription = await stripe.subscriptions.retrieve(
      user.customer.subscriptionId!
    );

    const plan = subscription.items.data[0].price.nickname;

    res.status(200).json({ plan });
  } catch (error) {
    console.error("Error fetching current plan:", error);
    res.status(500).json({ message: "Error fetching current plan" });
  }
}
