"use client";

import { useRef, useState } from "react";
import { Sparkles, Volume2, VolumeX } from "lucide-react";
import { DEMO_PROPERTY } from "@/lib/demo-property";

// The demo property's own presentation video (src/lib/demo-property.ts), shown
// in a 9:16 phone frame. DemoPhoneSwitcher only renders this when it exists.
const DEMO_VIDEO_URL = DEMO_PROPERTY.videoUrl ?? "";

export function DemoVideoPhone({
  label,
  startAt = 0,
  endAt,
}: {
  label?: string;
  /** Second to start (and loop back to) — skip an intro/exterior shot. */
  startAt?: number;
  /** Optional second to loop back at — keeps playback on a chosen segment. */
  endAt?: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative w-full overflow-hidden rounded-[2.5rem] border-4 border-white/10 bg-black shadow-2xl">
      {/* notch */}
      <div className="pointer-events-none absolute left-1/2 top-3 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />

      {!error ? (
        <video
          ref={videoRef}
          src={startAt > 0 ? `${DEMO_VIDEO_URL}#t=${startAt}` : DEMO_VIDEO_URL}
          autoPlay
          loop={!startAt && !endAt}
          muted={muted}
          playsInline
          onLoadedMetadata={(e) => { if (startAt > 0) e.currentTarget.currentTime = startAt; }}
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (endAt && v.currentTime >= endAt) v.currentTime = startAt;
          }}
          onEnded={(e) => {
            // Loop back to the chosen start instead of the intro frame.
            const v = e.currentTarget;
            v.currentTime = startAt;
            v.play().catch(() => {});
          }}
          onError={() => setError(true)}
          className="aspect-[9/16] w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[9/16] w-full flex-col items-center justify-center gap-3 text-center" style={{ background: "linear-gradient(160deg, #1B3F7A, #0f2347 55%, #FF6B4A)" }}>
          <Sparkles size={26} className="text-white/80" />
          <p className="px-6 text-sm text-white/80">Cinematisk præsentationsvideo — 9:16 til Reels & TikTok</p>
        </div>
      )}

      {/* Label chip */}
      {label && !error && (
        <div className="pointer-events-none absolute left-0 right-0 top-0 bg-gradient-to-b from-black/60 to-transparent p-3 pt-10">
          <span className="inline-block rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            {label}
          </span>
        </div>
      )}

      {/* Mute / unmute */}
      {!error && (
        <button
          type="button"
          onClick={() => {
            const v = videoRef.current;
            if (!v) return;
            v.muted = !v.muted;
            setMuted(v.muted);
            if (!v.muted) v.play().catch(() => {});
          }}
          aria-label={muted ? "Slå lyd til" : "Slå lyd fra"}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      )}
    </div>
  );
}
