import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { advanceJob } from "@/services/video/job";

/**
 * Drive one video job forward by a single pipeline step.
 *
 * The client polls this while a video is generating. Keeping the work to one
 * step per request is what lets an inherently long pipeline (property import,
 * AI analysis, several minutes of WAN generation, then assembly) run inside a
 * serverless function's time limit.
 */

// Assembly is the longest single step: it downloads every clip and runs an
// ffmpeg render. 60s is the Vercel Hobby ceiling.
export const maxDuration = 60;

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Ownership is checked against the caller's own RLS-bound client before any
  // service-role work happens inside the pipeline.
  const { data: order } = await supabase
    .from("video_orders")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle<{ id: string }>();
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    return NextResponse.json(await advanceJob(id));
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`[video-jobs] advance failed for ${id}: ${message}`);
    return NextResponse.json({ error: message.slice(0, 300) }, { status: 500 });
  }
}
