"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import * as React from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

type Tag = "div" | "section" | "ul" | "li" | "span";

/**
 * Viewport-entry fade + rise. Honors reduced motion (renders instantly).
 * Uses transform/opacity only, so it never causes layout shift.
 *
 * When `stagger` is true, direct children should be <FadeUpItem> so each one
 * animates in sequence.
 */
export function FadeUp({
  children,
  className,
  delay = 0,
  stagger = false,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: boolean;
  as?: Tag;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  if (stagger) {
    const container: Variants = {
      hidden: {},
      visible: { transition: { staggerChildren: 0.08, delayChildren: delay } },
    };
    return (
      <MotionTag
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        variants={container}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export function FadeUpItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <MotionTag className={className} variants={itemVariants}>
      {children}
    </MotionTag>
  );
}
