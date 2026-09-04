import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { resolveVideoStyle, DEFAULT_VIDEO_STYLE, type VideoStyleId } from "@/lib/video-styles";
import {
  importPropertyFromUrl, PropertyImportError,
  type ImportDiagnostics, type StoredImage,
} from "@/services/property-import";
import { analyzeImages, buildStoryboard, selectImages, type ImageAnalysis, type Storyboard } from "./ai-director";
import { advanceScenes, createSceneRows, loadScenes, summariseScenes } from "./wan-generator";
import { assembleVideo, ffmpegAvailable, TRANSITION_SECONDS, type AspectRatio } from "./assembler";
import { finalVideoPath, storeVideoFile } from "@/services/property-import/store-images";

/**
 * Video job orchestration.
 *
 * The pipeline is a state machine advanced one step per invocation rather than
 * one long-running function: generation is asynchronous by nature (WAN tasks
 * take minutes) and a serverless request cannot sit and wait for it. Each call
 * to {@link advanceJob} does the smallest useful amount of work and returns,
 * and the client's existing poll loop keeps calling until the job settles.
 */

const LOG = "[video-job]";

/**
 * Photographs already in storage beyond this count make a listing re-read
 * pointless — the AI Director only needs 6-8 in the end.
 */
const MIN_IMAGES_FOR_IMPORT_SKIP = 6;

export const JOB_STATES = [
  "pending", "fetching_property", "extracting_images", "downloading_images",
  "analyzing_images", "selecting_images", "creating_storyboard",
  "generating_clips", "assembling_video", "completed", "failed",
  "awaiting_images",
] as const;

export type JobState = (typeof JOB_STATES)[number];

/** Customer-facing progress copy, keyed by state. */
export const JOB_STATE_LABELS: Record<JobState, string> = {
  pending: "Klargør din video…",
  fetching_property: "Finder boligen…",
  extracting_images: "Finder boligens billeder…",
  downloading_images: "Henter boligens billeder…",
  analyzing_images: "Analyserer boligens billeder…",
  selecting_images: "Vælger de bedste billeder…",
  creating_storyboard: "Laver storyboard…",
  generating_clips: "Genererer cinematiske scener…",
  assembling_video: "Samler den færdige video…",
  completed: "Videoen er klar",
  failed: "Videoen kunne ikke laves",
  awaiting_images: "Upload boligens billeder for at fortsætte",
};

/** Rough share of the whole job each state represents, for the progress bar. */
const STATE_PROGRESS: Record<JobState, number> = {
  pending: 2, fetching_property: 6, extracting_images: 12, downloading_images: 22,
  analyzing_images: 34, selecting_images: 42, creating_storyboard: 48,
  generating_clips: 55, assembling_video: 92, completed: 100, failed: 100,
  awaiting_images: 22,
};

export type JobOrder = {
  id: string;
  user_id: string;
  title: string | null;
  status: "pending" | "processing" | "ready" | "failed";
  job_state: JobState;
  video_style: VideoStyleId;
  aspect_ratio: AspectRatio;
  source_url: string | null;
  image_urls: string[] | null;
  storyboard: Storyboard | null;
  diagnostics: JobDiagnostics;
  error_message: string | null;
  /** Legacy Google Veo operation ids, for orders created before this pipeline. */
  video_job_ids: string[] | null;
  video_url: string | null;
};

export type JobDiagnostics = {
  import?: ImportDiagnostics;
  analysis?: { analysed: number; rejected: number; fallbackUsed: boolean };
  selection?: { selected: number; of: number; categories: string[] };
  scenes?: { total: number; succeeded: number; failed: number };
  assembly?: { frames: number; durationSeconds: number };
  propertyTitle?: string;
  generationStartedAt?: string;
  lastError?: string;
};

export type AdvanceResult = {
  state: JobState;
  status: JobOrder["status"];
  label: string;
  progress: number;
  /** True while more steps remain — the caller should poll again. */
  keepPolling: boolean;
  videoUrl?: string;
  error?: string;
  diagnostics: JobDiagnostics;
};

