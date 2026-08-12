import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, isSupabaseAuthConfigured } from "@/lib/supabase/env";

export const ADMIN_LOGIN_PATH = "/admin/login";
export const ADMIN_HOME_PATH = "/admin";

/**
 * Refreshes the Supabase session and applies the coarse gate on /admin.
 *
 * This is the optimistic check only. It runs before rendering and keeps signed
 * out visitors from ever seeing an admin screen, but it proves nothing about
 * authorization: the binding check is requireAdmin() in lib/admin/dal.ts, which
 * runs next to the data. Never add a permission decision here that is not also
 * enforced there.
 */
export async function updateAdminSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // With no credentials configured there is no session to refresh and no way to
  // sign in. Let the login page render and explain itself rather than bouncing
  // the visitor between two routes that both redirect.
  if (!isSupabaseAuthConfigured()) return NextResponse.next({ request });

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        // Carries the no-store headers the library supplies with refreshed auth
        // cookies. Without them a CDN can cache a response holding one person's
        // session token and hand it to the next visitor.
        for (const [key, value] of Object.entries(headers)) response.headers.set(key, value);
      },
    },
  });

  // Nothing may run between createServerClient and getClaims. An early return or
  // an unrelated await in this gap is the documented cause of sessions dropping
  // at random. getClaims verifies the JWT signature against the project's
  // published keys on every call; getSession only decodes the cookie and would
  // trust anything shaped like a token, so it must not be used to gate.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);

  if (!signedIn && pathname !== ADMIN_LOGIN_PATH) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_LOGIN_PATH;
    url.search = "";
    // Return them to the screen they actually wanted once they are in. Only the
    // path is carried over, so this can never be pointed at another origin.
    if (pathname !== ADMIN_HOME_PATH) url.searchParams.set("next", pathname);
    return redirectKeepingCookies(url, response);
  }

  if (signedIn && pathname === ADMIN_LOGIN_PATH) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_HOME_PATH;
    url.search = "";
    return redirectKeepingCookies(url, response);
  }

  return response;
}

/**
 * A redirect discards the response the Supabase client just wrote its refreshed
 * cookies onto, so they have to be copied across. Dropping them signs the user
 * out on the very request that renewed their token.
 */
function redirectKeepingCookies(url: URL, source: NextResponse) {
  const redirect = NextResponse.redirect(url);
  for (const cookie of source.cookies.getAll()) redirect.cookies.set(cookie);
  for (const [key, value] of source.headers) {
    if (key.toLowerCase() === "cache-control") redirect.headers.set(key, value);
  }
  return redirect;
}
