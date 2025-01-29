"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/language-context";
import { useToast } from "@/components/ui/use-toast";

interface SurveyQuestion {
  id: "question1" | "question2" | "question3";
  label: string;
}

export default function SurveyPage() {
  const [question1, setQuestion1] = useState("");
  const [question2, setQuestion2] = useState("");
  const [question3, setQuestion3] = useState("");
  const [surveyDate, setSurveyDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();

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
          question1Score: Number.parseInt(question1),
          question2Score: Number.parseInt(question2),
          question3Score: Number.parseInt(question3),
          surveyDate,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: t("survey.successTitle"),
          description:
            t("survey.successDescription") +
            " " +
            result.engagementScore.toFixed(2),
        });
        router.push("/"); // Redirect to home page or a thank you page
      } else {
        throw new Error(t("survey.submitError"));
      }
    } catch (error) {
      console.error(t("survey.errorLogging"), error);
      toast({
        title: t("survey.errorTitle"),
        description: t("survey.errorDescription"),
        variant: "destructive",
      });
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
    { id: "question1", label: t("survey.questions.question1") },
    { id: "question2", label: t("survey.questions.question2") },
    { id: "question3", label: t("survey.questions.question3") },
  ];

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{t("survey.title")}</CardTitle>
          <CardDescription>{t("survey.description")}</CardDescription>
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
                      : setQuestion3
                  )}
                  required
                />
              </div>
            ))}
            <div className="space-y-2">
              <Label htmlFor="surveyDate">{t("survey.dateLabel")}</Label>
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
              {isSubmitting ? t("survey.submitting") : t("survey.submit")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
