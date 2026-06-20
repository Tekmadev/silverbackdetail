"use client";

import * as React from "react";
import { useGSAP, gsap } from "@/lib/animations/gsap-setup";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FadeUp, FadeUpItem } from "@/components/animations/FadeUp";
import { processSteps } from "@/lib/data/content";

const BRIGHT = "#edeff3"; // silver-bright

export function ProcessSection() {
  const ref = React.useRef<HTMLElement>(null);
  const fillRef = React.useRef<HTMLDivElement>(null);
  const numRefs = React.useRef<Array<HTMLSpanElement | null>>([]);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const hasViewport =
        typeof window !== "undefined" && !!window.innerWidth && !!window.innerHeight;
      const numerals = numRefs.current.filter(Boolean) as HTMLSpanElement[];

      if (reduced || !hasViewport) {
        // Fail-visible / reduced: spine drawn, numerals bright, no scrub.
        if (fillRef.current) gsap.set(fillRef.current, { scaleX: 1 });
        gsap.set(numerals, { color: BRIGHT });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top 72%",
          end: "bottom 72%",
          scrub: 0.5,
        },
      });
      if (fillRef.current) {
        tl.fromTo(fillRef.current, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
      }
      numerals.forEach((n, i) => {
        tl.to(n, { color: BRIGHT, ease: "none", duration: 0.5 }, (i / numerals.length) * 0.85);
      });
    },
    { scope: ref },
  );

  return (
    <section id="process" ref={ref} className="relative py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="The process"
          title="Four stages, zero shortcuts"
          description="A repeatable, transparent method we follow on every vehicle that comes through the studio."
        />

        {/* Scroll-drawn progress spine above the steps. */}
        <div aria-hidden className="relative mt-12 h-px w-full overflow-hidden bg-line">
          <div
            ref={fillRef}
            className="h-full w-full origin-left bg-gradient-to-r from-silver to-accent"
            style={{ transform: "scaleX(0)", willChange: "transform" }}
          />
        </div>

        <FadeUp stagger className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <FadeUpItem key={step.step}>
              <div className="relative flex h-full flex-col gap-3 rounded-xl border border-line bg-ink-3 p-7">
                <span
                  ref={(el) => {
                    numRefs.current[i] = el;
                  }}
                  className="font-display text-5xl font-semibold text-line-strong"
                >
                  {step.step}
                </span>
                <h3 className="font-display text-xl font-semibold text-bone">{step.title}</h3>
                <p className="text-sm leading-relaxed text-bone-muted">{step.description}</p>
              </div>
            </FadeUpItem>
          ))}
        </FadeUp>
      </Container>
    </section>
  );
}
