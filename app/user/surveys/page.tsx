"use client";

import { SurveyForm } from "@/components/SurveyForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/lib/language-context";
import { useState } from "react";

export default function UserSurveys() {
  const [showForm, setShowForm] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSurveySubmit = () => {
    setShowForm(false);
    toast({
      title: t("survey.success.title"),
      description: t("survey.success.description"),
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {t("adminDashboard.surveys.title")}
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("survey.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {showForm ? (
            <SurveyForm onSubmit={handleSurveySubmit} />
          ) : (
            <p>{t("survey.success.description")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
