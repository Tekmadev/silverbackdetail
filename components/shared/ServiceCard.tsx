"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock } from "lucide-react";
import { motion, useMotionValue, useSpring, useReducedMotion, useTransform } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getServicePricing } from "@/lib/config/site";
import type { Service } from "@/lib/config/business";
import { cn } from "@/lib/utils";

const CATEGORY_GRADIENT: Record<string, string> = {
  standard: "from-[#1b2330] to-[#0c0f15]",
  premium: "from-[#2a1014] to-[#0c0f15]",
  mobile: "from-[#10221d] to-[#0c0f15]",
};

export function ServiceCard({ service, className }: { service: Service; className?: string }) {
  const pricing = getServicePricing(service);
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  function onLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      className={cn("group relative", className)}
    >
      <Link
        href={`/services/${service.slug}`}
        className="block h-full overflow-hidden rounded-xl border border-line bg-ink-3 transition-colors duration-300 hover:border-line-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <div
          className={cn(
            "relative aspect-[16/10] overflow-hidden bg-gradient-to-br",
            CATEGORY_GRADIENT[service.category] ?? CATEGORY_GRADIENT.standard,
          )}
        >
          {service.image ? (
            <>
              <Image
                src={service.image}
                alt={service.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-ink/40"
              />
            </>
          ) : (
            <>
              <div aria-hidden className="grain absolute inset-0" />
              <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,255,255,0.08),transparent)]" />
            </>
          )}
          <div className="absolute left-5 top-5 flex flex-wrap gap-2">
            {pricing.isPromo && <Badge variant="accent">{pricing.promo?.label}</Badge>}
            {service.featured && !pricing.isPromo && <Badge variant="accent">Featured</Badge>}
            {service.requiresDeposit && <Badge variant="outline">Deposit secures slot</Badge>}
            {service.mobileAvailable && <Badge variant="outline">Mobile available</Badge>}
          </div>
          <div className="absolute bottom-5 right-5 flex size-10 items-center justify-center rounded-full border border-line-strong bg-ink/60 text-bone backdrop-blur transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
            <ArrowUpRight className="size-5" />
          </div>
        </div>

        <div className="flex flex-col gap-3 p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-xl font-semibold text-bone">{service.name}</h3>
            <span className="shrink-0 text-right text-sm text-bone-muted">
              from
              <span className="block font-medium text-silver-bright">
                {formatPrice(pricing.current, pricing.currency)}
              </span>
              {pricing.isPromo && (
                <span className="block text-xs text-bone-muted line-through">
                  {formatPrice(pricing.regular, pricing.currency)}
                </span>
              )}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-bone-muted">{service.shortDescription}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-bone-muted">
            <Clock className="size-3.5" />
            {service.duration}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
