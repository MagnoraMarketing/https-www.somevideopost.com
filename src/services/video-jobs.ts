"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_VIDEO_STYLE, isVideoStyleId, type VideoStyleId } from "@/lib/video-styles";
import { advanceJob, type AdvanceResult, type JobState } from "@/services/video/job";
import { downloadImages } from "@/services/property-import/download-images";
import { storeSourceImages } from "@/services/property-import/store-images";
import type { ImageCandidate } from "@/services/property-import/extract-images";
import type { AspectRatio } from "@/services/video/assembler";
import { loadScenes } from "@/services/video/wan-generator";

/**
 * Server actions for the property-video pipeline.
 *
 * Creating an order does the minimum — record the choice and hand off to the
 * job state machine — so no request has to wait on scraping, AI or WAN.
 */

function parseAspect(value: unknown): AspectRatio {
  return value === "1:1" || value === "16:9" ? value : "9:16";
}

/**
 * Create a video order from a listing URL and/or images the customer already
 * picked in the form, then take the first pipeline step.
 */
export async function createPropertyVideoOrder(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const title = String(formData.get("title") ?? "").trim() || null;
  const rawStyle = String(formData.get("video_style") ?? "");
  const videoStyle: VideoStyleId = isVideoStyleId(rawStyle) ? rawStyle : DEFAULT_VIDEO_STYLE;
  const aspectRatio = parseAspect(formData.get("aspect_ratio"));
  const propertyId = String(formData.get("property_id") ?? "") || null;

  const sourceUrl = String(formData.get("source_url") ?? formData.get("booking_url") ?? "").trim() || null;
  const imageUrls = formData.getAll("image_urls[]").map(String).filter((u) => u.startsWith("http"));

  const { data: order, error } = await supabase
    .from("video_orders")
    .insert({
      user_id: user.id,
      property_id: propertyId,
      title,
      // image_urls stays populated so existing screens (the order list, the
      // "your images" strip) keep rendering for this order.
      image_urls: imageUrls,
      status: "processing",
      job_state: "pending",
      video_style: videoStyle,
      aspect_ratio: aspectRatio,
      source_url: sourceUrl,
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !order) {
    console.error("[video-jobs] could not create order:", error?.message);
    redirect("/videos?error=create");
  }

  // Images the customer chose in the form are already in our storage, but the
  // pipeline needs validated metadata (dimensions, hash) for each one — so they
  // are read back through the same download/validate path as an import.
  if (imageUrls.length) {
    try {
      const candidates: ImageCandidate[] = imageUrls.map((url, position) => ({
        url, method: "upload", position, score: 100,
      }));
      const { images } = await downloadImages(candidates, imageUrls.length);
      if (images.length) await storeSourceImages(user.id, order.id, images);
    } catch (e) {
      console.error("[video-jobs] could not adopt form images:", e instanceof Error ? e.message : String(e));
    }
  }

  // First step runs inline so the customer lands on a page that is already
  // moving; everything after this is driven by the client's poll loop.
  try {
    await advanceJob(order.id);
  } catch (e) {
    console.error("[video-jobs] first step failed:", e instanceof Error ? e.message : String(e));
  }

  redirect(`/videos/${order.id}?started=1`);
}

export type JobStatusView = AdvanceResult & {
  videoStyle: VideoStyleId;
  scenes: {
    index: number;
    status: string;
    attempts: number;
    purpose: string | null;
    clipUrl: string | null;
    error: string | null;
  }[];
};

/**
 * Advance the job and report where it is. Called by the video page's poll loop;
 * ownership is enforced against the caller's own session.
 */
export async function pollVideoJob(orderId: string): Promise<JobStatusView | { error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Ikke logget ind" };

  const { data: order } = await supabase
    .from("video_orders")
    .select("id, video_style")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle<{ id: string; video_style: VideoStyleId }>();
  if (!order) return { error: "Ordren findes ikke" };

  try {
    const result = await advanceJob(orderId);
    const scenes = await loadScenes(orderId);
    return {
      ...result,
      videoStyle: order.video_style ?? DEFAULT_VIDEO_STYLE,
      scenes: scenes.map((s) => ({
        index: s.scene_index,
        status: s.status,
        attempts: s.attempts,
        purpose: s.purpose,
        clipUrl: s.clip_url,
        error: s.error_message,
      })),
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e) };
  }
}

/** Put a stalled or failed job back into the pipeline from the top. */
export async function restartVideoJob(orderId: string, from: JobState = "pending"): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Ikke logget ind" };

  const { data: order } = await supabase
    .from("video_orders")
    .select("id")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle<{ id: string }>();
  if (!order) return { error: "Ordren findes ikke" };

  await createAdminClient()
    .from("video_orders")
    .update({ job_state: from, status: "processing", error_message: null })
    .eq("id", orderId);

  revalidatePath(`/videos/${orderId}`);
  return {};
}
