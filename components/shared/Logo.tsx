import Image from "next/image";
import { cn } from "@/lib/utils";
import { businessConfig } from "@/lib/config/business";

/**
 * Brand lockup: the silverback emblem (circle crop, transparent corners) beside
 * the wordmark. The source is a 1024px master that next/image downscales and
 * serves as AVIF/WebP, so it stays crisp on retina without shipping the full file.
 */
export function Logo({
  className,
  showWordmark = true,
  size = 28,
}: {
  className?: string;
  showWordmark?: boolean;
  size?: number;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src={businessConfig.media.logoMark}
        alt={`${businessConfig.name} logo`}
        width={size}
        height={size}
        priority
        sizes={`${size}px`}
        className="shrink-0"
      />
      {showWordmark && (
        <span className="font-display text-lg font-semibold tracking-tight text-bone">
          {businessConfig.name}
        </span>
      )}
    </span>
  );
}
