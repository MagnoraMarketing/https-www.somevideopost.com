"use client";

import { useState, useTransition } from "react";
import {
  Link2, ExternalLink, Images, FileText, Pencil, Loader2, Check, Download,
  Bot, CalendarCheck, MessageCircle, Sparkles,
} from "lucide-react";
import { loadListingDetails, savePropertyDetails } from "@/services/property-details";
import {
  COMMON_FEATURES, POOL_LABELS, detailsAreEmpty, emptyDetails,
  type PoolKind, type PropertyDetails,
} from "@/lib/property-details";

/**
 * The property behind a video, under the video itself: the listing link the
 * customer started from, the photographs the film is made of, and the
 * practical details a guest needs — taken from the listing and editable —
 * followed by the virtual viewer add-on that is on its way.
 */
export function PropertyPanel({
  orderId,
  sourceUrl,
  imageUrls,
  initialDetails,
}: {
  orderId: string;
  sourceUrl: string | null;
  imageUrls: string[];
  initialDetails: PropertyDetails | null;
}) {
  const photos = imageUrls.filter((url) => /^https?:\/\//i.test(url));

  return (
    <section className="mt-8 space-y-5">
      <ListingLink sourceUrl={sourceUrl} />
      <PhotoGrid photos={photos} />
      <DetailsCard orderId={orderId} hasSource={!!sourceUrl} initialDetails={initialDetails} />
      <VirtualViewerTeaser />
    </section>
  );
}

function CardTitle({ icon: Icon, children, aside }: { icon: typeof Link2; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-slate-500" />
        <h2 className="font-semibold text-slate-900">{children}</h2>
      </div>
      {aside}
    </div>
  );
}

function ListingLink({ sourceUrl }: { sourceUrl: string | null }) {
  let display = sourceUrl;
  try {
    if (sourceUrl) {
      const url = new URL(sourceUrl);
      display = `${url.host.replace(/^www\./, "")}${url.pathname}`;
    }
  } catch { /* shown as stored */ }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <CardTitle icon={Link2}>Link til annoncen</CardTitle>
      {sourceUrl ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-100"
        >
          <span className="min-w-0 truncate">{display}</span>
          <ExternalLink size={14} className="shrink-0 text-slate-400" />
        </a>
      ) : (
        <p className="text-sm text-slate-500">Videoen er lavet ud fra billeder, du har uploadet.</p>
      )}
    </div>
  );
}

