/**
 * Active promotions.
 *
 * business.ts stays the source of truth for standing prices, the number that
 * rings the shop, and what is genuinely available mobile. This file layers
 * temporary offers on top of it. A promo never edits a service, it points at
 * one by slug and supplies a lower starting price, so the regular price is
 * always still there to strike through and to go back to when the offer ends.
 *
 * To run a promo on another service, add an entry to `servicePromos`. Every
 * price on the site reads through `getServicePricing` in site.ts, so a new
 * entry surfaces on the service cards, the service page, the booking flow,
 * search-engine structured data, and the announcement bar with no further work.
 *
 * To end a promo, delete its entry. Prices revert to business.ts everywhere at
 * once, and the announcement bar disappears on its own.
 */

import { businessConfig } from "@/lib/config/business";

export type ServicePromo = {
  /** Slug of the service in business.ts this offer applies to. */
  serviceSlug: string;
  /** Promotional starting price, in the service's own currency. */
  price: number;
  /** Short badge text, e.g. "Limited time". */
  label: string;
  /** One-line pitch used by the announcement bar and the home page block. */
  headline: string;
  /** Supporting line for the home page block. */
  description: string;
  /** Campaign landing page, if the offer has one. */
  href: string;
};

export const servicePromos: ServicePromo[] = [
  {
    serviceSlug: "ceramic-coating",
    price: 799,
    label: "Limited time",
    headline: "5-year ceramic coating",
    description:
      "Multi-stage paint correction and a 5-year ceramic coating, at the lowest starting price we have offered. We take a limited number at a time because of the correction work involved.",
    href: "/ceramic-promo",
  },
];

/**
 * Landing-page-only content for the ceramic campaign. Pricing is not repeated
 * here: the page reads it through `getServicePricing` like everywhere else, so
 * there is exactly one number to change.
 */
export const ceramicPromoPage = {
  serviceSlug: "ceramic-coating",
  name: "Ultimate 5-Year Ceramic Coating",

  /**
   * Call-tracking number from the ad creative, so campaign calls are
   * attributable. This is NOT businessConfig.contact.phone and must not
   * replace it anywhere else on the site.
   */
  phone: "+1-365-389-6767",
  phoneDisplay: "(365) 389-6767",

  includes: [
    {
      title: "Multi-stage paint correction",
      description: "We safely remove swirls, scratches, and dull oxidation first.",
      icon: "sparkles" as const,
    },
    {
      title: "5-year durable ceramic coating",
      description: "Locks in a mirror-like gloss, extreme water beading, and UV protection.",
      icon: "shield" as const,
    },
    {
      /**
       * From the ad copy. Heads up: businessConfig marks ceramic-coating
       * mobileAvailable: false, and /services plus /mobile-detailing both state
       * that ceramic is in-shop only because curing needs a controlled
       * environment. Delete this entry to bring the page back in line with the
       * rest of the site.
       */
      title: "Mobile service",
      description: "We bring the shop right to your driveway, anywhere in the Hamilton area.",
      icon: "truck" as const,
    },
  ],

  /**
   * GoHighLevel inline form embed. The frame's height lives in GhlFormEmbed,
   * which documents the measurements behind it.
   */
  form: {
    id: "770BPlU0uXRPFZvqJqA9",
    name: "ceramic promo",
    origin: "https://link.tekmadev.com",
    /**
     * Must match the form's own max-width in the GHL builder, currently 548px
     * on `.form-builder--wrap`. The form document paints no background, so any
     * frame width beyond this shows the browser's default white canvas as
     * gutters either side of the form. Matching the two makes it sit flush.
     * Change the form width in GHL and this has to follow.
     */
    width: 548,
  },
} as const;

/**
 * Fails the build if a promo points at a service that does not exist, rather
 * than silently showing no discount. A promo is a price claim, so a broken
 * reference should stop the build instead of shipping quietly.
 */
for (const promo of servicePromos) {
  const service = businessConfig.services.find((s) => s.slug === promo.serviceSlug);
  if (!service) {
    throw new Error(`promos.ts: promo points at unknown service slug "${promo.serviceSlug}".`);
  }
  if (promo.price >= service.priceFrom) {
    throw new Error(
      `promos.ts: promo price ${promo.price} for "${promo.serviceSlug}" is not below its regular price ${service.priceFrom}.`,
    );
  }
}
