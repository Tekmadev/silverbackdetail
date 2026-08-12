"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createAuthClient } from "@/lib/supabase/auth";
import { findProfileById } from "@/lib/admin/dal";
import { isSupabaseAuthConfigured } from "@/lib/supabase/env";
import { ADMIN_HOME_PATH, ADMIN_LOGIN_PATH } from "@/lib/supabase/proxy";

export type SignInState = { error?: string };

const credentials = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

/**
 * Only ever redirect to a path inside the admin area.
 *
 * `next` arrives in the query string, so treating it as a URL would let a
 * crafted link bounce someone from a page they trust to an attacker's login
 * form. Anything not a plain /admin path is discarded, including
 * protocol-relative "//evil.com" which some URL parsers treat as absolute.
 */
function safeNext(next: string | null | undefined): string {
  if (!next) return ADMIN_HOME_PATH;
  if (!next.startsWith("/admin") || next.startsWith("//")) return ADMIN_HOME_PATH;
  return next;
}

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  if (!isSupabaseAuthConfigured()) {
    return { error: "Sign-in is not configured on this deployment." };
  }

  const parsed = credentials.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Enter your email and password." };

  const supabase = await createAuthClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  // One message for a wrong password and for an address that has no account, so
  // the form cannot be used to work out who has a login here.
  if (error || !data.user) return { error: "That email and password do not match." };

  // Signing in proves identity, not entitlement. Customers hold perfectly valid
  // accounts in the same table, so the role is checked before the session is
  // allowed to stand.
  const profile = await findProfileById(data.user.id);
  if (profile?.role !== "admin") {
    // Authenticated but not authorized. Drop the session immediately rather than
    // leaving a valid cookie sitting in their browser.
    await supabase.auth.signOut();
    return { error: "That account does not have access to this dashboard." };
  }

  // Outside the checks above because redirect works by throwing; wrapping it in
  // a try would swallow the redirect and silently strand the user on the form.
  redirect(safeNext(formData.get("next") as string | null));
}

export async function signOut(): Promise<void> {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect(ADMIN_LOGIN_PATH);
}
