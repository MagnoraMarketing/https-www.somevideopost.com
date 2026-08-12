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
const PAGE_URL = `${BASE}/da/ai-video-for-apartment`;
const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

export const metadata: Metadata = {
  title: "AI Video til Lejligheder & Interiør | somevideopost.com",
  description:
    "AI video til lejligheder forvandler billeder eller et annoncelink til en interiørfokuseret præsentationsvideo — bygget til lejlighedsudlejning, ejendomsadministratorer og korttidsudlejere.",
  keywords:
    "AI video lejlighed, lejlighedsvideo generator, AI interiørvideo lejlighed, annoncevideo lejlighed, markedsføringsvideo lejlighed, AI video lejlighedsudlejning, ejendomsadministration video AI",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      en: `${BASE}/ai-video-for-apartment`,
      da: PAGE_URL,
      es: `${BASE}/es/ai-video-for-apartment`,
      de: `${BASE}/de/ai-video-for-apartment`,
      "x-default": `${BASE}/ai-video-for-apartment`,
    },
  },
  openGraph: {
    title: "AI Video til Lejligheder & Interiør",
    description:
      "Forvandl lejlighedsbilleder eller et annoncelink til en interiørfokuseret præsentationsvideo på minutter — bygget til udlejning, ejendomsadministration og korttidsudlejning.",
    type: "website",
    siteName: "somevideopost.com",
    locale: "da_DK",
    url: PAGE_URL,
  },
};

