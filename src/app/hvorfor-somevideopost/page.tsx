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

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.somevideopost.com";
const PAGE_URL = `${BASE}/hvorfor-somevideopost`;
const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

export const metadata: Metadata = {
  title: "Hvorfor somevideopost.com? AI-video & automatisk deling på sociale medier",
  description:
    "somevideopost.com er dashboardet, hvor udlejere går fra boliglink til færdig AI-video og sælgende opslag på minutter — og deler automatisk på Facebook, Instagram, TikTok og LinkedIn eller downloader i alle formater. Se hvorfor tusindvis vælger somevideopost.com.",
  keywords:
    "hvorfor somevideopost, somevideopost.com, AI video feriebolig, automatisk deling sociale medier, del video Facebook Instagram TikTok, download boligvideo, præsentationsvideo AI, dashboard sociale medier udlejning, boliglink til video, SOME opslag AI",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      da: PAGE_URL,
      en: `${BASE}/en/hvorfor-somevideopost`,
      es: `${BASE}/es/hvorfor-somevideopost`,
      de: `${BASE}/de/hvorfor-somevideopost`,
      "x-default": PAGE_URL,
    },
  },
  openGraph: {
    title: "Hvorfor somevideopost.com? AI-video & automatisk deling på sociale medier",
    description:
      "Fra boliglink til færdig AI-video og opslag på minutter. Del automatisk på Facebook, Instagram, TikTok og LinkedIn — eller download i alle formater. Ét brugervenligt dashboard.",
    type: "website",
    siteName: "somevideopost.com",
    url: PAGE_URL,
  },
};

