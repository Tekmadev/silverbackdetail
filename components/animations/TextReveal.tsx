"use client";

import * as React from "react";
import { useGSAP, gsap } from "@/lib/animations/gsap-setup";
import { cn } from "@/lib/utils";

/**
 * GSAP word-by-word mask reveal on scroll into view. Each word rises from behind
 * a clipped line. Respects reduced motion (renders fully visible, no animation).
 */
export function TextReveal({
  text,
  as: Tag = "h2",
  className,
  wordClassName,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  wordClassName?: string;
}) {
  const ref = React.useRef<HTMLElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const targets = ref.current?.querySelectorAll<HTMLElement>("[data-word]");
      if (!targets || targets.length === 0) return;
      if (prefersReduced) {
        gsap.set(targets, { yPercent: 0, opacity: 1 });
        return;
      }
      gsap.from(targets, {
        yPercent: 115,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.05,
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as React.Ref<never>} className={cn("text-balance", className)}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <span data-word className={cn("inline-block will-change-transform", wordClassName)}>
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
