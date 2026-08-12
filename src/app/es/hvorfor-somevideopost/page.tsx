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

const BASE = "https://www.somevideopost.com";
const PAGE_URL = `${BASE}/es/hvorfor-somevideopost`;
const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

export const metadata: Metadata = {
  title: "¿Por qué somevideopost.com? Vídeo IA y publicación automática en redes sociales",
  description:
    "somevideopost.com es el panel donde los anfitriones pasan de un enlace de propiedad a un vídeo IA terminado y una publicación que vende en minutos — y comparten automáticamente en Facebook, Instagram, TikTok y LinkedIn, o descargan en todos los formatos. Descubre por qué miles eligen somevideopost.com.",
  keywords:
    "por qué somevideopost, somevideopost.com, vídeo IA alquiler vacacional, publicación automática redes sociales, compartir vídeo Facebook Instagram TikTok, descargar vídeo de propiedad, vídeo de presentación IA, panel redes sociales para anfitriones, enlace de propiedad a vídeo, publicación IA",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      da: `${BASE}/hvorfor-somevideopost`,
      en: `${BASE}/en/hvorfor-somevideopost`,
      es: PAGE_URL,
      de: `${BASE}/de/hvorfor-somevideopost`,
      "x-default": `${BASE}/hvorfor-somevideopost`,
    },
  },
  openGraph: {
    title: "¿Por qué somevideopost.com? Vídeo IA y publicación automática en redes sociales",
    description:
      "De un enlace de propiedad a un vídeo IA y publicación terminados en minutos. Comparte automáticamente en Facebook, Instagram, TikTok y LinkedIn — o descarga en todos los formatos.",
    type: "website",
    siteName: "somevideopost.com",
    locale: "es_ES",
    url: PAGE_URL,
  },
};

