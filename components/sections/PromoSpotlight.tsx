import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Magnetic } from "@/components/animations/Magnetic";
import { FadeUp } from "@/components/animations/FadeUp";
import { HydrophobicPanel } from "@/components/promo/HydrophobicPanel";
import { ceramicPromoPage } from "@/lib/config/promos";
import { getFeaturedPromo, formatPrice, formatPhoneForLink } from "@/lib/config/site";

/**
 * Home page block for whatever offer is currently running.
 *
 * Renders nothing when `servicePromos` is empty, so ending a campaign removes
 * this section on its own rather than leaving a dead band on the home page.
 */
export function PromoSpotlight() {
  const featured = getFeaturedPromo();
  if (!featured) return null;

  const { promo, service, pricing } = featured;

  return (
    <section className="relative overflow-hidden border-t border-line bg-ink-2 py-20 md:py-28">
      <div aria-hidden className="grain absolute inset-0" />
      <div
        aria-hidden
        className="absolute left-[-10%] top-[-30%] -z-0 size-[45vw] rounded-full bg-accent/10 blur-[140px]"
      />
      <Container className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-16">
          <div className="min-w-0">
            <SectionHeading
              eyebrow={promo.label}
              title={promo.headline}
              description={promo.description}
            />

            <FadeUp className="mt-8 flex flex-col gap-6">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <span className="font-display text-4xl font-semibold text-bone sm:text-5xl">
                  From {formatPrice(pricing.current, pricing.currency)}
                </span>
                <span className="text-lg text-bone-muted line-through">
                  {formatPrice(pricing.regular, pricing.currency)}
                </span>
                <Badge variant="outline" className="border-accent/40 text-accent">
                  Save {formatPrice(pricing.savings, pricing.currency)}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Magnetic>
                  <Button asChild size="lg">
                    <Link href={promo.href}>
                      See the offer
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </Magnetic>
                <Button asChild size="lg" variant="secondary">
                  <a href={formatPhoneForLink(ceramicPromoPage.phone)}>
                    <Phone className="size-4" />
                    Call or text {ceramicPromoPage.phoneDisplay}
                  </a>
                </Button>
              </div>

              <p className="text-sm text-bone-muted">
                {service.duration} · {service.mobileAvailable ? "In-shop or mobile" : "In-shop"} · Refundable{" "}
                {formatPrice(service.depositAmount, service.currency)} deposit secures your slot
              </p>
            </FadeUp>
          </div>

          <FadeUp>
            <HydrophobicPanel href={promo.href} />
          </FadeUp>
        </div>
      </Container>
    </section>
  );
}
