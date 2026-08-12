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
const PAGE_URL = `${BASE}/da/ai-video-for-real-estate`;
const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

export const metadata: Metadata = {
  title: "AI Video til Boliger & Boligannoncer | somevideopost.com",
  description:
    "AI video til boliger: forvandl et annoncelink eller boligbilleder til en cinematisk præsentationsvideo på minutter. Bygget til mæglere, bureauer og ejendomsadministratorer der markedsfører boliger og lejligheder.",
  keywords:
    "AI video bolig, AI video ejendom, ejendomsvideo generator, AI boligvideo, annoncevideo AI, boligmarkedsføring video, AI walkthrough video, boligvideo sociale medier, præsentationsvideo bolig",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      en: `${BASE}/ai-video-for-real-estate`,
      da: PAGE_URL,
      es: `${BASE}/es/ai-video-for-real-estate`,
      de: `${BASE}/de/ai-video-for-real-estate`,
      "x-default": `${BASE}/ai-video-for-real-estate`,
    },
  },
  openGraph: {
    title: "AI Video til Boliger & Boligannoncer",
    description:
      "Forvandl et annoncelink eller boligbilleder til en cinematisk præsentationsvideo på minutter — bygget til mæglere, bureauer og ejendomsadministratorer.",
    type: "website",
    siteName: "somevideopost.com",
    locale: "da_DK",
    url: PAGE_URL,
  },
};

