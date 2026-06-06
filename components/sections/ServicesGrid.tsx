import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { FadeUp, FadeUpItem } from "@/components/animations/FadeUp";
import { businessConfig } from "@/lib/config/business";

export function ServicesGrid() {
  return (
    <section id="services" className="relative py-24 md:py-32">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="What we do"
            title="Detailing, refined to a craft"
            description="From a protective hand wash to multi-day ceramic coatings, every service is built around one idea: a finish that holds up to scrutiny."
          />
          <Link
            href="/services"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-silver transition-colors hover:text-bone"
          >
            All services
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <FadeUp stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {businessConfig.services.map((service) => (
            <FadeUpItem key={service.slug}>
              <ServiceCard service={service} className="h-full" />
            </FadeUpItem>
          ))}
        </FadeUp>
      </Container>
    </section>
  );
}
