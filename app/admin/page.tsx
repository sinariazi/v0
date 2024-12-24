import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Users,
  ClipboardList,
  BarChart,
  FileText,
  Zap,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <DashboardCard
          title="User Management"
          description="Manage your users and their permissions"
          icon={Users}
          href="/admin/users"
        />
        <DashboardCard
          title="Surveys"
          description="Create and manage employee surveys"
          icon={ClipboardList}
          href="/admin/surveys"
        />
        <DashboardCard
          title="Insights"
          description="View and analyze employee engagement data"
          icon={BarChart}
          href="/admin/insights"
        />
        <DashboardCard
          title="Billing"
          description="Manage your subscription and billing information"
          icon={CreditCard}
          href="/admin/billing"
        />
        <DashboardCard
          title="Survey Results"
          description="View and analyze survey responses"
          icon={FileText}
          href="/admin/survey-results"
        />
        <DashboardCard
          title="Subscription"
          description="Manage your subscription plan"
          icon={Zap}
          href="/admin/subscription"
        />
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  icon: Icon,
  href,
}: {
  title: string;
  description: string;
  icon: any;
  href: string;
}) {
  return (
    <Card className="flex flex-col min-h-[200px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-6 w-6" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-end pt-4">
        <Button asChild className="w-full mt-auto">
          <Link href={href}>Go to {title}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
