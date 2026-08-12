import type { LucideIcon } from "lucide-react";

/**
 * Empty states carry real weight here, because the dashboard reads live data
 * with nothing seeded. "No bookings yet" and "the database is unreachable" look
 * identical on screen and mean completely different things, so each caller
 * passes the explanation that actually applies rather than a generic shrug.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line bg-ink-2/40 px-6 py-14 text-center">
      <span className="flex size-11 items-center justify-center rounded-lg border border-line bg-ink-3 text-silver">
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <h3 className="font-display text-lg font-semibold text-bone">{title}</h3>
      <p className="max-w-sm text-sm leading-relaxed text-bone-muted">{description}</p>
      {action}
    </div>
  );
}
