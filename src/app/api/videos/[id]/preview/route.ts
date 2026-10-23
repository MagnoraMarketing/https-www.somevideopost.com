import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { loadOwnedOrder } from "@/services/video/access";
import { resolveVideoUrl, storeVideoDeliverable } from "@/services/video/media";
import { ffmpegAvailable, renderLockedPreview } from "@/services/video/assembler";
import { orderMediaList, videoFileRoute } from "@/lib/video-media";

/**
 * The locked preview for a finished but unpaid video.
 *
 * Rendered once on first request (a few seconds of ffmpeg on a 15-second
 * film), stored privately and reused afterwards. A paid order is sent to the
 * real file instead.
 */

// Downloading the film and rendering the preview.
export const maxDuration = 60;

const NO_STORE = { "Cache-Control": "private, no-store" };

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const owned = await loadOwnedOrder(id);
  if ("error" in owned) {
    return NextResponse.json({ error: "Ikke fundet" }, { status: owned.error === "unauthorized" ? 401 : 404, headers: NO_STORE });
  }
  const { order } = owned;

  if (order.status !== "ready") {
    return NextResponse.json({ error: "Videoen er ikke klar endnu" }, { status: 409, headers: NO_STORE });
  }
  if (order.paid) {
    return NextResponse.redirect(new URL(videoFileRoute(id), req.url), { status: 302, headers: NO_STORE });
  }

  // Already rendered — hand out a fresh signed link to it.
  if (order.preview_video_path) {
    const url = await resolveVideoUrl(order.preview_video_path);
    if (url) return NextResponse.redirect(url, { status: 302, headers: NO_STORE });
  }

  if (!ffmpegAvailable()) {
    return NextResponse.json({ error: "Forhåndsvisning er ikke tilgængelig" }, { status: 503, headers: NO_STORE });
  }

  const source = await resolveVideoUrl(orderMediaList(order)[0]);
  if (!source) return NextResponse.json({ error: "Ikke fundet" }, { status: 404, headers: NO_STORE });

  try {
    const buffer = await renderLockedPreview(source);
    const stored = await storeVideoDeliverable(`properties/${id}/video/preview/preview-${Date.now()}.mp4`, buffer);

    // Remember it so the next view is instant. Older databases without the
    // column simply re-render, which is slower but still correct.
    if (stored.startsWith("storage://")) {
      const { error } = await createAdminClient().from("video_orders").update({ preview_video_path: stored }).eq("id", id);
      if (error) console.warn(`[video-preview] could not record preview for ${id}: ${error.message}`);
    }

    const url = await resolveVideoUrl(stored);
    if (!url) throw new Error("preview could not be signed");
    return NextResponse.redirect(url, { status: 302, headers: NO_STORE });
  } catch (e) {
    console.error(`[video-preview] ${id}: ${e instanceof Error ? e.message : String(e)}`);
    return NextResponse.json({ error: "Forhåndsvisningen kunne ikke laves" }, { status: 500, headers: NO_STORE });
  }
}
