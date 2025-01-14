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
import { GenerateNewSurveyButton } from "@/components/GenerateNewSurveyButton";
import { useToast } from "@/components/ui/use-toast";

export default function SurveysPage() {
  const [showForm, setShowForm] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const { toast } = useToast();

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

  const handleNewSurveyGenerated = () => {
    toast({
      title: "New Survey Generated",
      description:
        "Email invitations have been sent to all users in your organization.",
    });
    fetchSurveys(); // Refresh the survey list
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Engagement Surveys</CardTitle>
        <CardDescription>Create and view survey results</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Button onClick={() => setShowForm(true)}>Create New Survey</Button>
          <GenerateNewSurveyButton onSuccess={handleNewSurveyGenerated} />
        </div>
        {showForm ? (
          <SurveyForm
            onSubmit={() => {
              setShowForm(false);
              fetchSurveys();
            }}
          />
        ) : (
          <SurveyResults surveys={surveys} />
        )}
      </CardContent>
    </Card>
  );
}
