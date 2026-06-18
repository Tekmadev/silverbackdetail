"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/animations/gsap-setup";
import { Button } from "@/components/ui/button";
import { businessConfig } from "@/lib/config/business";

const HERO_VIDEO_DESKTOP = businessConfig.media.heroVideo; // all-intra, scrubbed
const HERO_VIDEO_MOBILE = businessConfig.media.heroVideoMobile; // compressed, autoplay
const HERO_POSTER = businessConfig.media.heroPoster;

/** True only after client hydration. SSR-safe, no effect, no hydration mismatch. */
function useIsClient(): boolean {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/** SSR-safe media query. False on the server and during hydration, then updates. */
function useMediaQuery(query: string): boolean {
  const subscribe = React.useCallback(
    (callback: () => void) => {
      if (typeof window === "undefined" || !window.matchMedia) return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query],
  );
  const getSnapshot = () =>
    typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(query).matches;
  const getServerSnapshot = () => false;
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Triangular-ish window: 1 at the centre of [start,end], fading at the edges. */
function band(p: number, start: number, end: number, fade = 0.28): number {
  if (p <= start || p >= end) return 0;
  const local = (p - start) / (end - start);
  return Math.max(0, Math.min(1, Math.min(local / fade, (1 - local) / fade)));
}

const PHASES = [
  { text: "Every car carries history.", size: "clamp(2rem,6vw,4.75rem)", start: 0.0, end: 0.2 },
  { text: "Scratches. Swirls. Dust. Time.", size: "clamp(1.75rem,5vw,4rem)", start: 0.2, end: 0.42 },
  { text: "We work where others stop looking.", size: "clamp(1.75rem,5vw,4rem)", start: 0.44, end: 0.68 },
] as const;

export function ScrollDrivenHero() {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const phaseRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const rebornRef = React.useRef<HTMLDivElement>(null);
  const ctaRef = React.useRef<HTMLDivElement>(null);
  const hintRef = React.useRef<HTMLDivElement>(null);
  const [hasVideo, setHasVideo] = React.useState(false);
  const reduced = useReducedMotion() ?? false;
  const isClient = useIsClient();

  // Progressive enhancement. The scroll-scrubbed cinematic is a desktop treat: it
  // relies on seeking video.currentTime, which mobile WebKit (every iOS browser)
  // renders unreliably. Touch devices, reduced-motion users, and the server render
  // all get the clean autoplay hero instead, so mobile is rock solid and never
  // flickers. Only a fine-pointer client upgrades to the scrub experience.
  const touch = useMediaQuery("(pointer: coarse)");
  const scrub = isClient && !reduced && !touch;

  // Smoothed video scrubbing (desktop only). The scroll callback only sets a target
  // time; a RAF loop lerps currentTime toward it so the decoder is never asked to
  // seek faster than it can decode. Smooth because the source is encoded all-intra
  // (every frame a keyframe), making arbitrary seeks cheap.
  const videoTargetRef = React.useRef(0);

  React.useEffect(() => {
    if (!scrub) return;
    let active = true;
    let rafId = 0;
    const tick = () => {
      if (!active) return;
      const video = videoRef.current;
      if (video && Number.isFinite(video.duration) && video.duration > 0) {
        const current = video.currentTime;
        const diff = videoTargetRef.current - current;
        if (Math.abs(diff) > 0.01) {
          video.currentTime = current + diff * 0.2;
        } else if (Math.abs(diff) > 0.001) {
          video.currentTime = videoTargetRef.current;
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      active = false;
      cancelAnimationFrame(rafId);
    };
  }, [scrub]);

  // Autoplay path (mobile + reduced motion). Desktop scrubbing keeps the video
  // paused so currentTime stays fully under scroll control.
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (scrub) {
      video.pause();
      return;
    }
    video.muted = true; // iOS only allows inline autoplay when muted is a property
    const tryPlay = () => {
      const p = video.play();
      if (p) p.catch(() => {});
    };
    tryPlay();
    // Some iOS states (Low Power Mode) block autoplay until a gesture; retry once.
    const onInteract = () => tryPlay();
    window.addEventListener("touchstart", onInteract, { once: true, passive: true });
    window.addEventListener("click", onInteract, { once: true });
    return () => {
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("click", onInteract);
    };
  }, [scrub, hasVideo]);

  useGSAP(
    () => {
      if (!scrub) return; // autoplay hero is plain markup, no ScrollTrigger
      const wrapper = wrapperRef.current;
      const stage = stageRef.current;
      if (!wrapper || !stage) return;

      const setVideoTime = (p: number) => {
        const video = videoRef.current;
        if (!video || !Number.isFinite(video.duration) || video.duration === 0) return;
        videoTargetRef.current = Math.min(video.duration - 0.05, Math.max(0, p * video.duration));
      };

      const apply = (p: number) => {
        phaseRefs.current.forEach((el, i) => {
          if (!el) return;
          const ph = PHASES[i];
          // First phrase is fully visible at the top, then fades, so the hero never
          // paints empty on load.
          const o =
            i === 0
              ? p < ph.end - 0.06
                ? 1
                : Math.max(0, 1 - (p - (ph.end - 0.06)) / 0.06)
              : band(p, ph.start, ph.end);
          gsap.set(el, { opacity: o, y: (1 - o) * 28, filter: `blur(${(1 - o) * 6}px)` });
        });
        // "Reborn." appears 0.7..1.0, scales 0.8 -> 1
        if (rebornRef.current) {
          const o = band(p, 0.7, 1.0, 0.18);
          const local = Math.max(0, Math.min(1, (p - 0.7) / 0.22));
          gsap.set(rebornRef.current, { opacity: o, scale: 0.8 + local * 0.2 });
        }
        // CTA slides up and stays at the end
        if (ctaRef.current) {
          const o = Math.max(0, Math.min(1, (p - 0.9) / 0.07));
          gsap.set(ctaRef.current, { opacity: o, y: (1 - o) * 30, pointerEvents: o > 0.6 ? "auto" : "none" });
        }
        if (hintRef.current) {
          gsap.set(hintRef.current, { opacity: Math.max(0, 1 - p * 6) });
        }
        setVideoTime(p);
      };

      apply(0);

      const st = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        pin: stage,
        pinSpacing: true,
        scrub: true,
        onUpdate: (self) => apply(self.progress),
      });

      return () => st.kill();
    },
    { scope: wrapperRef, dependencies: [scrub] },
  );

  return (
    <section aria-label="Silverback Detailing" className="relative">
      {/* Real, crawlable H1 for SEO/GEO; cinematic text below is decorative. */}
      <h1 className="sr-only">
        Premium car detailing, paint correction, and ceramic coating in {businessConfig.address.city},{" "}
        {businessConfig.address.province}
      </h1>

      {scrub ? (
        <div ref={wrapperRef} className="relative h-[400vh]">
          <div ref={stageRef} className="relative h-dvh w-full overflow-hidden">
            <HeroBackground
              src={HERO_VIDEO_DESKTOP}
              hasVideo={hasVideo}
              onVideo={setHasVideo}
              videoRef={videoRef}
              autoplay={false}
            />

            {/* Phase phrases */}
            <div className="absolute inset-0 z-20 flex items-center justify-center px-6" aria-hidden>
              {PHASES.map((ph, i) => (
                <div
                  key={ph.text}
                  ref={(el) => {
                    phaseRefs.current[i] = el;
                  }}
                  className="absolute max-w-5xl text-center font-display font-semibold leading-[1.08] tracking-tight text-bone opacity-0"
                  style={{ fontSize: ph.size }}
                >
                  {ph.text}
                </div>
              ))}

              <div
                ref={rebornRef}
                className="absolute text-center opacity-0"
                style={{ fontSize: "clamp(4rem,15vw,12rem)" }}
              >
                <span className="text-metal animate-shimmer font-display font-semibold tracking-[-0.04em]">
                  Reborn.
                </span>
              </div>
            </div>

            {/* CTA reveal */}
            <div
              ref={ctaRef}
              className="absolute inset-x-0 bottom-[12%] z-30 flex flex-col items-center gap-4 px-6 text-center opacity-0"
            >
              <p className="eyebrow">Showroom-grade detailing in {businessConfig.address.city}</p>
              <Button asChild size="lg" className="shadow-[0_20px_60px_-15px_rgba(209,26,42,0.7)]">
                <Link href="/book">
                  Book your transformation
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            {/* Scroll hint */}
            <div
              ref={hintRef}
              className="absolute inset-x-0 bottom-8 z-30 flex flex-col items-center gap-2 text-bone-muted"
            >
              <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
              <ChevronDown className="size-5 animate-bounce" />
            </div>
          </div>
        </div>
      ) : (
        <StaticHero hasVideo={hasVideo} onVideo={setHasVideo} videoRef={videoRef} />
      )}
    </section>
  );
}

