# Silverback Detailing — Design System (MASTER)

> Single source of truth for all visual design decisions. Synthesized from the
> `ui-ux-pro-max` skill intelligence (the generator script's data files were not
> present on this machine, so the system was authored directly from the skill's
> reasoning rules, quick reference, and pre-delivery checklist), tuned for a
> premium luxury automotive detailing brand.
>
> Reconciliation rule (per build brief Section 0): the skill controls LOOK and
> FEEL; the brief controls STACK and FUNCTIONALITY. Where this file specifies a
> color, font, spacing, or effect, it wins over the brief's Section 12 placeholders.

---

## 1. Brand Mood

Cinematic. Dark. Metallic. Engineered. A premium automotive showroom at night:
deep blacks, brushed-silver highlights, one decisive accent of crimson. The feeling
is craftsmanship and restraint, not flash. Every surface looks deliberate.

Keywords: premium, cinematic, metallic, precise, confident, quiet luxury.

## 2. Pattern

Hero-centric immersive landing with scroll-driven storytelling. The home page opens
on a pinned, scroll-scrubbed cinematic moment, then resolves into calm, generously
spaced sections (services → proof → craft → conversion). Sub-pages are editorial:
one clear H1, strong hierarchy, lots of negative space.

## 3. Style

Dark-mode minimalism with metallic accents.
- Generous negative space; never crowded.
- Large cinematic media, hairline borders, restrained radii.
- Subtle film-grain texture and soft metallic sheen gradients.
- High-contrast display typography against near-black surfaces.

## 4. Color System (authoritative)

Defined in `app/globals.css` under Tailwind v4 `@theme`. Use semantic tokens, never
raw hex in components.

| Token | Hex | Role |
|-------|-----|------|
| `--color-ink` | `#0A0A0B` | Primary background (near-black) |
| `--color-ink-2` | `#121214` | Secondary surface |
| `--color-ink-3` | `#1B1B1F` | Cards, raised surfaces |
| `--color-line` | `#26262B` | Hairline borders, dividers |
| `--color-line-strong` | `#33333A` | Emphasized borders |
| `--color-silver` | `#C7CAD1` | Metallic accent, secondary text-strong |
| `--color-silver-bright` | `#EDEFF3` | Highlights, sheen |
| `--color-bone` | `#F4F5F7` | Primary text on dark |
| `--color-bone-muted` | `#9A9DA6` | Secondary text (>= 4.5:1 on ink) |
| `--color-accent` | `#D11A2A` | Crimson — primary CTA, focus accent |
| `--color-accent-hover` | `#B0141F` | CTA hover/active |
| `--color-accent-soft` | `#2A0E11` | Accent-tinted surface wash |
| `--color-success` | `#3FB67A` | Confirmations |
| `--color-warning` | `#E0A33E` | Warnings |

Discipline: three families only — ink (neutrals), silver (metallic), crimson (accent).
Adding gold/teal/etc. cheapens it. Crimson is used sparingly: primary CTAs, focus
rings, and one or two intentional highlights per view.

Contrast targets (verified intent): bone on ink ≈ 18:1; bone-muted on ink ≈ 5.2:1;
bone on accent ≈ 6:1. All body text ≥ 4.5:1, large text ≥ 3:1.

## 5. Typography (authoritative)

- **Display:** Fraunces (variable serif, high optical contrast) — hero lines, H1/H2,
  big numbers. Use optical sizing, tight tracking on large sizes.
- **Body / UI:** Inter Tight — paragraphs, labels, buttons, inputs.
- Loaded via `next/font/google`, self-hosted, `display: swap`, exposed as
  `--font-display` and `--font-body`.

Type scale (rem): 0.75, 0.875, 1, 1.125, 1.25, 1.5, 2, 3, 4, 5, 6, 8.
Body base 16px (1rem), line-height 1.6 for prose, 1.15–1.25 for display.
Tracking: -0.02em to -0.04em on display; normal on body; +0.18em uppercase eyebrows.

