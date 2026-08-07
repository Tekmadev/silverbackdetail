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
   * Promotional pricing as written in the ad.
   *
   * Note: businessConfig lists ceramic coating at priceFrom 1200. These
   * numbers are lower and are campaign-specific, which is the other reason
   * this file is separate and the promo page is noindex.
   */
  regularPrice: 999,
  promoPrice: 799,
  currency: "CAD",

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

  /** GoHighLevel inline form embed. */
  form: {
    id: "770BPlU0uXRPFZvqJqA9",
    name: "ceramic promo",
    origin: "https://link.tekmadev.com",
    height: 670,
  },
} as const;

export const promoSavings = ceramicPromo.regularPrice - ceramicPromo.promoPrice;