const FAQ = [
  {
    q: "Hvad er AI video til boliger?",
    a: "AI video til boliger er en præsentationsvideo, der genereres automatisk fra en boligannonce eller billeder, i stedet for at blive filmet af en videofotograf. somevideopost.com læser dit annoncelink eller uploadede billeder og bygger en cinematisk video med kamerabevægelser, rum-for-rum-flow, overgange og musik — klar på minutter.",
  },
  {
    q: "Kan jeg bruge mine eksisterende annoncebilleder?",
    a: "Ja. Indsæt et link til din annonce på en portal eller bookingplatform, og somevideopost.com henter automatisk de eksisterende billeder, titel, pris og nøgledetaljer — eller upload dine egne boligbilleder direkte, hvis annoncen ikke er online endnu.",
  },
  {
    q: "Virker det til alle typer boliger?",
    a: "Ja — lejligheder, parcelhuse, ferieboliger, nybyggeri og erhvervsannoncer fungerer alle på samme måde: giv AI'en et link eller billeder, og den tilpasser tempo og rækkefølge til antallet og typen af rum, den har at arbejde med.",
  },
  {
    q: "Hvor lang tid tager det at få en video?",
    a: "De fleste præsentationsvideoer er klar på under 15 minutter. Du kan følge videoen blive bygget i dashboardet og forhåndsvise den, før du beslutter, om du vil låse den endelige download op.",
  },
  {
    q: "Kan jeg brande videoen eller tilføje mit bureaus detaljer?",
    a: "Videoen genereres ud fra dit boligindhold, og teksten skrives til at matche din annonce, så den er klar til at publicere under din egen side eller profil — du har fuld kontrol over, hvor og hvordan den deles.",
  },
  {
    q: "Er der en gratis måde at prøve det på, før jeg betaler for en boligvideo?",
    a: "Ja — du kan generere og forhåndsvise en video, før du betaler noget. Se vores guide til, hvordan du genererer AI-video gratis, for de præcise trin.",
  },
  {
    q: "Kan jeg dele videoen direkte på sociale medier?",
    a: "Ja. Forbind Facebook, Instagram, TikTok, LinkedIn og YouTube én gang, og publicer eller planlæg derefter den færdige boligvideo direkte fra dashboardet — eller download den i 9:16, 1:1 eller 16:9 til din hjemmeside, boligportal eller e-mailkampagner.",
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

export default function AiVideoForRealEstateDaPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "somevideopost.com — AI Video til Boliger",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: PAGE_URL,
      description:
        "AI-værktøj der forvandler et boligannoncelink eller boligbilleder til en cinematisk præsentationsvideo til mæglere, bureauer og ejendomsadministratorer.",
      featureList: [
        "AI-genereret video fra et annoncelink eller boligbilleder",
        "Automatiske rum-for-rum-kamerabevægelser og overgange",
        "Virker til lejligheder, huse, ferieudlejning og nybyggeri",
        "9:16, 1:1 og 16:9 eksport til sociale medier, web og boligportaler",
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
        { "@type": "ListItem", position: 2, name: "AI Video til Boliger", item: PAGE_URL },
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
                <Home size={11} className="text-orange-300" /> AI Video til Boliger
              </div>
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                Forvandl hver annonce til en
                {" "}<span style={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>cinematisk AI-video</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">
                AI video til boliger forvandler et annoncelink eller et sæt boligbilleder til en professionel
                præsentationsvideo — med kamerabevægelser, rum-for-rum-flow og musik — på under 15 minutter.
                Ingen videofotograf, ingen redigeringssoftware, ingen ventedage på et shoot.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
                  Skab en boligvideo <ArrowRight size={16} />
                </Link>
                <Link href="/da/generate-ai-video-free" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 px-7 py-3.5 text-sm font-medium text-white hover:bg-blue-500/10 transition-colors">
                  Prøv det gratis
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <VideoPreviewMockup icon={Home} roomLabel="Stue" title="ANNONCEEKSEMPEL · 3 VÆR." generatingLabel="AI-video genereres" processingLabel="Behandler billeder … 75 %" />
            </div>
          </div>
        </div>
      </section>

      {/* ── What is AI video for real estate ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Hvad er AI video til boliger?</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            AI video til boliger er en boligpræsentationsvideo, der skabes automatisk af kunstig intelligens i
            stedet for et kamerahold. Du giver somevideopost.com et annoncelink eller uploader billeder af
            boligen, og AI bygger en video, der bevæger sig gennem rummene i en naturlig rækkefølge, tilføjer
            cinematiske kamerabevægelser, overgange og baggrundsmusik, og genererer derefter en tekst tilpasset annoncen.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Det betyder noget, fordi annoncer med video konsekvent får flere visninger og mere engagement end
            annoncer med kun billeder — men at booke en videofotograf til hver enkelt bolig er langsomt og dyrt.
            AI-video giver mæglere, bureauer og ejendomsadministratorer en måde at tilføje video til hver
            annonce på, ikke kun de dyreste.
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
            <h2 className="text-3xl font-bold text-white md:text-4xl">Fra annonce til video i tre trin</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Step n="Trin 1" icon={Link2} title="Indsæt dit annoncelink" desc="AI henter billeder, titel, pris, størrelse og beliggenhed fra din eksisterende annonce — eller upload dine egne boligbilleder." />
            <Step n="Trin 2" icon={Camera} title="AI bygger walkthroughen" desc="Boligen sekventeres rum for rum med kamerabevægelser, overgange og musik, tilpasset hvor mange billeder du leverer." />
            <Step n="Trin 3" icon={Megaphone} title="Publicer eller download" desc="Del direkte til dine sociale kanaler, indlejr på din annonceside, eller download i 9:16, 1:1 eller 16:9 til, hvor du markedsfører boligen." />
          </div>
        </div>
      </section>

      {/* ── Benefits for agents ── */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Bygget til mæglere, bureauer & ejendomsadministratorer</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">Giv hver annonce markedsføring i videokvalitet, ikke kun dine bedste boliger.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <BenefitCard icon={Rocket} title="Annoncer med video fra dag ét" desc="Generer en video, i det øjeblik en annonce går live, i stedet for at vente på en videofotografs kalender." accent="bg-orange-500/15 text-orange-400" />
            <BenefitCard icon={Building} title="Virker til alle boligtyper" desc="Lejligheder, huse, nybyggeri og ferieudlejning — AI'en tilpasser sig de rum og billeder, du giver den." accent="bg-blue-500/15 text-blue-400" />
            <BenefitCard icon={KeyRound} title="Skaler på tværs af hele porteføljen" desc="Producer en video til hver annonce, ikke kun de dyreste, uden at øge dit markedsføringsbudget pr. bolig." accent="bg-emerald-500/15 text-emerald-400" />
            <BenefitCard icon={Video} title="Skil dig ud fra rene billedannoncer" desc="Videoannoncer får mere opmærksomhed i overfyldte feeds og portaler end et statisk billedkarrusel." accent="bg-violet-500/15 text-violet-400" />
            <BenefitCard icon={ShieldCheck} title="Du styrer detaljerne" desc="Du vælger, hvad der vises, og hvordan det tekstes, før du publicerer — intet går automatisk live." accent="bg-pink-500/15 text-pink-400" />
            <BenefitCard icon={Sparkles} title="Klar til sociale medier & portaler" desc="Eksporter lodret video til Reels og TikTok, og bredformat til din hjemmeside eller boligportal, fra én genereret video." accent="bg-yellow-500/15 text-yellow-400" />
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-bold text-white md:text-4xl">Anvendelser for boliger</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { title: "\"Nyopslået\"-meddelelser", desc: "Post en cinematisk video samme dag, en ny annonce går live, i stedet for dage eller uger senere." },
              { title: "Teasere til åbent hus", desc: "Generer en kort video til at promovere et kommende åbent hus på sociale medier." },
              { title: "Lejligheds- og udlejningsannoncer", desc: "Fokuseret på interiør og planløsning — se vores dedikerede guide til AI-video til lejligheder." },
              { title: "Feriebolig- og korttidsudlejningsmarkedsføring", desc: "Forvandl en annonce fra en bookingplatform til en præsentationsvideo uden et dedikeret fotoshoot." },
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

      <UseCaseLinks current="/ai-video-for-real-estate" locale="da" />

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20 text-white" style={{ background: "linear-gradient(135deg, #040a1c 0%, #0a1f4d 100%)" }}>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Giv din næste annonce en AI-video</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">
            Indsæt dit annoncelink, og forhåndsvis videoen gratis — publicer eller download, når du er tilfreds.
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
