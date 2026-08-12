import type { Metadata } from "next";
import Link from "next/link";
import {
  Home, Sparkles, Video, Link2, Wand2, ArrowRight,
  Building, KeyRound, Camera, Megaphone, ShieldCheck, Rocket,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { UseCaseLinks } from "@/components/seo/use-case-links";
import { VideoPreviewMockup } from "@/components/seo/video-preview-mockup";

const BASE = "https://www.somevideopost.com";
const PAGE_URL = `${BASE}/de/ai-video-for-real-estate`;
const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

export const metadata: Metadata = {
  title: "KI-Video für Immobilien & Inserate | somevideopost.com",
  description:
    "KI-Video für Immobilien: verwandle einen Inseratslink oder Immobilienfotos in Minuten in ein kinematisches Präsentationsvideo. Für Makler, Agenturen und Hausverwaltungen, die Immobilien und Wohnungen vermarkten.",
  keywords:
    "KI-Video Immobilien, KI-Video Immobilienmakler, Immobilienvideo-Generator, KI-Immobilienvideo, Inseratsvideo KI, Immobilienmarketing Video, KI-Walkthrough-Video, Immobilienvideo Social Media, Präsentationsvideo Immobilie",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      en: `${BASE}/ai-video-for-real-estate`,
      da: `${BASE}/da/ai-video-for-real-estate`,
      es: `${BASE}/es/ai-video-for-real-estate`,
      de: PAGE_URL,
      "x-default": `${BASE}/ai-video-for-real-estate`,
    },
  },
  openGraph: {
    title: "KI-Video für Immobilien & Inserate",
    description:
      "Verwandle einen Inseratslink oder Immobilienfotos in Minuten in ein kinematisches Präsentationsvideo — für Makler, Agenturen und Hausverwaltungen.",
    type: "website",
    siteName: "somevideopost.com",
    locale: "de_DE",
    url: PAGE_URL,
  },
};