const FAQ = [
  {
    q: "Hvad er somevideopost.com?",
    a: "somevideopost.com er en AI-platform til udlejere af ferieboliger, private lejligheder og hoteller. Du indsætter et link til din annonce eller uploader billeder, og AI skaber automatisk en professionel præsentationsvideo og et sælgende opslag — klar til at dele på sociale medier eller downloade.",
  },
  {
    q: "Hvor hurtigt er en AI-video klar?",
    a: "De fleste præsentationsvideoer er færdige på under 15 minutter. Du indsætter blot et boliglink eller uploader dine fotos, vælger stil, og AI genererer video med kamerabevægelser, overgange og musik, mens du følger fremdriften live i dashboardet.",
  },
  {
    q: "Kan jeg dele direkte på Facebook, Instagram, TikTok og LinkedIn?",
    a: "Ja. Fra dashboardet forbinder du dine kanaler én gang og deler derefter opslag og videoer til Facebook, Instagram, TikTok, LinkedIn og YouTube med ét klik — eller planlægger dem til det bedste tidspunkt. Du kan altid også downloade videoen og bruge den, hvor du vil.",
  },
  {
    q: "Kan jeg downloade videoen?",
    a: "Ja. Alle videoer kan downloades i høj opløsning og i de rette formater — 9:16 til Reels og TikTok, 1:1 til feed og 16:9 til YouTube og hjemmesider — så du ejer materialet fuldt ud.",
  },
  {
    q: "Skal jeg kunne redigere video for at bruge det?",
    a: "Nej. Hele pointen med somevideopost.com er, at du ikke behøver teknisk viden eller videoredigering. AI klarer det tunge arbejde, og det brugervenlige dashboard gør resten til få klik.",
  },
  {
    q: "Hvad koster det?",
    a: "Studie-adgang koster 75 kr./md. og giver dig 15 AI-opslag om måneden samt direkte deling til sociale medier. Præsentationsvideoer betales separat pr. styk — 99 kr. pr. video — så du kun betaler for de videoer, du faktisk laver. Ingen binding. Se alle detaljer på prissiden.",
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

export default function WhySomeVideoPostPage() {
  const t = LANDING.da;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "somevideopost.com",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: BASE,
      description:
        "AI-platform der laver præsentationsvideoer og sælgende opslag til udlejere og deler dem automatisk på sociale medier.",
      offers: [
        { "@type": "Offer", name: "Studie-adgang", price: "10", priceCurrency: "EUR" },
        { "@type": "Offer", name: "Præsentationsvideo", price: "50", priceCurrency: "EUR" },
      ],
      featureList: [
        "AI-genererede præsentationsvideoer",
        "Automatisk deling på Facebook, Instagram, TikTok, LinkedIn og YouTube",
        "Sælgende opslag genereret fra boliglink",
        "Download i 9:16, 1:1 og 16:9",
        "Brugervenligt dashboard til planlægning og deling",
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
        { "@type": "ListItem", position: 1, name: "Forside", item: BASE },
        { "@type": "ListItem", position: 2, name: "Hvorfor somevideopost.com", item: PAGE_URL },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col text-slate-100" style={{ background: "#050d24" }}>
      <JsonLd data={jsonLd} />

      {/* ── Nav ── */}
      <SiteHeader active="why" />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 md:py-28" style={{ background: "linear-gradient(135deg, #040a1c 0%, #071233 55%, #0a1f4d 100%)" }}>
        <div className="absolute left-0 top-0 h-64 w-64 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #4d8dff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="pointer-events-none absolute -right-48 -top-48 h-[600px] w-[600px] rounded-full border border-blue-400/25" style={{ boxShadow: "0 0 80px rgba(59,130,246,0.25), inset 0 0 80px rgba(59,130,246,0.1)" }} />
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-orange-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100">
                <Sparkles size={11} className="text-orange-300" /> Hvorfor somevideopost.com?
              </div>
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                AI skaber betagende videoer<br />
                <span style={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>på få minutter</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">
                somevideopost.com er ét brugervenligt dashboard, hvor du går fra boliglink til færdig
                præsentationsvideo og sælgende opslag — og deler automatisk på alle sociale medier eller
                downloader i det format, du har brug for. Ingen videoredigering, ingen teknisk viden.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
                  Kom i gang i dag <ArrowRight size={16} />
                </Link>
                <Link href="/priser" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 px-7 py-3.5 text-sm font-medium text-white hover:bg-blue-500/10 transition-colors">
                  Se priser
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 border-t border-white/10 pt-6">
                {[
                  { icon: Clock, val: "< 15 min", label: "Video leveret" },
                  { icon: TrendingUp, val: "op til 80 %", label: "Flere bookinger med video" },
                  { icon: Share2, val: "5 kanaler", label: "Del med ét klik" },
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
              <Link2 size={12} /> Sådan virker det
            </span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">Indsæt et boliglink eller upload billeder</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Start hvor du er. Indsæt linket til din annonce fra Airbnb, Booking.com eller Novasol — eller
              upload dine egne fotos. Resten klarer AI, mens du følger med i dashboardet.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Step n="Trin 1" icon={Link2} title="Indsæt link eller upload" desc="AI henter automatisk billeder, titel, pris, størrelse og beliggenhed fra din eksisterende annonce — eller brug dine egne fotos." />
            <Step n="Trin 2" icon={Wand2} title="AI genererer video & opslag" desc="En cinematisk præsentationsvideo og et sælgende opslag skabes automatisk, tilpasset hver platform i den rette tone og længde." />
            <Step n="Trin 3" icon={Share2} title="Del eller download" desc="Del med ét klik til alle dine kanaler, planlæg til det bedste tidspunkt — eller download videoen i fuld opløsning." />
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
                <Video size={12} /> AI-videogenerering
              </span>
              <h2 className="text-3xl font-bold text-white md:text-4xl">Professionelle boligvideoer — uden en fotograf</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                AI tilføjer flydende kamerabevægelser, cinematiske overgange og baggrundsmusik til dine
                billeder og skaber en betagende præsentationsvideo på minutter. Du følger fremdriften live i
                dashboardet — fra “AI genererer” til “Klar”.
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {[
                  "Cinematiske kamerabevægelser og overgange automatisk",
                  "9:16 optimeret til Reels, TikTok og Shorts",
                  "Baggrundsmusik og tekst tilpasset boligen",
                  "Leveret direkte i appen, klar til deling",
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
                  <span className="font-semibold text-white">Videogenerering</span>
                </div>
                <div className="mb-4 grid grid-cols-3 gap-2">
                  {[
                    { icon: Link2, label: "Indsæt link", done: true },
                    { icon: Sparkles, label: "AI genererer", done: true, active: true },
                    { icon: CheckCircle2, label: "Klar!", done: false },
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
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-300">AI-video oprettes</p>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full" style={{ width: "75%", background: "linear-gradient(90deg, #4d8dff, #22d3ee)" }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">Behandler billeder … 75 %</p>
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
            <LayoutDashboard size={12} /> Ét dashboard til det hele
          </span>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Et brugervenligt dashboard til at dele alt ét sted</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Opret, planlæg, del og download — uden at hoppe mellem apps. Dashboardet samler dine boliger,
            videoer, opslag og kanaler ét sted, så du har fuldt overblik og styrer alt med få klik.
          </p>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <BenefitCard icon={MonitorSmartphone} title="Alt samlet ét sted" desc="Boliger, videoer, opslag og forbundne kanaler i ét overskueligt dashboard — også på mobil." accent="bg-blue-500/15 text-blue-400" />
            <BenefitCard icon={CalendarDays} title="Planlæg til det rette tidspunkt" desc="Planlæg opslag og videoer, så de rammer det tidspunkt, hvor din målgruppe er mest aktiv." accent="bg-emerald-500/15 text-emerald-400" />
            <BenefitCard icon={Rocket} title="Bygget til fart" desc="Fra boliglink til delt indhold på minutter. Ingen læringskurve — designet til travle udlejere." accent="bg-orange-500/15 text-orange-400" />
          </div>
        </div>
      </section>

      {/* ── Automatic sharing to socials ── */}
      <section className="relative overflow-hidden py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300">
              <Share2 size={12} /> Automatisk deling
            </span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">Del automatisk på alle sociale medier</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Forbind dine kanaler én gang og del derefter opslag og videoer til alle platforme med ét klik —
              eller lad planlæggeren gøre det for dig.
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
                <Download size={12} /> Download & ejerskab
              </span>
              <h2 className="text-3xl font-bold text-white md:text-4xl">Download i alle formater — indholdet er dit</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                Vil du bruge videoen i en e-mail, på din hjemmeside eller i en annonce? Download den i høj
                opløsning i lige præcis det format, du har brug for. Du ejer materialet fuldt ud og kan bruge
                det, hvor du vil.
              </p>
              <Link href="/signup" className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg, #1e4f9a, #4d8dff)" }}>
                Kom i gang <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { ratio: "9:16", use: "Reels & TikTok", box: "aspect-[9/16]" },
                { ratio: "1:1", use: "Feed", box: "aspect-square" },
                { ratio: "16:9", use: "YouTube & web", box: "aspect-video" },
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
            <h2 className="text-3xl font-bold text-white md:text-4xl">Derfor vælger udlejere somevideopost.com</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">Alt du behøver for at markedsføre din bolig professionelt — samlet i ét værktøj.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <BenefitCard icon={Clock} title="Spar timer hver uge" desc="Automatisering betyder, at du går fra idé til delt indhold på minutter i stedet for timer." accent="bg-orange-500/15 text-orange-400" />
            <BenefitCard icon={Video} title="Professionel kvalitet" desc="Cinematiske videoer og skarpe opslag, der får din bolig til at skille sig ud — uden bureau." accent="bg-emerald-500/15 text-emerald-400" />
            <BenefitCard icon={Share2} title="Vær til stede overalt" desc="Én bolig, alle kanaler. Facebook, Instagram, TikTok, LinkedIn og YouTube på én gang." accent="bg-blue-500/15 text-blue-400" />
            <BenefitCard icon={Wand2} title="AI der forstår boliger" desc="Tekst og video optimeres til udlejningsbranchen — med den rette tone for hver platform." accent="bg-violet-500/15 text-violet-400" />
            <BenefitCard icon={TrendingUp} title="Flere bookinger" desc="Boliger med video ses længere og konverterer bedre. Giv din annonce det format, der sælger." accent="bg-pink-500/15 text-pink-400" />
            <BenefitCard icon={Download} title="Fuldt ejerskab" desc="Download alt i høj opløsning og brug det, hvor du vil — indholdet er dit." accent="bg-yellow-500/15 text-yellow-400" />
          </div>
        </div>
      </section>

      <UseCaseLinks locale="da" />

      {/* ── FAQ ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Ofte stillede spørgsmål</h2>
            <p className="mt-3 text-slate-400">Alt du behøver at vide om somevideopost.com.</p>
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
          <h2 className="text-3xl font-bold md:text-4xl">Klar til at markedsføre din bolig på autopilot?</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">
            Gå fra boliglink til færdig video og opslag på minutter. Studie-adgang fra 75 kr./md., videoer fra 99 kr. pr. stk.
          </p>
          <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-[0_0_35px_rgba(255,107,74,0.4)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
            Kom i gang i dag <ArrowRight size={18} />
          </Link>
          <p className="mt-4 text-sm text-slate-400">
            Vil du læse mere? Se vores <Link href="/blog" className="text-blue-300 underline-offset-2 hover:underline">blog & guides</Link> eller <Link href="/priser" className="text-blue-300 underline-offset-2 hover:underline">priser</Link>.
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
