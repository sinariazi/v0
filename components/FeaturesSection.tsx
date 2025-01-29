"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

export default function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-4 bg-muted">
      <div className="container text-center">
        <h2 className="text-3xl font-bold mb-4">
          {t("home.featuresSection.title")}
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t("home.featuresSection.description")}
        </p>
        <Button asChild>
          <Link href="/features">
            {t("home.featuresSection.exploreButton")}
          </Link>
        </Button>
      </div>
    </section>
  );
}
