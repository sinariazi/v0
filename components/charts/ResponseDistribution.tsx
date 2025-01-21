"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/components/ui/use-toast";

interface ResponseCount {
  score: number;
  count: number;
}

interface ResponseDistributionProps {
  dateRange: string;
  shouldFetch: boolean;
  onDataFetched: () => void;
}

export function ResponseDistribution({
  dateRange,
  shouldFetch,
  onDataFetched,
}: ResponseDistributionProps) {
  const [data, setData] = useState<ResponseCount[]>([]);
  const { getAuthToken } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!shouldFetch) return;

      try {
        const token = await getAuthToken();
        const response = await fetch(
          `/api/insights/response-distribution?range=${dateRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result);
        onDataFetched();
      } catch (error) {
        console.error("Error fetching response distribution data:", error);
        toast({
          title: "Error",
          description:
            "Failed to load response distribution data. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [dateRange, shouldFetch, getAuthToken, toast, onDataFetched]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="score" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
}
