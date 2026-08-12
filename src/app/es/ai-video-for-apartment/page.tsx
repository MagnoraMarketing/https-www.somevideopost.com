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
const PAGE_URL = `${BASE}/es/ai-video-for-apartment`;
const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

export const metadata: Metadata = {
  title: "Vídeo IA para Apartamentos: Anuncios e Interiores | somevideopost.com",
  description:
    "El vídeo IA para apartamentos convierte fotos o el enlace de un anuncio en un vídeo de presentación centrado en el interior — diseñado para alquileres de apartamentos, administradores de fincas y anfitriones de estancias cortas.",
  keywords:
    "vídeo IA apartamento, generador de vídeo apartamento, vídeo IA interior apartamento, vídeo anuncio apartamento, vídeo marketing apartamento, vídeo IA alquiler apartamento, vídeo administración de fincas IA",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      en: `${BASE}/ai-video-for-apartment`,
      da: `${BASE}/da/ai-video-for-apartment`,
      es: PAGE_URL,
      de: `${BASE}/de/ai-video-for-apartment`,
      "x-default": `${BASE}/ai-video-for-apartment`,
    },
  },
  openGraph: {
    title: "Vídeo IA para Apartamentos: Anuncios e Interiores",
    description:
      "Convierte fotos de un apartamento o el enlace de un anuncio en un vídeo de presentación centrado en el interior en minutos — para alquileres, administradores de fincas y anfitriones de estancias cortas.",
    type: "website",
    siteName: "somevideopost.com",
    locale: "es_ES",
    url: PAGE_URL,
  },
};

