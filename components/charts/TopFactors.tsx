"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
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
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="score"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
