import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Survey {
  id: number;
  createdAt: string;
  responses: { question: string; answer: number }[];
  additionalFeedback?: string;
}

export function SurveyResults({ surveys }: { surveys: Survey[] }) {
  return (
    <div>
      {surveys.map((survey) => (
        <Card key={survey.id} className="mb-4">
          <CardHeader>
            <CardTitle>
              Survey from {new Date(survey.createdAt).toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {survey.responses.map((response, index) => (
              <div key={index} className="mb-2">
                <p>
                  <strong>{response.question}</strong>
                </p>
                <p>Answer: {response.answer}/5</p>
              </div>
            ))}
            {survey.additionalFeedback && (
              <div className="mt-4">
                <p>
                  <strong>Additional Feedback:</strong>
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
