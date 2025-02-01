"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth-context";
import { useLanguage } from "@/lib/language-context";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

interface SurveyFormProps {
  onSubmit: () => void;
}

type SurveyData = {
  responses: { factor: string; score: number }[];
  additionalFeedback: string;
};

export function SurveyForm({ onSubmit }: SurveyFormProps) {
  const { t } = useLanguage();
  const engagementFactors = [
    {
      factor: "Job Satisfaction",
      question: t("survey.questions.jobSatisfaction"),
    },
    {
      factor: "Career Alignment",
      question: t("survey.questions.careerAlignment"),
    },
    {
      factor: "Work-Life Balance",
      question: t("survey.questions.workLifeBalance"),
    },
    {
      factor: "Recognition",
      question: t("survey.questions.recognition"),
    },
    {
      factor: "Team Communication",
      question: t("survey.questions.teamCommunication"),
    },
    {
      factor: "Professional Growth",
      question: t("survey.questions.professionalGrowth"),
    },
    {
      factor: "Diversity and Inclusion",
      question: t("survey.questions.diversityAndInclusion"),
    },
    {
      factor: "Compensation and Benefits",
      question: t("survey.questions.compensationAndBenefits"),
    },
    {
      factor: "Company Culture",
      question: t("survey.questions.companyCulture"),
    },
    {
      factor: "Recommendation",
      question: t("survey.questions.recommendation"),
    },
  ];

  const [responses, setResponses] = useState<
    { factor: string; score: number }[]
  >(engagementFactors.map(({ factor }) => ({ factor, score: 3 })));
  const [additionalFeedback, setAdditionalFeedback] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const { user, getAuthToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: t("survey.authError.title"),
        description: t("survey.authError.description"),
        variant: "destructive",
      });
      router.push("/signin");
      return;
    }
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error(t("survey.errors.failedToken"));
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
        toast({
          title: t("survey.success.title"),
          description: t("survey.success.description"),
        });
        onSubmit(); // Call the onSubmit prop
      } else if (response.status === 401) {
        toast({
          title: t("survey.authError.title"),
          description: t("survey.authError.sessionExpired"),
          variant: "destructive",
        });
        router.push("/signin");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || t("survey.errors.submitFailed"));
      }
    } catch (error) {
      console.error(t("survey.errors.submitError"), error);
      toast({
        title: t("survey.errors.title"),
        description:
          error instanceof Error
            ? error.message
            : t("survey.errors.description"),
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {engagementFactors.map(({ factor, question }, index) => (
        <div key={index} className="mb-4">
          <Label htmlFor={`question-${index}`}>{question}</Label>
          <Input
            id={`question-${index}`}
            type="range"
            min="1"
            max="5"
            value={responses[index].score}
            onChange={(e) => {
              const newResponses = [...responses];
              newResponses[index].score = Number.parseInt(e.target.value);
              setResponses(newResponses);
            }}
          />
          <div className="flex justify-between text-xs">
            <span>{t("survey.scale.lowest")}</span>
            <span>{t("survey.scale.highest")}</span>
          </div>
        </div>
      ))}
      <div className="mb-4">
        <Label htmlFor="additional-feedback">
          {t("survey.additionalFeedback.label")}
        </Label>
        <Textarea
          id="additional-feedback"
          placeholder={t("survey.additionalFeedback.placeholder")}
          value={additionalFeedback}
          onChange={(e) => setAdditionalFeedback(e.target.value)}
          rows={5}
        />
      </div>
      <Button type="submit">{t("survey.submit")}</Button>
    </form>
  );
}