const FAQ = [
  {
    q: "Was ist KI-Video für Immobilien?",
    a: "KI-Video für Immobilien ist ein Präsentationsvideo, das automatisch aus einem Immobilieninserat oder Fotos erstellt wird, statt von einem Videoteam gefilmt zu werden. somevideopost.com liest deinen Inseratslink oder hochgeladene Fotos und baut ein kinematisches Video mit Kamerabewegungen, Raum-für-Raum-Ablauf, Übergängen und Musik — fertig in Minuten.",
  },
  {
    q: "Kann ich meine vorhandenen Inseratsfotos nutzen?",
    a: "Ja. Füge einen Link zu deinem Inserat auf einem Portal oder einer Buchungsseite ein, und somevideopost.com holt automatisch die vorhandenen Fotos, den Titel, den Preis und die wichtigsten Details — oder lade deine eigenen Immobilienfotos direkt hoch, falls das Inserat noch nicht online ist.",
  },
  {
    q: "Funktioniert es für jede Art von Immobilie?",
    a: "Ja — Wohnungen, Einfamilienhäuser, Ferienhäuser, Neubauten und Gewerbeinserate funktionieren alle gleich: Gib der KI einen Link oder Fotos, und sie passt Tempo und Reihenfolge an Anzahl und Art der verfügbaren Räume an.",
  },
  {
    q: "Wie lange dauert es, ein Video zu bekommen?",
    a: "Die meisten Präsentationsvideos sind in unter 15 Minuten fertig. Du kannst das Video im Dashboard entstehen sehen und es dir ansehen, bevor du entscheidest, ob du den finalen Download freischaltest.",
  },
  {
    q: "Kann ich das Video branden oder die Details meiner Agentur hinzufügen?",
    a: "Das Video wird um deinen Immobilieninhalt herum erstellt, und Bildtext und Beitragstext passen zu deinem Inserat, sodass es bereit ist, unter deiner eigenen Seite oder deinem Profil veröffentlicht zu werden — du behältst die volle Kontrolle darüber, wo und wie es geteilt wird.",
  },
  {
    q: "Gibt es eine kostenlose Möglichkeit, es vor dem Bezahlen zu testen?",
    a: "Ja — du kannst ein Video erstellen und ansehen, bevor du irgendetwas bezahlst. In unserem Guide zum kostenlosen KI-Video-Erstellen findest du die genauen Schritte.",
  },
  {
    q: "Kann ich das Video direkt in sozialen Medien teilen?",
    a: "Ja. Verbinde Facebook, Instagram, TikTok, LinkedIn und YouTube einmal, und veröffentliche oder plane dann das fertige Inseratsvideo direkt vom Dashboard aus — oder lade es in 9:16, 1:1 oder 16:9 für deine Website, dein Immobilienportal oder E-Mail-Kampagnen herunter.",
  },
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

export default function AiVideoForRealEstateDePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "somevideopost.com — KI-Video für Immobilien",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: PAGE_URL,
      description:
        "KI-Tool, das einen Immobilien-Inseratslink oder Immobilienfotos in ein kinematisches Präsentationsvideo für Makler, Agenturen und Hausverwaltungen verwandelt.",
      featureList: [
        "KI-generiertes Video aus einem Inseratslink oder Immobilienfotos",
        "Automatische Kamerabewegungen und Übergänge Raum für Raum",
        "Funktioniert für Wohnungen, Häuser, Ferienvermietungen und Neubauten",
        "9:16-, 1:1- und 16:9-Export für Social Media, Web und Portale",
        "Direkte Veröffentlichung auf Facebook, Instagram, TikTok, LinkedIn und YouTube",
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
        { "@type": "ListItem", position: 2, name: "KI-Video für Immobilien", item: PAGE_URL },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col text-slate-100" style={{ background: "#050d24" }}>
      <JsonLd data={jsonLd} />
      <SiteHeader locale="de" />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 md:py-28" style={{ background: "linear-gradient(135deg, #040a1c 0%, #071233 55%, #0a1f4d 100%)" }}>
        <div className="absolute left-0 top-0 h-64 w-64 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #4d8dff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="pointer-events-none absolute -right-48 -top-48 h-[600px] w-[600px] rounded-full border border-blue-400/25" style={{ boxShadow: "0 0 80px rgba(59,130,246,0.25), inset 0 0 80px rgba(59,130,246,0.1)" }} />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100">
                <Home size={11} className="text-orange-300" /> KI-Video für Immobilien
              </div>
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                Verwandle jedes Inserat in ein
                {" "}<span style={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>kinematisches KI-Video</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">
                KI-Video für Immobilien verwandelt einen Inseratslink oder ein Set von Immobilienfotos in ein
                professionelles Präsentationsvideo — mit Kamerabewegung, Raum-für-Raum-Ablauf und Musik — in
                unter 15 Minuten. Kein Videograf, keine Schnittsoftware, kein tagelanges Warten auf ein Shooting.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
                  Erstelle ein Inseratsvideo <ArrowRight size={16} />
                </Link>
                <Link href="/de/generate-ai-video-free" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 px-7 py-3.5 text-sm font-medium text-white hover:bg-blue-500/10 transition-colors">
                  Kostenlos testen
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <VideoPreviewMockup icon={Home} roomLabel="Wohnzimmer" title="BEISPIELINSERAT · 3 ZI." generatingLabel="KI-Video wird erstellt" processingLabel="Fotos werden verarbeitet … 75 %" />
            </div>
          </div>
        </div>
      </section>

      {/* ── What is AI video for real estate ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Was ist KI-Video für Immobilien?</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            Es ist ein Immobilien-Präsentationsvideo, das automatisch von künstlicher Intelligenz statt einem
            Kamerateam erstellt wird. Du gibst somevideopost.com einen Inseratslink oder lädst Fotos der
            Immobilie hoch, und die KI baut ein Video, das sich in einer natürlichen Abfolge durch die Räume
            bewegt, kinematische Kamerabewegung, Übergänge und Hintergrundmusik hinzufügt und dann einen zum
            Inserat passenden Text erstellt.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Es ist wichtig, weil Inserate mit Video konsequent mehr Aufrufe und Interaktion erhalten als reine
            Fotoinserate — aber für jede Immobilie einen Videografen zu buchen, ist langsam und teuer. KI-Video
            gibt Maklern, Agenturen und Hausverwaltungen die Möglichkeit, jedem Inserat ein Video hinzuzufügen,
            nicht nur den Vorzeigeobjekten.
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
              <Wand2 size={12} /> So funktioniert es
            </span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">Vom Inserat zum Video in drei Schritten</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Step n="Schritt 1" icon={Link2} title="Inseratslink einfügen" desc="Die KI holt Fotos, Titel, Preis, Größe und Lage aus deinem bestehenden Inserat — oder lade deine eigenen Immobilienfotos hoch." />
            <Step n="Schritt 2" icon={Camera} title="KI erstellt den Rundgang" desc="Die Immobilie wird Raum für Raum mit Kamerabewegung, Übergängen und Musik sequenziert, angepasst an die Anzahl der bereitgestellten Fotos." />
            <Step n="Schritt 3" icon={Megaphone} title="Veröffentlichen oder herunterladen" desc="Teile direkt auf deinen sozialen Kanälen, binde es auf deiner Inseratsseite ein, oder lade es in 9:16, 1:1 oder 16:9 herunter, wo immer du die Immobilie vermarktest." />
          </div>
        </div>
      </section>

      {/* ── Benefits for agents ── */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Für Makler, Agenturen & Hausverwaltungen gemacht</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">Gib jedem Inserat Marketing in Videoqualität, nicht nur deinen Top-Objekten.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <BenefitCard icon={Rocket} title="Von Tag eins an mit Video inserieren" desc="Erstelle ein Video, sobald ein Inserat live geht, statt auf den Terminplan eines Videografen zu warten." accent="bg-orange-500/15 text-orange-400" />
            <BenefitCard icon={Building} title="Funktioniert für jeden Immobilientyp" desc="Wohnungen, Häuser, Neubauten und Ferienvermietungen — die KI passt sich an die Räume und Fotos an, die du ihr gibst." accent="bg-blue-500/15 text-blue-400" />
            <BenefitCard icon={KeyRound} title="Über dein gesamtes Portfolio skalieren" desc="Erstelle für jedes Inserat ein Video, nicht nur für die Vorzeigeobjekte, ohne dein Marketingbudget pro Immobilie zu erhöhen." accent="bg-emerald-500/15 text-emerald-400" />
            <BenefitCard icon={Video} title="Heb dich von reinen Fotoinseraten ab" desc="Videoinserate erhalten in überfüllten Feeds und Portalen mehr Aufmerksamkeit als ein statisches Fotokarussell." accent="bg-violet-500/15 text-violet-400" />
            <BenefitCard icon={ShieldCheck} title="Du kontrollierst die Details" desc="Du wählst, was gezeigt wird und wie es betitelt ist, bevor du veröffentlichst — nichts geht automatisch live." accent="bg-pink-500/15 text-pink-400" />
            <BenefitCard icon={Sparkles} title="Bereit für Social Media & Portale" desc="Exportiere Hochformat-Video für Reels und TikTok und Breitbild für deine Website oder dein Portal aus einem generierten Video." accent="bg-yellow-500/15 text-yellow-400" />
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-bold text-white md:text-4xl">Anwendungsfälle für Immobilien</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { title: "\"Neu inseriert\"-Ankündigungen", desc: "Poste ein kinematisches Video am selben Tag, an dem ein neues Inserat live geht, statt Tage oder Wochen später." },
              { title: "Teaser für Besichtigungstage", desc: "Erstelle ein kurzes Video, um einen bevorstehenden offenen Besichtigungstag in sozialen Medien zu bewerben." },
              { title: "Wohnungs- und Mietinserate", desc: "Fokus auf Interieur und Grundriss — sieh dir unseren Guide zu KI-Video für Wohnungen an." },
              { title: "Marketing für Ferienhäuser & Kurzzeitvermietung", desc: "Verwandle ein Inserat einer Buchungsseite in ein Präsentationsvideo ohne dediziertes Fotoshooting." },
            ].map((u) => (
              <div key={u.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <h3 className="font-semibold text-white">{u.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Häufig gestellte Fragen</h2>
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

      <UseCaseLinks current="/ai-video-for-real-estate" locale="de" />

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20 text-white" style={{ background: "linear-gradient(135deg, #040a1c 0%, #0a1f4d 100%)" }}>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Gib deinem nächsten Inserat ein KI-Video</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">
            Füge deinen Inseratslink ein und sieh dir das Video kostenlos an — veröffentliche oder lade herunter, wenn du zufrieden bist.
          </p>
          <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-[0_0_35px_rgba(255,107,74,0.4)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
            Loslegen <ArrowRight size={18} />
          </Link>
          <p className="mt-4 text-sm text-slate-400">
            Sieh dir unsere <Link href="/de/priser" className="text-blue-300 underline-offset-2 hover:underline">Preise</Link> an, lies
            {" "}<Link href="/de/hvorfor-somevideopost" className="text-blue-300 underline-offset-2 hover:underline">warum sich Gastgeber für somevideopost.com entscheiden</Link>, oder
            besuche den <Link href="/blog" className="text-blue-300 underline-offset-2 hover:underline">Blog</Link>.
          </p>
        </div>
      </section>

      <SiteFooter locale="de" />
    </div>
  );
}
