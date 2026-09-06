import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles, CreditCard, Video, Wand2, Share2 } from "lucide-react";
import { getCurrency } from "@/lib/locale-server";
import { formatPriceKey, MONTHLY_POST_CREDITS } from "@/lib/currency";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CinematicWalkthrough } from "@/components/walkthrough/cinematic-walkthrough";

export const metadata: Metadata = {
  title: "Priser — SOME VIDEO POST | AI-video og sociale medier til udlejere",
  description:
    "Enkel pris for somevideopost.com: 75 kr./md. for studie-adgang med AI-opslag og direkte deling til sociale medier, og 99 kr. pr. præsentationsvideo — betal kun for de videoer, du bruger. Ingen binding.",
  keywords:
    "somevideopost priser, AI video pris, sociale medier udlejning, feriebolig markedsføring pris, præsentationsvideo pris",
  alternates: {
    canonical: "https://www.somevideopost.com/priser",
    languages: {
      da: "https://www.somevideopost.com/priser",
      en: "https://www.somevideopost.com/en/priser",
      es: "https://www.somevideopost.com/es/priser",
      de: "https://www.somevideopost.com/de/priser",
      "x-default": "https://www.somevideopost.com/priser",
    },
  },
  openGraph: {
    title: "Priser — SOME VIDEO POST",
    description:
      "75 kr./md. for studie-adgang med AI-opslag og direkte deling, og 99 kr. pr. præsentationsvideo. Betal kun for det, du bruger. Ingen binding.",
    type: "website",
    siteName: "somevideopost.com",
    url: "https://www.somevideopost.com/priser",
  },
};

const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-sm text-slate-300">
      <Check size={14} className="mt-0.5 shrink-0 text-emerald-400" strokeWidth={2.5} />
      <span>{children}</span>
    </li>
  );
}

