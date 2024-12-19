import { Button } from "@/components/ui/button"
import Link from "next/link"

const steps = [
  {
    title: 'Sign Up',
    description: 'Create your Mood Whisper account and set up your organization profile.',
  },
  {
    title: 'Invite Team',
    description: 'Invite your employees to join the platform and start sharing their moods.',
  },
  {
    title: 'Track & Analyze',
    description: 'Monitor real-time mood data and analyze trends to improve workplace satisfaction.',
  },
  {
    title: 'Take Action',
    description: 'Implement changes based on insights to boost employee engagement and productivity.',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-8">How Mood Whisper Works</h1>
      <p className="text-xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Discover how Mood Whisper can transform your workplace with our simple, effective process.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {steps.map((step, index) => (
          <div key={step.title} className="flex flex-col items-center text-center">
            <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
              {index + 1}
            </div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-6">
          Join thousands of companies already benefiting from Mood Whisper's insights.
        </p>
        <Button asChild>
          <Link href="#pricing">Start Your Free Trial</Link>
        </Button>
      </div>
    </div>
  )
}

