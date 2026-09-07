"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, Loader2, Copy, Check, RefreshCw, Wand2 } from "lucide-react";
import { saveVideoCaption } from "@/services/video-jobs";

type Platform = "facebook" | "instagram" | "tiktok" | "linkedin";

const PLATFORMS: { key: Platform; label: string }[] = [
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "linkedin", label: "LinkedIn" },
];

export function VideoSalesText({
  orderId,
  title,
  description,
  location,
  bookingUrl,
  caption,
  setCaption,
  initialPlatform,
  hasStoredCaption = false,
}: {
  /** The order the text belongs to — everything generated is stored on it. */
  orderId: string;
  title?: string;
  description?: string | null;
  location?: string | null;
  bookingUrl?: string | null;
  caption: string;
  setCaption: (v: string) => void;
  initialPlatform?: string;
  /** True when the caption above came from the database, not from this session. */
  hasStoredCaption?: boolean;
}) {
  const [platform, setPlatform] = useState<Platform>(
    PLATFORMS.some((p) => p.key === initialPlatform) ? (initialPlatform as Platform) : "facebook",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // A text that failed to store looks identical to a stored one until the page
  // is reloaded and the edit is gone, so say it now.
  const [saveError, setSaveError] = useState("");
  const [copied, setCopied] = useState(false);
  const variationRef = useRef(0);
  const autoRanRef = useRef(false);

  const save = useCallback(async (text: string, forPlatform: Platform) => {
    const { error: err } = await saveVideoCaption(orderId, text, forPlatform);
    setSaveError(err ? "Teksten blev ikke gemt — den er væk, hvis du genindlæser siden." : "");
  }, [orderId]);

  const generate = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-video-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          title,
          description,
          location,
          bookingUrl,
          variation: variationRef.current++,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.text) throw new Error(data.error ?? "Kunne ikke generere tekst");
      const text = data.text as string;
      setCaption(text);
      // Persist immediately: a text nobody stored is a text the next visit
      // silently replaces.
      void save(text, platform);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Noget gik galt");
    } finally {
      setLoading(false);
    }
  }, [save, platform, title, description, location, bookingUrl, setCaption]);

  // Auto-generate a first suggestion once, when there's nothing yet. A caption
  // already stored on the order is never overwritten by a fresh generation.
  useEffect(() => {
    if (autoRanRef.current || caption.trim() || hasStoredCaption) return;
    autoRanRef.current = true;
    generate();
  }, [caption, hasStoredCaption, generate]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard blocked */ }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <Wand2 size={16} className="text-[#FF6B4A]" />
          <span className="font-semibold text-slate-900">AI-salgstekst</span>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
          {loading ? "Genererer…" : "Generer ny med AI"}
        </button>
      </div>

      <div className="px-5 py-4 space-y-3">
        {/* Platform picker — shapes tone + length */}
        <div className="flex flex-wrap gap-1.5">
          {PLATFORMS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPlatform(p.key)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                platform === p.key
                  ? "border border-[#FF6B4A] bg-orange-50 text-[#FF6B4A]"
                  : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            // Edits are stored when the field loses focus — no keystroke-level
            // traffic, but nothing typed here is lost on a reload either.
            onBlur={() => { if (caption.trim()) void save(caption, platform); }}
            rows={7}
            placeholder={loading ? "AI skriver din salgstekst…" : "Din salgstekst vises her — du kan rette frit."}
            className="w-full resize-y rounded-xl border border-slate-200 px-3.5 py-3 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-[#FF6B4A] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/10"
          />
          {loading && !caption && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <Loader2 size={22} className="animate-spin text-[#FF6B4A]" />
            </div>
          )}
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
        {saveError && <p className="text-xs text-amber-600">{saveError}</p>}

        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">{caption.length} tegn · redigér frit før du deler</p>
          <button
            onClick={copy}
            disabled={!caption.trim()}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            {copied ? <><Check size={12} className="text-emerald-500" /> Kopieret</> : <><Copy size={12} /> Kopiér</>}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-5 py-2.5">
        <Sparkles size={11} className="text-slate-400" />
        <p className="text-[11px] text-slate-400">Teksten bruges automatisk, når du deler nedenfor.</p>
      </div>
    </div>
  );
}
