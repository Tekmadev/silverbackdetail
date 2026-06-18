# Silverback Detailing

A production-grade, luxury car detailing website for **Silverback Detailing** (Hamilton, Ontario). Built with Next.js 16, React 19, Tailwind CSS v4, GSAP, Motion, and Lenis. Features a scroll-driven cinematic hero, a multi-step booking flow with refundable Stripe deposits, transactional email, optional Supabase storage, and comprehensive SEO + GEO.

> Every animation respects `prefers-reduced-motion`, the whole site is dark-mode WCAG-AA, and **all business data lives in one file**: `lib/config/business.ts`.

---

## Tech stack

| Area | Choice |
|------|--------|
| Framework | Next.js 16 (App Router, RSC, Server Actions, Turbopack) |
| UI | React 19, TypeScript (strict), Tailwind CSS v4 (CSS-first `@theme`), shadcn/ui (new-york) |
| Animation | GSAP 3 + `@gsap/react` (scroll hero, counters), Motion v12 (micro-interactions), Lenis (smooth scroll) |
| Forms | React Hook Form + Zod |
| Payments | Stripe Checkout (refundable deposits) |
| Email | Resend + React Email |
| Storage | Supabase (optional, swappable) |
| Analytics | Vercel Analytics + Speed Insights |

---

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — everything has a graceful fallback
npm run dev                  # http://localhost:3000
```

**Nothing is required to run locally.** With no environment variables:

- Bookings complete in **demo mode** (no charge) and reach a working confirmation page.
- Emails are **logged to the server console** instead of being sent.
- The contact map uses a **keyless** Google Maps embed.

### Scripts

```bash
npm run dev     # dev server (Turbopack)
npm run build   # production build (Turbopack)
npm run start   # serve the production build
npm run lint    # eslint
```

---

## Editing business data (the single source of truth)

**`lib/config/business.ts`** drives every page, meta tag, schema block, email, and the booking flow.

- **Change the phone number / email / address:** edit `contact` / `address` in `business.ts`. It updates the header, footer, contact page, schema, emails, and `llms.txt` everywhere at once.
- **Edit hours, social links, trust signals, booking policy:** all in the same file.

### Add a new service

Append an entry to the `services` array in `lib/config/business.ts`:

```ts
{
  slug: "headlight-restoration",      // becomes /services/headlight-restoration
  name: "Headlight Restoration",
  category: "standard",                // "standard" | "premium" | "mobile"
  shortDescription: "Clear, restored headlights.",
  longDescription: "…",
  includes: ["…"],
  excludes: ["…"],
  priceFrom: 120,
  currency: "CAD",
  duration: "1 hour",
  requiresDeposit: false,              // true → adds a deposit step + Stripe checkout
  depositAmount: 0,
  depositRefundable: false,
  depositRefundWindowHours: 0,
  featured: false,
}
```

That's it. The service page, sitemap entry, schema, booking option, `llms.txt`, and navigation update automatically.

---

## Design system

The visual system (colors, typography, spacing, effects, anti-patterns, pre-delivery checklist) lives in **`design-system/MASTER.md`**, with a hero override in `design-system/pages/hero.md`. These were generated from the `ui-ux-pro-max` skill's design intelligence and are the source of truth for look and feel. Tokens are implemented in `app/globals.css` under Tailwind v4 `@theme`.

**To regenerate the design system if branding changes:**

```bash
python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py \
  "premium luxury car detailing automotive service" \
  --design-system --persist -p "Silverback Detailing" -f markdown
```

Then reconcile any new color/type recommendations into `app/globals.css` (`@theme`). The skill controls look and feel; the stack and functionality are fixed.

---

## Integrations (all optional, all graceful)

Set these in `.env.local` (and in Vercel project settings for production). See `.env.example`.

### Stripe (refundable deposits)
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- When set, premium services (paint correction, ceramic coating) route through Stripe Checkout.
- Configure a webhook to `POST /api/stripe/webhook` for events `checkout.session.completed` and `charge.refunded`.
- Refunds: cancelling from the confirmation page within the 48h window refunds the deposit (requires Supabase so the payment reference can be looked up).

### Resend (email)
- `RESEND_API_KEY`, `EMAIL_FROM` (a verified sender on your Resend domain).
- Sends customer confirmation + owner notification on booking, and refund confirmations.

### Supabase (storage) — optional
- `STORAGE_PROVIDER=supabase`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- Run `supabase/schema.sql` to create the `bookings` table (RLS enabled; server uses the service-role key).
- With `STORAGE_PROVIDER=email` (default) bookings are not persisted to a DB — the owner still receives every booking by email, and confirmation pages work via a signed-in-URL booking token.

---

## Booking flow

`/book` is a multi-step form (service → vehicle → location → date/time → details → review/deposit). Progress is saved to `sessionStorage`, and a service can be deep-linked, e.g. `/book?service=ceramic-coating`. Availability is computed from the config's hours, daily slots, and the 48h lead time.

---

## Deploy to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import it in Vercel. Framework preset: **Next.js** (auto-detected).
3. Add environment variables (any subset of `.env.example`) in **Project → Settings → Environment Variables**. The site deploys and runs even with none set.
4. Add the domain `silverbackdetail.com` in **Project → Settings → Domains**.
5. (If using Stripe) add the production webhook endpoint and set `STRIPE_WEBHOOK_SECRET`.

Vercel Analytics and Speed Insights are already wired in `app/layout.tsx`.

---

## The hero video

The scroll-driven hero scrubs `public/videos/hero-transformation.mp4` if present (H.264, < 8 MB, 1080p, muted). **Until you add that file, the hero renders a premium animated fallback** — the scroll-synchronized text sequence carries the moment either way. Drop the video in and it scrubs automatically. Reduced-motion users get a static composition (or an autoplaying loop if a video exists).

---

## Notes

- No `framer-motion` (it's `motion`, imported from `motion/react`). No `@studio-freight/react-lenis` (it's `lenis/react`). No `@supabase/auth-helpers-nextjs` (it's `@supabase/ssr` / `supabase-js`).
- React Compiler is left off by default for build stability; enable it via `experimental.reactCompiler` in `next.config.ts` (requires `babel-plugin-react-compiler`) once profiling warrants it.
- The phone number and email in `business.ts` are the real business contact details. Replace the placeholder address and social handles before launch.
