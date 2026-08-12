import { cn } from "@/lib/utils";
import type { BookingStatus } from "@/lib/booking/types";

/**
 * Status colours reuse the semantic tokens rather than introducing new ones:
 * the design system caps the palette at three brand colours plus success and
 * warning, and a status chip is not a good enough reason to add a sixth.
 */
const STYLES: Record<BookingStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "border-warning/30 bg-warning/10 text-warning" },
  confirmed: { label: "Confirmed", className: "border-success/30 bg-success/10 text-success" },
  cancelled: { label: "Cancelled", className: "border-line-strong bg-ink text-bone-muted" },
  refunded: { label: "Refunded", className: "border-silver/25 bg-silver/10 text-silver" },
};

export function StatusBadge({ status, className }: { status: BookingStatus; className?: string }) {
  const { label, className: tone } = STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        tone,
        className,
      )}
    >
      {label}
    </span>
  );
}
