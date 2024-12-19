import { useState } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import prisma from '@/lib/prisma'

export default function SurveyPage() {
  const [question1, setQuestion1] = useState('')
  const [question2, setQuestion2] = useState('')
  const [question3, setQuestion3] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'placeholder-user-id', // Replace with actual user ID from authentication
          organizationId: 'placeholder-org-id', // Replace with actual organization ID
          question1Score: parseInt(question1),
          question2Score: parseInt(question2),
          question3Score: parseInt(question3),
        }),
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Survey submitted successfully! Your engagement score is: ${result.engagementScore.toFixed(2)}`)
        router.push('/') // Redirect to home page or a thank you page
      } else {
        throw new Error('Failed to submit survey')
      }
    } catch (error) {
      console.error('Error submitting survey:', error)
      alert('Failed to submit survey. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Employee Engagement Survey</CardTitle>
          <CardDescription>Please answer the following questions on a scale of 1-10</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question1">How satisfied are you with your current role?</Label>
              <Input
                id="question1"
                type="number"
                min="1"
                max="10"
                value={question1}
                onChange={(e) => setQuestion1(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="question2">How well do you feel your work is recognized?</Label>
              <Input
                id="question2"
                type="number"
                min="1"
                max="10"
                value={question2}
                onChange={(e) => setQuestion2(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="question3">How likely are you to recommend our company as a place to work?</Label>
              <Input
                id="question3"
                type="number"
                min="1"
                max="10"
                value={question3}
                onChange={(e) => setQuestion3(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Survey'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

