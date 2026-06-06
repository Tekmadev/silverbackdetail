"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap-setup";

/**
 * Site-wide smooth scrolling via Lenis, synced to GSAP's ticker so ScrollTrigger
 * stays in lockstep with the smoothed scroll position. Lenis automatically
 * respects prefers-reduced-motion.
 *
 * Pass `enabled={false}` (e.g. on the booking flow) to render children without
 * smoothing so native form/scroll interactions are never intercepted.
 */
export function SmoothScrollProvider({
  children,
  enabled = true,
}: {
  children: React.ReactNode;
  enabled?: boolean;
}) {
  if (!enabled) return <>{children}</>;
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        smoothWheel: true,
      }}
    >
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  );
}

function LenisGsapBridge() {
  const lenis = useLenis(ScrollTrigger.update);

  useEffect(() => {
    if (!lenis) return;
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(update);
    };
  }, [lenis]);

  return null;
}
