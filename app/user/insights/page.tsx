"use client";

import { DateRangeSelector } from "@/components/DateRangeSelector";
import { EngagementOverTime } from "@/components/charts/EngagementOverTime";
import { FactorComparison } from "@/components/charts/FactorComparison";
import { ResponseDistribution } from "@/components/charts/ResponseDistribution";
import { TopFactors } from "@/components/charts/TopFactors";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function UserInsightsPage() {
  const [dateRange, setDateRange] = useState("30");
  const [shouldFetchData, setShouldFetchData] = useState(true);

  useEffect(() => {
    setShouldFetchData(true);
  }, [dateRange]);

  const handleDateRangeChange = (newRange: string) => {
    setDateRange(newRange);
    setShouldFetchData(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your Insights</h1>

      <DateRangeSelector value={dateRange} onChange={handleDateRangeChange} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Over Time</CardTitle>
            <CardDescription>
              Average engagement score over the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EngagementOverTime
              dateRange={dateRange}
              shouldFetch={shouldFetchData}
              onDataFetched={() => setShouldFetchData(false)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Factor Comparison</CardTitle>
            <CardDescription>
              Average scores for different engagement factors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FactorComparison
              dateRange={dateRange}
              shouldFetch={shouldFetchData}
              onDataFetched={() => setShouldFetchData(false)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Factors</CardTitle>
            <CardDescription>
              Highest rated engagement factors (scale: 1-5)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TopFactors
              dateRange={dateRange}
              shouldFetch={shouldFetchData}
              onDataFetched={() => setShouldFetchData(false)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Distribution</CardTitle>
            <CardDescription>
              Distribution of responses across the rating scale (1-5)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponseDistribution
              dateRange={dateRange}
              shouldFetch={shouldFetchData}
              onDataFetched={() => setShouldFetchData(false)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
