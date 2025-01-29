"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useLanguage } from "@/lib/language-context";

const data = [
  { department: "Sales", satisfaction: 85, productivity: 90 },
  { department: "Marketing", satisfaction: 75, productivity: 80 },
  { department: "Engineering", satisfaction: 90, productivity: 95 },
  { department: "Customer Support", satisfaction: 70, productivity: 75 },
  { department: "HR", satisfaction: 80, productivity: 85 },
];

export default function DataInsights() {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-4">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("dataInsights.title")}
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>{t("dataInsights.chartTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="satisfaction"
                    fill="#3b82f6"
                    name={t("dataInsights.satisfaction")}
                  />
                  <Bar
                    dataKey="productivity"
                    fill="#10b981"
                    name={t("dataInsights.productivity")}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
