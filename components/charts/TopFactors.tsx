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

interface TopFactor {
  factor: string;
  score: number;
}

interface TopFactorsProps {
  dateRange: string;
  shouldFetch: boolean;
  onDataFetched: () => void;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function TopFactors({
  dateRange,
  shouldFetch,
  onDataFetched,
}: TopFactorsProps) {
  const [data, setData] = useState<TopFactor[]>([]);
  const { getAuthToken } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!shouldFetch) return;

      try {
        const token = await getAuthToken();
        const response = await fetch(
          `/api/insights/top-factors?range=${dateRange}`,
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
        console.error("Error fetching top factors data:", error);
        toast({
          title: "Error",
          description: "Failed to load top factors data. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [dateRange, shouldFetch, getAuthToken, toast, onDataFetched]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ left: 100 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 5]} />
        <YAxis dataKey="factor" type="category" width={100} />
        <Tooltip />
        <Bar dataKey="score" fill="#8884d8">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
