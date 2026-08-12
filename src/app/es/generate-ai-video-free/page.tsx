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
const PAGE_URL = `${BASE}/es/generate-ai-video-free`;
const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

export const metadata: Metadata = {
  title: "Generar Vídeo IA Gratis: Cómo Crear Tu Primer Vídeo Sin Coste | somevideopost.com",
  description:
    "Puedes generar y previsualizar un vídeo IA en somevideopost.com gratis — sin tarjeta para empezar. Descubre exactamente qué es gratis, cuánto cuesta desbloquear un vídeo completo y cómo funciona todo el proceso.",
  keywords:
    "generar vídeo IA gratis, generador de vídeo IA gratis, vídeo IA sin coste, crear vídeo IA gratis, creador de vídeo IA gratuito, prueba gratis generador de vídeo IA",
  alternates: {
    canonical: PAGE_URL,
    languages: {
      en: `${BASE}/generate-ai-video-free`,
      da: `${BASE}/da/generate-ai-video-free`,
      es: PAGE_URL,
      de: `${BASE}/de/generate-ai-video-free`,
      "x-default": `${BASE}/generate-ai-video-free`,
    },
  },
  openGraph: {
    title: "Generar Vídeo IA Gratis: Cómo Crear Tu Primer Vídeo Sin Coste",
    description:
      "Genera y previsualiza un vídeo IA en somevideopost.com gratis — sin tarjeta para empezar.",
    type: "website",
    siteName: "somevideopost.com",
    locale: "es_ES",
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

export default function GenerateAiVideoFreeEsPage() {
  const currency = currencyForLocale("es");
  const videoPrice = formatPriceKey("video", currency);
  const subscriptionPrice = formatPriceKey("subscription", currency);

  const FAQ = [
    {
      q: "¿De verdad puedo generar un vídeo IA gratis?",
      a: `Sí. En somevideopost.com pegas el enlace de un anuncio o subes fotos, y la IA genera y previsualiza un vídeo completo gratis — sin tarjeta para empezar. Solo pagas (${videoPrice}) si eliges desbloquear el vídeo para descargarlo y compartirlo.`,
    },
    {
      q: "¿Qué es exactamente gratis, y qué cuesta dinero?",
      a: `Generar el vídeo y ver la vista previa mientras se construye es gratis. Desbloquear el vídeo terminado — para poder descargarlo o publicarlo — cuesta ${videoPrice} por vídeo, cobrado una sola vez, cuando decides desbloquearlo. No se requiere suscripción solo para hacer un vídeo.`,
    },
    {
      q: "¿Hay truco, como una marca de agua o un límite de tiempo?",
      a: `La vista previa gratuita tiene marca de agua y no se puede descargar, así que queda claro que es una vista previa — pero es una vista previa real de tu vídeo generado, no una muestra genérica. Pagar ${videoPrice} elimina la marca de agua y desbloquea el vídeo a resolución completa para descargar y compartir, así que siempre sabes exactamente qué obtienes antes de decidir desbloquearlo.`,
    },
    {
      q: "¿Necesito una tarjeta de crédito para empezar a generar?",
      a: "No. Puedes crear una cuenta y generar tu primera vista previa sin introducir datos de pago. Solo se necesita pagar si eliges desbloquear un vídeo o suscribirte al acceso al estudio.",
    },
    {
      q: "¿Cuál es la diferencia entre la vista previa gratuita y el acceso al estudio?",
      a: `Generar y previsualizar un vídeo es gratis y luego se paga por vídeo (${videoPrice} cada uno). El acceso al estudio es una suscripción aparte y opcional de ${subscriptionPrice}/mes que desbloquea publicaciones sociales generadas por IA y publicación directa en Facebook e Instagram — no lo necesitas solo para hacer un vídeo.`,
    },
    {
      q: "¿Puedo generar más de una vista previa gratis?",
      a: "Sí — puedes generar una nueva vista previa para cualquier anuncio o conjunto de fotos que añadas. Lo gratis es generar y previsualizar; el coste por vídeo solo se aplica cuando desbloqueas un vídeo concreto para descargarlo o compartirlo.",
    },
    {
      q: "¿Qué puedo hacer con el vídeo una vez desbloqueado?",
      a: "Descárgalo en 9:16, 1:1 o 16:9, o publícalo directamente en Facebook, Instagram, TikTok, LinkedIn y YouTube desde el panel — es tuyo para usarlo como quieras.",
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "Cómo generar un vídeo IA gratis",
      description: "Pasos para generar y previsualizar un vídeo generado por IA en somevideopost.com sin pagar nada por adelantado.",
      step: [
        { "@type": "HowToStep", name: "Crea una cuenta gratis", text: "Regístrate sin necesidad de tarjeta." },
        { "@type": "HowToStep", name: "Pega un enlace o sube fotos", text: "Apunta somevideopost.com a tu anuncio o sube tus propias fotos." },
        { "@type": "HowToStep", name: "Previsualiza tu vídeo IA gratis", text: "Mira cómo se genera el vídeo con IA y previsualízalo sin coste." },
        { "@type": "HowToStep", name: "Desbloquea, descarga o publica", text: `Paga solo si eliges desbloquear el vídeo final (${videoPrice}) para descargarlo o publicarlo.` },
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
        { "@type": "ListItem", position: 2, name: "Generar Vídeo IA Gratis", item: PAGE_URL },
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
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100">
            <Gift size={11} className="text-orange-300" /> Generar Vídeo IA Gratis
          </div>
          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
            Sí — puedes generar un
            {" "}<span style={{ background: ORANGE_GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>vídeo IA gratis</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
            somevideopost.com te permite generar y previsualizar un vídeo IA real antes de pagar nada. Sin
            tarjeta para empezar. Solo pagas ({videoPrice}) si decides desbloquear el vídeo terminado para
            descargarlo o publicarlo.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
              Genera tu vista previa gratis <ArrowRight size={16} />
            </Link>
            <Link href="/es/priser" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 px-7 py-3.5 text-sm font-medium text-white hover:bg-blue-500/10 transition-colors">
              Ver todos los precios
            </Link>
          </div>
        </div>
      </section>

      {/* ── What's free ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">¿Qué incluye realmente &ldquo;gratis&rdquo;?</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            La mayoría de las herramientas que prometen un &ldquo;vídeo IA gratis&rdquo; requieren tarjeta de
            crédito por adelantado, esconden el resultado tras un muro de pago hasta que pagas, o solo te dejan
            generar una vista previa de baja calidad que no refleja el resultado real. somevideopost.com
            funciona de otra forma: generas el vídeo real y lo ves construirse en el panel, totalmente gratis —
            decides después si desbloquearlo.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-400/25 bg-emerald-500/[0.06] p-6">
              <p className="mb-4 flex items-center gap-2 text-sm font-bold text-emerald-400"><CheckCircle2 size={16} /> Gratis, sin tarjeta necesaria</p>
              <ul className="flex flex-col gap-2.5 text-sm text-slate-300">
                <li>Crear una cuenta</li>
                <li>Pegar un enlace o subir fotos</li>
                <li>La IA genera tu vídeo</li>
                <li>Ver una vista previa con marca de agua construirse</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-orange-400/25 bg-orange-500/[0.06] p-6">
              <p className="mb-4 flex items-center gap-2 text-sm font-bold text-orange-400"><XCircle size={16} /> De pago, solo si lo quieres</p>
              <ul className="flex flex-col gap-2.5 text-sm text-slate-300">
                <li>Desbloquear el vídeo final ({videoPrice} por vídeo)</li>
                <li>Descargarlo en resolución completa</li>
                <li>Publicarlo en tus redes sociales</li>
                <li>Acceso al estudio opcional para publicaciones IA ({subscriptionPrice}/mes)</li>
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
              <Wand2 size={12} /> Cómo funciona
            </span>
            <h2 className="text-3xl font-bold text-white md:text-4xl">Genera tu vídeo IA gratis en cuatro pasos</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Step n="Paso 1" icon={Sparkles} title="Crea una cuenta gratis" desc="Regístrate en segundos — sin tarjeta de crédito necesaria para empezar." />
            <Step n="Paso 2" icon={Link2} title="Pega un enlace o sube fotos" desc="Apunta somevideopost.com a un anuncio, página de producto o tus propias fotos." />
            <Step n="Paso 3" icon={Eye} title="Previsualiza tu vídeo gratis" desc="Mira cómo la IA genera tu vídeo real y previsualízalo — con marca de agua, sin coste — directamente en el panel." />
            <Step n="Paso 4" icon={Download} title="Desbloquea, descarga o publica" desc={`¿Te gusta? Desbloquea el vídeo por ${videoPrice} para descargarlo o publicarlo en tus redes sociales.`} />
          </div>
        </div>
      </section>

      {/* ── Why it's structured this way ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-4xl">¿Por qué pagar solo después de ver el resultado?</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-300">
            Generar vídeo con IA cuesta tiempo de computación, y la mayoría de las herramientas lo cubren
            poniendo todo tras una suscripción antes de que hayas visto un solo resultado. somevideopost.com le
            da la vuelta: ves exactamente lo que obtienes — tu vídeo real, no una muestra genérica — antes de
            gastar nada. Si no quieres quedártelo, simplemente no lo desbloqueas.
          </p>
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-blue-400/20 bg-blue-500/[0.06] p-5">
            <Share2 size={18} className="mt-0.5 shrink-0 text-blue-300" />
            <p className="text-sm leading-relaxed text-slate-300">
              Una vez desbloqueado, cada vídeo se puede compartir directamente en Facebook, Instagram, TikTok,
              LinkedIn y YouTube desde el panel, o descargarse en 9:16, 1:1 y 16:9 para donde más lo necesites.
            </p>
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

      <UseCaseLinks current="/generate-ai-video-free" locale="es" />

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-20 text-white" style={{ background: "linear-gradient(135deg, #040a1c 0%, #0a1f4d 100%)" }}>
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 60px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Pruébalo — no cuesta nada ver tu vídeo</h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-300">
            Crea una cuenta gratis, pega un enlace o sube fotos, y previsualiza tu vídeo IA hoy mismo.
          </p>
          <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white shadow-[0_0_35px_rgba(255,107,74,0.4)] transition-opacity hover:opacity-90" style={{ background: ORANGE_GRADIENT }}>
            Comenzar gratis <ArrowRight size={18} />
          </Link>
          <p className="mt-4 text-sm text-slate-400">
            Consulta todos los <Link href="/es/priser" className="text-blue-300 underline-offset-2 hover:underline">detalles de precios</Link>, lee
            {" "}<Link href="/es/hvorfor-somevideopost" className="text-blue-300 underline-offset-2 hover:underline">por qué los anfitriones eligen somevideopost.com</Link>, o
            visita el <Link href="/blog" className="text-blue-300 underline-offset-2 hover:underline">blog</Link>.
          </p>
        </div>
      </section>

      <SiteFooter locale="es" />
    </div>
  );
}
