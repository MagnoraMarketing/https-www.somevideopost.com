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
const PAGE_URL = `${BASE}/es/some-ai-video`;
const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

export const metadata: Metadata = {
  title: "Vídeo IA para Redes Sociales: Crea Vídeo con IA para Redes Sociales | somevideopost.com",
  description:
    "El vídeo IA para redes sociales convierte un enlace o unas fotos en un vídeo que engancha — listo para Instagram Reels, TikTok, Facebook y LinkedIn en minutos. Descubre cómo funciona y pruébalo gratis.",
  keywords:
    "vídeo IA redes sociales, vídeo IA para Instagram, vídeo generado por IA, vídeo IA TikTok, generador de vídeo redes sociales, somevideopost vídeo IA",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      en: `${BASE}/some-ai-video`,
      da: `${BASE}/da/some-ai-video`,
      es: PAGE_URL,
      de: `${BASE}/de/some-ai-video`,
      "x-default": `${BASE}/some-ai-video`,
    },
  },
  openGraph: {
    title: "Vídeo IA para Redes Sociales: Crea Vídeo con IA para Redes Sociales",
    description:
      "Convierte un enlace o fotos en un vídeo social que engancha en minutos — listo para Instagram, TikTok, Facebook y LinkedIn, con movimientos de cámara, música y texto generados por IA.",
    type: "website",
    siteName: "somevideopost.com",
    locale: "es_ES",
    url: PAGE_URL,
  },
};

