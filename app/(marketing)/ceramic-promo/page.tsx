import type { Metadata } from "next";
import { Phone, Sparkles, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GhlFormEmbed } from "@/components/promo/GhlFormEmbed";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Magnetic } from "@/components/animations/Magnetic";
import { FadeUp, FadeUpItem } from "@/components/animations/FadeUp";
import { InstagramIcon } from "@/components/shared/SocialIcons";
import { ceramicPromo, promoSavings } from "@/lib/config/promos";
import { formatPhoneForLink, getInstagramDmLink, formatPrice } from "@/lib/config/site";

/**
 * Paid-ad landing page for the 5-year ceramic coating campaign.
 *
 * Deliberately noindex: the promotional price here is lower than the standing
 * ceramic price in business.ts, so letting Google index both would put two
 * different prices for the same service in the search results and compete with
 * /services/ceramic-coating. Ad traffic arrives by direct link and does not
 * need the page indexed.
 */
export const metadata: Metadata = {
  title: "5-Year Ceramic Coating Promo",
  description:
    "Limited-time pricing on our Ultimate 5-Year Ceramic Coating package, including multi-stage paint correction. Hamilton, Ontario.",
  robots: { index: false, follow: false },
};

const ICONS = { sparkles: Sparkles, shield: ShieldCheck, truck: Truck } as const;

export default function CeramicPromoPage() {
  const { phoneDisplay, phone, regularPrice, promoPrice, currency, includes, form } = ceramicPromo;

  return (
    <>
      <PageHeader
        eyebrow="Limited time"
        title="Stop waxing your car."
        description="Wax washes off. It melts in the sun. It does nothing to protect your clear coat from micro-scratches. A ceramic coating bonds to the paint and holds a wet-glass finish for years, not weeks."
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <span className="font-display text-4xl font-semibold text-bone sm:text-5xl">
              From {formatPrice(promoPrice, currency)}
            </span>
            <span className="text-lg text-bone-muted line-through">{formatPrice(regularPrice, currency)}</span>
            <Badge variant="outline" className="border-accent/40 text-accent">
              Save {formatPrice(promoSavings, currency)}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <Button asChild size="lg">
                <a href="#claim">
                  Claim this offer
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </Magnetic>
            <Button asChild size="lg" variant="secondary">
              <a href={formatPhoneForLink(phone)}>
                <Phone className="size-4" />
                Call or text {phoneDisplay}
              </a>
            </Button>
          </div>
        </div>
      </PageHeader>

      <section className="py-16 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="What's included"
            title="A permanent finish, not a weekend one"
            description="Every package in this promo covers correction first, then protection. We do not coat over defects."
          />
          <FadeUp stagger className="mt-12 grid gap-6 md:grid-cols-3">
            {includes.map((item) => {
              const Icon = ICONS[item.icon];
              return (
                <FadeUpItem key={item.title}>
                  <div className="flex h-full flex-col gap-4 rounded-xl border border-line bg-ink-3 p-7">
                    <span className="flex size-11 items-center justify-center rounded-lg border border-line bg-ink text-silver">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="font-display text-lg font-semibold text-bone">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-bone-muted">{item.description}</p>
                  </div>
                </FadeUpItem>
              );
            })}
          </FadeUp>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-bone-muted">
            Because of the precision this level of correction takes, we limit how many of these we book at a time.
            Final pricing depends on your vehicle&apos;s size and paint condition, and is confirmed before any work
            begins.
          </p>
        </Container>
      </section>

      <section id="claim" className="scroll-mt-28 border-y border-line bg-ink-2 py-16 md:py-24">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Secure your spot"
            title="Claim the promo"
            description="Fill this in and we will get back to you with your exact quote and the next open slot."
          />
          <FadeUp className="mx-auto mt-10 max-w-xl">
            <div className="overflow-hidden rounded-xl border border-line bg-ink-3 p-4 sm:p-6">
              <GhlFormEmbed
                formId={form.id}
                formName={form.name}
                origin={form.origin}
                width={form.width}
              />
            </div>
          </FadeUp>
        </Container>
      </section>

      <section className="relative overflow-hidden py-20 md:py-28">
        <div aria-hidden className="grain absolute inset-0" />
        <div
          aria-hidden
          className="absolute left-1/2 top-0 -z-0 size-[60vw] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]"
        />
        <Container className="relative z-10 flex flex-col items-center gap-7 text-center">
          <SectionHeading
            align="center"
            eyebrow="Prefer to talk?"
            title="Call, text, or send us a DM"
            description="Spots are limited and this is the lowest starting price we have offered. Reach out and we will hold one for you."
          />
          <FadeUp stagger className="flex flex-col items-center gap-6">
            <FadeUpItem className="flex flex-wrap items-center justify-center gap-3">
              <Magnetic>
                <Button asChild size="lg">
                  <a href={formatPhoneForLink(phone)}>
                    <Phone className="size-4" />
                    Call or text {phoneDisplay}
                  </a>
                </Button>
              </Magnetic>
              <Button asChild size="lg" variant="secondary">
                <a href={getInstagramDmLink()} target="_blank" rel="noopener noreferrer">
                  <InstagramIcon className="size-4" />
                  DM on Instagram
                </a>
              </Button>
            </FadeUpItem>
          </FadeUp>
        </Container>
      </section>
    </>
  );
}
