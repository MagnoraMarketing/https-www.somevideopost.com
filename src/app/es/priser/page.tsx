import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles, CreditCard, Video, Wand2, Share2, Home } from "lucide-react";
import { currencyForLocale, formatPriceKey, MONTHLY_POST_CREDITS } from "@/lib/currency";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { VideoPreviewMockup } from "@/components/seo/video-preview-mockup";

const BASE = "https://www.somevideopost.com";

export const metadata: Metadata = {
  title: "Precios — SOME VIDEO POST | Vídeo IA y redes sociales para anfitriones",
  description:
    "Precios simples para somevideopost.com: 10 €/mes por acceso al estudio con publicaciones IA y publicación directa en redes sociales, y 14 € por vídeo de presentación — paga solo por los vídeos que uses. Sin compromiso.",
  keywords:
    "precios somevideopost, precio vídeo IA, marketing redes sociales alquiler, precio marketing alquiler vacacional, precio vídeo de presentación",
  alternates: {
    canonical: `${BASE}/es/priser`,
    languages: {
      da: `${BASE}/priser`,
      en: `${BASE}/en/priser`,
      es: `${BASE}/es/priser`,
      de: `${BASE}/de/priser`,
      "x-default": `${BASE}/priser`,
    },
  },
  openGraph: {
    title: "Precios — SOME VIDEO POST",
    description:
      "10 €/mes por acceso al estudio con publicaciones IA y publicación directa, y 14 € por vídeo de presentación. Paga solo por lo que uses. Sin compromiso.",
    type: "website",
    siteName: "somevideopost.com",
    locale: "es_ES",
    url: `${BASE}/es/priser`,
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

export default function PriserEsPage() {
  const currency = currencyForLocale("es");
  const subscriptionPrice = formatPriceKey("subscription", currency);
  const videoPrice = formatPriceKey("video", currency);
  const postPrice = formatPriceKey("aiPost", currency, { decimals: true });

  return (
    <div className="min-h-screen text-slate-100" style={{ background: "#050d24" }}>
      <SiteHeader active="pricing" locale="es" />

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/5" style={{ background: "linear-gradient(135deg, #040a1c 0%, #071233 55%, #0a1f4d 100%)" }}>
        <div className="absolute left-0 top-0 h-64 w-64 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #4d8dff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-blue-400/20" style={{ boxShadow: "0 0 80px rgba(59,130,246,0.2)" }} />
        <div className="relative mx-auto max-w-4xl px-6 py-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-200">
            <CreditCard size={13} /> Precios simples y transparentes
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Paga solo por lo que uses
          </h1>
          <p className="mt-4 text-base text-slate-300 max-w-xl mx-auto">
            El acceso al estudio por {subscriptionPrice}/mes te da publicaciones IA y publicación directa en redes sociales. Los vídeos de presentación se facturan por vídeo — {videoPrice} — así que solo pagas por los vídeos que realmente haces. Sin compromiso.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16 space-y-16">

        {/* Pricing cards */}
        <div className="grid items-start gap-6 md:grid-cols-2">

          {/* Studio access — subscription */}
          <div className="relative flex flex-col rounded-2xl border border-blue-400/50 bg-white/[0.05] p-8 shadow-[0_0_45px_rgba(59,130,246,0.25)] backdrop-blur-sm">
            <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-lg bg-blue-500/15 px-2.5 py-1 text-xs font-semibold text-blue-300">
              <Sparkles size={12} /> Acceso al estudio
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">{subscriptionPrice}</span>
              <span className="text-slate-400 text-sm">/mes</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Facturación mensual · sin compromiso</p>
            <p className="mt-3 text-sm text-slate-300">
              Acceso a todo el estudio: genera publicaciones IA y compártelas directamente en tus redes sociales.
            </p>
            <ul className="my-6 flex flex-col gap-2.5">
              <CheckItem><strong className="text-white">{MONTHLY_POST_CREDITS} publicaciones IA</strong> incluidas cada mes ({postPrice}/publicación)</CheckItem>
              <CheckItem>Comparte publicaciones directamente en Facebook e Instagram</CheckItem>
              <CheckItem>Todas las herramientas del estudio y descargas en todos los formatos</CheckItem>
              <CheckItem>Crea vídeos de presentación (se pagan por vídeo)</CheckItem>
              <CheckItem>Blog, guías y nuevas funciones continuamente</CheckItem>
            </ul>
            <div className="mt-auto">
              <Link
                href="/signup"
                className="block w-full rounded-xl py-3 text-center text-sm font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #1e4f9a, #4d8dff)" }}
              >
                Comenzar
              </Link>
            </div>
          </div>

          {/* Presentation video — pay per use */}
          <div className="flex flex-col rounded-2xl border border-orange-500/25 bg-orange-500/[0.06] p-8 backdrop-blur-sm">
            <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-lg bg-orange-500/15 px-2.5 py-1 text-xs font-semibold text-orange-400">
              <Video size={12} /> Vídeo de presentación
            </div>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">{videoPrice}</span>
              <span className="text-slate-400 text-sm">/ ud.</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Pago por uso · sin suscripción de vídeo</p>
            <p className="mt-3 text-sm text-slate-300">
              Un vídeo de presentación cinematográfico generado por IA de tu propiedad — paga solo cuando lo uses.
            </p>
            <ul className="my-6 flex flex-col gap-2.5">
              <CheckItem><strong className="text-white">{videoPrice} por vídeo</strong> — sin compromiso, sin cargos ocultos</CheckItem>
              <CheckItem>Pega el enlace de un anuncio — la IA construye el vídeo por ti</CheckItem>
              <CheckItem>Vídeo cinematográfico 9:16 listo para Reels y TikTok</CheckItem>
              <CheckItem>Míralo en vista previa, paga solo cuando estés satisfecho</CheckItem>
              <CheckItem>Descarga y comparte directamente una vez desbloqueado</CheckItem>
            </ul>
            <div className="mt-auto">
              <Link
                href="/signup"
                className="block w-full rounded-xl py-3 text-center text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: ORANGE_GRADIENT }}
              >
                Crea tu primer vídeo
              </Link>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-blue-400/20 bg-blue-500/[0.06] p-6 md:p-8 backdrop-blur-sm">
          <h2 className="text-lg font-bold text-white mb-6">Cómo funciona</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Sparkles, title: "1 · Consigue acceso al estudio", desc: `Por ${subscriptionPrice}/mes obtienes acceso al estudio y ${MONTHLY_POST_CREDITS} publicaciones IA cada mes.` },
              { icon: Wand2, title: "2 · Crea publicaciones y vídeos", desc: `Genera publicaciones incluidas en tu acceso, y crea vídeos de presentación por ${videoPrice} cada uno según lo necesites.` },
              { icon: Share2, title: "3 · Comparte directamente", desc: "Comparte publicaciones y vídeos directamente en Facebook e Instagram desde el panel." },
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
          <h2 className="text-xl font-bold text-white mb-6">Preguntas frecuentes</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                q: "¿Qué incluye el acceso al estudio?",
                a: `El acceso al estudio por ${subscriptionPrice}/mes te da ${MONTHLY_POST_CREDITS} publicaciones IA al mes, publicación directa en redes sociales y todas las herramientas del estudio. Los vídeos de presentación se pagan aparte, por vídeo.`,
              },
              {
                q: "¿Cuánto cuesta un vídeo de presentación?",
                a: `Un vídeo de presentación cuesta ${videoPrice} cada uno. Solo pagas por los vídeos que haces — no hay suscripción de vídeo.`,
              },
              {
                q: "¿Cuándo pago por un vídeo?",
                a: "Puedes ver una vista previa mientras se construye el vídeo, y solo pagas cuando quieras desbloquear el vídeo completo para descargarlo y compartirlo. Subir fotos no cuesta nada.",
              },
              {
                q: "¿Puedo compartir directamente en redes sociales?",
                a: "Sí. Con acceso al estudio, compartes publicaciones y vídeos directamente en Facebook e Instagram desde el panel.",
              },
              {
                q: "¿Qué pasa cuando se acaban mis publicaciones mensuales?",
                a: `Tu acceso te da ${MONTHLY_POST_CREDITS} publicaciones IA al mes. El saldo se recarga automáticamente cada mes mientras tu suscripción esté activa.`,
              },
              {
                q: "¿Hay compromiso de permanencia?",
                a: "No. El acceso al estudio es mensual sin compromiso, y puedes cancelar cuando quieras. Los vídeos solo se pagan cuando los usas.",
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
              <span className="mb-3 inline-block rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-orange-400">Demo en vivo</span>
              <h2 className="text-2xl font-bold mb-3">Mira cómo es un vídeo de presentación</h2>
              <p className="text-sm leading-relaxed text-slate-300 mb-5 max-w-md">
                Así es un vídeo de presentación generado por IA. Pega el enlace de tu anuncio — la IA obtiene las fotos, construye la secuencia de tomas y entrega un vídeo cinematográfico en 9:16 listo para Reels y TikTok.
              </p>
              <ul className="flex flex-col gap-2 text-sm text-slate-300">
                <CheckItem><span className="text-slate-300">Una vista previa real de tu vídeo generado</span></CheckItem>
                <CheckItem><span className="text-slate-300">Movimiento de cámara y transiciones añadidos automáticamente</span></CheckItem>
                <CheckItem><span className="text-slate-300">Listo en menos de 15 minutos</span></CheckItem>
              </ul>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-[300px]">
                <div className="absolute inset-0 scale-90 rounded-[2.5rem] opacity-40 blur-2xl" style={{ background: ORANGE_GRADIENT }} />
                <div className="relative">
                  <VideoPreviewMockup icon={Home} roomLabel="Salón" title="TU PROPIEDAD · DEMO" generatingLabel="Vídeo IA generándose" processingLabel="Procesando fotos … 75%" />
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
            <h2 className="text-2xl font-bold mb-2">¿Listo para empezar?</h2>
            <p className="text-slate-300 text-sm mb-6 max-w-md mx-auto">
              Empieza con somevideopost.com hoy. Sin compromiso.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="rounded-xl px-6 py-3 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90"
                style={{ background: ORANGE_GRADIENT }}
              >
                Crear cuenta
              </Link>
              <a
                href="mailto:mail@somevideopost.com"
                className="rounded-xl border border-white/25 bg-white/5 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition"
              >
                Contactar ventas
              </a>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter locale="es" />
    </div>
  );
}
