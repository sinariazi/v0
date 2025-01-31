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
  Cell,
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

const COLORS = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE", "#8884D8"];

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

        // Ensure we have data for all scores from 1 to 5
        const fullData = [1, 2, 3, 4, 5].map((score) => {
          const found = result.find(
            (item: ResponseCount) => item.score === score
          );
          return found || { score, count: 0 };
        });

        setData(fullData);
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border border-border rounded shadow-lg">
          <p className="font-bold">{`Score: ${label}`}</p>
          <p>{`Count: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="score" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
