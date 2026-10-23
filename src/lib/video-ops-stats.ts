/**
 * Operational overview of the video pipeline for the admin page: volume,
 * outcomes, processing time, WAN usage and the errors behind failures.
 *
 * Pure so the self-test can check the arithmetic. Inputs carry no customer
 * data beyond ids and timestamps.
 */

export type OpsOrder = {
  status: string;
  job_state: string | null;
  paid: boolean | null;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
};

export type OpsScene = {
  status: string;
  attempts: number;
  duration_seconds: number | string;
};

export type VideoOpsStats = {
  total: number;
  completed: number;
  failed: number;
  processing: number;
  awaitingImages: number;
  paid: number;
  /** Completed ÷ (completed + failed), 0–100; null with nothing settled. */
  successRate: number | null;
  /** Median minutes from start to completion. */
  medianMinutes: number | null;
  /** WAN generation requests made (every attempt is billed). */
  wanSubmissions: number;
  /** Seconds of footage in scenes that succeeded. */
  wanSecondsDelivered: number;
  scenesFailed: number;
  topErrors: { message: string; count: number }[];
};

function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function summariseVideoOps(orders: OpsOrder[], scenes: OpsScene[]): VideoOpsStats {
  const completed = orders.filter((o) => o.status === "ready").length;
  const failed = orders.filter((o) => o.status === "failed").length;
  const settled = completed + failed;

  const minutes = orders
    .filter((o) => o.status === "ready" && o.started_at && o.completed_at)
    .map((o) => (new Date(o.completed_at!).getTime() - new Date(o.started_at!).getTime()) / 60_000)
    .filter((m) => Number.isFinite(m) && m >= 0);

  const errorCounts = new Map<string, number>();
  for (const o of orders) {
    if (o.status !== "failed" || !o.error_message) continue;
    // Group by the start of the message: the tail often carries an id.
    const key = o.error_message.slice(0, 90);
    errorCounts.set(key, (errorCounts.get(key) ?? 0) + 1);
  }

  return {
    total: orders.length,
    completed,
    failed,
    processing: orders.filter((o) => o.status === "processing" && o.job_state !== "awaiting_images").length,
    awaitingImages: orders.filter((o) => o.job_state === "awaiting_images").length,
    paid: orders.filter((o) => o.paid).length,
    successRate: settled ? Math.round((completed / settled) * 100) : null,
    medianMinutes: median(minutes),
    wanSubmissions: scenes.reduce((sum, s) => sum + (s.attempts ?? 0), 0),
    wanSecondsDelivered: scenes
      .filter((s) => s.status === "succeeded")
      .reduce((sum, s) => sum + Number(s.duration_seconds || 0), 0),
    scenesFailed: scenes.filter((s) => s.status === "failed").length,
    topErrors: [...errorCounts.entries()]
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
  };
}