const FAQ = [
  {
    q: "¿Qué es somevideopost.com?",
    a: "somevideopost.com es una plataforma de IA para anfitriones de alquileres vacacionales, apartamentos privados y hoteles. Pegas el enlace de tu anuncio o subes fotos, y la IA crea automáticamente un vídeo de presentación profesional y una publicación que vende — lista para compartir en redes sociales o descargar.",
  },
  {
    q: "¿Qué tan rápido está listo un vídeo IA?",
    a: "La mayoría de los vídeos de presentación están terminados en menos de 15 minutos. Solo pegas un enlace de la propiedad o subes tus fotos, eliges un estilo, y la IA genera un vídeo con movimiento de cámara, transiciones y música mientras sigues el progreso en vivo en el panel.",
  },
  {
    q: "¿Puedo compartir directamente en Facebook, Instagram, TikTok y LinkedIn?",
    a: "Sí. Desde el panel conectas tus canales una vez, y luego compartes publicaciones y vídeos en Facebook, Instagram, TikTok, LinkedIn y YouTube con un clic — o los programas para el mejor momento. También puedes descargar el vídeo y usarlo donde quieras.",
  },
  {
    q: "¿Puedo descargar el vídeo?",
    a: "Sí. Todos los vídeos se pueden descargar en alta resolución y en los formatos correctos — 9:16 para Reels y TikTok, 1:1 para el feed y 16:9 para YouTube y sitios web — así que eres dueño total del material.",
  },
  {
    q: "¿Necesito saber editar vídeo para usarlo?",
    a: "No. Todo el sentido de somevideopost.com es que no necesitas conocimientos técnicos ni edición de vídeo. La IA hace el trabajo pesado, y el panel fácil de usar convierte el resto en unos pocos clics.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "El acceso al estudio cuesta 10 €/mes y te da 15 publicaciones IA al mes además de publicación directa en redes sociales. Los vídeos de presentación se pagan aparte, por vídeo — 50 € cada uno — así que solo pagas por los vídeos que realmente haces. Sin compromiso. Consulta todos los detalles en la página de precios.",
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

export default function WhySomeVideoPostEsPage() {
  const t = LANDING.es;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "somevideopost.com",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: BASE,
      description:
        "Plataforma de IA que crea vídeos de presentación y publicaciones que venden para anfitriones y los comparte automáticamente en redes sociales.",
      offers: [
        { "@type": "Offer", name: "Acceso al estudio", price: "10", priceCurrency: "EUR" },
        { "@type": "Offer", name: "Vídeo de presentación", price: "50", priceCurrency: "EUR" },
      ],
      featureList: [
        "Vídeos de presentación generados por IA",
        "Publicación automática en Facebook, Instagram, TikTok, LinkedIn y YouTube",
        "Publicaciones que venden generadas desde un enlace de propiedad",
        "Descarga en 9:16, 1:1 y 16:9",
        "Panel fácil de usar para programar y compartir",
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
        { "@type": "ListItem", position: 1, name: "Inicio", item: BASE },
        { "@type": "ListItem", position: 2, name: "Por qué somevideopost.com", item: PAGE_URL },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col text-slate-100" style={{ background: "#050d24" }}>
      <JsonLd data={jsonLd} />

      <SiteHeader active="why" locale="es" />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 md:py-28" style={{ background: "linear-gradient(135deg, #040a1c 0%, #071233 55%, #0a1f4d 100%)" }}>
        <div className="absolute left-0 top-0 h-64 w-64 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #4d8dff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="pointer-events-none absolute -right-48 -top-48 h-[600px] w-[600px] rounded-full border border-blue-400/25" style={{ boxShadow: "0 0 80px rgba(59,130,246,0.25), inset 0 0 80px rgba(59,130,246,0.1)" }} />
        <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-orange-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100">
                <Sparkles size={11} className="text-orange-300" /> ¿Por qué somevideopost.com?
              </div>
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                La IA crea vídeos espectaculares<br />
                <span style={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>en pocos minutos</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">
                somevideopost.com es un panel fácil de usar donde pasas de un enlace de propiedad a un vídeo de
                presentación y una publicación que vende terminados — y compartes automáticamente en todas las
                redes sociales o descargas en el formato que necesites. Sin edición de vídeo, sin conocimientos técnicos.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
                  Empieza hoy <ArrowRight size={16} />
                </Link>
                <Link href="/es/priser" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 px-7 py-3.5 text-sm font-medium text-white hover:bg-blue-500/10 transition-colors">
                  Ver precios
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 border-t border-white/10 pt-6">
                {[
                  { icon: Clock, val: "< 15 min", label: "Vídeo entregado" },
                  { icon: TrendingUp, val: "hasta 80 %", label: "Más reservas con vídeo" },
                  { icon: Share2, val: "5 canales", label: "Comparte con un clic" },
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
              <Link2 size={12} /> Cómo funciona
            </span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">Pega un enlace de propiedad o sube fotos</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Empieza donde estés. Pega el enlace de tu anuncio de Airbnb, Booking.com o Novasol — o sube tus
              propias fotos. La IA se encarga del resto, mientras sigues el proceso en el panel.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Step n="Paso 1" icon={Link2} title="Pega un enlace o sube fotos" desc="La IA obtiene automáticamente fotos, título, precio, tamaño y ubicación de tu anuncio existente — o usa tus propias fotos." />
            <Step n="Paso 2" icon={Wand2} title="La IA genera vídeo y publicación" desc="Se crean automáticamente un vídeo de presentación cinematográfico y una publicación que vende, adaptados a cada plataforma con el tono y la duración adecuados." />
            <Step n="Paso 3" icon={Share2} title="Comparte o descarga" desc="Comparte con un clic en todos tus canales, programa para el mejor momento — o descarga el vídeo en resolución completa." />
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
                <Video size={12} /> Generación de vídeo IA
              </span>
              <h2 className="text-3xl font-bold text-white md:text-4xl">Vídeos profesionales de propiedades — sin fotógrafo</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                La IA añade movimientos de cámara suaves, transiciones cinematográficas y música de fondo a tus
                fotos y crea un vídeo de presentación espectacular en minutos. Sigues el progreso en vivo en el
                panel — desde &ldquo;la IA genera&rdquo; hasta &ldquo;¡Listo!&rdquo;.
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {[
                  "Movimientos de cámara y transiciones cinematográficas automáticos",
                  "9:16 optimizado para Reels, TikTok y Shorts",
                  "Música de fondo y texto adaptados a la propiedad",
                  "Entregado directamente en la app, listo para compartir",
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
                  <span className="font-semibold text-white">Generación de vídeo</span>
                </div>
                <div className="mb-4 grid grid-cols-3 gap-2">
                  {[
                    { icon: Link2, label: "Pegar enlace", done: true },
                    { icon: Sparkles, label: "La IA genera", done: true, active: true },
                    { icon: CheckCircle2, label: "¡Listo!", done: false },
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
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-300">Vídeo IA generándose</p>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full" style={{ width: "75%", background: "linear-gradient(90deg, #4d8dff, #22d3ee)" }} />
                  </div>
                  <p className="mt-2 text-xs text-slate-400">Procesando fotos … 75 %</p>
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
            <LayoutDashboard size={12} /> Un panel para todo
          </span>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Un panel fácil de usar para compartir todo en un solo lugar</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Crea, programa, comparte y descarga — sin saltar entre apps. El panel reúne tus propiedades,
            vídeos, publicaciones y canales en un solo lugar, así tienes control total con solo unos clics.
          </p>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <BenefitCard icon={MonitorSmartphone} title="Todo en un solo lugar" desc="Propiedades, vídeos, publicaciones y canales conectados en un panel claro — también en móvil." accent="bg-blue-500/15 text-blue-400" />
            <BenefitCard icon={CalendarDays} title="Programa en el momento adecuado" desc="Programa publicaciones y vídeos para que lleguen cuando tu audiencia está más activa." accent="bg-emerald-500/15 text-emerald-400" />
            <BenefitCard icon={Rocket} title="Diseñado para la velocidad" desc="De enlace de propiedad a contenido compartido en minutos. Sin curva de aprendizaje — diseñado para anfitriones ocupados." accent="bg-orange-500/15 text-orange-400" />
          </div>
        </div>
      </section>

      {/* ── Automatic sharing to socials ── */}
      <section className="relative overflow-hidden py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300">
              <Share2 size={12} /> Publicación automática
            </span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">Comparte automáticamente en todas las redes sociales</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Conecta tus canales una vez y luego comparte publicaciones y vídeos en todas las plataformas con
              un clic — o deja que el planificador lo haga por ti.
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
                <Download size={12} /> Descarga y propiedad
              </span>
              <h2 className="text-3xl font-bold text-white md:text-4xl">Descarga en todos los formatos — el contenido es tuyo</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-300">
                ¿Quieres usar el vídeo en un email, en tu web o en un anuncio? Descárgalo en alta resolución en
                exactamente el formato que necesites. Eres dueño total del material y puedes usarlo donde quieras.
              </p>
              <Link href="/signup" className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-opacity hover:opacity-90" style={{ background: "linear-gradient(135deg, #1e4f9a, #4d8dff)" }}>
                Comenzar <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { ratio: "9:16", use: "Reels y TikTok", box: "aspect-[9/16]" },
                { ratio: "1:1", use: "Feed", box: "aspect-square" },
                { ratio: "16:9", use: "YouTube y web", box: "aspect-video" },
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
            <h2 className="text-3xl font-bold text-white md:text-4xl">Por eso los anfitriones eligen somevideopost.com</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">Todo lo que necesitas para comercializar tu propiedad de forma profesional — en una sola herramienta.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <BenefitCard icon={Clock} title="Ahorra horas cada semana" desc="La automatización significa que pasas de la idea al contenido compartido en minutos, no horas." accent="bg-orange-500/15 text-orange-400" />
            <BenefitCard icon={Video} title="Calidad profesional" desc="Vídeos cinematográficos y publicaciones impactantes que destacan tu propiedad — sin agencia." accent="bg-emerald-500/15 text-emerald-400" />
            <BenefitCard icon={Share2} title="Presencia en todas partes" desc="Una propiedad, todos los canales. Facebook, Instagram, TikTok, LinkedIn y YouTube a la vez." accent="bg-blue-500/15 text-blue-400" />
            <BenefitCard icon={Wand2} title="IA que entiende de propiedades" desc="El texto y el vídeo se optimizan para el sector del alquiler — con el tono adecuado para cada plataforma." accent="bg-violet-500/15 text-violet-400" />
            <BenefitCard icon={TrendingUp} title="Más reservas" desc="Los anuncios con vídeo se ven más tiempo y convierten mejor. Dale a tu anuncio el formato que vende." accent="bg-pink-500/15 text-pink-400" />
            <BenefitCard icon={Download} title="Propiedad total" desc="Descarga todo en alta resolución y úsalo donde quieras — el contenido es tuyo." accent="bg-yellow-500/15 text-yellow-400" />
          </div>
        </div>
      </section>

      <UseCaseLinks
        heading="Vídeo IA para cada propósito"
        subheading="somevideopost.com crea vídeo IA a partir de un enlace o tus fotos — ya sea para redes sociales, venta de propiedades o alquiler."
      />

      {/* ── FAQ ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Preguntas frecuentes</h2>
            <p className="mt-3 text-slate-400">Todo lo que necesitas saber sobre somevideopost.com.</p>
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
          <h2 className="text-3xl font-bold md:text-4xl">¿Listo para comercializar tu propiedad en piloto automático?</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">
            Pasa de un enlace de propiedad a un vídeo y publicación terminados en minutos. Acceso al estudio desde 10 €/mes, vídeos desde 50 € cada uno.
          </p>
          <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-[0_0_35px_rgba(255,107,74,0.4)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
            Empieza hoy <ArrowRight size={18} />
          </Link>
          <p className="mt-4 text-sm text-slate-400">
            ¿Quieres saber más? Consulta nuestro <Link href="/blog" className="text-blue-300 underline-offset-2 hover:underline">blog y guías</Link> o <Link href="/es/priser" className="text-blue-300 underline-offset-2 hover:underline">precios</Link>.
          </p>
        </div>
      </section>

      <SiteFooter locale="es" />
    </div>
  );
}
