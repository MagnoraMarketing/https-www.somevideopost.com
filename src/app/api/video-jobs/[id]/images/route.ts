import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { readImageInfo } from "@/services/property-import/image-file";
import { storeSourceImages } from "@/services/property-import/store-images";
import { IMAGE_LIMITS } from "@/services/property-import/download-images";
import { resumeWithUploadedImages } from "@/services/video/job";
import type { DownloadedImage } from "@/services/property-import/download-images";

/**
 * Manual upload fallback.
 *
 * Uploaded photographs enter the *same* pipeline as imported ones: they are
 * validated, stored and recorded identically, so analysis, selection,
 * storyboard, WAN and assembly are all unchanged downstream. The only thing
 * that differs is where the bytes came from.
 */

export const maxDuration = 60;

const MAX_FILES = 24;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

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

  const form = await req.formData();
  const files = form.getAll("files").filter((f): f is File => f instanceof File).slice(0, MAX_FILES);
  if (!files.length) return NextResponse.json({ error: "Ingen filer" }, { status: 400 });

  const accepted: DownloadedImage[] = [];
  const rejected: { name: string; reason: string }[] = [];
  const seen = new Set<string>();

  for (const [index, file] of files.entries()) {
    if (file.size > IMAGE_LIMITS.maxBytes) {
      rejected.push({ name: file.name, reason: "filen er for stor" });
      continue;
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    // The browser's declared type is not trusted; the magic bytes decide.
    const info = readImageInfo(buffer);
    if (!info) {
      rejected.push({ name: file.name, reason: "ikke et gyldigt JPG-, PNG- eller WEBP-billede" });
      continue;
    }
    if (info.width < IMAGE_LIMITS.minWidth || info.height < IMAGE_LIMITS.minHeight) {
      rejected.push({ name: file.name, reason: `for lav opløsning (${info.width}x${info.height})` });
      continue;
    }
    if (seen.has(info.hash)) {
      rejected.push({ name: file.name, reason: "dublet" });
      continue;
    }
    seen.add(info.hash);

    accepted.push({
      buffer,
      info,
      candidate: {
        // "upload:" marks the origin so no third-party source URL is recorded.
        url: `upload:${file.name}`,
        method: "upload",
        position: index,
        declaredWidth: info.width,
        declaredHeight: info.height,
        score: 100,
      },
    });
  }

  if (!accepted.length) {
    return NextResponse.json({ error: "Ingen af filerne kunne bruges", rejected }, { status: 400 });
  }

  const { stored, failures } = await storeSourceImages(user.id, id, accepted);
  if (!stored.length) {
    return NextResponse.json({ error: "Billederne kunne ikke gemmes", failures }, { status: 500 });
  }

  // Uploads unblock a job that stopped for want of photographs.
  await resumeWithUploadedImages(id);

  console.info(`[property-import] stored ${stored.length} uploaded images for order ${id}`);
  return NextResponse.json({
    ok: true,
    stored: stored.length,
    rejected,
    images: stored.map((s) => ({ id: s.id, url: s.storageUrl, width: s.width, height: s.height })),
  });
}
