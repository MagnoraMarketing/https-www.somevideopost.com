import "server-only";

/**
 * WAN image-to-video client (Alibaba Cloud Model Studio, Frankfurt).
 *
 * Server-only by construction: the module imports `server-only`, so a client
 * component that reaches for it fails at build time rather than shipping the
 * API key to a browser. Every value below is read from the environment at call
 * time and never returned to a caller.
 *
 *   POST https://{WorkspaceId}.{region}.maas.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis
 *   GET  https://{WorkspaceId}.{region}.maas.aliyuncs.com/api/v1/tasks/{task_id}
 */

export type WanConfig = {
  apiKey: string;
  workspaceId: string;
  region: string;
  model: string;
  maxConcurrentJobs: number;
};

export class WanConfigError extends Error {
  readonly missing: string[];
  constructor(missing: string[]) {
    super(`WAN er ikke konfigureret på serveren: ${missing.join(", ")} mangler`);
    this.name = "WanConfigError";
    this.missing = missing;
  }
}

export class WanApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly requestId?: string;
  constructor(message: string, status: number, code?: string, requestId?: string) {
    super(message);
    this.name = "WanApiError";
    this.status = status;
    this.code = code;
    this.requestId = requestId;
  }
}

/**
 * The image-to-video model used when WAN_MODEL is unset.
 *
 * Model Studio has no "WAN 3.0": the image-to-video line runs 2.1 → 2.7, and
 * the first-frame endpoint this client speaks (`video-synthesis` with
 * `input.img_url`) covers 2.1 through 2.6. Wan 2.7 moved to a different
 * request shape, so pointing WAN_MODEL at it needs a client change, not just
 * a new value. An unknown id is rejected by the API on every single scene,
 * which is why the default has to be a model that actually exists.
 */
export const DEFAULT_WAN_MODEL = "wan2.6-i2v-flash";

/**
 * The generations whose image-to-video models speak the first-frame request
 * this client sends. 2.7 exists but moved to another request shape, and there
 * is no 3.x at all — both are rejected here rather than on every scene.
 */
const SUPPORTED_WAN_GENERATIONS = /^wan2\.[1-6]-i2v(-[a-z0-9-]+)?$/;

/** Ids known to work, quoted back to whoever set the wrong one. */
export const KNOWN_WAN_MODELS = [
  "wan2.6-i2v-flash",
  "wan2.6-i2v-plus",
  "wan2.5-i2v-preview",
] as const;

/**
 * Whether this client can speak to `model` at all.
 *
 * A model id the API does not know fails identically on every scene, after
 * the photographs are uploaded and the storyboard is built — an expensive way
 * to learn that an environment variable holds a value that never existed.
 */
export function wanModelSupported(model: string): boolean {
  return SUPPORTED_WAN_GENERATIONS.test(model.trim());
}

/**
 * The model id in force, trimmed — a value pasted into a dashboard field
 * carries whitespace often enough that it is worth not sending it on.
 */
function configuredModel(): string {
  return process.env.WAN_MODEL?.trim() || DEFAULT_WAN_MODEL;
}

/** Which variables are set, without revealing any of their values. */
export function wanConfigStatus(): {
  ok: boolean;
  missing: string[];
  model: string;
  modelSupported: boolean;
  region: string;
} {
  const missing: string[] = [];
  if (!process.env.ALIBABA_CLOUD_API_KEY) missing.push("ALIBABA_CLOUD_API_KEY");
  if (!process.env.ALIBABA_WORKSPACE_ID) missing.push("ALIBABA_WORKSPACE_ID");
  const model = configuredModel();
  return {
    ok: missing.length === 0,
    missing,
    model,
    modelSupported: wanModelSupported(model),
    region: process.env.WAN_REGION || "eu-central-1",
  };
}

export function getWanConfig(): WanConfig {
  const apiKey = process.env.ALIBABA_CLOUD_API_KEY;
  const workspaceId = process.env.ALIBABA_WORKSPACE_ID;

  const missing: string[] = [];
  if (!apiKey) missing.push("ALIBABA_CLOUD_API_KEY");
  if (!workspaceId) missing.push("ALIBABA_WORKSPACE_ID");
  if (missing.length) throw new WanConfigError(missing);

  const maxConcurrent = Number(process.env.WAN_MAX_CONCURRENT_JOBS || "4");

  return {
    apiKey: apiKey!,
    workspaceId: workspaceId!,
    region: process.env.WAN_REGION || "eu-central-1",
    model: configuredModel(),
    maxConcurrentJobs: Number.isFinite(maxConcurrent) && maxConcurrent > 0 ? Math.min(maxConcurrent, 8) : 4,
  };
}

function baseUrl(config: WanConfig): string {
  return `https://${config.workspaceId}.${config.region}.maas.aliyuncs.com`;
}

function headers(config: WanConfig, async: boolean): Record<string, string> {
  const h: Record<string, string> = {
    Authorization: `Bearer ${config.apiKey}`,
    "Content-Type": "application/json",
    "X-DashScope-WorkSpace": config.workspaceId,
  };
  // Video synthesis is only offered as an async task; the header is what makes
  // the endpoint return a task id instead of blocking.
  if (async) h["X-DashScope-Async"] = "enable";
  return h;
}

type WanErrorBody = { code?: string; message?: string; request_id?: string };

