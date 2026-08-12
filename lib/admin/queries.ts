import "server-only";
import { cache } from "react";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { rowToBooking, type BookingRow } from "@/lib/storage/bookings";
import type { BookingRecord, BookingStatus } from "@/lib/booking/types";
import { businessConfig } from "@/lib/config/business";
import { shopToday, daysBetween, monthOf, shopThisMonth, previousMonth } from "@/lib/admin/dates";

/**
 * Read side of the admin dashboard.
 *
 * Every read goes through the service role client, and only ever after
 * requireAdmin() has approved the caller. That is what allows the bookings
 * table to keep RLS enabled with no policies at all: there is no path from a
 * browser-held key to a customer record.
 *
 * The whole table is pulled once per render and the analytics are derived in
 * memory. For a detailing shop that is thousands of rows at the very outside,
 * where the round trip costs more than the arithmetic. If this ever grows past
 * the cap below, the aggregates belong in SQL views rather than a bigger fetch.
 */
const MAX_ROWS = 2000;

/**
 * How long after a visit a customer is worth chasing. A coated or corrected car
 * wants a maintenance detail somewhere around the season mark, so three months
 * is a prompt rather than a nag, and six months is someone who has drifted to a
 * competitor or stopped bothering. Both are presented as prompts to call, never
 * as automated messages.
 */
export const DUE_AFTER_DAYS = 90;
export const OVERDUE_AFTER_DAYS = 180;

export type WinBackTier = "active" | "due" | "overdue";

export type CustomerSummary = {
  /** Stable per-person key, derived from the merged contact details. */
  key: string;
  name: string;
  email: string;
  phone: string;
  /** Completed, non-cancelled appointments. Upcoming ones are not visits yet. */
  visits: number;
  /** Sum of quoted prices across those visits. See the caveat on `priceFrom`. */
  lifetimeValue: number;
  currency: string;
  firstVisit: string | null;
  lastVisit: string | null;
  daysSinceLastVisit: number | null;
  nextVisit: string | null;
  tier: WinBackTier;
  services: string[];
  vehicles: string[];
  bookings: BookingRecord[];
};

export type DashboardStats = {
  currency: string;
  todayCount: number;
  next7Count: number;
  upcomingCount: number;
  upcomingValue: number;
  depositsOutstanding: number;
  depositsCollected: number;
  thisMonthValue: number;
  lastMonthValue: number;
  completedCount: number;
  cancelledCount: number;
  averageTicket: number;
  customerCount: number;
  repeatCustomerCount: number;
  repeatRate: number;
  statusCounts: Record<BookingStatus, number>;
  serviceMix: { name: string; count: number; value: number }[];
};

/** Every booking, newest appointment first. Memoised for one render pass. */
export const getBookings = cache(async (): Promise<BookingRecord[]> => {
  const db = getSupabaseAdmin();
  if (!db) return [];
  const { data, error } = await db
    .from("bookings")
    .select("*")
    .order("date", { ascending: false })
    .order("time", { ascending: false })
    .limit(MAX_ROWS);
  if (error) {
    console.error("[admin] getBookings failed:", error.message);
    return [];
  }
  return (data as BookingRow[]).map(rowToBooking);
});

export const getBooking = cache(async (id: string): Promise<BookingRecord | null> => {
  const db = getSupabaseAdmin();
  if (!db) return null;
  const { data, error } = await db.from("bookings").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return rowToBooking(data as BookingRow);
});

/**
 * Whether Supabase is reachable at all, as opposed to simply having no bookings
 * yet. The dashboard has to tell those two apart: one is a quiet morning, the
 * other is a broken deployment showing the owner zeros he might believe.
 */
export function isAdminStorageReachable(): boolean {
  return getSupabaseAdmin() !== null;
}

const isCancelled = (b: BookingRecord) => b.status === "cancelled" || b.status === "refunded";

/**
 * Merges bookings into people.
 *
 * Matching on email alone misses the customer who booked once from a work
 * address and once from a personal one; matching on phone alone misses the one
 * who changed numbers. So both are treated as identity tokens and any bookings
 * sharing either are pulled into the same group, transitively. Union-find keeps
 * that near linear and, more importantly, makes the merge order-independent:
 * A-and-B then B-and-C lands the same as C-and-B then B-and-A.
 */
function groupByCustomer(bookings: BookingRecord[]): BookingRecord[][] {
  const parent = new Map<string, string>();

  const add = (token: string) => {
    if (!parent.has(token)) parent.set(token, token);
  };

  const find = (token: string): string => {
    let root = token;
    while (parent.get(root) !== root) root = parent.get(root) as string;
    // Path compression, so repeated lookups stay flat.
    let cursor = token;
    while (parent.get(cursor) !== root) {
      const next = parent.get(cursor) as string;
      parent.set(cursor, root);
      cursor = next;
    }
    return root;
  };

  const union = (a: string, b: string) => {
    add(a);
    add(b);
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) parent.set(rootA, rootB);
  };

  const tokensFor = (b: BookingRecord): string[] => {
    const tokens: string[] = [];
    const email = b.customer.email?.trim().toLowerCase();
    if (email) tokens.push(`e:${email}`);
    // Last ten digits, so +1 905... and (905)... resolve to the same person.
    const phone = (b.customer.phone ?? "").replace(/\D/g, "").slice(-10);
    if (phone.length === 10) tokens.push(`p:${phone}`);
    // A booking with neither is its own island rather than being merged into
    // everyone else who also left both fields blank.
    if (tokens.length === 0) tokens.push(`b:${b.id}`);
    return tokens;
  };

  for (const booking of bookings) {
    const tokens = tokensFor(booking);
    tokens.forEach(add);
    for (let i = 1; i < tokens.length; i += 1) union(tokens[0], tokens[i]);
  }

  const groups = new Map<string, BookingRecord[]>();
  for (const booking of bookings) {
    const root = find(tokensFor(booking)[0]);
    const group = groups.get(root);
    if (group) group.push(booking);
    else groups.set(root, [booking]);
  }
  return [...groups.values()];
}

