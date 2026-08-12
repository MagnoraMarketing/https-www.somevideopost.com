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
const PAGE_URL = `${BASE}/es/ai-video-for-real-estate`;
const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

export const metadata: Metadata = {
  title: "Vídeo IA Inmobiliario: Vídeo con IA para Anuncios de Propiedades | somevideopost.com",
  description:
    "Vídeo IA inmobiliario: convierte el enlace de un anuncio o fotos de una propiedad en un vídeo de presentación cinematográfico en minutos. Diseñado para agentes, agencias y administradores de fincas.",
  keywords:
    "vídeo IA inmobiliario, generador de vídeo inmobiliario, vídeo IA de propiedades, vídeo de anuncio IA, vídeo marketing inmobiliario, vídeo walkthrough IA, vídeo redes sociales inmobiliaria, vídeo de presentación de propiedad",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      en: `${BASE}/ai-video-for-real-estate`,
      da: `${BASE}/da/ai-video-for-real-estate`,
      es: PAGE_URL,
      de: `${BASE}/de/ai-video-for-real-estate`,
      "x-default": `${BASE}/ai-video-for-real-estate`,
    },
  },
  openGraph: {
    title: "Vídeo IA Inmobiliario: Vídeo con IA para Anuncios de Propiedades",
    description:
      "Convierte el enlace de un anuncio o fotos de una propiedad en un vídeo de presentación cinematográfico en minutos — para agentes, agencias y administradores de fincas.",
    type: "website",
    siteName: "somevideopost.com",
    locale: "es_ES",
    url: PAGE_URL,
  },
};

