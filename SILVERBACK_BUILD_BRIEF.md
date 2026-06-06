# Silverback Detailing — Build Brief for Claude Code

## TL;DR Prompt (paste this first into Claude Code)

> Build a production-grade luxury car detailing website for **Silverback Detailing** in Hamilton, Ontario. **FIRST: Activate the `ui-ux-pro-max` skill (already installed) and generate a persisted design system for this premium car detailing brand before writing any styling code.** Then build using **Next.js 16.2+ LTS** (App Router, React 19, Turbopack), TypeScript strict, Tailwind CSS v4.2+, shadcn/ui (latest), **GSAP 3.13+ with @gsap/react** (now 100% free including all plugins like ScrollTrigger and SplitText since April 2025), Lenis 1.3+ smooth scroll (using `lenis/react` adapter), **Motion v12** (formerly Framer Motion, now imported from `motion/react`), React Hook Form + Zod, Stripe for refundable booking deposits, Resend + React Email for transactional email, and Supabase for booking storage. The signature feature is a scroll-driven cinematic hero video with synchronized GSAP text reveals that delivers an immediate WOW moment. The site must hit Lighthouse 95+, implement comprehensive SEO + GEO (Generative Engine Optimization), and pull all business data from a single centralized config file at `lib/config/business.ts`. Follow the full spec in this brief. Deploy target: Vercel. Domain: silverbackdetailing.ca. Build step by step, asking for clarification only when blocked.

## Version Lock (verified June 2026)

| Package | Version | Notes |
|---------|---------|-------|
| next | ^16.2.7 | LTS, Next.js 15 EOL Oct 2026 |
| react | ^19.2 | With React Compiler |
| react-dom | ^19.2 | Match React |
| typescript | ^5.6+ | Strict mode |
| tailwindcss | ^4.2+ | CSS-first config, no JS config file needed |
| @tailwindcss/postcss | ^4.2+ | PostCSS plugin |
| shadcn (CLI) | latest | Use new-york style |
| gsap | ^3.13 | NOW 100% FREE including all plugins |
| @gsap/react | ^2.1+ | Official React hook (useGSAP) |
| motion | ^12 | Renamed from framer-motion |
| lenis | ^1.3.23 | Import React adapter from `lenis/react` |
| react-hook-form | ^7.x | Latest |
| zod | ^3.x | Latest |
| stripe | latest | Server SDK |
| @stripe/stripe-js | latest | Client SDK |
| resend | latest | Email |
| @react-email/components | latest | Email templates |
| @supabase/supabase-js | latest | DB client |
| @supabase/ssr | latest | App Router auth helpers |

---

## 0. REQUIRED FIRST STEP: Activate UI UX Pro Max Skill

Before scaffolding the project, before installing dependencies, before writing any styling code, **Claude Code must activate the `ui-ux-pro-max` skill** (already installed on this machine, repo: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill).

### Why

The skill contains 161 industry-specific reasoning rules, 67 UI styles, 161 color palettes, and 57 font pairings. For a premium car detailing brand, it will surface design decisions that I cannot reliably specify from outside the project. Its output supersedes the placeholder design tokens later in this brief.

### What to do

Run the design system generator with these exact arguments and persist the output:

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
  "premium luxury car detailing automotive service" \
  --design-system \
  --persist \
  -p "Silverback Detailing" \
  -f markdown
```

This creates `design-system/MASTER.md` in the project root. That file becomes **the single source of truth for all visual design decisions**: pattern, style, colors, typography, key effects, anti-patterns, and the pre-delivery checklist.

### After generation

1. Read `design-system/MASTER.md` carefully.
2. If the skill recommends colors, typography, or styling that differ from Section 12 of this brief, **prefer the skill's recommendations**. Section 12 contains my placeholder defaults; the skill has industry-tuned data.
3. Update `lib/config/business.ts` so it references the design tokens from the MASTER.md (colors as CSS variables, font choices, etc.).
4. Apply the skill's pre-delivery checklist at the end of every page build.
5. Respect the skill's anti-patterns list (it will flag things to avoid for this industry, like dated effects or wrong moods).

### Page-specific overrides

For pages with unique visual requirements (the hero, the booking flow), also generate a page-specific override:

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py \
  "premium luxury car detailing automotive service" \
  --design-system \
  --persist \
  -p "Silverback Detailing" \
  --page "hero"
```

