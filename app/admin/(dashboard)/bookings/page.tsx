import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { BookingCard } from "@/components/admin/BookingCard";
import { EmptyState } from "@/components/admin/EmptyState";
import { requireAdmin } from "@/lib/admin/dal";
import { getBookings } from "@/lib/admin/queries";
import { shopToday, formatLongDate, formatShortDate } from "@/lib/admin/dates";
import { formatPrice } from "@/lib/config/site";
import type { BookingRecord } from "@/lib/booking/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Bookings" };

const FILTERS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "today", label: "Today" },
  { key: "pending", label: "Pending" },
  { key: "past", label: "Past" },
  { key: "cancelled", label: "Cancelled" },
  { key: "all", label: "All" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

function applyFilter(bookings: BookingRecord[], filter: FilterKey, today: string) {
  const live = (b: BookingRecord) => b.status !== "cancelled" && b.status !== "refunded";
  switch (filter) {
    case "today":
      return bookings.filter((b) => b.date === today && live(b));
    case "pending":
      return bookings.filter((b) => b.status === "pending");
    case "past":
      return bookings.filter((b) => b.date < today && live(b));
    case "cancelled":
      return bookings.filter((b) => !live(b));
    case "all":
      return bookings;
    case "upcoming":
    default:
      return bookings.filter((b) => b.date >= today && live(b));
  }
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  await requireAdmin();

  const { filter: rawFilter } = await searchParams;
  const filter: FilterKey = FILTERS.some((f) => f.key === rawFilter)
    ? (rawFilter as FilterKey)
    : "upcoming";

  const today = shopToday();
  const all = await getBookings();
  const filtered = applyFilter(all, filter, today);

  // Upcoming reads best oldest-first (what is next), history newest-first.
  const chronological = filter === "upcoming" || filter === "today";
  const sorted = [...filtered].sort((a, b) => {
    const order = a.date === b.date ? a.time.localeCompare(b.time) : a.date < b.date ? -1 : 1;
    return chronological ? order : -order;
  });

  // Grouping by day gives the list a scannable spine on a phone, where there is
  // no room for a date column.
  const byDate = new Map<string, BookingRecord[]>();
  for (const booking of sorted) {
    const group = byDate.get(booking.date);
    if (group) group.push(booking);
    else byDate.set(booking.date, [booking]);
  }

  const total = filtered.reduce((sum, b) => sum + b.priceFrom, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-bone sm:text-3xl">
          Bookings
        </h1>
        <p className="mt-1 text-sm text-bone-muted">
          {filtered.length} {filtered.length === 1 ? "booking" : "bookings"}
          {filtered.length > 0 && (
            <> · {formatPrice(total, filtered[0].currency)} at starting prices</>
          )}
        </p>
      </div>

      {/* Chips rather than a select: one tap instead of three, and they show the
          available views at a glance. Scrolls sideways on a narrow phone so the
          page itself never does. */}
      <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
        <div className="flex w-max gap-2 pb-1">
          {FILTERS.map(({ key, label }) => (
            <Link
              key={key}
              href={key === "upcoming" ? "/admin/bookings" : `/admin/bookings?filter=${key}`}
              aria-current={filter === key ? "true" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center rounded-lg border px-4 text-sm transition-colors",
                filter === key
                  ? "border-silver bg-ink-3 font-medium text-bone"
                  : "border-line bg-ink-2 text-bone-muted hover:border-line-strong hover:text-bone",
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {sorted.length > 0 ? (
        <div className="flex flex-col gap-6">
          {[...byDate.entries()].map(([date, group]) => (
            <section key={date} className="flex flex-col gap-3">
              <h2 className="text-xs uppercase tracking-[0.14em] text-bone-muted">
                {date === today ? `Today · ${formatShortDate(date)}` : formatLongDate(date)}
              </h2>
              {group.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </section>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CalendarDays}
          title={all.length ? "Nothing in this view" : "No bookings yet"}
          description={
            all.length
              ? "Try another filter. There are bookings on the system, just none matching this one."
              : "Bookings taken through the website will appear here. Appointments booked through GoHighLevel or over the phone are not included."
          }
        />
      )}
    </div>
  );
}
