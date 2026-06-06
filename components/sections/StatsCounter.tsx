"use client";

import * as React from "react";
import { useGSAP, gsap } from "@/lib/animations/gsap-setup";
import { Container } from "@/components/shared/Container";
import { businessConfig } from "@/lib/config/business";

type Stat = { value: number; decimals: number; prefix?: string; suffix?: string; label: string };

const stats: Stat[] = [
  { value: businessConfig.trust.carsDetailed, decimals: 0, suffix: "+", label: "Cars detailed" },
  { value: businessConfig.trust.googleRating, decimals: 1, label: "Average rating" },
  { value: businessConfig.trust.reviewCount, decimals: 0, suffix: "+", label: "Five-star reviews" },
  { value: businessConfig.serviceAreas.length, decimals: 0, label: "Cities served" },
];

export function StatsCounter() {
  const ref = React.useRef<HTMLDivElement>(null);
  const numRefs = React.useRef<Array<HTMLSpanElement | null>>([]);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const format = (v: number, s: Stat) =>
        `${s.prefix ?? ""}${v.toLocaleString("en-CA", {
          minimumFractionDigits: s.decimals,
          maximumFractionDigits: s.decimals,
        })}${s.suffix ?? ""}`;

      numRefs.current.forEach((el, i) => {
        if (!el) return;
        const s = stats[i];
        if (reduced) {
          el.textContent = format(s.value, s);
          return;
        }
        const obj = { v: 0 };
        gsap.to(obj, {
          v: s.value,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
          onUpdate: () => {
            el.textContent = format(obj.v, s);
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section className="border-y border-line bg-ink-2 py-16 md:py-20">
      <Container>
        <div ref={ref} className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className="flex flex-col items-center text-center md:items-start md:text-left">
              <span
                ref={(el) => {
                  numRefs.current[i] = el;
                }}
                className="font-display text-4xl font-semibold tracking-tight text-bone tabular-nums sm:text-5xl"
              >
                {s.prefix ?? ""}
                {s.value.toLocaleString("en-CA", {
                  minimumFractionDigits: s.decimals,
                  maximumFractionDigits: s.decimals,
                })}
                {s.suffix ?? ""}
              </span>
              <span className="mt-2 text-sm text-bone-muted">{s.label}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
