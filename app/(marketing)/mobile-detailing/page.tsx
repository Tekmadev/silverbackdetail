import type { Metadata } from "next";
import Link from "next/link";
import { Truck, Droplets, Zap, CalendarCheck, MapPin, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { CallToAction } from "@/components/shared/CallToAction";
import { FadeUp, FadeUpItem } from "@/components/animations/FadeUp";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, getServiceSchema } from "@/lib/seo/schema";
import { businessConfig } from "@/lib/config/business";
import { getServiceBySlug, formatPrice } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Mobile detailing in Hamilton",
  description:
    "Mobile car detailing across Hamilton, Burlington, Ancaster, Stoney Creek, Dundas, and Waterdown. Our self-contained unit comes to your home or workplace. Book online.",
  alternates: { canonical: "/mobile-detailing" },
};

const benefits = [
  { icon: Truck, title: "Self-contained unit", text: "We carry our own water and power. All we need is a parking spot." },
  { icon: CalendarCheck, title: "On your schedule", text: "Detailing at home or the office, with flexible time slots." },
  { icon: Droplets, title: "Same premium products", text: "The exact products and process we use in the studio." },
  { icon: Zap, title: "No disruption", text: "Carry on with your day while we transform your vehicle outside." },
];

export default function MobileDetailingPage() {
  const service = getServiceBySlug("mobile-detailing")!;
  return (
    <>
      <JsonLd id="mobile-service-schema" data={getServiceSchema(service)} />
      <JsonLd
        id="mobile-breadcrumb"
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Mobile Detailing", path: "/mobile-detailing" },
        ])}
      />

      <PageHeader
        eyebrow="We come to you"
        title="Mobile detailing, delivered to your driveway"
        description={`${service.longDescription} Starting at ${formatPrice(service.priceFrom, service.currency)}.`}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Mobile Detailing", path: "/mobile-detailing" },
        ]}
      >
        <Button asChild size="lg">
          <Link href="/book?service=mobile-detailing">
            Book mobile service
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </PageHeader>

      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading eyebrow="Why mobile" title="The studio experience, at your address" />
          <FadeUp stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <FadeUpItem key={b.title}>
                <div className="flex h-full flex-col gap-4 rounded-xl border border-line bg-ink-3 p-7">
                  <span className="flex size-11 items-center justify-center rounded-lg border border-line bg-ink text-silver">
                    <b.icon className="size-5" />
                  </span>
                  <h3 className="font-display text-lg font-semibold text-bone">{b.title}</h3>
                  <p className="text-sm leading-relaxed text-bone-muted">{b.text}</p>
                </div>
              </FadeUpItem>
            ))}
          </FadeUp>
        </Container>
      </section>

      <section className="border-y border-line bg-ink-2 py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="Coverage"
            title="Where we travel"
            description="Mobile detailing is available across the following areas. Outside this list? Get in touch and we will do our best."
          />
          <div className="mt-10 flex flex-wrap gap-3">
            {businessConfig.serviceAreas.map((a) => (
              <Link
                key={a.slug}
                href={`/service-areas/${a.slug}`}
                className="flex items-center gap-2 rounded-full border border-line bg-ink-3 px-4 py-2 text-sm text-bone transition-colors hover:border-line-strong"
              >
                <MapPin className={`size-4 ${a.primary ? "text-accent" : "text-silver"}`} />
                {a.name}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CallToAction
        eyebrow="Mobile detailing"
        title="Ready when you are"
        description="Pick a time, share your address, and we will bring the detail to you."
      />
    </>
  );
}
