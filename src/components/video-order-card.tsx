"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Clock, XCircle, Trash2, ArrowRight, Download, Share2, RefreshCw, AlertTriangle, Lock } from "lucide-react";
import { deleteVideoOrder, restartVideoOrder } from "@/services/video-orders";

const MAX_PROCESSING_SEC = 60 * 60; // 60 minutes before showing timeout warning

type Order = {
  id: string;
  title: string | null;
  status: string;
  created_at: string;
  video_url: string | null;
  image_urls: string[] | null;
  paid?: boolean | null;
};

function useElapsed(createdAt: string, active: boolean) {
  const [elapsed, setElapsed] = useState(() =>
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000)
  );
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [active, createdAt]);
  return elapsed;
}

function ProgressBadge({ status, createdAt }: { status: string; createdAt: string }) {
  const elapsed = useElapsed(createdAt, status === "processing");
  const pct = Math.min(92, Math.round((elapsed / 1800) * 100));
  const timedOut = elapsed > MAX_PROCESSING_SEC;

  if (status === "ready") return (
    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
      <CheckCircle2 size={12} /> Klar
    </span>
  );
  if (status === "failed") return (
    <span className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
      <XCircle size={12} /> Fejlede
    </span>
  );
  if (status === "processing" && timedOut) return (
    <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
      <AlertTriangle size={12} /> Tager for lang tid
    </span>
  );
  if (status === "processing") return (
    <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
      <Loader2 size={12} className="animate-spin" /> Genereres {pct}%
    </span>
  );
  return (
    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
      <Clock size={12} /> Afventer
    </span>
  );
}

function ProgressSection({
  status, createdAt, onRefresh, onRestart,
}: {
  status: string; createdAt: string; orderId: string; onRefresh: () => void; onRestart: () => void;
}) {
  const elapsed = useElapsed(createdAt, status === "processing");
  const pct = Math.min(92, Math.round((elapsed / 1800) * 100));
  const timedOut = elapsed > MAX_PROCESSING_SEC;
  const [checking, setChecking] = useState(false);
  const [restarting, setRestarting] = useState(false);

  if (status !== "processing" && status !== "failed") return null;

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  async function forceCheck() {
    setChecking(true);
    await fetch("/api/poll-video-status", { method: "POST" });
    onRefresh();
    setTimeout(() => setChecking(false), 3000);
  }

  async function handleRestart() {
    setRestarting(true);
    await onRestart();
  }

  if (status === "failed" || timedOut) {
    return (
      <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
        <p className="text-sm font-medium text-red-800">
          {status === "failed" ? "Video generering fejlede." : `Genereringen tager for lang tid (${mins} min).`}
        </p>
        <p className="mt-1 text-xs text-red-700">
          Klik på &ldquo;Genstart&rdquo; for at starte en ny generering med Google AI.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={handleRestart}
            disabled={restarting}
            className="flex items-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-800 hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            {restarting ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
            {restarting ? "Genstarter..." : "Genstart video"}
          </button>
          <button
            onClick={forceCheck}
            disabled={checking}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            {checking ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
            {checking ? "Tjekker..." : "Tjek status"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="h-1.5 rounded-full bg-blue-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-blue-400 transition-all duration-[3000ms] ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-[10px] text-blue-400">{mins}:{String(secs).padStart(2, "0")} forløbet</span>
        <button
          onClick={forceCheck}
          disabled={checking}
          className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-600 disabled:opacity-50 transition-colors"
        >
          {checking ? <Loader2 size={9} className="animate-spin" /> : <RefreshCw size={9} />}
          {checking ? "Tjekker..." : "Tjek nu"}
        </button>
        <span className="text-[10px] text-blue-400">{pct}% — typisk klar inden 15 min</span>
      </div>
    </div>
  );
}

export function VideoOrderCard({ order }: { order: Order }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await deleteVideoOrder(order.id);
    router.refresh();
  }

  async function handleRestart() {
    await restartVideoOrder(order.id);
    router.refresh();
  }

  function handleRefresh() {
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-900 truncate">{order.title ?? "Bolig fremvisning"}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            Bestilt {new Date(order.created_at).toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ProgressBadge status={order.status} createdAt={order.created_at} />
          <Link href={`/videos/${order.id}`} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors">
            Se <ArrowRight size={11} />
          </Link>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors"
              title="Slet video"
            >
              <Trash2 size={14} />
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">Slet?</span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded px-2 py-0.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {deleting ? "..." : "Ja"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded px-2 py-0.5 text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Nej
              </button>
            </div>
          )}
        </div>
      </div>

      <ProgressSection
        status={order.status}
        createdAt={order.created_at}
        orderId={order.id}
        onRefresh={handleRefresh}
        onRestart={handleRestart}
      />

      {order.status === "ready" && order.video_url && order.paid && (
        <div className="mt-4">
          <video src={order.video_url} controls className="w-full max-w-sm rounded-lg border border-slate-100" />
          <div className="mt-3 flex gap-3">
            <a
              href={order.video_url}
              download
              className="inline-flex items-center gap-2 rounded-lg bg-[#1B3F7A] px-4 py-2 text-sm font-medium text-white hover:bg-[#152f5c]"
            >
              <Download size={13} /> Download video
            </a>
            <Link
              href={`/videos/${order.id}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <Share2 size={13} /> Del på sociale medier
            </Link>
          </div>
        </div>
      )}

      {order.status === "ready" && order.video_url && !order.paid && (
        <div className="mt-4">
          <Link
            href={`/videos/${order.id}`}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #FFB36B 0%, #FF6B4A 100%)" }}
          >
            <Lock size={13} /> Se & lås op
          </Link>
        </div>
      )}

      {order.image_urls && order.image_urls.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {order.image_urls.slice(0, 5).map((url, i) => (
            <img key={i} src={url} alt="" className="h-16 w-24 shrink-0 rounded-lg object-cover" />
          ))}
        </div>
      )}
    </div>
  );
}
