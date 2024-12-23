"use client"

import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Link from 'next/link'

const generateData = () => {
  const data = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    data.push({
      name: new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date),
      happiness: Math.floor(Math.random() * (90 - 60 + 1) + 60),
      engagement: Math.floor(Math.random() * (90 - 60 + 1) + 60),
    })
  }
  return data
}

const data = generateData()

export default function Hero() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            Data-Driven Employee Engagement with Mood Whisper
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Harness the power of real-time analytics to boost workplace happiness and productivity.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/start-free-trial">Start Free Trial</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/schedule-demo">Schedule Demo</Link>
            </Button>
          </div>
        </div>
        <div className="lg:w-1/2 h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="happiness" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}

