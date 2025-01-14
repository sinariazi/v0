"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SurveyForm } from "@/components/SurveyForm";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";

export default function UserSurveysPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the survey data to your API
      // For now, we'll just simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Survey Submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit survey. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // This will prevent the page from rendering before redirecting
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Surveys</CardTitle>
      </CardHeader>
      <CardContent>
        <SurveyForm onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  );
}
