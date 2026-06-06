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

        <FadeUp className="mt-12 grid gap-6 lg:grid-cols-2">
          <BeforeAfterSlider hue={222} label="Paint correction · gloss black" />
          <BeforeAfterSlider hue={6} label="Ceramic coating · single stage" />
        </FadeUp>
      </Container>
    </section>
  );
}
