"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { department: 'Sales', satisfaction: 85, productivity: 90 },
  { department: 'Marketing', satisfaction: 75, productivity: 80 },
  { department: 'Engineering', satisfaction: 90, productivity: 95 },
  { department: 'Customer Support', satisfaction: 70, productivity: 75 },
  { department: 'HR', satisfaction: 80, productivity: 85 },
]

export default function DataInsights() {

  return (
    <section className="py-24 px-4">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Data-Driven Insights</h2>
        <Card>
          <CardHeader>
            <CardTitle>Department Satisfaction vs Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="satisfaction" fill="#3b82f6" name="Satisfaction" />
                  <Bar dataKey="productivity" fill="#10b981" name="Productivity" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

