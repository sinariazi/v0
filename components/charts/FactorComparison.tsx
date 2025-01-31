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

interface FactorScore {
  factor: string;
  score: number;
}

interface FactorComparisonProps {
  dateRange: string;
  shouldFetch: boolean;
  onDataFetched: () => void;
}

export function FactorComparison({
  dateRange,
  shouldFetch,
  onDataFetched,
}: FactorComparisonProps) {
  const [data, setData] = useState<FactorScore[]>([]);
  const { getAuthToken } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!shouldFetch) return;

      try {
        const token = await getAuthToken();
        const response = await fetch(
          `/api/insights/factor-comparison?range=${dateRange}`,
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
        console.error("Error fetching factor comparison data:", error);
        toast({
          title: "Error",
          description:
            "Failed to load factor comparison data. Please try again.",
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
        <XAxis dataKey="factor" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="score" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}