This creates `design-system/pages/hero.md`. When building the hero, check the page file first; its rules override MASTER.

### Reconciliation rule

If a recommendation in this brief conflicts with the skill's output, treat it as follows:

| Conflict type | Resolution |
|---------------|------------|
| Design tokens (colors, fonts, spacing) | Skill wins |
| Animation library choice | Brief wins (GSAP + Motion + Lenis is locked) |
| Tech stack (Next.js, Tailwind v4) | Brief wins |
| Page structure (which sections, which routes) | Brief wins |
| Section content patterns (hero pattern, social proof placement) | Skill wins |
| Booking flow logic | Brief wins |
| Accessibility and motion preferences | Skill's pre-delivery checklist wins |

In short: **the skill controls the LOOK and FEEL; the brief controls the STACK and FUNCTIONALITY**.

---

## 1. Project Goal

Deliver a website that looks and feels like a $10K+ premium agency build. The site must:

1. Stop the visitor in their tracks within 3 seconds (scroll-driven hero video).
2. Communicate trust and craftsmanship through cinematic visuals and motion.
3. Convert visitors into paid booking deposits for premium services.
4. Be fully editable from a single business config file (no hunting through code to change a phone number).
5. Rank well on Google AND get cited by AI search engines (ChatGPT, Perplexity, Google AI Overviews, Gemini).

## 2. Business Information

| Field | Value |
|-------|-------|
| Company | Silverback Detailing |
| Location | Hamilton, Ontario, Canada |
| Service area | Hamilton, Burlington, Ancaster, Stoney Creek, Dundas, Waterdown |
| Services | Exterior detail, interior detail, paint correction, ceramic coating, mobile detailing |
| Premium services (require deposit) | Paint Correction, Ceramic Coating |
| Mobile detailing | Yes, offered separately |
| Booking deposit | Refundable up to 48 hours before service |

## 3. Tech Stack (verified latest as of June 2026)

### Core
- **Next.js 16.2+ LTS** with App Router, React Server Components, Server Actions, Turbopack stable
- **React 19.2+** with React Compiler enabled (auto-memoization, no more manual `useMemo`/`useCallback`)
- **TypeScript 5.6+** strict mode, no `any`
- **Tailwind CSS v4.2+** with CSS-first config (theme in `globals.css`, no `tailwind.config.ts` needed unless extending)
- **shadcn/ui** (latest, new-york style, OKLCH colors)

### Animation (use ALL THREE, for different layers)
- **GSAP 3.13+** with `@gsap/react` for the scroll-driven hero video, pinned sequences, SplitText reveals, and any orchestrated timeline work. **GSAP and ALL its plugins are now 100% free including for commercial use** as of April 30, 2025 (Webflow acquired GreenSock and freed it). Install via npm directly, no Club GSAP account or token needed.
- **Motion v12** (formerly Framer Motion, now just `motion`) for component-level micro-interactions, page transitions, hover states. Import from `motion/react`, not `framer-motion`.
- **Lenis 1.3.23+** for buttery smooth scroll across the whole site. Use the React adapter: `import { ReactLenis } from 'lenis/react'`. The old `@studio-freight/react-lenis` package is retired. Note that the `smoothTouch` option is deprecated, do not use it.

### Critical integration pattern (Lenis + GSAP ScrollTrigger)
```typescript
// app/providers/SmoothScrollProvider.tsx
'use client'
import { ReactLenis, useLenis } from 'lenis/react'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      }}
    >
      {children}
    </ReactLenis>
  )
}
```

In your GSAP components, sync Lenis with ScrollTrigger:
```typescript
const lenis = useLenis(ScrollTrigger.update)
useEffect(() => {
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}, [lenis])
```

### Forms & Validation
- **React Hook Form 7+** with **Zod** schema validation via `@hookform/resolvers`
- Multi-step booking with persisted state via URL search params

### Payments & Email
- **Stripe Checkout** for booking deposits (refundable)
- **Resend** + **React Email** components for transactional email templates (booking confirmation, owner notification, refund confirmation)

