"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/use-toast";

type EngagementScore = {
  factor: string;
  averageScore: number;
};

export function AverageEngagementScores() {
  const [scores, setScores] = useState<EngagementScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  const { user, getAuthToken } = useAuth();
  const { toast } = useToast();

  const fetchScores = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
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
        setLastFetchTime(Date.now());
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
    } finally {
      setIsLoading(false);
    }
  }, [user, getAuthToken, toast]);

  useEffect(() => {
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

    const fetchScoresIfNeeded = async () => {
      const now = Date.now();
      if (!lastFetchTime || now - lastFetchTime > CACHE_DURATION) {
        await fetchScores();
        setLastFetchTime(now);
      }
    };

    fetchScoresIfNeeded();
  }, [fetchScores, lastFetchTime]);

  if (isLoading) {
    return <div>Loading average engagement scores...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Engagement Scores</CardTitle>
      </CardHeader>
      <CardContent>
        {scores.length === 0 ? (
          <p>No engagement scores available.</p>
        ) : (
          scores.map((score, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold">{score.factor}</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(score.averageScore / 5) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm">
                {score.averageScore.toFixed(2)} / 5
              </span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
