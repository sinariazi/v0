"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

export default function CTA() {
  const { t } = useLanguage()

  return (
    <section className="py-24 px-4 bg-primary text-primary-foreground">
      <div className="container text-center">
        <h2 className="text-3xl font-bold mb-4">{t("cta.title")}</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">{t("cta.description")}</p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg" variant="secondary">
            <Link href="/start-free-trial">{t("cta.startFreeTrial")}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/schedule-demo">{t("cta.scheduleDemo")}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