### Data
- **Supabase** (Postgres) for booking storage, customer records, availability slots
- Use Supabase Row Level Security
- Use `@supabase/ssr` for App Router auth helpers (the `@supabase/auth-helpers-nextjs` package is deprecated)
- Make storage swappable via `STORAGE_PROVIDER` env var so initial launch can use email-only if Supabase isn't ready

### Deployment
- Vercel
- Enable Vercel Analytics and Speed Insights
- Edge runtime where compatible
- Use Turbopack for both `next dev` and `next build` (now stable in 16.x)

## 4. Centralized Business Config (CRITICAL)

Create `lib/config/business.ts` as the single source of truth. Every page, component, schema markup, and meta tag must read from this file. Changing a phone number = one edit.

```typescript
// lib/config/business.ts

export const businessConfig = {
  // Identity
  name: "Silverback Detailing",
  legalName: "Silverback Detailing Inc.",
  tagline: "Detail beyond the surface.",
  shortDescription: "Premium car detailing in Hamilton, Ontario.",
  longDescription: "Silverback Detailing delivers showroom-grade detailing, paint correction, and ceramic coating across Hamilton and the surrounding GTA. In-shop and mobile service available.",
  foundedYear: 2024,

  // Contact
  contact: {
    phone: "+1-905-000-0000",
    phoneDisplay: "(905) 000-0000",
    email: "info@silverbackdetailing.ca",
    bookingEmail: "book@silverbackdetailing.ca",
    supportEmail: "support@silverbackdetailing.ca",
  },

  // Physical address
  address: {
    street: "TBD",
    city: "Hamilton",
    province: "Ontario",
    provinceCode: "ON",
    postalCode: "TBD",
    country: "Canada",
    countryCode: "CA",
    coordinates: { lat: 43.2557, lng: -79.8711 },
    googleMapsUrl: "https://maps.google.com/?q=Silverback+Detailing+Hamilton",
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
    { name: "Hamilton", primary: true },
    { name: "Burlington", primary: false },
    { name: "Ancaster", primary: false },
    { name: "Stoney Creek", primary: false },
    { name: "Dundas", primary: false },
    { name: "Waterdown", primary: false },
  ],

  // Services catalog
  services: [
    {
      slug: "exterior-detail",
      name: "Exterior Detail",
      category: "standard",
      shortDescription: "Hand wash, decontamination, and protective wax.",
      longDescription: "Full exterior hand wash with foam pre-soak, iron decontamination, clay bar treatment, and a layer of premium carnauba wax or sealant for 3-6 months of protection.",
      priceFrom: 150,
      currency: "CAD",
      duration: "2-3 hours",
      requiresDeposit: false,
      depositAmount: 0,
      featured: false,
    },
    {
      slug: "interior-detail",
      name: "Interior Detail",
      category: "standard",
      shortDescription: "Deep cleaning, conditioning, and odour neutralization.",
      longDescription: "Complete interior vacuum, steam clean, leather conditioning, plastic restoration, and ozone odour treatment.",
      priceFrom: 180,
      currency: "CAD",
      duration: "3-4 hours",
      requiresDeposit: false,
      depositAmount: 0,
      featured: false,
    },
    {
      slug: "paint-correction",
      name: "Paint Correction",
      category: "premium",
      shortDescription: "Restore your paint to better-than-new condition.",
      longDescription: "Multi-stage machine polishing to remove swirls, scratches, oxidation, and water spots. Includes paint depth measurement, masking, and finishing polish for mirror-clear gloss.",
      priceFrom: 800,
      currency: "CAD",
      duration: "1-2 days",
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
      longDescription: "Professional ceramic coating application with paint correction prep. Hydrophobic, UV-resistant, and chemically resistant. 2, 5, or 9 year packages available.",
      priceFrom: 1200,
      currency: "CAD",
      duration: "2-3 days",
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
      longDescription: "Full detailing services delivered to your home or workplace. Self-contained mobile unit with water and power. Available across Hamilton and surrounding areas.",
      priceFrom: 200,
      currency: "CAD",
      duration: "Varies by service",
      requiresDeposit: false,
      depositAmount: 0,
      featured: true,
    },
  ],

  // Booking policy
  booking: {
    minLeadTimeHours: 48,
    cancellationPolicy: "Free cancellation up to 24 hours before your appointment.",
    refundPolicy: "Booking deposits for paint correction and ceramic coating are fully refundable up to 48 hours before your scheduled service.",
    depositExplanation: "Premium services require a refundable deposit to secure your slot. The deposit is fully credited toward your final invoice on the day of service.",
  },

  // SEO
  seo: {
    siteUrl: "https://silverbackdetailing.ca",
    defaultTitle: "Silverback Detailing | Premium Car Detailing in Hamilton, ON",
    titleTemplate: "%s | Silverback Detailing",
    defaultDescription: "Showroom-grade car detailing, paint correction, and ceramic coating in Hamilton, Ontario. In-shop and mobile service. Book online.",
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
export type Service = typeof businessConfig.services[number];
```

