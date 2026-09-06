"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Link as LinkIcon, Loader2, Sparkles, CheckCircle2, Clock, Star,
  RefreshCw, AlertCircle, MapPin, Tag, Maximize2, ShoppingCart,
  Pencil,
} from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { scrapePropertyUrl, type ScrapedProperty } from "@/services/scrape-property";
import { getSocialAccounts } from "@/services/social-accounts";
import { createPostAction } from "@/services/posts";
import { PriceRows } from "@/components/pricing/price-rows";
import { useCurrency } from "@/components/pricing/currency-context";
import { formatPriceKey } from "@/lib/currency";

// ── Brand icons ───────────────────────────────────────────────────────────────

function IconFacebook() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ig-grad2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433"/>
          <stop offset="25%" stopColor="#e6683c"/>
          <stop offset="50%" stopColor="#dc2743"/>
          <stop offset="75%" stopColor="#cc2366"/>
          <stop offset="100%" stopColor="#bc1888"/>
        </linearGradient>
      </defs>
      <path fill="url(#ig-grad2)" d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.975 1.246 2.242 1.308 3.608.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.849c-.062 1.366-.334 2.633-1.308 3.608-.975.974-2.242 1.246-3.608 1.308-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.849c.062-1.366.334-2.633 1.308-3.608C4.516 2.497 5.783 2.225 7.149 2.163 8.414 2.105 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.197.157 3.355.673 1.955 2.073.555 3.473.039 5.315-.045 7.17-.104 8.45-.117 8.858-.117 12c0 3.141.013 3.55.072 4.83.085 1.854.6 3.697 2 5.097 1.4 1.4 3.242 1.916 5.097 2 1.28.06 1.689.073 4.83.073s3.55-.013 4.83-.072c1.854-.085 3.697-.6 5.097-2 1.4-1.4 1.916-3.243 2-5.097.06-1.28.073-1.689.073-4.83s-.013-3.55-.072-4.83c-.085-1.854-.6-3.697-2-5.097C20.43.555 18.587.039 16.733-.045 15.452-.104 15.044-.117 12-.117zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  );
}

function IconLinkedin() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#0A66C2" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const PLATFORMS = [
  { id: "facebook" as const, label: "Facebook", desc: "Varm tone, emojis, 1500 tegn", color: "#1877F2", icon: <IconFacebook /> },
  { id: "instagram" as const, label: "Instagram", desc: "Kort, visuelt, 15-20 hashtags", color: "#E1306C", icon: <IconInstagram /> },
  { id: "linkedin" as const, label: "LinkedIn", desc: "Professionel, investorfokus", color: "#0A66C2", icon: <IconLinkedin /> },
];

// The last line quotes a price, so it is built from the shared table rather
// than written out — the same reason the boxes below take their amounts there.
const benefitsFor = (postPrice: string) => [
  "AI-genereret tekst tilpasset platformen",
  "Henter billeder direkte fra annoncen",
  "Henter titel, pris, størrelse og beliggenhed",
  `${postPrice} pr. opslag fra din månedlige saldo`,
];

type Account = Awaited<ReturnType<typeof getSocialAccounts>>[number];

type GenerateResponse = { text?: string; error?: string; code?: string };

/**
 * Read /api/generate-post's reply defensively: a function that times out or
 * crashes replies with an HTML error page, and calling .json() on that throws —
 * which previously left the button spinning with no message at all.
 */
