"use client";

import { Check } from "lucide-react";
import { VIDEO_STYLE_LIST, DEFAULT_VIDEO_STYLE, type VideoStyleId } from "@/lib/video-styles";

/**
 * Video style picker.
 *
 * Cards are rendered from the central style table, so a new style appears here
 * the moment it is added there — nothing in this component names a style.
 */
export function StyleSelector({
  value,
  onChange,
  name = "video_style",
}: {
  value: VideoStyleId;
  onChange: (id: VideoStyleId) => void;
  /** Hidden field name, so the choice submits with the existing form action. */
  name?: string;
}) {
  return (
    <div>
      <input type="hidden" name={name} value={value} />
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {VIDEO_STYLE_LIST.map((style) => {
          const active = style.id === value;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onChange(style.id)}
              aria-pressed={active}
              className={`group relative overflow-hidden rounded-xl border p-3 text-left transition-all ${
                active
                  ? "border-[#FF6B4A] bg-orange-50/60 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <span
                className="mb-2 block h-1.5 w-10 rounded-full"
                style={{ background: `linear-gradient(90deg, ${style.accent.from}, ${style.accent.to})` }}
              />
              <span className={`block text-xs font-bold uppercase tracking-wide ${active ? "text-[#FF6B4A]" : "text-slate-900"}`}>
                {style.name}
              </span>
              <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">
                {style.description}
              </span>
              {active && (
                <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF6B4A]">
                  <Check size={10} className="text-white" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Compact "Video style / Mediterranean / Warm · Sunny · Relaxed" readout. */
export function SelectedStyleBadge({ styleId }: { styleId: VideoStyleId }) {
  const style = VIDEO_STYLE_LIST.find((s) => s.id === styleId)
    ?? VIDEO_STYLE_LIST.find((s) => s.id === DEFAULT_VIDEO_STYLE)!;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <span
        className="h-8 w-1.5 shrink-0 rounded-full"
        style={{ background: `linear-gradient(180deg, ${style.accent.from}, ${style.accent.to})` }}
      />
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Videostil</p>
        <p className="text-sm font-bold text-slate-900">{style.name}</p>
        <p className="text-xs text-slate-500">{style.description}</p>
      </div>
    </div>
  );
}
