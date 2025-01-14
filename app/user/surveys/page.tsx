"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SurveyForm } from "@/components/SurveyForm";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";

type SurveyData = {
  responses: { factor: string; score: number }[];
  additionalFeedback: string;
};

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

  const handleSubmit = async (surveyData: SurveyData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/surveys/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(surveyData),
        credentials: "include",
      });
      if (response.ok) {
        toast({
          title: "Survey Submitted",
          description: "Thank you for your feedback!",
        });
      } else {
        throw new Error("Failed to submit survey");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
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
        <SurveyForm onSubmit={(data) => handleSubmit(data)} />
      </CardContent>
    </Card>
  );
}
