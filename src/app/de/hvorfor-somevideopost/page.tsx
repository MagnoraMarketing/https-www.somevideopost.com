import type { Metadata } from "next";
import Link from "next/link";
import {
  Link2, Sparkles, Video, Share2, Download, LayoutDashboard,
  CheckCircle2, ArrowRight, Clock, TrendingUp, Wand2, CalendarDays,
  Play, MonitorSmartphone, Rocket,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { WorkflowDemo } from "@/components/workflow-demo";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { UseCaseLinks } from "@/components/seo/use-case-links";
import { LANDING } from "@/lib/i18n";

const BASE = "https://www.somevideopost.com";
const PAGE_URL = `${BASE}/de/hvorfor-somevideopost`;
const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

export const metadata: Metadata = {
  title: "Warum somevideopost.com? KI-Video & automatisches Teilen in sozialen Medien",
  description:
    "somevideopost.com ist das Dashboard, mit dem Gastgeber vom Immobilienlink zum fertigen KI-Video und verkaufsstarken Beitrag in Minuten kommen — und automatisch auf Facebook, Instagram, TikTok und LinkedIn teilen oder in jedem Format herunterladen. Erfahre, warum sich Tausende für somevideopost.com entscheiden.",
  keywords:
    "warum somevideopost, somevideopost.com, KI-Video Ferienvermietung, automatisches Teilen soziale Medien, Video teilen Facebook Instagram TikTok, Immobilienvideo herunterladen, KI-Präsentationsvideo, Dashboard soziale Medien für Gastgeber, Immobilienlink zu Video, KI-Beitrag",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      da: `${BASE}/hvorfor-somevideopost`,
      en: `${BASE}/en/hvorfor-somevideopost`,
      es: `${BASE}/es/hvorfor-somevideopost`,
      de: PAGE_URL,
      "x-default": `${BASE}/hvorfor-somevideopost`,
    },
  },
  openGraph: {
    title: "Warum somevideopost.com? KI-Video & automatisches Teilen in sozialen Medien",
    description:
      "Vom Immobilienlink zum fertigen KI-Video und Beitrag in Minuten. Automatisch auf Facebook, Instagram, TikTok und LinkedIn teilen — oder in jedem Format herunterladen.",
    type: "website",
    siteName: "somevideopost.com",
    locale: "de_DE",
    url: PAGE_URL,
  },
};

const FAQ = [
  {
    q: "Was ist somevideopost.com?",
    a: "somevideopost.com ist eine KI-Plattform für Gastgeber von Ferienvermietungen, privaten Wohnungen und Hotels. Du fügst einen Link zu deinem Inserat ein oder lädst Fotos hoch, und die KI erstellt automatisch ein professionelles Präsentationsvideo und einen verkaufsstarken Beitrag — bereit zum Teilen in sozialen Medien oder zum Herunterladen.",
  },
  {
    q: "Wie schnell ist ein KI-Video fertig?",
    a: "Die meisten Präsentationsvideos sind in unter 15 Minuten fertig. Du fügst einfach einen Immobilienlink ein oder lädst deine Fotos hoch, wählst einen Stil, und die KI generiert ein Video mit Kamerabewegungen, Übergängen und Musik, während du den Fortschritt live im Dashboard verfolgst.",
  },
  {
    q: "Kann ich direkt auf Facebook, Instagram, TikTok und LinkedIn teilen?",
    a: "Ja. Vom Dashboard aus verbindest du deine Kanäle einmal und teilst dann Beiträge und Videos mit einem Klick auf Facebook, Instagram, TikTok, LinkedIn und YouTube — oder planst sie für den besten Zeitpunkt. Du kannst das Video auch jederzeit herunterladen und nutzen, wo du willst.",
  },
  {
    q: "Kann ich das Video herunterladen?",
    a: "Ja. Jedes Video kann in hoher Auflösung und den passenden Formaten heruntergeladen werden — 9:16 für Reels und TikTok, 1:1 für den Feed und 16:9 für YouTube und Webseiten — sodass du das Material vollständig besitzt.",
  },
  {
    q: "Muss ich Video bearbeiten können, um es zu nutzen?",
    a: "Nein. Der ganze Sinn von somevideopost.com ist, dass du kein technisches Wissen oder Videobearbeitung brauchst. Die KI übernimmt die schwere Arbeit, und das benutzerfreundliche Dashboard macht den Rest zu wenigen Klicks.",
  },
  {
    q: "Was kostet es?",
    a: "Studio-Zugang kostet 10 €/Monat und gibt dir 15 KI-Beiträge im Monat sowie direktes Teilen in sozialen Medien. Präsentationsvideos werden separat pro Video abgerechnet — 50 € pro Video — sodass du nur für die Videos zahlst, die du tatsächlich erstellst. Keine Bindung. Alle Details findest du auf der Preisseite.",
  },
];

