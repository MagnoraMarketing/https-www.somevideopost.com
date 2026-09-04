import type { Locale } from "@/lib/i18n";
import type { LegalByLocale, LegalDoc, LegalSlug, LocalisedLegal } from "./types";
import { LEGAL_DA } from "./da";
import { LEGAL_EN } from "./en";
import { LEGAL_ES } from "./es";
import { LEGAL_DE } from "./de";

export * from "./types";
export { COMPANY, hasPostalAddress, postalAddress } from "./company";

export const LEGAL: LegalByLocale = {
  da: LEGAL_DA,
  en: LEGAL_EN,
  es: LEGAL_ES,
  de: LEGAL_DE,
};

export function legalFor(locale: Locale): LocalisedLegal {
  return LEGAL[locale] ?? LEGAL.da;
}

export function legalDoc(locale: Locale, slug: LegalSlug): LegalDoc {
  return legalFor(locale).docs[slug];
}

/** Path to a legal document — Danish is unprefixed, like /priser. */
export function legalHref(locale: Locale, slug: LegalSlug): string {
  return locale === "da" ? `/${slug}` : `/${locale}/${slug}`;
}
