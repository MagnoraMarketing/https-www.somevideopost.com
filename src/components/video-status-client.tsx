"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useTransition, useRef } from "react";
import { CheckCircle2, Loader2, XCircle, Download, Share2, Send, Lock } from "lucide-react";
import { pollVideoJob } from "@/services/video-jobs";
import { JobProgress, type SceneView, type JobDiagnosticsView } from "@/components/video/job-progress";
import { DEFAULT_VIDEO_STYLE, type VideoStyleId } from "@/lib/video-styles";
import { shareVideoToSocial } from "@/services/share-video";
import { createVideoPaymentCheckout } from "@/services/billing";
import { VideoSalesText } from "@/components/video-sales-text";
import type { SocialAccount } from "@/types/database";

function PaymentPanel({ orderId, videoPrice, nearlyReady }: { orderId: string; videoPrice: string; nearlyReady?: boolean }) {
  return (
    <form action={createVideoPaymentCheckout} className="rounded-2xl border border-[#FF6B4A]/30 bg-gradient-to-br from-orange-50 to-white p-5 shadow-sm">
      <input type="hidden" name="order_id" value={orderId} />
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF6B4A]/10">
          <Lock size={18} className="text-[#FF6B4A]" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-slate-900">
            {nearlyReady ? "Din video er næsten klar" : "Lås din video op"}
          </p>
          <p className="mt-0.5 text-sm text-slate-500">
            Betal {videoPrice} for at få den fulde video i høj kvalitet — uden vandmærke — klar til download og deling.
          </p>
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
        style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
      >
        <Lock size={14} /> Betal {videoPrice} og lås op
      </button>
      <p className="mt-2 text-center text-[11px] text-slate-400">Sikker betaling via Stripe</p>
    </form>
  );
}

const PLATFORM_COLORS: Record<string, string> = {
  facebook: "#1877F2", instagram: "#E1306C", tiktok: "#000000",
  snapchat: "#F7C600", youtube: "#FF0000", linkedin: "#0A66C2",
};

type Status = "pending" | "processing" | "ready" | "failed";

type Props = {
  orderId: string;
  initialStatus: Status;
  initialVideoUrl?: string;
  initialVideoUrls?: string[];
  title: string;
  description?: string | null;
  location?: string | null;
  bookingUrl?: string | null;
  imageUrls: string[];
  accounts: SocialAccount[];
  initialPaid: boolean;
  videoPrice: string;
  videoStyle: VideoStyleId;
  initialJobState: string;
  /** Sales text stored on the order, if it has one. */
  initialCaption?: string | null;
  initialCaptionPlatform?: string | null;
};

