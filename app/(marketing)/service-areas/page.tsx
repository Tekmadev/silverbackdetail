import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { CallToAction } from "@/components/shared/CallToAction";
import { FadeUp, FadeUpItem } from "@/components/animations/FadeUp";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/schema";
import { businessConfig } from "@/lib/config/business";

export const metadata: Metadata = {
  title: "Service areas",
  description:
    "Silverback Detailing serves Hamilton, Burlington, Ancaster, Stoney Creek, Dundas, and Waterdown with in-shop and mobile car detailing.",
  alternates: { canonical: "/service-areas" },
};

export default function ServiceAreasPage() {
  return (
    <>
      <JsonLd
        id="areas-breadcrumb"
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Service Areas", path: "/service-areas" },
        ])}
      />
      <PageHeader
        eyebrow="Coverage"
        title="Where we work"
        description="In-shop at our Hamilton studio and mobile across the surrounding region. Find your area below."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Service Areas", path: "/service-areas" },
        ]}
      />
      <section className="py-16 md:py-24">
        <Container>
          <FadeUp stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {businessConfig.serviceAreas.map((a) => (
              <FadeUpItem key={a.slug}>
                <Link
                  href={`/service-areas/${a.slug}`}
                  className="group flex h-full flex-col justify-between gap-6 rounded-xl border border-line bg-ink-3 p-7 transition-colors hover:border-line-strong"
                >
                  <span className="flex size-11 items-center justify-center rounded-lg border border-line bg-ink">
                    <MapPin className={`size-5 ${a.primary ? "text-accent" : "text-silver"}`} />
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-bone">{a.name}</h2>
                    <p className="mt-1 text-sm text-bone-muted">
                      Detailing, paint correction & ceramic coating{a.primary ? " · primary studio" : ""}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-silver transition-colors group-hover:text-bone">
                    Car detailing in {a.name}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </FadeUpItem>
            ))}
          </FadeUp>
        </Container>
      </section>
      <CallToAction />
    </>
  );
}
