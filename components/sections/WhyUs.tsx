import { Shield, Sparkles, Award, Clock, MapPin, Gauge, type LucideIcon } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FadeUp, FadeUpItem } from "@/components/animations/FadeUp";
import { whyUs, type WhyUsPoint } from "@/lib/data/content";

const ICONS: Record<WhyUsPoint["icon"], LucideIcon> = {
  shield: Shield,
  sparkles: Sparkles,
  award: Award,
  clock: Clock,
  mapPin: MapPin,
  gauge: Gauge,
};

export function WhyUs() {
  return (
    <section id="why-us" className="relative overflow-hidden border-y border-line bg-ink-2 py-24 md:py-32">
      <div aria-hidden className="grain absolute inset-0" />
      <Container className="relative z-10">
        <SectionHeading
          eyebrow="Why Silverback"
          title="The difference is in what you do not see"
          description="Anyone can make a car shine for a day. We build results that last, with process and protection most shops skip."
        />

        <FadeUp stagger className="mt-14 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((point) => {
            const Icon = ICONS[point.icon];
            return (
              <FadeUpItem key={point.title}>
                <div className="flex h-full flex-col gap-4 bg-ink-2 p-7 transition-colors hover:bg-ink-3">
                  <span className="flex size-11 items-center justify-center rounded-lg border border-line bg-ink text-silver">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="font-display text-lg font-semibold text-bone">{point.title}</h3>
                  <p className="text-sm leading-relaxed text-bone-muted">{point.description}</p>
                </div>
              </FadeUpItem>
            );
          })}
        </FadeUp>
      </Container>
    </section>
  );
}
