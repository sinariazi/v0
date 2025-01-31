import { SurveyForm } from "@/components/SurveyForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserSurveys() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Surveys</h1>
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
