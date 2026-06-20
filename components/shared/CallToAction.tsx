import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/animations/Magnetic";
import { LineReveal } from "@/components/animations/LineReveal";
import { FadeUp, FadeUpItem } from "@/components/animations/FadeUp";
import { TrustBadges } from "@/components/shared/TrustBadges";
import { businessConfig } from "@/lib/config/business";
import { formatPhoneForLink } from "@/lib/config/site";

const CTA_TITLE =
  "max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tight text-bone sm:text-5xl md:text-6xl";

/**
 * Reusable closing call-to-action band. Reused on the home page and most
 * marketing sub-pages so the conversion point is always consistent.
 */
export function CallToAction({
  eyebrow = "Book your detail",
  title = "Ready to see your car reborn?",
  description = "Secure a slot in minutes. Premium services hold your date with a fully refundable deposit.",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t border-line py-24 md:py-32">
      <div aria-hidden className="grain absolute inset-0" />
      <div
        aria-hidden
        className="absolute left-1/2 top-0 -z-0 size-[60vw] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]"
      />
      <Container className="relative z-10 flex flex-col items-center gap-7 text-center">
        <LineReveal
          align="center"
          eyebrow={eyebrow}
          title={title}
          description={description}
          titleClassName={CTA_TITLE}
        />
        <FadeUp stagger className="flex flex-col items-center gap-7">
          <FadeUpItem className="flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <Button asChild size="lg">
                <Link href="/book">
                  Book online
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </Magnetic>
            <Button asChild size="lg" variant="secondary">
              <a href={formatPhoneForLink()}>
                <Phone className="size-4" />
                {businessConfig.contact.phoneDisplay}
              </a>
            </Button>
          </FadeUpItem>
          <FadeUpItem>
            <TrustBadges className="justify-center" />
          </FadeUpItem>
        </FadeUp>
      </Container>
    </section>
  );
}
