import type { NextRequest } from "next/server";
import { updateAdminSession } from "@/lib/supabase/proxy";

/**
 * Next 16 renamed the `middleware` convention to `proxy`. Same position in the
 * request lifecycle, runs before anything renders.
 */
export async function proxy(request: NextRequest) {
  return updateAdminSession(request);
}

export const config = {
  // Scoped to /admin rather than the whole site. The Supabase quickstart matches
  // every route because its example app is authenticated end to end; here the
  // admin area is the only thing behind a login, and the marketing pages are
  // static and cacheable. Running a session refresh across all of them would
  // make every public page dynamic for no gain.
  //
  // Anything added outside /admin that needs a session must be added here too.
  matcher: ["/admin/:path*"],
};
