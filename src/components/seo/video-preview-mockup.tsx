import { Link2, Sparkles, CheckCircle2, type LucideIcon } from "lucide-react";

const ORANGE_GRADIENT = "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)";

/**
 * Lightweight, fully-English hero mockup of the video-generation dashboard.
 * Used instead of CinematicWalkthrough, whose demo SVGs have Danish room
 * labels baked into the artwork and don't localize.
 */
export function VideoPreviewMockup({ icon: RoomIcon, roomLabel, title }: { icon: LucideIcon; roomLabel: string; title: string }) {
  return (
    <div className="relative mx-auto w-full max-w-sm select-none">
      <div className="absolute -inset-6 rounded-[2rem] bg-blue-500/20 blur-3xl" />
      <div
        className="relative rounded-2xl border border-blue-400/30 p-4"
        style={{ background: "#0a1430", boxShadow: "0 0 60px rgba(59,130,246,0.25), 0 25px 50px -12px rgba(0,0,0,0.6)" }}
      >
        <div className="mb-3 flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <div className="ml-3 h-4 flex-1 rounded bg-white/5" />
        </div>

        <div className="mb-4 flex items-center gap-3 rounded-xl bg-white/[0.04] p-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_0_14px_rgba(59,130,246,0.5)]">
            <Link2 size={15} />
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-[0_0_14px_rgba(255,107,74,0.45)]" style={{ background: ORANGE_GRADIENT }}>
            <Sparkles size={15} />
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.08] text-slate-400">
            <CheckCircle2 size={15} />
          </div>
        </div>

        <div className="flex aspect-[9/16] flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-gradient-to-br from-[#14213D] to-[#1B3F7A] p-6 text-center">
          <RoomIcon size={40} className="text-blue-300" strokeWidth={1.5} />
          <div>
            <p className="font-bold text-white">{roomLabel}</p>
            <p className="mt-1 text-xs tracking-widest text-blue-300">{title}</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-300">AI video generating</p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full" style={{ width: "75%", background: "linear-gradient(90deg, #4d8dff, #22d3ee)" }} />
          </div>
          <p className="mt-2 text-xs text-slate-400">Processing photos … 75%</p>
        </div>
      </div>
    </div>
  );
}
