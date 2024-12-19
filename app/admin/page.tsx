import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="flex flex-col min-h-[200px]">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage your users and their permissions</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end pt-4">
            <Button asChild className="w-full mt-auto">
              <Link href="/admin/users">Go to User Management</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="flex flex-col min-h-[200px]">
          <CardHeader>
            <CardTitle>Surveys</CardTitle>
            <CardDescription>Create and manage employee surveys</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end pt-4">
            <Button asChild className="w-full mt-auto">
              <Link href="/admin/surveys">Go to Surveys</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="flex flex-col min-h-[200px]">
          <CardHeader>
            <CardTitle>Insights</CardTitle>
            <CardDescription>View and analyze employee engagement data</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end pt-4">
            <Button asChild className="w-full mt-auto">
              <Link href="/admin/insights">Go to Insights</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="flex flex-col min-h-[200px]">
          <CardHeader>
            <CardTitle>Billing</CardTitle>
            <CardDescription>Manage your subscription and billing information</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end pt-4">
            <Button asChild className="w-full mt-auto">
              <Link href="/admin/billing">Go to Billing</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="flex flex-col min-h-[200px]">
          <CardHeader>
            <CardTitle>Survey Results</CardTitle>
            <CardDescription>View and analyze survey responses</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end pt-4">
            <Button asChild className="w-full mt-auto">
              <Link href="/admin/survey-results">View Survey Results</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

