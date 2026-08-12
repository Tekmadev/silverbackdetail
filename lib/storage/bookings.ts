import "server-only";
import { getSupabaseAdmin, isSupabaseEnabled } from "@/lib/supabase/server";
import type { BookingRecord, BookingStatus } from "@/lib/booking/types";

/**
 * Booking persistence. When STORAGE_PROVIDER=supabase and credentials exist,
 * records are written to the `bookings` table (see supabase/schema.sql).
 * Otherwise this is a no-op and the system runs in email-only mode — the owner
 * still receives every booking by email; nothing is lost.
 */

function toRow(r: BookingRecord) {
  return {
    id: r.id,
    status: r.status,
    created_at: r.createdAt,
    service_slug: r.serviceSlug,
    service_name: r.serviceName,
    price_from: r.priceFrom,
    currency: r.currency,
    requires_deposit: r.requiresDeposit,
    deposit_amount: r.depositAmount,
    deposit_paid: r.depositPaid,
    stripe_session_id: r.stripeSessionId ?? null,
    vehicle: r.vehicle,
    location: r.location,
    date: r.date,
    time: r.time,
    customer: r.customer,
  };
}

export async function saveBooking(record: BookingRecord): Promise<void> {
  if (!isSupabaseEnabled()) return;
  const db = getSupabaseAdmin();
  if (!db) return;
  const { error } = await db.from("bookings").insert(toRow(record));
  if (error) console.error("[storage] saveBooking failed:", error.message);
}

/**
 * A row as it comes back from `select("*")` on `bookings`. Mirrors
 * supabase/schema.sql; the jsonb columns are typed through BookingRecord so the
 * two definitions cannot disagree.
 */
export type BookingRow = {
  id: string;
  status: BookingRecord["status"];
  created_at: string;
  service_slug: string;
  service_name: string;
  price_from: number;
  currency: string;
  requires_deposit: boolean;
  deposit_amount: number;
  deposit_paid: boolean;
  stripe_session_id: string | null;
  vehicle: BookingRecord["vehicle"];
  location: BookingRecord["location"];
  date: string;
  time: string;
  customer: BookingRecord["customer"];
};

/**
 * Maps a `bookings` row to the app's shape. Exported because the admin
 * dashboard reads the same table and must not drift into a second, subtly
 * different mapping of the same columns.
 */
export function rowToBooking(data: BookingRow): BookingRecord {
  return {
    id: data.id,
    status: data.status,
    createdAt: data.created_at,
    serviceSlug: data.service_slug,
    serviceName: data.service_name,
    priceFrom: data.price_from,
    currency: data.currency,
    requiresDeposit: data.requires_deposit,
    depositAmount: data.deposit_amount,
    depositPaid: data.deposit_paid,
    stripeSessionId: data.stripe_session_id,
    vehicle: data.vehicle,
    location: data.location,
    date: data.date,
    time: data.time,
    customer: data.customer,
  };
}

export async function getBookingById(id: string): Promise<BookingRecord | null> {
  if (!isSupabaseEnabled()) return null;
  const db = getSupabaseAdmin();
  if (!db) return null;
  const { data, error } = await db.from("bookings").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return rowToBooking(data);
}

export async function updateBooking(
  id: string,
  patch: { status?: BookingStatus; depositPaid?: boolean; stripeSessionId?: string },
): Promise<void> {
  if (!isSupabaseEnabled()) return;
  const db = getSupabaseAdmin();
  if (!db) return;
  const row: Record<string, unknown> = {};
  if (patch.status) row.status = patch.status;
  if (patch.depositPaid !== undefined) row.deposit_paid = patch.depositPaid;
  if (patch.stripeSessionId) row.stripe_session_id = patch.stripeSessionId;
  const { error } = await db.from("bookings").update(row).eq("id", id);
  if (error) console.error("[storage] updateBooking failed:", error.message);
}
