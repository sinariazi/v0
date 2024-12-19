"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const predictionData = [
  { month: 'Jan', actual: 72, predicted: 70 },
  { month: 'Feb', actual: 75, predicted: 74 },
  { month: 'Mar', actual: 78, predicted: 77 },
  { month: 'Apr', actual: 74, predicted: 76 },
  { month: 'May', actual: 80, predicted: 79 },
  { month: 'Jun', actual: 82, predicted: 81 },
  { month: 'Jul', actual: 79, predicted: 80 },
  { month: 'Aug', actual: 84, predicted: 83 },
  { month: 'Sep', actual: 85, predicted: 85 },
  { month: 'Oct', actual: null, predicted: 86 },
  { month: 'Nov', actual: null, predicted: 87 },
  { month: 'Dec', actual: null, predicted: 88 },
]

export default function PredictionModels() {
  const features = [
    "Utilizes advanced machine learning algorithms",
    "Analyzes historical engagement data",
    "Considers various factors such as team dynamics, workload, and company events",
    "Continuously learns and improves predictions over time",
    "Provides actionable insights to improve employee engagement"
  ]

  return (
    <section className="py-24 px-4">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Predictive Analytics for Employee Engagement</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Prediction Model</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#3b82f6" name="Actual Engagement" strokeWidth={2} />
                    <Line type="monotone" dataKey="predicted" stroke="#10b981" name="Predicted Engagement" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>How Our Prediction Model Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                {Array.isArray(features) ? features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                )) : (
                  <li>No features available</li>
                )}
              </ul>
              <p className="mt-4">
                Our prediction model helps you anticipate engagement trends, allowing you to take proactive measures to maintain high employee satisfaction and productivity.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

