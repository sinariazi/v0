"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CTA() {

  return (
    <section className="py-24 px-4 bg-primary text-primary-foreground">
      <div className="container text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Harness the Power of Data?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join the data-driven revolution in employee engagement. Start your journey towards a more productive and happier workplace with Mood Whisper today.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg" variant="secondary">
            <Link href="/start-free-trial">Start Free Trial</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/schedule-demo">Schedule Demo</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

