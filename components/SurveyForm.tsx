import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const questions = [
  "How satisfied are you with your current role?",
  "How engaged do you feel in your day-to-day work?",
  "How well does your work align with your career goals?",
  "How would you rate the work-life balance in your current position?",
  "How satisfied are you with the recognition you receive for your work?",
  "How would you rate the communication within your team?",
  "How satisfied are you with the opportunities for professional growth?",
  "How would you rate the company's commitment to diversity and inclusion?",
  "How satisfied are you with your current compensation and benefits?",
  "How would you rate the overall company culture?",
  "How likely are you to recommend this company as a great place to work?",
  "How well do you feel supported by your manager?",
  "How confident are you in the company's future success?",
  "How well do you understand the company's goals and objectives?",
  "How valued do you feel as an employee of this company?",
];

export function SurveyForm({ onSubmit }: { onSubmit: () => void }) {
  const [responses, setResponses] = useState<
    { question: string; answer: number }[]
  >(questions.map((q) => ({ question: q, answer: 3 })));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/surveys/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses }),
      });
      if (response.ok) {
        onSubmit();
      } else {
        console.error("Failed to submit survey");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {questions.map((question, index) => (
        <div key={index} className="mb-4">
          <Label htmlFor={`question-${index}`}>{question}</Label>
          <Input
            id={`question-${index}`}
            type="range"
            min="1"
            max="5"
            value={responses[index].answer}
            onChange={(e) => {
              const newResponses = [...responses];
              newResponses[index].answer = parseInt(e.target.value);
              setResponses(newResponses);
            }}
          />
          <div className="flex justify-between text-xs">
            <span>1 (Strongly Disagree)</span>
            <span>5 (Strongly Agree)</span>
          </div>
        </div>
      ))}
      <Button type="submit">Submit Survey</Button>
    </form>
  );
}
