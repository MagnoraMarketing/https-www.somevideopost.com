import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { PRIVATE_VIDEO_BUCKET, parseStorageRef, toStorageRef } from "@/lib/video-media";
import { VIDEO_BUCKET } from "@/services/property-import/store-images";

/**
 * Storage and hand-out of generated video files.
 *
 * New renders go to the private bucket and are recorded as storage references
 * (see lib/video-media.ts). If that bucket does not exist yet — migration 014
 * not applied — the file goes to the public "videos" bucket exactly as before,
 * so generation never fails over a delivery detail.
 */

const LOG = "[video-media]";

/** Signed playback links: long enough for a viewing session, short enough not to leak. */
export const PLAYBACK_URL_TTL_SECONDS = 60 * 60;

/**
 * Links handed to Facebook / Instagram, which fetch the file themselves —
 * sometimes minutes after the post is created.
 */
export const SOCIAL_SHARE_URL_TTL_SECONDS = 7 * 24 * 60 * 60;

let privateBucketMissing = false;

function isMissingBucket(message: string): boolean {
  return /bucket not found/i.test(message);
}

/**
 * Upload a video file and return what to store on the order: a private
 * storage reference, or a public URL when private storage is unavailable.
 */
export async function storeVideoDeliverable(path: string, buffer: Buffer): Promise<string> {
  const admin = createAdminClient();

  if (!privateBucketMissing) {
    const { error } = await admin.storage
      .from(PRIVATE_VIDEO_BUCKET)
      .upload(path, buffer, { contentType: "video/mp4", upsert: true });
    if (!error) return toStorageRef(PRIVATE_VIDEO_BUCKET, path);
    if (!isMissingBucket(error.message)) throw new Error(`Video upload fejlede: ${error.message}`);
    privateBucketMissing = true;
    console.warn(`${LOG} private bucket "${PRIVATE_VIDEO_BUCKET}" missing — run migration 014; using public storage`);
  }

  const { error } = await admin.storage
    .from(VIDEO_BUCKET)
    .upload(path, buffer, { contentType: "video/mp4", upsert: true });
  if (error) throw new Error(`Video upload fejlede: ${error.message}`);
  return admin.storage.from(VIDEO_BUCKET).getPublicUrl(path).data.publicUrl;
}

/**
 * Turn a stored value into something a browser or ffmpeg can fetch.
 *
 * Plain URLs (every order from before private delivery) pass through
 * unchanged. References become signed URLs; `download` sets the filename the
 * browser saves the file as.
 */
export async function resolveVideoUrl(
  value: string | null | undefined,
  opts: { ttlSeconds?: number; download?: string } = {},
): Promise<string | null> {
  if (!value) return null;
  const ref = parseStorageRef(value);
  if (!ref) return value;

  const { data, error } = await createAdminClient().storage
    .from(ref.bucket)
    .createSignedUrl(ref.path, opts.ttlSeconds ?? PLAYBACK_URL_TTL_SECONDS, opts.download ? { download: opts.download } : undefined);
  if (error || !data?.signedUrl) {
    console.error(`${LOG} could not sign ${ref.bucket}/${ref.path}: ${error?.message ?? "no url"}`);
    return null;
  }
  return data.signedUrl;
}

/**
 * Remove every stored file belonging to an order: the source photographs,
 * scene clips, the final film and its preview, in both the private and the
 * legacy public bucket. Best effort — a storage hiccup must not keep the
 * order itself from being deleted.
 */
export async function deleteOrderFiles(userId: string, orderId: string): Promise<void> {
  const admin = createAdminClient();
  const targets: { bucket: string; prefix: string }[] = [
    { bucket: PRIVATE_VIDEO_BUCKET, prefix: `properties/${orderId}` },
    { bucket: VIDEO_BUCKET, prefix: `properties/${orderId}` },
    { bucket: "video-images", prefix: `${userId}/properties/${orderId}` },
  ];

  for (const { bucket, prefix } of targets) {
    try {
      const paths = await listRecursive(bucket, prefix);
      for (let i = 0; i < paths.length; i += 100) {
        await admin.storage.from(bucket).remove(paths.slice(i, i + 100));
      }
      if (paths.length) console.info(`${LOG} removed ${paths.length} file(s) from ${bucket} for order ${orderId}`);
    } catch (e) {
      console.warn(`${LOG} cleanup of ${bucket}/${prefix} failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
}

async function listRecursive(bucket: string, prefix: string, depth = 0): Promise<string[]> {
  if (depth > 6) return [];
  const { data, error } = await createAdminClient().storage.from(bucket).list(prefix, { limit: 1000 });
  if (error || !data) return [];
  const out: string[] = [];
  for (const entry of data) {
    const full = `${prefix}/${entry.name}`;
    // Folders come back without an id; files have one.
    if (entry.id) out.push(full);
    else out.push(...(await listRecursive(bucket, full, depth + 1)));
  }
  return out;
}
