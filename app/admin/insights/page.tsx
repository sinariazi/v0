import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function InsightsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Insights</CardTitle>
        <CardDescription>
          View and analyze employee engagement data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Data visualization and insights will be displayed here.</p>
      </CardContent>
    </Card>
  );
}
