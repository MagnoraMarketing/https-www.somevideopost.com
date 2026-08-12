import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2, Video, Link2, Wand2, ArrowRight,
  Sofa, DoorOpen, Ruler, Camera, ShieldCheck, Timer,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { UseCaseLinks } from "@/components/seo/use-case-links";
import { VideoPreviewMockup } from "@/components/seo/video-preview-mockup";

const BASE = "https://www.somevideopost.com";
const PAGE_URL = `${BASE}/de/ai-video-for-apartment`;
const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

export const metadata: Metadata = {
  title: "KI-Video für Wohnungen & Interieur | somevideopost.com",
  description:
    "KI-Video für Wohnungen verwandelt Fotos oder einen Inseratslink in ein interieur-fokussiertes Präsentationsvideo — für Wohnungsvermietungen, Hausverwaltungen und Kurzzeitvermieter.",
  keywords:
    "KI-Video Wohnung, Wohnungsvideo-Generator, KI-Interieurvideo Wohnung, Inseratsvideo Wohnung, Marketingvideo Wohnung, KI-Video Wohnungsvermietung, Hausverwaltung Video KI",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      en: `${BASE}/ai-video-for-apartment`,
      da: `${BASE}/da/ai-video-for-apartment`,
      es: `${BASE}/es/ai-video-for-apartment`,
      de: PAGE_URL,
      "x-default": `${BASE}/ai-video-for-apartment`,
    },
  },
  openGraph: {
    title: "KI-Video für Wohnungen & Interieur",
    description:
      "Verwandle Wohnungsfotos oder einen Inseratslink in Minuten in ein interieur-fokussiertes Präsentationsvideo — für Vermietung, Hausverwaltung und Kurzzeitvermietung.",
    type: "website",
    siteName: "somevideopost.com",
    locale: "de_DE",
    url: PAGE_URL,
  },
};

