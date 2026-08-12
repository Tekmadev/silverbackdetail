import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/lib/supabase/env";

/**
 * Cookie-bound Supabase client, used only to establish WHO is asking.
 *
 * This client carries the visitor's own credentials and is deliberately not the
 * one that reads bookings. Identity is settled here; the booking data is then
 * read with the service role client in server.ts, only after lib/admin/dal.ts
 * has approved the caller. That split is what lets supabase/schema.sql keep RLS
 * on with zero policies: no browser-held key can reach the table at all, so a
 * mistake in this file cannot leak customer records.
 *
 * A new client per request, never a module-level singleton, or one visitor's
 * session leaks into another's request under a warm serverless instance.
 */
export async function createAuthClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot write cookies. Harmless: proxy.ts refreshes
          // the session on every /admin request, so the refreshed token is
          // persisted there instead of being lost.
        }
      },
    },
  });
}
