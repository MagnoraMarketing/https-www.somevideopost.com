import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Email-confirmation and magic-link callback.
 *
 * Supabase sends the user here with a one-time `code` after they confirm their
 * address. Without this route the code lands on a page that ignores it: the
 * account exists but can never get a session from the email, which looks to the
 * user exactly like a broken signup.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  // Where to land afterwards. Only a same-origin path is honoured, so the link
  // cannot bounce someone to another site. The second character must be
  // neither "/" nor "\\": the URL parser treats a backslash as a slash for
  // http(s), which would turn "/\\evil.com" into a protocol-relative URL
  // pointing at another host.
  const rawNext = req.nextUrl.searchParams.get("next") ?? "/dashboard";
  const next = /^\/(?![/\\])/.test(rawNext) ? rawNext : "/dashboard";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", req.nextUrl.origin));
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch (e) {
    // Supabase not configured on this deployment. A 500 here would tell the
    // user their confirmation link is broken; send them somewhere they can act.
    console.error("[auth] callback unavailable:", e instanceof Error ? e.message : String(e));
    return NextResponse.redirect(new URL("/login?error=config", req.nextUrl.origin));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    // Most often an expired or already-used link.
    console.error("[auth] code exchange failed:", error.message);
    return NextResponse.redirect(new URL("/login?error=confirmation", req.nextUrl.origin));
  }

  return NextResponse.redirect(new URL(next, req.nextUrl.origin));
}
