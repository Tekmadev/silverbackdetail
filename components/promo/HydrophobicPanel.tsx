import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Hero-side visual for the ceramic promo: a coated panel shedding water.
 *
 * It illustrates the one property the ad actually leads with, hydrophobic
 * beading, and the whole panel is a link into the form section, so the
 * decoration also does the pushing.
 *
 * Stays a server component. Everything loops in CSS (see globals.css), which
 * keeps it off the main thread and out of the hydration path. Bead positions
 * are a fixed table rather than randomised, so server and client markup match.
 *
 * Beads slide a short distance and fade instead of falling the full height, so
 * nothing depends on the panel's measured size at any breakpoint.
 */

/** Beads that form, slide, and release. `travel` is the slide distance in px. */
const SLIDING_BEADS = [
  { left: "17%", top: "14%", size: 20, travel: 104, delay: "0s", duration: "6.4s" },
  { left: "63%", top: "9%", size: 14, travel: 88, delay: "1.7s", duration: "7.1s" },
  { left: "38%", top: "27%", size: 26, travel: 122, delay: "0.9s", duration: "5.8s" },
  { left: "82%", top: "31%", size: 16, travel: 96, delay: "3.1s", duration: "6.9s" },
  { left: "24%", top: "48%", size: 22, travel: 110, delay: "2.4s", duration: "6.2s" },
  { left: "71%", top: "56%", size: 18, travel: 92, delay: "4.2s", duration: "7.4s" },
  { left: "48%", top: "64%", size: 13, travel: 78, delay: "5.1s", duration: "5.5s" },
];

/** Beads that sit and shimmer, giving the surface a settled, wet look. */
const RESTING_BEADS = [
  { left: "9%", top: "34%", size: 9, delay: "0.4s" },
  { left: "29%", top: "8%", size: 7, delay: "1.9s" },
  { left: "54%", top: "40%", size: 11, delay: "0.8s" },
  { left: "88%", top: "17%", size: 8, delay: "2.6s" },
  { left: "13%", top: "68%", size: 12, delay: "1.2s" },
  { left: "44%", top: "83%", size: 9, delay: "3.3s" },
  { left: "77%", top: "74%", size: 7, delay: "2.1s" },
  { left: "92%", top: "58%", size: 10, delay: "4.0s" },
  { left: "35%", top: "55%", size: 6, delay: "3.7s" },
];

const BEAD_SURFACE =
  "radial-gradient(circle at 34% 28%, rgba(255,255,255,0.92), rgba(255,255,255,0.36) 38%, rgba(255,255,255,0.08) 64%, rgba(255,255,255,0.03) 100%)";
const BEAD_SHADOW = "0 1px 3px rgba(0,0,0,0.45), inset 0 -1px 2px rgba(255,255,255,0.28)";

export function HydrophobicPanel({ href = "#claim", className }: { href?: string; className?: string }) {
  return (
    <a
      href={href}
      aria-label="See the promo pricing and claim a spot"
      className={cn(
        "group relative block h-[340px] overflow-hidden rounded-2xl border border-line bg-ink-2",
        "transition-colors hover:border-line-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
        "sm:h-[400px] lg:h-[500px]",
        className,
      )}
    >
      {/* Coated paint surface */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 100% at 28% 0%, #2a2d34 0%, #16171b 52%, #0e0f12 100%)",
        }}
      />
      <div aria-hidden className="grain absolute inset-0 opacity-60" />

      {/* Slow gloss travelling across the panel */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div
          className="sb-panel-sheen absolute inset-y-0 -left-1/3 w-1/3"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.10) 45%, rgba(255,255,255,0.16) 55%, transparent)",
          }}
        />
      </div>

      {/* Water */}
      <div aria-hidden className="absolute inset-0">
        {RESTING_BEADS.map((b, i) => (
          <span
            key={`rest-${i}`}
            className="sb-bead-breathe absolute rounded-full"
            style={{
              left: b.left,
              top: b.top,
              width: b.size,
              height: b.size,
              background: BEAD_SURFACE,
              boxShadow: BEAD_SHADOW,
              animationDelay: b.delay,
            }}
          />
        ))}
        {SLIDING_BEADS.map((b, i) => (
          <span
            key={`slide-${i}`}
            className="sb-bead-slide absolute rounded-full"
            style={{
              left: b.left,
              top: b.top,
              width: b.size,
              height: b.size,
              background: BEAD_SURFACE,
              boxShadow: BEAD_SHADOW,
              animationDelay: b.delay,
              animationDuration: b.duration,
              ["--sb-bead-travel" as string]: `${b.travel}px`,
            }}
          />
        ))}
      </div>

      {/* Label */}
      <span className="absolute left-5 top-5 rounded-full border border-line-strong bg-ink/60 px-3 py-1 text-xs font-medium text-bone backdrop-blur">
        5-year ceramic
      </span>

      {/* Copy and the nudge into the form */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/80 to-transparent p-6 pt-16">
        <p className="font-display text-2xl font-semibold leading-tight text-bone">
          Water doesn&apos;t stand a chance.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-bone-muted">
          Rain, salt, and road grime bead up and sheet off instead of soaking into your clear coat.
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent">
          Claim the promo
          <ArrowDown className="sb-nudge size-4" />
        </span>
      </div>
    </a>
  );
}
