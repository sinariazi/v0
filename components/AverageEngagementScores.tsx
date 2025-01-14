"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/use-toast";

type EngagementScore = {
  factor: string;
  averageScore: number;
};

export function AverageEngagementScores() {
  const [scores, setScores] = useState<EngagementScore[]>([]);
  const { user, getAuthToken } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchScores = async () => {
      if (!user) return;

      try {
        const token = await getAuthToken();
        if (!token) {
          throw new Error("Failed to get authentication token");
        }

        const response = await fetch("/api/surveys/average-scores", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setScores(data.scores);
        } else {
          throw new Error("Failed to fetch average scores");
        }
      } catch (error) {
        console.error("Error fetching average scores:", error);
        toast({
          title: "Error",
          description: "Failed to fetch average engagement scores.",
          variant: "destructive",
        });
      }
    };

    fetchScores();
  }, [user, getAuthToken, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Engagement Scores</CardTitle>
      </CardHeader>
      <CardContent>
        {scores.map((score, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-lg font-semibold">{score.factor}</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${(score.averageScore / 5) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm">{score.averageScore.toFixed(2)} / 5</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
