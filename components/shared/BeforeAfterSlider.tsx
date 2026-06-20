"use client";

import * as React from "react";
import { MoveHorizontal } from "lucide-react";
import { useGSAP, gsap } from "@/lib/animations/gsap-setup";
import { cn } from "@/lib/utils";

/**
 * Drag (or keyboard) to compare a dull "before" against a glossy "after".
 * Until real photography is added, both sides are rendered as tasteful CSS
 * panels keyed off `hue`. Swap in <img>/next/image when assets are ready.
 */
export function BeforeAfterSlider({
  hue = 220,
  label,
  className,
}: {
  hue?: number;
  label?: string;
  className?: string;
}) {
  const [pos, setPos] = React.useState(50);
  const ref = React.useRef<HTMLDivElement>(null);
  const knobRef = React.useRef<HTMLSpanElement>(null);
  const dragging = React.useRef(false);

  // On first scroll into view, sweep the divider once to invite interaction,
  // then hand full control back to the user. Skipped for reduced motion / no
  // viewport, and aborted the moment the user grabs the handle.
  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced || !window.innerWidth || !window.innerHeight) return;
      const proxy = { p: 50 };
      const apply = () => {
        if (!dragging.current) setPos(proxy.p);
      };
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
      });
      tl.to(proxy, { p: 62, duration: 0.4, ease: "power2.inOut", onUpdate: apply })
        .to(proxy, { p: 38, duration: 0.45, ease: "power2.inOut", onUpdate: apply })
        .to(proxy, { p: 50, duration: 0.4, ease: "power2.inOut", onUpdate: apply });
      if (knobRef.current) {
        tl.fromTo(knobRef.current, { scale: 1 }, { scale: 1.08, duration: 0.3, yoyo: true, repeat: 1 }, 0);
      }
    },
    { scope: ref },
  );

  const updateFromClientX = React.useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    setPos(Math.max(0, Math.min(100, ratio * 100)));
  }, []);

  React.useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      updateFromClientX(e.clientX);
    };
    const up = () => {
      dragging.current = false;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [updateFromClientX]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
    if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
    if (e.key === "Home") setPos(0);
    if (e.key === "End") setPos(100);
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative aspect-[4/3] w-full select-none overflow-hidden rounded-xl border border-line",
        className,
      )}
      onPointerDown={(e) => {
        dragging.current = true;
        updateFromClientX(e.clientX);
      }}
    >
      {/* After (glossy) */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 100% at 30% 0%, hsl(${hue} 35% 28%), hsl(${hue} 40% 8%) 70%)`,
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(255,255,255,0.18)_0%,transparent_30%,transparent_60%,rgba(255,255,255,0.1)_100%)]" />
        <span className="absolute bottom-4 right-4 rounded-full border border-line-strong bg-ink/60 px-3 py-1 text-xs font-medium text-bone backdrop-blur">
          After
        </span>
      </div>

      {/* Before (dull, swirled) — clipped to the left of the handle */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, hsl(${hue} 8% 22%), hsl(${hue} 6% 12%))`,
          }}
        >
          <div className="absolute inset-0 opacity-50 bg-[repeating-radial-gradient(circle_at_40%_40%,rgba(255,255,255,0.05)_0,rgba(255,255,255,0.05)_1px,transparent_2px,transparent_5px)]" />
          <span className="absolute bottom-4 left-4 rounded-full border border-line bg-ink/60 px-3 py-1 text-xs font-medium text-bone-muted backdrop-blur">
            Before
          </span>
        </div>
      </div>

      {/* Handle */}
      <div
        role="slider"
        tabIndex={0}
        aria-label={label ? `${label}: drag to compare before and after` : "Drag to compare before and after"}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={onKeyDown}
        className="absolute inset-y-0 z-10 flex w-0.5 cursor-ew-resize items-center justify-center bg-bone/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <span
          ref={knobRef}
          className="flex size-10 items-center justify-center rounded-full border border-line-strong bg-ink text-bone shadow-lg"
        >
          <MoveHorizontal className="size-4" />
        </span>
      </div>

      {label && (
        <span className="pointer-events-none absolute left-4 top-4 z-10 max-w-[60%] text-sm font-medium text-bone">
          {label}
        </span>
      )}
    </div>
  );
}
