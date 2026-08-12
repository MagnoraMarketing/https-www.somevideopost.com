import type { Metadata } from "next";
import Link from "next/link";
import {
  Share2, Sparkles, Video, Link2, Wand2, ArrowRight,
  Clock, TrendingUp, MonitorSmartphone, Music2, Globe, Megaphone,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { UseCaseLinks } from "@/components/seo/use-case-links";

const BASE = "https://www.somevideopost.com";
const PAGE_URL = `${BASE}/de/some-ai-video`;
const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

export const metadata: Metadata = {
  title: "KI-Video für Social Media: KI-generiertes Video erstellen | somevideopost.com",
  description:
    "KI-Video für Social Media verwandelt einen Link oder ein paar Fotos in ein fesselndes Social-Media-Video — bereit für Instagram Reels, TikTok, Facebook und LinkedIn in Minuten. So funktioniert es, und du kannst es kostenlos testen.",
  keywords:
    "KI-Video Social Media, KI-Video für Instagram, KI-generiertes Video, KI-Video TikTok, Social-Media-Video-Generator, somevideopost KI-Video",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      en: `${BASE}/some-ai-video`,
      da: `${BASE}/da/some-ai-video`,
      es: `${BASE}/es/some-ai-video`,
      de: PAGE_URL,
      "x-default": `${BASE}/some-ai-video`,
    },
  },
  openGraph: {
    title: "KI-Video für Social Media: KI-generiertes Video erstellen",
    description:
      "Verwandle einen Link oder Fotos in Minuten in ein fesselndes Social-Video — passend für Instagram, TikTok, Facebook und LinkedIn, mit KI-Kamerabewegungen, Musik und Text.",
    type: "website",
    siteName: "somevideopost.com",
    locale: "de_DE",
    url: PAGE_URL,
  },
};

