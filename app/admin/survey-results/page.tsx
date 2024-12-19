import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SurveyResultsPage() {
  const { default: prisma } = await import('@/lib/prisma')
  
  const surveys = await prisma.survey.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Survey Results</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {surveys.map((survey) => (
          <Card key={survey.id}>
            <CardHeader>
              <CardTitle>Survey {survey.id}</CardTitle>
              <CardDescription>Organization ID: {survey.organizationId}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Question 1 Score: {survey.question1Score}</p>
              <p>Question 2 Score: {survey.question2Score}</p>
              <p>Question 3 Score: {survey.question3Score}</p>
              <p className="font-bold mt-2">Engagement Score: {survey.engagementScore.toFixed(2)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

