"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SubscriptionDetails {
  plan: string;
  nextBillingDate: string;
}

export default function SubscriptionSuccessPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] =
    useState<SubscriptionDetails | null>(null);
  const router = useRouter();

  useEffect(() => {
    const verifySubscription = async () => {
      try {
        const sessionId = new URLSearchParams(window.location.search).get(
          "session_id"
        );
        if (!sessionId) {
          throw new Error("No session ID found");
        }

        const response = await fetch(
          `/api/subscription/verify?session_id=${sessionId}`
        );
        if (!response.ok) {
          throw new Error("Failed to verify subscription");
        }

        const data: SubscriptionDetails = await response.json();
        setSubscriptionDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    verifySubscription();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            There was a problem verifying your subscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button onClick={() => router.push("/subscription")}>
            Return to Subscription Page
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Successful!</CardTitle>
        <CardDescription>
          Thank you for subscribing to Mood Whisper
        </CardDescription>
      </CardHeader>
      <CardContent>
        {subscriptionDetails && (
          <>
            <p>
              Your subscription to the {subscriptionDetails.plan} plan is now
              active.
            </p>
            <p>
              Next billing date:{" "}
              {new Date(
                subscriptionDetails.nextBillingDate
              ).toLocaleDateString()}
            </p>
          </>
        )}
        <Button onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
      </CardContent>
    </Card>
  );
}
