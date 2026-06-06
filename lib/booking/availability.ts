import { businessConfig } from "@/lib/config/business";
import type { Weekday } from "@/lib/config/site";

export type DayAvailability = {
  date: string; // YYYY-MM-DD
  weekday: Weekday;
  label: string; // e.g. "Mon, Jun 8"
  slots: string[]; // ["08:00", ...]
};

const WEEKDAYS: Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

/** Today's date (YYYY-MM-DD) in the business timezone. */
function torontoToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function weekdayOf(iso: string): Weekday {
  const d = new Date(`${iso}T12:00:00Z`);
  return WEEKDAYS[d.getUTCDay()];
}

function labelOf(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return new Intl.DateTimeFormat("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(d);
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Compute bookable days/slots from the business config. The minimum lead time
 * (48h) is honored by starting two days out, so every offered slot is safely
 * beyond the lead window without fragile timezone arithmetic.
 */
export function getAvailability(daysAhead = 30): DayAvailability[] {
  const leadDays = Math.max(1, Math.ceil(businessConfig.booking.minLeadTimeHours / 24));
  const start = addDays(torontoToday(), leadDays);
  const result: DayAvailability[] = [];

  for (let i = 0; i < daysAhead; i++) {
    const date = addDays(start, i);
    const weekday = weekdayOf(date);
    const hours = businessConfig.hours[weekday];
    if (hours.closed) continue;

    const open = toMinutes(hours.open);
    const close = toMinutes(hours.close);
    const slots = businessConfig.booking.dailySlots.filter((s) => {
      const m = toMinutes(s);
      return m >= open && m < close;
    });
    if (slots.length === 0) continue;

    result.push({ date, weekday, label: labelOf(date), slots });
  }

  return result;
}

/** Validate that a chosen date+time is a real, offered slot. */
export function isSlotAvailable(date: string, time: string): boolean {
  return getAvailability(60).some((d) => d.date === date && d.slots.includes(time));
}

export function formatSlotLabel(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12}:00 ${period}` : `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}
