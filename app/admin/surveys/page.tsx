import { getCurrentUserServer } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { SurveysClient } from "./SurveysClient";

export default async function SurveysPage() {
  const user = await getCurrentUserServer();

  if (!user || !user.attributes?.email) {
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

    // Transform the surveys data to match the expected Survey interface
    const transformedSurveys = surveys.map((survey) => ({
      id: survey.id,
      createdAt: survey.createdAt.toISOString(),
      responses: survey.responses.map((response) => ({
        question: response.factor,
        answer: response.score,
      })),
      additionalFeedback: survey.additionalFeedback || undefined,
      organization: {
        id: survey.organization.id,
        name: survey.organization.name,
      },
    }));

    return <SurveysClient initialSurveys={transformedSurveys} />;
  } catch (error) {
    console.error("Error fetching surveys:", error);
    notFound();
  }
}