async function readGenerateResponse(res: Response): Promise<GenerateResponse> {
  try {
    return (await res.json()) as GenerateResponse;
  } catch {
    return {
      error: `Serveren svarede uventet (HTTP ${res.status}). Prøv igen om lidt.`,
    };
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function GeneratePostPage() {
  // Prices come from the shared table in the account's own currency, so the
  // copy can never quote an amount the checkout does not charge.
  const currency = useCurrency();
  const postPrice = formatPriceKey("aiPost", currency, { decimals: true });
  const subscriptionPrice = formatPriceKey("subscription", currency);

  // URL + scrape
  const [url, setUrl] = useState("");
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState("");
  const [scraped, setScraped] = useState<ScrapedProperty | null>(null);
  const [listingUrl, setListingUrl] = useState("");

  // Text generation
  const [platform, setPlatform] = useState<"facebook" | "instagram" | "linkedin">("facebook");
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [noCredits, setNoCredits] = useState(false);

  // Text editing
  const [editingText, setEditingText] = useState(false);

  // Image selection from listing
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Publish
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [saving, setSaving] = useState(false);

  // ── Scrape ─────────────────────────────────────────────────────────────────

  async function handleScrape() {
    if (!url.trim()) return;
    setScraping(true);
    setScrapeError("");
    setScraped(null);
    setGeneratedText("");
    setImages([]);
    setSelectedImage(null);

    const result = await scrapePropertyUrl(url.trim());

    if (result.error || !result.data) {
      setScraping(false);
      setScrapeError(result.error ?? "Kunne ikke hente annoncen.");
      return;
    }
    const data = result.data;
    setScraped(data);
    setListingUrl(url.trim());
    setImages(data.imageUrls.slice(0, 5));
    setSelectedImage(null);

    const accs = await getSocialAccounts();
    setAccounts(accs);

    // Auto-generate text immediately after scraping
    setGenerating(true);
    setScraping(false);
    const res = await fetch("/api/generate-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform,
        title: data.title,
        description: data.description,
        location: data.location,
        price: data.price,
        size: data.size,
        listingUrl: url.trim(),
      }),
    });
    const json = await readGenerateResponse(res);
    setGenerating(false);
    // The API signals an empty balance with `code`, not `error` — `error` holds
    // the human-readable message shown next to the subscribe link.
    if (json.code === "no_credits") { setNoCredits(true); return; }
    if (json.error || !json.text) { setGenerateError(json.error ?? "Generering fejlede."); return; }
    setGeneratedText(json.text);
    setEditingText(false);
  }

  async function handleRegenerate() {
    if (!scraped) return;
    setGenerating(true);
    setGenerateError("");
    setNoCredits(false);
    const res = await fetch("/api/generate-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform,
        title: scraped.title,
        description: scraped.description,
        location: scraped.location,
        price: scraped.price,
        size: scraped.size,
        listingUrl,
      }),
    });
    const json = await readGenerateResponse(res);
    setGenerating(false);
    // The API signals an empty balance with `code`, not `error` — `error` holds
    // the human-readable message shown next to the subscribe link.
    if (json.code === "no_credits") { setNoCredits(true); return; }
    if (json.error || !json.text) { setGenerateError(json.error ?? "Generering fejlede."); return; }
    setGeneratedText(json.text);
    setEditingText(false);
  }

  // ── Save ───────────────────────────────────────────────────────────────────

  async function handleSave() {
    setSaving(true);
    const formData = new FormData();
    formData.append("content", generatedText);
    for (const id of selectedAccounts) formData.append("account_ids[]", id);
    if (scheduledAt) formData.append("scheduled_at", scheduledAt);
    if (selectedImage) formData.append("image_url", selectedImage);
    await createPostAction(formData);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Topbar title="Generer SOME opslag" description="AI genererer et sælgende opslag tilpasset dine sociale medier" />

      {/* Info banner */}
      <div className="border-b border-orange-100 bg-orange-50 px-4 py-2.5 md:px-8 md:py-3">
        <p className="text-sm text-orange-800">
          <span className="font-semibold">{postPrice} pr. opslag</span> — trækkes fra din månedlige saldo (abonnement {subscriptionPrice}/md.).
        </p>
      </div>

      {/* ── LAYOUT (same design on mobile and web) ── */}
      <div className="flex flex-1 px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-6">

            {/* Left sidebar */}
            <div className="flex flex-col gap-4 md:col-span-2">
              <div
                className="relative overflow-hidden rounded-2xl p-6 text-white"
                style={{ background: "linear-gradient(160deg,#1B3F7A 0%,#14306b 100%)" }}
              >
                <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
                  <Sparkles size={11} /> AI-drevet
                </div>
                <h2 className="mb-1 text-xl font-bold leading-snug">
                  Generer SOME<br />opslag med AI
                </h2>
                <p className="mb-5 text-sm text-blue-200">Fra boliglink til færdigt opslag på få sekunder</p>
                <div className="mb-5 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className="fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-xs text-blue-200">Brugt af mæglere</span>
                </div>
                <ul className="space-y-2.5">
                  {benefitsFor(postPrice).map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-blue-100">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Priser</p>
                <PriceRows
                  rows={[
                    { label: "Abonnement", price: "subscription", suffix: "/ md." },
                    { label: "Pr. opslag", price: "aiPost", decimals: true },
                    { label: "Præsentationsvideo", price: "video" },
                  ]}
                />
                <p className="mt-2 text-[11px] text-slate-400">Abonnementet giver din månedlige opslag-saldo. Opsig når som helst.</p>
                <Link href="/billing" className="mt-3 flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:underline">
                  <ShoppingCart size={11} /> Se abonnement & saldo
                </Link>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50">
                  <Clock size={17} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Klar på sekunder</p>
                  <p className="text-xs text-slate-500">AI genererer og tilpasser teksten øjeblikkeligt</p>
                </div>
              </div>
            </div>

            {/* Right form area */}
            <div className="flex flex-col gap-4 md:col-span-3">

              {/* 1. URL */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-1 text-base font-bold text-slate-900">1. Indsæt link til annonce</h3>
                <p className="mb-4 text-sm text-slate-500">Fx Airbnb, Booking.com, Novasol eller din egen hjemmeside.</p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative flex-1">
                    <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleScrape()}
                      placeholder="https://www.airbnb.dk/rooms/…"
                      className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleScrape}
                    disabled={scraping || generating || !url.trim()}
                    className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg,#1B3F7A,#3B6DC9)" }}
                  >
                    {(scraping || generating) ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    {scraping ? "Henter…" : generating ? "Genererer…" : "Generer SOME opslag"}
                  </button>
                </div>
                {scrapeError && (
                  <p className="mt-3 flex items-start gap-2 text-sm text-red-600">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" /> {scrapeError}
                  </p>
                )}
                {generateError && (
                  <p className="mt-3 flex items-start gap-2 text-sm text-red-600">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" /> {generateError}
                  </p>
                )}
                {noCredits && (
                  <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-semibold text-amber-800">Ingen saldo tilbage</p>
                    <p className="mt-0.5 text-xs text-amber-700">Tegn abonnementet ({subscriptionPrice}/md.) for at få din månedlige opslag-saldo.</p>
                    <Link href="/billing" className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 underline">
                      <ShoppingCart size={11} /> Tegn abonnement
                    </Link>
                  </div>
                )}
                {scraped && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {scraped.location && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
                        <MapPin size={11} /> {scraped.location}
                      </span>
                    )}
                    {scraped.price && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
                        <Tag size={11} /> {scraped.price}
                      </span>
                    )}
                    {scraped.size && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
                        <Maximize2 size={11} /> {scraped.size}
                      </span>
                    )}
                    {scraped.title && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                        <CheckCircle2 size={11} /> {scraped.title.slice(0, 40)}{scraped.title.length > 40 ? "…" : ""}
                      </span>
                    )}
                  </div>
                )}
                {scraped && (
                  <div className="mt-3">
                    <label className="mb-1 block text-xs font-medium text-slate-600">Link i opslaget (kan ændres)</label>
                    <input
                      type="url"
                      value={listingUrl}
                      onChange={(e) => setListingUrl(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* 2. Text */}
              {generatedText && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">3. Rediger tekst</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingText((v) => !v)}
                        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${editingText ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                      >
                        <Pencil size={11} />
                        {editingText ? "Luk redigering" : "Rediger"}
                      </button>
                      <button
                        type="button"
                        onClick={handleRegenerate}
                        disabled={generating}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                      >
                        {generating ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
                        Regenerer
                      </button>
                    </div>
                  </div>
                  {editingText ? (
                    <>
                      <textarea
                        value={generatedText}
                        onChange={(e) => setGeneratedText(e.target.value)}
                        rows={10}
                        autoFocus
                        className="w-full rounded-xl border border-blue-300 px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                      <p className="mt-1 text-right text-xs text-slate-400">{generatedText.length} tegn</p>
                    </>
                  ) : (
                    <div
                      className="group relative cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
                      onClick={() => setEditingText(true)}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">{generatedText}</p>
                      <div className="absolute right-3 top-3 rounded-lg border border-slate-200 bg-white p-1.5 opacity-0 shadow-sm transition group-hover:opacity-100">
                        <Pencil size={13} className="text-slate-500" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 4. Images */}
              {scraped && images.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-1 text-base font-bold text-slate-900">4. Vælg opslagsbillede</h3>
                  <p className="mb-4 text-sm text-slate-500">Billeder hentet fra annoncen. Klik for at vælge ét (valgfrit).</p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {images.map((src, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedImage(selectedImage === src ? null : src)}
                        className={`group relative aspect-square overflow-hidden rounded-xl border-2 transition ${
                          selectedImage === src ? "border-blue-500 shadow-md" : "border-transparent hover:border-slate-300"
                        }`}
                      >
                        { }
                        <img src={src} alt={`Billede ${i + 1}`} className="h-full w-full object-cover" />
                        {selectedImage === src && (
                          <div className="absolute inset-0 flex items-center justify-center bg-blue-600/20">
                            <CheckCircle2 size={20} className="text-white drop-shadow" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-slate-400">
                    {selectedImage ? "✓ Billede valgt — følger med i opslaget" : "Klik et billede for at vælge det"}
                  </p>
                </div>
              )}

              {/* 5. Publish */}
              {generatedText && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-1 text-base font-bold text-slate-900">5. Vælg platform og udgiv</h3>
                  <p className="mb-4 text-sm text-slate-500">Vælg platform for at tilpasse tonen — eller gem som kladde.</p>
                  <div className="mb-5 grid grid-cols-3 gap-3">
                    {PLATFORMS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPlatform(p.id)}
                        className={`flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 text-center transition ${
                          platform === p.id ? "border-current shadow-sm" : "border-slate-200 hover:border-slate-300"
                        }`}
                        style={platform === p.id ? { borderColor: p.color, background: `${p.color}0d` } : {}}
                      >
                        {p.icon}
                        <span className="text-xs font-semibold text-slate-800">{p.label}</span>
                        <span className="hidden text-[10px] text-slate-400 leading-tight sm:block">{p.desc}</span>
                      </button>
                    ))}
                  </div>
                  {selectedImage && (
                    <div className="mb-4 flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-3">
                      { }
                      <img src={selectedImage} alt="Valgt billede" className="h-16 w-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-blue-800">Opslagsbillede valgt</p>
                        <p className="text-xs text-blue-600">Følger med opslaget ved deling</p>
                      </div>
                      <button type="button" onClick={() => setSelectedImage(null)} className="rounded-lg p-1.5 text-blue-400 hover:bg-blue-100">✕</button>
                    </div>
                  )}
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-medium text-slate-600">Udgiv til konto</p>
                    {accounts.length === 0 ? (
                      <p className="text-sm text-slate-400">
                        Ingen konti tilsluttet.{" "}
                        <Link href="/accounts/connect" className="underline text-blue-600">Tilslut en konto.</Link>
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {accounts.map((a) => (
                          <label
                            key={a.id}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition hover:bg-slate-50 ${
                              selectedAccounts.includes(a.id) ? "border-blue-400 bg-blue-50" : "border-slate-200"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedAccounts.includes(a.id)}
                              onChange={(e) =>
                                setSelectedAccounts((prev) =>
                                  e.target.checked ? [...prev, a.id] : prev.filter((id) => id !== a.id)
                                )
                              }
                              className="accent-blue-600"
                            />
                            <span className="text-sm text-slate-800">{a.account_name}</span>
                            <span className="ml-auto text-xs capitalize text-slate-400">{a.platform}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mb-6">
                    <label className="mb-1.5 block text-xs font-medium text-slate-600">Planlæg (valgfrit)</label>
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                    <Link href="/posts" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                      Annuller
                    </Link>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg,#1B3F7A,#3B6DC9)" }}
                    >
                      {saving ? <Loader2 size={13} className="animate-spin" /> : null}
                      {saving ? "Gemmer…" : "Gem opslag"}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
