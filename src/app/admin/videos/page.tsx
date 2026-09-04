import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { resolveVideoStyle } from "@/lib/video-styles";
import type { VideoOrder, VideoScene, VideoSourceImage } from "@/types/database";

/**
 * Pipeline debug view.
 *
 * Everything needed to explain a video that came out wrong: which listing was
 * read, how many photographs were found versus downloaded versus selected, the
 * storyboard, and each WAN task with its attempts and errors.
 */

export const dynamic = "force-dynamic";

type OrderRow = Pick<
  VideoOrder,
  "id" | "user_id" | "title" | "status" | "job_state" | "video_style" | "aspect_ratio"
  | "source_url" | "created_at" | "completed_at" | "final_video_url"
> & { diagnostics: Diagnostics | null; error_message: string | null };

type Diagnostics = {
  import?: { candidatesFound: number; downloadAttempted: number; downloaded: number; stored: number; cached?: boolean; methods?: Record<string, number>; failures?: { url: string; reason: string }[] };
  analysis?: { analysed: number; rejected: number; fallbackUsed: boolean };
  selection?: { selected: number; of: number; categories: string[] };
  scenes?: { total: number; succeeded: number; failed: number };
  assembly?: { frames: number; durationSeconds: number };
  propertyTitle?: string;
  lastError?: string;
};

async function getData(orderId?: string) {
  const admin = createAdminClient();
  const { data: orders } = await admin
    .from("video_orders")
    .select("id, user_id, title, status, job_state, video_style, aspect_ratio, source_url, created_at, completed_at, final_video_url, diagnostics, error_message")
    .order("created_at", { ascending: false })
    .limit(40)
    .returns<OrderRow[]>();

  const selected = orderId ?? orders?.[0]?.id;
  if (!selected) return { orders: orders ?? [], order: null, scenes: [], images: [] };

  const [{ data: scenes }, { data: images }] = await Promise.all([
    admin.from("video_scenes").select("*").eq("order_id", selected).order("scene_index").returns<VideoScene[]>(),
    admin.from("video_source_images").select("*").eq("order_id", selected).order("position").returns<VideoSourceImage[]>(),
  ]);

  return {
    orders: orders ?? [],
    order: orders?.find((o) => o.id === selected) ?? null,
    scenes: scenes ?? [],
    images: images ?? [],
  };
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 py-1.5 text-xs last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="max-w-[60%] truncate text-right font-medium text-slate-800">{value}</span>
    </div>
  );
}

