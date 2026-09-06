"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const VIDEO_BUCKET = "videos";
// Guard re-hosting huge files (fetched server-side). ~300 MB is plenty for a
// property walkthrough while keeping us within function memory limits.
const MAX_REHOST_BYTES = 300 * 1024 * 1024;

/**
 * Insert a finished video as a "ready" video order for the current user.
 * Shared by both the link-import and file-upload flows.
 */
async function insertReadyOrder(
  userId: string,
  opts: { title: string; videoUrl: string; propertyId: string | null }
): Promise<{ orderId?: string; error?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("video_orders")
    .insert({
      user_id: userId,
      property_id: opts.propertyId,
      title: opts.title,
      status: "ready",
      // Uploaded videos are the user's own — no per-video generation fee.
      paid: true,
      video_url: opts.videoUrl,
      video_urls: [opts.videoUrl],
      image_urls: [],
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message ?? "Kunne ikke gemme videoen" };

  revalidatePath("/videos");
  revalidatePath("/dashboard");
  return { orderId: data.id as string };
}

/**
 * Try to download an external video URL and re-host it in Supabase Storage so
 * the link is permanent (external workspace links can expire). Falls back to
 * the original URL when the download or upload isn't possible.
 */
async function rehostExternalVideo(url: string, userId: string): Promise<string> {
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) return url;

    const contentType = (res.headers.get("content-type") ?? "").split(";")[0].trim();
    // Only re-host actual video payloads — an HTML page means it's a viewer
    // link, not a direct file, so keep the original URL.
    if (contentType && !contentType.startsWith("video/")) return url;

    const length = Number(res.headers.get("content-length") ?? "0");
    if (length && length > MAX_REHOST_BYTES) return url;

    const buffer = Buffer.from(await res.arrayBuffer());
    if (!buffer.length || buffer.length > MAX_REHOST_BYTES) return url;

    const { createAdminClient } = await import("@/lib/supabase/admin");
    const admin = createAdminClient();
    const ext = contentType === "video/webm" ? "webm" : "mp4";
    const path = `${userId}/import-${Date.now()}.${ext}`;
    const { error } = await admin.storage
      .from(VIDEO_BUCKET)
      .upload(path, buffer, { contentType: contentType || "video/mp4", upsert: true });
    if (error) return url;

    const { data } = admin.storage.from(VIDEO_BUCKET).getPublicUrl(path);
    return data.publicUrl || url;
  } catch {
    return url;
  }
}

/**
 * Create a ready video order from a pasted video URL (e.g. a link to a finished
 * clip in the external Veo 3 workspace). The server re-hosts it when possible.
 */
export async function createVideoFromLink(formData: FormData): Promise<{ orderId?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Ikke logget ind" };

  const title = String(formData.get("title") ?? "").trim() || "Bolig fremvisning";
  const rawUrl = String(formData.get("video_url") ?? "").trim();
  const propertyId = String(formData.get("property_id") ?? "") || null;

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { error: "Indsæt et gyldigt link til videoen (starter med https://)" };
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { error: "Linket skal starte med https://" };
  }

  const videoUrl = await rehostExternalVideo(rawUrl, user.id);
  return insertReadyOrder(user.id, { title, videoUrl, propertyId });
}

/**
 * Issue a short-lived signed upload URL so the browser can upload a video file
 * straight to Supabase Storage — bypassing the serverless request-body limit.
 */
export async function createSignedVideoUpload(
  fileName: string
): Promise<{ path?: string; token?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Ikke logget ind" };

  const safeExt = (fileName.split(".").pop() ?? "mp4").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || "mp4";
  const path = `${user.id}/upload-${Date.now()}.${safeExt}`;

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const admin = createAdminClient();
  const { data, error } = await admin.storage.from(VIDEO_BUCKET).createSignedUploadUrl(path);
  if (error || !data) return { error: error?.message ?? "Kunne ikke klargøre upload" };

  return { path: data.path, token: data.token };
}

/**
 * Finalize a browser upload: turn the stored file path into a ready video order.
 */
export async function finalizeUploadedVideo(formData: FormData): Promise<{ orderId?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Ikke logget ind" };

  const title = String(formData.get("title") ?? "").trim() || "Bolig fremvisning";
  const path = String(formData.get("path") ?? "").trim();
  const propertyId = String(formData.get("property_id") ?? "") || null;

  // Path must live under the user's own folder — never trust a client path blindly.
  if (!path || !path.startsWith(`${user.id}/`)) {
    return { error: "Ugyldig upload — prøv igen" };
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const admin = createAdminClient();
  const { data } = admin.storage.from(VIDEO_BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) return { error: "Kunne ikke finde den uploadede video" };

  return insertReadyOrder(user.id, { title, videoUrl: data.publicUrl, propertyId });
}
