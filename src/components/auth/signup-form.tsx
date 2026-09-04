"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Check, Sparkles, Gift } from "lucide-react";
import type { AuthFormState } from "@/types/auth";
import { signUpAction } from "@/services/auth";
import { LOCALES, LOCALE_FLAGS, LOCALE_LABELS, type Locale } from "@/lib/i18n";
import { CURRENCIES, CURRENCY_LABELS, currencyForLocale, type Currency } from "@/lib/currency";

const initialState: AuthFormState = {};

const fieldClass =
  "rounded-lg border border-[#E7E2D9] bg-white px-3 py-2 text-sm text-[#1B1B1F] outline-none focus:border-[#FF6B4A] focus:ring-1 focus:ring-[#FF6B4A]";

const POSTS_PER_WEEK = [
  { value: "1-2", label: "1–2 opslag" },
  { value: "3-5", label: "3–5 opslag" },
  { value: "6-10", label: "6–10 opslag" },
  { value: "10+", label: "10+ opslag" },
];

const VIDEOS_PER_WEEK = [
  { value: "0", label: "Ingen endnu" },
  { value: "1-2", label: "1–2 videoer" },
  { value: "3-5", label: "3–5 videoer" },
  { value: "6+", label: "6+ videoer" },
];

const COUNTRIES = [
  "Danmark", "Spanien", "Tyskland", "Sverige", "Norge", "Storbritannien",
  "Frankrig", "Italien", "Holland", "Portugal", "USA", "Andet",
];

const CHANNELS = [
  { value: "facebook", label: "Facebook", color: "#1877F2" },
  { value: "instagram", label: "Instagram", color: "#E1306C" },
  { value: "tiktok", label: "TikTok", color: "#010101" },
  { value: "linkedin", label: "LinkedIn", color: "#0A66C2" },
  { value: "youtube", label: "YouTube", color: "#FF0000" },
];

