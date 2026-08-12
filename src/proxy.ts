import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

type Locale = "da" | "en" | "es" | "de";

const LOCALE_PATHS: Record<Locale, string> = {
  da: "/",
  en: "/en",
  es: "/es",
  de: "/de",
};

const ALL_LOCALES: Locale[] = ["da", "en", "es", "de"];

// Bare (unprefixed) slugs whose default content is Danish, mirroring the
// homepage's "/" convention. Non-Danish visitors get redirected to their
// /en, /es or /de variant. "" represents the homepage itself.
const DA_DEFAULT_SLUGS = new Set(["", "priser", "hvorfor-somevideopost"]);

function detectLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get("locale")?.value as Locale | undefined;
  if (cookieLocale && cookieLocale in LOCALE_PATHS) return cookieLocale;

  const acceptLang = request.headers.get("accept-language") ?? "";
  for (const part of acceptLang.split(",")) {
    const tag = part.split(";")[0].trim().toLowerCase();
    if (tag === "da" || tag.startsWith("da-")) return "da";
    if (tag.startsWith("en")) return "en";
    if (tag === "es" || tag.startsWith("es-")) return "es";
    if (tag === "de" || tag.startsWith("de-")) return "de";
  }
  return "da";
}

function setLocaleCookie(res: NextResponse, locale: Locale) {
  res.cookies.set("locale", locale, { path: "/", maxAge: 31536000, sameSite: "lax" });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Explicit language choice via ?lang=xx from the language switcher. Every
  // page's *default* locale is unprefixed (Danish for most pages, English
  // for the AI-video pillar pages), so a stale `locale` cookie would
  // otherwise redirect that bare URL straight back to the previously chosen
  // language — making it impossible to switch back. The switcher always
  // builds the exact target pathname itself (see localizedPathFor in
  // lib/i18n.ts), so this just needs to persist the cookie and drop the
  // query param, not rewrite the path.
  const langParam = request.nextUrl.searchParams.get("lang");
  if (langParam && (ALL_LOCALES as string[]).includes(langParam)) {
    const locale = langParam as Locale;
    const url = request.nextUrl.clone();
    url.searchParams.delete("lang");
    const redirect = NextResponse.redirect(url);
    setLocaleCookie(redirect, locale);
    return redirect;
  }

  // Explicit locale-prefixed routes (/en/…, /es/…, /de/…, /da/…) — persist
  // cookie and continue. /da/... exists only for the AI-video pillar pages,
  // whose default (unprefixed) locale is English rather than Danish.
  for (const locale of ALL_LOCALES) {
    const prefix = `/${locale}`;
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      const res = await updateSession(request);
      setLocaleCookie(res, locale);
      return res;
    }
  }

  const locale = detectLocale(request);

  // Redirect non-Danish visitors away from bare Danish-default pages to
  // their localized variant — mirrors the original homepage-only behavior,
  // now extended to priser and hvorfor-somevideopost. The auth pages
  // (/login, /signup) and everything else deliberately stay OUT of this
  // set: prefixing /login would send it to /es/login, which redirects back
  // to /login (next.config) and loops infinitely (ERR_TOO_MANY_REDIRECTS).
  //
  // Deliberately NOT applied to the AI-video pillar pages (some-ai-video,
  // ai-video-for-real-estate, generate-ai-video-free, ai-video-for-apartment):
  // those are built English-first to rank for specific English search
  // queries, and crawlers without a clear Accept-Language header fall back
  // to "da" in detectLocale() above — auto-redirecting them away from the
  // canonical English URL would undermine the exact SEO goal those pages
  // exist for. Their /da /es /de variants are reachable via the language
  // switcher and hreflang alternates instead, never via auto-redirect.
  const bareSlug = pathname === "/" ? "" : pathname.slice(1);
  if (locale !== "da" && DA_DEFAULT_SLUGS.has(bareSlug)) {
    const url = request.nextUrl.clone();
    url.pathname = bareSlug === "" ? LOCALE_PATHS[locale] : `${LOCALE_PATHS[locale]}/${bareSlug}`;
    const redirect = NextResponse.redirect(url);
    setLocaleCookie(redirect, locale);
    return redirect;
  }

  const res = await updateSession(request);
  setLocaleCookie(res, locale);
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
