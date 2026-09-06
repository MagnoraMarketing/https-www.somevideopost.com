import { NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * Email-confirmation and magic-link callback.
 *
 * Supabase sends the user here after they confirm their address, with either
 * a one-time `code` (PKCE) or a `token_hash` + `type` pair (the OTP template).
 * Without this route the parameters land on a page that ignores them: the
 * account exists but can never get a session from the email, which looks to
 * the user exactly like a broken signup.
 *
 * Every failure path ends on /login with a reason the page can explain, never
 * on a blank screen — the account is already created, so logging in is always
 * the way forward.
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const code = params.get("code");
  const tokenHash = params.get("token_hash");
  const type = params.get("type") as EmailOtpType | null;

  // Where to land afterwards. Only a same-origin path is honoured, so the link
  // cannot bounce someone to another site. The second character must be
  // neither "/" nor "\\": the URL parser treats a backslash as a slash for
  // http(s), which would turn "/\\evil.com" into a protocol-relative URL
  // pointing at another host.
  const rawNext = params.get("next") ?? "/dashboard";
  const next = /^\/(?![/\\])/.test(rawNext) ? rawNext : "/dashboard";

  const login = (query: string) => NextResponse.redirect(new URL(`/login${query}`, req.nextUrl.origin));

  // Supabase reports its own failures (expired link, already used) on the
  // redirect URL rather than by refusing to send the user here.
  const authError = params.get("error_description") ?? params.get("error");
  if (authError) {
    console.error("[auth] callback reported an error:", authError.slice(0, 200));
    return login("?error=confirmation");
  }

  if (!code && !tokenHash) {
    return login("?error=missing_code");
  }

  let supabase;
  try {
    supabase = await createClient();
  } catch (e) {
    // Supabase not configured on this deployment. A 500 here would tell the
    // user their confirmation link is broken; send them somewhere they can act.
    console.error("[auth] callback unavailable:", e instanceof Error ? e.message : String(e));
    return login("?error=config");
  }

  // The OTP form works from any browser; the PKCE code only works in the one
  // that started the signup, because the verifier lives in its cookie.
  const { error } = tokenHash
    ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type ?? "email" })
    : await supabase.auth.exchangeCodeForSession(code!);

  if (error) {
    // Most often an expired or already-used link — or a link opened in a
    // different browser than the one the account was created in.
    console.error("[auth] confirmation failed:", error.message);
    return login("?error=confirmation");
  }

  // A confirmation can verify the address without issuing a session (the OTP
  // path on some project settings). Then the login page is the destination.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return login("?confirmed=1");

  return NextResponse.redirect(new URL(next, req.nextUrl.origin));
}
