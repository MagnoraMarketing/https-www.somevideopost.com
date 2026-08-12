import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles, CreditCard, Video, Wand2, Share2, Home } from "lucide-react";
import { currencyForLocale, formatPriceKey, MONTHLY_POST_CREDITS } from "@/lib/currency";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { VideoPreviewMockup } from "@/components/seo/video-preview-mockup";

const BASE = "https://www.somevideopost.com";

export const metadata: Metadata = {
  title: "Preise — SOME VIDEO POST | KI-Video & Social Media für Gastgeber",
  description:
    "Einfache Preise für somevideopost.com: 10 €/Monat für Studio-Zugang mit KI-Beiträgen und direktem Teilen in sozialen Medien, und 50 € pro Präsentationsvideo — zahle nur für die Videos, die du nutzt. Keine Bindung.",
  keywords:
    "somevideopost Preise, KI-Video Preis, Social Media Vermietung Marketing, Ferienvermietung Marketing Preis, Präsentationsvideo Preis",
  alternates: {
    canonical: `${BASE}/de/priser`,
    languages: {
      da: `${BASE}/priser`,
      en: `${BASE}/en/priser`,
      es: `${BASE}/es/priser`,
      de: `${BASE}/de/priser`,
      "x-default": `${BASE}/priser`,
    },
  },
  openGraph: {
    title: "Preise — SOME VIDEO POST",
    description:
      "10 €/Monat für Studio-Zugang mit KI-Beiträgen und direktem Teilen, und 50 € pro Präsentationsvideo. Zahle nur für das, was du nutzt. Keine Bindung.",
    type: "website",
    siteName: "somevideopost.com",
    locale: "de_DE",
    url: `${BASE}/de/priser`,
  },
};

const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-slate-300">
      <Check size={14} className="mt-0.5 shrink-0 text-emerald-400" strokeWidth={2.5} />
      <span>{children}</span>
    </li>
  );
}

