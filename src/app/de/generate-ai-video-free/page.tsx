import type { Metadata } from "next";
import Link from "next/link";
import {
  Gift, Sparkles, Link2, Wand2, Eye, ArrowRight,
  CheckCircle2, XCircle, Download, Share2,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { UseCaseLinks } from "@/components/seo/use-case-links";
import { currencyForLocale, formatPriceKey } from "@/lib/currency";

const BASE = "https://www.somevideopost.com";
const PAGE_URL = `${BASE}/de/generate-ai-video-free`;
const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

export const metadata: Metadata = {
  title: "Kostenloses KI-Video Erstellen: Dein Erstes Video Ohne Kosten | somevideopost.com",
  description:
    "Du kannst ein KI-Video auf somevideopost.com kostenlos erstellen und ansehen — keine Kreditkarte nötig, um zu starten. Sieh genau, was kostenlos ist, was ein vollständiges Video zum Freischalten kostet, und wie der gesamte Prozess funktioniert.",
  keywords:
    "kostenloses KI-Video erstellen, kostenloser KI-Video-Generator, KI-Video kostenlos, KI-Video ohne Kosten erstellen, kostenloser KI-Video-Maker, KI-Video-Generator kostenlose Testversion",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      en: `${BASE}/generate-ai-video-free`,
      da: `${BASE}/da/generate-ai-video-free`,
      es: `${BASE}/es/generate-ai-video-free`,
      de: PAGE_URL,
      "x-default": `${BASE}/generate-ai-video-free`,
    },
  },
  openGraph: {
    title: "Kostenloses KI-Video Erstellen: Dein Erstes Video Ohne Kosten",
    description:
      "Erstelle und teste ein KI-Video auf somevideopost.com kostenlos — keine Kreditkarte nötig, um zu starten.",
    type: "website",
    siteName: "somevideopost.com",
    locale: "de_DE",
    url: PAGE_URL,
  },
};

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