Also create a derived `lib/config/site.ts` that re-exports common helpers like `getServiceBySlug()`, `getFeaturedServices()`, `formatPhoneForLink()`, `getOpenStatus()`.

## 5. Pages Required

| Route | Purpose |
|-------|---------|
| `/` | Hero video, services overview, why us, gallery, testimonials, CTA |
| `/services` | All services listing with pricing |
| `/services/[slug]` | Individual service detail page (one per service in config) |
| `/mobile-detailing` | Dedicated mobile detailing landing page |
| `/gallery` | Before/after showcase with image slider |
| `/about` | Brand story, philosophy, credentials |
| `/book` | Multi-step booking flow |
| `/contact` | Contact form, map, hours |
| `/faq` | FAQ with FAQPage schema |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/booking/[id]/confirmation` | Post-booking confirmation page |

## 6. The Hero Scroll Experience (the WOW moment)

This is the centerpiece of the entire site. Get this right and everything else compounds.

### Implementation

1. Place the cinematic transformation video at `public/videos/hero-transformation.mp4` (encoded H.264, under 8MB, 1080p, no audio track needed since muted)
2. Create `components/hero/ScrollDrivenHero.tsx` as a client component
3. Use GSAP ScrollTrigger to pin a 100vh section with a scroll height of 300vh (3 viewport heights of scroll trigger the 8 seconds of video)
4. Scrub `video.currentTime` based on scroll progress, using `requestAnimationFrame` inside GSAP's `onUpdate`
5. Layer text overlays that animate IN at specific scroll progress percentages

### Text reveal sequence (synchronized to scroll progress)

| Scroll % | Text | Animation |
|----------|------|-----------|
| 0-15% | "Every car carries history." | Fade up, letter-spacing expand, Fraunces 7xl |
| 25-40% | "Scratches. Swirls. Dust. Time." | Stagger words in one by one |
| 50-65% | "We work where others stop looking." | Mask reveal from bottom |
| 75-90% | "Reborn." | Massive Fraunces 9xl, scale from 0.8 to 1, single word |
| 95-100% | CTA: "Book Your Transformation" | Slide up with shadow bloom |

### Video element requirements

```tsx
<video
  ref={videoRef}
  src="/videos/hero-transformation.mp4"
  playsInline
  muted
  preload="auto"
  className="w-full h-full object-cover"
