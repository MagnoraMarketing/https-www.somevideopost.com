"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { startVideoGeneration } from "@/lib/google-video";
import { isLegacyVeoOrder } from "@/services/video/job";
import { deleteOrderFiles } from "@/services/video/media";

/**
 * Delete an order together with everything stored for it — photographs,
 * scene clips, the film and its preview. Scene and image rows go with the
 * order through their foreign keys.
 */
export async function deleteVideoOrder(orderId: string): Promise<{ error?: string }> {
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

  const { error } = await supabase
    .from("video_orders")
    .delete()
    .eq("id", orderId)
    .eq("user_id", user.id);
  if (error) return { error: error.message };

  await deleteOrderFiles(user.id, orderId);

  revalidatePath("/videos");
  revalidatePath("/dashboard");
  return {};
}

/**
 * "Genstart" from the video list.
 *
 * Orders made by the property-video pipeline resume inside it, reusing the
 * scenes they already have. Only orders that really were started on the old
 * Google Veo path — recognisable by their Veo operation ids — are restarted
 * there. Deciding on job_state instead sent a new order that failed early
 * (job_state still "pending") off to Veo.
 */
export async function restartVideoOrder(orderId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Ikke logget ind" };

  const { data: order } = await supabase
    .from("video_orders")
    .select("image_urls, title, video_job_id, video_job_ids")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle<{ image_urls: string[] | null; title: string | null; video_job_id: string | null; video_job_ids: string[] | null }>();

  if (!order) return { error: "Ordre ikke fundet" };

  if (!isLegacyVeoOrder(order)) {
    const { restartVideoJob } = await import("@/services/video-jobs");
    const res = await restartVideoJob(orderId);
    if (res.error) return res;
    revalidatePath("/videos");
    revalidatePath(`/videos/${orderId}`);
    return {};
  }

  // Ownership is established above; the writes go through the service role
  // because customers cannot change an order's status themselves.
  const admin = createAdminClient();
  const imageUrls: string[] = order.image_urls ?? [];
  if (!imageUrls.length) return { error: "Ingen billeder på ordren" };

  await admin.from("video_orders").update({
    status: "processing",
    video_job_id: null,
    video_job_ids: [],
    video_url: null,
    video_urls: [],
  }).eq("id", orderId);

  try {
    const jobIds = await startVideoGeneration(imageUrls, order.title ?? "Bolig fremvisning");
    if (!jobIds.length) {
      await admin.from("video_orders").update({ status: "failed" }).eq("id", orderId);
      return { error: "Ingen videoer blev startet — tjek at GEMINI_API_KEY er korrekt og har adgang til Veo 3" };
    }
    await admin.from("video_orders").update({
      video_job_id: jobIds[0] ?? null,
      video_job_ids: jobIds,
    }).eq("id", orderId);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    await admin.from("video_orders").update({ status: "failed" }).eq("id", orderId);
    return { error: `Generering fejlede: ${msg.slice(0, 200)}` };
  }

  revalidatePath("/videos");
  revalidatePath(`/videos/${orderId}`);
  return {};
}
