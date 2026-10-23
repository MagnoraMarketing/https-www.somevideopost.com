import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { readImageInfo, IMAGE_EXTENSIONS } from "@/services/property-import/image-file";
import { IMAGE_LIMITS } from "@/services/property-import/download-images";

/**
 * Upload one property photo from the order form.
 *
 * The file lands in the public "video-images" bucket, so it is checked for
 * what it actually is: a JPG, PNG or WEBP by its magic bytes, within the same
 * size limit the importer uses. The stored name and content type come from
 * that check, never from the browser — a renamed HTML or SVG file can no
 * longer end up served from our storage domain.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });

  if (file.size > IMAGE_LIMITS.maxBytes) {
    return NextResponse.json({ error: "Billedet er for stort (maks. 15 MB)" }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const info = readImageInfo(buffer);
  if (!info) {
    return NextResponse.json({ error: "Kun JPG-, PNG- og WEBP-billeder kan bruges" }, { status: 415 });
  }

  const path = `${user.id}/${Date.now()}-${info.hash.slice(0, 16)}.${IMAGE_EXTENSIONS[info.format]}`;

  const { error } = await supabase.storage
    .from("video-images")
    .upload(path, buffer, { contentType: info.contentType, upsert: false });

  if (error) {
    console.error(`[upload-image] ${error.message}`);
    return NextResponse.json({ error: "Billedet kunne ikke gemmes" }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage.from("video-images").getPublicUrl(path);

  return NextResponse.json({ url: publicUrl });
}
