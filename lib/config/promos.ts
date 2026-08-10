/**
 * Paid-campaign data. Deliberately NOT in business.ts.
 *
 * business.ts is the source of truth for the permanent business: the number
 * that rings the shop, the standing price list, what is genuinely available
 * mobile. A campaign is temporary, uses a call-tracking number, and advertises
 * a promotional price. Merging the two would leak campaign pricing into
 * schema.org, the sitemap, the booking flow, and the AI receptionist's
 * knowledge base.
 *
 * When a campaign ends, delete its entry here and the route that reads it.
 */

import { businessConfig } from "@/lib/config/business";

/**
 * The standing ceramic price is read from business.ts rather than copied, so
 * the "was" price on the promo page can never drift from the price shown on
 * /services/ceramic-coating. A hardcoded copy is exactly how this page came to
 * advertise a regular price of $999 against a listed price of $1,200.
 *
 * Throws at build time rather than falling back to a guess: a wrong strike
 * price is a claim about what the service normally costs, so it should stop
 * the build, not ship quietly.
 */
const CERAMIC_SERVICE = businessConfig.services.find((s) => s.slug === "ceramic-coating");
if (!CERAMIC_SERVICE) {
  throw new Error("promos.ts: no 'ceramic-coating' service in business.ts to source the regular price from.");
}

export const ceramicPromo = {
  name: "Ultimate 5-Year Ceramic Coating",

  /**
   * Call-tracking number from the ad creative, so campaign calls are
   * attributable. This is NOT businessConfig.contact.phone and must not
   * replace it anywhere else on the site.
   */
  phone: "+1-365-389-6767",
  phoneDisplay: "(365) 389-6767",

  /**
   * `regularPrice` is the standing ceramic price from business.ts, so the
   * strike-through figure always matches what /services/ceramic-coating shows.
   * Only `promoPrice` is campaign-specific, which is still why this file stays
   * separate from business.ts and why the promo page is noindex.
   */
  regularPrice: CERAMIC_SERVICE.priceFrom,
  promoPrice: 799,
  currency: CERAMIC_SERVICE.currency,

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

export const promoSavings = ceramicPromo.regularPrice - ceramicPromo.promoPrice;
