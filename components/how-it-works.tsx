"use client";

import { useLanguage } from "@/lib/language-context";

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      title: t("howItWorks.step1.title"),
      description: t("howItWorks.step1.description"),
    },
    {
      title: t("howItWorks.step2.title"),
      description: t("howItWorks.step2.description"),
    },
    {
      title: t("howItWorks.step3.title"),
      description: t("howItWorks.step3.description"),
    },
    {
      title: t("howItWorks.step4.title"),
      description: t("howItWorks.step4.description"),
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 bg-muted">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">
          {t("howItWorks.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="rounded-full bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
