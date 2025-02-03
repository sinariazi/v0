"use client"

import { GenerateNewSurveyButton } from "@/components/GenerateNewSurveyButton"
import { SurveyForm } from "@/components/SurveyForm"
import { SurveyResults } from "@/components/SurveyResults"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/language-context"
import { useEffect, useState } from "react"

interface Survey {
  id: number
  createdAt: string
  responses: { question: string; answer: number }[]
  additionalFeedback?: string
  organization: {
    id: string
    name: string
  }
}

interface RawSurvey {
  id: number
  createdAt: string | Date
  responses: { question: string; answer: number }[]
  additionalFeedback?: string
  organization: {
    id: string
    name: string
  }
}

export function SurveysClient({
  initialSurveys,
}: {
  initialSurveys: Survey[]
}) {
  const { t } = useLanguage()
  const [showForm, setShowForm] = useState(false)
  const [surveys, setSurveys] = useState<Survey[]>(initialSurveys)
  const { toast } = useToast()

  useEffect(() => {
    fetchSurveys()
  }, [])

  const fetchSurveys = async () => {
    try {
      const response = await fetch("/api/surveys")
      if (response.ok) {
        const data: RawSurvey[] = await response.json()
        const formattedSurveys: Survey[] = data.map((survey) => ({
          ...survey,
          createdAt: new Date(survey.createdAt).toISOString(),
        }))
        setSurveys(formattedSurveys)
      } else {
        console.error("Failed to fetch surveys")
      }
    } catch (error) {
      console.error("Error fetching surveys:", error)
    }
  }

  const handleNewSurveyGenerated = () => {
    toast({
      title: t("survey.success.title"),
      description: t("adminDashboard.surveys.emailSent"),
    })
    fetchSurveys()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("adminDashboard.surveys.title")}</CardTitle>
        <CardDescription>{t("adminDashboard.surveys.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Button onClick={() => setShowForm(true)}>{t("adminDashboard.surveys.createNew")}</Button>
          <GenerateNewSurveyButton onSuccess={handleNewSurveyGenerated} />
        </div>
        {showForm ? (
          <SurveyForm
            onSubmit={() => {
              setShowForm(false)
              fetchSurveys()
            }}
          />
        ) : (
          <SurveyResults surveys={surveys} />
        )}
      </CardContent>
    </Card>
  )
}

