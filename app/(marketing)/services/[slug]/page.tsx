import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, X, Clock, Tag, ShieldCheck, ArrowRight, Car } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { CallToAction } from "@/components/shared/CallToAction";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { FadeUp } from "@/components/animations/FadeUp";
import { JsonLd } from "@/components/seo/JsonLd";
import { getServiceSchema, getBreadcrumbSchema, getFaqSchema, getServiceHowToSchema } from "@/lib/seo/schema";
import { businessConfig } from "@/lib/config/business";
import { getServiceBySlug, formatPrice } from "@/lib/config/site";
import { processSteps } from "@/lib/data/content";
import type { Faq } from "@/lib/data/content";

export function generateStaticParams() {
  return businessConfig.services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  const title = `${service.name} in ${businessConfig.address.city}`;
  return {
    title,
    description: `${service.shortDescription} ${service.longDescription}`.slice(0, 155),
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${title} | ${businessConfig.name}`,
      description: service.shortDescription,
      url: `/services/${service.slug}`,
    },
  };
}

function serviceFaqs(slug: string): Faq[] {
  const s = getServiceBySlug(slug)!;
  return [
    {
      question: `How much does ${s.name.toLowerCase()} cost in ${businessConfig.address.city}?`,
      answer: `${s.name} starts at ${formatPrice(s.priceFrom, s.currency)} ${s.currency}. The final price depends on your vehicle's size and condition.${
        s.requiresDeposit ? ` A refundable ${formatPrice(s.depositAmount, s.currency)} deposit secures your slot and is credited to your final invoice.` : ""
      }`,
    },
    {
      question: `How long does ${s.name.toLowerCase()} take?`,
      answer: `Typically ${s.duration}. We will confirm a precise timeline after a quick inspection of your vehicle.`,
    },
    {
      question: `What is included in ${s.name.toLowerCase()}?`,
      answer: `${s.includes.join(", ")}.`,
    },
  ];
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const faqs = serviceFaqs(slug);
  const related = businessConfig.services.filter((s) => s.slug !== slug).slice(0, 3);
  const gallery = service.gallery as ReadonlyArray<{ src: string; caption: string }>;

  return (
    <>
      <JsonLd id={`service-${slug}-schema`} data={getServiceSchema(service)} />
      <JsonLd id={`service-${slug}-faq`} data={getFaqSchema(faqs)} />
      <JsonLd id={`service-${slug}-howto`} data={getServiceHowToSchema(service, processSteps)} />
      <JsonLd
        id={`service-${slug}-breadcrumb`}
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${slug}` },
        ])}
      />

      <PageHeader
        eyebrow={service.category === "premium" ? "Correction & protection" : "Detailing"}
        title={service.name}
        description={service.shortDescription}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${slug}` },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline">
            <Tag className="size-3.5" /> from {formatPrice(service.priceFrom, service.currency)}
          </Badge>
          <Badge variant="outline">
            <Clock className="size-3.5" /> {service.duration}
          </Badge>
          {service.requiresDeposit && (
            <Badge variant="accent">
              <ShieldCheck className="size-3.5" /> {formatPrice(service.depositAmount, service.currency)} refundable deposit
            </Badge>
          )}
          {service.mobileAvailable && (
            <Badge variant="outline">
              <Car className="size-3.5" /> Mobile available
            </Badge>
          )}
        </div>
      </PageHeader>

      {service.image && (
        <section className="pt-10 md:pt-14">
          <Container>
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border border-line">
              <Image
                src={service.image}
                alt={`${service.name} by ${businessConfig.name}`}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
                priority
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
            </div>
          </Container>
        </section>
      )}

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
            <div className="max-w-2xl">
              {/* Direct factual lead sentence for AI extractability */}
              <p className="text-lg leading-relaxed text-bone">{service.longDescription}</p>

              <h2 className="mt-12 font-display text-2xl font-semibold text-bone">
                What is included in {service.name.toLowerCase()}?
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-bone-muted">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    {item}
                  </li>
                ))}
              </ul>

              {service.excludes.length > 0 && (
                <>
                  <h2 className="mt-12 font-display text-2xl font-semibold text-bone">What is not included</h2>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {service.excludes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-bone-muted">
                        <X className="mt-0.5 size-4 shrink-0 text-line-strong" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {gallery.length > 0 && (
                <>
                  <h2 className="mt-12 font-display text-2xl font-semibold text-bone">See it in action</h2>
                  <div className={`mt-5 grid gap-4 ${gallery.length > 1 ? "sm:grid-cols-2" : ""}`}>
                    {gallery.map((g) => (
                      <figure key={g.src}>
                        <div className="relative aspect-[3/2] overflow-hidden rounded-xl border border-line">
                          <Image
                            src={g.src}
                            alt={g.caption || `${service.name} example`}
                            fill
                            sizes="(max-width: 768px) 100vw, 640px"
                            className="object-cover"
                          />
                        </div>
                        {g.caption && (
                          <figcaption className="mt-2.5 text-sm leading-relaxed text-bone-muted">{g.caption}</figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                </>
              )}

              <h2 className="mt-12 font-display text-2xl font-semibold text-bone">Frequently asked questions</h2>
              <Accordion type="single" collapsible className="mt-4">
                {faqs.map((f, i) => (
                  <AccordionItem key={f.question} value={`item-${i}`}>
                    <AccordionTrigger>{f.question}</AccordionTrigger>
                    <AccordionContent>{f.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Sticky booking card */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-xl border border-line bg-ink-3 p-7">
                <p className="eyebrow">Book this service</p>
                <p className="mt-3 font-display text-4xl font-semibold text-bone">
                  {formatPrice(service.priceFrom, service.currency)}
                  <span className="ml-1 text-base font-normal text-bone-muted">from</span>
                </p>
                <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-bone-muted">Duration</dt>
                    <dd className="text-bone">{service.duration}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-bone-muted">Where</dt>
                    <dd className="text-bone">{service.mobileAvailable ? "In-shop or mobile" : "In-shop only"}</dd>
                  </div>
                  {service.requiresDeposit && (
                    <div className="flex justify-between">
                      <dt className="text-bone-muted">Deposit</dt>
                      <dd className="text-bone">{formatPrice(service.depositAmount, service.currency)} · refundable</dd>
                    </div>
                  )}
                </dl>
                <Button asChild size="lg" className="mt-6 w-full">
                  <Link href={`/book?service=${service.slug}`}>
                    Book now
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                {service.requiresDeposit && (
                  <p className="mt-3 text-center text-xs text-bone-muted">{businessConfig.booking.refundPolicy}</p>
                )}
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-16 md:py-24">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-bone">Explore other services</h2>
          <FadeUp className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </FadeUp>
        </Container>
      </section>

      <CallToAction />
    </>
  );
}
