import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";

interface Survey {
  id: number;
  createdAt: string;
  responses: { question: string; answer: number }[];
  additionalFeedback?: string;
}

export function SurveyResults({ surveys }: { surveys: Survey[] }) {
  const { t } = useLanguage();

  return (
    <div>
      {surveys.map((survey) => (
        <Card key={survey.id} className="mb-4">
          <CardHeader>
            <CardTitle>
              {t("surveyResults.surveyFrom") +
                {
                  date: new Date(survey.createdAt).toLocaleString(),
                }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {survey.responses.map((response, index) => (
              <div key={index} className="mb-2">
                <p>
                  <strong>{response.question}</strong>
                </p>
                <p>{t("surveyResults.answer") + { score: response.answer }}</p>
              </div>
            ))}
            {survey.additionalFeedback && (
              <div className="mt-4">
                <p>
                  <strong>{t("surveyResults.additionalFeedback")}</strong>
                </p>
                <p>{survey.additionalFeedback}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
