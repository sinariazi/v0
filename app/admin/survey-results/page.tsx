import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { getCurrentUserServer } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  }).format(date);
};

export default async function SurveyResultsPage() {
  const user = await getCurrentUserServer();

  if (!user || !user.attributes.email) {
    console.error("User not authenticated or email not found");
    redirect("/");
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { email: user.attributes.email },
      select: { organizationId: true, role: true },
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      console.error("User not found in database or not an admin");
      redirect("/");
    }

    const surveys = await prisma.survey.findMany({
      where: { organizationId: dbUser.organizationId },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        responses: true,
        organization: true,
      },
    });

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Survey Results</h1>
        {surveys.length === 0 ? (
          <p>No survey results available.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {surveys.map((survey) => (
              <Card key={survey.id}>
                <CardHeader>
                  <CardTitle>
                    Survey from {formatDate(survey.createdAt)}
                  </CardTitle>
                  <CardDescription>
                    Organization: {survey.organization.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {survey.responses.map((response, index) => (
                    <p key={index} className="mb-2">
                      <strong>{response.question}:</strong> {response.answer}
                    </p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching survey results:", error);
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Survey Results</h1>
        <p className="text-red-500">
          Error fetching survey results. Please try again later.
        </p>
      </div>
    );
  }
}
