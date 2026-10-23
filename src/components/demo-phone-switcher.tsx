"use client";

import { useState } from "react";
import { Film, Compass } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { DemoVideoPhone } from "@/components/demo-video-phone";
import { CinematicWalkthrough } from "@/components/walkthrough/cinematic-walkthrough";
import { DEMO_PROPERTY } from "@/lib/demo-property";

type View = "video" | "tour";

const LABELS: Record<Locale, { video: string; tour: string }> = {
  da: { video: "Rigtig video", tour: "Interaktiv tur" },
  en: { video: "Real video", tour: "Interactive tour" },
  es: { video: "Vídeo real", tour: "Tour interactivo" },
  de: { video: "Echtes Video", tour: "Interaktive Tour" },
};

export function DemoPhoneSwitcher({
  locale = "da",
  label,
  startAt,
  endAt,
}: {
  locale?: Locale;
  label?: string;
  startAt?: number;
  endAt?: number;
}) {
  const [view, setView] = useState<View>("video");
  const l = LABELS[locale] ?? LABELS.da;

  // Without a real video of the demo property there is nothing to toggle to:
  // show the interactive tour on its own rather than unrelated footage.
  if (!DEMO_PROPERTY.videoUrl) {
    return (
      <div className="flex w-full flex-col items-center gap-4">
        <CinematicWalkthrough locale={locale} />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* Toggle */}
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
        {([
          { key: "video" as View, icon: Film, text: l.video },
          { key: "tour" as View, icon: Compass, text: l.tour },
        ]).map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setView(opt.key)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              view === opt.key ? "text-slate-900" : "text-slate-400 hover:text-white"
            }`}
            style={view === opt.key ? { background: "linear-gradient(135deg, #FFB36B, #FF6B4A)" } : undefined}
          >
            <opt.icon size={13} /> {opt.text}
          </button>
        ))}
      </div>

      {view === "video"
        ? <DemoVideoPhone label={label} startAt={startAt} endAt={endAt} />
        : <CinematicWalkthrough locale={locale} />}
    </div>
  );
}
