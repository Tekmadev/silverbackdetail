"use client";

import * as React from "react";
import { Star, Quote } from "lucide-react";
import { useLenis } from "lenis/react";
import { useGSAP, gsap } from "@/lib/animations/gsap-setup";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { testimonials, type Testimonial } from "@/lib/data/content";

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="flex w-[340px] shrink-0 flex-col gap-4 rounded-xl border border-line bg-ink-3 p-6 sm:w-[400px]">
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} className="size-4 fill-warning text-warning" />
          ))}
        </div>
        <Quote className="size-6 text-line-strong" />
      </div>
      <blockquote className="text-[0.95rem] leading-relaxed text-bone">{t.quote}</blockquote>
      <figcaption className="mt-auto border-t border-line pt-4">
        <p className="text-sm font-medium text-bone">{t.name}</p>
        <p className="text-xs text-bone-muted">
          {t.vehicle} · {t.service} · {t.location}
        </p>
      </figcaption>
    </figure>
  );
}

export function TestimonialMarquee() {
  // Duplicate the list so the marquee loops seamlessly (xPercent -50 = one set).
  const loop = [...testimonials, ...testimonials];
  const trackRef = React.useRef<HTMLDivElement>(null);
  const tweenRef = React.useRef<gsap.core.Tween | null>(null);
  const hovered = React.useRef(false);
  const lenis = useLenis();

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const hasViewport = !!window.innerWidth && !!window.innerHeight;
      if (reduced || !hasViewport || !trackRef.current) return; // static, readable

      const tween = gsap.to(trackRef.current, {
        xPercent: -50,
        duration: 40,
        ease: "none",
        repeat: -1,
      });
      tweenRef.current = tween;

      // Scroll velocity speeds the marquee up; it eases back to 1x when idle, and
      // smoothly stops on hover. timeScale (not animation-duration) means no jank.
      let cur = 1;
      let target = 1;
      const tick = () => {
        target += (1 - target) * 0.05; // decay toward base speed
        const effective = hovered.current ? 0 : target;
        cur += (effective - cur) * 0.1;
        tween.timeScale(cur);
      };
      gsap.ticker.add(tick);

      const onScroll = () => {
        const v = Math.min(Math.abs(lenis?.velocity ?? 0) / 8, 1.2);
        target = 1 + v;
      };
      lenis?.on("scroll", onScroll);

      return () => {
        gsap.ticker.remove(tick);
        lenis?.off("scroll", onScroll);
      };
    },
    { dependencies: [lenis] },
  );

  // No invented reviews: render nothing until real testimonials are added.
  if (testimonials.length === 0) return null;

  return (
    <section id="reviews" className="relative overflow-hidden py-24 md:py-32">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="What clients say"
          title="Trusted across the region"
          description="Owners who care about their vehicles keep coming back. Here is what they say."
          className="mx-auto"
        />
      </Container>

      <div className="relative mt-14 flex flex-col gap-6">
        {/* edge fades */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
        <div
          ref={trackRef}
          className="flex w-max gap-6 pl-6"
          onPointerEnter={() => {
            hovered.current = true;
          }}
          onPointerLeave={() => {
            hovered.current = false;
          }}
        >
          {loop.map((t, i) => (
            <Card key={`${t.name}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
