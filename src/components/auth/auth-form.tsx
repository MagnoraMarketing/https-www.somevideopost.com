"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import type { AuthFormState } from "@/types/auth";
import { LOCALES, LOCALE_FLAGS, LOCALE_LABELS, type Locale } from "@/lib/i18n";
import { CURRENCIES, CURRENCY_LABELS, currencyForLocale, type Currency } from "@/lib/currency";

interface AuthFormProps {
  action: (
    state: AuthFormState,
    formData: FormData
  ) => Promise<AuthFormState>;
  submitLabel: string;
  pendingLabel: string;
  title: string;
  description: string;
  footer: { text: string; linkLabel: string; href: string };
  /** Show language + currency pickers (used on signup). */
  showPreferences?: boolean;
  /**
   * Message from wherever the user came from — the email-confirmation callback
   * above all, whose outcome is otherwise invisible on this page.
   */
  banner?: { tone: "info" | "error"; text: string };
}

const initialState: AuthFormState = {};

const selectClass =
  "rounded-lg border border-[#E7E2D9] bg-white px-3 py-2 text-sm text-[#1B1B1F] outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A]";

export function AuthForm({
  action,
  submitLabel,
  pendingLabel,
  title,
  description,
  footer,
  showPreferences = false,
  banner,
}: AuthFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialState
  );

  const [locale, setLocale] = useState<Locale>("da");
  const [currency, setCurrency] = useState<Currency>("dkk");

  // Default the currency to match the chosen language; the user can override it.
  function onLocaleChange(next: Locale) {
    setLocale(next);
    setCurrency(currencyForLocale(next));
  }

  return (
    <div>
      <h1
        className="text-2xl text-[#1B1B1F]"
        style={{ fontFamily: "var(--font-fraunces)" }}
      >
        {title}
      </h1>
      <p className="mt-1 text-sm text-[#6B6B76]">{description}</p>

      {banner && (
        <p
          className={`mt-4 rounded-lg border px-3 py-2 text-sm ${
            banner.tone === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {banner.text}
        </p>
      )}

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-sm font-medium text-[#1B1B1F]"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded-lg border border-[#E7E2D9] bg-white px-3 py-2 text-sm text-[#1B1B1F] outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium text-[#1B1B1F]"
          >
            Adgangskode
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="current-password"
            className="rounded-lg border border-[#E7E2D9] bg-white px-3 py-2 text-sm text-[#1B1B1F] outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A]"
          />
        </div>

        {showPreferences && (
          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-1.5">
              <label htmlFor="locale" className="text-sm font-medium text-[#1B1B1F]">
                Language
              </label>
              <select
                id="locale"
                name="locale"
                value={locale}
                onChange={(e) => onLocaleChange(e.target.value as Locale)}
                className={selectClass}
              >
                {LOCALES.map((loc) => (
                  <option key={loc} value={loc}>
                    {LOCALE_FLAGS[loc]} {LOCALE_LABELS[loc]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <label htmlFor="currency" className="text-sm font-medium text-[#1B1B1F]">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className={selectClass}
              >
                {CURRENCIES.map((cur) => (
                  <option key={cur} value={cur}>
                    {CURRENCY_LABELS[cur]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {state?.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)",
          }}
        >
          {isPending ? pendingLabel : submitLabel}
        </button>
      </form>

      <p className="mt-6 text-sm text-[#6B6B76]">
        {footer.text}{" "}
        <Link href={footer.href} className="font-medium text-[#FF6B4A]">
          {footer.linkLabel}
        </Link>
      </p>
    </div>
  );
}
