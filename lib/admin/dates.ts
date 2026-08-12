import { businessConfig } from "@/lib/config/business";

/**
 * Date helpers for the admin views.
 *
 * Bookings store `date` as a plain YYYY-MM-DD and `time` as HH:MM, with no
 * offset. Handing those to `new Date()` parses them as UTC, which on a Vercel
 * server puts every Hamilton appointment four to five hours off and flips
 * evening bookings onto the wrong day. So dates here are compared as strings in
 * the shop's own timezone, and only converted to a Date when a real duration is
 * needed, always anchored at UTC midnight on both ends so the subtraction
 * yields whole days.
 */

const TZ = businessConfig.timeZone;

/** Today in the shop's timezone as YYYY-MM-DD. en-CA formats in that order. */
export function shopToday(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Whole days between two YYYY-MM-DD strings. Negative when `to` precedes `from`. */
export function daysBetween(from: string, to: string): number {
  const a = Date.parse(`${from}T00:00:00Z`);
  const b = Date.parse(`${to}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.round((b - a) / 86_400_000);
}

/** Shifts a YYYY-MM-DD by whole days, staying in string space. */
export function addDays(date: string, days: number): string {
  const ms = Date.parse(`${date}T00:00:00Z`);
  if (Number.isNaN(ms)) return date;
  return new Date(ms + days * 86_400_000).toISOString().slice(0, 10);
}

/** The YYYY-MM of a booking date, for month bucketing. */
export function monthOf(date: string): string {
  return date.slice(0, 7);
}

/** Current month in the shop's timezone, as YYYY-MM. */
export function shopThisMonth(): string {
  return shopToday().slice(0, 7);
}

/** The month before `month` (YYYY-MM in, YYYY-MM out). */
export function previousMonth(month: string): string {
  const [year, mon] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, mon - 1, 1));
  date.setUTCMonth(date.getUTCMonth() - 1);
  return date.toISOString().slice(0, 7);
}

/** "Tue 12 Aug" — compact enough for a phone, unambiguous about the day. */
export function formatShortDate(date: string): string {
  const ms = Date.parse(`${date}T12:00:00Z`);
  if (Number.isNaN(ms)) return date;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(ms));
}

/** "Tuesday 12 August 2026" for detail screens where there is room. */
export function formatLongDate(date: string): string {
  const ms = Date.parse(`${date}T12:00:00Z`);
  if (Number.isNaN(ms)) return date;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(ms));
}

/** 24h "14:00" to "2:00 PM". */
export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h)) return time;
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m ?? 0).padStart(2, "0")} ${period}`;
}

/** "in 3 days", "today", "6 weeks ago" — relative to the shop's today. */
export function describeGap(days: number): string {
  if (days === 0) return "today";
  const abs = Math.abs(days);
  const past = days < 0;
  let value: string;
  if (abs === 1) value = "1 day";
  else if (abs < 21) value = `${abs} days`;
  else if (abs < 60) value = `${Math.round(abs / 7)} weeks`;
  else if (abs < 730) value = `${Math.round(abs / 30)} months`;
  else value = `${Math.floor(abs / 365)} years`;
  return past ? `${value} ago` : `in ${value}`;
}
