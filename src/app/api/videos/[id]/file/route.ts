import { NextResponse, type NextRequest } from "next/server";
import { loadOwnedOrder, downloadFilename } from "@/services/video/access";
import { resolveVideoUrl } from "@/services/video/media";
import { orderMediaList } from "@/lib/video-media";

/**
 * Play or download an order's video.
 *
 * The one door to a finished film: the customer must own the order and it
 * must be paid (uploaded videos are stored as paid). The response is a
 * redirect to a signed URL valid for an hour, so what reaches the browser
 * expires instead of being a permanent link to the file.
 *
 *   ?clip=N      the N-th file (0 = the film, 1.. = its scene clips)
 *   ?download=1  make the browser save it instead of playing it
 */

const NO_STORE = { "Cache-Control": "private, no-store" };

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const owned = await loadOwnedOrder(id);
  if ("error" in owned) {
    return NextResponse.json({ error: owned.error === "unauthorized" ? "Log ind først" : "Ikke fundet" }, {
      status: owned.error === "unauthorized" ? 401 : 404,
      headers: NO_STORE,
    });
  }

  const { order } = owned;
  if (order.status !== "ready") {
    return NextResponse.json({ error: "Videoen er ikke klar endnu" }, { status: 409, headers: NO_STORE });
  }
  if (!order.paid) {
    return NextResponse.json({ error: "Videoen er ikke betalt" }, { status: 402, headers: NO_STORE });
  }

  const files = orderMediaList(order);
  const clip = Math.max(0, Math.floor(Number(req.nextUrl.searchParams.get("clip") ?? 0)) || 0);
  if (clip >= files.length) {
    return NextResponse.json({ error: "Ikke fundet" }, { status: 404, headers: NO_STORE });
  }

  const download = req.nextUrl.searchParams.get("download") === "1";
  const url = await resolveVideoUrl(files[clip], {
    download: download ? downloadFilename(order.title, clip) : undefined,
  });
  if (!url) {
    return NextResponse.json({ error: "Filen kunne ikke hentes" }, { status: 502, headers: NO_STORE });
  }

  return NextResponse.redirect(url, { status: 302, headers: NO_STORE });
}
