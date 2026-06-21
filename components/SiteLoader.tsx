"use client";

import { useEffect } from "react";

/**
 * Animates the #sb-loader overlay out after the page finishes loading.
 * The overlay itself is static HTML in layout.tsx so it appears before React
 * hydrates — this component only handles the exit.
 */
export function SiteLoader() {
  useEffect(() => {
    const overlay = document.getElementById("sb-loader");
    if (!overlay) return;

    // Skip animation on repeat visits within the same session.
    if (sessionStorage.getItem("sb-loaded")) {
      overlay.remove();
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const exit = () => {
      if (reducedMotion) {
        overlay.remove();
        sessionStorage.setItem("sb-loaded", "1");
        return;
      }

      const bar = document.getElementById("sb-loader-bar");
      if (bar) {
        bar.style.transition = "width 0.25s ease-out";
        bar.style.width = "100%";
      }

      setTimeout(() => {
        overlay.style.transition = "opacity 0.55s ease-in-out, transform 0.55s ease-in-out";
        overlay.style.opacity = "0";
        overlay.style.transform = "translateY(-6px)";
        setTimeout(() => {
          overlay.remove();
          sessionStorage.setItem("sb-loaded", "1");
        }, 560);
      }, 260);
    };

    if (document.readyState === "complete") {
      // Already loaded (e.g. fast cache hit) — brief pause so the wordmark is seen.
      setTimeout(exit, 350);
    } else {
      window.addEventListener("load", () => setTimeout(exit, 350), { once: true });
    }
  }, []);

  return null;
}