export default function PriserDePage() {
  const currency = currencyForLocale("de");
  const subscriptionPrice = formatPriceKey("subscription", currency);
  const videoPrice = formatPriceKey("video", currency);
  const postPrice = formatPriceKey("aiPost", currency, { decimals: true });

  return (
    <div className="min-h-screen text-slate-100" style={{ background: "#050d24" }}>
      <SiteHeader active="pricing" locale="de" />

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/5" style={{ background: "linear-gradient(135deg, #040a1c 0%, #071233 55%, #0a1f4d 100%)" }}>
        <div className="absolute left-0 top-0 h-64 w-64 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #4d8dff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 80px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-4xl px-6 py-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-200">
            <CreditCard size={13} /> Einfache, transparente Preise
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Zahle nur für das, was du nutzt
          </h1>
          <p className="mt-4 text-base text-slate-300 max-w-xl mx-auto">
            Studio-Zugang für {subscriptionPrice}/Monat gibt dir KI-Beiträge und direktes Teilen in sozialen Medien. Präsentationsvideos zahlst du pro Video — {videoPrice} — sodass du nur für die Videos zahlst, die du tatsächlich erstellst. Keine Bindung.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16 space-y-16">

        {/* Pricing cards */}
        <div className="grid items-start gap-6 md:grid-cols-2">

          {/* Studio access — subscription */}
          <div className="relative flex flex-col rounded-2xl border border-blue-400/50 bg-white/[0.05] p-8 shadow-[0_0_45px_rgba(59,130,246,0.25)] backdrop-blur-sm">
            <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-lg bg-blue-500/15 px-2.5 py-1 text-xs font-semibold text-blue-300">
              <Sparkles size={12} /> Studio-Zugang
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">{subscriptionPrice}</span>
              <span className="text-slate-400 text-sm">/Monat</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Monatliche Abrechnung · keine Bindung</p>
            <p className="mt-3 text-sm text-slate-300">
              Zugang zum gesamten Studio: erstelle KI-Beiträge und teile sie direkt in deinen sozialen Medien.
            </p>
            <ul className="my-6 flex flex-col gap-2.5">
              <CheckItem><strong className="text-white">{MONTHLY_POST_CREDITS} KI-Beiträge</strong> jeden Monat inklusive ({postPrice}/Beitrag)</CheckItem>
              <CheckItem>Beiträge direkt auf Facebook & Instagram teilen</CheckItem>
              <CheckItem>Alle Studio-Tools und Downloads in allen Formaten</CheckItem>
              <CheckItem>Präsentationsvideos erstellen (pro Video bezahlt)</CheckItem>
              <CheckItem>Blog, Guides und laufend neue Funktionen</CheckItem>
            </ul>
            <div className="mt-auto">
              <Link
                href="/signup"
                className="block w-full rounded-xl py-3 text-center text-sm font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #1e4f9a, #4d8dff)" }}
              >
                Loslegen
              </Link>
            </div>
          </div>

          {/* Presentation video — pay per use */}
          <div className="flex flex-col rounded-2xl border border-orange-500/25 bg-orange-500/[0.06] p-8 backdrop-blur-sm">
            <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-lg bg-orange-500/15 px-2.5 py-1 text-xs font-semibold text-orange-400">
              <Video size={12} /> Präsentationsvideo
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">{videoPrice}</span>
              <span className="text-slate-400 text-sm">/ Stk.</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Pay-as-you-go · kein Video-Abo</p>
            <p className="mt-3 text-sm text-slate-300">
              Ein kinematisches, KI-generiertes Präsentationsvideo deiner Immobilie — zahle nur, wenn du es nutzt.
            </p>
            <ul className="my-6 flex flex-col gap-2.5">
              <CheckItem><strong className="text-white">{videoPrice} pro Video</strong> — keine Bindung, keine versteckten Gebühren</CheckItem>
              <CheckItem>Inseratslink einfügen — die KI erstellt das Video für dich</CheckItem>
              <CheckItem>Kinematisches 9:16-Video, bereit für Reels & TikTok</CheckItem>
              <CheckItem>Vorschau ansehen, erst zahlen wenn du zufrieden bist</CheckItem>
              <CheckItem>Direkt herunterladen & teilen, sobald freigeschaltet</CheckItem>
            </ul>
            <div className="mt-auto">
              <Link
                href="/signup"
                className="block w-full rounded-xl py-3 text-center text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: ORANGE_GRADIENT }}
              >
                Erstelle dein erstes Video
              </Link>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-blue-400/20 bg-blue-500/[0.06] p-6 md:p-8 backdrop-blur-sm">
          <h2 className="text-lg font-bold text-white mb-6">So funktioniert es</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Sparkles, title: "1 · Studio-Zugang erhalten", desc: `Für ${subscriptionPrice}/Monat erhältst du Zugang zum Studio und ${MONTHLY_POST_CREDITS} KI-Beiträge jeden Monat.` },
              { icon: Wand2, title: "2 · Beiträge und Videos erstellen", desc: `Erstelle Beiträge, die in deinem Zugang enthalten sind, und erstelle Präsentationsvideos für ${videoPrice} pro Stück nach Bedarf.` },
              { icon: Share2, title: "3 · Direkt teilen", desc: "Teile Beiträge und Videos direkt auf Facebook und Instagram aus dem Dashboard." },
            ].map((step) => (
              <div key={step.title} className="flex flex-col gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15">
                  <step.icon size={20} className="text-blue-300" />
                </div>
                <p className="text-sm font-bold text-white">{step.title}</p>
                <p className="text-sm leading-relaxed text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-6">Häufig gestellte Fragen</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                q: "Was ist im Studio-Zugang enthalten?",
                a: `Studio-Zugang für ${subscriptionPrice}/Monat gibt dir ${MONTHLY_POST_CREDITS} KI-Beiträge im Monat, direktes Teilen in sozialen Medien und alle Tools des Studios. Präsentationsvideos werden separat pro Video abgerechnet.`,
              },
              {
                q: "Was kostet ein Präsentationsvideo?",
                a: `Ein Präsentationsvideo kostet ${videoPrice} pro Stück. Du zahlst nur für die Videos, die du erstellst — es gibt kein Video-Abo.`,
              },
              {
                q: "Wann zahle ich für ein Video?",
                a: "Du kannst eine Vorschau sehen, während das Video erstellt wird, und zahlst erst, wenn du das vollständige Video zum Herunterladen und Teilen freischalten möchtest. Hochgeladene Fotos kosten nichts.",
              },
              {
                q: "Kann ich direkt in sozialen Medien teilen?",
                a: "Ja. Mit Studio-Zugang teilst du Beiträge und Videos direkt auf Facebook und Instagram aus dem Dashboard.",
              },
              {
                q: "Was passiert, wenn meine monatlichen Beiträge aufgebraucht sind?",
                a: `Dein Zugang gibt dir ${MONTHLY_POST_CREDITS} KI-Beiträge im Monat. Das Guthaben wird automatisch jeden Monat aufgefüllt, solange dein Abo aktiv ist.`,
              },
              {
                q: "Gibt es eine Vertragsbindung?",
                a: "Nein. Der Studio-Zugang ist monatlich ohne Bindung, und du kannst jederzeit kündigen. Videos zahlst du nur, wenn du sie nutzt.",
              },
            ].map((item) => (
              <div key={item.q}>
                <p className="font-semibold text-white mb-1">{item.q}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live video demo */}
        <div
          className="overflow-hidden rounded-2xl border border-white/10 p-8 md:p-12 text-white"
          style={{ background: "linear-gradient(160deg, #040a1c 0%, #0a1f4d 50%, #040a1c 100%)" }}
        >
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="mb-3 inline-block rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-orange-400">Live-Demo</span>
              <h2 className="text-2xl font-bold mb-3">Sieh dir an, was ein Präsentationsvideo enthält</h2>
              <p className="text-sm leading-relaxed text-slate-300 mb-5 max-w-md">
                So sieht ein KI-generiertes Präsentationsvideo aus. Füge einen Link zu deinem Inserat ein — die KI lädt die Bilder herunter, baut die Foto-Route und liefert ein kinematisches 9:16-Video für Reels & TikTok.
              </p>
              <ul className="flex flex-col gap-2 text-sm text-slate-300">
                <CheckItem><span className="text-slate-300">Eine echte Vorschau deines generierten Videos</span></CheckItem>
                <CheckItem><span className="text-slate-300">Kamerabewegungen und Übergänge automatisch hinzugefügt</span></CheckItem>
                <CheckItem><span className="text-slate-300">Fertig in unter 15 Minuten</span></CheckItem>
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-[300px]">
                <div className="absolute inset-0 scale-90 rounded-[2.5rem] opacity-40 blur-2xl" style={{ background: ORANGE_GRADIENT }} />
                <div className="relative">
                  <VideoPreviewMockup icon={Home} roomLabel="Wohnzimmer" title="DEINE IMMOBILIE · DEMO" generatingLabel="KI-Video wird erstellt" processingLabel="Fotos werden verarbeitet … 75%" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          className="relative overflow-hidden rounded-2xl border border-white/10 p-8 text-white text-center"
          style={{ background: "linear-gradient(135deg, #040a1c 0%, #0a1f4d 100%)" }}
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.2)" }} />
          <div className="relative">
            <h2 className="text-2xl font-bold mb-2">Bereit loszulegen?</h2>
            <p className="text-slate-300 text-sm mb-6 max-w-md mx-auto">
              Starte noch heute mit somevideopost.com. Keine Bindung.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="rounded-xl px-6 py-3 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90"
                style={{ background: ORANGE_GRADIENT }}
              >
                Konto erstellen
              </Link>
              <a
                href="mailto:mail@somevideopost.com"
                className="rounded-xl border border-white/25 bg-white/5 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition"
              >
                Vertrieb kontaktieren
              </a>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter locale="de" />
    </div>
  );
}