function PhotoGrid({ photos }: { photos: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <CardTitle icon={Images}>Billeder {photos.length > 0 && <span className="font-normal text-slate-400">({photos.length})</span>}</CardTitle>
      {photos.length === 0 ? (
        <p className="text-sm text-slate-500">Billederne vises her, så snart de er hentet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {photos.map((url, i) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Billede ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/** "6 gæster · 3 soveværelser · …" — only the facts that are filled in. */
function factLine(d: PropertyDetails): string[] {
  const facts: string[] = [];
  if (d.propertyType) facts.push(d.propertyType);
  if (d.guests !== null) facts.push(`${d.guests} gæster`);
  if (d.bedrooms !== null) facts.push(`${d.bedrooms} ${d.bedrooms === 1 ? "soveværelse" : "soveværelser"}`);
  if (d.bathrooms !== null) facts.push(`${d.bathrooms} ${d.bathrooms === 1 ? "badeværelse" : "badeværelser"}`);
  if (d.livingAreaM2 !== null) facts.push(`${d.livingAreaM2} m²`);
  if (d.beachDistanceM !== null) facts.push(`${d.beachDistanceM} m til stranden`);
  if (d.pool) facts.push(POOL_LABELS[d.pool]);
  return facts;
}

function DetailsCard({
  orderId,
  hasSource,
  initialDetails,
}: {
  orderId: string;
  hasSource: boolean;
  initialDetails: PropertyDetails | null;
}) {
  const [details, setDetails] = useState<PropertyDetails | null>(
    initialDetails && !detailsAreEmpty(initialDetails) ? initialDetails : null,
  );
  const [draft, setDraft] = useState<PropertyDetails | null>(null);
  const [message, setMessage] = useState<{ kind: "error" | "info"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function edit(from: PropertyDetails | null) {
    setMessage(null);
    setDraft(from ?? emptyDetails());
  }

  function fetchFromListing() {
    setMessage(null);
    startTransition(async () => {
      const res = await loadListingDetails(orderId);
      if (res.error || !res.details) {
        setMessage({ kind: "error", text: res.error ?? "Der kom intet tilbage fra annoncen." });
        return;
      }
      // Shown in the form for review — nothing is saved until the customer does.
      setDraft(res.details);
      setMessage({ kind: "info", text: "Hentet fra annoncen. Tjek oplysningerne, ret det der ikke passer, og gem." });
    });
  }

  function save() {
    if (!draft) return;
    startTransition(async () => {
      const res = await savePropertyDetails(orderId, draft);
      if (res.error || !res.details) {
        setMessage({ kind: "error", text: res.error ?? "Oplysningerne kunne ikke gemmes." });
        return;
      }
      setDetails(res.details);
      setDraft(null);
      setMessage(null);
    });
  }

  const badge = details && (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
      details.source === "edited" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
    }`}>
      {details.source === "edited" ? "Gemt af dig" : "Fra annoncen — tjek og ret"}
    </span>
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <CardTitle icon={FileText} aside={!draft ? badge : undefined}>Tekst og info om boligen</CardTitle>

      {message && (
        <p className={`mb-3 rounded-lg px-3 py-2 text-xs ${
          message.kind === "error" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-800"
        }`}>{message.text}</p>
      )}

      {draft ? (
        <DetailsForm draft={draft} setDraft={setDraft} onSave={save} onCancel={() => { setDraft(null); setMessage(null); }} saving={isPending} />
      ) : details ? (
        <div className="space-y-4">
          {(details.title || details.location) && (
            <div>
              {details.title && <p className="font-semibold text-slate-900">{details.title}</p>}
              {details.location && <p className="text-sm text-slate-500">{details.location}</p>}
            </div>
          )}
          {factLine(details).length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {factLine(details).map((fact) => (
                <span key={fact} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">{fact}</span>
              ))}
            </div>
          )}
          {details.features.length > 0 && (
            <p className="text-sm text-slate-600"><span className="font-medium text-slate-800">Faciliteter:</span> {details.features.join(" · ")}</p>
          )}
          {details.description && (
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{details.description}</p>
          )}
          {details.practicalNotes && (
            <div className="rounded-lg bg-slate-50 px-3 py-2.5">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Praktisk info</p>
              <p className="whitespace-pre-line text-sm text-slate-700">{details.practicalNotes}</p>
            </div>
          )}
          <button
            type="button"
            onClick={() => edit(details)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            <Pencil size={12} /> Rediger
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">
            Samle de praktiske oplysninger om boligen her — antal gæster, værelser, pool, afstand til stranden og hvad gæsterne ellers skal vide.
          </p>
          <div className="flex flex-wrap gap-2">
            {hasSource && (
              <button
                type="button"
                onClick={fetchFromListing}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
              >
                {isPending ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                Hent fra annoncen
              </button>
            )}
            <button
              type="button"
              onClick={() => edit(null)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              <Pencil size={12} /> Udfyld selv
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}

const INPUT = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#FF6B4A] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/10";

function DetailsForm({
  draft,
  setDraft,
  onSave,
  onCancel,
  saving,
}: {
  draft: PropertyDetails;
  setDraft: (d: PropertyDetails) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const set = <K extends keyof PropertyDetails>(key: K, value: PropertyDetails[K]) => setDraft({ ...draft, [key]: value });
  const num = (value: string) => (value.trim() === "" ? null : Number(value.replace(",", ".")));
  const featureOptions = [...new Set([...COMMON_FEATURES, ...draft.features])];

  function toggleFeature(feature: string) {
    set("features", draft.features.includes(feature)
      ? draft.features.filter((f) => f !== feature)
      : [...draft.features, feature]);
  }

  const numberField = (key: "guests" | "bedrooms" | "bathrooms" | "livingAreaM2" | "beachDistanceM", label: string) => (
    <Field label={label}>
      <input
        type="number"
        inputMode="decimal"
        min={0}
        value={draft[key] ?? ""}
        onChange={(e) => set(key, num(e.target.value))}
        className={INPUT}
      />
    </Field>
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Titel">
          <input value={draft.title ?? ""} onChange={(e) => set("title", e.target.value || null)} className={INPUT} placeholder="F.eks. Villa med privat pool" />
        </Field>
        <Field label="Beliggenhed">
          <input value={draft.location ?? ""} onChange={(e) => set("location", e.target.value || null)} className={INPUT} placeholder="By, område" />
        </Field>
        <Field label="Boligtype">
          <input value={draft.propertyType ?? ""} onChange={(e) => set("propertyType", e.target.value || null)} className={INPUT} placeholder="Villa, lejlighed, rækkehus …" />
        </Field>
        <Field label="Pool">
          <select
            value={draft.pool ?? ""}
            onChange={(e) => set("pool", (e.target.value || null) as PoolKind | null)}
            className={INPUT}
          >
            <option value="">Ingen / ikke oplyst</option>
            <option value="private">{POOL_LABELS.private}</option>
            <option value="shared">{POOL_LABELS.shared}</option>
            <option value="yes">{POOL_LABELS.yes}</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {numberField("guests", "Gæster")}
        {numberField("bedrooms", "Soveværelser")}
        {numberField("bathrooms", "Badeværelser")}
        {numberField("livingAreaM2", "Boligareal (m²)")}
        {numberField("beachDistanceM", "Til stranden (m)")}
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-slate-600">Faciliteter</p>
        <div className="flex flex-wrap gap-1.5">
          {featureOptions.map((feature) => {
            const on = draft.features.includes(feature);
            return (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                  on ? "border-[#FF6B4A] bg-orange-50 text-[#FF6B4A]" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {on && <Check size={11} />} {feature}
              </button>
            );
          })}
        </div>
      </div>

      <Field label="Beskrivelse">
        <textarea value={draft.description ?? ""} onChange={(e) => set("description", e.target.value || null)} rows={5} className={`${INPUT} resize-y`} />
      </Field>
      <Field label="Praktisk info til gæsterne">
        <textarea
          value={draft.practicalNotes ?? ""}
          onChange={(e) => set("practicalNotes", e.target.value || null)}
          rows={3}
          className={`${INPUT} resize-y`}
          placeholder="Check-in/ud, nøgleudlevering, parkering, husregler …"
        />
      </Field>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Gem oplysninger
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
        >
          Annullér
        </button>
      </div>
    </div>
  );
}

function VirtualViewerTeaser() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#1B3F7A]/15 p-5" style={{ background: "linear-gradient(135deg, #EEF3FB 0%, #FFF4F1 100%)" }}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Sparkles size={16} className="text-[#FF6B4A]" />
        <h2 className="font-semibold text-slate-900">Tilkøb: Virtuel fremviser</h2>
        <span className="rounded-full bg-[#1B3F7A] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Kommer snart</span>
      </div>
      <p className="text-sm text-slate-600">
        En AI-fremviser til din bolig, der viser gæsterne rundt ud fra dine billeder og oplysningerne ovenfor.
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
        {[
          { icon: Bot, text: "Visuel rundvisning i boligen" },
          { icon: MessageCircle, text: "Svarer på gæsternes spørgsmål" },
          { icon: CalendarCheck, text: "Booker møder direkte i din kalender" },
        ].map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 text-xs font-medium text-slate-700">
            <Icon size={14} className="shrink-0 text-[#1B3F7A]" /> {text}
          </li>
        ))}
      </ul>
      <button
        type="button"
        disabled
        className="mt-4 inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg bg-white/80 px-4 py-2 text-sm font-semibold text-slate-400"
      >
        Kommer snart
      </button>
    </div>
  );
}
