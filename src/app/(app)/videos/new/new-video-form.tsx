"use client";

import { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { createVideoOrderCheckout } from "@/services/billing";
import {
  Upload, Link as LinkIcon, X, Loader2, Sparkles, CheckCircle2, Clock,
  Star, ChevronLeft, ChevronRight, Plus, AlertCircle, MapPin, Tag,
  Maximize2, Download, Share2, Users, UploadCloud, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { scrapePropertyUrl, type ScrapedProperty } from "@/services/scrape-property";
import { ScreenshotImporter } from "@/components/screenshot-importer";
import { StyleSelector } from "@/components/video/style-selector";
import { DEFAULT_VIDEO_STYLE, type VideoStyleId } from "@/lib/video-styles";

const ROOM_LABELS = [
  "Stue", "Køkken", "Soveværelse", "Badeværelse", "Altan/Terrasse",
  "Spisestue", "Entre", "Soveværelse 2", "Badeværelse 2", "Udendørs",
  "Udsigt", "Detaljer", "Soveværelse 3", "Kontor", "Bryggers",
  "Pool", "Have", "Garage", "Kælder", "Loft",
];

const BENEFITS = [
  "Cinematisk præsentationsvideo med AI",
  "Professionelle kamerabevægelser og overgange",
  "Klar på 5-15 minutter — leveres direkte i appen",
  "Del direkte på sociale medier",
];

function PhotoTour({
  images,
  onRemove,
  onAdd,
  uploading,
}: {
  images: string[];
  onRemove: (i: number) => void;
  onAdd: () => void;
  uploading: boolean;
}) {
  const [selected, setSelected] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Removing photos can leave the selection past the end of the strip. Clamp
  // during render so the corrected index is used for this paint — an effect
  // would first paint an empty frame for an index that no longer exists.
  if (images.length > 0 && selected > images.length - 1) {
    setSelected(images.length - 1);
  }

  function scrollStrip(dir: "left" | "right") {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -120 : 120, behavior: "smooth" });
  }

  const current = images[selected];
  const label = ROOM_LABELS[selected] ?? `Billede ${selected + 1}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900">Fotorute</p>
          <p className="text-xs text-slate-400 mt-0.5">{images.length} billede{images.length !== 1 ? "r" : ""} valgt til video</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <Plus size={12} /> Tilføj
        </button>
      </div>

      <div className="relative px-4 py-3 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollStrip("left")}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50"
          >
            <ChevronLeft size={13} />
          </button>
          <div ref={scrollRef} className="flex gap-2.5 overflow-x-auto scrollbar-hide flex-1 scroll-smooth">
            {images.map((url, i) => (
              <button key={i} type="button" onClick={() => setSelected(i)} className="relative flex-shrink-0 flex flex-col items-center gap-1 group focus:outline-none">
                <div className={`relative h-16 w-24 overflow-hidden rounded-xl border-2 transition-all ${selected === i ? "border-[#FF6B4A] shadow-md" : "border-transparent hover:border-slate-300"}`}>
                  <img src={url.startsWith("data:") || url.startsWith("http") ? url : ""} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onRemove(i); }}
                    className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={8} />
                  </button>
                  {selected === i && <div className="absolute inset-0 rounded-xl ring-2 ring-[#FF6B4A] ring-inset pointer-events-none" />}
                </div>
                <span className={`text-[9px] font-medium leading-none truncate w-24 text-center ${selected === i ? "text-[#FF6B4A]" : "text-slate-400"}`}>
                  {ROOM_LABELS[i] ?? `#${i + 1}`}
                </span>
              </button>
            ))}
            <button type="button" onClick={onAdd} className="flex-shrink-0 flex flex-col items-center gap-1">
              <div className="flex h-16 w-24 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 hover:border-[#FF6B4A]/40 hover:bg-orange-50/30 transition-colors">
                {uploading ? <Loader2 size={16} className="animate-spin text-[#FF6B4A]" /> : <Plus size={16} className="text-slate-300" />}
              </div>
              <span className="text-[9px] text-slate-300 leading-none">Tilføj</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => scrollStrip("right")}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {current && (
        <div className="relative">
          <div className="aspect-video w-full overflow-hidden bg-slate-100">
            <img src={current.startsWith("data:") || current.startsWith("http") ? current : ""} alt={label} className="h-full w-full object-cover" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-5 py-4">
            <p className="text-base font-bold text-white">{label}</p>
            <p className="text-xs text-white/70">{selected + 1} / {images.length}</p>
          </div>
          <button type="button" onClick={() => setSelected((s) => Math.max(0, s - 1))} disabled={selected === 0} className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow hover:bg-white disabled:opacity-30">
            <ChevronLeft size={16} />
          </button>
          <button type="button" onClick={() => setSelected((s) => Math.min(images.length - 1, s + 1))} disabled={selected === images.length - 1} className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow hover:bg-white disabled:opacity-30">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export function NewVideoForm() {
  const searchParams = useSearchParams();
  const [title, setTitle] = useState("");
  // Seeded once from ?booking_url= — as an effect this re-applied the param on
  // every searchParams change and overwrote whatever the user had typed.
  const [bookingUrl, setBookingUrl] = useState(() => searchParams.get("booking_url") ?? "");
  const [scraped, setScraped] = useState<ScrapedProperty | null>(null);
  // The listing URL the pipeline re-reads server-side to find the actual
  // property photographs — the preview above only shows what it found.
  const [sourceUrl, setSourceUrl] = useState("");

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [videoStyle, setVideoStyle] = useState<VideoStyleId>(DEFAULT_VIDEO_STYLE);
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");

  async function handleUrlImport() {
    if (!importUrl.trim()) return;
    setImporting(true);
    setImportError("");
    const result = await scrapePropertyUrl(importUrl.trim());
    setImporting(false);
    if (result.error) { setImportError(result.error); return; }
    if (result.data) {
      setScraped(result.data);
      setSourceUrl(importUrl.trim());
      if (result.data.title && !title) setTitle(result.data.title);
      if (!bookingUrl) setBookingUrl(importUrl.trim());
      if (result.data.imageUrls.length > 0) {
        setImageUrls(result.data.imageUrls.slice(0, 20));
      } else {
        setImportError("Ingen billeder fundet — upload billeder manuelt.");
      }
    }
  }

  function handleScreenshotImport(urls: string[], detectedTitle?: string) {
    if (detectedTitle && !title) setTitle(detectedTitle);
    setImageUrls((prev) => [...prev, ...urls.slice(0, 20 - prev.length)]);
  }

  function removeImage(i: number) {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const urls = await Promise.all(
      files.map(async (file) => {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload-image", { method: "POST", body: fd });
        if (res.ok) { const { url } = await res.json(); return url as string; }
        return await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })
    );
    setImageUrls((prev) => [...prev, ...urls]);
    setUploading(false);
    if (e.target) e.target.value = "";
  }

  const canSubmit = title.trim().length > 0;

  return (
    <>
      <Topbar title="Bestil præsentationsvideo" description="AI-genereret video af din bolig — klar på minutter." />

      {/* Banner */}
      <div className="border-b border-blue-100 bg-blue-50 px-4 py-2.5 md:px-8 md:py-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
          <span className="text-xs font-semibold text-slate-700">Når videoen er klar:</span>
          <span className="flex items-center gap-1.5 text-xs text-slate-600"><Download size={12} className="text-[#1B3F7A]" /> Download i appen</span>
          <span className="flex items-center gap-1.5 text-xs text-slate-600"><Share2 size={12} className="text-[#FF6B4A]" /> Del på Facebook</span>
          <span className="flex items-center gap-1.5 text-xs text-slate-600"><Users size={12} className="text-emerald-600" /> Facebook-grupper</span>
          <span className="flex items-center gap-1.5 text-xs text-slate-600"><Sparkles size={12} className="text-purple-500" /> Instagram, TikTok, YouTube</span>
        </div>
      </div>

      {/* Already have a video? */}
      <div className="border-b border-slate-100 bg-white px-4 py-2.5 md:px-8">
        <Link
          href="/videos/upload"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-[#FF6B4A] transition-colors"
        >
          <UploadCloud size={13} className="text-[#FF6B4A]" />
          Har du allerede lavet en video (fx i Veo3)? Upload den i stedet
          <ArrowRight size={12} />
        </Link>
      </div>

      {/* ── LAYOUT (same design on mobile and web) ── */}
      <div className="flex flex-1 px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-8">

            {/* Left sidebar */}
            <div className="space-y-6 md:col-span-2">
              <div className="rounded-2xl p-6 text-white" style={{ background: "linear-gradient(135deg, #1B3F7A 0%, #14306b 100%)" }}>
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-orange-400/30 bg-orange-400/10 px-2.5 py-1 text-xs font-semibold text-orange-300">
                  <Sparkles size={11} /> AI-drevet
                </div>
                <h2 className="text-xl font-bold leading-snug">
                  Gør din bolig<br />
                  <span style={{ background: "linear-gradient(90deg, #FFB36B, #FF6B4A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    uimodståelig
                  </span>
                </h2>
                <p className="mt-2 text-sm text-blue-200 leading-relaxed">
                  Vores AI omdanner dine billeder til en professionel præsentationsvideo med musik og flydende overgange.
                </p>
                <div className="mt-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-orange-400 text-orange-400" />
                  ))}
                  <span className="ml-1.5 text-xs text-blue-300">Brugt af hundredvis af udlejere</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Hvad du får</h3>
                <ul className="space-y-3">
                  {BENEFITS.map((b) => (
                    <li key={b} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                      <span className="text-sm text-slate-600">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <Clock size={20} className="shrink-0 text-[#FF6B4A]" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Leveres inden for 15 minutter</p>
                  <p className="text-xs text-slate-500">Du modtager besked i appen, så snart din video er klar.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Priser</p>
                <div className="space-y-2">
                  {[
                    { label: "Præsentationsvideo", price: "€50" },
                    { label: "Studie-adgang", price: "€10 / md" },
                    { label: "Pr. opslag", price: "5 kr." },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{row.label}</span>
                      <span className="font-semibold text-slate-900">{row.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right form */}
            <div className="md:col-span-3">
              <form action={createVideoOrderCheckout} className="space-y-5">
                {imageUrls.map((url, i) => <input key={i} type="hidden" name="image_urls[]" value={url} />)}
                {imageUrls.map((_, i) => <input key={`label-${i}`} type="hidden" name="room_labels[]" value={ROOM_LABELS[i] ?? `Billede ${i + 1}`} />)}

                {/* 1. Link */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-1 text-base font-bold text-slate-900">1. Indsæt link til annonce</h3>
                  <p className="mb-4 text-sm text-slate-500">Fx Airbnb, Booking.com, Novasol — henter billeder og oplysninger automatisk.</p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
                      <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="url"
                        value={importUrl}
                        onChange={(e) => { setImportUrl(e.target.value); setImportError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && handleUrlImport()}
                        placeholder="https://www.airbnb.dk/rooms/…"
                        className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleUrlImport}
                      disabled={importing || !importUrl.trim()}
                      className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg,#1B3F7A,#3B6DC9)" }}
                    >
                      {importing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      {importing ? "Henter…" : "Hent billeder"}
                    </button>
                  </div>
                  {importError && (
                    <p className="mt-3 flex items-start gap-2 text-sm text-red-600">
                      <AlertCircle size={14} className="mt-0.5 shrink-0" /> {importError}
                    </p>
                  )}
                  {scraped && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {scraped.location && <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800"><MapPin size={11} /> {scraped.location}</span>}
                      {scraped.price && <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800"><Tag size={11} /> {scraped.price}</span>}
                      {scraped.size && <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800"><Maximize2 size={11} /> {scraped.size}</span>}
                      {scraped.title && <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800"><CheckCircle2 size={11} /> {scraped.title.slice(0, 40)}{scraped.title.length > 40 ? "…" : ""}</span>}
                    </div>
                  )}
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <p className="mb-2 text-xs text-slate-500">Eller importer fra screenshot (Airbnb, alle sider)</p>
                    <ScreenshotImporter onImport={handleScreenshotImport} />
                  </div>
                </div>

                <input type="hidden" name="source_url" value={sourceUrl} />

                {/* 2. Style */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-1 text-base font-bold text-slate-900">2. Vælg videostil</h3>
                  <p className="mb-4 text-sm text-slate-500">
                    Stilen styrer stemning, kamera og tempo — boligen selv bliver altid vist præcis som på billederne.
                  </p>
                  <StyleSelector value={videoStyle} onChange={setVideoStyle} />
                </div>

                {/* 3. Info */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900">3. Oplysninger om din bolig</h3>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Titel <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="f.eks. Charmerende sommerhus ved havet"
                      required
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Booking-link <span className="text-xs font-normal text-slate-400">(valgfrit)</span>
                    </label>
                    <div className="relative">
                      <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="url"
                        name="booking_url"
                        value={bookingUrl}
                        onChange={(e) => setBookingUrl(e.target.value)}
                        placeholder="https://www.airbnb.com/rooms/..."
                        className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Images */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">4. Vælg billeder til video</h3>
                    <p className="mt-1 text-sm text-slate-500">Rækkefølgen bestemmer fotoruten i videoen.</p>
                  </div>
                  {imageUrls.length > 0 ? (
                    <PhotoTour images={imageUrls} onRemove={removeImage} onAdd={() => fileRef.current?.click()} uploading={uploading} />
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 py-12 text-sm text-slate-500 hover:border-[#FF6B4A]/40 hover:bg-orange-50/30 transition-colors disabled:opacity-50"
                    >
                      {uploading ? <Loader2 size={28} className="animate-spin text-[#FF6B4A]" /> : <Upload size={28} className="text-[#FF6B4A]" />}
                      <span>{uploading ? "Uploader billeder..." : "Klik for at tilføje billeder til din fotorute"}</span>
                    </button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
                </div>

                {/* 5. Submit */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900">5. Opret video</h3>
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
                  >
                    {canSubmit ? "Opret præsentationsvideo" : "Udfyld titel for at fortsætte"}
                  </button>
                  <p className="text-center text-xs text-slate-400">Video leveres inden for 15 minutter · 1 credit</p>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
