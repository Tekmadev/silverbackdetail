import { cn } from "@/lib/utils";

/**
 * A single headline number.
 *
 * `hint` exists so a figure can carry its own caveat. Several of these are
 * derived from `price_from`, which is a starting price rather than a final
 * invoice, and a number that overstates itself is worse than no number at all.
 */
export function StatCard({
  label,
  value,
  hint,
  trend,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  trend?: { value: string; direction: "up" | "down" | "flat" };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-xl border border-line bg-ink-3 p-4 sm:p-5",
        className,
      )}
    >
      <span className="text-xs uppercase tracking-[0.14em] text-bone-muted">{label}</span>
      <span className="font-display text-2xl font-semibold leading-tight text-bone sm:text-3xl">
        {value}
      </span>
      {trend && (
        <span
          className={cn(
            "text-xs font-medium",
            trend.direction === "up" && "text-success",
            trend.direction === "down" && "text-accent",
            trend.direction === "flat" && "text-bone-muted",
          )}
        >
          {trend.value}
        </span>
      )}
      {hint && <span className="text-xs leading-relaxed text-bone-muted">{hint}</span>}
    </div>
  );
}
