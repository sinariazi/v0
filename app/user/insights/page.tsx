"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangeSelector } from "@/components/DateRangeSelector";
import { EngagementOverTime } from "@/components/charts/EngagementOverTime";
import { FactorComparison } from "@/components/charts/FactorComparison";
import { TopFactors } from "@/components/charts/TopFactors";
import { ResponseDistribution } from "@/components/charts/ResponseDistribution";
import { useAuth } from "@/lib/auth-context";

export default function UserInsightsPage() {
  const [dateRange, setDateRange] = useState("30");
  const [shouldFetchData, setShouldFetchData] = useState(true);
  const { getAuthToken } = useAuth();

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
