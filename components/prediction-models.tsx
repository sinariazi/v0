"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useLanguage } from "@/lib/language-context";

const predictionData = [
  { month: "Jan", actual: 72, predicted: 70 },
  { month: "Feb", actual: 75, predicted: 74 },
  { month: "Mar", actual: 78, predicted: 77 },
  { month: "Apr", actual: 74, predicted: 76 },
  { month: "May", actual: 80, predicted: 79 },
  { month: "Jun", actual: 82, predicted: 81 },
  { month: "Jul", actual: 79, predicted: 80 },
  { month: "Aug", actual: 84, predicted: 83 },
  { month: "Sep", actual: 85, predicted: 85 },
  { month: "Oct", actual: null, predicted: 86 },
  { month: "Nov", actual: null, predicted: 87 },
  { month: "Dec", actual: null, predicted: 88 },
];

export default function PredictionModels() {
  const { t } = useLanguage();

  const features = [
    t("predictionModels.features.feature1"),
    t("predictionModels.features.feature2"),
    t("predictionModels.features.feature3"),
    t("predictionModels.features.feature4"),
    t("predictionModels.features.feature5"),
  ];

  return (
    <section className="py-24 px-4">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("predictionModels.title")}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>{t("predictionModels.chart.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#3b82f6"
                      name={t("predictionModels.chart.actualEngagement")}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#10b981"
                      name={t("predictionModels.chart.predictedEngagement")}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("predictionModels.howItWorks.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                {Array.isArray(features) ? (
                  features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))
                ) : (
                  <li>{t("predictionModels.noFeaturesAvailable")}</li>
                )}
              </ul>
              <p className="mt-4">
                {t("predictionModels.howItWorks.description")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
