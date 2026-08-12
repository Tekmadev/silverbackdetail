import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { ADMIN_LOGIN_PATH } from "@/lib/supabase/proxy";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";

/** Account kinds in public.profiles. Customers are the default for a new sign-up. */
export type UserRole = "admin" | "customer";

export type Profile = {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  role: UserRole;
};

/**
 * Loads a profile by Supabase user id.
 *
 * Returns any account, customer or admin, because public.profiles is shared:
 * the dashboard and the future customer area are the same list of people
 * separated by `role`. Deciding what a caller may do is the job of the callers
 * below, not of this lookup.
 *
 * Matched on id rather than email so that changing an address in Supabase does
 * not silently revoke access, or worse, hand it to whoever claims the old one.
 */
export async function findProfileById(userId: string): Promise<Profile | null> {
  const db = getSupabaseAdmin();
  if (!db) return null;

  const { data, error } = await db
    .from("profiles")
    .select("id, email, full_name, phone, role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    // Usually means the profiles table or its trigger has not been created yet.
    // Failing closed is right, but say so in the logs: from the outside this is
    // indistinguishable from a correct password being rejected.
    console.error("[admin] profile lookup failed:", error.message);
    return null;
  }
  if (!data) return null;

  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name ?? null,
    phone: data.phone ?? null,
    role: data.role as UserRole,
  };
}

/**
 * The signed-in account, whatever its role, or null.
 *
 * `cache` memoises for one render pass, so a layout and every page beneath it
 * share a single lookup per request.
 *
 * getClaims is used rather than getSession: it verifies the token's signature
 * against the project's published keys, where getSession only decodes whichever
 * cookie was sent. A gate built on getSession trusts the client.
 */
export const getProfile = cache(async (): Promise<Profile | null> => {
  // createServerClient throws on an empty URL or key, which would turn a missing
  // env var into a 500 on every admin route. Treating it as "not signed in"
  // instead sends the visitor to the login page, which explains what is absent.
  if (!isSupabaseAuthConfigured()) return null;

  const supabase = await createAuthClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return null;

  return findProfileById(String(userId));
});

/** The signed-in account, but only when it is an admin. */
export const getAdmin = cache(async (): Promise<Profile | null> => {
  const profile = await getProfile();
  return profile?.role === "admin" ? profile : null;
});

/**
 * Call at the top of every admin page, server action, and route handler that
 * touches booking data. proxy.ts already turns anonymous visitors away, but it
 * runs at the edge of the request and cannot be the only check: this one sits
 * next to the data, which is where authorization has to be decided.
 *
 * A signed-in customer hitting an admin URL lands here and is redirected, since
 * holding an account is not the same as being allowed in.
 */
export async function requireAdmin(): Promise<Profile> {
  const admin = await getAdmin();
  if (!admin) redirect(ADMIN_LOGIN_PATH);
  return admin;
}