const FAQ = [
  {
    q: "¿Qué es el vídeo IA para redes sociales?",
    a: "El vídeo IA para redes sociales es contenido de vídeo generado automáticamente por inteligencia artificial para plataformas como Instagram, TikTok, Facebook y LinkedIn. En somevideopost.com, pegas un enlace o subes fotos, y la IA añade movimiento de cámara, transiciones, música y un texto — produciendo un vídeo listo para publicar sin grabar ni editar.",
  },
  {
    q: "¿En qué se diferencia de un vídeo con plantilla?",
    a: "Las herramientas de plantillas reutilizan la misma animación estática para cada subida. La IA de somevideopost.com analiza tus fotos o anuncio reales y construye una secuencia única — eligiendo el orden de las tomas, el movimiento y el ritmo para esa propiedad o tema concreto — y luego escribe un texto a juego, así que no hay dos vídeos que parezcan copiados.",
  },
  {
    q: "¿Para qué redes sociales está optimizado?",
    a: "Cada vídeo se genera pensado para redes sociales y se puede exportar en 9:16 para Instagram Reels, TikTok y YouTube Shorts, 1:1 para publicaciones de feed, y 16:9 para YouTube y webs — así el mismo material fuente obtiene la forma correcta para cada canal.",
  },
  {
    q: "¿Necesito saber editar vídeo?",
    a: "No. Todo el sentido del vídeo IA para redes sociales es que no tocas una línea de tiempo ni software de edición. Tú aportas la entrada — un enlace o fotos — y la IA se encarga de la selección de tomas, el movimiento, la música y el texto automáticamente.",
  },
  {
    q: "¿Puedo generar un vídeo IA para redes sociales gratis?",
    a: "Sí — puedes empezar a generar y previsualizar tu vídeo antes de pagar nada. Consulta nuestra guía dedicada sobre cómo generar vídeo IA gratis para conocer los pasos exactos y qué está incluido sin coste.",
  },
  {
    q: "¿Puedo publicar directamente en mis redes sociales?",
    a: "Sí. Conecta tus cuentas de Facebook, Instagram, TikTok, LinkedIn y YouTube una vez, y luego comparte o programa el vídeo terminado directamente desde el panel de somevideopost.com — o descárgalo y publícalo manualmente donde quieras.",
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

export default function SomeAiVideoEsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "somevideopost.com — Vídeo IA para Redes Sociales",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: PAGE_URL,
      description:
        "Herramienta de IA que convierte un enlace o fotos en un vídeo listo para redes sociales para Instagram, TikTok, Facebook y LinkedIn.",
      featureList: [
        "Vídeo generado por IA a partir de un enlace o fotos subidas",
        "Exportación en 9:16, 1:1 y 16:9 para cada plataforma",
        "Movimiento de cámara, transiciones y música automáticos",
        "Textos escritos por IA para cada plataforma",
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
        { "@type": "ListItem", position: 2, name: "Vídeo IA para Redes Sociales", item: PAGE_URL },
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
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100">
            <Share2 size={11} className="text-orange-300" /> Vídeo IA para Redes Sociales
          </div>
          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
            Convierte cualquier enlace o fotos en un
            <br className="hidden sm:block" />{" "}
            <span style={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>vídeo social que engancha</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
            El vídeo IA para redes sociales es contenido de vídeo que la IA crea automáticamente para ti, listo
            para Instagram, TikTok, Facebook y LinkedIn. Pega un enlace o sube fotos, y somevideopost.com
            construye un clip cinematográfico con movimiento, música y texto en minutos. Sin grabar, sin editar.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
              Genera tu primer vídeo IA <ArrowRight size={16} />
            </Link>
            <Link href="/es/generate-ai-video-free" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 px-7 py-3.5 text-sm font-medium text-white hover:bg-blue-500/10 transition-colors">
              Pruébalo gratis
            </Link>
          </div>
        </div>
      </section>

      {/* ── What is SoMe AI video ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">¿Qué es el vídeo IA para redes sociales?</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            Es un vídeo generado automáticamente por inteligencia artificial, creado específicamente para feeds de
            redes sociales — a diferencia de un vídeo que grabas y editas a mano. En lugar de contratar a un
            videógrafo o aprender una app de edición, le das a somevideopost.com un punto de partida (un enlace
            de anuncio o un conjunto de fotos), y la IA hace el trabajo creativo: elige el orden de las tomas,
            añade movimiento de cámara y transiciones, le pone música y escribe un texto ajustado a la plataforma
            en la que vas a publicar.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Existe porque las redes sociales premian el vídeo sobre las imágenes estáticas — los Reels, TikTok y
            Shorts consiguen constantemente más alcance y tiempo de visualización que las publicaciones de foto —
            pero la mayoría de las personas que publican para una propiedad, una marca o un pequeño negocio no
            tienen tiempo, presupuesto o habilidad para producir vídeo con regularidad. El vídeo IA cierra esa brecha.
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
            <h2 className="text-3xl font-bold text-white md:text-4xl">De un enlace o fotos a un vídeo publicado</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Tres pasos, sin necesidad de software de edición.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Step n="Paso 1" icon={Link2} title="Pega un enlace o sube fotos" desc="Apunta somevideopost.com a tu anuncio, página de producto o unas fotos. La IA obtiene las imágenes y los detalles clave automáticamente." />
            <Step n="Paso 2" icon={Sparkles} title="La IA genera el vídeo" desc="Se añaden automáticamente movimiento de cámara, transiciones, música de fondo y un texto adaptado a la plataforma — puedes previsualizarlo antes de decidir desbloquearlo." />
            <Step n="Paso 3" icon={Share2} title="Publica o descarga" desc="Comparte directamente en Facebook, Instagram, TikTok, LinkedIn y YouTube desde el panel, prográmalo para más tarde, o descárgalo en el formato que necesites." />
          </div>
        </div>
      </section>

      {/* ── Formats per platform ── */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Diseñado para cada formato social</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Un vídeo IA, exportado en la forma que cada plataforma realmente necesita.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <BenefitCard icon={MonitorSmartphone} title="9:16 — Reels, TikTok y Shorts" desc="Vídeo vertical a pantalla completa, adaptado a las plataformas que más alcance orgánico generan hoy." accent="bg-pink-500/15 text-pink-400" />
            <BenefitCard icon={Music2} title="1:1 — Publicaciones de feed" desc="Recorte cuadrado optimizado para el feed de Instagram y Facebook, donde lo importante es captar la atención." accent="bg-violet-500/15 text-violet-400" />
            <BenefitCard icon={Globe} title="16:9 — YouTube y web" desc="Exportación panorámica lista para YouTube, publicaciones de vídeo en LinkedIn, o para insertar en tu propia web." accent="bg-blue-500/15 text-blue-400" />
          </div>
        </div>
      </section>

      {/* ── Why AI video wins on social ── */}
      <section className="py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Por qué el vídeo IA gana en redes sociales</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">La constancia publicando gana a la perfección ocasional — la IA hace posible la constancia.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <BenefitCard icon={Clock} title="Minutos, no días" desc="Sin sesión de fotos que programar, sin editor que informar. Pasa de un enlace o fotos a un vídeo terminado de una sentada." accent="bg-orange-500/15 text-orange-400" />
            <BenefitCard icon={TrendingUp} title="El vídeo gana a las fotos" desc="Los Reels, TikTok y Shorts superan habitualmente a las publicaciones estáticas — el vídeo IA te permite publicar vídeo siempre, no solo a veces." accent="bg-emerald-500/15 text-emerald-400" />
            <BenefitCard icon={Share2} title="Un recurso, cinco canales" desc="El mismo vídeo generado se exporta y comparte en Facebook, Instagram, TikTok, LinkedIn y YouTube desde un solo panel." accent="bg-blue-500/15 text-blue-400" />
            <BenefitCard icon={Wand2} title="No hace falta saber editar" desc="La IA se encarga del ritmo, las transiciones y la música, así que cualquiera del equipo puede publicar vídeo con aspecto profesional." accent="bg-violet-500/15 text-violet-400" />
            <BenefitCard icon={Video} title="Resultado constante" desc="Cada vídeo sigue el mismo nivel de calidad, así que tu feed se ve coherente aunque publiquen varias personas." accent="bg-pink-500/15 text-pink-400" />
            <BenefitCard icon={Megaphone} title="Texto incluido" desc="La IA escribe un texto que coincide con el vídeo y la plataforma, así una publicación está lista — no a medias — en el momento en que lo está el vídeo." accent="bg-yellow-500/15 text-yellow-400" />
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-bold text-white md:text-4xl">¿Quién usa el vídeo IA para redes sociales?</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { title: "Anfitriones de alquiler vacacional y apartamentos", desc: "Convierte un anuncio de un portal de reservas en un vídeo de presentación para Instagram y Facebook sin tocar una cámara." },
              { title: "Agentes inmobiliarios", desc: "Dale a cada anuncio nuevo un vídeo cinematográfico el mismo día que sale — consulta nuestra guía dedicada de vídeo IA inmobiliario." },
              { title: "Pequeños negocios y comercios locales", desc: "Publica fotos de producto o local y obtén un vídeo listo para compartir para el contenido semanal en redes." },
              { title: "Marketing que gestiona varios canales", desc: "Produce un lote de vídeos listos para cada plataforma sin informar a un editor externo para cada uno." },
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

      <UseCaseLinks current="/some-ai-video" locale="es" />

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20 text-white" style={{ background: "linear-gradient(135deg, #040a1c 0%, #0a1f4d 100%)" }}>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">¿Listo para crear tu primer vídeo IA?</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">
            Pega un enlace o sube fotos y mira tu vídeo IA en minutos — previsualiza gratis, publica cuando quieras.
          </p>
          <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-[0_0_35px_rgba(255,107,74,0.4)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
            Comenzar <ArrowRight size={18} />
          </Link>
          <p className="mt-4 text-sm text-slate-400">
            ¿Te interesan los precios? Consulta nuestros <Link href="/es/priser" className="text-blue-300 underline-offset-2 hover:underline">planes</Link>, lee
            {" "}<Link href="/es/hvorfor-somevideopost" className="text-blue-300 underline-offset-2 hover:underline">por qué los anfitriones eligen somevideopost.com</Link>, o
            visita el <Link href="/blog" className="text-blue-300 underline-offset-2 hover:underline">blog</Link>.
          </p>
        </div>
      </section>

      <SiteFooter locale="es" />
    </div>
  );
}