/>
```

Set `currentTime` programmatically via GSAP. Never use `play()`. Use `requestVideoFrameCallback` for smooth scrubbing on browsers that support it.

### Reduced motion fallback

If `prefers-reduced-motion: reduce`, swap the scroll-scrub for a single auto-playing loop and reveal all text at once on scroll into view.

## 7. Booking Flow

`/book` is a multi-step form. Use shadcn/ui components. Persist state in URL search params so users can refresh without losing progress.

### Steps

1. **Service Selection** — Grid of service cards, click to select
2. **Vehicle Info** — Year, Make, Model, Colour, Condition (dropdown), Notes
3. **Location** — Radio: "Bring to shop" or "Mobile service at my address"; if mobile, capture address with Google Places autocomplete
4. **Date and Time** — Calendar picker with available slots queried from `/api/availability`
5. **Customer Info** — Name, Email, Phone
6. **Review and Deposit** (only if `service.requiresDeposit === true`)
   - Show full summary
   - Display deposit amount and refund policy clearly
   - Stripe Checkout for deposit payment
7. **Confirmation** — Booking ID, calendar invite (ICS), email sent

For services without deposits, skip Step 6 and complete on Step 5 submission.

### Deposit handling

- Stripe Checkout creates a `payment_intent` with metadata linking to booking ID
- Webhook at `/api/stripe/webhook` confirms payment and updates booking status to "confirmed"
- For refunds (cancellation within window): use Stripe API to refund the deposit
- For cancellations within 48h: deposit forfeited per policy (configurable in business config)

## 8. API Routes / Server Actions

```
app/api/
├── bookings/
│   ├── route.ts                    POST: create booking record
│   └── [id]/route.ts                GET/PATCH single booking
├── availability/route.ts            GET: available slots for date range
├── stripe/
│   ├── checkout/route.ts            POST: create checkout session
│   └── webhook/route.ts             POST: handle Stripe events
└── contact/route.ts                 POST: contact form submission
```

Use Server Actions where possible instead of API routes for form submissions.

## 9. Email Templates (via Resend)

1. **Customer booking confirmation** — Branded HTML email with service details, deposit receipt, ICS calendar attachment, prep instructions, refund policy
2. **Owner notification** — New booking alert sent to `business.contact.bookingEmail` with one-click confirm/reject links
3. **Refund confirmation** — Sent when refund is processed
4. **24h reminder** — Sent 24 hours before appointment

Use React Email for templates so they match the site branding.

## 10. SEO Requirements

### Standard SEO
- Use Next.js Metadata API in every route segment
- Generate `app/sitemap.ts` (dynamic, includes all service pages)
- Generate `app/robots.ts`
- Dynamic OG images via `app/opengraph-image.tsx`
- Canonical URLs everywhere
- All images via `next/image` with proper sizes
- All fonts via `next/font` (self-hosted)

### Schema.org structured data (JSON-LD)
- `LocalBusiness` with `AutoDetailing` subtype on home page
- `Service` schema on each service detail page with `Offer` and `PriceSpecification`
- `BreadcrumbList` on all sub-pages
- `FAQPage` on /faq
- `Review` and `AggregateRating` from Google data
- `GeoCoordinates` and `areaServed` in LocalBusiness

### Local SEO (Hamilton focus)
- Target keyword integration: "car detailing Hamilton", "paint correction Hamilton", etc.
- Service area pages: create city-specific landing pages for Burlington, Ancaster, Stoney Creek using a `[city]` dynamic route reading from `businessConfig.serviceAreas`
- NAP (Name, Address, Phone) consistency everywhere
- Embedded Google Map on /contact

## 11. GEO (Generative Engine Optimization)

This is what makes the site cited by ChatGPT, Perplexity, Gemini, and Google AI Overviews.

### Required files
- `public/llms.txt` — Concise site map for AI crawlers (URLs and one-line descriptions)
- `public/llms-full.txt` — Full content dump of services, pricing, policies, FAQs in plain text

### Content structure for AI extractability
- Use semantic HTML (`<article>`, `<section>`, `<aside>`, `<nav>`)
- Clean H1, H2, H3 hierarchy (one H1 per page)
- Question-format headings where natural: "How does paint correction work?", "What does ceramic coating cost in Hamilton?"
- Direct factual answers in the first sentence after each heading (AI engines extract these)
- Include explicit "key facts" lists in service pages: duration, price, what's included, what's NOT included
- FAQPage schema with conversational Q&A on every service page

### E-E-A-T signals (Experience, Expertise, Authoritativeness, Trust)
- Cite certifications (Gtechniq Accredited, IDA Certified) from `businessConfig.trust.certifications`
- Show years in business, cars detailed, review counts
- Include owner/founder bio on /about with credentials
- Display Google Review widget with real ratings

### Speed (Core Web Vitals)
- LCP under 2.5s (preload hero video poster image, defer video itself)
- INP under 200ms
- CLS at or near 0
- Use static generation everywhere possible
- Stream booking confirmation pages

## 12. Design System

### IMPORTANT: This section is a fallback only

If Section 0 has been executed (it should have been), the **actual design system lives in `design-system/MASTER.md`** generated by the ui-ux-pro-max skill. That file is authoritative.

Everything below is a placeholder default in case the skill is unavailable. Do not apply this section if MASTER.md exists. Read MASTER.md and apply its recommendations instead.

### Fallback Colour Palette (only if skill output is unavailable)

Register in `globals.css` via Tailwind v4's `@theme` directive (see Typography section below for full setup):

```css
@theme {
  --color-ink: #0A0A0A;           /* background primary */
  --color-ink-2: #141414;          /* background secondary */
  --color-ink-3: #1F1F1F;          /* borders, cards */
  --color-silver: #C0C0C0;         /* accent metallic */
  --color-silver-bright: #E8E8E8;  /* highlights */
  --color-bone: #F5F5F5;           /* primary text */
  --color-bone-muted: #8A8A8A;     /* secondary text */
  --color-accent: #C8102E;         /* hot accent for CTAs (deep red) */
  --color-accent-hover: #A30D24;
}
```

Use as `bg-ink`, `text-bone`, `border-ink-3`, etc.

### Fallback Typography (only if skill output is unavailable)

```typescript
// app/layout.tsx
import { Fraunces, Inter_Tight } from 'next/font/google'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})
const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})
```

In Tailwind v4, register the fonts in your CSS-first config (no `tailwind.config.ts` needed):

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --font-display: var(--font-display);
  --font-body: var(--font-body);
  --color-ink: #0A0A0A;
  --color-ink-2: #141414;
  --color-bone: #F5F5F5;
  --color-silver: #C0C0C0;
  --color-accent: #C8102E;
}
```

