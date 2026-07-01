import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { BeforeAfterSlider } from "@/components/shared/BeforeAfterSlider";
import { FadeUp } from "@/components/animations/FadeUp";

export function BeforeAfterShowcase() {
  return (
    <section id="results" className="relative overflow-hidden border-t border-line bg-ink-2 py-24 md:py-32">
      <div aria-hidden className="grain absolute inset-0" />
      <Container className="relative z-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="The results"
            title="Drag to see the transformation"
            description="Real correction work means measurable change. Slide to compare a tired finish against the result."
          />
          <Link
            href="/gallery"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-silver transition-colors hover:text-bone"
          >
            View full gallery
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Second comparison intentionally hidden until a new real before/after
            pair is available. Restore by adding another <BeforeAfterSlider
            beforeSrc afterSrc label /> here and switching back to a 2-col grid. */}
        <FadeUp className="mt-12">
          <div className="mx-auto max-w-3xl">
            <BeforeAfterSlider
              beforeSrc="/images/newimages/beforewash.webp"
              afterSrc="/images/newimages/afterwash.webp"
              label="Exterior detail · wash & decon"
            />
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
