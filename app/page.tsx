import Hero from '@/components/hero'
import DataInsights from '@/components/data-insights'
import PredictionModels from '@/components/prediction-models'
import Testimonials from '@/components/testimonials'
import Pricing from '@/components/pricing'
import CTA from '@/components/cta'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import HowItWorks from '@/components/how-it-works'

export default function Home() {
  return (
    <>
      <Hero />
      <section className="py-24 px-4 bg-muted">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Powerful Features for Employee Engagement</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover the comprehensive tools and capabilities that make Mood Whisper the leading employee engagement platform.
          </p>
          <Button asChild>
            <Link href="/features">Explore Our Features</Link>
          </Button>
        </div>
      </section>
      <DataInsights />
      <PredictionModels />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTA />
    </>
  )
}

