/**
 * THE SOURCE OF TRUTH.
 *
 * Every page, component, schema block, email, and meta tag reads from this file.
 * Changing a phone number, price, or service is a single edit here. Never hardcode
 * any of this data anywhere else in the codebase.
 *
 * Phone numbers in the 555-01xx range are reserved for fictional use; replace the
 * contact details, address, and social handles with the real ones before launch.
 */

export const businessConfig = {
  // Identity
  name: "Silverback Detailing",
  legalName: "Silverback Detailing Inc.",
  tagline: "Detail beyond the surface.",
  shortDescription: "Premium car detailing in Hamilton, Ontario.",
  longDescription:
    "Silverback Detailing delivers showroom-grade detailing, paint correction, and ceramic coating across Hamilton and the surrounding GTA. In-shop and mobile service available.",
  foundedYear: 2024,

  // Contact
  contact: {
    phone: "+1-905-555-0142",
    phoneDisplay: "(905) 555-0142",
    email: "info@silverbackdetailing.ca",
    bookingEmail: "book@silverbackdetailing.ca",
    supportEmail: "support@silverbackdetailing.ca",
  },

  // Physical address
  address: {
    street: "120 Sherman Avenue North",
    city: "Hamilton",
    province: "Ontario",
    provinceCode: "ON",
    postalCode: "L8L 6N4",
    country: "Canada",
    countryCode: "CA",
    coordinates: { lat: 43.2557, lng: -79.8711 },
    googleMapsUrl: "https://maps.google.com/?q=Silverback+Detailing+Hamilton+Ontario",
  },

  // Operating hours (24h format)
  hours: {
    monday: { open: "08:00", close: "18:00", closed: false },
    tuesday: { open: "08:00", close: "18:00", closed: false },
    wednesday: { open: "08:00", close: "18:00", closed: false },
    thursday: { open: "08:00", close: "18:00", closed: false },
    friday: { open: "08:00", close: "18:00", closed: false },
    saturday: { open: "09:00", close: "17:00", closed: false },
    sunday: { open: "00:00", close: "00:00", closed: true },
  },

  // Social
  social: {
    instagram: { handle: "@silverbackdetailing", url: "https://instagram.com/silverbackdetailing" },
    facebook: { handle: "silverbackdetailing", url: "https://facebook.com/silverbackdetailing" },
    tiktok: { handle: "@silverbackdetailing", url: "https://tiktok.com/@silverbackdetailing" },
    google: { url: "https://g.page/silverbackdetailing" },
  },

  // Service area
  serviceAreas: [
    { name: "Hamilton", primary: true, slug: "hamilton" },
    { name: "Burlington", primary: false, slug: "burlington" },
    { name: "Ancaster", primary: false, slug: "ancaster" },
    { name: "Stoney Creek", primary: false, slug: "stoney-creek" },
    { name: "Dundas", primary: false, slug: "dundas" },
    { name: "Waterdown", primary: false, slug: "waterdown" },
  ],

  // Services catalog
  services: [
    {
      slug: "exterior-detail",
      name: "Exterior Detail",
      category: "standard",
      shortDescription: "Hand wash, decontamination, and protective wax.",
      longDescription:
        "Full exterior hand wash with foam pre-soak, iron decontamination, clay bar treatment, and a layer of premium carnauba wax or sealant for 3 to 6 months of protection.",
      includes: [
        "Foam pre-soak and two-bucket hand wash",
        "Iron and tar decontamination",
        "Clay bar treatment",
        "Wheel and tire deep clean",
        "Carnauba wax or sealant (3 to 6 months)",
        "Glass and trim dressing",
      ],
      excludes: ["Machine paint correction", "Interior cleaning"],
      priceFrom: 150,
      currency: "CAD",
      duration: "2 to 3 hours",
      requiresDeposit: false,
      depositAmount: 0,
      depositRefundable: false,
      depositRefundWindowHours: 0,
      featured: false,
    },
    {
      slug: "interior-detail",
      name: "Interior Detail",
      category: "standard",
      shortDescription: "Deep cleaning, conditioning, and odour neutralization.",
      longDescription:
        "Complete interior vacuum, steam clean, leather conditioning, plastic restoration, and ozone odour treatment that leaves the cabin feeling factory fresh.",
      includes: [
        "Full vacuum, including trunk and crevices",
        "Steam clean of all hard surfaces",
        "Carpet and upholstery shampoo or extraction",
        "Leather clean and condition",
        "Interior glass and plastic restoration",
        "Ozone odour neutralization",
      ],
      excludes: ["Exterior wash", "Pet hair removal beyond standard (quoted separately)"],
      priceFrom: 180,
      currency: "CAD",
      duration: "3 to 4 hours",
      requiresDeposit: false,
      depositAmount: 0,
      depositRefundable: false,
      depositRefundWindowHours: 0,
      featured: false,
    },
    {
      slug: "paint-correction",
      name: "Paint Correction",
      category: "premium",
      shortDescription: "Restore your paint to better than new condition.",
      longDescription:
        "Multi-stage machine polishing to remove swirls, scratches, oxidation, and water spots. Includes paint depth measurement, masking, and a finishing polish for true mirror-clear gloss.",
      includes: [
        "Paint depth measurement and inspection",
        "Multi-stage machine polishing",
        "Swirl, scratch, and oxidation removal",
        "Edge and trim masking",
        "Finishing polish for maximum gloss",
        "Paint sealant to protect the correction",
      ],
      excludes: ["Long-term ceramic protection (see Ceramic Coating)", "Dent or scratch-through-paint repair"],
      priceFrom: 800,
      currency: "CAD",
      duration: "1 to 2 days",
      requiresDeposit: true,
      depositAmount: 150,
      depositRefundable: true,
      depositRefundWindowHours: 48,
      featured: true,
    },
    {
      slug: "ceramic-coating",
      name: "Ceramic Coating",
      category: "premium",
      shortDescription: "Years of protection with a glass-like finish.",
      longDescription:
        "Professional ceramic coating application with paint correction prep. Hydrophobic, UV resistant, and chemically resistant. Choose from 2, 5, or 9 year packages.",
      includes: [
        "Full paint correction prep",
        "Surface decontamination and panel wipe",
        "Professional-grade ceramic coating application",
        "Hydrophobic, UV, and chemical resistance",
        "Coating cure and inspection",
        "Aftercare kit and maintenance guidance",
      ],
      excludes: ["Interior coating (quoted separately)", "Wheel-off coating (optional add-on)"],
      priceFrom: 1200,
      currency: "CAD",
      duration: "2 to 3 days",
      requiresDeposit: true,
      depositAmount: 250,
      depositRefundable: true,
      depositRefundWindowHours: 48,
      featured: true,
    },
    {
      slug: "mobile-detailing",
      name: "Mobile Detailing",
      category: "mobile",
      shortDescription: "We bring the detail to your driveway.",
      longDescription:
        "Full detailing services delivered to your home or workplace. Our self-contained mobile unit carries its own water and power, so all we need is a parking spot.",
      includes: [
        "Self-contained water and power supply",
        "Exterior or interior packages available",
        "Service at your home or workplace",
        "Same premium products as the shop",
        "Flexible scheduling across the service area",
      ],
      excludes: ["Multi-day paint correction (book in-shop)", "Service outside the listed coverage area"],
      priceFrom: 200,
      currency: "CAD",
      duration: "Varies by service",
      requiresDeposit: false,
      depositAmount: 0,
      depositRefundable: false,
      depositRefundWindowHours: 0,
      featured: true,
    },
  ],

  // Booking policy
  booking: {
    minLeadTimeHours: 48,
    cancellationPolicy: "Free cancellation up to 24 hours before your appointment.",
    refundPolicy:
      "Booking deposits for paint correction and ceramic coating are fully refundable up to 48 hours before your scheduled service.",
    depositExplanation:
      "Premium services require a refundable deposit to secure your slot. The deposit is fully credited toward your final invoice on the day of service.",
    // Available appointment start times (local), filtered against operating hours.
    dailySlots: ["08:00", "10:00", "12:00", "14:00", "16:00"],
  },

  // SEO
  seo: {
    siteUrl: "https://silverbackdetailing.ca",
    defaultTitle: "Silverback Detailing | Premium Car Detailing in Hamilton, ON",
    titleTemplate: "%s | Silverback Detailing",
    defaultDescription:
      "Showroom-grade car detailing, paint correction, and ceramic coating in Hamilton, Ontario. In-shop and mobile service. Book online.",
    keywords: [
      "car detailing Hamilton",
      "paint correction Hamilton",
      "ceramic coating Hamilton",
      "mobile detailing Hamilton",
      "auto detailing Burlington",
      "car detailing Ancaster",
      "Silverback Detailing",
    ],
    ogImage: "/og-default.jpg",
    twitterHandle: "@silverbackdetail",
    locale: "en_CA",
  },

  // Trust signals
  trust: {
    yearsInBusiness: 1,
    carsDetailed: 500,
    googleRating: 5.0,
    reviewCount: 47,
    certifications: ["Gtechniq Accredited", "IDA Certified"],
  },
} as const;

export type BusinessConfig = typeof businessConfig;
export type Service = (typeof businessConfig.services)[number];
export type ServiceArea = (typeof businessConfig.serviceAreas)[number];
export type DayHours = { open: string; close: string; closed: boolean };