function SharePanel({ videoUrl, accounts, caption, setCaption }: { videoUrl: string; accounts: SocialAccount[]; caption: string; setCaption: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function toggleAccount(id: string) {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  function handleShare() {
    const fd = new FormData();
    fd.append("content", caption);
    fd.append("video_url", videoUrl);
    fd.append("scheduled_at", scheduledAt);
    selected.forEach((id) => fd.append("account_ids[]", id));
    startTransition(async () => {
      const res = await shareVideoToSocial(fd);
      if (res.error) { setError(res.error); return; }
      setDone(true);
    });
  }

  if (done) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
        <CheckCircle2 size={15} /> Opslag oprettet og planlagt!
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Share2 size={16} className="text-slate-500" />
          <span className="font-semibold text-slate-900">Del på sociale medier</span>
        </div>
        <span className="text-xs text-slate-400">{open ? "Luk" : "Åbn"}</span>
      </button>

      {open && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-4">
          {accounts.length === 0 ? (
            <p className="text-sm text-slate-500">
              Ingen kanaler tilkoblet.{" "}
              <Link href="/accounts/connect" className="text-[#FF6B4A] underline">Tilslut en kanal</Link>
            </p>
          ) : (
            <>
              {/* Channel picker */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Vælg kanaler</p>
                <div className="flex flex-wrap gap-2">
                  {accounts.map((a) => {
                    const active = selected.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggleAccount(a.id)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                          active
                            ? "border-[#FF6B4A] bg-orange-50 text-[#FF6B4A]"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <span
                          className="inline-block h-3 w-3 rounded-full shrink-0"
                          style={{ backgroundColor: PLATFORM_COLORS[a.platform] ?? "#64748b" }}
                        />
                        {a.account_name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Billedtekst
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                  placeholder="Skriv din besked til opslaget..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#FF6B4A] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]/10 resize-none"
                />
              </div>

              {/* Optional schedule */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Planlæg til (valgfrit)
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-[#FF6B4A] focus:outline-none"
                />
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button
                onClick={handleShare}
                disabled={isPending || !caption.trim() || selected.length === 0}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
              >
                {isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                {scheduledAt ? "Planlæg opslag" : "Del nu"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function VideoStatusClient({ orderId, initialStatus, initialVideoUrl, initialVideoUrls, title, description, location, bookingUrl, imageUrls, accounts, initialPaid, videoPrice, videoStyle, initialJobState, initialCaption, initialCaptionPlatform }: Props) {
  const paid = initialPaid;
  const [status, setStatus] = useState<Status>(initialStatus);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(initialVideoUrl);
  const [videoUrls, setVideoUrls] = useState<string[]>(initialVideoUrls ?? (initialVideoUrl ? [initialVideoUrl] : []));
  const [caption, setCaption] = useState(initialCaption ?? "");
  const [jobState, setJobState] = useState<string>(initialJobState);
  const [jobLabel, setJobLabel] = useState("Klargør din video…");
  const [jobProgress, setJobProgress] = useState(2);
  const [jobError, setJobError] = useState<string | undefined>(undefined);
  const [diagnostics, setDiagnostics] = useState<JobDiagnosticsView>({});
  const [scenes, setScenes] = useState<SceneView[]>([]);
  const [style, setStyle] = useState<VideoStyleId>(videoStyle ?? DEFAULT_VIDEO_STYLE);
  const pollingRef = useRef(false);

  // Each poll advances the pipeline by one step and reports where it got to,
  // so the progress the customer sees is the job's real position.
  const poll = useCallback(async () => {
    if (pollingRef.current) return;
    pollingRef.current = true;
    try {
      const result = await pollVideoJob(orderId);
      if ("error" in result) { setJobError(result.error); return; }
      setStatus(result.status as Status);
      setJobState(result.state);
      setJobLabel(result.label);
      setJobProgress(result.progress);
      setJobError(result.error);
      setDiagnostics(result.diagnostics as JobDiagnosticsView);
      setScenes(result.scenes);
      setStyle(result.videoStyle);
      if (result.videoUrl) { setVideoUrl(result.videoUrl); setVideoUrls([result.videoUrl]); }
    } finally {
      pollingRef.current = false;
    }
  }, [orderId]);

  useEffect(() => {
    if (status === "ready" || status === "failed") return;
    void poll();
    // A step can take a while (WAN generation, then an ffmpeg render), so the
    // interval paces the driver rather than racing it; `pollingRef` keeps two
    // advances from overlapping.
    const interval = setInterval(poll, 12_000);
    return () => clearInterval(interval);
  }, [status, poll]);

  if (status === "ready" && videoUrl) {
    const clips = videoUrls.length > 0 ? videoUrls : [videoUrl];

    // ── Locked: video generated, waiting for the per-video payment ──
    if (!paid) {
      return (
        <div className="space-y-5">
          <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <Lock size={20} className="text-amber-600 shrink-0" />
            <div>
              <p className="font-semibold text-amber-900">Din video er klar — lås op for at hente</p>
              <p className="text-sm text-amber-700">Se en forhåndsvisning nedenfor. Betal for at fjerne vandmærket og downloade.</p>
            </div>
          </div>

          {/* Watermarked, non-downloadable preview */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-lg">
            <video src={clips[0]} autoPlay loop muted playsInline className="w-full blur-[2px]" style={{ maxHeight: "480px" }} />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/30">
              <Lock size={30} className="text-white/90" />
              <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">Forhåndsvisning · lås op med betaling</span>
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="rotate-[-20deg] text-3xl font-black uppercase tracking-widest text-white/15">SOME Video Post</span>
            </div>
          </div>

          <PaymentPanel orderId={orderId} videoPrice={videoPrice} />

          {/* They can prepare the caption while deciding. */}
          <VideoSalesText
            orderId={orderId}
            initialPlatform={initialCaptionPlatform ?? undefined}
            hasStoredCaption={!!initialCaption}
            title={title}
            description={description}
            location={location}
            bookingUrl={bookingUrl}
            caption={caption}
            setCaption={setCaption}
          />
        </div>
      );
    }

    // ── Paid: full quality, downloadable, shareable ──
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          <div>
            <p className="font-semibold text-emerald-900">
              {clips.length > 1 ? `${clips.length} videoklip er klar!` : "Din video er klar!"}
            </p>
            <p className="text-sm text-emerald-700">AI-genereret cinematisk præsentationsvideo</p>
          </div>
        </div>

        {clips.map((url, i) => (
          <div key={i} className="space-y-2">
            {clips.length > 1 && (
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Klip {i + 1} / {clips.length}
              </p>
            )}
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-black shadow-lg">
              <video src={url} controls autoPlay={i === 0} loop className="w-full" style={{ maxHeight: "480px" }} />
            </div>
            <a
              href={url}
              download={`${title}-klip-${i + 1}.mp4`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Download size={13} /> Download klip {i + 1}
            </a>
          </div>
        ))}

        <VideoSalesText
          orderId={orderId}
          initialPlatform={initialCaptionPlatform ?? undefined}
          hasStoredCaption={!!initialCaption}
          title={title}
          description={description}
          location={location}
          bookingUrl={bookingUrl}
          caption={caption}
          setCaption={setCaption}
        />

        <SharePanel videoUrl={videoUrl} accounts={accounts} caption={caption} setCaption={setCaption} />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
        <XCircle size={20} className="text-red-500 shrink-0" />
        <div>
          <p className="font-semibold text-red-900">Video generering fejlede</p>
          <p className="text-sm text-red-700">Prøv igen eller kontakt support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Once generation is well underway, let the user pay so it unlocks the moment it's ready. */}
      {jobProgress >= 80 && !paid && (
        <PaymentPanel orderId={orderId} videoPrice={videoPrice} nearlyReady />
      )}

      <JobProgress
        orderId={orderId}
        state={jobState}
        label={jobLabel}
        progress={jobProgress}
        videoStyle={style}
        diagnostics={diagnostics}
        scenes={scenes}
        error={jobError}
        onImagesUploaded={poll}
      />

      {imageUrls.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Dine billeder ({imageUrls.length})</p>
          <div className="grid grid-cols-5 gap-2">
            {imageUrls.slice(0, 10).map((url, i) => (
              <div key={i} className="aspect-video overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                {url.startsWith("http") && <img src={url} alt="" className="h-full w-full object-cover" />}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-xs text-slate-400">Siden opdaterer sig selv, mens videoen laves</p>
    </div>
  );
}