export default function GenerateAiVideoFreeDePage() {
  const currency = currencyForLocale("de");
  const videoPrice = formatPriceKey("video", currency);
  const subscriptionPrice = formatPriceKey("subscription", currency);

  const FAQ = [
    {
      q: "Kann ich wirklich ein KI-Video kostenlos erstellen?",
      a: `Ja. Auf somevideopost.com fügst du einen Inseratslink ein oder lädst Fotos hoch, und die KI erstellt und zeigt ein vollständiges Video kostenlos an — keine Kreditkarte nötig, um zu starten. Du zahlst nur (${videoPrice}), wenn du dich entscheidest, das Video zum Herunterladen und Teilen freizuschalten.`,
    },
    {
      q: "Was genau ist kostenlos, und was kostet Geld?",
      a: `Das Erstellen des Videos und das Ansehen der Vorschau beim Entstehen sind kostenlos. Das Freischalten des fertigen Videos — sodass du es herunterladen oder veröffentlichen kannst — kostet ${videoPrice} pro Video, nur einmal berechnet, wenn du dich zum Freischalten entscheidest. Für die Erstellung eines Videos ist kein Abo erforderlich.`,
    },
    {
      q: "Gibt es einen Haken, wie ein Wasserzeichen oder ein Zeitlimit?",
      a: `Die kostenlose Vorschau ist mit Wasserzeichen versehen und nicht herunterladbar, sodass klar ist, dass es eine Vorschau ist — aber es ist eine echte Vorschau deines tatsächlich generierten Videos, kein generisches Beispiel. Die Zahlung von ${videoPrice} entfernt das Wasserzeichen und schaltet das Video in voller Auflösung zum Herunterladen und Teilen frei, sodass du immer genau weißt, was du bekommst, bevor du dich zum Freischalten entscheidest.`,
    },
    {
      q: "Brauche ich eine Kreditkarte, um mit dem Erstellen zu beginnen?",
      a: "Nein. Du kannst ein Konto erstellen und deine erste Vorschau generieren, ohne Zahlungsdaten einzugeben. Eine Zahlung ist nur nötig, wenn du ein Video freischalten oder Studio-Zugang abonnieren möchtest.",
    },
    {
      q: "Was ist der Unterschied zwischen der kostenlosen Videovorschau und dem Studio-Zugang?",
      a: `Das Erstellen und Ansehen einer Vorschau ist kostenlos, danach zahlst du pro Video (${videoPrice} pro Stück). Studio-Zugang ist ein separates, optionales ${subscriptionPrice}/Monat-Abo, das KI-generierte Social-Media-Beiträge und direkte Veröffentlichung auf Facebook und Instagram freischaltet — du brauchst es nicht nur, um ein Video zu erstellen.`,
    },
    {
      q: "Kann ich mehr als eine kostenlose Vorschau erstellen?",
      a: "Ja — du kannst für jedes Inserat oder jeden Fotosatz, den du hinzufügst, eine neue Vorschau erstellen. Kostenlos ist das Erstellen und Ansehen; die Kosten pro Video gelten nur, wenn du ein bestimmtes Video zum Herunterladen oder Teilen freischaltest.",
    },
    {
      q: "Was kann ich mit dem Video tun, sobald es freigeschaltet ist?",
      a: "Lade es in 9:16, 1:1 oder 16:9 herunter, oder veröffentliche es direkt auf Facebook, Instagram, TikTok, LinkedIn und YouTube vom Dashboard aus — es gehört dir und du kannst es nutzen, wie du willst.",
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "So erstellst du ein KI-Video kostenlos",
      description: "Schritte zum Erstellen und Ansehen eines KI-generierten Videos auf somevideopost.com, ohne im Voraus zu bezahlen.",
      step: [
        { "@type": "HowToStep", name: "Erstelle ein kostenloses Konto", text: "Melde dich ohne Kreditkarte an." },
        { "@type": "HowToStep", name: "Link einfügen oder Fotos hochladen", text: "Richte somevideopost.com auf dein Inserat, oder lade deine eigenen Fotos hoch." },
        { "@type": "HowToStep", name: "Dein KI-Video kostenlos ansehen", text: "Sieh dem KI-generierten Video beim Entstehen zu und teste es kostenlos." },
        { "@type": "HowToStep", name: "Freischalten, herunterladen oder veröffentlichen", text: `Zahle nur, wenn du dich entscheidest, das finale Video (${videoPrice}) zum Herunterladen oder Veröffentlichen freizuschalten.` },
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
        { "@type": "ListItem", position: 2, name: "Kostenloses KI-Video Erstellen", item: PAGE_URL },
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
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100">
            <Gift size={11} className="text-orange-300" /> Kostenloses KI-Video Erstellen
          </div>
          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
            Ja — du kannst ein KI-Video
            {" "}<span style={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>kostenlos erstellen</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
            Mit somevideopost.com kannst du ein echtes KI-Video erstellen und ansehen, bevor du irgendetwas
            bezahlst. Keine Kreditkarte nötig, um zu starten. Du zahlst nur ({videoPrice}), wenn du dich
            entscheidest, das fertige Video zum Herunterladen oder Veröffentlichen freizuschalten.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
              Erstelle deine kostenlose Vorschau <ArrowRight size={16} />
            </Link>
            <Link href="/de/priser" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 px-7 py-3.5 text-sm font-medium text-white hover:bg-blue-500/10 transition-colors">
              Alle Preise ansehen
            </Link>
          </div>
        </div>
      </section>

      {/* ── What's free ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Was genau ist bei &ldquo;kostenlos&rdquo; enthalten?</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            Die meisten Tools, die ein &ldquo;kostenloses KI-Video&rdquo; versprechen, verlangen entweder eine
            Kreditkarte im Voraus, verstecken das Ergebnis hinter einer Bezahlschranke, bis du bezahlt hast,
            oder lassen dich nur eine minderwertige Vorschau erstellen, die nicht dem echten Ergebnis
            entspricht. somevideopost.com funktioniert anders: Du erstellst das echte Video und siehst es im
            Dashboard entstehen, völlig kostenlos — du entscheidest danach, ob du es freischaltest.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.06] p-6">
              <p className="mb-4 flex items-center gap-2 text-sm font-bold text-emerald-400"><CheckCircle2 size={16} /> Kostenlos, keine Kreditkarte nötig</p>
              <ul className="flex flex-col gap-2.5 text-sm text-slate-300">
                <li>Konto erstellen</li>
                <li>Link einfügen oder Fotos hochladen</li>
                <li>KI erstellt dein Video</li>
                <li>Vorschau mit Wasserzeichen beim Entstehen ansehen</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-orange-400/25 bg-orange-500/[0.06] p-6">
              <p className="mb-4 flex items-center gap-2 text-sm font-bold text-orange-400"><XCircle size={16} /> Kostenpflichtig, nur wenn du es willst</p>
              <ul className="flex flex-col gap-2.5 text-sm text-slate-300">
                <li>Das finale Video freischalten ({videoPrice} pro Video)</li>
                <li>In voller Auflösung herunterladen</li>
                <li>Auf deinen sozialen Kanälen veröffentlichen</li>
                <li>Optionaler Studio-Zugang für KI-Beiträge ({subscriptionPrice}/Monat)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
              <Wand2 size={12} /> So funktioniert es
            </span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">Erstelle dein kostenloses KI-Video in vier Schritten</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Step n="Schritt 1" icon={Sparkles} title="Erstelle ein kostenloses Konto" desc="Melde dich in Sekunden an — keine Kreditkarte nötig, um loszulegen." />
            <Step n="Schritt 2" icon={Link2} title="Link einfügen oder Fotos hochladen" desc="Richte somevideopost.com auf ein Inserat, eine Produktseite oder deine eigenen Fotos." />
            <Step n="Schritt 3" icon={Eye} title="Teste dein Video kostenlos" desc="Sieh zu, wie die KI dein echtes Video erstellt, und teste es — mit Wasserzeichen, kostenlos — direkt im Dashboard." />
            <Step n="Schritt 4" icon={Download} title="Freischalten, herunterladen oder veröffentlichen" desc={`Gefällt es dir? Schalte das Video für ${videoPrice} frei, um es herunterzuladen oder auf deinen sozialen Kanälen zu veröffentlichen.`} />
          </div>
        </div>
      </section>

      {/* ── Why it's structured this way ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Warum erst zahlen, nachdem du das Ergebnis siehst?</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            Die Erstellung von KI-Video kostet Rechenzeit, und die meisten Tools decken das, indem sie alles
            hinter ein Abo stellen, bevor du ein einziges Ergebnis gesehen hast. somevideopost.com dreht das um:
            Du siehst genau, was du bekommst — dein tatsächliches Video, kein generisches Beispiel — bevor du
            etwas ausgibst. Willst du es nicht behalten, schaltest du es einfach nicht frei.
          </p>
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-blue-400/20 bg-blue-500/[0.06] p-5">
            <Share2 size={18} className="mt-0.5 shrink-0 text-blue-300" />
            <p className="text-sm leading-relaxed text-slate-300">
              Einmal freigeschaltet, kann jedes Video direkt auf Facebook, Instagram, TikTok, LinkedIn und
              YouTube vom Dashboard aus geteilt oder in 9:16, 1:1 und 16:9 heruntergeladen werden, wo immer du es sonst brauchst.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24" style={{ background: "#071130" }}>
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

      <UseCaseLinks current="/generate-ai-video-free" locale="de" />

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20 text-white" style={{ background: "linear-gradient(135deg, #040a1c 0%, #0a1f4d 100%)" }}>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Probier es aus — es kostet nichts, dein Video zu sehen</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">
            Erstelle ein kostenloses Konto, füge einen Link ein oder lade Fotos hoch, und teste dein KI-Video noch heute.
          </p>
          <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-[0_0_35px_rgba(255,107,74,0.4)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
            Kostenlos starten <ArrowRight size={18} />
          </Link>
          <p className="mt-4 text-sm text-slate-400">
            Sieh dir alle <Link href="/de/priser" className="text-blue-300 underline-offset-2 hover:underline">Preisdetails</Link> an, lies
            {" "}<Link href="/de/hvorfor-somevideopost" className="text-blue-300 underline-offset-2 hover:underline">warum sich Gastgeber für somevideopost.com entscheiden</Link>, oder
            besuche den <Link href="/blog" className="text-blue-300 underline-offset-2 hover:underline">Blog</Link>.
          </p>
        </div>
      </section>

      <SiteFooter locale="de" />
    </div>
  );
}
