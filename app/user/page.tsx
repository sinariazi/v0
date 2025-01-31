import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AverageEngagementScores } from "@/components/AverageEngagementScores";
import { SurveyForm } from "@/components/SurveyForm";

export default function UserDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your recent activity will be displayed here.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Surveys</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your upcoming surveys will be listed here.</p>
          </CardContent>
        </Card>
      </div>

      <AverageEngagementScores />

      <Card>
        <CardHeader>
          <CardTitle>Current Survey</CardTitle>
        </CardHeader>
        <CardContent>
          <SurveyForm />
        </CardContent>
      </Card>
    </div>
  );
}
