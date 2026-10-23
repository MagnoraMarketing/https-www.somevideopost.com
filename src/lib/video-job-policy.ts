/**
 * Decisions about video jobs that need no database: where a retry resumes,
 * when a new order is a duplicate, and when a customer has too many running.
 * Kept pure so the self-test can pin them down.
 */

export type RestartState = "pending" | "analyzing_images" | "generating_clips" | "assembling_video";

/**
 * Where a failed or stalled job picks up again.
 *
 * The expensive part of a video is the WAN scenes, so a retry reuses every
 * scene that already succeeded: when all of them did, only the ffmpeg render
 * runs again; when some failed, only those are regenerated. Without scenes the
 * stored photographs are reused, and only a job with nothing at all starts
 * from the listing again.
 */
export function chooseRestartState(input: {
  sceneStatuses: string[];
  storedImageCount: number;
}): RestartState {
  const { sceneStatuses, storedImageCount } = input;
  if (sceneStatuses.length > 0) {
    return sceneStatuses.every((s) => s === "succeeded") ? "assembling_video" : "generating_clips";
  }
  if (storedImageCount > 0) return "analyzing_images";
  return "pending";
}

export type OrderLimits = {
  /** Jobs one customer may have generating at once. */
  maxActive: number;
  /** New generated videos one customer may start per rolling 24 hours. */
  maxPerDay: number;
  /** A repeat submission of the same order within this window is the same order. */
  duplicateWindowSeconds: number;
};

function positiveInt(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

export function orderLimits(env: Record<string, string | undefined> = process.env): OrderLimits {
  return {
    maxActive: positiveInt(env.VIDEO_MAX_ACTIVE_JOBS_PER_USER, 3),
    maxPerDay: positiveInt(env.VIDEO_MAX_ORDERS_PER_DAY, 10),
    duplicateWindowSeconds: 120,
  };
}

export type RecentOrder = {
  id: string;
  status: string;
  job_state?: string | null;
  source_url: string | null;
  title: string | null;
  created_at: string;
};

/**
 * An order the customer just submitted again — a double click, a resubmitted
 * form, a back-button retry. Matching on listing URL (or title when there is
 * no URL) within a short window, among orders still being made.
 */
export function findDuplicateOrder(
  recent: RecentOrder[],
  candidate: { source_url: string | null; title: string | null },
  limits: OrderLimits,
  now = Date.now(),
): RecentOrder | null {
  const key = (o: { source_url: string | null; title: string | null }) =>
    (o.source_url?.trim().toLowerCase() || `title:${o.title?.trim().toLowerCase() ?? ""}`);
  const candidateKey = key(candidate);
  return (
    recent.find(
      (o) =>
        o.status === "processing" &&
        now - new Date(o.created_at).getTime() <= limits.duplicateWindowSeconds * 1000 &&
        key(o) === candidateKey,
    ) ?? null
  );
}

export type LimitVerdict = { ok: true } | { ok: false; reason: "busy" | "daily" };

/** Whether a customer may start another generated video right now. */
export function checkOrderLimits(
  recent: RecentOrder[],
  limits: OrderLimits,
  now = Date.now(),
): LimitVerdict {
  // A job waiting for the customer's photographs costs nothing while it waits.
  const active = recent.filter((o) => o.status === "processing" && o.job_state !== "awaiting_images").length;
  if (active >= limits.maxActive) return { ok: false, reason: "busy" };
  const today = recent.filter((o) => now - new Date(o.created_at).getTime() < 24 * 60 * 60 * 1000).length;
  if (today >= limits.maxPerDay) return { ok: false, reason: "daily" };
  return { ok: true };
}

/** A listing URL the importer may be pointed at: http(s), no credentials, sane length. */
export function normaliseSourceUrl(raw: string | null | undefined): string | null | "invalid" {
  const value = raw?.trim();
  if (!value) return null;
  if (value.length > 2048) return "invalid";
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "invalid";
    if (url.username || url.password) return "invalid";
    return url.toString();
  } catch {
    return "invalid";
  }
}
