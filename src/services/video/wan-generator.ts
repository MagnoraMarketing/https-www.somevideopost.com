import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createVideoTask, getVideoTask, downloadWanClip, getWanConfig,
  WanApiError, WanConfigError,
} from "@/lib/wan/client";
import { WAN_NEGATIVE_PROMPT } from "@/lib/wan/prompt";
import { sceneClipPath } from "@/services/property-import/store-images";
import { resolveVideoUrl, storeVideoDeliverable } from "./media";
import { renderPhotoClip } from "./photo-motion";
import type { AspectRatio } from "./assembler";
import type { Storyboard } from "./ai-director";

/**
 * WAN scene generation and task tracking.
 *
 * Scenes are rows, not in-memory state: each carries its own WAN task id,
 * status and attempt count, so a failed scene retries on its own and a
 * successful one is never regenerated. That is both the retry policy (§57) and
 * the cost control (§33) — WAN is the expensive part of the pipeline and it
 * runs exactly once per selected image, per attempt.
 */

const LOG = "[wan]";

export const MAX_SCENE_ATTEMPTS = 3;

export type VideoEngine = "photo-motion" | "wan";

/**
 * Which engine makes the scene clips.
 *
 * "photo-motion" (the default) animates each actual photograph with ffmpeg —
 * no external video service, no API key, no per-video cost. "wan" sends the
 * photographs to Alibaba's WAN image-to-video model (VIDEO_ENGINE=wan).
 */
export function videoEngine(env: Record<string, string | undefined> = process.env): VideoEngine {
  return env.VIDEO_ENGINE?.trim().toLowerCase() === "wan" ? "wan" : "photo-motion";
}

/** Stop starting new renders after this long, so one job step stays inside the function limit. */
const PHOTO_RENDER_BUDGET_MS = 25_000;

/**
 * WAN cannot be used at all — a rejected API key, a refused account, or
 * missing configuration. Retrying a scene cannot fix any of these, so instead
 * of burning every scene's attempts one by one (and leaving the customer on
 * a progress bar that never moves) the job stops at once with this message.
 */
export class WanUnavailableError extends Error {
  constructor(detail: string) {
    super(
      "Videogeneratoren afviste forespørgslen, så scenerne kunne ikke laves. " +
      `Det skyldes opsætningen hos os, ikke dine billeder — prøv igen senere. (${detail.slice(0, 120)})`,
    );
    this.name = "WanUnavailableError";
  }
}

/** Errors no retry can fix: authentication, authorisation, missing configuration. */
export function isFatalWanError(e: unknown): boolean {
  if (e instanceof WanConfigError) return true;
  return e instanceof WanApiError && (e.status === 401 || e.status === 403);
}

export type SceneRow = {
  id: string;
  order_id: string;
  user_id: string;
  scene_index: number;
  image_id: string | null;
  purpose: string | null;
  duration_seconds: number;
  camera: string | null;
  prompt: string;
  wan_task_id: string | null;
  status: "pending" | "submitted" | "running" | "succeeded" | "failed";
  attempts: number;
  input_image_url: string | null;
  clip_url: string | null;
  error_message: string | null;
};

/** WAN generates on a coarse duration grid; ask for the nearest usable length. */
export function wanClipSeconds(sceneSeconds: number): number {
  // Always request at least as much footage as the scene needs — the assembler
  // can trim a long clip, but padding a short one repeats a frozen frame.
  return Math.min(10, Math.max(3, Math.ceil(sceneSeconds)));
}

function wanResolution(aspect: AspectRatio): string {
  return aspect === "16:9" ? "720P" : "720P";
}

/** Persist the storyboard as scene rows, replacing any earlier plan. */
export async function createSceneRows(
  userId: string,
  orderId: string,
  storyboard: Storyboard,
): Promise<SceneRow[]> {
  const admin = createAdminClient();
  await admin.from("video_scenes").delete().eq("order_id", orderId);

  const rows = storyboard.scenes.map((scene) => ({
    order_id: orderId,
    user_id: userId,
    scene_index: scene.sceneIndex,
    image_id: scene.imageId,
    purpose: scene.purpose,
    duration_seconds: scene.durationSeconds,
    camera: scene.camera,
    prompt: scene.prompt,
    input_image_url: scene.imageUrl,
    status: "pending" as const,
  }));

  const { data, error } = await admin.from("video_scenes").insert(rows).select("*").returns<SceneRow[]>();
  if (error) throw new Error(`Kunne ikke gemme scener: ${error.message}`);
  return data ?? [];
}

export async function loadScenes(orderId: string): Promise<SceneRow[]> {
  const { data } = await createAdminClient()
    .from("video_scenes")
    .select("*")
    .eq("order_id", orderId)
    .order("scene_index")
    .returns<SceneRow[]>();
  return data ?? [];
}

