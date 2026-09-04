import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { retryScene } from "@/services/video/wan-generator";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Retry a single failed scene.
 *
 * Regenerating one scene rather than the whole film is the difference between
 * one WAN generation and eight, so a failed shot never costs a full rerun.
 */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string; index: string }> }) {
  const { id, index } = await params;
  const sceneIndex = Number(index);
  if (!Number.isInteger(sceneIndex) || sceneIndex < 0) {
    return NextResponse.json({ error: "Ugyldigt scene-index" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: order } = await supabase
    .from("video_orders")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle<{ id: string }>();
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ok = await retryScene(id, sceneIndex);
  if (!ok) return NextResponse.json({ error: "Scenen findes ikke" }, { status: 404 });

  // A retried scene puts the job back into generation, whatever it moved on to.
  await createAdminClient()
    .from("video_orders")
    .update({ job_state: "generating_clips", status: "processing", error_message: null })
    .eq("id", id);

  return NextResponse.json({ ok: true, sceneIndex });
}
