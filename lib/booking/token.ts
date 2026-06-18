import type { BookingRecord } from "@/lib/booking/types";

/**
 * Compact, URL-safe encoding of the booking summary. This lets the confirmation
 * page render (and produce an ICS file) without a database, so it works in
 * email-only mode and is idempotent / shareable by URL. When Supabase is
 * enabled the record is also persisted for the owner's records.
 *
 * Note: this is base64url, not encryption. It carries only the customer's own
 * booking details shown back to them. For sensitive multi-tenant data, persist
 * to the database and look up by id instead.
 */
export function generateBookingId(): string {
  const part = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SB-${part}`;
}

export function encodeBooking(record: BookingRecord): string {
  return Buffer.from(JSON.stringify(record), "utf8").toString("base64url");
}

export function decodeBooking(token: string): BookingRecord | null {
  try {
    const json = Buffer.from(token, "base64url").toString("utf8");
    const data = JSON.parse(json);
    if (data && typeof data.id === "string" && data.customer?.email) {
      return data as BookingRecord;
    }
    return null;
  } catch {
    return null;
  }
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Build an .ics calendar event (floating local time) for the appointment. */
export function buildIcs(record: BookingRecord, opts: { durationHours?: number } = {}): string {
  const duration = opts.durationHours ?? 2;
  const [y, m, d] = record.date.split("-").map(Number);
  const [hh, mm] = record.time.split(":").map(Number);
  const startLocal = `${y}${pad(m)}${pad(d)}T${pad(hh)}${pad(mm)}00`;
  const endHour = hh + duration;
  const endLocal = `${y}${pad(m)}${pad(d)}T${pad(endHour)}${pad(mm)}00`;
  const stamp =
    new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const summary = `Silverback Detailing — ${record.serviceName}`;
  const location =
    record.location.type === "mobile"
      ? record.location.address || "Mobile service"
      : "Silverback Detailing, Hamilton, ON";
  const description = `Booking ${record.id} — ${record.serviceName}. ${record.vehicle.year} ${record.vehicle.make} ${record.vehicle.model}.`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Silverback Detailing//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${record.id}@silverbackdetail.com`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${startLocal}`,
    `DTEND:${endLocal}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
