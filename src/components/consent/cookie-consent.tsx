"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, Check } from "lucide-react";
import {
  CONSENT,
  CONSENT_COOKIE,
  CONSENT_MAX_AGE,
  CONSENT_CHANGED_EVENT,
  OPEN_CONSENT_EVENT,
  isConsentChoice,
  type ConsentChoice,
} from "@/lib/consent";
import { legalHref } from "@/lib/legal";
import type { Locale } from "@/lib/i18n";

function writeConsentCookie(choice: ConsentChoice) {
  document.cookie = `${CONSENT_COOKIE}=${choice}; path=/; max-age=${CONSENT_MAX_AGE}; samesite=lax`;
}

/**
 * Cookie banner.
 *
 * Shown only until the visitor decides; the choice is stored in a first-party
 * cookie so the server can read it during render and avoid a flash. Reopened
 * from the footer's "cookie settings" link via a window event, so the footer
 * can stay a server component.
 *
 * `initialChoice` comes from the same cookie read server-side. When it is
 * already set, nothing renders on first paint.
 */
export function CookieConsent({
  locale,
  initialChoice,
}: {
  locale: Locale;
  initialChoice: ConsentChoice | null;
}) {
  const [open, setOpen] = useState(initialChoice === null);
  const t = CONSENT[locale];

  useEffect(() => {
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  const decide = useCallback((choice: ConsentChoice) => {
    writeConsentCookie(choice);
    setOpen(false);
    window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: choice }));
  }, []);

  if (!open) return null;

  const [before, after] = t.readMore.split("{link}");

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t.regionLabel}
      className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[#071233]/95 p-5 shadow-2xl backdrop-blur sm:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 text-orange-300">
            <Cookie size={16} />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white">{t.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{t.body}</p>
            <p className="mt-1.5 text-sm text-slate-400">
              {before}
              <Link
                href={legalHref(locale, "cookiepolitik")}
                className="text-orange-300 underline underline-offset-2 transition-colors hover:text-orange-200"
              >
                {t.policyLabel}
              </Link>
              {after}
            </p>
          </div>
        </div>

        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
            <dt className="flex items-center justify-between text-xs font-semibold text-white">
              {t.necessaryTitle}
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                <Check size={10} strokeWidth={3} /> {t.alwaysOn}
              </span>
            </dt>
            <dd className="mt-1.5 text-xs leading-relaxed text-slate-400">{t.necessaryDesc}</dd>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
            <dt className="text-xs font-semibold text-white">{t.statisticsTitle}</dt>
            <dd className="mt-1.5 text-xs leading-relaxed text-slate-400">{t.statisticsDesc}</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row-reverse">
          <button
            type="button"
            onClick={() => decide("all")}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
          >
            {t.acceptAll}
          </button>
          <button
            type="button"
            onClick={() => decide("necessary")}
            className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-white/30 hover:text-white"
          >
            {t.necessaryOnly}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Footer link that reopens the banner so a choice can be changed. */
export function CookieSettingsButton({ locale }: { locale: Locale }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className="transition-colors hover:text-slate-400"
    >
      {CONSENT[locale].settingsLabel}
    </button>
  );
}

export { isConsentChoice };