const FAQ = [
  {
    q: "Hvad er AI video til lejligheder?",
    a: "AI video til lejligheder er en præsentationsvideo, der genereres automatisk fra lejlighedsbilleder eller et annoncelink, hvor tempo og kamerabevægelser er tilpasset interiøret — opholdsrum, køkken, soveværelser og badeværelse — frem for udendørsarealer. somevideopost.com bygger den ud fra det, du allerede har: billeder eller en annonce, ingen filmning nødvendig.",
  },
  {
    q: "Virker det til en enkelt lejlighed eller en hel ejendom?",
    a: "Begge dele. Generer én video til en enkelt lejlighedsannonce, eller kør det for hver ledig lejlighed i en ejendom — hver video genereres ud fra den specifikke lejligheds egne billeder, så ingen to ligner hinanden.",
  },
  {
    q: "Hvad hvis jeg kun har nogle få billeder?",
    a: "Det er fint — AI tilpasser videoens tempo og antal klip til, hvor mange billeder du leverer, uanset om det er 4 eller 40. Flere billeder giver typisk et mere fuldstændigt rum-for-rum-flow, men få billeder er nok til en brugbar video.",
  },
  {
    q: "Kan jeg bruge det til møblerede eller umøblerede lejligheder?",
    a: "Ja. AI'en arbejder med det, billederne viser — møbleret, styled eller tomt — og bygger kamerabevægelser og overgange omkring de faktiske billeder, du leverer, i stedet for en generisk skabelon.",
  },
  {
    q: "Er det nyttigt for ejendomsadministrationsselskaber med mange enheder?",
    a: "Ja — det er bygget netop til det. I stedet for at budgettere et videoshoot pr. ledig lejlighed kan du generere en video for hver enhed, efterhånden som den bliver ledig, og holde hver annonce opdateret uden en tilbagevendende produktionsomkostning.",
  },
  {
    q: "Kan jeg prøve det gratis, før jeg betaler for en lejlighedsvideo?",
    a: "Ja — du kan generere og forhåndsvise videoen, før du betaler noget. Se vores guide til, hvordan du genererer AI-video gratis, for de præcise trin.",
  },
  {
    q: "Hvor kan jeg bruge den færdige video?",
    a: "Publicer direkte til Facebook, Instagram, TikTok, LinkedIn og YouTube fra dashboardet, eller download den i 9:16, 1:1 eller 16:9 til din udlejningsside, boligportal eller e-mailmarkedsføring.",
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

export default function AiVideoForApartmentDaPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "somevideopost.com — AI Video til Lejligheder",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: PAGE_URL,
      description:
        "AI-værktøj der forvandler lejlighedsbilleder eller et annoncelink til en interiørfokuseret præsentationsvideo til udlejning, ejendomsadministratorer og korttidsudlejere.",
      featureList: [
        "AI-genereret video fra lejlighedsbilleder eller et annoncelink",
        "Interiørfokuserede kamerabevægelser og rum-for-rum-flow",
        "Virker til enkelte enheder eller hele ejendomme",
        "9:16, 1:1 og 16:9 eksport til sociale medier og annonceside",
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
        { "@type": "ListItem", position: 2, name: "AI Video til Lejligheder", item: PAGE_URL },
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
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100">
                <Building2 size={11} className="text-orange-300" /> AI Video til Lejligheder
              </div>
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                Lejlighedsbilleder ind,
                {" "}<span style={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>interiørvideo ud</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">
                AI video til lejligheder forvandler interiørbilleder eller et annoncelink til en
                præsentationsvideo, der flyder naturligt gennem opholdsrum, køkken, soveværelser og badeværelse
                — bygget til udlejning, ejendomsadministration og korttidsudlejning, klar på under 15 minutter.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
                  Skab en lejlighedsvideo <ArrowRight size={16} />
                </Link>
                <Link href="/da/generate-ai-video-free" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 px-7 py-3.5 text-sm font-medium text-white hover:bg-blue-500/10 transition-colors">
                  Prøv det gratis
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <VideoPreviewMockup icon={Sofa} roomLabel="Køkken" title="LEJLIGHED 4B · EKSEMPEL" generatingLabel="AI-video genereres" processingLabel="Behandler billeder … 75 %" />
            </div>
          </div>
        </div>
      </section>

      {/* ── What is AI video for apartments ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Hvad er AI video til lejligheder?</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            AI video til lejligheder er en præsentationsvideo, der bygges automatisk ud fra det, du allerede har
            — billeder af lejligheden eller et link til din annonce — hvor somevideopost.com tilføjer
            kamerabevægelser, overgange og musik tilpasset interiøret. I stedet for udendørs optagelser og
            droneoptagelser fokuserer tempoet på, hvordan en planløsning faktisk flyder: entré, stue, køkken,
            soveværelser og badeværelse.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Den er bygget specifikt til lejlighedsannoncer, fordi lejlighedsmarkedsføring lever og dør på, hvor
            godt en planløsning kommer til udtryk — og en langsom scroll gennem et billedkarrusel gør sjældent
            det samme som en kort walkthrough-video kan.
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
            <h2 className="text-3xl font-bold text-white md:text-4xl">Fra lejlighedsbilleder til video i tre trin</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Step n="Trin 1" icon={Link2} title="Tilføj billeder eller et annoncelink" desc="Upload interiørbilleder af lejligheden, eller indsæt et link til en eksisterende annonce, så AI kan hente dem automatisk." />
            <Step n="Trin 2" icon={Sofa} title="AI flyder gennem planløsningen" desc="Kamerabevægelser og overgange sekventeres rum for rum — opholdsrum, køkken, soveværelser, badeværelse — med musik tilføjet automatisk." />
            <Step n="Trin 3" icon={DoorOpen} title="Publicer eller download" desc="Del direkte til dine sociale kanaler, eller download i det format, du har brug for til din udlejningsside eller portal." />
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Bygget til lejlighedsudlejning & ejendomsadministration</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">Giv hver enhed en video, uden et produktionsbudget pr. annonce.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <BenefitCard icon={Timer} title="Udlej ledige enheder hurtigere" desc="Få en video live samme dag, en enhed bliver ledig, i stedet for at vente på en fotografs kalender." accent="bg-orange-500/15 text-orange-400" />
            <BenefitCard icon={Ruler} title="Viser planløsningen, ikke kun rummene" desc="Sekventeret rum-for-rum-flow giver lejere en fornemmelse af, hvordan rummene faktisk hænger sammen." accent="bg-blue-500/15 text-blue-400" />
            <BenefitCard icon={Building2} title="Skalerer på tværs af en hel ejendom" desc="Generer en video pr. enhed, efterhånden som ledige lejligheder opstår, uden en tilbagevendende produktionsomkostning pr. annonce." accent="bg-emerald-500/15 text-emerald-400" />
            <BenefitCard icon={Camera} title="Virker med de billeder, du har" desc="Møbleret, styled eller tomt — AI tilpasser sig, uanset hvilke billeder du uploader, intet professionelt shoot nødvendigt." accent="bg-violet-500/15 text-violet-400" />
            <BenefitCard icon={ShieldCheck} title="Du godkender, før den er offentlig" desc="Forhåndsvis videoen, før du publicerer eller downloader — intet postes uden din gennemgang." accent="bg-pink-500/15 text-pink-400" />
            <BenefitCard icon={Video} title="Klar til hver kanal" desc="Eksporter lodret video til Reels og TikTok, kvadratisk til feed, eller bredformat til din annonceside eller portal." accent="bg-yellow-500/15 text-yellow-400" />
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-bold text-white md:text-4xl">Anvendelser for lejligheder</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { title: "Langtidsudlejningsannoncer", desc: "Forvandl interiørbilleder til en video, der hjælper en annonce med at skille sig ud på udlejningsportaler og sociale medier." },
              { title: "Korttids- og ferieudlejning", desc: "Præsenter lejligheden, som gæster browser — en hurtig, visuel walkthrough frem for et billedgitter." },
              { title: "Nybyggeri & forudlejning", desc: "Markedsfør prøvelejligheder eller styled lejligheder med video, før en ejendom er fuldt udlejet." },
              { title: "Ejendomsadministrationsporteføljer", desc: "Standardiser, hvordan hver ledig enhed markedsføres, enhed for enhed, efterhånden som ledigheden ændrer sig." },
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

      <UseCaseLinks current="/ai-video-for-apartment" locale="da" />

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20 text-white" style={{ background: "linear-gradient(135deg, #040a1c 0%, #0a1f4d 100%)" }}>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Giv din næste ledige enhed en video</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">
            Upload billeder eller indsæt et annoncelink, og forhåndsvis din lejlighedsvideo gratis.
          </p>
          <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-[0_0_35px_rgba(255,107,74,0.4)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
            Kom i gang <ArrowRight size={18} />
          </Link>
          <p className="mt-4 text-sm text-slate-400">
            Se vores <Link href="/priser" className="text-blue-300 underline-offset-2 hover:underline">priser</Link>, læs
            {" "}<Link href="/hvorfor-somevideopost" className="text-blue-300 underline-offset-2 hover:underline">hvorfor udlejere vælger somevideopost.com</Link>, eller
            besøg <Link href="/blog" className="text-blue-300 underline-offset-2 hover:underline">bloggen</Link>.
          </p>
        </div>
      </section>

      <SiteFooter locale="da" />
    </div>
  );
}
