import Link from "next/link";
import { Share2, Building2, Home, Gift, ArrowRight, type LucideIcon } from "lucide-react";
import type { Locale } from "@/lib/i18n";

export type UseCaseSlug =
  | "/some-ai-video"
  | "/ai-video-for-real-estate"
  | "/generate-ai-video-free"
  | "/ai-video-for-apartment";

type UseCaseText = { label: string; blurb: string; readMore: string; heading: string; subheading: string };

const ICONS: Record<UseCaseSlug, LucideIcon> = {
  "/some-ai-video": Share2,
  "/ai-video-for-real-estate": Home,
  "/generate-ai-video-free": Gift,
  "/ai-video-for-apartment": Building2,
};

export const USE_CASE_SLUGS: UseCaseSlug[] = [
  "/some-ai-video",
  "/ai-video-for-real-estate",
  "/generate-ai-video-free",
  "/ai-video-for-apartment",
];

/**
 * Per-locale copy for the four AI-video pillar pages, keyed by their
 * (always-English) canonical slug — single source of truth so every page
 * links to the others with matching label/blurb/URL (hub-and-spoke).
 */
const TEXT: Record<Locale, Record<UseCaseSlug, UseCaseText> & { heading: string; subheading: string }> = {
  en: {
    heading: "Explore more AI video use cases",
    subheading: "somevideopost.com turns links and photos into AI video for every use case — see how it works for you.",
    "/some-ai-video": { label: "SoMe AI Video", blurb: "AI-generated video for Instagram, TikTok, Facebook & LinkedIn.", readMore: "Read more", heading: "", subheading: "" },
    "/ai-video-for-real-estate": { label: "AI Video for Real Estate", blurb: "Cinematic listing videos for agents, agencies & estates.", readMore: "Read more", heading: "", subheading: "" },
    "/generate-ai-video-free": { label: "Generate AI Video Free", blurb: "How to preview and generate your first AI video at no cost.", readMore: "Read more", heading: "", subheading: "" },
    "/ai-video-for-apartment": { label: "AI Video for Apartment", blurb: "Interior-focused videos that make apartment listings rent faster.", readMore: "Read more", heading: "", subheading: "" },
  },
  da: {
    heading: "AI video til hvert formål",
    subheading: "somevideopost.com laver AI-video ud fra et link eller dine billeder — uanset om det er til sociale medier, boligsalg eller udlejning.",
    "/some-ai-video": { label: "SoMe AI Video", blurb: "AI-genereret video til Instagram, TikTok, Facebook & LinkedIn.", readMore: "Læs mere", heading: "", subheading: "" },
    "/ai-video-for-real-estate": { label: "AI Video til Boliger", blurb: "Cinematiske boligvideoer til mæglere, bureauer & ejendomme.", readMore: "Læs mere", heading: "", subheading: "" },
    "/generate-ai-video-free": { label: "Gratis AI Video", blurb: "Sådan forhåndsviser og genererer du din første AI-video gratis.", readMore: "Læs mere", heading: "", subheading: "" },
    "/ai-video-for-apartment": { label: "AI Video til Lejligheder", blurb: "Interiørfokuserede videoer der udlejer lejligheder hurtigere.", readMore: "Læs mere", heading: "", subheading: "" },
  },
  es: {
    heading: "Vídeo IA para cada propósito",
    subheading: "somevideopost.com crea vídeo IA a partir de un enlace o tus fotos — ya sea para redes sociales, venta de propiedades o alquiler.",
    "/some-ai-video": { label: "Vídeo IA para Redes Sociales", blurb: "Vídeo generado por IA para Instagram, TikTok, Facebook y LinkedIn.", readMore: "Leer más", heading: "", subheading: "" },
    "/ai-video-for-real-estate": { label: "Vídeo IA Inmobiliario", blurb: "Vídeos cinematográficos de anuncios para agentes, agencias e inmobiliarias.", readMore: "Leer más", heading: "", subheading: "" },
    "/generate-ai-video-free": { label: "Vídeo IA Gratis", blurb: "Cómo previsualizar y generar tu primer vídeo IA sin coste.", readMore: "Leer más", heading: "", subheading: "" },
    "/ai-video-for-apartment": { label: "Vídeo IA para Apartamentos", blurb: "Vídeos centrados en el interior que alquilan apartamentos más rápido.", readMore: "Leer más", heading: "", subheading: "" },
  },
  de: {
    heading: "KI-Video für jeden Zweck",
    subheading: "somevideopost.com erstellt KI-Video aus einem Link oder deinen Fotos — egal ob für soziale Medien, Immobilienverkauf oder Vermietung.",
    "/some-ai-video": { label: "KI-Video für Social Media", blurb: "KI-generiertes Video für Instagram, TikTok, Facebook & LinkedIn.", readMore: "Mehr erfahren", heading: "", subheading: "" },
    "/ai-video-for-real-estate": { label: "KI-Video für Immobilien", blurb: "Kinematische Inseratsvideos für Makler, Agenturen & Immobilien.", readMore: "Mehr erfahren", heading: "", subheading: "" },
    "/generate-ai-video-free": { label: "Kostenloses KI-Video", blurb: "So erstellst und testest du dein erstes KI-Video kostenlos.", readMore: "Mehr erfahren", heading: "", subheading: "" },
    "/ai-video-for-apartment": { label: "KI-Video für Wohnungen", blurb: "Interieur-fokussierte Videos, die Wohnungen schneller vermieten.", readMore: "Mehr erfahren", heading: "", subheading: "" },
  },
};

/** Locale-aware href for a pillar page: English is unprefixed (canonical), others live under /da /es /de. */
function hrefFor(slug: UseCaseSlug, locale: Locale): string {
  return locale === "en" ? slug : `/${locale}${slug}`;
}

/** Grid of links to the other AI-video pillar pages, for internal-linking between them. */
export function UseCaseLinks({
  current,
  locale = "en",
  heading,
  subheading,
}: {
  current?: UseCaseSlug;
  locale?: Locale;
  heading?: string;
  subheading?: string;
}) {
  const t = TEXT[locale] ?? TEXT.en;
  const others = (current ? USE_CASE_SLUGS.filter((s) => s !== current) : USE_CASE_SLUGS).map((slug) => ({
    slug,
    icon: ICONS[slug],
    ...t[slug],
  }));

  return (
    <section className="py-24" style={{ background: "#071130" }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">{heading ?? t.heading}</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">{subheading ?? t.subheading}</p>
        </div>
        <div className={`grid gap-5 sm:grid-cols-2 ${others.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
          {others.map((u) => (
            <Link
              key={u.slug}
              href={hrefFor(u.slug, locale)}
              className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-blue-400/40 hover:shadow-[0_0_35px_rgba(59,130,246,0.2)]"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                <u.icon size={20} />
              </div>
              <h3 className="mb-2 font-semibold text-white">{u.label}</h3>
              <p className="flex-1 text-sm leading-relaxed text-slate-400">{u.blurb}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300">
                {u.readMore} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
