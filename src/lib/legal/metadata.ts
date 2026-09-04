import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { LOCALES } from "@/lib/i18n";
import { legalDoc } from "./index";
import type { LegalSlug } from "./types";

const BASE = "https://www.somevideopost.com";

const OG_LOCALE: Record<Locale, string> = {
  da: "da_DK",
  en: "en_GB",
  es: "es_ES",
  de: "de_DE",
};

/**
 * Metadata for a legal page. Danish is the canonical, unprefixed variant (as
 * with /priser and /hvorfor-somevideopost), so every locale points its
 * x-default at the Danish URL and lists the full hreflang cluster.
 */
export function legalMetadata(locale: Locale, slug: LegalSlug): Metadata {
  const doc = legalDoc(locale, slug);
  const url = locale === "da" ? `${BASE}/${slug}` : `${BASE}/${locale}/${slug}`;

  const languages = Object.fromEntries([
    ...LOCALES.map((loc) => [loc, loc === "da" ? `${BASE}/${slug}` : `${BASE}/${loc}/${slug}`]),
    ["x-default", `${BASE}/${slug}`],
  ]) as Record<string, string>;

  return {
    title: doc.metaTitle,
    description: doc.metaDescription,
    alternates: { canonical: url, languages },
    openGraph: {
      title: doc.metaTitle,
      description: doc.metaDescription,
      type: "website",
      siteName: "somevideopost.com",
      locale: OG_LOCALE[locale],
      url,
    },
    // Legal boilerplate carries no search value and would only dilute the
    // pages that do; keep it indexable for users but out of the ranking mix.
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}
