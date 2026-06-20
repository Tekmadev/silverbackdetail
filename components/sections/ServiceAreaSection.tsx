import Link from "next/link";
import { MapPin } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FadeUp, FadeUpItem } from "@/components/animations/FadeUp";
import { businessConfig } from "@/lib/config/business";

export function ServiceAreaSection() {
  const { serviceAreas, address } = businessConfig;
  return (
    <section id="service-area" className="relative py-24 md:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Coverage"
            title="Serving Hamilton and beyond"
            description={`In-shop at our ${address.city} studio, and mobile across the surrounding region. Wherever you are, the same standard travels with us.`}
          />

          <FadeUp stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {serviceAreas.map((area) => (
              <FadeUpItem key={area.slug}>
                <Link
                  href={`/service-areas/${area.slug}`}
                  className="group flex items-center gap-2.5 rounded-lg border border-line bg-ink-3 px-4 py-3.5 text-sm font-medium text-bone transition-colors hover:border-line-strong hover:bg-ink-2"
                >
                  <MapPin className={`size-4 ${area.primary ? "text-accent" : "text-silver"}`} />
                  <span>{area.name}</span>
                </Link>
              </FadeUpItem>
            ))}
          </FadeUp>
        </div>
      </Container>
    </section>
  );
}
