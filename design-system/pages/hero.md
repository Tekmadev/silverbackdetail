# Hero — Page Override (deviations from MASTER)

> When building `components/hero/ScrollDrivenHero.tsx`, these rules override MASTER.

## Intent
The single most important moment on the site. A pinned, scroll-scrubbed cinematic
"transformation" that resolves on the word **Reborn** and a CTA. It must feel like a
title sequence, not a web section.

## Structure
- Pinned 100vh stage, 300vh scroll track (GSAP ScrollTrigger pin + scrub).
- Background: scrubbed `<video>` if `public/videos/hero-transformation.mp4` exists;
  otherwise a cinematic layered fallback (deep ink radial + animated metallic sheen +
  grain + a slow Ken-Burns gradient). The fallback must still look premium on its own —
  the scroll text reveals carry the moment.
- A persistent vignette + bottom gradient so text stays legible over any frame.

## Text reveal sequence (scroll %)
| % | Line | Treatment |
|---|------|-----------|
| 0–15 | "Every car carries history." | Fade up + letter-spacing expand, Fraunces clamp(2.5rem,7vw,5rem) |
| 25–40 | "Scratches. Swirls. Dust. Time." | Words stagger in one by one |
| 50–65 | "We work where others stop looking." | Mask reveal from bottom |
| 75–90 | "Reborn." | Fraunces clamp(4rem,14vw,11rem), scale 0.8→1, silver sheen |
| 95–100 | CTA "Book Your Transformation" | Slide up + shadow bloom |

Only one line visible at a time; crossfade between phases. Crimson appears only on the CTA.

## Overrides vs MASTER
- Display sizes here may exceed the global scale (intentional, cinematic).
- Tracking on the final word may go to -0.05em.
- This is the one place a large metallic sheen sweep is encouraged.

## Reduced motion
If `prefers-reduced-motion: reduce`: no pin, no scrub. Show a single static composition
with the headline "Reborn." + subhead + CTA, fully visible on load. If a video exists,
let it autoplay-loop muted instead of scrubbing.

## Performance
- LCP element = the headline text (not the video). Video is `preload="auto"`, deferred,
  never blocks paint. Poster/gradient paints instantly.
- No layout shift: stage is a fixed-height pinned container.
