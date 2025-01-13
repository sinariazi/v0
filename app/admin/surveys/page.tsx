"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SurveyForm } from "@/components/SurveyForm";
import { SurveyResults } from "@/components/SurveyResults";

export default function SurveysPage() {
  const [showForm, setShowForm] = useState(false);
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await fetch("/api/surveys");
      if (response.ok) {
        const data = await response.json();
        setSurveys(data);
      } else {
        console.error("Failed to fetch surveys");
      }
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Engagement Surveys</CardTitle>
        <CardDescription>Create and view survey results</CardDescription>
      </CardHeader>
      <CardContent>
        {showForm ? (
          <SurveyForm
            onSubmit={() => {
              setShowForm(false);
              fetchSurveys();
            }}
          />
        ) : (
          <>
            <Button onClick={() => setShowForm(true)} className="mb-4">
              Create New Survey
            </Button>
            <SurveyResults surveys={surveys} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