const FAQ = [
  {
    q: "Was ist KI-Video für Social Media?",
    a: "KI-Video für Social Media ist Videoinhalt, der automatisch von künstlicher Intelligenz für Plattformen wie Instagram, TikTok, Facebook und LinkedIn erstellt wird. Auf somevideopost.com fügst du einen Link ein oder lädst Fotos hoch, und die KI fügt Kamerabewegungen, Übergänge, Musik und einen Text hinzu — und erstellt so ein postfertiges Video ohne Filmen oder Schneiden.",
  },
  {
    q: "Wie unterscheidet es sich von einem Vorlagenvideo?",
    a: "Vorlagen-Tools nutzen für jeden Upload dieselbe statische Animation. Die KI von somevideopost.com analysiert deine tatsächlichen Fotos oder dein Inserat und baut eine einzigartige Sequenz — mit passender Reihenfolge, Bewegung und Tempo für genau diese Immobilie oder dieses Thema — und schreibt dann einen passenden Text, sodass kein Video wie kopiert aussieht.",
  },
  {
    q: "Für welche sozialen Plattformen ist es optimiert?",
    a: "Jedes Video wird mit Fokus auf soziale Medien erstellt und kann in 9:16 für Instagram Reels, TikTok und YouTube Shorts, 1:1 für Feed-Beiträge und 16:9 für YouTube und Webseiten exportiert werden — sodass dasselbe Ausgangsmaterial die richtige Form für jeden Kanal erhält.",
  },
  {
    q: "Muss ich Video bearbeiten können?",
    a: "Nein. Der ganze Sinn von KI-Video für Social Media ist, dass du keine Zeitleiste oder Schnittsoftware anfasst. Du lieferst den Input — einen Link oder Fotos — und die KI übernimmt Auswahl der Einstellungen, Bewegung, Musik und Text automatisch.",
  },
  {
    q: "Kann ich ein KI-Video für Social Media kostenlos erstellen?",
    a: "Ja — du kannst mit der Erstellung und Vorschau deines Videos beginnen, bevor du irgendetwas bezahlst. In unserem Guide zum kostenlosen KI-Video-Erstellen findest du die genauen Schritte und was kostenlos enthalten ist.",
  },
  {
    q: "Kann ich direkt auf meinen sozialen Kanälen veröffentlichen?",
    a: "Ja. Verbinde deine Facebook-, Instagram-, TikTok-, LinkedIn- und YouTube-Konten einmal und teile oder plane dann das fertige Video direkt vom somevideopost.com-Dashboard aus — oder lade es herunter und poste es manuell, wo du willst.",
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

export default function SomeAiVideoDePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "somevideopost.com — KI-Video für Social Media",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: PAGE_URL,
      description:
        "KI-Tool, das einen Link oder Fotos in ein Social-Media-fertiges Video für Instagram, TikTok, Facebook und LinkedIn verwandelt.",
      featureList: [
        "KI-generiertes Video aus einem Link oder hochgeladenen Fotos",
        "9:16-, 1:1- und 16:9-Export für jede Plattform",
        "Automatische Kamerabewegungen, Übergänge und Musik",
        "KI-geschriebene Texte pro Plattform",
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
        { "@type": "ListItem", position: 2, name: "KI-Video für Social Media", item: PAGE_URL },
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
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100">
            <Share2 size={11} className="text-orange-300" /> KI-Video für Social Media
          </div>
          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
            Verwandle jeden Link oder jedes Fotoset in ein
            <br className="hidden sm:block" />{" "}
            <span style={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>fesselndes Social-Video</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
            KI-Video für Social Media ist Videoinhalt, den die KI automatisch für dich erstellt, bereit für
            Instagram, TikTok, Facebook und LinkedIn. Füge einen Link ein oder lade Fotos hoch, und
            somevideopost.com baut in Minuten einen kinematischen Clip mit Bewegung, Musik und Text. Kein Filmen, kein Schneiden.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
              Erstelle dein erstes KI-Video <ArrowRight size={16} />
            </Link>
            <Link href="/de/generate-ai-video-free" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 px-7 py-3.5 text-sm font-medium text-white hover:bg-blue-500/10 transition-colors">
              Kostenlos testen
            </Link>
          </div>
        </div>
      </section>

      {/* ── What is SoMe AI video ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Was ist KI-Video für Social Media?</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            Es ist ein Video, das automatisch von künstlicher Intelligenz erstellt wird, speziell für
            Social-Media-Feeds — im Gegensatz zu einem Video, das du selbst filmst und schneidest. Statt einen
            Videografen zu engagieren oder eine Schnitt-App zu lernen, gibst du somevideopost.com einen
            Ausgangspunkt (einen Inseratslink oder ein Fotoset), und die KI übernimmt die kreative Arbeit: wählt
            die Reihenfolge der Einstellungen, fügt Kamerabewegungen und Übergänge hinzu, unterlegt Musik und
            schreibt einen Text, der zur Plattform passt, auf der du postest.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Es existiert, weil soziale Medien Video gegenüber statischen Bildern belohnen — Reels, TikTok und
            Shorts erreichen konsequent mehr Reichweite und Sehdauer als Fotobeiträge — aber die meisten, die für
            eine Immobilie, eine Marke oder ein kleines Unternehmen posten, haben weder Zeit, Budget noch
            Fähigkeiten, um regelmäßig Video zu produzieren. KI-Video schließt diese Lücke.
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
            <h2 className="text-3xl font-bold text-white md:text-4xl">Vom Link oder Fotos zum geposteten Video</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Drei Schritte, keine Schnittsoftware nötig.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Step n="Schritt 1" icon={Link2} title="Link einfügen oder Fotos hochladen" desc="Richte somevideopost.com auf dein Inserat, deine Produktseite oder ein paar Fotos. Die KI holt Bilder und wichtige Details automatisch." />
            <Step n="Schritt 2" icon={Sparkles} title="KI erstellt das Video" desc="Kamerabewegungen, Übergänge, Hintergrundmusik und ein plattformgerechter Text werden automatisch hinzugefügt — du kannst eine Vorschau ansehen, bevor du dich zum Freischalten entscheidest." />
            <Step n="Schritt 3" icon={Share2} title="Veröffentlichen oder herunterladen" desc="Teile direkt auf Facebook, Instagram, TikTok, LinkedIn und YouTube vom Dashboard aus, plane es für später, oder lade es im benötigten Format herunter." />
          </div>
        </div>
      </section>

      {/* ── Formats per platform ── */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Gebaut für jedes soziale Format</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Ein KI-Video, exportiert in der Form, die jede Plattform tatsächlich will.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <BenefitCard icon={MonitorSmartphone} title="9:16 — Reels, TikTok & Shorts" desc="Vollbild-Hochformatvideo, zugeschnitten auf die Plattformen mit der heute größten organischen Reichweite." accent="bg-pink-500/15 text-pink-400" />
            <BenefitCard icon={Music2} title="1:1 — Feed-Beiträge" desc="Quadratischer Zuschnitt, optimiert für Instagram- und Facebook-Feed-Platzierungen, wo es aufs Aufhalten des Scrollens ankommt." accent="bg-violet-500/15 text-violet-400" />
            <BenefitCard icon={Globe} title="16:9 — YouTube & Web" desc="Breitbild-Export, bereit für YouTube, LinkedIn-Videobeiträge oder zum Einbetten auf deiner eigenen Website." accent="bg-blue-500/15 text-blue-400" />
          </div>
        </div>
      </section>

      {/* ── Why AI video wins on social ── */}
      <section className="py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Warum KI-Video in sozialen Medien gewinnt</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">Konsequentes Posten schlägt gelegentliche Perfektion — KI macht konsequent möglich.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <BenefitCard icon={Clock} title="Minuten, nicht Tage" desc="Kein Shooting zu planen, kein Editor zu briefen. Vom Link oder Fotos zum fertigen Video in einem Rutsch." accent="bg-orange-500/15 text-orange-400" />
            <BenefitCard icon={TrendingUp} title="Video schlägt Fotos" desc="Reels, TikTok und Shorts übertreffen statische Beiträge regelmäßig — mit KI-Video postest du jedes Mal Video, nicht nur gelegentlich." accent="bg-emerald-500/15 text-emerald-400" />
            <BenefitCard icon={Share2} title="Ein Asset, fünf Kanäle" desc="Dasselbe generierte Video wird exportiert und von einem Dashboard aus auf Facebook, Instagram, TikTok, LinkedIn und YouTube geteilt." accent="bg-blue-500/15 text-blue-400" />
            <BenefitCard icon={Wand2} title="Keine Schnittkenntnisse nötig" desc="Die KI übernimmt Tempo, Übergänge und Musik, sodass jeder im Team professionell aussehendes Video veröffentlichen kann." accent="bg-violet-500/15 text-violet-400" />
            <BenefitCard icon={Video} title="Konsistentes Ergebnis" desc="Jedes Video folgt demselben Qualitätsniveau, sodass dein Feed einheitlich wirkt, auch wenn verschiedene Personen posten." accent="bg-pink-500/15 text-pink-400" />
            <BenefitCard icon={Megaphone} title="Text inklusive" desc="Die KI schreibt einen Text passend zu Video und Plattform, sodass ein Beitrag fertig ist — nicht halbfertig — sobald das Video es ist." accent="bg-yellow-500/15 text-yellow-400" />
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-bold text-white md:text-4xl">Wer nutzt KI-Video für Social Media?</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { title: "Ferienvermieter & Wohnungsvermieter", desc: "Verwandle ein Inserat einer Buchungsplattform in ein Präsentationsvideo für Instagram und Facebook, ohne eine Kamera anzufassen." },
              { title: "Immobilienmakler", desc: "Gib jedem neuen Inserat noch am selben Tag ein kinematisches Video — sieh dir unseren Guide zu KI-Video für Immobilien an." },
              { title: "Kleine Unternehmen & lokale Geschäfte", desc: "Poste Produkt- oder Ladenfotos und erhalte ein teilfertiges Video für wöchentlichen Social-Content." },
              { title: "Marketer mit mehreren Kanälen", desc: "Erstelle mehrere plattformfertige Videos, ohne für jedes einen externen Editor zu briefen." },
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

      <UseCaseLinks current="/some-ai-video" locale="de" />

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20 text-white" style={{ background: "linear-gradient(135deg, #040a1c 0%, #0a1f4d 100%)" }}>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Bereit für dein erstes KI-Video?</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">
            Füge einen Link ein oder lade Fotos hoch und sieh dein KI-Video in Minuten — kostenlose Vorschau, veröffentlichen wenn du bereit bist.
          </p>
          <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-[0_0_35px_rgba(255,107,74,0.4)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
            Loslegen <ArrowRight size={18} />
          </Link>
          <p className="mt-4 text-sm text-slate-400">
            Neugierig auf die Preise? Sieh dir unsere <Link href="/de/priser" className="text-blue-300 underline-offset-2 hover:underline">Pläne</Link> an, lies
            {" "}<Link href="/de/hvorfor-somevideopost" className="text-blue-300 underline-offset-2 hover:underline">warum sich Gastgeber für somevideopost.com entscheiden</Link>, oder
            besuche den <Link href="/blog" className="text-blue-300 underline-offset-2 hover:underline">Blog</Link>.
          </p>
        </div>
      </section>

      <SiteFooter locale="de" />
    </div>
  );
}
