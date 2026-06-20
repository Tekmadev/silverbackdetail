"use client";

import * as React from "react";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/animations/gsap-setup";

/**
 * The site's single continuous crimson accent: a fixed 2px hairline on the right
 * edge whose fill tracks overall scroll progress, with a soft blurred tip that
 * lags the leading edge so it "catches up" on a fast flick. Decorative and
 * aria-hidden; below the header. Reduced motion: no lag on the tip.
 */
export function ScrollProgressThread() {
  const fillRef = React.useRef<HTMLDivElement>(null);
  const tipRef = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const fill = fillRef.current;
    if (!fill) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.set(fill, { scaleY: 0, transformOrigin: "top" });
    const setTipY = tipRef.current
      ? gsap.quickTo(tipRef.current, "y", { duration: reduced ? 0 : 0.12, ease: "power2.out" })
      : null;

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        gsap.set(fill, { scaleY: self.progress });
        if (setTipY) setTipY(self.progress * window.innerHeight);
      },
    });

    return () => st.kill();
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-y-0 right-0 z-40 w-0.5">
      <div ref={fillRef} className="h-full w-full bg-accent/80" />
      <div
        ref={tipRef}
        className="absolute right-0 top-0 h-10 w-0.5 -translate-y-1/2 bg-accent blur-[3px]"
      />
    </div>
  );
}
