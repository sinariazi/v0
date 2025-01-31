"use client";

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
  User,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function AdminDashboardClient() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("adminDashboard.title")}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <DashboardCard
          title={t("adminDashboard.userManagement.title")}
          description={t("adminDashboard.userManagement.description")}
          icon={Users}
          href="/admin/users"
        />
        <DashboardCard
          title={t("adminDashboard.surveys.title")}
          description={t("adminDashboard.surveys.description")}
          icon={ClipboardList}
          href="/admin/surveys"
        />
        <DashboardCard
          title={t("adminDashboard.insights.title")}
          description={t("adminDashboard.insights.description")}
          icon={BarChart}
          href="/admin/insights"
        />
        <DashboardCard
          title={t("adminDashboard.billing.title")}
          description={t("adminDashboard.billing.description")}
          icon={CreditCard}
          href="/admin/billing"
        />
        <DashboardCard
          title={t("adminDashboard.surveyResults.title")}
          description={t("adminDashboard.surveyResults.description")}
          icon={FileText}
          href="/admin/survey-results"
        />
        <DashboardCard
          title={t("adminDashboard.subscription.title")}
          description={t("adminDashboard.subscription.description")}
          icon={Zap}
          href="/subscription"
        />
        <DashboardCard
          title={t("adminDashboard.userArea.title")}
          description={t("adminDashboard.userArea.description")}
          icon={User}
          href="/user/profile"
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
  const { t } = useLanguage();

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
          <Link href={href}>{`${t("adminDashboard.goTo")} ${title}`}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
