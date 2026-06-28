import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { Button } from "@/components/ui/button";
import { CallToAction } from "@/components/shared/CallToAction";
import { FadeUp } from "@/components/animations/FadeUp";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getLocalBusinessSchema } from "@/lib/seo/schema";
import { businessConfig } from "@/lib/config/business";
import { getServiceAreaBySlug } from "@/lib/config/site";

export function generateStaticParams() {
  return businessConfig.serviceAreas.map((a) => ({ city: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const area = getServiceAreaBySlug(city);
  if (!area) return {};
  return {
    title: `Car detailing in ${area.name}`,
    description: `Premium car detailing, paint correction, and ceramic coating in ${area.name}, Ontario. In-shop and mobile service from Silverback Detailing. Book online.`,
    alternates: { canonical: `/service-areas/${area.slug}` },
  };
}

export default async function ServiceAreaPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const area = getServiceAreaBySlug(city);
  if (!area) notFound();

  const others = businessConfig.serviceAreas.filter((a) => a.slug !== area.slug);

  return (
    <>
      <JsonLd id={`area-${area.slug}-business`} data={getLocalBusinessSchema()} />
      <JsonLd
        id={`area-${area.slug}-breadcrumb`}
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Service Areas", path: "/service-areas" },
          { name: area.name, path: `/service-areas/${area.slug}` },
        ])}
      />

      <PageHeader
        eyebrow="Service area"
        title={`Car detailing in ${area.name}, Ontario`}
        description={`Silverback Detailing serves ${area.name} with showroom-grade detailing, paint correction, and ceramic coating. Choose in-shop service at our Hamilton studio, or mobile detailing brought directly to you in ${area.name}.`}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: area.name, path: `/service-areas/${area.slug}` },
        ]}
      >
        <Button asChild size="lg">
          <Link href="/book">
            Book in {area.name}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </PageHeader>

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="prose-sb">
              <h2>Why {area.name} drivers choose Silverback</h2>
              <p>
                Whether you commute daily or keep a weekend showpiece, {area.name} roads are hard on paint and
                interiors. We bring a disciplined, methodical process that protects your vehicle and keeps it looking its
                best for the long run.
              </p>
              <ul>
                <li>Mobile detailing available across {area.name}</li>
                <li>Professional-grade products and a proven, methodical process</li>
                <li>Refundable deposits on paint correction and ceramic coating</li>
                <li>Transparent starting prices with a clear scope</li>
              </ul>
            </div>
            <div className="rounded-xl border border-line bg-ink-3 p-7">
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-bone">
                <MapPin className="size-5 text-accent" /> Serving {area.name}
              </h2>
              <p className="mt-3 text-sm text-bone-muted">
                In-shop at our {businessConfig.address.city} studio and mobile across {area.name}. Typical lead time is{" "}
                {businessConfig.booking.minLeadTimeHours} hours.
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                {["Exterior & interior detailing", "Multi-stage paint correction", "2 to 9 year ceramic coatings", "Self-contained mobile unit"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-2 text-bone">
                      <Check className="size-4 text-success" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-16 md:py-24">
        <Container>
          <SectionHeading eyebrow="Popular near you" title={`Detailing services in ${area.name}`} />
          <FadeUp className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {businessConfig.services
              .filter((s) => s.featured)
              .map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
          </FadeUp>

          <div className="mt-12">
            <p className="eyebrow mb-4">We also serve</p>
            <div className="flex flex-wrap gap-3">
              {others.map((a) => (
                <Link
                  key={a.slug}
                  href={`/service-areas/${a.slug}`}
                  className="rounded-full border border-line bg-ink-3 px-4 py-2 text-sm text-bone-muted transition-colors hover:border-line-strong hover:text-bone"
                >
                  {a.name}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <CallToAction
        eyebrow={`Detailing in ${area.name}`}
        title={`Book your detail in ${area.name}`}
        description="Pick a time that suits you. Mobile and in-shop options available."
      />
    </>
  );
}