async function loadOrder(orderId: string): Promise<JobOrder | null> {
  const { data } = await createAdminClient()
    .from("video_orders")
    .select("id, user_id, title, status, job_state, video_style, aspect_ratio, source_url, image_urls, storyboard, diagnostics, error_message, video_job_ids, video_url")
    .eq("id", orderId)
    .maybeSingle<JobOrder>();
  return data ?? null;
}

async function patchOrder(orderId: string, patch: Record<string, unknown>): Promise<void> {
  const { error } = await createAdminClient().from("video_orders").update(patch).eq("id", orderId);
  if (error) console.error(`${LOG} could not update order ${orderId}: ${error.message}`);
}

async function mergeDiagnostics(order: JobOrder, patch: Partial<JobDiagnostics>): Promise<JobDiagnostics> {
  const merged = { ...(order.diagnostics ?? {}), ...patch };
  await patchOrder(order.id, { diagnostics: merged });
  return merged;
}

async function fail(order: JobOrder, message: string, state: JobState = "failed"): Promise<AdvanceResult> {
  console.error(`${LOG} order ${order.id} → ${state}: ${message}`);
  const diagnostics = { ...(order.diagnostics ?? {}), lastError: message.slice(0, 500) };
  await patchOrder(order.id, {
    job_state: state,
    // awaiting_images is a request to the customer, not a dead job.
    status: state === "failed" ? "failed" : "processing",
    error_message: message.slice(0, 500),
    diagnostics,
  });
  return {
    state,
    status: state === "failed" ? "failed" : "processing",
    label: JOB_STATE_LABELS[state],
    progress: STATE_PROGRESS[state],
    keepPolling: false,
    error: message,
    diagnostics,
  };
}

function progressResult(order: JobOrder, state: JobState, diagnostics: JobDiagnostics, extra: Partial<AdvanceResult> = {}): AdvanceResult {
  return {
    state,
    status: extra.status ?? order.status,
    label: JOB_STATE_LABELS[state],
    progress: STATE_PROGRESS[state],
    keepPolling: state !== "completed" && state !== "failed" && state !== "awaiting_images",
    diagnostics,
    ...extra,
  };
}

type SourceImageRow = {
  id: string;
  source_url: string | null;
  storage_path: string;
  storage_url: string;
  width: number;
  height: number;
  file_size: number;
  position: number;
  extraction_method: string;
  image_hash: string;
};

async function loadStoredImages(orderId: string): Promise<StoredImage[]> {
  const { data } = await createAdminClient()
    .from("video_source_images")
    .select("id, source_url, storage_path, storage_url, width, height, file_size, position, extraction_method, image_hash")
    .eq("order_id", orderId)
    .order("position")
    .returns<SourceImageRow[]>();

  return (data ?? []).map((row) => ({
    id: row.id,
    orderId,
    sourceUrl: row.source_url,
    storagePath: row.storage_path,
    storageUrl: row.storage_url,
    width: row.width,
    height: row.height,
    fileSize: row.file_size,
    position: row.position,
    extractionMethod: row.extraction_method,
    imageHash: row.image_hash,
  }));
}

/**
 * Advance the job by one step.
 *
 * Every branch either moves the job to the next state or reports why it can't.
 * A step never silently succeeds on partial data — the "no fiction" rule (§12)
 * means a missing photograph stops the job and asks the customer for uploads.
 */
