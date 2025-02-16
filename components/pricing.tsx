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
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/lib/language-context";
import { Check } from "lucide-react";
import { useState } from "react";

export default function Pricing() {
  const { t } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);

  const plans: {
    name: string;
    description: string;
    price: string;
    features: string[];
    buttonText: string;
  }[] = [
    {
      name: t("pricing.plans.freeTrial.name"),
      description: t("pricing.plans.freeTrial.description"),
      price: t("pricing.plans.freeTrial.price"),
      features: t("pricing.plans.freeTrial.features").split("|"),
      buttonText: t("pricing.startFreeTrial"),
    },
    {
      name: t("pricing.plans.essential.name"),
      description: t("pricing.plans.essential.description"),
      price: isYearly ? "€51" : "€5",
      features: t("pricing.plans.essential.features").split("|"),
      buttonText: t("pricing.getStarted"),
    },
    {
      name: t("pricing.plans.professional.name"),
      description: t("pricing.plans.professional.description"),
      price: isYearly ? "€122" : "€12",
      features: t("pricing.plans.professional.features").split("|"),
      buttonText: t("pricing.getStarted"),
    },
    {
      name: t("pricing.plans.enterprise.name"),
      description: t("pricing.plans.enterprise.description"),
      price: t("pricing.customPricing"),
      features: t("pricing.plans.enterprise.features").split("|"),
      buttonText: t("pricing.contactUs"),
    },
  ];

  const addOns = [
    {
      name: t("pricing.addOns.analytics.name"),
      price: isYearly ? "€30.60" : "€3",
      description: t("pricing.addOns.analytics.description"),
    },
    {
      name: t("pricing.addOns.managerTraining.name"),
      price: isYearly ? "€51" : "€5",
      description: t("pricing.addOns.managerTraining.description"),
    },
  ];

  return (
    <section id="pricing" className="py-24 px-4 bg-muted scroll-mt-16">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("pricing.title")}
        </h2>
        <div className="flex justify-center items-center mb-8">
          <span className="mr-2">{t("pricing.monthlyToggle")}</span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span className="ml-2">{t("pricing.yearlyToggle")}</span>
          {isYearly && (
            <span className="ml-4 bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm">
              {t("pricing.yearlyDiscount")}
            </span>
          )}
        </div>
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
                  {plan.price !== t("pricing.customPricing") && (
                    <span className="text-xl font-normal text-muted-foreground">
                      {isYearly
                        ? `/${t("pricing.perUser")}/${t(
                            "pricing.yearlyToggle"
                          )}`
                        : `/${t("pricing.perUser")}/${t(
                            "pricing.monthlyToggle"
                          )}`}
                    </span>
                  )}
                </p>
                <ul className="space-y-2">
                  {plan.features.map(
                    (feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="h-5 w-5 text-primary mr-2" />
                        <span>{feature}</span>
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">{plan.buttonText}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">
            {t("pricing.addOns.title")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {addOns.map((addOn, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{addOn.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold mb-2">
                    {addOn.price}
                    <span className="text-lg font-normal text-muted-foreground">
                      {isYearly
                        ? `/${t("pricing.perUser")}/${t(
                            "pricing.yearlyToggle"
                          )}`
                        : `/${t("pricing.perUser")}/${t(
                            "pricing.monthlyToggle"
                          )}`}
                    </span>
                  </p>
                  <p>{addOn.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            {t("pricing.note.freeTrialDuration")}
          </p>
          <p className="text-muted-foreground">
            {t("pricing.note.customPricing")}
          </p>
        </div>
      </div>
    </section>
  );
}
