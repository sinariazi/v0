import prisma from "@/lib/prisma";
import { getSession } from "@auth0/nextjs-auth0";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia" as const,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getSession(req, res);
  if (!session || !session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { plan } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { customer: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let stripeCustomerId = user.customer?.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id.toString(),
        },
      });

      stripeCustomerId = customer.id;

      await prisma.customer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        },
      });
    }

    const priceId = getPriceId(plan);

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription`,
    });

    res.status(200).json({ id: checkoutSession.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ message: "Error creating checkout session" });
  }
}

function getPriceId(plan: string): string {
  switch (plan) {
    case "Basic":
      return process.env.STRIPE_BASIC_PLAN_PRICE_ID!;
    case "Pro":
      return process.env.STRIPE_PRO_PLAN_PRICE_ID!;
    case "Enterprise":
      return process.env.STRIPE_ENTERPRISE_PLAN_PRICE_ID!;
    default:
      throw new Error("Invalid plan");
  }
}
