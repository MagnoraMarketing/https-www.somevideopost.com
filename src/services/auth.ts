"use server";

import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { coerceLocale, type Locale } from "@/lib/i18n";
import { coerceCurrency, currencyForLocale, isCurrency, type Currency } from "@/lib/currency";
import type { AuthFormState } from "@/types/auth";

const PREF_COOKIE = { path: "/", maxAge: 31536000, sameSite: "lax" as const };

/** Persist the account's language & currency choice to cookies for this session. */
async function applyPreferenceCookies(locale: Locale, currency: Currency) {
  const store = await cookies();
  store.set("locale", locale, PREF_COOKIE);
  store.set("currency", currency, PREF_COOKIE);
}

/**
 * Turn a Supabase auth error into something a user can act on.
 *
 * supabase-js sets `message` to a stringified empty body ("{}") when GoTrue
 * replies with an error shape it cannot parse — typically a 500 from a failing
 * database trigger during signup. Rendering that verbatim shows the user a
 * literal "{}" and tells them nothing, so fall back to the status code.
 */
function authErrorMessage(error: { message?: string; status?: number }): string {
  const raw = (error.message ?? "").trim();
  if (raw && raw !== "{}" && raw !== "[object Object]") return raw;
  if (error.status && error.status >= 500) {
    return "Kontoen kunne ikke oprettes på grund af en serverfejl. Prøv igen om lidt — hvis det bliver ved, er der en fejl i databasen (fejl " + error.status + ").";
  }
  return "Kontoen kunne ikke oprettes. Kontrollér din email og adgangskode, og prøv igen.";
}

/** Hosts that no confirmation email may ever point at — the link is dead the
 * moment it leaves the developer's own machine. */
function isLocalHost(host: string): boolean {
  const name = host.split(":")[0].toLowerCase();
  return (
    name === "localhost" ||
    name === "127.0.0.1" ||
    name === "::1" ||
    name === "0.0.0.0" ||
    name.endsWith(".local")
  );
}

/** The deployment's public base URL, without a trailing slash. */
function configuredAppUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? "https://www.somevideopost.com";
  return raw.replace(/\/+$/, "");
}

/**
 * Absolute URL for the confirmation link Supabase emails out.
 *
 * Derived from the request rather than a fixed env var, so a signup on a
 * preview deployment confirms back to that same deployment instead of bouncing
 * the user to production — except when the request came from a local dev
 * server, where a localhost link is a guaranteed "connection refused" in the
 * recipient's inbox. Those fall back to the configured public URL.
 */
async function emailRedirectUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  const base = host && !isLocalHost(host) ? `${proto}://${host}` : configuredAppUrl();
  return `${base}/auth/callback`;
}

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const locale = coerceLocale(formData.get("locale"));
  // Default currency follows the language unless the user picked one explicitly.
  const currency = coerceCurrency(formData.get("currency"), currencyForLocale(locale));

  // Onboarding profile fields (optional — improve personalisation & admin stats).
  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  // Language for AI-generated posts; defaults to the app language.
  const postLanguage = String(formData.get("post_language") ?? locale).trim().slice(0, 8);
  const postsPerWeek = String(formData.get("posts_per_week") ?? "").trim().slice(0, 20);
  const videosPerWeek = String(formData.get("videos_per_week") ?? "").trim().slice(0, 20);
  const country = String(formData.get("country") ?? "").trim().slice(0, 60);
  const channels = formData
    .getAll("channels")
    .map(String)
    .filter(Boolean)
    .slice(0, 10);

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Without this the confirmation link follows the project's Site URL,
      // which on a fresh Supabase project is http://localhost:3000 — a dead
      // link for every real user.
      emailRedirectTo: await emailRedirectUrl(),
      data: {
        locale,
        currency,
        ...(postLanguage ? { post_language: postLanguage } : {}),
        ...(name ? { name } : {}),
        ...(postsPerWeek ? { posts_per_week: postsPerWeek } : {}),
        ...(videosPerWeek ? { videos_per_week: videosPerWeek } : {}),
        ...(country ? { country } : {}),
        ...(channels.length ? { channels } : {}),
      },
    },
  });

  if (error) {
    // The user-facing text is deliberately vague when the message is unusable;
    // log the full error so the real cause is visible server-side.
    console.error("Sign-up failed", {
      status: error.status,
      name: error.name,
      code: error.code,
      message: error.message,
    });
    return { error: authErrorMessage(error) };
  }

  await applyPreferenceCookies(locale, currency);

  // With email confirmation enabled, signUp succeeds but issues no session.
  // Redirecting to /dashboard then bounces straight back to /login, which looks
  // exactly like the signup silently failing — so say what actually happened.
  if (!data.session) {
    return {
      notice:
        "Din konto er oprettet. Vi har sendt en bekræftelsesmail til " +
        email +
        " — bekræft din adresse, og log derefter ind.",
      // The form turns this into a visible "Gå til login" button: the account
      // exists, so the only thing left to do is log in.
      loginHref: "/login?registered=1",
    };
  }

  redirect("/dashboard");
}

export async function signInAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Incorrect email or password." };
  }

  // Re-apply the account's saved language & currency for this session.
  const meta = data.user?.user_metadata ?? {};
  const locale = coerceLocale(meta.locale);
  const currency = isCurrency(meta.currency) ? meta.currency : currencyForLocale(locale);
  await applyPreferenceCookies(locale, currency);

  redirect("/dashboard");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
