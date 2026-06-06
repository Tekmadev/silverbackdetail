import { Star, Quote } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { testimonials, type Testimonial } from "@/lib/data/content";
import { businessConfig } from "@/lib/config/business";

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="flex w-[340px] shrink-0 flex-col gap-4 rounded-xl border border-line bg-ink-3 p-6 sm:w-[400px]">
      <div className="flex items-center justify-between">
        <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
          {Array.from({ length: t.rating }).map((_, i) => (
            <Star key={i} className="size-4 fill-warning text-warning" />
          ))}
        </div>
        <Quote className="size-6 text-line-strong" />
      </div>
      <blockquote className="text-[0.95rem] leading-relaxed text-bone">{t.quote}</blockquote>
      <figcaption className="mt-auto border-t border-line pt-4">
        <p className="text-sm font-medium text-bone">{t.name}</p>
        <p className="text-xs text-bone-muted">
          {t.vehicle} · {t.service} · {t.location}
        </p>
      </figcaption>
    </figure>
  );
}

export function TestimonialMarquee() {
  // Duplicate the list so the marquee loops seamlessly.
  const loop = [...testimonials, ...testimonials];
  return (
    <section id="reviews" className="relative overflow-hidden py-24 md:py-32">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={`${businessConfig.trust.googleRating.toFixed(1)} rating · ${businessConfig.trust.reviewCount} reviews`}
          title="Trusted across the region"
          description="Owners who care about their vehicles keep coming back. Here is what they say."
          className="mx-auto"
        />
      </Container>

      <div className="group relative mt-14 flex flex-col gap-6">
        {/* edge fades */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
        <div className="flex w-max gap-6 pl-6 animate-marquee group-hover:[animation-play-state:paused]">
          {loop.map((t, i) => (
            <Card key={`${t.name}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
