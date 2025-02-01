import { getCurrentUserServer } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import SurveyResultsClient from "./SurveyResultsClient";

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

    return <SurveyResultsClient surveys={surveys} />;
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