- **Display:** Fraunces (serif, for hero text and major headings)
- **Body:** Inter Tight (modern, clean sans)
- Type scale: 12, 14, 16, 18, 20, 24, 32, 48, 64, 96, 128
- Letter-spacing: tight on large display, normal on body

### Spacing scale
4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192

### Layout
- Max container width: 1440px
- Section padding: 96px desktop, 64px tablet, 48px mobile
- Generous negative space, never crowded

## 13. Animation Standards

### GSAP (heavy work, paired with @gsap/react)

Use the `useGSAP` hook from `@gsap/react` for all GSAP work in React components. It handles cleanup automatically and works perfectly with React 19.

Use GSAP for:
- Hero scroll-scrub (ScrollTrigger pinning + video currentTime scrubbing)
- Pinned sections (services reveal, before/after sequence)
- Number counters (cars detailed, years, ratings) via custom GSAP timeline
- Marquee testimonials (infinite repeat with GSAP)
- Text reveals with SplitText plugin (now FREE) - perfect for hero text and section headings

```typescript
'use client'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)
```

### Motion (component-level work, formerly Framer Motion)

The package is `motion`. Import everything from `motion/react`:

```typescript
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
```

Use Motion for:
- Hover states on service cards (subtle scale + shadow + tilt)
- Page transitions (fade + slight slide)
- Modal/Dialog enter and exit via `AnimatePresence`
- Stagger reveals for grids on viewport entry (use `whileInView`)
- Loading states and skeletons
- Drag interactions in the BeforeAfterSlider

### Lenis (smooth scroll)
- Wrap entire app in `<ReactLenis root>` from `lenis/react` at the layout level
- Sync Lenis with GSAP ScrollTrigger using the pattern in Section 3
- Disable Lenis on `/book` if it interferes with form interactions
- Lenis automatically respects `prefers-reduced-motion`