const FAQ = [
  {
    q: "¿Qué es el vídeo IA inmobiliario?",
    a: "El vídeo IA inmobiliario es un vídeo de presentación generado automáticamente a partir del anuncio o las fotos de una propiedad, en lugar de ser grabado por un equipo de vídeo. somevideopost.com lee el enlace de tu anuncio o las fotos subidas y construye un vídeo cinematográfico con movimiento de cámara, recorrido habitación por habitación, transiciones y música — listo en minutos.",
  },
  {
    q: "¿Puedo usar las fotos que ya tengo en el anuncio?",
    a: "Sí. Pega el enlace de tu anuncio en un portal o web de reservas y somevideopost.com obtiene automáticamente las fotos, el título, el precio y los datos clave — o sube tus propias fotos de la propiedad directamente si el anuncio aún no está publicado.",
  },
  {
    q: "¿Funciona con cualquier tipo de propiedad?",
    a: "Sí — apartamentos, viviendas unifamiliares, casas de vacaciones, obra nueva y anuncios comerciales funcionan todos igual: dale a la IA un enlace o fotos, y adapta el ritmo y el orden de las tomas al número y tipo de habitaciones con las que trabaja.",
  },
  {
    q: "¿Cuánto tarda en tener un vídeo?",
    a: "La mayoría de los vídeos de presentación están listos en menos de 15 minutos. Puedes ver el vídeo construirse en el panel y previsualizarlo antes de decidir si desbloquear la descarga final.",
  },
  {
    q: "¿Puedo personalizarlo con la marca de mi agencia?",
    a: "El vídeo se genera a partir del contenido de tu propiedad, y el texto y la publicación se escriben para coincidir con tu anuncio, así que está listo para publicarse bajo tu propia página o perfil — tú mantienes el control total de dónde y cómo se comparte.",
  },
  {
    q: "¿Hay una forma gratuita de probarlo antes de pagar por un vídeo de anuncio?",
    a: "Sí — puedes generar y previsualizar un vídeo antes de pagar nada. Consulta nuestra guía sobre cómo generar vídeo IA gratis para conocer los pasos exactos.",
  },
  {
    q: "¿Puedo compartir el vídeo directamente en redes sociales?",
    a: "Sí. Conecta Facebook, Instagram, TikTok, LinkedIn y YouTube una vez, y luego publica o programa el vídeo del anuncio terminado directamente desde el panel — o descárgalo en 9:16, 1:1 o 16:9 para tu web, portal inmobiliario o campañas de email.",
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

export default function AiVideoForRealEstateEsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "somevideopost.com — Vídeo IA Inmobiliario",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: PAGE_URL,
      description:
        "Herramienta de IA que convierte el enlace de un anuncio inmobiliario o fotos de una propiedad en un vídeo de presentación cinematográfico para agentes, agencias y administradores de fincas.",
      featureList: [
        "Vídeo generado por IA a partir de un enlace de anuncio o fotos de propiedad",
        "Movimiento de cámara y transiciones automáticos habitación por habitación",
        "Funciona con apartamentos, casas, alquileres vacacionales y obra nueva",
        "Exportación en 9:16, 1:1 y 16:9 para redes, web y portales",
        "Publicación directa en Facebook, Instagram, TikTok, LinkedIn y YouTube",
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
        { "@type": "ListItem", position: 2, name: "Vídeo IA Inmobiliario", item: PAGE_URL },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col text-slate-100" style={{ background: "#050d24" }}>
      <JsonLd data={jsonLd} />
      <SiteHeader locale="es" />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 md:py-28" style={{ background: "linear-gradient(135deg, #040a1c 0%, #071233 55%, #0a1f4d 100%)" }}>
        <div className="absolute left-0 top-0 h-64 w-64 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #4d8dff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="pointer-events-none absolute -right-48 -top-48 h-[600px] w-[600px] rounded-full border border-blue-400/25" style={{ boxShadow: "0 0 80px rgba(59,130,246,0.25), inset 0 0 80px rgba(59,130,246,0.1)" }} />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100">
                <Home size={11} className="text-orange-300" /> Vídeo IA Inmobiliario
              </div>
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                Convierte cada anuncio en un
                {" "}<span style={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>vídeo IA cinematográfico</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">
                El vídeo IA inmobiliario convierte el enlace de un anuncio o un conjunto de fotos de una
                propiedad en un vídeo de presentación profesional — con movimiento de cámara, recorrido
                habitación por habitación y música — en menos de 15 minutos. Sin videógrafo, sin software de
                edición, sin días de espera para una sesión de fotos.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
                  Crea un vídeo de anuncio <ArrowRight size={16} />
                </Link>
                <Link href="/es/generate-ai-video-free" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 px-7 py-3.5 text-sm font-medium text-white hover:bg-blue-500/10 transition-colors">
                  Pruébalo gratis
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <VideoPreviewMockup icon={Home} roomLabel="Salón" title="ANUNCIO DEMO · 3 HAB." generatingLabel="Vídeo IA generándose" processingLabel="Procesando fotos … 75 %" />
            </div>
          </div>
        </div>
      </section>

      {/* ── What is AI video for real estate ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">¿Qué es el vídeo IA inmobiliario?</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            Es un vídeo de presentación de la propiedad creado automáticamente por inteligencia artificial en
            lugar de un equipo de cámaras. Le das a somevideopost.com el enlace de un anuncio o subes fotos de
            la propiedad, y la IA construye un vídeo que recorre las habitaciones en una secuencia natural,
            añadiendo movimiento de cámara cinematográfico, transiciones y música de fondo, y luego genera un
            texto adaptado al anuncio.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Importa porque los anuncios con vídeo consiguen constantemente más visitas y engagement que los que
            solo tienen fotos — pero contratar a un videógrafo para cada propiedad es lento y caro. El vídeo IA
            da a agentes, agencias y administradores de fincas una forma de añadir vídeo a cada anuncio, no solo
            a los principales.
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300">
              <Wand2 size={12} /> Cómo funciona
            </span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">Del anuncio al vídeo en tres pasos</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Step n="Paso 1" icon={Link2} title="Pega el enlace de tu anuncio" desc="La IA obtiene las fotos, título, precio, tamaño y ubicación de tu anuncio existente — o sube tus propias fotos de la propiedad." />
            <Step n="Paso 2" icon={Camera} title="La IA construye el recorrido" desc="La propiedad se secuencia habitación por habitación con movimiento de cámara, transiciones y música, adaptado al número de fotos que aportes." />
            <Step n="Paso 3" icon={Megaphone} title="Publica o descarga" desc="Comparte directamente en tus redes sociales, insértalo en tu página de anuncio, o descárgalo en 9:16, 1:1 o 16:9 para donde comercialices la propiedad." />
          </div>
        </div>
      </section>

      {/* ── Benefits for agents ── */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Diseñado para agentes, agencias y administradores de fincas</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">Dale a cada anuncio marketing de calidad vídeo, no solo a tus mejores propiedades.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <BenefitCard icon={Rocket} title="Anuncia con vídeo desde el primer día" desc="Genera un vídeo en el momento en que un anuncio se publica, en lugar de esperar la agenda de un videógrafo." accent="bg-orange-500/15 text-orange-400" />
            <BenefitCard icon={Building} title="Funciona con cualquier tipo de propiedad" desc="Apartamentos, casas, obra nueva y alquileres vacacionales — la IA se adapta a las habitaciones y fotos que le des." accent="bg-blue-500/15 text-blue-400" />
            <BenefitCard icon={KeyRound} title="Escala en toda tu cartera" desc="Produce un vídeo para cada anuncio, no solo para los principales, sin aumentar tu presupuesto de marketing por propiedad." accent="bg-emerald-500/15 text-emerald-400" />
            <BenefitCard icon={Video} title="Destaca frente a los anuncios de solo fotos" desc="Los anuncios con vídeo captan más atención en feeds y portales saturados que un carrusel de fotos estático." accent="bg-violet-500/15 text-violet-400" />
            <BenefitCard icon={ShieldCheck} title="Tú controlas los detalles" desc="Eliges qué se muestra y cómo se titula antes de publicar — nada se publica automáticamente." accent="bg-pink-500/15 text-pink-400" />
            <BenefitCard icon={Sparkles} title="Listo para redes y portales" desc="Exporta vídeo vertical para Reels y TikTok, y panorámico para tu web o portal, a partir de un solo vídeo generado." accent="bg-yellow-500/15 text-yellow-400" />
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-bold text-white md:text-4xl">Casos de uso inmobiliario</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { title: "Anuncios de \"recién publicado\"", desc: "Publica un vídeo cinematográfico el mismo día que sale un anuncio nuevo, en lugar de días o semanas después." },
              { title: "Teasers de puertas abiertas", desc: "Genera un vídeo corto para promocionar una próxima jornada de puertas abiertas en redes sociales." },
              { title: "Anuncios de apartamentos y alquiler", desc: "Centrado en interiores y distribución — consulta nuestra guía dedicada de vídeo IA para apartamentos." },
              { title: "Marketing de casas de vacaciones y alquiler de corta estancia", desc: "Convierte un anuncio de una web de reservas en un vídeo de presentación sin una sesión de fotos dedicada." },
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
            <h2 className="text-3xl font-bold text-white md:text-4xl">Preguntas frecuentes</h2>
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

      <UseCaseLinks current="/ai-video-for-real-estate" locale="es" />

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20 text-white" style={{ background: "linear-gradient(135deg, #040a1c 0%, #0a1f4d 100%)" }}>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Dale a tu próximo anuncio un vídeo IA</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">
            Pega el enlace de tu anuncio y previsualiza el vídeo gratis — publica o descarga cuando estés satisfecho.
          </p>
          <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-[0_0_35px_rgba(255,107,74,0.4)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
            Comenzar <ArrowRight size={18} />
          </Link>
          <p className="mt-4 text-sm text-slate-400">
            Consulta nuestros <Link href="/es/priser" className="text-blue-300 underline-offset-2 hover:underline">precios</Link>, lee
            {" "}<Link href="/es/hvorfor-somevideopost" className="text-blue-300 underline-offset-2 hover:underline">por qué los anfitriones eligen somevideopost.com</Link>, o
            visita el <Link href="/blog" className="text-blue-300 underline-offset-2 hover:underline">blog</Link>.
          </p>
        </div>
      </section>

      <SiteFooter locale="es" />
    </div>
  );
}
