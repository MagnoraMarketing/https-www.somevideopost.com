"use client";

import { useState, useTransition } from "react";
import { Code2, Copy, Check, Link2, Loader2 } from "lucide-react";
import { setVideoSharing, type SharingState } from "@/services/video-sharing";

/**
 * Embed the video on the customer's own website, or share it as a link.
 *
 * Sharing is off until the customer turns it on, and turning it off revokes
 * every embed and link at once. The code shown is built from the deployment's
 * real base URL and the video's own aspect ratio.
 */
export function EmbedPanel({ orderId, initial }: { orderId: string; initial: SharingState }) {
  const [state, setState] = useState<SharingState>(initial);
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggle(enabled: boolean) {
    startTransition(async () => {
      const next = await setVideoSharing(orderId, enabled);
      setState(next);
    });
  }

  async function copy(kind: "code" | "link", text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Clipboard blocked (e.g. insecure context) — the text is selectable.
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <Code2 size={17} className="text-[#1B3F7A]" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Vis videoen på din hjemmeside</p>
            <p className="mt-0.5 text-sm text-slate-500">
              {state.enabled
                ? "Delingen er slået til. Alle med linket eller koden kan se videoen."
                : "Slå deling til for at få en kode, du kan indsætte på din egen side."}
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={state.enabled}
          aria-label="Deling"
          disabled={isPending}
          onClick={() => toggle(!state.enabled)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
            state.enabled ? "bg-[#FF6B4A]" : "bg-slate-300"
          }`}
        >
          {isPending ? (
            <Loader2 size={12} className="absolute left-1/2 -translate-x-1/2 animate-spin text-white" />
          ) : (
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                state.enabled ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          )}
        </button>
      </div>

      {state.error && <p className="mt-3 text-xs text-red-500">{state.error}</p>}

      {state.enabled && state.embedCode && state.url && (
        <div className="mt-4 space-y-3">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Indlejringskode</p>
            <textarea
              readOnly
              value={state.embedCode}
              rows={4}
              onFocus={(e) => e.currentTarget.select()}
              className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-[11px] text-slate-700"
            />
            <button
              type="button"
              onClick={() => copy("code", state.embedCode!)}
              className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
            >
              {copied === "code" ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
              {copied === "code" ? "Kopieret" : "Kopiér kode"}
            </button>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Direkte link</p>
            <div className="flex gap-2">
              <input
                readOnly
                value={state.url}
                onFocus={(e) => e.currentTarget.select()}
                className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700"
              />
              <button
                type="button"
                onClick={() => copy("link", state.url!)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                {copied === "link" ? <Check size={12} className="text-emerald-600" /> : <Link2 size={12} />}
                {copied === "link" ? "Kopieret" : "Kopiér link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
