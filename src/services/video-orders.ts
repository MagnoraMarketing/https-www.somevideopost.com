"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getVideoJobsStatus, startVideoGeneration } from "@/lib/google-video";

export async function deleteVideoOrder(orderId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Ikke logget ind" };
  const { error } = await supabase
    .from("video_orders")
    .delete()
    .eq("id", orderId)
    .eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/videos");
  revalidatePath("/dashboard");
  return {};
}

export async function pollVideoOrder(orderId: string): Promise<{
  status: string;
  videoUrl?: string;
  videoUrls?: string[];
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "failed" };

  const { data: order } = await supabase
    .from("video_orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (!order) return { status: "failed" };

  if (order.status === "ready") {
    const urls: string[] = order.video_urls?.length ? order.video_urls : order.video_url ? [order.video_url] : [];
    return { status: "ready", videoUrl: urls[0], videoUrls: urls };
  }

  // Use multi-job IDs if available, else fall back to single job
  const jobIds: string[] = order.video_job_ids?.length
    ? order.video_job_ids
    : order.video_job_id
    ? [order.video_job_id]
    : [];

  if (!jobIds.length) return { status: order.status };

  const result = await getVideoJobsStatus(jobIds, orderId);

  if (result.status === "completed" && result.videoUrls?.length) {
    await supabase.from("video_orders").update({
      status: "ready",
      video_url: result.videoUrls[0],
      video_urls: result.videoUrls,
    }).eq("id", orderId);
    return { status: "ready", videoUrl: result.videoUrls[0], videoUrls: result.videoUrls };
  }

  if (result.status === "failed") {
    await supabase.from("video_orders").update({ status: "failed" }).eq("id", orderId);
    return { status: "failed" };
  }

  return { status: "processing" };
}

export async function restartVideoOrder(orderId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Ikke logget ind" };

  const { data: order } = await supabase
    .from("video_orders")
    .select("image_urls, title, job_state, source_url")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (!order) return { error: "Ordre ikke fundet" };

  // Orders created by the property-video pipeline restart inside it — they
  // have source images, a storyboard and scenes, none of which the legacy
  // Veo path below knows about.
  if (order.job_state && order.job_state !== "pending") {
    const { restartVideoJob } = await import("@/services/video-jobs");
    // Re-import from the listing when there is one; otherwise re-analyse the
    // photographs already in storage.
    const from = order.source_url ? "pending" : "analyzing_images";
    const res = await restartVideoJob(orderId, from);
    if (res.error) return res;
    revalidatePath("/videos");
    revalidatePath(`/videos/${orderId}`);
    return {};
  }

  const imageUrls: string[] = order.image_urls ?? [];
  if (!imageUrls.length) return { error: "Ingen billeder på ordren" };

  await supabase.from("video_orders").update({
    status: "processing",
    video_job_id: null,
    video_job_ids: [],
    video_url: null,
    video_urls: [],
  }).eq("id", orderId);

  try {
    const jobIds = await startVideoGeneration(imageUrls, order.title ?? "Bolig fremvisning");
    if (!jobIds.length) {
      await supabase.from("video_orders").update({ status: "failed" }).eq("id", orderId);
      return { error: "Ingen videoer blev startet — tjek at GEMINI_API_KEY er korrekt og har adgang til Veo 3" };
    }
    await supabase.from("video_orders").update({
      video_job_id: jobIds[0] ?? null,
      video_job_ids: jobIds,
    }).eq("id", orderId);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    await supabase.from("video_orders").update({ status: "failed" }).eq("id", orderId);
    return { error: `Generering fejlede: ${msg.slice(0, 200)}` };
  }

  revalidatePath("/videos");
  revalidatePath(`/videos/${orderId}`);
  return {};
}
