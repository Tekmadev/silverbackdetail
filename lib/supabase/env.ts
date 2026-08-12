/**
 * Public Supabase credentials, resolved in one place.
 *
 * Supabase has since renamed the "anon key" to the "publishable key". This
 * project's .env.example predates that rename, so both names are accepted and
 * the older one wins. Each value is written as a full `process.env.X`
 * expression on purpose: Next inlines NEXT_PUBLIC_* by literal text match at
 * build time, so a computed lookup like process.env[name] would come back
 * undefined in the browser.
 *
 * Safe to import from client code. The service role key lives in server.ts and
 * must never appear here.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "";

/** Whether sign-in can work at all. False in local dev with no .env.local. */
export function isSupabaseAuthConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
}
