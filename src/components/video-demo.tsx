"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Loader2, CheckCircle2, ArrowRight, Link as LinkIcon, Volume2, VolumeX } from "lucide-react";
import { DEMO_PROPERTY } from "@/lib/demo-property";

type Stage = "idle" | "generating" | "done";

// Sample presentation video shown in the demo phone once "generation" finishes:
// the demo property's own video (src/lib/demo-property.ts). Until there is
// one, the neutral placeholder card below is shown instead.
const DEMO_VIDEO_URL = DEMO_PROPERTY.videoUrl;

const STEPS = [
  "Henter billeder fra din annonce...",
  "Analyserer boligens stil og features...",
  "Genererer video med AI...",
  "Tilføjer kamerabevægelser og overgange...",
  "Afsluttende touches...",
];

export function VideoDemo() {
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stepRef = useRef<NodeJS.Timeout | null>(null);
  const [muted, setMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  let domain = "";
  try { domain = new URL(url).hostname.replace(/^www\./, ""); } catch { /* partial url */ }

  function start() {
    if (!url.trim()) return;
    setStage("generating");
    setProgress(0);
    setStepIdx(0);

    // Progress: 0→100 over 5 seconds
    let elapsed = 0;
    intervalRef.current = setInterval(() => {
      elapsed += 50;
      const pct = Math.min(100, (elapsed / 5000) * 100);
      setProgress(pct);
      if (elapsed >= 5000) {
        clearInterval(intervalRef.current!);
        setStage("done");
      }
    }, 50);

    // Cycle through steps
    let si = 0;
    stepRef.current = setInterval(() => {
      si = Math.min(si + 1, STEPS.length - 1);
      setStepIdx(si);
    }, 1000);

    setTimeout(() => {
      clearInterval(stepRef.current!);
    }, 5000);
  }

  function reset() {
    clearInterval(intervalRef.current!);
    clearInterval(stepRef.current!);
    setStage("idle");
    setProgress(0);
    setStepIdx(0);
    setUrl("");
    setMuted(true);
    setVideoError(false);
  }

  useEffect(() => () => {
    clearInterval(intervalRef.current!);
    clearInterval(stepRef.current!);
  }, []);

  const payUrl = `/videos/new?booking_url=${encodeURIComponent(url)}`;

  return (
    <div className="mx-auto w-full max-w-xl">
      {stage === "idle" && (
        <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
          <p className="mb-3 text-sm font-semibold text-white">
            Prøv det nu — indsæt dit boliglink:
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && start()}
                placeholder="https://www.airbnb.com/rooms/..."
                className="w-full rounded-xl border border-white/20 bg-white/10 pl-8 pr-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-orange-400/60 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
              />
            </div>
            <button
              onClick={start}
              disabled={!url.trim()}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
            >
              <Sparkles size={14} /> Generer
            </button>
          </div>
          <p className="mt-2 text-xs text-white/40">Virker med Airbnb, Booking.com og andre platforme</p>
        </div>
      )}

      {stage === "generating" && (
        <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <Loader2 size={20} className="animate-spin text-orange-300" />
            <p className="text-sm font-semibold text-white">AI genererer din video...</p>
          </div>

          {/* Progress bar */}
          <div className="mb-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #FFB36B, #FF6B4A)",
              }}
            />
          </div>

          {/* Step text */}
          <p className="mb-4 text-xs text-white/60 min-h-[1.25rem]">
            {STEPS[stepIdx]}
          </p>

          {/* Fake frames */}
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-video rounded-lg overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, hsl(${210 + i * 20}, 60%, 30%), hsl(${20 + i * 15}, 80%, 50%))`,
                  opacity: progress > i * 25 ? 1 : 0.3,
                  transition: "opacity 0.5s",
                }}
              >
                <div className="h-full w-full flex items-center justify-center">
                  {progress > (i + 1) * 25 ? (
                    <CheckCircle2 size={14} className="text-white/80" />
                  ) : (
                    <div className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white/80 animate-spin" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-3 text-center text-xs text-white/40">
            {Math.round(progress)}% færdig
          </p>
        </div>
      )}

      {stage === "done" && (
        <div className="rounded-2xl border border-emerald-400/30 bg-white/10 p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/20">
              <CheckCircle2 size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Din video er klar!</p>
              <p className="text-xs text-white/50">
                {domain ? <>Genereret fra <span className="text-white/80">{domain}</span></> : "Sådan ser din præsentationsvideo ud"}
              </p>
            </div>
          </div>

          {/* Real video preview in a phone mockup */}
          {DEMO_VIDEO_URL && !videoError ? (
            <div className="mb-4 flex justify-center">
              <div className="relative w-[190px] overflow-hidden rounded-[2rem] border-4 border-white/10 bg-black shadow-2xl">
                <div className="pointer-events-none absolute left-1/2 top-2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />
                <video
                  ref={videoRef}
                  src={DEMO_VIDEO_URL}
                  autoPlay
                  loop
                  muted={muted}
                  playsInline
                  onError={() => setVideoError(true)}
                  className="aspect-[9/16] w-full object-cover"
                />
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
                  className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                >
                  {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-4 overflow-hidden rounded-xl border border-white/10" style={{ background: "linear-gradient(135deg, #1B3F7A, #FF6B4A)" }}>
              <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                <Sparkles size={22} className="text-white/80" />
                <p className="text-xs text-white/70">Din cinematiske præsentationsvideo</p>
              </div>
            </div>
          )}

          <a
            href={payUrl}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-slate-900 shadow-lg transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
          >
            <Sparkles size={15} /> Opret video <ArrowRight size={15} />
          </a>

          <button
            onClick={reset}
            className="mt-2 w-full text-center text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            Prøv med et andet link
          </button>
        </div>
      )}
    </div>
  );
}
