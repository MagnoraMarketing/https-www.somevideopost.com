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
const PAGE_URL = `${BASE}/da/some-ai-video`;
const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

export const metadata: Metadata = {
  title: "SoMe AI Video: Skab AI-genereret video til sociale medier | somevideopost.com",
  description:
    "SoMe AI video forvandler et link eller nogle få billeder til en fængende video til sociale medier — klar til Instagram Reels, TikTok, Facebook og LinkedIn på minutter. Se hvordan det virker, og prøv det gratis.",
  keywords:
    "SoMe AI video, AI video sociale medier, AI-genereret video Instagram, AI video TikTok, video generator sociale medier, somevideopost SoMe video",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      en: `${BASE}/some-ai-video`,
      da: PAGE_URL,
      es: `${BASE}/es/some-ai-video`,
      de: `${BASE}/de/some-ai-video`,
      "x-default": `${BASE}/some-ai-video`,
    },
  },
  openGraph: {
    title: "SoMe AI Video: Skab AI-genereret video til sociale medier",
    description:
      "Forvandl et link eller billeder til en fængende social video på minutter — tilpasset Instagram, TikTok, Facebook og LinkedIn med AI-kamerabevægelser, musik og tekst.",
    type: "website",
    siteName: "somevideopost.com",
    locale: "da_DK",
    url: PAGE_URL,
  },
};

