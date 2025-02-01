"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

interface SurveyResponse {
  factor: string;
  score: number;
}

interface Survey {
  id: number;
  createdAt: Date;
  responses: SurveyResponse[];
  organization: {
    name: string;
  };
}

interface SurveyResultsClientProps {
  surveys: Survey[];
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  }).format(date);
};

export default function SurveyResultsClient({
  surveys,
}: SurveyResultsClientProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("surveyResults.title")}</h1>
      {surveys.length === 0 ? (
        <p>{t("surveyResults.noResults")}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {surveys.map((survey) => (
            <Card key={survey.id}>
              <CardHeader>
                <CardTitle>
                  {`${t("surveyResults.surveyFrom")} ${formatDate(
                    survey.createdAt
                  )}`}
                </CardTitle>
                <CardDescription>
                  {t("surveyResults.organization")}: {survey.organization.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {survey.responses.map((response, index) => (
                  <p key={index} className="mb-2">
                    <strong>{response.factor}:</strong> {response.score}
                  </p>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
