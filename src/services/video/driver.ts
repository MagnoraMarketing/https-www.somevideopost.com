import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { advanceJob, readJobStatus, type AdvanceResult } from "./job";

/**
 * Server-side job driving.
 *
 * A job used to move only while its page was open in the customer's browser:
 * close the tab and it sat still, and two open tabs could run the same step
 * at once (submitting the same WAN scene twice, and paying for it twice).
 *
 * Every caller now goes through {@link advanceWithLease}: it claims the order
 * for a short window, runs exactly one step, and releases it. The browser, the
 * video list and the scheduled driver (/api/cron/video-jobs) are then just
 * three equivalent ways of saying "move this job along" — whichever arrives
 * first does the work, and the others report the state without touching it.
 */

const LOG = "[video-driver]";

/** Longer than any single step may run (maxDuration is 60s). */
export const LEASE_SECONDS = 75;

/** A job still unfinished this long after it started will not finish by itself. */
export const STALE_AFTER_HOURS = Number(process.env.VIDEO_JOB_STALE_HOURS) || 6;

/** States in which the job waits for the customer, not for us. */
const WAITING_STATES = new Set(["awaiting_images", "completed", "failed"]);

export type Claim = "claimed" | "busy" | "unlocked";

function isMissingColumn(error: { code?: string; message?: string }): boolean {
  return error.code === "42703" || error.code === "PGRST204" || /lease_until|last_advanced_at|advance_count/.test(error.message ?? "");
}

let leaseColumnsMissing = false;

/**
 * Claim an order for one step.
 *
 * `unlocked` means the lease columns do not exist yet (migration 014 not
 * applied): the step runs unguarded, exactly as it did before.
 */
export async function claimJob(orderId: string): Promise<{ claim: Claim; advanceCount: number }> {
  if (leaseColumnsMissing) return { claim: "unlocked", advanceCount: 0 };

  const now = new Date();
  const until = new Date(now.getTime() + LEASE_SECONDS * 1000);
  const { data, error } = await createAdminClient()
    .from("video_orders")
    .update({ lease_until: until.toISOString() })
    .eq("id", orderId)
    .or(`lease_until.is.null,lease_until.lt."${now.toISOString()}"`)
    .select("id, advance_count");

  if (error) {
    if (isMissingColumn(error)) {
      leaseColumnsMissing = true;
      console.warn(`${LOG} lease columns missing — run migration 014; driving without locks`);
      return { claim: "unlocked", advanceCount: 0 };
    }
    throw new Error(`Kunne ikke låse video-ordre ${orderId}: ${error.message}`);
  }

  const row = (data ?? [])[0] as { advance_count?: number } | undefined;
  return row ? { claim: "claimed", advanceCount: row.advance_count ?? 0 } : { claim: "busy", advanceCount: 0 };
}

export async function releaseJob(orderId: string, advanceCount: number): Promise<void> {
  if (leaseColumnsMissing) return;
  const { error } = await createAdminClient()
    .from("video_orders")
    .update({
      lease_until: null,
      last_advanced_at: new Date().toISOString(),
      advance_count: advanceCount + 1,
    })
    .eq("id", orderId);
  if (error) console.error(`${LOG} could not release ${orderId}: ${error.message}`);
}

/**
 * Advance one step if nobody else is, otherwise report where the job is.
 * This is the only way any caller should move a job.
 */
export async function advanceWithLease(orderId: string): Promise<AdvanceResult> {
  return (await stepWithLease(orderId)) ?? readJobStatus(orderId);
}

/** One step under the lease, or null when another caller holds it. */
async function stepWithLease(orderId: string): Promise<AdvanceResult | null> {
  const { claim, advanceCount } = await claimJob(orderId);
  if (claim === "busy") return null;

  try {
    return await advanceJob(orderId);
  } finally {
    if (claim === "claimed") await releaseJob(orderId, advanceCount);
  }
}

type ActiveOrder = {
  id: string;
  user_id: string;
  job_state: string;
  created_at: string;
  started_at: string | null;
};

/** True when a processing job has been going for longer than any real run takes. */
export function isStale(order: { created_at: string; started_at?: string | null }, now = Date.now()): boolean {
  const since = new Date(order.started_at ?? order.created_at).getTime();
  return Number.isFinite(since) && now - since > STALE_AFTER_HOURS * 60 * 60 * 1000;
}

async function failStale(order: ActiveOrder): Promise<void> {
  const message =
    `Videoen blev ikke færdig inden for ${STALE_AFTER_HOURS} timer. ` +
    "Klik \"Prøv igen\" — de scener, der allerede er lavet, genbruges.";
  const { error } = await createAdminClient()
    .from("video_orders")
    .update({ status: "failed", job_state: "failed", error_message: message })
    .eq("id", order.id)
    .eq("status", "processing");
  if (error) console.error(`${LOG} could not fail stale ${order.id}: ${error.message}`);
  else console.warn(`${LOG} order ${order.id} marked failed after ${STALE_AFTER_HOURS}h (${order.job_state})`);
}

export type DriveSummary = {
  considered: number;
  advanced: number;
  busy: number;
  stale: number;
  errors: number;
};

/**
 * Move every active job forward by one step, within a time budget.
 *
 * Steps run one after another rather than in parallel: assembly renders with
 * ffmpeg and two of those at once can exhaust a serverless function's memory.
 * The least recently advanced jobs go first, so no job starves behind a busy
 * one. A new step is only started while there is clearly time left for it.
 */
export async function driveActiveJobs(opts: {
  userId?: string;
  maxOrders?: number;
  startNewStepsForMs?: number;
} = {}): Promise<DriveSummary> {
  const started = Date.now();
  const startWindow = opts.startNewStepsForMs ?? 20_000;
  const summary: DriveSummary = { considered: 0, advanced: 0, busy: 0, stale: 0, errors: 0 };

  const admin = createAdminClient();
  const columns = "id, user_id, job_state, created_at, started_at";
  const build = (orderBy: "last_advanced_at" | "created_at") => {
    let query = admin
      .from("video_orders")
      .select(columns)
      .eq("status", "processing")
      .order(orderBy, { ascending: true, nullsFirst: true })
      .limit(opts.maxOrders ?? 10);
    if (opts.userId) query = query.eq("user_id", opts.userId);
    return query.returns<ActiveOrder[]>();
  };

  let { data: orders, error } = await build("last_advanced_at");
  if (error && isMissingColumn(error)) ({ data: orders, error } = await build("created_at"));
  if (error) throw new Error(`Kunne ikke hente aktive videoer: ${error.message}`);

  for (const order of orders ?? []) {
    if (WAITING_STATES.has(order.job_state)) continue;
    summary.considered++;

    if (isStale(order)) {
      await failStale(order);
      summary.stale++;
      continue;
    }
    if (Date.now() - started > startWindow) break;

    try {
      if (await stepWithLease(order.id)) summary.advanced++;
      else summary.busy++;
    } catch (e) {
      summary.errors++;
      console.error(`${LOG} order ${order.id} step failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  if (summary.considered) {
    console.info(`${LOG} ${JSON.stringify(summary)} in ${Date.now() - started}ms`);
  }
  return summary;
}