const SOCIALS = [
  { name: "Facebook", color: "#1877F2", letter: "f" },
  { name: "Instagram", color: "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF)", letter: "IG" },
  { name: "TikTok", color: "#010101", letter: "TT" },
  { name: "LinkedIn", color: "#0A66C2", letter: "in" },
  { name: "YouTube", color: "#FF0000", letter: "YT" },
];

function Step({ n, icon: Icon, title, desc }: { n: string; icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="relative flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-[0_0_18px_rgba(59,130,246,0.35)]" style={{ background: "linear-gradient(135deg, #1e4f9a, #4d8dff)" }}>
        <Icon size={20} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-300">{n}</span>
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-slate-400">{desc}</p>
      </div>
    </div>
  );
}

function BenefitCard({ icon: Icon, title, desc, accent }: { icon: React.ElementType; title: string; desc: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-blue-400/40 hover:shadow-[0_0_35px_rgba(59,130,246,0.2)]">
      <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
        <Icon size={20} />
      </div>
      <h3 className="mb-2 font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-400">{desc}</p>
    </div>
  );
}

export default function WhySomeVideoPostDePage() {
  const t = LANDING.de;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "somevideopost.com",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: BASE,
      description:
        "KI-Plattform, die Präsentationsvideos und verkaufsstarke Beiträge für Gastgeber erstellt und automatisch in sozialen Medien teilt.",
      offers: [
        { "@type": "Offer", name: "Studio-Zugang", price: "10", priceCurrency: "EUR" },
        { "@type": "Offer", name: "Präsentationsvideo", price: "50", priceCurrency: "EUR" },
      ],
      featureList: [
        "KI-generierte Präsentationsvideos",
        "Automatisches Teilen auf Facebook, Instagram, TikTok, LinkedIn und YouTube",
        "Verkaufsstarke Beiträge, generiert aus einem Immobilienlink",
        "Download in 9:16, 1:1 und 16:9",
        "Benutzerfreundliches Dashboard für Planung und Teilen",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: BASE },
        { "@type": "ListItem", position: 2, name: "Warum somevideopost.com", item: PAGE_URL },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col text-slate-100" style={{ background: "#050d24" }}>
      <JsonLd data={jsonLd} />

      <SiteHeader active="why" locale="de" />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 md:py-28" style={{ background: "linear-gradient(135deg, #040a1c 0%, #071233 55%, #0a1f4d 100%)" }}>
        <div className="absolute left-0 top-0 h-64 w-64 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #4d8dff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="pointer-events-none absolute -right-48 -top-48 h-[600px] w-[600px] rounded-full border border-blue-400/25" style={{ boxShadow: "0 0 80px rgba(59,130,246,0.25), inset 0 0 80px rgba(59,130,246,0.1)" }} />
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-orange-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100">
                <Sparkles size={11} className="text-orange-300" /> Warum somevideopost.com?
              </div>
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                KI erstellt beeindruckende Videos<br />
                <span style={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>in wenigen Minuten</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">
                somevideopost.com ist ein benutzerfreundliches Dashboard, mit dem du vom Immobilienlink zum
                fertigen Präsentationsvideo und verkaufsstarken Beitrag kommst — und automatisch auf allen
                sozialen Medien teilst oder im benötigten Format herunterlädst. Keine Videobearbeitung, kein technisches Wissen.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
                  Jetzt starten <ArrowRight size={16} />
                </Link>
                <Link href="/de/priser" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 px-7 py-3.5 text-sm font-medium text-white hover:bg-blue-500/10 transition-colors">
                  Preise ansehen
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 border-t border-white/10 pt-6">
                {[
                  { icon: Clock, val: "< 15 Min.", label: "Video geliefert" },
                  { icon: TrendingUp, val: "bis zu 80 %", label: "Mehr Buchungen mit Video" },
                  { icon: Share2, val: "5 Kanäle", label: "Teilen mit einem Klick" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <s.icon size={15} className="text-orange-300" />
                    <div>
                      <p className="text-sm font-bold text-white">{s.val}</p>
                      <p className="text-[11px] text-slate-400">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative mx-auto w-full max-w-md">
                <div className="absolute -inset-6 rounded-[2rem] bg-blue-500/20 blur-3xl" />
                <div className="relative">
                  <WorkflowDemo t={t} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Step 1: Paste a property link or upload photos ── */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
              <Link2 size={12} /> So funktioniert es
            </span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">Immobilienlink einfügen oder Fotos hochladen</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Starte, wo du bist. Füge den Link zu deinem Inserat von Airbnb, Booking.com oder Novasol ein —
              oder lade deine eigenen Fotos hoch. Den Rest erledigt die KI, während du im Dashboard mitverfolgst.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Step n="Schritt 1" icon={Link2} title="Link einfügen oder hochladen" desc="Die KI holt automatisch Fotos, Titel, Preis, Größe und Lage aus deinem bestehenden Inserat — oder nutze deine eigenen Fotos." />
            <Step n="Schritt 2" icon={Wand2} title="KI erstellt Video & Beitrag" desc="Ein kinematisches Präsentationsvideo und ein verkaufsstarker Beitrag werden automatisch erstellt, angepasst an jede Plattform mit dem richtigen Ton und der richtigen Länge." />
            <Step n="Schritt 3" icon={Share2} title="Teilen oder herunterladen" desc="Teile mit einem Klick auf allen deinen Kanälen, plane für den besten Zeitpunkt — oder lade das Video in voller Auflösung herunter." />
          </div>
        </div>
      </section>

      {/* ── AI creates stunning videos ── */}
      <section className="relative overflow-hidden py-24" style={{ background: "linear-gradient(160deg, #040a1c 0%, #0a1f4d 50%, #040a1c 100%)" }}>
        <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full opacity-20 blur-[120px]" style={{ background: "radial-gradient(circle, #FF6B4A, transparent 70%)" }} />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-400">
                <Video size={12} /> KI-Videogenerierung
              </span>
              <h2 className="text-3xl font-bold text-white md:text-4xl">Professionelle Immobilienvideos — ohne Fotografen</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Die KI fügt deinen Fotos flüssige Kamerabewegungen, kinematische Übergänge und Hintergrundmusik
                hinzu und erstellt in Minuten ein beeindruckendes Präsentationsvideo. Du verfolgst den
                Fortschritt live im Dashboard — von &ldquo;KI generiert&rdquo; bis &ldquo;Fertig&rdquo;.
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {[
                  "Kinematische Kamerabewegungen und Übergänge automatisch",
                  "9:16 optimiert für Reels, TikTok und Shorts",
                  "Hintergrundmusik und Text passend zur Immobilie",
                  "Direkt in der App geliefert, bereit zum Teilen",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 rounded-[2rem] bg-orange-500/10 blur-3xl" />
              {/* Video generation panel mirroring the product dashboard */}
              <div className="relative rounded-2xl border border-blue-400/30 p-5" style={{ background: "#0a1430", boxShadow: "0 0 50px rgba(59,130,246,0.2)" }}>
                <div className="mb-4 flex items-center gap-2">
                  <Video size={16} className="text-orange-400" />
                  <span className="font-semibold text-white">Videogenerierung</span>
                </div>
                <div className="mb-4 grid grid-cols-3 gap-2">
                  {[
                    { icon: Link2, label: "Link einfügen", done: true },
                    { icon: Sparkles, label: "KI generiert", done: true, active: true },
                    { icon: CheckCircle2, label: "Fertig!", done: false },
                  ].map((s) => (
                    <div key={s.label} className="flex flex-col items-center gap-1.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ background: s.active ? ORANGE_GRADIENT : s.done ? "#2563eb" : "rgba(255,255,255,0.08)" }}>
                        <s.icon size={15} />
                      </div>
                      <span className="text-[10px] text-slate-400">{s.label}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-300">KI-Video wird erstellt</p>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full" style={{ width: "75%", background: "linear-gradient(90deg, #4d8dff, #22d3ee)" }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">Fotos werden verarbeitet … 75 %</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── User-friendly dashboard ── */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
            <LayoutDashboard size={12} /> Ein Dashboard für alles
          </span>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Ein benutzerfreundliches Dashboard, um alles an einem Ort zu teilen</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Erstellen, planen, teilen und herunterladen — ohne zwischen Apps zu wechseln. Das Dashboard bündelt
            deine Immobilien, Videos, Beiträge und Kanäle an einem Ort, sodass du den vollen Überblick hast und
            mit wenigen Klicks alles steuerst.
          </p>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <BenefitCard icon={MonitorSmartphone} title="Alles an einem Ort" desc="Immobilien, Videos, Beiträge und verbundene Kanäle in einem übersichtlichen Dashboard — auch mobil." accent="bg-blue-500/15 text-blue-400" />
            <BenefitCard icon={CalendarDays} title="Zum richtigen Zeitpunkt planen" desc="Plane Beiträge und Videos so, dass sie genau dann erscheinen, wenn deine Zielgruppe am aktivsten ist." accent="bg-emerald-500/15 text-emerald-400" />
            <BenefitCard icon={Rocket} title="Für Geschwindigkeit gebaut" desc="Vom Immobilienlink zu geteiltem Inhalt in Minuten. Keine Lernkurve — für vielbeschäftigte Gastgeber gemacht." accent="bg-orange-500/15 text-orange-400" />
          </div>
        </div>
      </section>

      {/* ── Automatic sharing to socials ── */}
      <section className="relative overflow-hidden py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300">
              <Share2 size={12} /> Automatisches Teilen
            </span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">Automatisch in allen sozialen Medien teilen</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Verbinde deine Kanäle einmal und teile dann Beiträge und Videos mit einem Klick auf allen
              Plattformen — oder lass es den Planer für dich erledigen.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SOCIALS.map((s) => (
              <div key={s.name} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 backdrop-blur-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: s.color }}>
                  {s.letter}
                </div>
                <span className="flex-1 text-sm font-medium text-white">{s.name}</span>
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Downloads ── */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
                <Download size={12} /> Download & Eigentum
              </span>
              <h2 className="text-3xl font-bold text-white md:text-4xl">In jedem Format herunterladen — der Inhalt gehört dir</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Willst du das Video in einer E-Mail, auf deiner Website oder in einer Anzeige nutzen? Lade es in
                hoher Auflösung genau im benötigten Format herunter. Du besitzt das Material vollständig und
                kannst es nutzen, wo du willst.
              </p>
              <Link href="/signup" className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg, #1e4f9a, #4d8dff)" }}>
                Loslegen <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { ratio: "9:16", use: "Reels & TikTok", box: "aspect-[9/16]" },
                { ratio: "1:1", use: "Feed", box: "aspect-square" },
                { ratio: "16:9", use: "YouTube & Web", box: "aspect-video" },
              ].map((f) => (
                <div key={f.ratio} className="flex flex-col items-center gap-2">
                  <div className={`w-full ${f.box} flex items-center justify-center rounded-xl border border-blue-400/30 bg-white/[0.04]`} style={{ boxShadow: "0 0 18px rgba(59,130,246,0.12)" }}>
                    <Play size={18} className="text-blue-300" fill="currentColor" />
                  </div>
                  <p className="text-sm font-bold text-white">{f.ratio}</p>
                  <p className="text-[11px] text-slate-400">{f.use}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why choose (benefits) ── */}
      <section className="py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Deshalb entscheiden sich Gastgeber für somevideopost.com</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">Alles, was du brauchst, um deine Immobilie professionell zu vermarkten — in einem Tool.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <BenefitCard icon={Clock} title="Spare jede Woche Stunden" desc="Automatisierung bedeutet, dass du von der Idee zu geteiltem Inhalt in Minuten statt Stunden kommst." accent="bg-orange-500/15 text-orange-400" />
            <BenefitCard icon={Video} title="Professionelle Qualität" desc="Kinematische Videos und scharfe Beiträge, die deine Immobilie hervorheben — ohne Agentur." accent="bg-emerald-500/15 text-emerald-400" />
            <BenefitCard icon={Share2} title="Überall präsent sein" desc="Eine Immobilie, alle Kanäle. Facebook, Instagram, TikTok, LinkedIn und YouTube auf einmal." accent="bg-blue-500/15 text-blue-400" />
            <BenefitCard icon={Wand2} title="KI, die Immobilien versteht" desc="Text und Video werden für die Vermietungsbranche optimiert — mit dem richtigen Ton für jede Plattform." accent="bg-violet-500/15 text-violet-400" />
            <BenefitCard icon={TrendingUp} title="Mehr Buchungen" desc="Inserate mit Video werden länger angesehen und konvertieren besser. Gib deinem Inserat das Format, das verkauft." accent="bg-pink-500/15 text-pink-400" />
            <BenefitCard icon={Download} title="Volles Eigentum" desc="Lade alles in hoher Auflösung herunter und nutze es, wo du willst — der Inhalt gehört dir." accent="bg-yellow-500/15 text-yellow-400" />
          </div>
        </div>
      </section>

      <UseCaseLinks
        heading="KI-Video für jeden Zweck"
        subheading="somevideopost.com erstellt KI-Video aus einem Link oder deinen Fotos — egal ob für soziale Medien, Immobilienverkauf oder Vermietung."
      />

      {/* ── FAQ ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Häufig gestellte Fragen</h2>
            <p className="mt-3 text-slate-400">Alles, was du über somevideopost.com wissen musst.</p>
          </div>
          <div className="flex flex-col gap-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold text-white marker:content-none">
                  {f.q}
                  <span className="shrink-0 text-blue-300 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20 text-white" style={{ background: "linear-gradient(135deg, #040a1c 0%, #0a1f4d 100%)" }}>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Bereit, deine Immobilie auf Autopilot zu vermarkten?</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">
            Vom Immobilienlink zu fertigem Video und Beitrag in Minuten. Studio-Zugang ab 10 €/Monat, Videos ab 50 € pro Stück.
          </p>
          <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-[0_0_35px_rgba(255,107,74,0.4)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
            Jetzt starten <ArrowRight size={18} />
          </Link>
          <p className="mt-4 text-sm text-slate-400">
            Mehr erfahren? Sieh dir unseren <Link href="/blog" className="text-blue-300 underline-offset-2 hover:underline">Blog & Guides</Link> an oder <Link href="/de/priser" className="text-blue-300 underline-offset-2 hover:underline">Preise</Link>.
          </p>
        </div>
      </section>

      <SiteFooter locale="de" />
    </div>
  );
}
