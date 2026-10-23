import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { driveActiveJobs } from "@/services/video/driver";

/**
 * Move the signed-in customer's active videos along.
 *
 * The video list calls this every few seconds while something is generating.
 * It goes through the same leased driver as the video page and the scheduled
 * job, so it can never run a step another caller is already running.
 *
 * This route used to poll only the old Google Veo operations and mark every
 * order without Veo ids as failed after three minutes — which, since the
 * property-video pipeline has no Veo ids, failed every new video whose list
 * page happened to be open. Legacy Veo orders are still finished here: the
 * job driver polls their operations on the path they started on.
 */

// One step can import photographs or render with ffmpeg.
export const maxDuration = 60;

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const summary = await driveActiveJobs({ userId: user.id, maxOrders: 5, startNewStepsForMs: 15_000 });
    return NextResponse.json({ updated: summary.advanced + summary.stale });
  } catch (e) {
    console.error(`[poll-video-status] ${e instanceof Error ? e.message : String(e)}`);
    return NextResponse.json({ error: "Status kunne ikke opdateres" }, { status: 500 });
  }
}
