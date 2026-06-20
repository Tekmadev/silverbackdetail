import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { CallToAction } from "@/components/shared/CallToAction";
import { FadeUp, FadeUpItem } from "@/components/animations/FadeUp";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema } from "@/lib/seo/schema";
import { businessConfig } from "@/lib/config/business";

export const metadata: Metadata = {
  title: "Services & pricing",
  description:
    "Exterior and interior detailing, paint correction, ceramic coating, and mobile detailing in Hamilton, Ontario. Transparent starting prices and what each service includes.",
  alternates: { canonical: "/services" },
};

const CATEGORY_TITLES: Record<string, { eyebrow: string; title: string }> = {
  standard: { eyebrow: "Everyday care", title: "Detailing packages" },
  premium: { eyebrow: "Correction & protection", title: "Premium services" },
};

export default function ServicesPage() {
  const categories: Array<keyof typeof CATEGORY_TITLES> = ["premium", "standard"];
  return (
    <>
      <JsonLd
        id="services-breadcrumb"
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <PageHeader
        eyebrow="What we do"
        title="Services built around the finish, not the clock"
        description="Honest starting prices and a clear scope for every service. Final quotes depend on your vehicle's size and condition."
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
      />

      {categories.map((cat) => {
        const services = businessConfig.services.filter((s) => s.category === cat);
        if (services.length === 0) return null;
        const meta = CATEGORY_TITLES[cat];
        return (
          <section key={cat} className="py-16 md:py-20 [&:first-of-type]:pt-20">
            <Container>
              <SectionHeading eyebrow={meta.eyebrow} title={meta.title} />
              <FadeUp stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((s) => (
                  <FadeUpItem key={s.slug}>
                    <ServiceCard service={s} className="h-full" />
                  </FadeUpItem>
                ))}
              </FadeUp>
            </Container>
          </section>
        );
      })}

      <CallToAction />
    </>
  );
}
