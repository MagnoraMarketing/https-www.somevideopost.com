"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { loadOwnedOrder } from "@/services/video/access";
import { buildEmbedCode, embedUrl, generateShareToken } from "@/lib/video-media";

export type SharingState = {
  enabled: boolean;
  url?: string;
  embedCode?: string;
  error?: string;
};

/**
 * Turn the public embed / share page for a video on or off.
 *
 * Only a finished, paid video can be shared. The token is kept when sharing
 * is turned off, so turning it back on revives existing embeds; until then
 * every embed and link shows "no longer available" immediately.
 */
export async function setVideoSharing(orderId: string, enabled: boolean): Promise<SharingState> {
  const owned = await loadOwnedOrder(orderId);
  if ("error" in owned) return { enabled: false, error: "Ordren findes ikke" };
  const { order } = owned;

  if (enabled && (order.status !== "ready" || !order.paid)) {
    return { enabled: false, error: "Kun en færdig og betalt video kan deles." };
  }

  const token = order.share_token ?? (enabled ? generateShareToken() : null);
  const { error } = await createAdminClient()
    .from("video_orders")
    .update({ share_enabled: enabled, share_token: token })
    .eq("id", orderId);

  if (error) {
    console.error(`[video-sharing] ${orderId}: ${error.message}`);
    return {
      enabled: !!order.share_enabled,
      error: /share_/.test(error.message)
        ? "Deling er ikke slået til endnu — databaseopdateringen (migration 014) mangler."
        : "Delingen kunne ikke ændres. Prøv igen.",
    };
  }

  revalidatePath(`/videos/${orderId}`);
  return sharingStateFor({ ...order, share_enabled: enabled, share_token: token });
}

function sharingStateFor(order: { share_enabled?: boolean | null; share_token?: string | null; aspect_ratio: string | null; title: string | null }): SharingState {
  if (!order.share_enabled || !order.share_token) return { enabled: false };
  return {
    enabled: true,
    url: embedUrl(order.share_token),
    embedCode: buildEmbedCode({ token: order.share_token, aspect: order.aspect_ratio, title: order.title }),
  };
}