export async function advanceJob(orderId: string): Promise<AdvanceResult> {
  const order = await loadOrder(orderId);
  if (!order) throw new Error(`Video-ordre ${orderId} findes ikke`);

  const style = resolveVideoStyle(order.video_style);
  const aspect: AspectRatio = order.aspect_ratio ?? "9:16";

  // Orders created before this pipeline carry Google Veo operation ids and no
  // source images. They finish on the path they started on rather than being
  // restarted into a pipeline they were never set up for.
  if (order.job_state === "pending" && order.video_job_ids?.length) {
    return advanceLegacyVeoOrder(order);
  }

  switch (order.job_state) {
    // ── Import: URL → property data → actual photographs → storage ────────
    case "pending":
    case "fetching_property":
    case "extracting_images":
    case "downloading_images": {
      const existing = await loadStoredImages(orderId);

      // Enough real photographs are already in storage — from a manual upload,
      // or the ones the customer picked in the order form. Reading the listing
      // again would add nothing.
      if (existing.length >= MIN_IMAGES_FOR_IMPORT_SKIP) {
        await patchOrder(orderId, { job_state: "analyzing_images", status: "processing" });
        return progressResult(order, "analyzing_images", order.diagnostics ?? {}, { status: "processing" });
      }

      if (!order.source_url) {
        // No listing to read. Work with whatever photographs we have, or ask
        // for uploads — never generate a stand-in property.
        if (existing.length > 0) {
          await patchOrder(orderId, { job_state: "analyzing_images", status: "processing" });
          return progressResult(order, "analyzing_images", order.diagnostics ?? {}, { status: "processing" });
        }
        return fail(order,
          "Ingen bolig-URL og ingen uploadede billeder. Upload boligens billeder for at fortsætte.",
          "awaiting_images");
      }

      await patchOrder(orderId, { job_state: "fetching_property", status: "processing", started_at: new Date().toISOString() });

      try {
        // Storage upserts on (order_id, image_hash), so an import on top of a
        // partial form selection merges rather than duplicating.
        const imported = await importPropertyFromUrl(order.user_id, orderId, order.source_url);
        const diagnostics = await mergeDiagnostics(order, {
          import: imported.diagnostics,
          propertyTitle: imported.property.title,
        });
        // Keep the customer's own title if they typed one.
        if (!order.title && imported.property.title) {
          await patchOrder(orderId, { title: imported.property.title.slice(0, 200) });
        }
        await patchOrder(orderId, { job_state: "analyzing_images" });
        return progressResult(order, "analyzing_images", diagnostics, { status: "processing" });
      } catch (e) {
        if (e instanceof PropertyImportError) {
          // A failed import still leaves whatever the customer picked usable.
          if (existing.length > 0) {
            console.warn(`${LOG} import failed but ${existing.length} images are already stored — continuing`);
            await patchOrder(orderId, { job_state: "analyzing_images", status: "processing" });
            return progressResult(order, "analyzing_images", order.diagnostics ?? {}, { status: "processing" });
          }
          // "We couldn't reliably retrieve the property photos" — the customer
          // uploads instead. Never a generated stand-in.
          const state: JobState = e.code === "no_images" ? "awaiting_images" : "failed";
          return fail(order, e.message, state);
        }
        return fail(order, e instanceof Error ? e.message : String(e));
      }
    }

    // ── AI Director: analyse the actual photographs ───────────────────────
    case "analyzing_images": {
      const images = await loadStoredImages(orderId);
      if (!images.length) {
        return fail(order, "Der er ingen boligbilleder at analysere. Upload boligens billeder.", "awaiting_images");
      }

      const analyses = await analyzeImages(images);
      const admin = createAdminClient();
      await Promise.all(
        analyses.map((analysis) =>
          admin.from("video_source_images").update({ analysis }).eq("id", analysis.imageId),
        ),
      );

      const diagnostics = await mergeDiagnostics(order, {
        analysis: {
          analysed: analyses.length,
          rejected: analyses.filter((a) => a.reject).length,
          fallbackUsed: analyses.every((a) => a.category === "other"),
        },
      });
      await patchOrder(orderId, { job_state: "selecting_images" });
      return progressResult(order, "selecting_images", diagnostics, { status: "processing" });
    }

    // ── AI Director: choose the 6-8 best actual photographs ───────────────
    case "selecting_images": {
      const images = await loadStoredImages(orderId);
      const { data: rows } = await createAdminClient()
        .from("video_source_images")
        .select("id, analysis")
        .eq("order_id", orderId)
        .returns<{ id: string; analysis: ImageAnalysis | null }[]>();

      const analyses: ImageAnalysis[] = (rows ?? [])
        .map((row) => row.analysis)
        .filter((a): a is ImageAnalysis => !!a);

      const selection = selectImages(images, analyses, order.video_style ?? DEFAULT_VIDEO_STYLE);
      if (!selection.selected.length) {
        return fail(order, "Ingen brugbare boligbilleder kunne vælges. Upload flere billeder.", "awaiting_images");
      }

      const admin = createAdminClient();
      await admin.from("video_source_images").update({ selected: false, selection_rank: null }).eq("order_id", orderId);
      await Promise.all(
        selection.selected.map((entry, rank) =>
          admin.from("video_source_images")
            .update({ selected: true, selection_rank: rank })
            .eq("id", entry.image.id),
        ),
      );

      const diagnostics = await mergeDiagnostics(order, {
        selection: {
          selected: selection.selected.length,
          of: images.length,
          categories: selection.selected.map((e) => e.analysis.category),
        },
      });
      await patchOrder(orderId, { job_state: "creating_storyboard" });
      return progressResult(order, "creating_storyboard", diagnostics, { status: "processing" });
    }

    // ── Storyboard for the selected style ─────────────────────────────────
    case "creating_storyboard": {
      const images = await loadStoredImages(orderId);
      const { data: rows } = await createAdminClient()
        .from("video_source_images")
        .select("id, analysis, selection_rank")
        .eq("order_id", orderId)
        .eq("selected", true)
        .order("selection_rank")
        .returns<{ id: string; analysis: ImageAnalysis | null; selection_rank: number }[]>();

      const byId = new Map(images.map((i) => [i.id, i]));
      const selected = (rows ?? [])
        .map((row) => {
          const image = byId.get(row.id);
          return image && row.analysis ? { image, analysis: row.analysis } : null;
        })
        .filter((e): e is { image: StoredImage; analysis: ImageAnalysis } => !!e);

      if (!selected.length) {
        return fail(order, "Storyboardet kunne ikke laves — ingen valgte billeder.", "awaiting_images");
      }

      const storyboard = buildStoryboard(selected, order.video_style ?? DEFAULT_VIDEO_STYLE, {
        title: order.diagnostics?.propertyTitle ?? order.title ?? undefined,
      });
      await createSceneRows(order.user_id, orderId, storyboard);
      await patchOrder(orderId, {
        storyboard,
        job_state: "generating_clips",
        diagnostics: { ...(order.diagnostics ?? {}), generationStartedAt: new Date().toISOString() },
      });
      console.info(`${LOG} order ${orderId} storyboard ready (${storyboard.scenes.length} scenes, style=${style.id})`);
      return progressResult(order, "generating_clips", order.diagnostics ?? {}, { status: "processing" });
    }

    // ── WAN generation, one poll/submit round per call ────────────────────
    case "generating_clips": {
      let progress;
      try {
        progress = await advanceScenes(orderId, aspect);
      } catch (e) {
        return fail(order, e instanceof Error ? e.message : String(e));
      }

      const diagnostics = await mergeDiagnostics(order, {
        scenes: { total: progress.total, succeeded: progress.succeeded, failed: progress.failed },
      });

      if (!progress.done) {
        return progressResult(order, "generating_clips", diagnostics, { status: "processing" });
      }
      if (progress.succeeded === 0) {
        return fail(order, "Ingen scener kunne genereres. Prøv igen eller kontakt support.");
      }
      // Some scenes failed permanently but others worked: assemble what we
      // have rather than throwing away paid-for generations. The film is still
      // exactly 15 seconds — the remaining scenes are simply longer.
      if (progress.failed > 0) {
        console.warn(`${LOG} order ${orderId} assembling with ${progress.failed} failed scene(s)`);
      }
      await patchOrder(orderId, { job_state: "assembling_video" });
      return progressResult(order, "assembling_video", diagnostics, { status: "processing" });
    }

    // ── Assembly to exactly 15.000 seconds ────────────────────────────────
    case "assembling_video": {
      if (!ffmpegAvailable()) {
        return fail(order,
          "Videosamling kræver ffmpeg på serveren (sæt FFMPEG_PATH eller installér ffmpeg-static).");
      }

      const scenes = (await loadScenes(orderId)).filter((s) => s.status === "succeeded" && s.clip_url);
      if (!scenes.length) return fail(order, "Ingen færdige klip at samle.");

      try {
        const assembled = await assembleVideo(
          scenes.map((s) => ({ source: s.clip_url!, durationSeconds: Number(s.duration_seconds) })),
          { aspectRatio: aspect, transition: style.transition },
        );
        const url = await storeVideoFile(finalVideoPath(orderId), assembled.buffer);

        const diagnostics = await mergeDiagnostics(order, {
          assembly: { frames: assembled.frameCount, durationSeconds: assembled.durationSeconds },
        });
        await patchOrder(orderId, {
          job_state: "completed",
          status: "ready",
          final_video_url: url,
          video_url: url,
          // The scene clips stay listed so the customer can see the parts, but
          // the assembled film is what video_url points at.
          video_urls: [url, ...scenes.map((s) => s.clip_url!)],
          completed_at: new Date().toISOString(),
          error_message: null,
        });
        console.info(`${LOG} order ${orderId} completed — ${assembled.durationSeconds.toFixed(3)}s`);
        return progressResult(order, "completed", diagnostics, { status: "ready", videoUrl: url });
      } catch (e) {
        return fail(order, `Videosamling fejlede: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    case "completed": {
      const { data } = await createAdminClient()
        .from("video_orders").select("final_video_url, video_url").eq("id", orderId)
        .maybeSingle<{ final_video_url: string | null; video_url: string | null }>();
      return progressResult(order, "completed", order.diagnostics ?? {}, {
        status: "ready",
        videoUrl: data?.final_video_url ?? data?.video_url ?? undefined,
      });
    }

    case "awaiting_images":
    case "failed":
      return progressResult(order, order.job_state, order.diagnostics ?? {}, {
        error: order.error_message ?? undefined,
      });
  }
}

/**
 * Finish an order that was started on the previous Google Veo path.
 *
 * Nothing here touches the new pipeline: it polls the operations the order
 * already has and settles it, so an in-flight order created before this
 * migration still delivers.
 */
async function advanceLegacyVeoOrder(order: JobOrder): Promise<AdvanceResult> {
  const { getVideoJobsStatus } = await import("@/lib/google-video");
  const diagnostics = order.diagnostics ?? {};

  try {
    const result = await getVideoJobsStatus(order.video_job_ids ?? [], order.id);
    if (result.status === "completed" && result.videoUrls?.length) {
      await patchOrder(order.id, {
        job_state: "completed",
        status: "ready",
        video_url: result.videoUrls[0],
        video_urls: result.videoUrls,
        completed_at: new Date().toISOString(),
      });
      return progressResult(order, "completed", diagnostics, { status: "ready", videoUrl: result.videoUrls[0] });
    }
    if (result.status === "failed") {
      await patchOrder(order.id, { job_state: "failed", status: "failed" });
      return progressResult(order, "failed", diagnostics, { status: "failed", error: "Videogenereringen fejlede" });
    }
    return progressResult(order, "generating_clips", diagnostics, { status: "processing" });
  } catch (e) {
    console.error(`${LOG} legacy poll failed for ${order.id}: ${e instanceof Error ? e.message : String(e)}`);
    return progressResult(order, "generating_clips", diagnostics, { status: "processing" });
  }
}

/**
 * Restart a job from the images already in storage — used after a manual
 * upload rescued an import that found no photographs.
 */
export async function resumeWithUploadedImages(orderId: string): Promise<void> {
  await patchOrder(orderId, {
    job_state: "analyzing_images",
    status: "processing",
    error_message: null,
  });
}

export function transitionSecondsFor(styleId: VideoStyleId): number {
  return TRANSITION_SECONDS[resolveVideoStyle(styleId).transition];
}

export async function jobSceneSummary(orderId: string) {
  return summariseScenes(await loadScenes(orderId));
}
