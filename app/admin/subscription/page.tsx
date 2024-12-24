"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const plans = [
  {
    name: "Basic",
    price: 9.99,
    features: ["Up to 10 employees", "Basic analytics", "Email support"],
  },
  {
    name: "Pro",
    price: 29.99,
    features: ["Up to 50 employees", "Advanced analytics", "Priority support"],
  },
  {
    name: "Enterprise",
    price: 99.99,
    features: [
      "Unlimited employees",
      "Custom features",
      "Dedicated account manager",
    ],
  },
];

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      const response = await fetch("/api/subscription/current-plan");
      const data = await response.json();
      setCurrentPlan(data.plan);
    };
    fetchCurrentPlan();
  }, []);

  const handleSubscribe = async (planName: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        "/api/subscription/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan: planName }),
        }
      );

      const session = await response.json();
      const stripe = await stripePromise;
      const result = await stripe!.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Choose Your Subscription Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.name}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>${plan.price}/month</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleSubscribe(plan.name)}
                disabled={loading || currentPlan === plan.name}
                className="w-full"
              >
                {currentPlan === plan.name ? "Current Plan" : "Subscribe"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
