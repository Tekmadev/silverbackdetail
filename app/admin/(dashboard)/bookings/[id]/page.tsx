import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Car, MapPin, Receipt, StickyNote, History, ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ContactActions } from "@/components/admin/ContactActions";
import { requireAdmin } from "@/lib/admin/dal";
import { getBooking, getBookings, buildCustomers } from "@/lib/admin/queries";
import { formatLongDate, formatTime, formatShortDate, describeGap, daysBetween, shopToday } from "@/lib/admin/dates";
import { formatPrice } from "@/lib/config/site";

export const metadata: Metadata = { title: "Booking" };

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const booking = await getBooking(id);
  if (!booking) notFound();

  const { customer, vehicle, location } = booking;
  const today = shopToday();

  // The same union-find grouping the customers page uses, so "their other
  // bookings" here means exactly what it means there.
  const all = await getBookings();
  const profile = buildCustomers(all).find((c) =>
    c.bookings.some((b) => b.id === booking.id),
  );
  const otherBookings = profile?.bookings.filter((b) => b.id !== booking.id) ?? [];

  const mapsUrl =
    location.type === "mobile" && location.address
      ? `https://maps.google.com/?q=${encodeURIComponent(location.address)}`
      : null;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin/bookings"
        className="inline-flex min-h-11 w-fit items-center gap-2 text-sm text-bone-muted hover:text-bone"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} />
        Bookings
      </Link>

      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-bone sm:text-3xl">
            {customer.name}
          </h1>
          <StatusBadge status={booking.status} />
        </div>
        <p className="text-sm text-silver">
          {formatLongDate(booking.date)} at {formatTime(booking.time)}
          <span className="text-bone-muted">
            {" "}
            · {describeGap(daysBetween(today, booking.date))}
          </span>
        </p>
      </header>

      <ContactActions phone={customer.phone} email={customer.email} name={customer.name} />

      <Section icon={Receipt} title="Service">
        <Row label="Service" value={booking.serviceName} />
        <Row
          label="Starting price"
          value={formatPrice(booking.priceFrom, booking.currency)}
          hint="Quoted at booking. Final price depends on the vehicle."
        />
        {booking.requiresDeposit && (
          <Row
            label="Deposit"
            value={`${formatPrice(booking.depositAmount, booking.currency)} · ${
              booking.depositPaid ? "paid" : "not paid"
            }`}
            valueClassName={booking.depositPaid ? "text-success" : "text-warning"}
          />
        )}
      </Section>

      <Section icon={Car} title="Vehicle">
        <Row label="Vehicle" value={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
        <Row label="Colour" value={vehicle.colour} />
        <Row label="Condition" value={vehicle.condition} />
      </Section>

      {vehicle.notes && (
        <Section icon={StickyNote} title="Customer notes">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-bone">{vehicle.notes}</p>
        </Section>
      )}

      <Section icon={MapPin} title="Location">
        <Row label="Type" value={location.type === "mobile" ? "Mobile visit" : "In shop"} />
        {location.address && <Row label="Address" value={location.address} />}
        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-lg border border-line bg-ink-2 px-4 text-sm text-bone transition-colors hover:border-line-strong"
          >
            Open in Maps
            <ExternalLink className="size-4" strokeWidth={1.75} />
          </a>
        )}
      </Section>

      {otherBookings.length > 0 && (
        <Section icon={History} title={`Previous bookings (${otherBookings.length})`}>
          <ul className="flex flex-col divide-y divide-line">
            {otherBookings.map((other) => (
              <li key={other.id}>
                <Link
                  href={`/admin/bookings/${other.id}`}
                  className="flex min-h-11 items-center justify-between gap-3 py-3 text-sm"
                >
                  <span className="min-w-0">
                    <span className="text-bone">{other.serviceName}</span>
                    <span className="block text-xs text-bone-muted">
                      {formatShortDate(other.date)}
                    </span>
                  </span>
                  <span className="shrink-0 text-bone-muted">
                    {formatPrice(other.priceFrom, other.currency)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {profile && (
            <p className="pt-1 text-xs text-bone-muted">
              {profile.visits} {profile.visits === 1 ? "visit" : "visits"} ·{" "}
              {formatPrice(profile.lifetimeValue, profile.currency)} lifetime
            </p>
          )}
        </Section>
      )}

      <Section icon={Receipt} title="Record">
        <Row label="Booking ID" value={booking.id} />
        <Row label="Taken" value={formatShortDate(booking.createdAt.slice(0, 10))} />
        <Row label="Email" value={customer.email} />
        <Row label="Phone" value={customer.phone} />
      </Section>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Car;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-line bg-ink-3 p-4 sm:p-5">
      <h2 className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-bone-muted">
        <Icon className="size-4" strokeWidth={1.75} />
        {title}
      </h2>
      {children}
    </section>
  );
}

/**
 * Label above value rather than beside it. A two-column row forces the value
 * into roughly half of a 375px screen, which wraps addresses and long vehicle
 * names into a ragged column.
 */
function Row({
  label,
  value,
  hint,
  valueClassName,
}: {
  label: string;
  value: string;
  hint?: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-bone-muted">{label}</span>
      <span className={valueClassName ?? "text-sm text-bone"}>{value}</span>
      {hint && <span className="text-xs text-bone-muted">{hint}</span>}
    </div>
  );
}
