import dynamic from "next/dynamic";
import { StatsCounter } from "@/components/sections/StatsCounter";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { WhyUs } from "@/components/sections/WhyUs";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { BeforeAfterShowcase } from "@/components/sections/BeforeAfterShowcase";
import { TestimonialMarquee } from "@/components/sections/TestimonialMarquee";
import { ServiceAreaSection } from "@/components/sections/ServiceAreaSection";
import { CallToAction } from "@/components/shared/CallToAction";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLocalBusinessSchema, getHowToSchema, getVideoObjectSchema, getReviewsSchema } from "@/lib/seo/schema";
import { processSteps, testimonials } from "@/lib/data/content";

// Split GSAP + ScrollTrigger into a separate JS chunk so they don't block the
// initial page load. The server still renders the static hero HTML (ssr: true
// is the default), so FCP is unaffected.
const ScrollDrivenHero = dynamic(() =>
  import("@/components/hero/ScrollDrivenHero").then((m) => ({ default: m.ScrollDrivenHero }))
);

export default function HomePage() {
  return (
    <>
      <JsonLd id="local-business-schema" data={getLocalBusinessSchema()} />
      <JsonLd id="how-to-schema" data={getHowToSchema(processSteps)} />
      <JsonLd id="video-object-schema" data={getVideoObjectSchema()} />
      <JsonLd id="reviews-schema" data={getReviewsSchema(testimonials)} />
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