### Standards
- All animations at 60fps minimum (Turbopack and React Compiler help here)
- Respect `prefers-reduced-motion: reduce` everywhere (use `useReducedMotion()` from Motion)
- No animation longer than 800ms (snappy feel)
- Use spring physics on micro-interactions (Motion's spring), eased curves on macro (GSAP)
- React Compiler handles memoization, but still wrap heavy animation callbacks in `useCallback` if performance profiling shows issues

## 14. Components to Build

```
components/
├── ui/                          # shadcn primitives
├── layout/
│   ├── Header.tsx               # transparent over hero, solid on scroll
│   ├── Footer.tsx               # rich footer with sitemap, trust badges
│   └── MobileNav.tsx
├── hero/
│   ├── ScrollDrivenHero.tsx     # the centerpiece
│   └── HeroTextReveal.tsx
├── sections/
│   ├── ServicesGrid.tsx
│   ├── WhyUs.tsx
│   ├── BeforeAfterShowcase.tsx
│   ├── TestimonialMarquee.tsx
│   ├── StatsCounter.tsx
│   ├── CTASection.tsx
│   └── ServiceAreaMap.tsx
├── booking/
│   ├── BookingStepper.tsx
│   ├── ServiceSelector.tsx
│   ├── VehicleForm.tsx
│   ├── DateTimePicker.tsx
│   ├── CustomerForm.tsx
│   ├── DepositCheckout.tsx
│   └── BookingConfirmation.tsx
├── shared/
│   ├── ServiceCard.tsx          # 3D tilt on hover
│   ├── BeforeAfterSlider.tsx    # drag to reveal
│   ├── CallToAction.tsx
│   ├── TrustBadges.tsx
│   └── CustomCursor.tsx         # optional, desktop only
└── animations/
    ├── TextReveal.tsx           # GSAP SplitText helper
    ├── FadeUp.tsx               # Framer Motion wrapper
    └── Magnetic.tsx             # magnetic buttons
```

## 15. File Structure

```
silverback/
├── design-system/             # GENERATED BY ui-ux-pro-max SKILL (SOURCE OF TRUTH FOR DESIGN)
│   ├── MASTER.md              # Global design system: colors, typography, spacing, components
│   └── pages/
│       └── hero.md            # Page-specific overrides (only deviations from MASTER)
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx
│   │   ├── services/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── mobile-detailing/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── about/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── contact/page.tsx
│   │   └── service-areas/[city]/page.tsx
│   ├── (booking)/
│   │   ├── book/page.tsx
│   │   └── booking/[id]/confirmation/page.tsx
│   ├── (legal)/
│   │   ├── privacy/page.tsx
│   │   └── terms/page.tsx
│   ├── api/
│   ├── providers/
│   │   └── SmoothScrollProvider.tsx
│   ├── layout.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── opengraph-image.tsx
│   └── globals.css           # Tailwind v4 @theme config lives here
├── components/
├── lib/
│   ├── config/
│   │   ├── business.ts          # THE SOURCE OF TRUTH
│   │   └── site.ts              # derived helpers
│   ├── stripe/
│   ├── email/
│   ├── supabase/
│   ├── animations/
│   │   └── gsap-setup.ts        # plugin registration
│   └── utils.ts
├── public/
│   ├── videos/
│   │   └── hero-transformation.mp4
│   ├── images/
│   ├── llms.txt
│   ├── llms-full.txt
│   └── favicon.ico
├── types/
├── .env.example
├── postcss.config.mjs        # for @tailwindcss/postcss
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

Note: With Tailwind CSS v4 CSS-first config, there is no `tailwind.config.ts` file unless you need to extend non-theme settings (rare). All theme tokens go in `app/globals.css` under `@theme`.

## 16. Environment Variables (.env.example)

```env
# Site
NEXT_PUBLIC_SITE_URL=https://silverbackdetailing.ca

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Email
RESEND_API_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Google
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# Feature flags
STORAGE_PROVIDER=supabase  # or "email"
```

## 17. Build Order (suggested)

1. **Activate ui-ux-pro-max skill and generate `design-system/MASTER.md`** (Section 0)
2. Scaffold Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui
3. Create `lib/config/business.ts` + types + helpers
4. Apply design tokens from `design-system/MASTER.md` to `globals.css` (Tailwind v4 `@theme` directive)
5. Load fonts per MASTER.md typography recommendation
6. Header + Footer + mobile nav (apply skill's pattern recommendations)
7. ScrollDrivenHero component with placeholder video (apply skill's hero pattern)
8. Generate `design-system/pages/hero.md` if hero needs special overrides
9. Home page sections (services grid, why us, stats, testimonials, CTA)
10. Services listing + dynamic service detail pages
11. Mobile detailing, gallery, about, FAQ, contact pages
12. Booking flow with Stripe deposit integration
13. Email templates with Resend
14. Supabase booking storage
15. SEO: metadata, schema, sitemap, robots, OG images
16. GEO: llms.txt, llms-full.txt, semantic content polish
17. Service area dynamic pages
18. Run the skill's pre-delivery checklist against every page
19. Performance audit, Lighthouse optimization
20. Accessibility audit (WCAG AA)
21. Cross-browser testing, mobile testing
22. Deploy to Vercel, configure domain

## 18. Definition of Done

- [ ] `design-system/MASTER.md` was generated and applied
- [ ] The ui-ux-pro-max skill's pre-delivery checklist passes on every page
- [ ] All anti-patterns flagged by the skill have been avoided
- [ ] Lighthouse 95+ on Performance, Accessibility, Best Practices, SEO
- [ ] Booking flow works end-to-end: select service → fill info → pay deposit → receive confirmation email → calendar invite attached
- [ ] Refund flow works: cancellation within window triggers Stripe refund + refund email
- [ ] All content pulls from `lib/config/business.ts` (verify by changing the phone number once and seeing it update everywhere)
- [ ] Hero video scrubs smoothly on scroll on iPhone Safari at 60fps
- [ ] All animations respect `prefers-reduced-motion`
- [ ] Schema validates in Google Rich Results Test
- [ ] llms.txt and llms-full.txt are accessible and well-formed
- [ ] Mobile experience matches desktop polish
- [ ] All forms have proper error states and keyboard navigation
- [ ] Booking confirmation page can be visited directly via URL (idempotent)
- [ ] WCAG AA contrast on all text
- [ ] Deployed to Vercel with custom domain
- [ ] README documents how to edit business config and add a new service
- [ ] README documents how to regenerate `design-system/MASTER.md` if branding changes

## 19. Critical Notes for Claude Code

- **Activate the ui-ux-pro-max skill FIRST.** Generate `design-system/MASTER.md` before any styling code is written. This is not optional. See Section 0.
- **Never use em dashes** in any user-facing content, ticket descriptions, or comments. Use periods, commas, or colons.
- **The business config is sacred.** Never hardcode a phone number, email, address, service name, or price anywhere except in `lib/config/business.ts`.
- **The design system is also sacred.** Once `design-system/MASTER.md` is generated and approved, never hardcode colors, fonts, or spacing outside of CSS variables that reference it.
- **Animations must feel intentional, not decorative.** Every animation should serve a purpose: drawing attention, conveying state change, or guiding the eye.
- **Mobile is not an afterthought.** Hero scroll-scrub must work on mobile Safari. Booking flow must be thumb-friendly.
- **The hero video is THE moment.** Spend disproportionate time perfecting that experience.
- **Ask before installing exotic dependencies.** Stick to the stack listed above unless there's a strong reason.

### Package gotchas to avoid

1. **Do NOT install `framer-motion`.** It's been renamed. Install `motion` instead. Import from `motion/react`.
2. **Do NOT install `@studio-freight/react-lenis`.** It's retired. Install `lenis` and import from `lenis/react`.
3. **Do NOT install `@supabase/auth-helpers-nextjs`.** It's deprecated. Use `@supabase/ssr`.
4. **Do NOT pay for Club GSAP or use a license token.** GSAP has been 100% free since April 30, 2025 (Webflow acquired GreenSock). All plugins including SplitText, ScrollTrigger, MorphSVG, ScrollSmoother are free via standard npm install.
5. **Do NOT create a `tailwind.config.ts` file by default.** Tailwind v4 uses CSS-first config in `globals.css` via `@theme`. Only create the config file if extending non-theme behavior.
6. **Do NOT use the old Next.js Pages Router.** App Router only.
7. **Do NOT use the deprecated `smoothTouch` option** in Lenis. It was removed.
8. **React 19's React Compiler** handles memoization automatically. Don't reflexively add `useMemo`/`useCallback` everywhere.

### Recommended setup commands

```bash
# Scaffold
npx create-next-app@latest silverback --typescript --tailwind --app --turbopack --no-src-dir

# Animation
npm install gsap @gsap/react motion lenis

# UI
npx shadcn@latest init  # choose new-york style, OKLCH colors

# Forms
npm install react-hook-form zod @hookform/resolvers

# Payments
npm install stripe @stripe/stripe-js

# Email
npm install resend @react-email/components

# Database
npm install @supabase/supabase-js @supabase/ssr
```

---

End of brief. Build with confidence.
