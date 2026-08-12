import Link from "next/link";
import { Car, MapPin, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatShortDate, formatTime } from "@/lib/admin/dates";
import { formatPrice } from "@/lib/config/site";
import type { BookingRecord } from "@/lib/booking/types";

/**
 * One booking as a card rather than a table row.
 *
 * A table is the reflex for admin data and the wrong call for this one: at
 * 375px an eight-column table either scrolls sideways or crushes every column
 * to three characters. A card stacks, keeps a 44px tap target, and puts the two
 * things being scanned for, who and when, on the first line.
 */
export function BookingCard({ booking }: { booking: BookingRecord }) {
  const { vehicle, location, customer } = booking;

  return (
    <Link
      href={`/admin/bookings/${booking.id}`}
      className="group flex items-center gap-3 rounded-xl border border-line bg-ink-3 p-4 transition-colors hover:border-line-strong"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-display text-base font-semibold text-bone">{customer.name}</span>
          <StatusBadge status={booking.status} />
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-bone-muted">
          <span className="font-medium text-silver">
            {formatShortDate(booking.date)} · {formatTime(booking.time)}
          </span>
          <span aria-hidden>·</span>
          <span>{booking.serviceName}</span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-bone-muted">
          <span className="inline-flex items-center gap-1.5">
            <Car className="size-3.5 shrink-0" strokeWidth={1.75} />
            {vehicle.year} {vehicle.make} {vehicle.model}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" strokeWidth={1.75} />
            {location.type === "mobile" ? "Mobile" : "In shop"}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="font-display text-base font-semibold text-bone">
          {formatPrice(booking.priceFrom, booking.currency)}
        </span>
        {booking.requiresDeposit && (
          <span className={booking.depositPaid ? "text-xs text-success" : "text-xs text-warning"}>
            {booking.depositPaid ? "Deposit paid" : "Deposit due"}
          </span>
        )}
        <ChevronRight
          className="size-4 text-bone-muted transition-transform group-hover:translate-x-0.5"
          strokeWidth={1.75}
          aria-hidden
        />
      </div>
    </Link>
  );
}