async function updateScene(id: string, patch: Record<string, unknown>): Promise<void> {
  await createAdminClient().from("video_scenes").update(patch).eq("id", id);
}

/**
 * Submit a scene to WAN.
 *
 * The image URL is a Supabase Storage URL for a photograph we downloaded and
 * re-hosted ourselves — never the listing's own (often signed and expiring)
 * URL, and never a stand-in for the image.
 */
async function submitScene(scene: SceneRow, aspect: AspectRatio): Promise<void> {
  if (!scene.input_image_url) {
    await updateScene(scene.id, {
      status: "failed",
      error_message: "Scenen har intet kildebillede — WAN må ikke generere uden det faktiske foto",
    });
    return;
  }

  try {
    const handle = await createVideoTask({
      imageUrl: scene.input_image_url,
      prompt: scene.prompt,
      negativePrompt: WAN_NEGATIVE_PROMPT,
      durationSeconds: wanClipSeconds(Number(scene.duration_seconds)),
      resolution: wanResolution(aspect),
    });
    console.info(`${LOG} scene ${scene.scene_index} submitted task=${handle.taskId}`);
    await updateScene(scene.id, {
      status: "submitted",
      wan_task_id: handle.taskId,
      attempts: scene.attempts + 1,
      error_message: null,
    });
  } catch (e) {
    const message = e instanceof WanApiError || e instanceof WanConfigError ? e.message : String(e);
    if (isFatalWanError(e)) {
      // Not this scene's fault: leave its attempts untouched so a retry after
      // the configuration is fixed gets the full budget, and stop the job.
      console.error(`${LOG} scene ${scene.scene_index} submit refused: ${message}`);
      await updateScene(scene.id, { status: "pending", error_message: message.slice(0, 500) });
      throw new WanUnavailableError(e instanceof WanApiError ? `WAN ${e.status}` : "WAN ikke konfigureret");
    }
    const attempts = scene.attempts + 1;
    console.error(`${LOG} scene ${scene.scene_index} submit failed (attempt ${attempts}): ${message}`);
    await updateScene(scene.id, {
      attempts,
      // Only the final attempt is terminal; earlier ones go back in the queue.
      status: attempts >= MAX_SCENE_ATTEMPTS ? "failed" : "pending",
      error_message: message.slice(0, 500),
    });
  }
}

