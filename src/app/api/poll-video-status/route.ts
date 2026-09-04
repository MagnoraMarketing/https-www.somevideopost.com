import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getVideoJobsStatus } from "@/lib/google-video";

// Polls Veo and streams finished clips into Supabase Storage.
// 60s is the Vercel Hobby ceiling; without this the route is cut off at 10s.
export const maxDuration = 60;

// A real Veo job finishes in minutes; anything still processing after this is
// stuck, so fail it instead of showing a progress bar that lingers for hours.
const MAX_PROCESSING_MS = 30 * 60 * 1000; // 30 minutes
// An order that never got job IDs can never complete — fail it quickly (after a
// short grace window covering the create→start race).
const NO_JOB_GRACE_MS = 3 * 60 * 1000; // 3 minutes

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: orders } = await supabase
    .from("video_orders")
    .select("id, video_job_id, video_job_ids, status, created_at")
    .eq("user_id", user.id)
    .eq("status", "processing");

  if (!orders?.length) return NextResponse.json({ updated: 0 });

  let updated = 0;
  const errors: string[] = [];

  await Promise.all(
    orders.map(async (order) => {
      // Auto-fail orders stuck for more than 30 minutes with no job IDs
      const age = Date.now() - new Date(order.created_at).getTime();

      const jobIds: string[] = (order as any).video_job_ids?.length
        ? (order as any).video_job_ids
        : order.video_job_id
        ? [order.video_job_id]
        : [];

      if (!jobIds.length) {
        // No jobs were ever started for this order — it can never complete.
        if (age > NO_JOB_GRACE_MS) {
          await supabase.from("video_orders").update({ status: "failed" }).eq("id", order.id);
          updated++;
        }
        return;
      }

      try {
        const result = await getVideoJobsStatus(jobIds, order.id);
        if (result.status === "completed") {
          await supabase.from("video_orders").update({
            status: "ready",
            ...(result.videoUrls?.length && {
              video_url: result.videoUrls[0],
              video_urls: result.videoUrls,
            }),
          }).eq("id", order.id);
          updated++;
        } else if (result.status === "failed") {
          await supabase.from("video_orders").update({ status: "failed" }).eq("id", order.id);
          updated++;
        } else if (age > MAX_PROCESSING_MS) {
          // Still in_progress/queued after 6 hours — mark failed
          await supabase.from("video_orders").update({ status: "failed" }).eq("id", order.id);
          updated++;
        }
      } catch (e) {
        errors.push(String(e));
      }
    })
  );

  return NextResponse.json({ updated, errors: errors.length ? errors : undefined });
}
