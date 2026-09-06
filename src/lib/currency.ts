import type { Locale } from "./i18n";

// ── Currency ────────────────────────────────────────────────────────────────
export type Currency = "dkk" | "eur";

export const CURRENCIES: Currency[] = ["dkk", "eur"];

export const CURRENCY_LABELS: Record<Currency, string> = {
  dkk: "DKK (kr.)",
  eur: "EUR (€)",
};

export function isCurrency(value: unknown): value is Currency {
  return value === "dkk" || value === "eur";
}

/** Validate a raw value to a Currency, falling back when it's not one. */
export function coerceCurrency(value: unknown, fallback: Currency = "eur"): Currency {
  return isCurrency(value) ? value : fallback;
}

/**
 * Which currency a visitor is billed & shown prices in, based on their language.
 * Danish users use DKK; everyone else uses EUR.
 */
export const LOCALE_CURRENCY: Record<Locale, Currency> = {
  da: "dkk",
  en: "eur",
  es: "eur",
  de: "eur",
};

export function currencyForLocale(locale: Locale): Currency {
  return LOCALE_CURRENCY[locale] ?? "eur";
}

// ── Prices ──────────────────────────────────────────────────────────────────
/**
 * Single source of truth for every amount we charge or display.
 * Amounts are in the currency's minor unit (øre for DKK, cents for EUR).
 */
export const PRICES = {
  // Subscription tiers (shown on /priser and the landing page)
  starter:      { dkk: 37500,  eur: 5000 },   // 375 kr. / €50 per month — 1 video/mo
  pro:          { dkk: 73900,  eur: 9900 },   // 739 kr. / €99 per month — 2 videos/mo
  business:     { dkk: 222900, eur: 29900 },  // 2.229 kr. / €299 per month — 6 videos/mo
  // Pay-per-use presentation video (charged when generation reaches 80%).
  // The EUR amount is the DKK price converted and rounded to a whole euro, so
  // the two currencies stay within a few percent of each other.
  video:        { dkk: 9900,   eur: 1400 },   // 99 kr. / €14 per video
  // Entry subscription that funds the monthly post balance (clearly disclosed).
  subscription: { dkk: 7500,   eur: 1000 },   // 75 kr. / €10 per month
  aiPost:       { dkk: 500,    eur: 67 },     // 5 kr. / €0.67 — 1 credit = 1 post
} as const;

export type PriceKey = keyof typeof PRICES;

// Post-credits granted each month the subscription is paid (1 credit = 1 post).
// ~€10 worth of posts at 5 kr each.
export const MONTHLY_POST_CREDITS = 15;

// Free post-credits every new account starts with, matching what the marketing
// pages promise ("2 gratis opslag ved oprettelse — intet kreditkort påkrævet").
export const FREE_SIGNUP_POSTS = 2;

export function priceAmount(key: PriceKey, currency: Currency): number {
  return PRICES[key][currency];
}

// ── Formatting ──────────────────────────────────────────────────────────────
const INTL_LOCALE: Record<Currency, string> = {
  dkk: "da-DK", // → "299 kr."
  eur: "en-IE", // → "€40"
};

/**
 * Format a minor-unit amount as a localized currency string.
 * Decimals are hidden for whole amounts unless `decimals` is forced.
 */
export function formatPrice(
  minor: number,
  currency: Currency,
  opts: { decimals?: boolean } = {},
): string {
  const showDecimals = opts.decimals ?? minor % 100 !== 0;
  const digits = showDecimals ? 2 : 0;
  return new Intl.NumberFormat(INTL_LOCALE[currency], {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(minor / 100);
}

/** Convenience: format a known price key for a currency. */
export function formatPriceKey(
  key: PriceKey,
  currency: Currency,
  opts?: { decimals?: boolean },
): string {
  return formatPrice(priceAmount(key, currency), currency, opts);
}