/** Poll a submitted scene and, when it finishes, re-host the clip. */
async function pollScene(scene: SceneRow): Promise<void> {
  if (!scene.wan_task_id) {
    await updateScene(scene.id, { status: "pending" });
    return;
  }

  try {
    const status = await getVideoTask(scene.wan_task_id);

    if (status.status === "pending" || status.status === "running") {
      if (scene.status !== "running") await updateScene(scene.id, { status: "running" });
      return;
    }

    if (status.status === "failed") {
      const terminal = scene.attempts >= MAX_SCENE_ATTEMPTS;
      console.error(`${LOG} scene ${scene.scene_index} failed: ${status.message}`);
      await updateScene(scene.id, {
        // Reset the task id so the retry submits a fresh generation rather
        // than polling the task that already failed.
        status: terminal ? "failed" : "pending",
        wan_task_id: terminal ? scene.wan_task_id : null,
        error_message: status.message.slice(0, 500),
      });
      return;
    }

    const buffer = await downloadWanClip(status.videoUrl);
    const path = sceneClipPath(scene.order_id, scene.scene_index, scene.attempts);
    const clipUrl = await storeVideoDeliverable(path, buffer);
    console.info(`${LOG} completed scene ${scene.scene_index} (${(buffer.byteLength / 1024).toFixed(0)} KB)`);
    await updateScene(scene.id, {
      status: "succeeded",
      clip_url: clipUrl,
      error_message: null,
      completed_at: new Date().toISOString(),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`${LOG} scene ${scene.scene_index} poll error: ${message}`);
    // A transient poll/download error must not burn an attempt; only WAN's own
    // failure verdict does that.
    await updateScene(scene.id, { error_message: message.slice(0, 500) });
  }
}

export type SceneProgress = {
  total: number;
  succeeded: number;
  failed: number;
  inFlight: number;
  pending: number;
  done: boolean;
  allSucceeded: boolean;
};

export function summariseScenes(scenes: SceneRow[]): SceneProgress {
  const succeeded = scenes.filter((s) => s.status === "succeeded").length;
  const failed = scenes.filter((s) => s.status === "failed").length;
  const inFlight = scenes.filter((s) => s.status === "submitted" || s.status === "running").length;
  const pending = scenes.filter((s) => s.status === "pending").length;
  return {
    total: scenes.length,
    succeeded, failed, inFlight, pending,
    done: succeeded + failed === scenes.length,
    allSucceeded: succeeded === scenes.length && scenes.length > 0,
  };
}

/**
 * Advance every scene by one step: poll what is in flight, then submit as many
 * pending scenes as the configured concurrency allows.
 *
 * Called repeatedly by the job driver, so no single invocation has to wait for
 * WAN — which is what keeps the whole pipeline inside a serverless timeout.
 */
export async function advanceScenes(orderId: string, aspect: AspectRatio): Promise<SceneProgress> {
  if (videoEngine() === "photo-motion") return advancePhotoScenes(orderId, aspect);

  const config = getWanConfig();
  const scenes = await loadScenes(orderId);

  const active = scenes.filter((s) => s.status === "submitted" || s.status === "running");
  await Promise.all(active.map(pollScene));

  const after = await loadScenes(orderId);
  const stillActive = after.filter((s) => s.status === "submitted" || s.status === "running").length;
  const capacity = Math.max(0, config.maxConcurrentJobs - stillActive);

  const queued = after
    .filter((s) => s.status === "pending" && s.attempts < MAX_SCENE_ATTEMPTS)
    .slice(0, capacity);
  await Promise.all(queued.map((scene) => submitScene(scene, aspect)));

  return summariseScenes(await loadScenes(orderId));
}

/**
 * Re-queue one failed scene without touching the rest of the film.
 *
 * Only a failed scene qualifies: re-running one that succeeded would pay for
 * a WAN generation the film already has.
 */
export async function retryScene(orderId: string, sceneIndex: number): Promise<boolean> {
  const scenes = await loadScenes(orderId);
  const scene = scenes.find((s) => s.scene_index === sceneIndex);
  if (!scene || scene.status !== "failed") return false;
  await updateScene(scene.id, {
    status: "pending",
    wan_task_id: null,
    // A manual retry is a fresh budget, not a continuation of the failed one.
    attempts: 0,
    error_message: null,
  });
  return true;
}

/**
 * Give every permanently failed scene a fresh attempt budget, leaving the
 * scenes that succeeded — and were paid for — exactly as they are.
 */
export async function resetFailedScenes(orderId: string): Promise<number> {
  const { data, error } = await createAdminClient()
    .from("video_scenes")
    .update({ status: "pending", wan_task_id: null, attempts: 0, error_message: null })
    .eq("order_id", orderId)
    .eq("status", "failed")
    .select("id");
  if (error) throw new Error(`Kunne ikke nulstille scener: ${error.message}`);
  return (data ?? []).length;
}

/**
 * Render scene clips from the photographs themselves (see photo-motion.ts),
 * as many as fit in one job step. Scenes left over from an earlier WAN
 * attempt are rendered here too, so switching engines finishes old jobs.
 */
async function advancePhotoScenes(orderId: string, aspect: AspectRatio): Promise<SceneProgress> {
  const scenes = await loadScenes(orderId);
  const todo = scenes.filter((s) => s.status !== "succeeded" && s.status !== "failed" && s.attempts < MAX_SCENE_ATTEMPTS);

  // The photographs' own proportions decide the camera move.
  const imageIds = todo.map((s) => s.image_id).filter((id): id is string => !!id);
  const { data: images } = imageIds.length
    ? await createAdminClient()
        .from("video_source_images")
        .select("id, width, height")
        .in("id", imageIds)
        .returns<{ id: string; width: number; height: number }[]>()
    : { data: [] as { id: string; width: number; height: number }[] };
  const dims = new Map((images ?? []).map((image) => [image.id, image]));

  const started = Date.now();
  for (const scene of todo) {
    if (Date.now() - started > PHOTO_RENDER_BUDGET_MS) break;

    if (!scene.input_image_url) {
      await updateScene(scene.id, { status: "failed", error_message: "Scenen har intet kildebillede" });
      continue;
    }

    const attempts = scene.attempts + 1;
    try {
      const source = await resolveVideoUrl(scene.input_image_url);
      if (!source) throw new Error("Billedet kunne ikke hentes fra lageret");
      const size = scene.image_id ? dims.get(scene.image_id) : undefined;
      const { buffer } = await renderPhotoClip({
        source,
        imageWidth: size?.width ?? 0,
        imageHeight: size?.height ?? 0,
        aspect,
        sceneSeconds: Number(scene.duration_seconds),
        camera: scene.camera,
        index: scene.scene_index,
      });
      const clipUrl = await storeVideoDeliverable(sceneClipPath(scene.order_id, scene.scene_index, attempts), buffer);
      await updateScene(scene.id, {
        status: "succeeded",
        attempts,
        wan_task_id: null,
        clip_url: clipUrl,
        error_message: null,
        completed_at: new Date().toISOString(),
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error(`${LOG} scene ${scene.scene_index} photo render failed (attempt ${attempts}): ${message}`);
      await updateScene(scene.id, {
        attempts,
        status: attempts >= MAX_SCENE_ATTEMPTS ? "failed" : "pending",
        error_message: message.slice(0, 500),
      });
    }
  }

  return summariseScenes(await loadScenes(orderId));
}
