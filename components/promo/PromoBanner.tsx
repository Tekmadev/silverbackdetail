"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { getFeaturedPromo, formatPrice } from "@/lib/config/site";
import { cn } from "@/lib/utils";

/**
 * Site-wide announcement bar for the running promotion.
 *
 * Disappears on its own when `servicePromos` is empty, so ending a campaign is
 * a one-line delete in promos.ts rather than a hunt through layouts.
 *
 * Two placements, because the two layouts stack differently:
 * - "floating" sits fixed just under the marketing layout's fixed header, in
 *   the clearance those pages already reserve, and tucks away behind the header
 *   once the reader scrolls so it can never cover content.
 * - "inline" sits in normal flow above the booking layout's sticky header,
 *   which pushes content down instead of overlapping it.
 *
 * Dismissal is remembered per offer: the storage key carries the slug and the
 * price, so changing the deal shows the bar again rather than staying hidden
 * for everyone who ever closed the previous one.
 */
/** Fires on this tab's own dismissal and on `storage` from other tabs. */
const DISMISS_EVENT = "sb:promo-dismissed";

/**
 * Fallback for when localStorage throws (private mode, blocked cookies). The
 * bar still closes for the rest of the session; it just returns on reload.
 * Without this, dismissing in those browsers would appear to do nothing.
 */
const dismissedThisSession = new Set<string>();

function subscribeToDismissal(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(DISMISS_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(DISMISS_EVENT, onChange);
  };
}

export function PromoBanner({ mode = "floating" }: { mode?: "floating" | "inline" }) {
  const featured = getFeaturedPromo();
  const pathname = usePathname();

  const storageKey = featured
    ? `sb_promo_dismissed:${featured.promo.serviceSlug}:${featured.pricing.current}`
    : "sb_promo_dismissed";

  // localStorage is an external store, so it is read through
  // useSyncExternalStore rather than copied into state inside an effect. The
  // server snapshot reports "dismissed", which means nothing renders during SSR
  // or hydration and the bar appears on the first client read. That doubles as
  // the entrance: the slide-down lands a beat after paint, reading as
  // intentional rather than as a layout jump, with no hydration mismatch.
  const dismissed = React.useSyncExternalStore(
    subscribeToDismissal,
    () => {
      if (dismissedThisSession.has(storageKey)) return true;
      try {
        return window.localStorage.getItem(storageKey) === "1";
      } catch {
        // Private mode or blocked storage: show the bar rather than fail.
        return false;
      }
    },
    () => true,
  );

  const [scrolledAway, setScrolledAway] = React.useState(false);

  React.useEffect(() => {
    if (mode !== "floating") return;
    const onScroll = () => setScrolledAway(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode]);

  if (!featured || dismissed) return null;
  // No need to advertise the offer to someone already reading its landing page.
  if (pathname === featured.promo.href) return null;

  const { promo, pricing } = featured;

  return (
    <div
      className={cn(
        mode === "floating"
          ? "fixed inset-x-0 top-16 z-40 transition-[transform,opacity] duration-500 md:top-18"
          : "relative z-40",
        mode === "floating" && scrolledAway && "pointer-events-none -translate-y-full opacity-0",
      )}
    >
      <div className="sb-slide-down relative overflow-hidden border-y border-accent/25 bg-[linear-gradient(90deg,#1a0d10,#2a1014_45%,#1a0d10)]">
        {/* Gloss travelling across the bar */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="sb-panel-sheen absolute inset-y-0 -left-1/3 w-1/3"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 50%, transparent)",
            }}
          />
        </div>

        <Container className="relative flex h-11 items-center justify-between gap-3">
          <Link href={promo.href} className="group flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
              <span className="sb-bead-breathe size-1.5 rounded-full bg-accent" />
              {promo.label}
            </span>

            <span className="min-w-0 truncate text-sm text-bone">
              <span className="hidden sm:inline">{promo.headline} from </span>
              <span className="sm:hidden">Ceramic from </span>
              <span className="font-semibold">{formatPrice(pricing.current, pricing.currency)}</span>
              <span className="ml-1.5 text-bone-muted line-through">
                {formatPrice(pricing.regular, pricing.currency)}
              </span>
              <span className="ml-2 hidden text-bone-muted md:inline">
                save {formatPrice(pricing.savings, pricing.currency)}
              </span>
            </span>

            <span className="hidden shrink-0 items-center gap-1 text-sm font-medium text-accent sm:flex">
              Claim
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          <button
            type="button"
            onClick={() => {
              dismissedThisSession.add(storageKey);
              try {
                window.localStorage.setItem(storageKey, "1");
              } catch {
                // Not persisted, but the in-memory fallback still closes it.
              }
              window.dispatchEvent(new Event(DISMISS_EVENT));
            }}
            aria-label="Dismiss offer"
            className="-mr-1 shrink-0 rounded-md p-1.5 text-bone-muted transition-colors hover:text-bone focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <X className="size-4" />
          </button>
        </Container>
      </div>
    </div>
  );
}
