import type { Metadata } from "next";
import Link from "next/link";
import { Users, PhoneCall } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";
import { ContactActions } from "@/components/admin/ContactActions";
import { requireAdmin } from "@/lib/admin/dal";
import {
  getBookings,
  buildCustomers,
  getWinBackList,
  DUE_AFTER_DAYS,
  OVERDUE_AFTER_DAYS,
  type CustomerSummary,
} from "@/lib/admin/queries";
import { formatShortDate, describeGap } from "@/lib/admin/dates";
import { formatPrice } from "@/lib/config/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Customers" };

const VIEWS = [
  { key: "winback", label: "Worth calling" },
  { key: "repeat", label: "Regulars" },
  { key: "all", label: "Everyone" },
] as const;

type ViewKey = (typeof VIEWS)[number]["key"];

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  await requireAdmin();

  const { view: rawView } = await searchParams;
  const view: ViewKey = VIEWS.some((v) => v.key === rawView) ? (rawView as ViewKey) : "winback";

  const bookings = await getBookings();
  const customers = buildCustomers(bookings);
  const winBack = getWinBackList(customers);

  const shown =
    view === "winback" ? winBack : view === "repeat" ? customers.filter((c) => c.visits >= 2) : customers;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-bone sm:text-3xl">
          Customers
        </h1>
        <p className="mt-1 text-sm text-bone-muted">
          {customers.length} total · {customers.filter((c) => c.visits >= 2).length} have been back ·{" "}
          {winBack.length} worth a call
        </p>
      </div>

      <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
        <div className="flex w-max gap-2 pb-1">
          {VIEWS.map(({ key, label }) => (
            <Link
              key={key}
              href={key === "winback" ? "/admin/customers" : `/admin/customers?view=${key}`}
              aria-current={view === key ? "true" : undefined}
              className={cn(
                "inline-flex min-h-11 items-center rounded-lg border px-4 text-sm transition-colors",
                view === key
                  ? "border-silver bg-ink-3 font-medium text-bone"
                  : "border-line bg-ink-2 text-bone-muted hover:border-line-strong hover:text-bone",
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {view === "winback" && shown.length > 0 && (
        <p className="rounded-lg border border-line bg-ink-2 px-4 py-3 text-sm leading-relaxed text-bone-muted">
          Past customers with no next appointment booked, longest gap first. Due is{" "}
          {DUE_AFTER_DAYS} days since their last visit, overdue is {OVERDUE_AFTER_DAYS}.
        </p>
      )}

      {shown.length > 0 ? (
        <div className="flex flex-col gap-3">
          {shown.map((customer) => (
            <CustomerCard key={customer.key} customer={customer} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={customers.length ? PhoneCall : Users}
          title={
            customers.length === 0
              ? "No customers yet"
              : view === "winback"
                ? "Nobody is overdue"
                : "Nobody here yet"
          }
          description={
            customers.length === 0
              ? "Customers are built from website bookings. As soon as the same person books twice, their history and lifetime value appear here automatically."
              : view === "winback"
                ? `Every past customer has been in within the last ${DUE_AFTER_DAYS} days or already has their next appointment booked.`
                : "No customer has booked more than once yet."
          }
        />
      )}
    </div>
  );
}

function CustomerCard({ customer }: { customer: CustomerSummary }) {
  const tierLabel =
    customer.tier === "overdue" ? "Overdue" : customer.tier === "due" ? "Due" : null;

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-line bg-ink-3 p-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <h2 className="font-display text-base font-semibold text-bone">{customer.name}</h2>
        {tierLabel && (
          <span
            className={cn(
              "inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-xs font-medium",
              customer.tier === "overdue"
                ? "border-accent/30 bg-accent-soft text-accent"
                : "border-warning/30 bg-warning/10 text-warning",
            )}
          >
            {tierLabel}
          </span>
        )}
        {customer.visits >= 2 && (
          <span className="inline-flex shrink-0 items-center rounded-md border border-silver/25 bg-silver/10 px-2 py-0.5 text-xs font-medium text-silver">
            {customer.visits} visits
          </span>
        )}
      </div>

      {/* Three numbers, evenly weighted: what they are worth, when they were
          last in, and whether anything is already on the books. */}
      <dl className="grid grid-cols-3 gap-3 border-y border-line py-3">
        <Stat label="Lifetime" value={formatPrice(customer.lifetimeValue, customer.currency)} />
        <Stat
          label="Last in"
          value={
            customer.daysSinceLastVisit === null
              ? "—"
              : describeGap(-customer.daysSinceLastVisit).replace(" ago", "")
          }
        />
        <Stat
          label="Next"
          value={customer.nextVisit ? formatShortDate(customer.nextVisit) : "Not booked"}
          highlight={!customer.nextVisit}
        />
      </dl>

      <p className="text-xs leading-relaxed text-bone-muted">
        {customer.vehicles.join(" · ")}
        {customer.services.length > 0 && <> · {customer.services.join(", ")}</>}
      </p>

      <ContactActions phone={customer.phone} email={customer.email} name={customer.name} />
    </article>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className="text-xs text-bone-muted">{label}</dt>
      <dd
        className={cn(
          "truncate text-sm font-medium",
          highlight ? "text-warning" : "text-bone",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
