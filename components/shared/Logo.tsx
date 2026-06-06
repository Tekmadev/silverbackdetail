import { cn } from "@/lib/utils";
import { businessConfig } from "@/lib/config/business";

/**
 * Brand lockup: a metallic emblem (interlocked chevrons evoking a silverback's
 * crest) plus the wordmark. Pure SVG so it scales crisply and themes cleanly.
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
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="sb-metal" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EDEFF3" />
            <stop offset="0.5" stopColor="#C7CAD1" />
            <stop offset="1" stopColor="#7D8088" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="30" height="30" rx="8" stroke="url(#sb-metal)" strokeWidth="1.5" />
        <path
          d="M9 21.5L16 9l7 12.5"
          stroke="url(#sb-metal)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.5 22.5L16 14.5l4.5 8"
          stroke="#D11A2A"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark && (
        <span className="font-display text-lg font-semibold tracking-tight text-bone">
          {businessConfig.name}
        </span>
      )}
    </span>
  );
}