/** Rolls bookings up into customers, richest signal first. */
export function buildCustomers(bookings: BookingRecord[]): CustomerSummary[] {
  const today = shopToday();

  return groupByCustomer(bookings)
    .map((group) => {
      // Newest first, so "most recent spelling of the name" is just [0].
      const byDateDesc = [...group].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
      const live = byDateDesc.filter((b) => !isCancelled(b));
      const past = live.filter((b) => b.date <= today);
      const upcoming = live.filter((b) => b.date > today).sort((a, b) => (a.date < b.date ? -1 : 1));

      const lastVisit = past[0]?.date ?? null;
      const daysSinceLastVisit = lastVisit ? daysBetween(lastVisit, today) : null;
      const nextVisit = upcoming[0]?.date ?? null;

      let tier: WinBackTier = "active";
      if (!nextVisit && daysSinceLastVisit !== null) {
        if (daysSinceLastVisit >= OVERDUE_AFTER_DAYS) tier = "overdue";
        else if (daysSinceLastVisit >= DUE_AFTER_DAYS) tier = "due";
      }

      const newest = byDateDesc[0];
      return {
        key: newest.customer.email?.trim().toLowerCase() || `booking:${newest.id}`,
        name: newest.customer.name,
        email: newest.customer.email ?? "",
        phone: newest.customer.phone ?? "",
        visits: past.length,
        lifetimeValue: past.reduce((sum, b) => sum + b.priceFrom, 0),
        currency: newest.currency,
        firstVisit: past.length ? past[past.length - 1].date : null,
        lastVisit,
        daysSinceLastVisit,
        nextVisit,
        tier,
        services: [...new Set(byDateDesc.map((b) => b.serviceName))],
        vehicles: [
          ...new Set(
            byDateDesc.map((b) => `${b.vehicle.year} ${b.vehicle.make} ${b.vehicle.model}`.trim()),
          ),
        ],
        bookings: byDateDesc,
      };
    })
    .sort((a, b) => b.lifetimeValue - a.lifetimeValue || b.visits - a.visits);
}

/** Customers worth a phone call, most overdue first. */
export function getWinBackList(customers: CustomerSummary[]): CustomerSummary[] {
  return customers
    .filter((c) => c.tier !== "active")
    .sort((a, b) => (b.daysSinceLastVisit ?? 0) - (a.daysSinceLastVisit ?? 0));
}

export function buildStats(bookings: BookingRecord[], customers: CustomerSummary[]): DashboardStats {
  const today = shopToday();
  const thisMonth = shopThisMonth();
  const lastMonth = previousMonth(thisMonth);

  const live = bookings.filter((b) => !isCancelled(b));
  const upcoming = live.filter((b) => b.date >= today);
  const past = live.filter((b) => b.date < today);

  const statusCounts = { pending: 0, confirmed: 0, cancelled: 0, refunded: 0 } as Record<
    BookingStatus,
    number
  >;
  for (const b of bookings) statusCounts[b.status] += 1;

  const serviceTotals = new Map<string, { name: string; count: number; value: number }>();
  for (const b of live) {
    const entry = serviceTotals.get(b.serviceSlug) ?? { name: b.serviceName, count: 0, value: 0 };
    entry.count += 1;
    entry.value += b.priceFrom;
    serviceTotals.set(b.serviceSlug, entry);
  }

  const completedValue = past.reduce((sum, b) => sum + b.priceFrom, 0);

  return {
    currency: bookings[0]?.currency ?? businessConfig.services[0].currency,
    todayCount: upcoming.filter((b) => b.date === today).length,
    next7Count: upcoming.filter((b) => daysBetween(today, b.date) <= 7).length,
    upcomingCount: upcoming.length,
    upcomingValue: upcoming.reduce((sum, b) => sum + b.priceFrom, 0),
    // Money he is owed: a deposit-taking job that is still ahead and unpaid.
    depositsOutstanding: upcoming
      .filter((b) => b.requiresDeposit && !b.depositPaid)
      .reduce((sum, b) => sum + b.depositAmount, 0),
    depositsCollected: bookings
      .filter((b) => b.depositPaid && b.status !== "refunded")
      .reduce((sum, b) => sum + b.depositAmount, 0),
    thisMonthValue: live.filter((b) => monthOf(b.date) === thisMonth).reduce((s, b) => s + b.priceFrom, 0),
    lastMonthValue: live.filter((b) => monthOf(b.date) === lastMonth).reduce((s, b) => s + b.priceFrom, 0),
    completedCount: past.length,
    cancelledCount: statusCounts.cancelled + statusCounts.refunded,
    averageTicket: past.length ? Math.round(completedValue / past.length) : 0,
    customerCount: customers.length,
    repeatCustomerCount: customers.filter((c) => c.visits >= 2).length,
    repeatRate: customers.length
      ? Math.round((customers.filter((c) => c.visits >= 2).length / customers.length) * 100)
      : 0,
    statusCounts,
    serviceMix: [...serviceTotals.values()].sort((a, b) => b.count - a.count),
  };
}
