"use client";

import { useRef, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, UploadCloud, RefreshCw } from "lucide-react";
import { SelectedStyleBadge } from "./style-selector";
import type { VideoStyleId } from "@/lib/video-styles";

/**
 * Generation progress, driven by the job's real state.
 *
 * Every line the customer reads corresponds to a step the pipeline actually
 * completed — including the "18 photos found / 7 selected" counts — rather
 * than a timer pretending to be progress.
 */

export type SceneView = {
  index: number;
  status: string;
  attempts: number;
  purpose: string | null;
  clipUrl: string | null;
  error: string | null;
};

export type JobDiagnosticsView = {
  import?: { candidatesFound: number; downloaded: number; stored: number };
  selection?: { selected: number; of: number };
  scenes?: { total: number; succeeded: number; failed: number };
  assembly?: { frames: number; durationSeconds: number };
};

export function JobProgress({
  orderId,
  state,
  label,
  progress,
  videoStyle,
  diagnostics,
  scenes,
  error,
  onImagesUploaded,
}: {
  orderId: string;
  state: string;
  label: string;
  progress: number;
  videoStyle: VideoStyleId;
  diagnostics: JobDiagnosticsView;
  scenes: SceneView[];
  error?: string;
  onImagesUploaded: () => void;
}) {
  const awaitingImages = state === "awaiting_images";

  return (
    <div className="space-y-5">
      <SelectedStyleBadge styleId={videoStyle} />

      {awaitingImages ? (
        <UploadFallback orderId={orderId} message={error} onUploaded={onImagesUploaded} />
      ) : (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-5">
          <div className="mb-4 flex items-center gap-3">
            <Loader2 size={20} className="shrink-0 animate-spin text-blue-600" />
            <div>
              <p className="font-semibold text-blue-900">{label}</p>
              <p className="text-sm text-blue-700">Vi bruger boligens faktiske billeder — ikke en AI-fantasi.</p>
            </div>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-blue-200">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-1000 ease-linear"
              style={{ width: `${Math.min(97, progress)}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-blue-400">
            <span>{state.replace(/_/g, " ")}</span>
            <span>{Math.min(97, progress)}%</span>
          </div>

          <StepFacts diagnostics={diagnostics} scenes={scenes} />
        </div>
      )}

      {scenes.length > 0 && <SceneList orderId={orderId} scenes={scenes} />}
    </div>
  );
}

/** The concrete numbers behind the current step. */
function StepFacts({ diagnostics, scenes }: { diagnostics: JobDiagnosticsView; scenes: SceneView[] }) {
  const lines: string[] = [];
  if (diagnostics.import) {
    lines.push(`${diagnostics.import.candidatesFound} boligbilleder fundet`);
    lines.push(`${diagnostics.import.downloaded} hentet · ${diagnostics.import.stored} gemt`);
  }
  if (diagnostics.selection) {
    lines.push(`${diagnostics.selection.selected} af ${diagnostics.selection.of} billeder valgt`);
  }
  if (scenes.length) {
    const done = scenes.filter((s) => s.status === "succeeded").length;
    lines.push(`${done} af ${scenes.length} scener genereret`);
  }
  if (diagnostics.assembly) {
    lines.push(`Færdig længde ${diagnostics.assembly.durationSeconds.toFixed(3)} sekunder`);
  }
  if (!lines.length) return null;

  return (
    <ul className="mt-4 space-y-1 border-t border-blue-200/60 pt-3">
      {lines.map((line) => (
        <li key={line} className="flex items-center gap-2 text-xs text-blue-700">
          <CheckCircle2 size={11} className="shrink-0 text-blue-500" /> {line}
        </li>
      ))}
    </ul>
  );
}

/** Per-scene state, with a retry that regenerates only that shot. */
function SceneList({ orderId, scenes }: { orderId: string; scenes: SceneView[] }) {
  const [retrying, setRetrying] = useState<number | null>(null);

  async function retry(index: number) {
    setRetrying(index);
    await fetch(`/api/video-jobs/${orderId}/scenes/${index}/retry`, { method: "POST" });
    setRetrying(null);
  }

  const COLORS: Record<string, string> = {
    succeeded: "bg-emerald-100 text-emerald-700",
    failed: "bg-red-100 text-red-600",
    running: "bg-blue-100 text-blue-700",
    submitted: "bg-blue-100 text-blue-700",
    pending: "bg-slate-100 text-slate-500",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Scener ({scenes.filter((s) => s.status === "succeeded").length}/{scenes.length})
      </p>
      <ul className="space-y-1.5">
        {scenes.map((scene) => (
          <li key={scene.index} className="flex items-center gap-2 text-xs">
            <span className={`rounded px-1.5 py-0.5 font-semibold ${COLORS[scene.status] ?? COLORS.pending}`}>
              {scene.index + 1}
            </span>
            <span className="flex-1 truncate text-slate-600">{scene.purpose ?? `Scene ${scene.index + 1}`}</span>
            {scene.status === "failed" && (
              <button
                type="button"
                onClick={() => retry(scene.index)}
                disabled={retrying === scene.index}
                className="flex items-center gap-1 rounded border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                {retrying === scene.index ? <Loader2 size={10} className="animate-spin" /> : <RefreshCw size={10} />}
                Prøv igen
              </button>
            )}
            <span className="text-slate-400">{scene.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The no-fiction fallback: when the listing's photographs could not be
 * retrieved, the customer supplies them. Uploads join the same pipeline.
 */
function UploadFallback({
  orderId,
  message,
  onUploaded,
}: {
  orderId: string;
  message?: string;
  onUploaded: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  async function upload(files: FileList | File[]) {
    const list = Array.from(files);
    if (!list.length) return;
    setBusy(true);
    setError("");
    const form = new FormData();
    list.forEach((file) => form.append("files", file));
    const res = await fetch(`/api/video-jobs/${orderId}/images`, { method: "POST", body: form });
    setBusy(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Billederne kunne ikke uploades");
      return;
    }
    onUploaded();
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="mt-0.5 shrink-0 text-amber-600" />
        <div>
          <p className="font-semibold text-amber-900">Vi kunne ikke hente boligens billeder</p>
          <p className="mt-0.5 text-sm text-amber-800">
            {message ?? "Vi kunne ikke hente boligens billeder pålideligt fra denne hjemmeside."}{" "}
            Upload dine egne billeder af boligen for at fortsætte.
          </p>
        </div>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); void upload(e.dataTransfer.files); }}
        className={`mt-4 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          dragging ? "border-[#FF6B4A] bg-orange-50" : "border-amber-300 bg-white/60"
        }`}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="mx-auto flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
          {busy ? "Uploader…" : "Upload boligens billeder"}
        </button>
        <p className="mt-2 text-xs text-amber-700">Træk og slip, eller klik. JPG, PNG eller WEBP.</p>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => { if (e.target.files) void upload(e.target.files); e.target.value = ""; }}
      />
    </div>
  );
}
