"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/lib/language-context";
import { Check } from "lucide-react";

export default function Pricing() {
  const { t } = useLanguage();

  const plans = [
    {
      name: t("pricing.plans.freeTrial.name"),
      price: t("pricing.plans.freeTrial.price"),
      description: t("pricing.plans.freeTrial.description"),
      features: [
        t("pricing.plans.freeTrial.features.duration"),
        t("pricing.plans.freeTrial.features.employees"),
        t("pricing.plans.freeTrial.features.basicFeatures"),
        t("pricing.plans.freeTrial.features.emailSupport"),
      ],
    },
    {
      name: t("pricing.plans.starter.name"),
      price: "€99",
      description: t("pricing.plans.starter.description"),
      features: [
        t("pricing.plans.starter.features.employees"),
        t("pricing.plans.starter.features.moodTracking"),
        t("pricing.plans.starter.features.weeklyReports"),
        t("pricing.plans.starter.features.emailSupport"),
      ],
    },
    {
      name: t("pricing.plans.pro.name"),
      price: "€299",
      description: t("pricing.plans.pro.description"),
      features: [
        t("pricing.plans.pro.features.employees"),
        t("pricing.plans.pro.features.advancedAnalytics"),
        t("pricing.plans.pro.features.dailyReports"),
        t("pricing.plans.pro.features.collaborationTools"),
        t("pricing.plans.pro.features.prioritySupport"),
      ],
    },
    {
      name: t("pricing.plans.enterprise.name"),
      price: t("pricing.plans.enterprise.price"),
      description: t("pricing.plans.enterprise.description"),
      features: [
        t("pricing.plans.enterprise.features.employees"),
        t("pricing.plans.enterprise.features.customIntegrations"),
        t("pricing.plans.enterprise.features.accountManager"),
        t("pricing.plans.enterprise.features.phoneSupport"),
        t("pricing.plans.enterprise.features.onSiteTraining"),
      ],
    },
  ];

  return (
    <section id="pricing" className="py-24 px-4 bg-muted scroll-mt-16">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("pricing.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-4xl font-bold mb-4">
                  {plan.price}
                  <span className="text-xl font-normal text-muted-foreground">
                    {plan.price !== t("pricing.plans.freeTrial.price") &&
                    plan.price !== t("pricing.plans.enterprise.price")
                      ? t("pricing.perMonth")
                      : ""}
                  </span>
                </p>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  {plan.name === t("pricing.plans.freeTrial.name")
                    ? t("pricing.startFreeTrial")
                    : t("pricing.getStarted")}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