const FAQ = [
  {
    q: "¿Qué es el vídeo IA para apartamentos?",
    a: "Es un vídeo de presentación generado automáticamente a partir de fotos de un apartamento o el enlace de un anuncio, con el ritmo y el movimiento de cámara ajustados a los espacios interiores — salón, cocina, dormitorios y baño — en lugar de zonas exteriores. somevideopost.com lo construye con lo que ya tienes: fotos o un anuncio, sin necesidad de grabar.",
  },
  {
    q: "¿Funciona para una sola unidad o para todo un edificio?",
    a: "Ambas cosas. Genera un vídeo para un solo anuncio de apartamento, o hazlo para cada unidad disponible en un edificio — cada vídeo se genera a partir de las fotos propias de esa unidad, así que no hay dos iguales.",
  },
  {
    q: "¿Y si solo tengo unas pocas fotos?",
    a: "No hay problema — la IA adapta el ritmo y el número de tomas del vídeo a la cantidad de fotos que aportes, ya sean 4 o 40. Más fotos suelen dar un recorrido más completo habitación por habitación, pero unas pocas bastan para un vídeo útil.",
  },
  {
    q: "¿Puedo usarlo para unidades amuebladas o sin amueblar?",
    a: "Sí. La IA trabaja con lo que muestren las fotos — amueblado, decorado o vacío — construyendo el movimiento de cámara y las transiciones alrededor de las imágenes reales que aportes, en lugar de una plantilla genérica.",
  },
  {
    q: "¿Es útil para empresas de administración de fincas con muchas unidades?",
    a: "Sí — está diseñado exactamente para eso. En lugar de presupuestar una sesión de vídeo por cada vacante, puedes generar un vídeo para cada unidad a medida que queda disponible, manteniendo cada anuncio actualizado sin un coste de producción recurrente.",
  },
  {
    q: "¿Puedo probarlo gratis antes de pagar por un vídeo de apartamento?",
    a: "Sí — puedes generar y previsualizar el vídeo antes de pagar nada. Consulta nuestra guía sobre cómo generar vídeo IA gratis para conocer los pasos exactos.",
  },
  {
    q: "¿Dónde puedo usar el vídeo terminado?",
    a: "Publícalo directamente en Facebook, Instagram, TikTok, LinkedIn y YouTube desde el panel, o descárgalo en 9:16, 1:1 o 16:9 para tu página de alquiler, portal inmobiliario o campañas de email.",
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

export default function AiVideoForApartmentEsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "somevideopost.com — Vídeo IA para Apartamentos",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: PAGE_URL,
      description:
        "Herramienta de IA que convierte fotos de un apartamento o el enlace de un anuncio en un vídeo de presentación centrado en el interior para alquileres, administradores de fincas y anfitriones de estancias cortas.",
      featureList: [
        "Vídeo generado por IA a partir de fotos de apartamento o un enlace de anuncio",
        "Movimiento de cámara y recorrido habitación por habitación centrado en el interior",
        "Funciona para una sola unidad o edificios enteros",
        "Exportación en 9:16, 1:1 y 16:9 para redes y páginas de anuncio",
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
        { "@type": "ListItem", position: 2, name: "Vídeo IA para Apartamentos", item: PAGE_URL },
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
                <Building2 size={11} className="text-orange-300" /> Vídeo IA para Apartamentos
              </div>
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                Fotos del apartamento dentro,
                {" "}<span style={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>vídeo del interior fuera</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-300">
                El vídeo IA para apartamentos convierte fotos del interior o el enlace de un anuncio en un vídeo
                de presentación que fluye de forma natural por el salón, la cocina, los dormitorios y el baño —
                diseñado para alquileres, administración de fincas y estancias cortas, listo en menos de 15 minutos.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
                  Crea un vídeo de apartamento <ArrowRight size={16} />
                </Link>
                <Link href="/es/generate-ai-video-free" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 px-7 py-3.5 text-sm font-medium text-white hover:bg-blue-500/10 transition-colors">
                  Pruébalo gratis
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <VideoPreviewMockup icon={Sofa} roomLabel="Cocina" title="APARTAMENTO 4B · DEMO" generatingLabel="Vídeo IA generándose" processingLabel="Procesando fotos … 75 %" />
            </div>
          </div>
        </div>
      </section>

      {/* ── What is AI video for apartments ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">¿Qué es el vídeo IA para apartamentos?</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            Es un vídeo de presentación construido automáticamente con lo que ya tienes — fotos de la unidad o
            un enlace a tu anuncio — con somevideopost.com añadiendo movimiento de cámara, transiciones y música
            ajustados a los espacios interiores. En lugar de tomas exteriores o de dron, el ritmo se centra en
            cómo fluye realmente una distribución: entrada, salón, cocina, dormitorios y baño.
          </p>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Está diseñado específicamente para anuncios de apartamentos porque el marketing de apartamentos vive
            o muere según lo bien que se transmita la distribución — y un scroll lento por un carrusel de fotos
            raramente lo consigue como puede hacerlo un vídeo corto tipo recorrido.
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
            <h2 className="text-3xl font-bold text-white md:text-4xl">De fotos del apartamento a vídeo en tres pasos</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Step n="Paso 1" icon={Link2} title="Añade fotos o el enlace de un anuncio" desc="Sube fotos del interior de la unidad, o pega el enlace a un anuncio existente para que la IA las obtenga automáticamente." />
            <Step n="Paso 2" icon={Sofa} title="La IA recorre la distribución" desc="El movimiento de cámara y las transiciones se secuencian habitación por habitación — salón, cocina, dormitorios, baño — con música añadida automáticamente." />
            <Step n="Paso 3" icon={DoorOpen} title="Publica o descarga" desc="Comparte directamente en tus redes sociales, o descárgalo en el formato que necesites para tu página de alquiler o portal." />
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Diseñado para alquiler de apartamentos y administración de fincas</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">Dale a cada unidad un vídeo, sin un presupuesto de producción por anuncio.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <BenefitCard icon={Timer} title="Alquila vacantes más rápido" desc="Consigue un vídeo publicado el mismo día en que una unidad queda disponible, en lugar de esperar la agenda de un fotógrafo." accent="bg-orange-500/15 text-orange-400" />
            <BenefitCard icon={Ruler} title="Muestra la distribución, no solo las habitaciones" desc="El recorrido secuenciado habitación por habitación da a los inquilinos una idea de cómo conecta realmente el espacio." accent="bg-blue-500/15 text-blue-400" />
            <BenefitCard icon={Building2} title="Escala en todo un edificio" desc="Genera un vídeo por unidad a medida que se abren vacantes, sin un coste de producción recurrente por anuncio." accent="bg-emerald-500/15 text-emerald-400" />
            <BenefitCard icon={Camera} title="Funciona con las fotos que tienes" desc="Amueblado, decorado o vacío — la IA se adapta a las imágenes que subas, sin necesidad de una sesión profesional." accent="bg-violet-500/15 text-violet-400" />
            <BenefitCard icon={ShieldCheck} title="Tú apruebas antes de publicar" desc="Previsualiza el vídeo antes de publicarlo o descargarlo — nada se publica sin tu revisión." accent="bg-pink-500/15 text-pink-400" />
            <BenefitCard icon={Video} title="Listo para cada canal" desc="Exporta vídeo vertical para Reels y TikTok, cuadrado para el feed, o panorámico para tu página o portal." accent="bg-yellow-500/15 text-yellow-400" />
          </div>
        </div>
      </section>

      {/* ── Use cases ── */}
      <section className="py-24" style={{ background: "#071130" }}>
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-bold text-white md:text-4xl">Casos de uso para apartamentos</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { title: "Anuncios de alquiler a largo plazo", desc: "Convierte fotos del interior en un vídeo que ayuda a un anuncio a destacar en portales de alquiler y redes sociales." },
              { title: "Alquiler de corta estancia y vacacional", desc: "Presenta el apartamento como los huéspedes navegan — un recorrido visual rápido en lugar de una cuadrícula de fotos." },
              { title: "Obra nueva y pre-alquiler", desc: "Comercializa unidades piloto o decoradas con vídeo antes de que un edificio esté totalmente ocupado." },
              { title: "Carteras de administración de fincas", desc: "Estandariza cómo se comercializa cada unidad vacante, una por una, a medida que cambia la disponibilidad." },
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

      <UseCaseLinks current="/ai-video-for-apartment" locale="es" />

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20 text-white" style={{ background: "linear-gradient(135deg, #040a1c 0%, #0a1f4d 100%)" }}>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Dale a tu próxima unidad vacante un vídeo</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">
            Sube fotos o pega el enlace de un anuncio y previsualiza tu vídeo de apartamento gratis.
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
