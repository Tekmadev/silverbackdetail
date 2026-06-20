/**
 * Central GSAP plugin registration. Import this once from any client component
 * that uses GSAP so plugins are registered exactly one time.
 *
 * GSAP and all of its plugins are free for commercial use as of April 30, 2025,
 * so no Club GSAP token is required.
 */
"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

let registered = false;

if (!registered && typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  registered = true;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
