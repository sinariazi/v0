import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from '@/lib/prisma'

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short'
  }).format(date)
}

export default async function SurveyResultsPage() {
  const surveys = await prisma.survey.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: true,
      organization: true,
    },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Survey Results</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {surveys.map((survey) => (
          <Card key={survey.id}>
            <CardHeader>
              <CardTitle>Survey from {survey.user.email}</CardTitle>
              <CardDescription>Organization: {survey.organization.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Question 1 Score: {survey.question1Score}</p>
              <p>Question 2 Score: {survey.question2Score}</p>
              <p>Question 3 Score: {survey.question3Score}</p>
              <p className="font-bold mt-2">Engagement Score: {survey.engagementScore.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Created at: {formatDate(survey.createdAt)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

