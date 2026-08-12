/**
 * Derived helpers over the business config. Pure functions only, so they are safe
 * to use in Server Components, Server Actions, route handlers, and the client.
 */

import { businessConfig, type Service } from "@/lib/config/business";
import { servicePromos, type ServicePromo } from "@/lib/config/promos";

const DAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type Weekday = (typeof DAY_ORDER)[number];

export function getServiceBySlug(slug: string): Service | undefined {
  return businessConfig.services.find((s) => s.slug === slug);
}

export function getFeaturedServices(): Service[] {
  return businessConfig.services.filter((s) => s.featured);
}

export function getServicesByCategory(category: Service["category"]): Service[] {
  return businessConfig.services.filter((s) => s.category === category);
}

export function getDepositServices(): Service[] {
  return businessConfig.services.filter((s) => s.requiresDeposit);
}

export function getServiceAreaBySlug(slug: string) {
  return businessConfig.serviceAreas.find((a) => a.slug === slug);
}

/** "+1-905-519-6290" -> "tel:+19055196290" */
export function formatPhoneForLink(phone: string = businessConfig.contact.phone): string {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

/** "info@..." -> "mailto:info@..." */
export function formatEmailForLink(email: string): string {
  return `mailto:${email}`;
}

/**
 * Pre-filled WhatsApp deep link to the business number. Opens a chat with the
 * message ready to send (works on mobile app and WhatsApp Web on desktop).
 */
export function getWhatsAppLink(
  message = "Hi Silverback Detailing! I'd like a quote for detailing my vehicle.",
): string {
  return `${businessConfig.social.whatsapp.url}?text=${encodeURIComponent(message)}`;
}

/** Instagram DM deep link. ig.me/m/<username> opens the chat on app and web. */
export function getInstagramDmLink(): string {
  const username = businessConfig.social.instagram.handle.replace(/^@/, "");
  return `https://ig.me/m/${username}`;
}

/**
 * What a service costs today, promotions included.
 *
 * Every customer-facing price goes through here rather than reading `priceFrom`
 * directly, so adding or ending a promo in promos.ts updates the service cards,
 * the service page, the booking flow, structured data, and the announcement bar
 * together. `regular` stays available for the strike-through.
 */
export type ServicePricing = {
  /** The standing price from business.ts. */
  regular: number;
  /** What the customer pays today: the promo price when one is running. */
  current: number;
  currency: string;
  isPromo: boolean;
  /** Zero when no promo is running. */
  savings: number;
  promo?: ServicePromo;
};

export function getPromoForService(slug: string): ServicePromo | undefined {
  return servicePromos.find((p) => p.serviceSlug === slug);
}

export function getServicePricing(
  service: Pick<Service, "slug" | "priceFrom" | "currency">,
): ServicePricing {
  const promo = getPromoForService(service.slug);
  const current = promo ? promo.price : service.priceFrom;
  return {
    regular: service.priceFrom,
    current,
    currency: service.currency,
    isPromo: Boolean(promo),
    savings: service.priceFrom - current,
    promo,
  };
}

/**
 * The single promo to feature in shared surfaces (announcement bar, home page).
 * First entry wins, so ordering `servicePromos` is how you choose the hero
 * offer. Returns undefined when nothing is running, which is what lets those
 * surfaces disappear on their own.
 */
export function getFeaturedPromo():
  | { promo: ServicePromo; service: Service; pricing: ServicePricing }
  | undefined {
  const promo = servicePromos[0];
  if (!promo) return undefined;
  const service = getServiceBySlug(promo.serviceSlug);
  if (!service) return undefined;
  return { promo, service, pricing: getServicePricing(service) };
}

export function formatPrice(amount: number, currency = "CAD"): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function minutesFromHHMM(value: string): number {
  const [h, m] = value.split(":").map(Number);
  return h * 60 + m;
}

function formatHHMM(value: string): string {
  const [h, m] = value.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12} ${period}` : `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

/**
 * Open/closed status for "now" in the business's local timezone (America/Toronto).
 * Computed without external deps using Intl so it works on the edge runtime.
 */
export function getOpenStatus(now: Date = new Date()): {
  open: boolean;
  label: string;
  todayHours: string;
} {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const weekday = (parts.find((p) => p.type === "weekday")?.value ?? "Monday").toLowerCase() as Weekday;
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  const nowMinutes = (hour % 24) * 60 + minute;

  const day = businessConfig.hours[weekday];
  if (!day || day.closed) {
    return { open: false, label: "Closed today", todayHours: "Closed" };
  }

  const openMin = minutesFromHHMM(day.open);
  const closeMin = minutesFromHHMM(day.close);
  const isOpen = nowMinutes >= openMin && nowMinutes < closeMin;
  const todayHours = `${formatHHMM(day.open)} – ${formatHHMM(day.close)}`;

  return {
    open: isOpen,
    label: isOpen ? `Open until ${formatHHMM(day.close)}` : `Closed · Opens ${formatHHMM(day.open)}`,
    todayHours,
  };
}

/** Human-readable hours grouped for the footer / contact page. */
export function getWeeklyHours(): { day: string; hours: string; closed: boolean }[] {
  return DAY_ORDER.map((key) => {
    const d = businessConfig.hours[key];
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    return {
      day: label,
      hours: d.closed ? "Closed" : `${formatHHMM(d.open)} – ${formatHHMM(d.close)}`,
      closed: d.closed,
    };
  });
}

export function getServiceAreaNames(): string[] {
  return businessConfig.serviceAreas.map((a) => a.name);
}

/** Schema.org openingHoursSpecification for JSON-LD. */
export function getOpeningHoursSpecification() {
  const dayMap: Record<Weekday, string> = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  };
  return DAY_ORDER.filter((k) => !businessConfig.hours[k].closed).map((k) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: dayMap[k],
    opens: businessConfig.hours[k].open,
    closes: businessConfig.hours[k].close,
  }));
}

/**
 * The origin the site is actually served from, with no trailing slash.
 *
 * Use this for every URL the site publishes about itself. Never read
 * `seo.siteUrl` directly: it holds the apex, while production serves www and
 * 308-redirects the apex to it. Publishing the apex leaves the canonical tag
 * saying one host and og:url and the JSON-LD saying another, which splits
 * social share counts across two URLs and gives crawlers a mixed signal about
 * which host is authoritative.
 *
 * `seo.siteUrl` survives only as the last-resort fallback below, for local runs
 * with no environment at all.
 */
export function siteOrigin(): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : businessConfig.seo.siteUrl);
  return base.replace(/\/$/, "");
}

/** Absolute URL helper that respects the deployment URL when available. */
export function absoluteUrl(path = ""): string {
  return `${siteOrigin()}${path.startsWith("/") ? path : `/${path}`}`;
}
