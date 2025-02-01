import prisma from "@/lib/prisma";
import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia" as const,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"]!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf.toString(),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Error verifying webhook signature:", err);
    return res
      .status(400)
      .send(
        `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`
      );
  }

  try {
    switch (event.type) {
      // Account events
      case "account.external_account.created":
      case "account.external_account.deleted":
      case "account.external_account.updated":
      case "account.updated":
        await handleAccountEvent(event.type);
        break;

      // Customer events
      case "customer.created":
      case "customer.deleted":
      case "customer.updated":
        await handleCustomerEvent(event.type);
        break;

      // Customer discount events
      case "customer.discount.created":
      case "customer.discount.deleted":
      case "customer.discount.updated":
        await handleCustomerDiscountEvent(event.type);
        break;

      // Customer source events
      case "customer.source.created":
      case "customer.source.deleted":
      case "customer.source.expiring":
      case "customer.source.updated":
        await handleCustomerSourceEvent(
          event.type,
          event.data.object as Stripe.Source
        );
        break;

      // Customer subscription events
      case "customer.subscription.created":
      case "customer.subscription.deleted":
      case "customer.subscription.paused":
      case "customer.subscription.pending_update_applied":
      case "customer.subscription.pending_update_expired":
      case "customer.subscription.resumed":
      case "customer.subscription.trial_will_end":
      case "customer.subscription.updated":
        await handleCustomerSubscriptionEvent(
          event.type,
          event.data.object as Stripe.Subscription
        );
        break;

      // Customer tax ID events
      case "customer.tax_id.created":
      case "customer.tax_id.deleted":
      case "customer.tax_id.updated":
        await handleCustomerTaxIdEvent(
          event.type,
          event.data.object as Stripe.TaxId
        );
        break;

      // Invoice events
      case "invoice.created":
      case "invoice.deleted":
      case "invoice.finalization_failed":
      case "invoice.finalized":
      case "invoice.marked_uncollectible":
      case "invoice.overdue":
      case "invoice.paid":
      case "invoice.payment_action_required":
      case "invoice.payment_failed":
        await handleInvoiceEvent(event.type);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Webhook handler failed" });
  }
}

async function handleAccountEvent(eventType: string) {
  console.log(`Account event: ${eventType}`);
  // Implement logic to handle account events
}

async function handleCustomerEvent(eventType: string) {
  console.log(`Customer event: ${eventType}`);
  // Implement logic to handle customer events
}

async function handleCustomerDiscountEvent(eventType: string) {
  console.log(`Customer discount event: ${eventType}`);
  // Implement logic to handle customer discount events
}

async function handleCustomerSourceEvent(eventType: string) {
  console.log(`Customer source event: ${eventType}`);
  // Implement logic to handle customer source events
}

async function handleCustomerSubscriptionEvent(
  eventType: string,
  subscription: Stripe.Subscription
) {
  console.log(`Customer subscription event: ${eventType}`);
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = subscription.status;
  const planId = subscription.items.data[0].price.id;

  try {
    await prisma.customer.update({
      where: { stripeCustomerId: customerId },
      data: {
        subscriptionId,
        subscriptionStatus: status,
        subscriptionPlan: planId,
        billingCycleStart: new Date(subscription.current_period_start * 1000),
        billingCycleEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  } catch (error) {
    console.error("Error updating subscription in database:", error);
  }
}

async function handleCustomerTaxIdEvent(eventType: string) {
  console.log(`Customer tax ID event: ${eventType}`);
  // Implement logic to handle customer tax ID events
}

async function handleInvoiceEvent(eventType: string) {
  console.log(`Invoice event: ${eventType}`);
  // Implement logic to handle invoice events
}
