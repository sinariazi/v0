"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const questions = [
  "How satisfied are you with your current role?",
  "How well does your work align with your career goals?",
  "How would you rate the work-life balance in your current position?",
  "How satisfied are you with the recognition you receive for your work?",
  "How would you rate the communication within your team?",
  "How satisfied are you with the opportunities for professional growth?",
  "How would you rate the company's commitment to diversity and inclusion?",
  "How satisfied are you with your current compensation and benefits?",
  "How would you rate the overall company culture?",
  "How likely are you to recommend this company as a great place to work?",
];

export function SurveyForm({
  onSubmit,
}: {
  onSubmit: (surveyData: {
    responses: { question: string; answer: number }[];
    additionalFeedback: string;
  }) => Promise<void>;
}) {
  const [responses, setResponses] = useState<
    { question: string; answer: number }[]
  >(questions.map((q) => ({ question: q, answer: 3 })));
  const [additionalFeedback, setAdditionalFeedback] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const { user, getAuthToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be signed in to submit a survey.",
        variant: "destructive",
      });
      router.push("/signin");
      return;
    }
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error("Failed to get authentication token");
      }

      const response = await fetch("/api/surveys/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ responses, additionalFeedback }),
      });
      if (response.ok) {
        await onSubmit({ responses, additionalFeedback });
        toast({
          title: "Success",
          description: "Survey submitted successfully",
        });
      } else if (response.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive",
        });
        router.push("/signin");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit survey");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit survey. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {questions.map((question, index) => (
        <div key={index} className="mb-4">
          <Label htmlFor={`question-${index}`}>{question}</Label>
          <Input
            id={`question-${index}`}
            type="range"
            min="1"
            max="5"
            value={responses[index].answer}
            onChange={(e) => {
              const newResponses = [...responses];
              newResponses[index].answer = parseInt(e.target.value);
              setResponses(newResponses);
            }}
          />
          <div className="flex justify-between text-xs">
            <span>1 (Lowest)</span>
            <span>5 (Highest)</span>
          </div>
        </div>
      ))}
      <div className="mb-4">
        <Label htmlFor="additional-feedback">Additional Feedback</Label>
        <Textarea
          id="additional-feedback"
          placeholder="Please provide any additional feedback or comments here..."
          value={additionalFeedback}
          onChange={(e) => setAdditionalFeedback(e.target.value)}
          rows={5}
        />
      </div>
      <Button type="submit">Submit Survey</Button>
    </form>
  );
}