export default async function AdminVideosPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderParam } = await searchParams;
  const { orders, order, scenes, images } = await getData(orderParam);
  const diagnostics = order?.diagnostics ?? {};
  const style = order ? resolveVideoStyle(order.video_style) : null;

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Video-pipeline</h1>
        <p className="text-sm text-slate-500">Boligimport, billedvalg, WAN-opgaver og samling.</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {orders.map((o) => (
          <Link
            key={o.id}
            href={`/admin/videos?order=${o.id}`}
            className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors ${
              o.id === order?.id
                ? "border-[#FF6B4A] bg-orange-50 text-[#FF6B4A]"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            {(o.title ?? o.id).slice(0, 28)} · {o.job_state}
          </Link>
        ))}
      </div>

      {!order ? (
        <p className="text-sm text-slate-500">Ingen video-ordrer endnu.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-bold text-slate-900">Ordre</h2>
            <Row label="ID" value={order.id} />
            <Row label="Titel" value={order.title ?? "—"} />
            <Row label="Property-titel" value={diagnostics.propertyTitle ?? "—"} />
            <Row label="Kilde-URL" value={order.source_url ?? "upload"} />
            <Row label="Status" value={`${order.status} / ${order.job_state}`} />
            <Row label="Stil" value={style ? `${style.name} — ${style.description}` : order.video_style} />
            <Row label="Format" value={order.aspect_ratio} />
            <Row label="Oprettet" value={new Date(order.created_at).toLocaleString("da-DK")} />
            <Row label="Færdig" value={order.completed_at ? new Date(order.completed_at).toLocaleString("da-DK") : "—"} />
            {order.error_message && <Row label="Fejl" value={<span className="text-red-600">{order.error_message}</span>} />}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-3 text-sm font-bold text-slate-900">Billedimport</h2>
            <Row label="Kandidater fundet" value={diagnostics.import?.candidatesFound ?? "—"} />
            <Row label="Forsøgt hentet" value={diagnostics.import?.downloadAttempted ?? "—"} />
            <Row label="Hentet" value={diagnostics.import?.downloaded ?? "—"} />
            <Row label="Gemt i storage" value={diagnostics.import?.stored ?? images.length} />
            <Row label="Fra cache" value={diagnostics.import?.cached ? "ja" : "nej"} />
            <Row label="Metoder" value={Object.entries(diagnostics.import?.methods ?? {}).map(([k, v]) => `${k}:${v}`).join(", ") || "—"} />
            <Row label="Analyseret" value={diagnostics.analysis ? `${diagnostics.analysis.analysed} (${diagnostics.analysis.rejected} afvist)` : "—"} />
            <Row label="AI-fallback" value={diagnostics.analysis?.fallbackUsed ? "ja (deterministisk)" : "nej"} />
            <Row label="Valgt" value={diagnostics.selection ? `${diagnostics.selection.selected} af ${diagnostics.selection.of}` : "—"} />
            <Row label="Kategorier" value={diagnostics.selection?.categories?.join(", ") ?? "—"} />
            <Row label="Samlet længde" value={diagnostics.assembly ? `${diagnostics.assembly.durationSeconds.toFixed(3)}s / ${diagnostics.assembly.frames} frames` : "—"} />

            {!!diagnostics.import?.failures?.length && (
              <details className="mt-3">
                <summary className="cursor-pointer text-xs font-medium text-slate-500">
                  {diagnostics.import.failures.length} billeder kunne ikke bruges
                </summary>
                <ul className="mt-2 space-y-1">
                  {diagnostics.import.failures.map((f, i) => (
                    <li key={i} className="text-[11px] text-slate-500">
                      <span className="text-red-500">{f.reason}</span> — {f.url.slice(0, 80)}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2">
            <h2 className="mb-3 text-sm font-bold text-slate-900">Scener / WAN-opgaver</h2>
            {scenes.length === 0 ? (
              <p className="text-xs text-slate-500">Ingen scener endnu.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead className="text-slate-400">
                    <tr>
                      <th className="py-1 pr-3">#</th>
                      <th className="py-1 pr-3">Formål</th>
                      <th className="py-1 pr-3">Længde</th>
                      <th className="py-1 pr-3">Status</th>
                      <th className="py-1 pr-3">Forsøg</th>
                      <th className="py-1 pr-3">WAN task</th>
                      <th className="py-1 pr-3">Kildebillede</th>
                      <th className="py-1 pr-3">Klip</th>
                      <th className="py-1">Fejl</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    {scenes.map((scene) => (
                      <tr key={scene.id} className="border-t border-slate-100">
                        <td className="py-1.5 pr-3">{scene.scene_index + 1}</td>
                        <td className="py-1.5 pr-3">{scene.purpose ?? "—"}</td>
                        <td className="py-1.5 pr-3">{Number(scene.duration_seconds).toFixed(3)}s</td>
                        <td className="py-1.5 pr-3">{scene.status}</td>
                        <td className="py-1.5 pr-3">{scene.attempts}</td>
                        <td className="py-1.5 pr-3">{scene.wan_task_id?.slice(0, 14) ?? "—"}</td>
                        <td className="py-1.5 pr-3">
                          {scene.input_image_url
                            ? <a href={scene.input_image_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">foto</a>
                            : <span className="text-red-500">mangler</span>}
                        </td>
                        <td className="py-1.5 pr-3">
                          {scene.clip_url
                            ? <a href={scene.clip_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">klip</a>
                            : "—"}
                        </td>
                        <td className="py-1.5 text-red-500">{scene.error_message?.slice(0, 60) ?? ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2">
            <h2 className="mb-3 text-sm font-bold text-slate-900">Kildebilleder ({images.length})</h2>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
              {images.map((image) => (
                <a key={image.id} href={image.storage_url} target="_blank" rel="noreferrer" className="group">
                  <div className={`aspect-video overflow-hidden rounded-lg border-2 ${image.selected ? "border-[#FF6B4A]" : "border-slate-200"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.storage_url} alt="" className="h-full w-full object-cover" />
                  </div>
                  <p className="mt-0.5 truncate text-[10px] text-slate-400">
                    {image.width}x{image.height} · {image.extraction_method}
                    {image.selected ? ` · #${(image.selection_rank ?? 0) + 1}` : ""}
                  </p>
                </a>
              ))}
            </div>
          </section>

          {order.final_video_url && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2">
              <h2 className="mb-3 text-sm font-bold text-slate-900">Færdig video</h2>
              <video src={order.final_video_url} controls className="w-full max-w-sm rounded-xl" />
            </section>
          )}
        </div>
      )}
    </div>
  );
}