## 6. Spacing & Layout

- Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192.
- Max content width: 1440px (`--container`), text measure capped ~68ch.
- Section padding: 96px desktop / 64px tablet / 48px mobile (vertical).
- Horizontal gutter: 24px mobile → 48px desktop.
- Radii: `--radius` 12px base; sm 8px, lg 18px, full for pills. Restrained — no blobs.

## 7. Effects

- **Grain:** ultra-subtle SVG/noise overlay at ~3–5% opacity over dark sections.
- **Sheen:** linear silver gradient (110deg, silver-bright → silver → transparent)
  for metallic text/edges, used sparingly.
- **Elevation:** soft, low-spread shadows tuned for dark UI
  (`0 1px 0 rgba(255,255,255,.04) inset, 0 20px 50px -20px rgba(0,0,0,.7)`).
- **Borders:** hairline `1px` `--color-line`; brighten to `--color-line-strong` on hover.
- **Focus:** 2px crimson ring with 2px offset — never removed.

## 8. Motion

(Library choices locked by brief: GSAP + Motion + Lenis.)
- Micro-interactions 150–300ms, macro ≤ 600ms, nothing > 800ms.
- `transform`/`opacity` only. Ease-out on enter, ease-in on exit; exit ~65% of enter.
- Spring on press/hover (scale 0.98–1.02), eased curves on scroll/pin sequences.
- Stagger grids 40–60ms/item on viewport entry.
- Respect `prefers-reduced-motion` everywhere: scrub → static reveal, marquees pause,
  parallax disabled.

## 9. Iconography

- Lucide (stroke 1.5–1.75), single family, sized via tokens (16/20/24).
- No emoji as icons anywhere. SVG only. Icons paired with text labels for nav.

## 10. Components — house style

- **Buttons:** primary = crimson fill, bone text; secondary = hairline outline on ink;
  ghost = text + underline-on-hover. Pills/rounded-lg, never fully bubbly. 44px min height.
- **Cards:** ink-3 surface, hairline border, subtle inner top highlight; hover lifts
  border to line-strong + 1.01 scale (no layout shift).
- **Inputs:** ink-2 fill, hairline border, bone text, crimson focus ring, visible labels
  above field, helper/error below.
- **Eyebrows:** uppercase, tracked +0.18em, silver, 12–13px, above section H2s.

## 11. Anti-Patterns (avoid — industry-tuned)

- Emoji icons; mixed icon families/stroke widths.
- Glassmorphism overload, neon, or rainbow gradients (wrong mood for premium auto).
- Bubbly oversized radii; pill-everything.
- Generic stock-photo collage feel; low-effort hero.
- Gray-on-gray low contrast; body text < 16px on mobile.
- Decorative-only animation; animating width/height/top/left (causes CLS).
- Removing focus rings; hover-only affordances.
- Crowded layouts with no breathing room; more than one primary CTA per view.
- Adding a 4th brand color "for variety."

## 12. Pre-Delivery Checklist (run on every page)

- [ ] One H1; sequential heading hierarchy.
- [ ] All text ≥ 4.5:1 (large ≥ 3:1), verified in dark mode.
- [ ] Touch targets ≥ 44px; 8px+ spacing between targets.
- [ ] Visible focus rings on every interactive element.
- [ ] Images via `next/image` with width/height or aspect-ratio (CLS ~0).
- [ ] Icons are SVG (Lucide), labeled where icon-only.
- [ ] Motion respects `prefers-reduced-motion`; transform/opacity only.
- [ ] Single primary CTA; secondary actions subordinate.
- [ ] Tested at 375px and at desktop; no horizontal scroll.
- [ ] Semantic landmarks (`header`/`nav`/`main`/`section`/`article`/`footer`).
- [ ] Spacing follows the 4/8 rhythm; section padding consistent.
