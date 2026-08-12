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
   * The 24/7 line, read from business.ts rather than repeated here. The landing
   * page leads with it because ad traffic arrives at all hours and a missed call
   * is a lost booking. Distinct from businessConfig.contact.phone, which reaches
   * the shop during opening hours.
   */
  phone: businessConfig.contact.phone24h,
  phoneDisplay: businessConfig.contact.phone24hDisplay,

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
       * The ad copy promises "100% Mobile Service", which the rest of the site
       * contradicts: businessConfig marks ceramic-coating mobileAvailable:false,
       * and /services and /mobile-detailing both say ceramic is in-shop because
       * curing needs a controlled environment.
       *
       * Worded as a maybe rather than dropped, because whether a given car can
       * be coated on site depends on the driveway, the weather, and the coating,
       * and that is a judgement call made per booking. Promising it outright
       * sets up a broken promise on the day; deleting it loses people the ad
       * brought in on exactly that hook. So the page invites the conversation
       * instead of pre-answering it.
       *
       * If the shop settles on a firm yes or no, replace this with the real
       * answer and update businessConfig.mobileAvailable to match.
       */
      title: "Mobile where possible",
      description:
        "Coatings cure best in a controlled environment, so most are done in the shop. Ask when you enquire and we will confirm whether yours can be done at your place.",
      icon: "truck" as const,
    },
  ],

  /**
   * GoHighLevel inline form embed. GhlFormEmbed sizes the frame to the form's
   * reported height, so there is no height to keep in step here.
   */
  form: {
    id: "770BPlU0uXRPFZvqJqA9",
    name: "ceramic promo",
    origin: "https://link.tekmadev.com",
    /**
     * The form's own max-width in the GHL builder, currently 800px on
     * `.form-builder--wrap`. The form document paints no background, so a frame
     * wider than this would show the browser's white canvas as gutters either
     * side. The layout keeps the frame around 526px, well under the cap, so
     * this is a guard rather than something that currently binds. Narrow the
     * form in GHL and this has to follow it down.
     */
    maxWidth: 800,
  },

  /**
   * GoHighLevel booking calendar, for people who would rather pick a slot than
   * fill in a form. Note this books into GHL's calendar, not the site's own
   * /book flow, so the two do not know about each other's appointments.
   */
  calendar: {
    id: "glb0ZHT4lPOI5eC2E0Ni",
    name: "Book the ceramic coating promo",
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