export default async function PriserPage() {
  const currency = await getCurrency();
  const subscriptionPrice = formatPriceKey("subscription", currency);
  const videoPrice = formatPriceKey("video", currency);
  const postPrice = formatPriceKey("aiPost", currency, { decimals: true });

  return (
    <div className="min-h-screen text-slate-100" style={{ background: "#050d24" }}>
      <SiteHeader active="pricing" />

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/5" style={{ background: "linear-gradient(135deg, #040a1c 0%, #071233 55%, #0a1f4d 100%)" }}>
        <div className="absolute left-0 top-0 h-64 w-64 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #4d8dff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 80px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-4xl px-6 py-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-200">
            <CreditCard size={13} /> Enkel, gennemsigtig pris
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Betal kun for det, du bruger
          </h1>
          <p className="mt-4 text-base text-slate-300 max-w-xl mx-auto">
            Studie-adgang for {subscriptionPrice}/md. giver dig AI-opslag og direkte deling til sociale medier. Præsentationsvideoer betaler du pr. styk — {videoPrice} — så du kun betaler for de videoer, du faktisk laver. Ingen binding.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16 space-y-16">

        {/* Pricing cards */}
        <div className="grid items-start gap-6 md:grid-cols-2">

          {/* Studio access — subscription */}
          <div className="relative flex flex-col rounded-2xl border border-blue-400/50 bg-white/[0.05] p-8 shadow-[0_0_45px_rgba(59,130,246,0.25)] backdrop-blur-sm">
            <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-lg bg-blue-500/15 px-2.5 py-1 text-xs font-semibold text-blue-300">
              <Sparkles size={12} /> Studie-adgang
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">{subscriptionPrice}</span>
              <span className="text-slate-400 text-sm">/md.</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Faktureres månedligt · ingen binding</p>
            <p className="mt-3 text-sm text-slate-300">
              Adgang til hele studiet: generér AI-opslag og del dem direkte på dine sociale medier.
            </p>
            <ul className="my-6 flex flex-col gap-2.5">
              <CheckItem><strong className="text-white">{MONTHLY_POST_CREDITS} AI-opslag</strong> inkluderet hver måned ({postPrice}/opslag)</CheckItem>
              <CheckItem>Del opslag direkte på Facebook & Instagram</CheckItem>
              <CheckItem>Alle studie-værktøjer og downloads i alle formater</CheckItem>
              <CheckItem>Opret præsentationsvideoer (betales pr. styk)</CheckItem>
              <CheckItem>Blog, guides og løbende nye funktioner</CheckItem>
            </ul>
            <div className="mt-auto">
              <Link
                href="/signup"
                className="block w-full rounded-xl py-3 text-center text-sm font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #1e4f9a, #4d8dff)" }}
              >
                Kom i gang
              </Link>
            </div>
          </div>

          {/* Presentation video — pay per use */}
          <div className="flex flex-col rounded-2xl border border-orange-500/25 bg-orange-500/[0.06] p-8 backdrop-blur-sm">
            <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-lg bg-orange-500/15 px-2.5 py-1 text-xs font-semibold text-orange-400">
              <Video size={12} /> Præsentationsvideo
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">{videoPrice}</span>
              <span className="text-slate-400 text-sm">/ stk.</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Betaling pr. brug · ingen abonnement på video</p>
            <p className="mt-3 text-sm text-slate-300">
              En cinematisk AI-genereret præsentationsvideo af din bolig — betal kun, når du bruger den.
            </p>
            <ul className="my-6 flex flex-col gap-2.5">
              <CheckItem><strong className="text-white">{videoPrice} pr. video</strong> — ingen binding, ingen skjulte gebyrer</CheckItem>
              <CheckItem>Indsæt et annonce-link — AI&apos;en bygger videoen for dig</CheckItem>
              <CheckItem>Cinematisk 9:16-video klar til Reels & TikTok</CheckItem>
              <CheckItem>Se en forhåndsvisning, betal først når du er tilfreds</CheckItem>
              <CheckItem>Download og del direkte, når videoen er låst op</CheckItem>
            </ul>
            <div className="mt-auto">
              <Link
                href="/signup"
                className="block w-full rounded-xl py-3 text-center text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: ORANGE_GRADIENT }}
              >
                Opret din første video
              </Link>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-blue-400/20 bg-blue-500/[0.06] p-6 md:p-8 backdrop-blur-sm">
          <h2 className="text-lg font-bold text-white mb-6">Sådan fungerer det</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Sparkles, title: "1 · Tegn studie-adgang", desc: `For ${subscriptionPrice}/md. får du adgang til studiet og ${MONTHLY_POST_CREDITS} AI-opslag hver måned.` },
              { icon: Wand2, title: "2 · Lav opslag og videoer", desc: `Generér opslag inkluderet i din adgang, og lav præsentationsvideoer for ${videoPrice}/stk. efter behov.` },
              { icon: Share2, title: "3 · Del direkte", desc: "Del opslag og videoer direkte på Facebook og Instagram fra dashboardet." },
            ].map((step) => (
              <div key={step.title} className="flex flex-col gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15">
                  <step.icon size={20} className="text-blue-300" />
                </div>
                <p className="text-sm font-bold text-white">{step.title}</p>
                <p className="text-sm leading-relaxed text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white mb-6">Ofte stillede spørgsmål</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                q: "Hvad er inkluderet i studie-adgangen?",
                a: `Studie-adgang for ${subscriptionPrice}/md. giver dig ${MONTHLY_POST_CREDITS} AI-opslag om måneden, direkte deling til sociale medier og alle studiets værktøjer. Præsentationsvideoer betales særskilt pr. styk.`,
              },
              {
                q: "Hvad koster en præsentationsvideo?",
                a: `En præsentationsvideo koster ${videoPrice} pr. styk. Du betaler kun for de videoer, du laver — der er intet abonnement på video.`,
              },
              {
                q: "Hvornår betaler jeg for en video?",
                a: "Du kan se en forhåndsvisning, mens videoen bygges, og betaler først, når du vil låse den fulde video op til download og deling. Uploadede videoer koster ingenting.",
              },
              {
                q: "Kan jeg dele direkte på sociale medier?",
                a: "Ja. Med studie-adgang deler du opslag og videoer direkte på Facebook og Instagram fra dashboardet.",
              },
              {
                q: "Hvad sker der, når mine månedlige opslag er brugt?",
                a: `Din adgang giver ${MONTHLY_POST_CREDITS} AI-opslag om måneden. Saldoen fyldes automatisk op hver måned, så længe dit abonnement er aktivt.`,
              },
              {
                q: "Er der binding?",
                a: "Nej. Studie-adgangen er månedlig uden binding, og du kan opsige når som helst. Videoer betaler du kun for, når du bruger dem.",
              },
            ].map((item) => (
              <div key={item.q}>
                <p className="font-semibold text-white mb-1">{item.q}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live video demo */}
        <div
          className="overflow-hidden rounded-2xl border border-white/10 p-8 md:p-12 text-white"
          style={{ background: "linear-gradient(160deg, #040a1c 0%, #0a1f4d 50%, #040a1c 100%)" }}
        >
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="mb-3 inline-block rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-orange-400">Live demo</span>
              <h2 className="text-2xl font-bold mb-3">Se hvad en præsentationsvideo indeholder</h2>
              <p className="text-sm leading-relaxed text-slate-300 mb-5 max-w-md">
                Sådan ser en AI-genereret præsentationsvideo ud. Indsæt et link til din annonce — AI&apos;en henter billederne, bygger fotoruten og leverer en cinematisk video i 9:16 til Reels & TikTok.
              </p>
              <ul className="flex flex-col gap-2 text-sm text-slate-300">
                <CheckItem><span className="text-slate-300">Prøv selv: scroll i videoen for at gå rundt i boligen</span></CheckItem>
                <CheckItem><span className="text-slate-300">Skift farvestemning med filtre</span></CheckItem>
                <CheckItem><span className="text-slate-300">Klar på under 15 minutter</span></CheckItem>
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-[300px]">
                <div className="absolute inset-0 scale-90 rounded-[2.5rem] opacity-40 blur-2xl" style={{ background: ORANGE_GRADIENT }} />
                <div className="relative">
                  <CinematicWalkthrough locale="da" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          className="relative overflow-hidden rounded-2xl border border-white/10 p-8 text-white text-center"
          style={{ background: "linear-gradient(135deg, #040a1c 0%, #0a1f4d 100%)" }}
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.2)" }} />
          <div className="relative">
            <h2 className="text-2xl font-bold mb-2">Klar til at komme i gang?</h2>
            <p className="text-slate-300 text-sm mb-6 max-w-md mx-auto">
              Kom i gang med somevideopost.com i dag. Ingen binding.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="rounded-xl px-6 py-3 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90"
                style={{ background: ORANGE_GRADIENT }}
              >
                Opret konto
              </Link>
              <a
                href="mailto:mail@somevideopost.com"
                className="rounded-xl border border-white/25 bg-white/5 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition"
              >
                Kontakt salg
              </a>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
