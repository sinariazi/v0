"use client";

import { AverageEngagementScores } from "@/components/AverageEngagementScores";
import { SurveyForm } from "@/components/SurveyForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/lib/language-context";
import { useState } from "react";

export default function UserDashboard() {
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
    <div className="container mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">{t("adminSideMenu.dashboard")}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("adminDashboard.userArea.recentActivity")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t("adminDashboard.userArea.recentActivityDescription")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {t("adminDashboard.userArea.upcomingSurveys")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t("adminDashboard.userArea.upcomingSurveysDescription")}</p>
          </CardContent>
        </Card>
      </div>

      <AverageEngagementScores />

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
