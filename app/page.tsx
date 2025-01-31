import Hero from "@/components/hero";
import DataInsights from "@/components/data-insights";
import PredictionModels from "@/components/prediction-models";
import Testimonials from "@/components/testimonials";
import Pricing from "@/components/pricing";
import CTA from "@/components/cta";
import HowItWorks from "@/components/how-it-works";
import FeaturesSection from "@/components/FeaturesSection";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <DataInsights />
      <PredictionModels />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTA />
    </>
  );
}