const FAQ = [
  {
    q: "Was ist KI-Video für Wohnungen?",
    a: "KI-Video für Wohnungen ist ein Präsentationsvideo, das automatisch aus Wohnungsfotos oder einem Inseratslink erstellt wird, wobei Tempo und Kamerabewegung auf Innenräume abgestimmt sind — Wohnbereiche, Küche, Schlafzimmer und Bad — statt auf Außenbereiche. somevideopost.com erstellt es aus dem, was du bereits hast: Fotos oder ein Inserat, kein Filmen nötig.",
  },
  {
    q: "Funktioniert es für eine einzelne Einheit oder ein ganzes Gebäude?",
    a: "Beides. Erstelle ein Video für ein einzelnes Wohnungsinserat, oder lass es für jede verfügbare Einheit in einem Gebäude laufen — jedes Video wird aus den eigenen Fotos dieser Einheit erstellt, sodass keine zwei gleich aussehen.",
  },
  {
    q: "Was, wenn ich nur wenige Fotos habe?",
    a: "Kein Problem — die KI passt Tempo und Anzahl der Einstellungen des Videos an die Anzahl der bereitgestellten Fotos an, egal ob 4 oder 40. Mehr Fotos ergeben in der Regel einen vollständigeren Raum-für-Raum-Ablauf, aber wenige reichen für ein brauchbares Video.",
  },
  {
    q: "Kann ich es für möblierte oder unmöblierte Einheiten nutzen?",
    a: "Ja. Die KI arbeitet mit dem, was die Fotos zeigen — möbliert, gestylt oder leer — und baut Kamerabewegung und Übergänge um die tatsächlichen von dir bereitgestellten Bilder, statt um eine generische Vorlage.",
  },
  {
    q: "Ist es nützlich für Hausverwaltungen mit vielen Einheiten?",
    a: "Ja — genau dafür ist es gemacht. Statt ein Video-Shooting pro Leerstand einzuplanen, kannst du für jede Einheit ein Video erstellen, sobald sie verfügbar wird, und so jedes Inserat aktuell halten, ohne wiederkehrende Produktionskosten.",
  },
  {
    q: "Kann ich es kostenlos testen, bevor ich für ein Wohnungsvideo bezahle?",
    a: "Ja — du kannst das Video erstellen und ansehen, bevor du irgendetwas bezahlst. In unserem Guide zum kostenlosen KI-Video-Erstellen findest du die genauen Schritte.",
  },
  {
    q: "Wo kann ich das fertige Video nutzen?",
    a: "Veröffentliche es direkt auf Facebook, Instagram, TikTok, LinkedIn und YouTube vom Dashboard aus, oder lade es in 9:16, 1:1 oder 16:9 für deine Vermietungsseite, dein Immobilienportal oder E-Mail-Marketing herunter.",
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

export default function AiVideoForApartmentDePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "somevideopost.com — KI-Video für Wohnungen",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: PAGE_URL,
      description:
        "KI-Tool, das Wohnungsfotos oder einen Inseratslink in ein interieur-fokussiertes Präsentationsvideo für Vermietung, Hausverwaltungen und Kurzzeitvermieter verwandelt.",
      featureList: [
        "KI-generiertes Video aus Wohnungsfotos oder einem Inseratslink",
        "Interieur-fokussierte Kamerabewegung und Raum-für-Raum-Ablauf",
        "Funktioniert für einzelne Einheiten oder ganze Gebäude",
        "9:16-, 1:1- und 16:9-Export für Social Media und Inseratsseiten",
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
        { "@type": "ListItem", position: 2, name: "KI-Video für Wohnungen", item: PAGE_URL },
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
                <Building2 size={11} className="text-orange-300" /> KI-Video für Wohnungen
              </div>
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                Wohnungsfotos rein,
                {" "}<span style={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Interieurvideo raus</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">
                KI-Video für Wohnungen verwandelt Innenaufnahmen oder einen Inseratslink in ein
                Präsentationsvideo, das sich natürlich durch Wohnbereich, Küche, Schlafzimmer und Bad bewegt —
                für Vermietung, Hausverwaltung und Kurzzeitvermietung, fertig in unter 15 Minuten.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
                  Erstelle ein Wohnungsvideo <ArrowRight size={16} />
                </Link>
                <Link href="/de/generate-ai-video-free" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 px-7 py-3.5 text-sm font-medium text-white hover:bg-blue-500/10 transition-colors">
                  Kostenlos testen
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <VideoPreviewMockup icon={Sofa} roomLabel="Küche" title="WOHNUNG 4B · BEISPIEL" generatingLabel="KI-Video wird erstellt" processingLabel="Fotos werden verarbeitet … 75 %" />
            </div>
          </div>
        </div>
      </section>

      {/* ── What is AI video for apartments ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Was ist KI-Video für Wohnungen?</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            Es ist ein Präsentationsvideo, das automatisch aus dem erstellt wird, was du bereits hast — Fotos
            der Einheit oder ein Link zu deinem Inserat — wobei somevideopost.com Kamerabewegung, Übergänge und
            Musik hinzufügt, die auf Innenräume abgestimmt sind. Statt Außenaufnahmen oder Drohnenaufnahmen
            konzentriert sich das Tempo darauf, wie ein Grundriss tatsächlich fließt: Eingang, Wohnzimmer,
            Küche, Schlafzimmer und Bad.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Es ist speziell für Wohnungsinserate gemacht, weil Wohnungsmarketing davon lebt, wie gut ein
            Grundriss vermittelt wird — und ein langsames Scrollen durch ein Fotokarussell schafft das selten so
            gut wie ein kurzes Rundgang-Video.
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
            <h2 className="text-3xl font-bold text-white md:text-4xl">Von Wohnungsfotos zum Video in drei Schritten</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Step n="Schritt 1" icon={Link2} title="Fotos oder einen Inseratslink hinzufügen" desc="Lade Innenaufnahmen der Einheit hoch, oder füge einen Link zu einem bestehenden Inserat ein, damit die KI sie automatisch holen kann." />
            <Step n="Schritt 2" icon={Sofa} title="KI führt durch den Grundriss" desc="Kamerabewegung und Übergänge werden Raum für Raum sequenziert — Wohnbereich, Küche, Schlafzimmer, Bad — mit automatisch hinzugefügter Musik." />
            <Step n="Schritt 3" icon={DoorOpen} title="Veröffentlichen oder herunterladen" desc="Teile direkt auf deinen sozialen Kanälen, oder lade es im benötigten Format für deine Vermietungsseite oder dein Portal herunter." />
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Für Wohnungsvermietung & Hausverwaltung gemacht</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">Gib jeder Einheit ein Video, ohne Produktionsbudget pro Inserat.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <BenefitCard icon={Timer} title="Leerstände schneller füllen" desc="Bring am selben Tag, an dem eine Einheit verfügbar wird, ein Video online, statt auf den Terminplan eines Fotografen zu warten." accent="bg-orange-500/15 text-orange-400" />
            <BenefitCard icon={Ruler} title="Zeigt den Grundriss, nicht nur Räume" desc="Der sequenzierte Raum-für-Raum-Ablauf gibt Mietern ein Gefühl dafür, wie der Raum tatsächlich zusammenhängt." accent="bg-blue-500/15 text-blue-400" />
            <BenefitCard icon={Building2} title="Skaliert über ein ganzes Gebäude" desc="Erstelle ein Video pro Einheit, sobald Leerstände entstehen, ohne wiederkehrende Produktionskosten pro Inserat." accent="bg-emerald-500/15 text-emerald-400" />
            <BenefitCard icon={Camera} title="Funktioniert mit den Fotos, die du hast" desc="Möbliert, gestylt oder leer — die KI passt sich an, egal welche Bilder du hochlädst, kein professionelles Shooting nötig." accent="bg-violet-500/15 text-violet-400" />
            <BenefitCard icon={ShieldCheck} title="Du genehmigst, bevor es öffentlich ist" desc="Sieh dir das Video vor Veröffentlichung oder Download an — nichts wird ohne deine Prüfung gepostet." accent="bg-pink-500/15 text-pink-400" />
            <BenefitCard icon={Video} title="Bereit für jeden Kanal" desc="Exportiere Hochformat-Video für Reels und TikTok, quadratisch für den Feed, oder Breitbild für deine Seite oder dein Portal." accent="bg-yellow-500/15 text-yellow-400" />
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-bold text-white md:text-4xl">Anwendungsfälle für Wohnungen</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { title: "Langzeitmietinserate", desc: "Verwandle Innenaufnahmen in ein Video, das einem Inserat hilft, sich auf Vermietungsportalen und sozialen Medien abzuheben." },
              { title: "Kurzzeit- & Ferienvermietung", desc: "Präsentiere die Wohnung so, wie Gäste browsen — ein schneller, visueller Rundgang statt eines Fotorasters." },
              { title: "Neubauten & Vorvermietung", desc: "Vermarkte Musterwohnungen oder gestylte Einheiten mit Video, bevor ein Gebäude voll belegt ist." },
              { title: "Hausverwaltungsportfolios", desc: "Standardisiere, wie jede leerstehende Einheit vermarktet wird, Einheit für Einheit, wenn sich die Verfügbarkeit ändert." },
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

      <UseCaseLinks current="/ai-video-for-apartment" locale="de" />

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20 text-white" style={{ background: "linear-gradient(135deg, #040a1c 0%, #0a1f4d 100%)" }}>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Gib deiner nächsten leeren Einheit ein Video</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">
            Lade Fotos hoch oder füge einen Inseratslink ein und sieh dir dein Wohnungsvideo kostenlos an.
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
