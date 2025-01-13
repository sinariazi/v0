"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface GenerateNewSurveyButtonProps {
  onSuccess: () => void;
}

export function GenerateNewSurveyButton({
  onSuccess,
}: GenerateNewSurveyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateNewSurvey = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/surveys/generate", {
        method: "POST",
      });
      if (response.ok) {
        onSuccess();
      } else {
        throw new Error("Failed to generate new survey");
      }
    } catch (error) {
      console.error("Error generating new survey:", error);
      toast({
        title: "Error",
        description: "Failed to generate new survey. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleGenerateNewSurvey} disabled={isLoading}>
      {isLoading ? "Generating..." : "Generate New Survey"}
    </Button>
  );
}
