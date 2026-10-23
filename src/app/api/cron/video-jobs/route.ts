import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "crypto";
import { driveActiveJobs } from "@/services/video/driver";

/**
 * Scheduled job driver.
 *
 * Moves every active video job one step forward, so a video finishes even
 * when nobody has its page open. Called by Supabase pg_cron every minute (see
 * supabase/cron/video-jobs.sql) and by Vercel Cron once a day as a backstop —
 * Vercel's Hobby plan does not allow anything more frequent.
 *
 * Authenticated with `Authorization: Bearer $CRON_SECRET`, which is also the
 * header Vercel Cron sends. Without the secret configured the route refuses
 * every call rather than running open to the internet.
 */

export const maxDuration = 60;
export const dynamic = "force-dynamic";

function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization") ?? "";
  const expected = Buffer.from(`Bearer ${secret}`);
  const given = Buffer.from(header);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

async function handle(req: NextRequest) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: "CRON_SECRET is not configured" }, { status: 503 });
  }
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await driveActiveJobs({ maxOrders: 10, startNewStepsForMs: 25_000 });
    return NextResponse.json(summary);
  } catch (e) {
    console.error(`[cron/video-jobs] ${e instanceof Error ? e.message : String(e)}`);
    return NextResponse.json({ error: "Driver failed" }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
