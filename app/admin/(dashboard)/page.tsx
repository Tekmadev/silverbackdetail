import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, PhoneCall, AlertTriangle, DatabaseZap, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { BookingCard } from "@/components/admin/BookingCard";
import { EmptyState } from "@/components/admin/EmptyState";
import { ContactActions } from "@/components/admin/ContactActions";
import { requireAdmin } from "@/lib/admin/dal";
import {
  getBookings,
  buildCustomers,
  buildStats,
  getWinBackList,
  isAdminStorageReachable,
  DUE_AFTER_DAYS,
} from "@/lib/admin/queries";
import { shopToday, formatShortDate, describeGap } from "@/lib/admin/dates";
import { isSupabaseEnabled } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/config/site";

export const metadata: Metadata = { title: "Overview" };

export default async function AdminOverviewPage() {
  await requireAdmin();

  const bookings = await getBookings();
  const customers = buildCustomers(bookings);
  const stats = buildStats(bookings, customers);
  const winBack = getWinBackList(customers);
  const today = shopToday();

  const upcoming = bookings
    .filter((b) => b.date >= today && b.status !== "cancelled" && b.status !== "refunded")
    .sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date < b.date ? -1 : 1))
    .slice(0, 5);

  const monthDelta = stats.thisMonthValue - stats.lastMonthValue;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-bone sm:text-3xl">
          Overview
        </h1>
        <p className="mt-1 text-sm text-bone-muted">{formatShortDate(today)}</p>
      </div>

      {/* A silent misconfiguration here looks exactly like a quiet week. Both
          warnings say which of the two it actually is. */}
      {!isAdminStorageReachable() && (
        <Banner
          icon={AlertTriangle}
          tone="danger"
          title="Cannot reach the booking database"
          body="Supabase credentials are missing on this deployment, so nothing can be shown. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
        />
      )}
      {isAdminStorageReachable() && !isSupabaseEnabled() && (
        <Banner
          icon={DatabaseZap}
          tone="warning"
          title="New bookings are not being saved"
          body="STORAGE_PROVIDER is not set to supabase, so bookings taken on the site go out by email only and will never appear here. History below is whatever was saved previously."
        />
      )}

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Today" value={String(stats.todayCount)} hint="Appointments booked" />
        <StatCard label="Next 7 days" value={String(stats.next7Count)} hint="Appointments booked" />
        <StatCard
          label="Upcoming value"
          value={formatPrice(stats.upcomingValue, stats.currency)}
          hint="From starting prices, before vehicle assessment"
        />
        <StatCard
          label="Deposits due"
          value={formatPrice(stats.depositsOutstanding, stats.currency)}
          hint="Booked but not yet paid"
        />
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="This month"
          value={formatPrice(stats.thisMonthValue, stats.currency)}
          trend={
            stats.lastMonthValue > 0
              ? {
                  value: `${monthDelta >= 0 ? "+" : ""}${formatPrice(monthDelta, stats.currency)} vs last month`,
                  direction: monthDelta > 0 ? "up" : monthDelta < 0 ? "down" : "flat",
                }
              : undefined
          }
        />
        <StatCard
          label="Average job"
          value={stats.averageTicket ? formatPrice(stats.averageTicket, stats.currency) : "—"}
          hint="Across completed jobs"
        />
        <StatCard
          label="Customers"
          value={String(stats.customerCount)}
          hint={`${stats.repeatCustomerCount} have been back`}
        />
        <StatCard
          label="Repeat rate"
          value={stats.customerCount ? `${stats.repeatRate}%` : "—"}
          hint="Booked more than once"
        />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-bone">Coming up</h2>
          {upcoming.length > 0 && (
            <Link
              href="/admin/bookings"
              className="inline-flex min-h-11 items-center gap-1 text-sm text-silver hover:text-silver-bright"
            >
              All bookings
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </Link>
          )}
        </div>

        {upcoming.length > 0 ? (
          <div className="flex flex-col gap-3">
            {upcoming.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CalendarDays}
            title={bookings.length ? "Nothing booked ahead" : "No bookings yet"}
            description={
              bookings.length
                ? "Every appointment on the books has already been and gone. The win-back list below is the fastest way to fill the diary."
                : "Bookings taken through the website will appear here as soon as the first one comes in."
            }
          />
        )}
      </section>

      {winBack.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold text-bone">Worth a call</h2>
              <p className="mt-0.5 text-sm text-bone-muted">
                {winBack.length} past {winBack.length === 1 ? "customer has" : "customers have"} no
                next appointment booked.
              </p>
            </div>
            <Link
              href="/admin/customers"
              className="inline-flex min-h-11 shrink-0 items-center gap-1 text-sm text-silver hover:text-silver-bright"
            >
              See all
              <ArrowRight className="size-4" strokeWidth={1.75} />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {winBack.slice(0, 3).map((customer) => (
              <div
                key={customer.key}
                className="flex flex-col gap-3 rounded-xl border border-line bg-ink-3 p-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="font-display text-base font-semibold text-bone">
                    {customer.name}
                  </span>
                  <span className="text-sm text-bone-muted">
                    Last in{" "}
                    <span className={customer.tier === "overdue" ? "text-warning" : "text-silver"}>
                      {describeGap(-(customer.daysSinceLastVisit ?? 0))}
                    </span>
                  </span>
                </div>
                <p className="text-xs text-bone-muted">
                  {customer.visits} {customer.visits === 1 ? "visit" : "visits"} ·{" "}
                  {formatPrice(customer.lifetimeValue, customer.currency)} lifetime ·{" "}
                  {customer.vehicles[0]}
                </p>
                <ContactActions
                  phone={customer.phone}
                  email={customer.email}
                  name={customer.name}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {bookings.length > 0 && winBack.length === 0 && (
        <EmptyState
          icon={PhoneCall}
          title="Nobody is overdue"
          description={`Every past customer has either been in within the last ${DUE_AFTER_DAYS} days or has their next appointment booked.`}
        />
      )}
    </div>
  );
}

function Banner({
  icon: Icon,
  title,
  body,
  tone,
}: {
  icon: typeof AlertTriangle;
  title: string;
  body: string;
  tone: "warning" | "danger";
}) {
  return (
    <div
      className={
        tone === "danger"
          ? "flex gap-3 rounded-xl border border-accent/30 bg-accent-soft p-4"
          : "flex gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4"
      }
    >
      <Icon
        className={tone === "danger" ? "mt-0.5 size-5 shrink-0 text-accent" : "mt-0.5 size-5 shrink-0 text-warning"}
        strokeWidth={1.75}
      />
      <div>
        <p className="font-medium text-bone">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-bone-muted">{body}</p>
      </div>
    </div>
  );
}
