/**
 * THE SOURCE OF TRUTH.
 *
 * Every page, component, schema block, email, and meta tag reads from this file.
 * Changing a phone number, price, or service is a single edit here. Never hardcode
 * any of this data anywhere else in the codebase.
 *
 * Phone, email, address, hours, and all social links below are the real business
 * details (Instagram, Facebook, WhatsApp, Google). WhatsApp uses the business
 * number in wa.me format.
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
    phone: "+1-905-519-6290",
    phoneDisplay: "(905) 519-6290",
    email: "silverbackvehicledetailing@gmail.com",
    bookingEmail: "silverbackvehicledetailing@gmail.com",
    supportEmail: "silverbackvehicledetailing@gmail.com",
  },

  // Physical address
  address: {
    street: "981 Main Street West",
    city: "Hamilton",
    province: "Ontario",
    provinceCode: "ON",
    postalCode: "L8S 1A8",
    country: "Canada",
    countryCode: "CA",
    coordinates: { lat: 43.25778, lng: -79.90484 },
    googleMapsUrl: "https://maps.google.com/?q=981+Main+Street+West+Hamilton+Ontario",
  },

  // Operating hours (24h format)
  hours: {
    monday: { open: "10:00", close: "21:00", closed: false },
    tuesday: { open: "10:00", close: "21:00", closed: false },
    wednesday: { open: "10:00", close: "21:00", closed: false },
    thursday: { open: "10:00", close: "21:00", closed: false },
    friday: { open: "10:00", close: "21:00", closed: false },
    saturday: { open: "10:00", close: "21:00", closed: false },
    sunday: { open: "10:00", close: "21:00", closed: false },
  },

  // Social
  social: {
    instagram: { handle: "@silverbackautodetailing", url: "https://www.instagram.com/silverbackautodetailing" },
    facebook: { handle: "Silverback Auto Detailing", url: "https://www.facebook.com/profile.php?id=61591317153492" },
    // WhatsApp uses the business phone number in wa.me format (digits only, no +).
    whatsapp: { display: "(905) 519-6290", url: "https://wa.me/19055196290" },
    google: { url: "https://share.google/EGvtHS8ocuoZDqKjK" },
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
      image: "/images/services-detailing/exterior.jpg",
      gallery: [],
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
      mobileAvailable: true,
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
      image: "/images/services-detailing/interior.webp",
      gallery: [],
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
      mobileAvailable: true,
      requiresDeposit: false,
      depositAmount: 0,
      depositRefundable: false,
      depositRefundWindowHours: 0,
      featured: false,
    },
    {
      slug: "headlight-restoration",
      name: "Headlight Restoration",
      category: "standard",
      image: "/images/services-detailing/headlight-restoration.webp",
      gallery: [],
      shortDescription: "Cut through yellowed, hazy lenses for clear, safer headlights.",
      longDescription:
        "Oxidized headlights scatter light and dull the whole front of the car. We wet-sand, multi-stage machine polish, and seal each lens back to optical clarity, then lock it in with a UV-resistant coating so they stay clear far longer than a quick buff.",
      includes: [
        "Wet-sanding of oxidized, yellowed lenses",
        "Multi-stage machine polishing to clarity",
        "Both headlights restored",
        "UV-resistant protective sealant",
        "Improved night-time visibility and safety",
      ],
      excludes: ["Cracked or internally fogged lenses (replacement quoted separately)", "Tail light tinting"],
      priceFrom: 120,
      currency: "CAD",
      duration: "1 to 2 hours",
      mobileAvailable: true,
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
      image: "/images/services-detailing/gloss-enhancer.webp",
      gallery: [],
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
      mobileAvailable: false,
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
      image: "/images/services-detailing/Ceramic-coating.webp",
      gallery: [
        {
          src: "/images/services-detailing/ceramic-sealant-spray.jpg",
          caption: "Hydrophobic in action: water beads up and sheets straight off a freshly coated panel.",
        },
      ],
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
      mobileAvailable: false,
      requiresDeposit: true,
      depositAmount: 250,
      depositRefundable: true,
      depositRefundWindowHours: 48,
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
    dailySlots: ["10:00", "12:00", "14:00", "16:00", "18:00"],
  },

  // SEO
  seo: {
    siteUrl: "https://silverbackdetail.com",
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

  // Trust signals were removed until they can be backed by verifiable data:
  // Google rating, review count, cars-detailed count, and certifications. When
  // real numbers exist, add a `trust` object back here and re-wire the consumers
  // (StatsCounter, TrustBadges, Footer, schema aggregateRating, about page).

  // Media
  media: {
    // Brand logo, circle crop with transparent corners. Used as the inline mark
    // in the header, footer, and nav lockups.
    logoMark: "/images/logo/silverback-circle.png",
    // Full square badge (dark background). Reserved for share cards and contexts
    // that need a solid backdrop.
    logo: "/images/logo/silverback-logo.png",
    // Desktop hero clip, scrubbed by scroll. Must be all-intra (every frame a
    // keyframe) for smooth seeking:
    // ffmpeg -i in.mp4 -an -g 1 -bf 0 -c:v libx264 -crf 23 -pix_fmt yuv420p -movflags +faststart out.mp4
    heroVideo: "/videos/hero-scrub.mp4",
    // Mobile / reduced-motion hero clip, autoplayed and looped. No scrubbing, so a
    // small standard encode is fine and loads faster on cellular.
    heroVideoMobile: "/videos/hero.mp4",
    // Poster shown before the video paints, and as the permanent base when autoplay
    // is blocked. Extract a strong frame:
    // ffmpeg -ss 2.5 -i in.mp4 -frames:v 1 -q:v 3 public/images/hero-poster.jpg
    heroPoster: "/images/hero-poster.jpg",
  },
} as const;

export type BusinessConfig = typeof businessConfig;
export type Service = (typeof businessConfig.services)[number];
export type ServiceArea = (typeof businessConfig.serviceAreas)[number];
export type DayHours = { open: string; close: string; closed: boolean };
