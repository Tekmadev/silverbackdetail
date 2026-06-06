import { ScrollDrivenHero } from "@/components/hero/ScrollDrivenHero";
import { StatsCounter } from "@/components/sections/StatsCounter";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { WhyUs } from "@/components/sections/WhyUs";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { BeforeAfterShowcase } from "@/components/sections/BeforeAfterShowcase";
import { TestimonialMarquee } from "@/components/sections/TestimonialMarquee";
import { ServiceAreaSection } from "@/components/sections/ServiceAreaSection";
import { CallToAction } from "@/components/shared/CallToAction";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLocalBusinessSchema } from "@/lib/seo/schema";

export default function HomePage() {
  return (
    <>
      <JsonLd id="local-business-schema" data={getLocalBusinessSchema()} />
      <ScrollDrivenHero />
      <StatsCounter />
      <ServicesGrid />
      <WhyUs />
      <ProcessSection />
      <BeforeAfterShowcase />
      <TestimonialMarquee />
      <ServiceAreaSection />
      <CallToAction />
    </>
  );
}
