import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SurveyQuestion {
  id: "question1" | "question2" | "question3";
  label: string;
}

export default function SurveyPage() {
  const [question1, setQuestion1] = useState("");
  const [question2, setQuestion2] = useState("");
  const [question3, setQuestion3] = useState("");
  const [surveyDate, setSurveyDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit-survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "placeholder-user-id", // Replace with actual user ID from authentication
          organizationId: "placeholder-org-id", // Replace with actual organization ID
          question1Score: parseInt(question1),
          question2Score: parseInt(question2),
          question3Score: parseInt(question3),
          surveyDate,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(
          `Survey submitted successfully! Your engagement score is: ${result.engagementScore.toFixed(2)}`,
        );
        router.push("/"); // Redirect to home page or a thank you page
      } else {
        throw new Error("Failed to submit survey");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      alert("Failed to submit survey. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const questions: SurveyQuestion[] = [
    { id: "question1", label: "How satisfied are you with your current role?" },
    { id: "question2", label: "How well do you feel your work is recognized?" },
    {
      id: "question3",
      label: "How likely are you to recommend our company as a place to work?",
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Employee Engagement Survey</CardTitle>
          <CardDescription>
            Please answer the following questions on a scale of 1-10
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="space-y-2">
                <Label htmlFor={question.id}>{question.label}</Label>
                <Input
                  id={question.id}
                  type="number"
                  min="1"
                  max="10"
                  value={
                    question.id === "question1"
                      ? question1
                      : question.id === "question2"
                        ? question2
                        : question3
                  }
                  onChange={handleInputChange(
                    question.id === "question1"
                      ? setQuestion1
                      : question.id === "question2"
                        ? setQuestion2
                        : setQuestion3,
                  )}
                  required
                />
              </div>
            ))}
            <div className="space-y-2">
              <Label htmlFor="surveyDate">Survey Date</Label>
              <Input
                id="surveyDate"
                type="date"
                value={surveyDate}
                onChange={(e) => setSurveyDate(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Survey"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
