import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { missingPublicSupabaseVars, readPublicSupabaseConfig } from "./config";

/**
 * Refresh the Supabase auth session on every request and keep cookies in sync.
 */

// The middleware runs on nearly every route, so a warning per request would be
// unreadable. One line per cold start is enough to explain the state.
let warnedUnconfigured = false;

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request });

  const config = readPublicSupabaseConfig();
  if (!config) {
    // Without configuration there is no session to refresh — but the request
    // must still be served. Throwing here (which is what the non-null
    // assertions used to do) took down every page on the site, including the
    // ones that need no authentication at all.
    if (!warnedUnconfigured) {
      warnedUnconfigured = true;
      console.error(
        `[supabase] ${missingPublicSupabaseVars().join(" og ")} mangler — ` +
          "login og alt bag login virker ikke. Sæt variablerne i Vercel og deploy igen.",
      );
    }
    return supabaseResponse;
  }

  let response = supabaseResponse;

  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Touch the session so expired tokens get refreshed. A failure here (network
  // blip, Supabase outage) must not take the page down with it — the visitor
  // is simply treated as signed out for this request.
  try {
    await supabase.auth.getUser();
  } catch (e) {
    console.error(`[supabase] session refresh failed: ${e instanceof Error ? e.message : String(e)}`);
  }

  return response;
}
