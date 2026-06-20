"use client";

import * as React from "react";
import { useGSAP, gsap, SplitText } from "@/lib/animations/gsap-setup";
import { sheenSweep } from "@/lib/animations/useSheenSweep";
import { cn } from "@/lib/utils";

const DEFAULT_TITLE =
  "max-w-3xl text-balance font-display text-3xl font-semibold leading-[1.1] tracking-tight text-bone sm:text-4xl md:text-5xl";

/**
 * The site's keystone heading reveal. The title's words rise from behind a
 * clipped edge (GSAP SplitText `mask: "words"`), preceded by the eyebrow and
 * followed by the description, on one scroll-triggered timeline. Composed by
 * SectionHeading and PageHeader so every heading shares one cinematic cadence.
 *
 * - Word-level masking (not line-level) is width-independent: words wrap via
 *   normal CSS flow, so there is no line measurement to get wrong, nothing to
 *   re-split on resize, and no degenerate-width failure mode.
 * - Accepts ReactNode titles, so accent-colored words and <br> survive.
 * - SSR renders the final, visible markup; the hidden start state is applied in
 *   a layout effect (pre-paint) so there is no flash and no hydration mismatch.
 * - Reduced motion: nothing animates, everything stays visible, zero layout shift.
 */
export function LineReveal({
  eyebrow,
  title,
  description,
  as: Tag = "h2",
  align = "left",
  titleClassName,
  descriptionClassName,
  className,
  sheen = false,
  before,
  after,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  titleClassName?: string;
  descriptionClassName?: string;
  className?: string;
  sheen?: boolean;
  before?: React.ReactNode;
  after?: React.ReactNode;
}) {
  const scope = React.useRef<HTMLDivElement>(null);
  const beforeRef = React.useRef<HTMLDivElement>(null);
  const eyebrowRef = React.useRef<HTMLParagraphElement>(null);
  const titleRef = React.useRef<HTMLElement>(null);
  const descRef = React.useRef<HTMLParagraphElement>(null);
  const afterRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced || !titleRef.current) return; // render visible, no motion
      // Fail-visible: without a real viewport, ScrollTrigger can't resolve its
      // start, so never hide the heading. Real browsers always pass this.
      if (!window.innerWidth || !window.innerHeight) return;

      const split = SplitText.create(titleRef.current, {
        type: "words",
        mask: "words",
        wordsClass: "lr-word",
      });
      gsap.set(split.words, { willChange: "transform" });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: scope.current, start: "top 85%", once: true },
        onComplete: () => {
          gsap.set(split.words, { clearProps: "willChange" });
          if (sheen) sheenSweep(titleRef.current);
        },
      });
      if (beforeRef.current) {
        tl.from(beforeRef.current, { opacity: 0, y: 8, duration: 0.4, ease: "power2.out" }, 0);
      }
      if (eyebrowRef.current) {
        tl.from(
          eyebrowRef.current,
          { opacity: 0, y: 8, duration: 0.4, ease: "power2.out" },
          beforeRef.current ? 0.1 : 0,
        );
      }
      tl.from(
        split.words,
        { yPercent: 110, opacity: 0, duration: 0.7, stagger: 0.045, ease: "power3.out" },
        "-=0.15",
      );
      if (descRef.current) {
        tl.from(descRef.current, { opacity: 0, y: 10, duration: 0.45, ease: "power2.out" }, "-=0.3");
      }
      if (afterRef.current) {
        tl.from(afterRef.current, { opacity: 0, y: 10, duration: 0.45, ease: "power2.out" }, "-=0.2");
      }
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      className={cn("flex flex-col gap-4", align === "center" && "items-center text-center", className)}
    >
      {before && <div ref={beforeRef}>{before}</div>}
      {eyebrow && (
        <p ref={eyebrowRef} className="eyebrow">
          {eyebrow}
        </p>
      )}
      <Tag ref={titleRef as React.Ref<never>} className={cn(DEFAULT_TITLE, titleClassName)}>
        {title}
      </Tag>
      {description && (
        <p
          ref={descRef}
          className={cn(
            "max-w-2xl text-lg leading-relaxed text-bone-muted",
            align === "center" && "mx-auto",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      )}
      {after && <div ref={afterRef}>{after}</div>}
    </div>
  );
}