const FAQ = [
  {
    q: "Hvad er SoMe AI video?",
    a: "\"SoMe\" (sociale medier) AI video er videoindhold, der genereres automatisk af kunstig intelligens til platforme som Instagram, TikTok, Facebook og LinkedIn. På somevideopost.com indsætter du et link eller uploader billeder, og AI tilføjer kamerabevægelser, overgange, musik og en tekst — og skaber en klar-til-deling video uden filmning eller redigering.",
  },
  {
    q: "Hvordan adskiller SoMe AI video sig fra en skabelonvideo?",
    a: "Skabelonværktøjer genbruger den samme statiske animation til hver upload. somevideopost.coms AI analyserer dine faktiske billeder eller annonce og bygger en unik sekvens — og vælger rækkefølge, bevægelse og tempo til netop den bolig eller det emne — og skriver derefter en tekst, der matcher, så ingen to videoer ligner kopier.",
  },
  {
    q: "Hvilke sociale platforme er den optimeret til?",
    a: "Hver video genereres med fokus på sociale medier og kan eksporteres i 9:16 til Instagram Reels, TikTok og YouTube Shorts, 1:1 til feed-opslag og 16:9 til YouTube og hjemmesider — så det samme kildemateriale får den rette form til hver kanal.",
  },
  {
    q: "Skal jeg kunne redigere video?",
    a: "Nej. Hele pointen med SoMe AI video er, at du ikke rører en tidslinje eller redigeringssoftware. Du leverer input — et link eller billeder — og AI klarer valg af klip, bevægelse, musik og tekst automatisk.",
  },
  {
    q: "Kan jeg generere en SoMe AI video gratis?",
    a: "Ja — du kan begynde at generere og forhåndsvise din video, før du betaler noget. Se vores guide til, hvordan du genererer AI-video gratis, for de præcise trin og hvad der er inkluderet uden beregning.",
  },
  {
    q: "Kan jeg publicere direkte til mine sociale kanaler?",
    a: "Ja. Forbind dine Facebook-, Instagram-, TikTok-, LinkedIn- og YouTube-konti én gang, og del eller planlæg derefter den færdige video direkte fra somevideopost.coms dashboard — eller download den og post den manuelt, hvor du vil.",
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

export default function SomeAiVideoDaPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "somevideopost.com — SoMe AI Video",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: PAGE_URL,
      description:
        "AI-værktøj der forvandler et link eller billeder til en video klar til sociale medier for Instagram, TikTok, Facebook og LinkedIn.",
      featureList: [
        "AI-genereret video fra et link eller uploadede billeder",
        "9:16, 1:1 og 16:9 eksport til hver platform",
        "Automatiske kamerabevægelser, overgange og musik",
        "AI-skrevne tekster per platform",
        "Direkte publicering til Facebook, Instagram, TikTok, LinkedIn og YouTube",
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
        { "@type": "ListItem", position: 2, name: "SoMe AI Video", item: PAGE_URL },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col text-slate-100" style={{ background: "#050d24" }}>
      <JsonLd data={jsonLd} />
      <SiteHeader locale="da" />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 md:py-28" style={{ background: "linear-gradient(135deg, #040a1c 0%, #071233 55%, #0a1f4d 100%)" }}>
        <div className="absolute left-0 top-0 h-64 w-64 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #4d8dff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="pointer-events-none absolute -right-48 -top-48 h-[600px] w-[600px] rounded-full border border-blue-400/25" style={{ boxShadow: "0 0 80px rgba(59,130,246,0.25), inset 0 0 80px rgba(59,130,246,0.1)" }} />
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100">
            <Share2 size={11} className="text-orange-300" /> SoMe AI Video
          </div>
          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
            SoMe AI Video: forvandl ethvert link eller billedsæt til
            <br className="hidden sm:block" />{" "}
            <span style={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>fængende social video</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
            SoMe AI video står for &ldquo;social media AI video&rdquo; — videoindhold som AI skaber for dig automatisk,
            klar til Instagram, TikTok, Facebook og LinkedIn. Indsæt et link eller upload billeder, og somevideopost.com
            bygger et cinematisk klip med bevægelse, musik og tekst på minutter. Ingen filmning, ingen redigering.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
              Generer din første AI-video <ArrowRight size={16} />
            </Link>
            <Link href="/da/generate-ai-video-free" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 px-7 py-3.5 text-sm font-medium text-white hover:bg-blue-500/10 transition-colors">
              Prøv det gratis
            </Link>
          </div>
        </div>
      </section>

      {/* ── What is SoMe AI video ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Hvad er SoMe AI video?</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            SoMe AI video er en video, der genereres automatisk af kunstig intelligens, bygget specifikt til feeds på
            sociale medier — i modsætning til en video, du selv filmer og redigerer. I stedet for at hyre en
            videofotograf eller lære et redigeringsprogram giver du somevideopost.com et udgangspunkt (et annoncelink
            eller et sæt billeder), og AI klarer det kreative arbejde: vælger rækkefølge af klip, tilføjer
            kamerabevægelser og overgange, lægger musik under og skriver en tekst tilpasset den platform, du poster til.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Det findes, fordi sociale medier belønner video frem for statiske billeder — Reels, TikTok og Shorts får
            konsekvent mere rækkevidde og seertid end billedopslag — men de fleste, der poster for en bolig, et brand
            eller en lille virksomhed, har hverken tid, budget eller kompetencer til at producere video regelmæssigt.
            SoMe AI video lukker det gab.
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
              <Wand2 size={12} /> Sådan virker det
            </span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">Fra link eller billeder til postet video</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Tre trin, ingen redigeringssoftware nødvendig.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Step n="Trin 1" icon={Link2} title="Indsæt link eller upload billeder" desc="Peg somevideopost.com på din annonce, produktside eller nogle få billeder. AI henter billeder og nøgledetaljer automatisk." />
            <Step n="Trin 2" icon={Sparkles} title="AI genererer videoen" desc="Kamerabevægelser, overgange, baggrundsmusik og en platformstilpasset tekst tilføjes automatisk — du kan forhåndsvise, før du låser den op." />
            <Step n="Trin 3" icon={Share2} title="Publicer eller download" desc="Del direkte til Facebook, Instagram, TikTok, LinkedIn og YouTube fra dashboardet, planlæg til senere, eller download i det format, du har brug for." />
          </div>
        </div>
      </section>

      {/* ── Formats per platform ── */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Bygget til hvert socialt format</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Én AI-video, eksporteret i den form hver platform faktisk vil have.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <BenefitCard icon={MonitorSmartphone} title="9:16 — Reels, TikTok & Shorts" desc="Fuldskærms lodret video tilpasset de platforme, der giver mest organisk rækkevidde i dag." accent="bg-pink-500/15 text-pink-400" />
            <BenefitCard icon={Music2} title="1:1 — Feed-opslag" desc="Kvadratisk beskæring optimeret til Instagram- og Facebook-feed, hvor det handler om at stoppe scrollet." accent="bg-violet-500/15 text-violet-400" />
            <BenefitCard icon={Globe} title="16:9 — YouTube & web" desc="Bredformat-eksport klar til YouTube, LinkedIn-videoopslag eller indlejring på din egen hjemmeside." accent="bg-blue-500/15 text-blue-400" />
          </div>
        </div>
      </section>

      {/* ── Why AI video wins on social ── */}
      <section className="py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Hvorfor AI-video vinder på sociale medier</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">Konsekvent posting slår lejlighedsvis perfektion — AI gør konsekvent muligt.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <BenefitCard icon={Clock} title="Minutter, ikke dage" desc="Ingen shoot at planlægge, ingen editor at briefe. Gå fra et link eller billeder til en færdig video i ét hug." accent="bg-orange-500/15 text-orange-400" />
            <BenefitCard icon={TrendingUp} title="Video slår billeder" desc="Reels, TikTok og Shorts overgår typisk statiske opslag — AI-video lader dig poste video hver gang, ikke kun ind imellem." accent="bg-emerald-500/15 text-emerald-400" />
            <BenefitCard icon={Share2} title="Ét aktiv, fem kanaler" desc="Den samme genererede video eksporteres og deles til Facebook, Instagram, TikTok, LinkedIn og YouTube fra ét dashboard." accent="bg-blue-500/15 text-blue-400" />
            <BenefitCard icon={Wand2} title="Ingen redigeringskompetencer nødvendige" desc="AI klarer tempo, overgange og musik, så alle i teamet kan publicere video, der ser professionel ud." accent="bg-violet-500/15 text-violet-400" />
            <BenefitCard icon={Video} title="Konsekvent output" desc="Hver video følger samme kvalitetsniveau, så din feed ser sammenhængende ud, selv når flere personer poster." accent="bg-pink-500/15 text-pink-400" />
            <BenefitCard icon={Megaphone} title="Tekst inkluderet" desc="AI skriver en tekst, der matcher videoen og platformen, så et opslag er klart — ikke halvfærdigt — i samme øjeblik videoen er." accent="bg-yellow-500/15 text-yellow-400" />
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-bold text-white md:text-4xl">Hvem bruger SoMe AI video?</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { title: "Ferieboligudlejere & lejlighedsudlejere", desc: "Forvandl en annonce fra en bookingplatform til en præsentationsvideo til Instagram og Facebook uden at røre et kamera." },
              { title: "Ejendomsmæglere", desc: "Giv hver ny bolig en cinematisk video den dag, den går live — se vores dedikerede guide til AI-video til boliger." },
              { title: "Små virksomheder & lokale butikker", desc: "Post produkt- eller butiksbilleder og få en klar-til-deling video til ugentligt socialt indhold." },
              { title: "Marketingfolk der styrer flere kanaler", desc: "Producer en bunke platformsklare videoer uden at briefe en ekstern editor til hver enkelt." },
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
            <h2 className="text-3xl font-bold text-white md:text-4xl">Ofte stillede spørgsmål</h2>
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

      <UseCaseLinks current="/some-ai-video" locale="da" />

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20 text-white" style={{ background: "linear-gradient(135deg, #040a1c 0%, #0a1f4d 100%)" }}>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Klar til at skabe din første SoMe AI video?</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">
            Indsæt et link eller upload billeder, og se din AI-video på minutter — forhåndsvis gratis, publicer når du er klar.
          </p>
          <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-[0_0_35px_rgba(255,107,74,0.4)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
            Kom i gang <ArrowRight size={18} />
          </Link>
          <p className="mt-4 text-sm text-slate-400">
            Nysgerrig på prisen? Se vores <Link href="/priser" className="text-blue-300 underline-offset-2 hover:underline">planer</Link>, læs
            {" "}<Link href="/hvorfor-somevideopost" className="text-blue-300 underline-offset-2 hover:underline">hvorfor udlejere vælger somevideopost.com</Link>, eller
            besøg <Link href="/blog" className="text-blue-300 underline-offset-2 hover:underline">bloggen</Link>.
          </p>
        </div>
      </section>

      <SiteFooter locale="da" />
    </div>
  );
}