/**
 * Cinematic layered background. A poster image is always painted underneath, so the
 * hero is never black or empty. On desktop the video's currentTime is scrubbed by
 * scroll (autoplay off) and fades in once a frame is ready. On touch / reduced
 * motion it autoplays and loops, fading in only once it is genuinely playing, which
 * avoids the frame-then-blank flicker iOS produces.
 */
function HeroBackground({
  src,
  hasVideo,
  onVideo,
  videoRef,
  autoplay = false,
}: {
  src: string;
  hasVideo: boolean;
  onVideo: (v: boolean) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  autoplay?: boolean;
}) {
  const reveal = () => onVideo(true);
  return (
    <div className="absolute inset-0 z-0">
      {/* Fallback composition: always rendered, hidden behind the poster/video. */}
      <div className="absolute inset-0 bg-ink">
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-10%,#1d1f24_0%,#0a0a0b_55%,#000_100%)]" />
        <div className="absolute left-[12%] top-[20%] size-[42vw] rounded-full bg-silver/10 blur-[120px] animate-[sb-float_9s_ease-in-out_infinite]" />
        <div className="absolute right-[8%] top-[35%] size-[34vw] rounded-full bg-accent/15 blur-[130px] animate-[sb-float_11s_ease-in-out_infinite]" />
        <div className="absolute inset-x-0 top-[62%] h-px bg-gradient-to-r from-transparent via-silver/30 to-transparent" />
      </div>

      {/* Poster base: guarantees a strong, on-brand image even if the video never
          plays (Low Power Mode, slow network, decode failure). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HERO_POSTER} alt="" aria-hidden className="absolute inset-0 size-full object-cover" />

      <video
        ref={(node) => {
          videoRef.current = node;
          if (node) {
            node.muted = true;
            // For the scrub path we just need a decoded frame; reveal early. For the
            // autoplay path we wait for the `playing` event instead (see below).
            if (!autoplay && node.readyState >= 2) onVideo(true);
          }
        }}
        src={src}
        poster={HERO_POSTER}
        playsInline
        muted
        loop={autoplay}
        autoPlay={autoplay}
        preload="auto"
        onLoadedMetadata={autoplay ? undefined : reveal}
        onLoadedData={autoplay ? undefined : reveal}
        onCanPlay={autoplay ? undefined : reveal}
        onPlaying={autoplay ? reveal : undefined}
        onError={() => onVideo(false)}
        className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
          hasVideo ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* grain + vignette + bottom legibility gradient */}
      <div aria-hidden className="grain absolute inset-0 z-10" />
      <div aria-hidden className="vignette absolute inset-0 z-10" />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-10 h-1/3 bg-gradient-to-t from-ink to-transparent"
      />
    </div>
  );
}

/** Clean autoplay hero for mobile, reduced motion, and the pre-hydration render. */
function StaticHero({
  hasVideo,
  onVideo,
  videoRef,
}: {
  hasVideo: boolean;
  onVideo: (v: boolean) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 pt-20 text-center">
      <HeroBackground src={HERO_VIDEO_MOBILE} hasVideo={hasVideo} onVideo={onVideo} videoRef={videoRef} autoplay />
      <div className="relative z-20 flex max-w-3xl flex-col items-center gap-6">
        <p className="eyebrow animate-fade-up">Hamilton, Ontario</p>
        <p
          className="font-display text-5xl font-semibold leading-[1.04] tracking-tight text-bone sm:text-7xl"
          style={{ animationDelay: "0.1s" }}
        >
          Detail beyond
          <br />
          the surface. <span className="text-metal">Reborn.</span>
        </p>
        <p className="max-w-xl text-lg text-bone-muted">{businessConfig.shortDescription} Paint correction, ceramic coating, and mobile detailing done to a showroom standard.</p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild size="lg">
            <Link href="/book">
              Book your transformation
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/services">View services</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
