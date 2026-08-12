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
const PAGE_URL = `${BASE}/da/generate-ai-video-free`;
const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

export const metadata: Metadata = {
  title: "Generer AI Video Gratis: Sådan Skaber Du Din Første Video Uden Beregning | somevideopost.com",
  description:
    "Du kan generere og forhåndsvise en AI-video på somevideopost.com gratis — intet kreditkort krævet for at starte. Se præcis hvad der er gratis, hvad en fuld video koster at låse op, og hvordan hele processen fungerer.",
  keywords:
    "generer AI video gratis, gratis AI video generator, AI video gratis, skab AI video uden beregning, gratis AI videomaskine, AI video generator gratis prøve",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      en: `${BASE}/generate-ai-video-free`,
      da: PAGE_URL,
      es: `${BASE}/es/generate-ai-video-free`,
      de: `${BASE}/de/generate-ai-video-free`,
      "x-default": `${BASE}/generate-ai-video-free`,
    },
  },
  openGraph: {
    title: "Generer AI Video Gratis: Sådan Skaber Du Din Første Video Uden Beregning",
    description:
      "Generer og forhåndsvis en AI-video på somevideopost.com gratis — intet kreditkort krævet for at starte.",
    type: "website",
    siteName: "somevideopost.com",
    locale: "da_DK",
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

export default function GenerateAiVideoFreeDaPage() {
  const currency = currencyForLocale("da");
  const videoPrice = formatPriceKey("video", currency);
  const subscriptionPrice = formatPriceKey("subscription", currency);

  const FAQ = [
    {
      q: "Kan jeg virkelig generere en AI-video gratis?",
      a: `Ja. På somevideopost.com indsætter du et annoncelink eller uploader billeder, og AI genererer og forhåndsviser en fuld video gratis — intet kreditkort krævet for at starte. Du betaler kun (${videoPrice}), hvis du vælger at låse videoen op til download og deling.`,
    },
    {
      q: "Hvad er præcis gratis, og hvad koster penge?",
      a: `At generere videoen og se forhåndsvisningen blive bygget er gratis. At låse den færdige video op — så du kan downloade eller publicere den — koster ${videoPrice} pr. video, opkrævet kun én gang, når du beslutter at låse den op. Der kræves intet abonnement bare for at lave en video.`,
    },
    {
      q: "Er der en hage, som et vandmærke eller en tidsbegrænsning?",
      a: `Den gratis forhåndsvisning er vandmærket og kan ikke downloades, så det er tydeligt en forhåndsvisning — men det er en ægte forhåndsvisning af din faktiske genererede video, ikke et generisk eksempel. At betale ${videoPrice} fjerner vandmærket og låser den fulde opløsning op til download og deling, så du altid ved præcis, hvad du får, før du beslutter dig for at låse op.`,
    },
    {
      q: "Skal jeg bruge et kreditkort for at begynde at generere?",
      a: "Nej. Du kan oprette en konto og generere din første forhåndsvisning uden at indtaste betalingsoplysninger. Betaling er kun nødvendig, hvis du vælger at låse en video op eller abonnere på studie-adgang.",
    },
    {
      q: "Hvad er forskellen på den gratis videoforhåndsvisning og studie-adgang?",
      a: `At generere og forhåndsvise en video er gratis og betales pr. video derefter (${videoPrice} pr. stk.). Studie-adgang er et separat, valgfrit ${subscriptionPrice}/md.-abonnement, der låser AI-genererede sociale opslag og direkte publicering til Facebook og Instagram op — du behøver det ikke bare for at lave en video.`,
    },
    {
      q: "Kan jeg generere mere end én gratis forhåndsvisning?",
      a: "Ja — du kan generere en ny forhåndsvisning for enhver annonce eller ethvert billedsæt, du tilføjer. Det gratis er at generere og forhåndsvise; prisen pr. video gælder kun, når du låser en specifik video op til download eller deling.",
    },
    {
      q: "Hvad kan jeg gøre med videoen, når jeg har låst den op?",
      a: "Download den i 9:16, 1:1 eller 16:9, eller publicer den direkte til Facebook, Instagram, TikTok, LinkedIn og YouTube fra dashboardet — den er din til at bruge, som du vil.",
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "Sådan genererer du en AI-video gratis",
      description: "Trin til at generere og forhåndsvise en AI-genereret video på somevideopost.com uden at betale noget på forhånd.",
      step: [
        { "@type": "HowToStep", name: "Opret en gratis konto", text: "Tilmeld dig uden kreditkort." },
        { "@type": "HowToStep", name: "Indsæt et link eller upload billeder", text: "Peg somevideopost.com på din annonce, eller upload dine egne billeder." },
        { "@type": "HowToStep", name: "Forhåndsvis din AI-video gratis", text: "Se den AI-genererede video blive bygget, og forhåndsvis den uden beregning." },
        { "@type": "HowToStep", name: "Lås op, download eller publicer", text: `Betal kun, hvis du vælger at låse den endelige video op (${videoPrice}) til download eller publicering.` },
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
        { "@type": "ListItem", position: 2, name: "Generer AI Video Gratis", item: PAGE_URL },
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
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100">
            <Gift size={11} className="text-orange-300" /> Generer AI Video Gratis
          </div>
          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
            Ja — du kan generere en
            {" "}<span style={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI-video gratis</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
            somevideopost.com lader dig generere og forhåndsvise en ægte AI-video, før du betaler noget. Intet
            kreditkort krævet for at starte. Du betaler kun ({videoPrice}), hvis du beslutter at låse den
            færdige video op til download eller publicering.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
              Generer din gratis forhåndsvisning <ArrowRight size={16} />
            </Link>
            <Link href="/da/priser" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 px-7 py-3.5 text-sm font-medium text-white hover:bg-blue-500/10 transition-colors">
              Se alle priser
            </Link>
          </div>
        </div>
      </section>

      {/* ── What's free ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Hvad betyder &ldquo;gratis&rdquo; helt konkret?</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            De fleste værktøjer, der lover en &ldquo;gratis AI-video&rdquo;, kræver enten et kreditkort på
            forhånd, gemmer resultatet bag en betalingsmur, indtil du har betalt, eller lader dig kun generere
            en lav-kvalitets forhåndsvisning, der ikke afspejler det rigtige resultat. somevideopost.com virker
            anderledes: du genererer den rigtige video og ser den blive bygget i dashboardet, helt gratis — du
            beslutter bagefter, om du vil låse den op.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.06] p-6">
              <p className="mb-4 flex items-center gap-2 text-sm font-bold text-emerald-400"><CheckCircle2 size={16} /> Gratis, intet kreditkort krævet</p>
              <ul className="flex flex-col gap-2.5 text-sm text-slate-300">
                <li>Oprettelse af konto</li>
                <li>Indsæt et link eller upload billeder</li>
                <li>AI genererer din video</li>
                <li>Se en vandmærket forhåndsvisning blive bygget</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-orange-400/25 bg-orange-500/[0.06] p-6">
              <p className="mb-4 flex items-center gap-2 text-sm font-bold text-orange-400"><XCircle size={16} /> Betalt, kun hvis du vil have det</p>
              <ul className="flex flex-col gap-2.5 text-sm text-slate-300">
                <li>Lås den endelige video op ({videoPrice} pr. video)</li>
                <li>Download den i fuld opløsning</li>
                <li>Publicer den til dine sociale kanaler</li>
                <li>Valgfri studie-adgang til AI-opslag ({subscriptionPrice}/md.)</li>
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
              <Wand2 size={12} /> Sådan virker det
            </span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">Generer din gratis AI-video i fire trin</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Step n="Trin 1" icon={Sparkles} title="Opret en gratis konto" desc="Tilmeld dig på få sekunder — intet kreditkort krævet for at komme i gang." />
            <Step n="Trin 2" icon={Link2} title="Indsæt et link eller upload billeder" desc="Peg somevideopost.com på en annonce, produktside eller dine egne billeder." />
            <Step n="Trin 3" icon={Eye} title="Forhåndsvis din video gratis" desc="Se AI generere din rigtige video, og forhåndsvis den — vandmærket, uden beregning — direkte i dashboardet." />
            <Step n="Trin 4" icon={Download} title="Lås op, download eller publicer" desc={`Tilfreds? Lås videoen op for ${videoPrice} for at downloade eller publicere den til dine sociale kanaler.`} />
          </div>
        </div>
      </section>

      {/* ── Why it's structured this way ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Hvorfor betaler du først, når du har set resultatet?</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            AI-videogenerering koster computerkraft, og de fleste værktøjer dækker det ved at lægge alting bag
            et abonnement, før du har set et eneste resultat. somevideopost.com vender det om: du ser præcis,
            hvad du får — din faktiske video, ikke et generisk eksempel — før du bruger noget som helst. Vil du
            ikke beholde den, lader du bare være med at låse den op.
          </p>
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-blue-400/20 bg-blue-500/[0.06] p-5">
            <Share2 size={18} className="mt-0.5 shrink-0 text-blue-300" />
            <p className="text-sm leading-relaxed text-slate-300">
              Når den er låst op, kan hver video deles direkte til Facebook, Instagram, TikTok, LinkedIn og
              YouTube fra dashboardet, eller downloades i 9:16, 1:1 og 16:9, hvor du ellers har brug for den.
            </p>
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

      <UseCaseLinks current="/generate-ai-video-free" locale="da" />

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20 text-white" style={{ background: "linear-gradient(135deg, #040a1c 0%, #0a1f4d 100%)" }}>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Prøv det — det koster intet at se din video</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">
            Opret en gratis konto, indsæt et link eller upload billeder, og forhåndsvis din AI-video i dag.
          </p>
          <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-[0_0_35px_rgba(255,107,74,0.4)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
            Start gratis <ArrowRight size={18} />
          </Link>
          <p className="mt-4 text-sm text-slate-400">
            Se alle <Link href="/da/priser" className="text-blue-300 underline-offset-2 hover:underline">prisdetaljer</Link>, læs
            {" "}<Link href="/da/hvorfor-somevideopost" className="text-blue-300 underline-offset-2 hover:underline">hvorfor udlejere vælger somevideopost.com</Link>, eller
            besøg <Link href="/blog" className="text-blue-300 underline-offset-2 hover:underline">bloggen</Link>.
          </p>
        </div>
      </section>

      <SiteFooter locale="da" />
    </div>
  );
}
