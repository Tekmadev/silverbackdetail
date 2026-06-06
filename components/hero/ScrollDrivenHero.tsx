"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/animations/gsap-setup";
import { Button } from "@/components/ui/button";
import { businessConfig } from "@/lib/config/business";

const HERO_VIDEO = "/videos/detailwithtools.mp4";

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

  // Smoothed video scrubbing. The scroll callback only sets a target time; a RAF
  // loop lerps currentTime toward it so the decoder is never asked to seek faster
  // than it can decode. Works smoothly because the source is encoded all-intra
  // (every frame a keyframe), making arbitrary seeks cheap.
  const videoTargetRef = React.useRef(0);

  React.useEffect(() => {
    if (reduced) return;
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
  }, [reduced]);

  useGSAP(
    () => {
      if (reduced) return; // static composition handled in markup
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
          // The first phrase is fully visible at the top, then fades out, so the
          // hero never paints empty on load.
          const o =
            i === 0
              ? p < ph.end - 0.06
                ? 1
                : Math.max(0, 1 - (p - (ph.end - 0.06)) / 0.06)
              : band(p, ph.start, ph.end);
          gsap.set(el, { opacity: o, y: (1 - o) * 28, filter: `blur(${(1 - o) * 6}px)` });
        });
        // "Reborn." — appears 0.7..1.0, scales 0.8 -> 1
        if (rebornRef.current) {
          const o = band(p, 0.7, 1.0, 0.18);
          const local = Math.max(0, Math.min(1, (p - 0.7) / 0.22));
          gsap.set(rebornRef.current, { opacity: o, scale: 0.8 + local * 0.2 });
        }
        // CTA — slides up and stays at the end
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
    { scope: wrapperRef, dependencies: [reduced] },
  );

  return (
    <section aria-label="Silverback Detailing" className="relative">
      {/* Real, crawlable H1 for SEO/GEO; cinematic text below is decorative. */}
      <h1 className="sr-only">
        Premium car detailing, paint correction, and ceramic coating in {businessConfig.address.city},{" "}
        {businessConfig.address.province}
      </h1>

      {reduced ? (
        <StaticHero hasVideo={hasVideo} onVideo={setHasVideo} videoRef={videoRef} />
      ) : (
        <div ref={wrapperRef} className="relative h-[400vh]">
          <div ref={stageRef} className="relative h-dvh w-full overflow-hidden">
            <HeroBackground hasVideo={hasVideo} onVideo={setHasVideo} videoRef={videoRef} />

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
      )}
    </section>
  );
}

/**
 * Cinematic layered background. In the scroll experience the video's currentTime is
 * scrubbed by scroll (autoplay off). In the reduced-motion fallback it autoplays
 * and loops instead.
 */
function HeroBackground({
  hasVideo,
  onVideo,
  videoRef,
  autoplay = false,
}: {
  hasVideo: boolean;
  onVideo: (v: boolean) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  autoplay?: boolean;
}) {
  return (
    <div className="absolute inset-0 z-0">
      {/* Fallback composition — always rendered, hidden behind the video when it loads. */}
      <div className="absolute inset-0 bg-ink">
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-10%,#1d1f24_0%,#0a0a0b_55%,#000_100%)]" />
        <div className="absolute left-[12%] top-[20%] size-[42vw] rounded-full bg-silver/10 blur-[120px] animate-[sb-float_9s_ease-in-out_infinite]" />
        <div className="absolute right-[8%] top-[35%] size-[34vw] rounded-full bg-accent/15 blur-[130px] animate-[sb-float_11s_ease-in-out_infinite]" />
        {/* studio horizon line */}
        <div className="absolute inset-x-0 top-[62%] h-px bg-gradient-to-r from-transparent via-silver/30 to-transparent" />
      </div>

      <video
        ref={(node) => {
          videoRef.current = node;
          // A locally served video can finish loading before React attaches the
          // event handlers, so the loadedmetadata event is missed. Catch that by
          // checking readyState the moment the element mounts.
          if (node && node.readyState >= 1) onVideo(true);
        }}
        src={HERO_VIDEO}
        playsInline
        muted
        loop={autoplay}
        autoPlay={autoplay}
        preload="auto"
        onLoadedMetadata={() => onVideo(true)}
        onLoadedData={() => onVideo(true)}
        onCanPlay={() => onVideo(true)}
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

/** Reduced-motion / fallback static hero. */
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
      <HeroBackground hasVideo={hasVideo} onVideo={onVideo} videoRef={videoRef} autoplay />
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
