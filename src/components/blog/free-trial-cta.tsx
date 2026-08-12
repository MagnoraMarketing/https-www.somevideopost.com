import Link from "next/link";
import { Gift, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import type { Locale } from "@/lib/i18n";

const COPY: Record<Locale, {
  eyebrow: string;
  heading: string;
  body: string;
  bullets: string[];
  button: string;
}> = {
  da: {
    eyebrow: "Gratis testkonto",
    heading: "Prøv somevideopost.com helt gratis",
    body: "Opret en gratis testkonto og få 2 gratis SOME-opslag med det samme — intet kreditkort påkrævet.",
    bullets: ["2 gratis opslag ved oprettelse", "Intet kreditkort krævet", "Klar på under 2 minutter"],
    button: "Opret gratis testkonto",
  },
  en: {
    eyebrow: "Free test account",
    heading: "Try somevideopost.com for free",
    body: "Create a free test account and get 2 free social posts right away — no card required.",
    bullets: ["2 free posts on signup", "No card required", "Ready in under 2 minutes"],
    button: "Create free test account",
  },
  es: {
    eyebrow: "Cuenta de prueba gratis",
    heading: "Prueba somevideopost.com gratis",
    body: "Crea una cuenta de prueba gratuita y obtén 2 publicaciones sociales gratis al instante — sin tarjeta.",
    bullets: ["2 publicaciones gratis al registrarte", "Sin tarjeta de crédito", "Listo en menos de 2 minutos"],
    button: "Crear cuenta de prueba gratis",
  },
  de: {
    eyebrow: "Kostenloses Testkonto",
    heading: "Teste somevideopost.com kostenlos",
    body: "Erstelle ein kostenloses Testkonto und erhalte sofort 2 kostenlose Social-Posts — keine Kreditkarte nötig.",
    bullets: ["2 kostenlose Posts bei Anmeldung", "Keine Kreditkarte nötig", "Fertig in unter 2 Minuten"],
    button: "Kostenloses Testkonto erstellen",
  },
};

/**
 * Inviting, on-brand "free test account" CTA shown at the bottom of blog
 * pages. Copy is locale-aware; blog pages currently render Danish only, so
 * this defaults to "da" until the blog itself becomes locale-routed.
 */
export function FreeTrialCTA({ locale = "da" }: { locale?: Locale }) {
  const t = COPY[locale] ?? COPY.da;

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-8 text-white md:p-10"
      style={{ background: "linear-gradient(135deg, #1B3F7A 0%, #14306b 60%, #0d2050 100%)" }}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
        <div className="max-w-lg">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-orange-300/30 bg-orange-400/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-200">
            <Gift size={13} /> {t.eyebrow}
          </div>
          <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-[26px]">{t.heading}</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-blue-100">{t.body}</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 md:justify-start">
            {t.bullets.map((b) => (
              <li key={b} className="flex items-center gap-1.5 text-xs font-medium text-blue-100">
                <CheckCircle2 size={14} className="text-emerald-400" /> {b}
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/signup"
          className="group inline-flex shrink-0 items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,74,0.35)] transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
        >
          <Sparkles size={16} />
          {t.button}
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
