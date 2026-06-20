"use client";

import { gsap } from "@/lib/animations/gsap-setup";

/**
 * One-pass brushed-silver rake across an element. The element must carry the
 * `.text-metal` utility (it sets a 200%-wide metallic gradient as its text fill);
 * this slides that gradient across once and stops. This is the rationed "glint" —
 * deliberately NOT the looping `.animate-shimmer`.
 *
 * Callers must guard for reduced motion (skip calling it). On reduce the element
 * still renders the static metallic gradient, so it stays legible.
 */
export function sheenSweep(el: HTMLElement | null) {
  if (!el) return;
  gsap.fromTo(
    el,
    { backgroundPositionX: "200%" },
    { backgroundPositionX: "-200%", duration: 0.6, ease: "power2.inOut" },
  );
}