// Language used for the AI-generated posts (can differ from the app language,
// e.g. a Danish host writing English posts for international guests).
const POST_LANGUAGES: { value: string; label: string }[] = [
  { value: "da", label: "🇩🇰 Dansk" },
  { value: "en", label: "🇬🇧 English" },
  { value: "de", label: "🇩🇪 Deutsch" },
  { value: "es", label: "🇪🇸 Español" },
  { value: "fr", label: "🇫🇷 Français" },
  { value: "it", label: "🇮🇹 Italiano" },
  { value: "nl", label: "🇳🇱 Nederlands" },
  { value: "sv", label: "🇸🇪 Svenska" },
  { value: "no", label: "🇳🇴 Norsk" },
  { value: "pt", label: "🇵🇹 Português" },
];

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signUpAction, initialState);

  const [locale, setLocale] = useState<Locale>("da");
  const [currency, setCurrency] = useState<Currency>("dkk");
  const [postLanguage, setPostLanguage] = useState<string>("da");
  const [postLanguageTouched, setPostLanguageTouched] = useState(false);
  const [postsPerWeek, setPostsPerWeek] = useState("3-5");
  const [videosPerWeek, setVideosPerWeek] = useState("1-2");
  const [channels, setChannels] = useState<Set<string>>(new Set(["facebook", "instagram"]));

  function onLocaleChange(next: Locale) {
    setLocale(next);
    setCurrency(currencyForLocale(next));
    // Keep the post language in sync with the site language until the user
    // explicitly picks a different one.
    if (!postLanguageTouched) setPostLanguage(next);
  }

  function toggleChannel(value: string) {
    setChannels((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  return (
    <div>
      {/* Get-started banner */}
      <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white">
          <Gift size={15} />
        </div>
        <div>
          <p className="text-sm font-bold text-emerald-800">Kom i gang på få minutter</p>
          <p className="text-xs leading-relaxed text-emerald-700">
            Opret din konto og få adgang til studiet — generér opslag og lav præsentationsvideoer af din bolig.
          </p>
        </div>
      </div>

      <h1 className="text-2xl text-[#1B1B1F]" style={{ fontFamily: "var(--font-fraunces)" }}>
        Opret din konto
      </h1>
      <p className="mt-1 text-sm text-[#6B6B76]">
        Fortæl os lidt om dig, så tilpasser vi din oplevelse.
      </p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        {/* Language settings — first choice on the page */}
        <div className="flex flex-col gap-3 rounded-xl border border-[#E7E2D9] bg-[#FBF9F5] p-4">
          <p className="text-sm font-semibold text-[#1B1B1F]">Sprogindstillinger</p>

          {/* Site language + currency */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="locale" className="text-sm font-medium text-[#1B1B1F]">Sprog til siden</label>
            <div className="flex gap-3">
              <select
                id="locale"
                name="locale"
                value={locale}
                onChange={(e) => onLocaleChange(e.target.value as Locale)}
                className={`${fieldClass} flex-1`}
              >
                {LOCALES.map((loc) => (
                  <option key={loc} value={loc}>
                    {LOCALE_FLAGS[loc]} {LOCALE_LABELS[loc]}
                  </option>
                ))}
              </select>
              <select
                id="currency"
                name="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                aria-label="Valuta"
                className={`${fieldClass} w-32`}
              >
                {CURRENCIES.map((cur) => (
                  <option key={cur} value={cur}>{CURRENCY_LABELS[cur]}</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-[#6B6B76]">Hele appen vises på det valgte sprog, når du er logget ind.</p>
          </div>

          {/* Post language */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="post_language" className="text-sm font-medium text-[#1B1B1F]">Sprog til opslag</label>
            <select
              id="post_language"
              name="post_language"
              value={postLanguage}
              onChange={(e) => { setPostLanguage(e.target.value); setPostLanguageTouched(true); }}
              className={fieldClass}
            >
              {POST_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
            <p className="text-xs text-[#6B6B76]">Sproget dine AI-genererede opslag skrives på — kan afvige fra sidens sprog.</p>
          </div>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-[#1B1B1F]">Navn</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Dit navn"
            className={fieldClass}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-[#1B1B1F]">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-[#1B1B1F]">Adgangskode</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="Mindst 8 tegn"
            className={fieldClass}
          />
        </div>

        {/* Posts per week */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="posts_per_week" className="text-sm font-medium text-[#1B1B1F]">
            Hvor mange opslag forventer du at lave om ugen?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {POSTS_PER_WEEK.map((opt) => {
              const on = postsPerWeek === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPostsPerWeek(opt.value)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    on
                      ? "border-[#FF6B4A] bg-[#FFF4F1] text-[#FF6B4A]"
                      : "border-[#E7E2D9] bg-white text-[#6B6B76] hover:border-[#d9d2c6]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <input type="hidden" name="posts_per_week" value={postsPerWeek} />
        </div>

        {/* Videos per week */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#1B1B1F]">
            Hvor mange nye videoer forventer du om ugen?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {VIDEOS_PER_WEEK.map((opt) => {
              const on = videosPerWeek === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setVideosPerWeek(opt.value)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    on
                      ? "border-[#FF6B4A] bg-[#FFF4F1] text-[#FF6B4A]"
                      : "border-[#E7E2D9] bg-white text-[#6B6B76] hover:border-[#d9d2c6]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <input type="hidden" name="videos_per_week" value={videosPerWeek} />
        </div>

        {/* Country */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="country" className="text-sm font-medium text-[#1B1B1F]">Land</label>
          <select id="country" name="country" defaultValue="Danmark" className={fieldClass}>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Channels */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[#1B1B1F]">
            Hvilke kanaler vil du dele på?
          </span>
          <div className="flex flex-wrap gap-2">
            {CHANNELS.map((ch) => {
              const on = channels.has(ch.value);
              return (
                <button
                  key={ch.value}
                  type="button"
                  onClick={() => toggleChannel(ch.value)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    on
                      ? "border-transparent text-white"
                      : "border-[#E7E2D9] bg-white text-[#6B6B76] hover:border-[#d9d2c6]"
                  }`}
                  style={on ? { background: ch.color } : undefined}
                >
                  {on && <Check size={13} />}
                  {ch.label}
                </button>
              );
            })}
          </div>
          {[...channels].map((c) => (
            <input key={c} type="hidden" name="channels" value={c} />
          ))}
        </div>

        {state?.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        )}

        {state?.notice && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{state.notice}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
        >
          <Sparkles size={15} />
          {isPending ? "Opretter konto…" : "Opret konto"}
        </button>

        {/* Reassurance row */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-[#6B6B76]">
          <span className="inline-flex items-center gap-1"><Check size={12} className="text-emerald-500" /> Klar på få minutter</span>
          <span className="inline-flex items-center gap-1"><Check size={12} className="text-emerald-500" /> Opsig når som helst</span>
          <span className="inline-flex items-center gap-1"><Check size={12} className="text-emerald-500" /> Ingen binding</span>
        </div>
      </form>

      <p className="mt-6 text-sm text-[#6B6B76]">
        Har du allerede en konto?{" "}
        <Link href="/login" className="font-medium text-[#FF6B4A]">Log ind</Link>
      </p>
    </div>
  );
}