async function parseError(res: Response, fallback: string, model?: string): Promise<WanApiError> {
  let body: WanErrorBody = {};
  try { body = (await res.json()) as WanErrorBody; } catch { /* non-JSON error page */ }
  const message = body.message ?? fallback;
  // A rejected or unknown model id fails identically on every scene, so the
  // error has to name the value that has to change.
  const modelHint =
    model && /model|InvalidParameter|not.?found|unauthor/i.test(`${body.code ?? ""} ${message}`)
      ? ` (WAN_MODEL=${model})`
      : "";
  return new WanApiError(
    `WAN API ${res.status}: ${message}${modelHint}`.slice(0, 400),
    res.status,
    body.code,
    body.request_id,
  );
}

export type WanTaskInput = {
  /**
   * Publicly reachable URL of the *actual* property photograph. This is the
   * hard requirement of the product: WAN animates this image, it does not
   * imagine a property from a text description.
   */
  imageUrl: string;
  prompt: string;
  negativePrompt?: string;
  /** Requested clip length in seconds; WAN quantises to its own grid. */
  durationSeconds?: number;
  /** "480P", "720P" or "1080P". */
  resolution?: string;
  /** Output aspect; WAN derives the frame from the source image otherwise. */
  size?: string;
};

export type WanTaskHandle = {
  taskId: string;
  requestId?: string;
};

/**
 * Submit one image-to-video generation and return its task id.
 *
 * `img_url` carries the actual photograph — the pipeline never falls back to
 * a text-only or URL-only generation (§43).
 */
export async function createVideoTask(input: WanTaskInput, config = getWanConfig()): Promise<WanTaskHandle> {
  const url = `${baseUrl(config)}/api/v1/services/aigc/video-generation/video-synthesis`;

  const body = {
    model: config.model,
    input: {
      prompt: input.prompt,
      ...(input.negativePrompt ? { negative_prompt: input.negativePrompt } : {}),
      img_url: input.imageUrl,
    },
    parameters: {
      ...(input.durationSeconds ? { duration: Math.round(input.durationSeconds) } : {}),
      ...(input.resolution ? { resolution: input.resolution } : {}),
      ...(input.size ? { size: input.size } : {}),
      // Prompt rewriting is what makes a model drift away from the source
      // photograph, so it stays off: property fidelity over cinematic licence.
      prompt_extend: false,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: headers(config, true),
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60_000),
  });

  if (!res.ok) throw await parseError(res, "kunne ikke oprette video-task", config.model);

  const data = (await res.json()) as {
    output?: { task_id?: string; task_status?: string };
    request_id?: string;
    code?: string;
    message?: string;
  };

  if (data.code) {
    throw new WanApiError(
      `WAN afviste opgaven: ${data.message ?? data.code} (WAN_MODEL=${config.model})`,
      200, data.code, data.request_id,
    );
  }
  const taskId = data.output?.task_id;
  if (!taskId) {
    throw new WanApiError("WAN returnerede intet task_id", 200, undefined, data.request_id);
  }

  return { taskId, requestId: data.request_id };
}

// Each state is its own member so callers get proper discriminated-union
// narrowing (a single member with a "pending" | "running" discriminant does
// not narrow away when both values are excluded).
export type WanTaskStatus =
  | { status: "pending" }
  | { status: "running" }
  | { status: "succeeded"; videoUrl: string }
  | { status: "failed"; message: string; code?: string };

/** Map WAN's task_status vocabulary onto the pipeline's three outcomes. */
function mapStatus(raw: string | undefined): "pending" | "running" | "succeeded" | "failed" | "unknown" {
  switch ((raw ?? "").toUpperCase()) {
    case "PENDING":
    case "SUSPENDED":
      return "pending";
    case "RUNNING":
      return "running";
    case "SUCCEEDED":
      return "succeeded";
    case "FAILED":
    case "CANCELED":
    case "UNKNOWN":
      return "failed";
    default:
      return "unknown";
  }
}

export async function getVideoTask(taskId: string, config = getWanConfig()): Promise<WanTaskStatus> {
  const res = await fetch(`${baseUrl(config)}/api/v1/tasks/${encodeURIComponent(taskId)}`, {
    method: "GET",
    headers: headers(config, false),
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) throw await parseError(res, "kunne ikke hente task-status");

  const data = (await res.json()) as {
    output?: {
      task_status?: string;
      video_url?: string;
      code?: string;
      message?: string;
      results?: { url?: string; video_url?: string }[];
    };
    request_id?: string;
  };

  const status = mapStatus(data.output?.task_status);
  if (status === "succeeded") {
    const videoUrl =
      data.output?.video_url ??
      data.output?.results?.[0]?.video_url ??
      data.output?.results?.[0]?.url;
    if (!videoUrl) {
      return { status: "failed", message: "WAN meldte færdig, men returnerede ingen video-URL" };
    }
    return { status: "succeeded", videoUrl };
  }
  if (status === "failed") {
    return {
      status: "failed",
      message: (data.output?.message ?? "WAN-generering fejlede").slice(0, 300),
      code: data.output?.code,
    };
  }
  if (status === "unknown") {
    // An unrecognised status is treated as still running rather than failed —
    // a vocabulary change must not destroy a generation that is in flight.
    return { status: "running" };
  }
  return { status };
}

/** Download a finished clip so it can be re-hosted in Supabase Storage. */
export async function downloadWanClip(videoUrl: string, maxBytes = 200 * 1024 * 1024): Promise<Buffer> {
  const res = await fetch(videoUrl, { signal: AbortSignal.timeout(120_000) });
  if (!res.ok) throw new WanApiError(`Kunne ikke hente WAN-klip (HTTP ${res.status})`, res.status);
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.byteLength > maxBytes) throw new WanApiError("WAN-klippet er for stort", 413);
  if (buffer.byteLength === 0) throw new WanApiError("WAN-klippet var tomt", 502);
  return buffer;
}
