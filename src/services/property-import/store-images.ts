import { createAdminClient } from "@/lib/supabase/admin";
import { IMAGE_EXTENSIONS } from "./image-file";
import type { DownloadedImage } from "./download-images";

/**
 * Supabase Storage for the actual property photographs.
 *
 * Reuses the existing public "video-images" bucket. Paths start with the owner
 * id so the bucket's existing RLS policies (which key on the first path
 * segment) keep working for images a customer uploads directly.
 *
 *   {userId}/properties/{orderId}/original/{n}-{hash}.jpg
 */

export type StoredImage = {
  id: string;
  orderId: string;
  sourceUrl: string | null;
  storagePath: string;
  storageUrl: string;
  width: number;
  height: number;
  fileSize: number;
  position: number;
  extractionMethod: string;
  imageHash: string;
};

export const SOURCE_IMAGE_BUCKET = "video-images";
export const VIDEO_BUCKET = "videos";

export function originalImagePath(userId: string, orderId: string, index: number, hash: string, ext: string): string {
  return `${userId}/properties/${orderId}/original/${String(index).padStart(2, "0")}-${hash.slice(0, 12)}.${ext}`;
}

export function sceneClipPath(orderId: string, sceneIndex: number, attempt: number): string {
  return `properties/${orderId}/video/scenes/scene-${String(sceneIndex).padStart(2, "0")}-a${attempt}.mp4`;
}

export function finalVideoPath(orderId: string): string {
  return `properties/${orderId}/video/final/${orderId}-${Date.now()}.mp4`;
}

/**
 * Upload the downloaded photographs and record their metadata.
 *
 * Uses the service-role client: this runs inside a background job step with no
 * user cookies, and the metadata table is written on the customer's behalf.
 */
export async function storeSourceImages(
  userId: string,
  orderId: string,
  images: DownloadedImage[],
): Promise<{ stored: StoredImage[]; failures: { url: string; reason: string }[] }> {
  const admin = createAdminClient();
  const stored: StoredImage[] = [];
  const failures: { url: string; reason: string }[] = [];

  for (const [index, image] of images.entries()) {
    const ext = IMAGE_EXTENSIONS[image.info.format];
    const path = originalImagePath(userId, orderId, index, image.info.hash, ext);

    const { error: uploadError } = await admin.storage
      .from(SOURCE_IMAGE_BUCKET)
      .upload(path, image.buffer, { contentType: image.info.contentType, upsert: true });

    if (uploadError) {
      failures.push({ url: image.candidate.url, reason: `upload fejlede: ${uploadError.message}` });
      continue;
    }

    const { data: publicUrl } = admin.storage.from(SOURCE_IMAGE_BUCKET).getPublicUrl(path);

    const row = {
      order_id: orderId,
      user_id: userId,
      source_url: image.candidate.url.startsWith("upload:") ? null : image.candidate.url,
      storage_path: path,
      storage_url: publicUrl.publicUrl,
      width: image.info.width,
      height: image.info.height,
      file_size: image.info.byteLength,
      position: index,
      extraction_method: image.candidate.method,
      image_hash: image.info.hash,
    };

    const { data, error } = await admin
      .from("video_source_images")
      // A retried import re-uploads the same photograph; the (order_id, hash)
      // unique index turns that into an update rather than a duplicate row.
      .upsert(row, { onConflict: "order_id,image_hash" })
      .select("id")
      .single<{ id: string }>();

    if (error || !data) {
      failures.push({ url: image.candidate.url, reason: `metadata fejlede: ${error?.message ?? "ukendt"}` });
      continue;
    }

    stored.push({
      id: data.id,
      orderId,
      sourceUrl: row.source_url,
      storagePath: path,
      storageUrl: row.storage_url,
      width: row.width,
      height: row.height,
      fileSize: row.file_size,
      position: index,
      extractionMethod: row.extraction_method,
      imageHash: row.image_hash,
    });
  }

  return { stored, failures };
}

/** Upload a generated clip or the final film to the "videos" bucket. */
export async function storeVideoFile(path: string, buffer: Buffer): Promise<string> {
  const admin = createAdminClient();
  const { error } = await admin.storage
    .from(VIDEO_BUCKET)
    .upload(path, buffer, { contentType: "video/mp4", upsert: true });
  if (error) throw new Error(`Video upload fejlede: ${error.message}`);
  const { data } = admin.storage.from(VIDEO_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
