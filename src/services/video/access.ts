import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * The fields of an order the delivery routes need. Read with `select("*")`
 * so the routes keep working whether or not migration 014's columns exist.
 */
export type DeliverableOrder = {
  id: string;
  user_id: string;
  title: string | null;
  status: string;
  paid: boolean | null;
  aspect_ratio: string | null;
  video_url: string | null;
  video_urls: string[] | null;
  final_video_url: string | null;
  preview_video_path?: string | null;
  share_token?: string | null;
  share_enabled?: boolean | null;
};

/**
 * Load an order only if it belongs to the signed-in customer. Ownership is
 * enforced twice over: RLS on the session-bound client, and the user filter.
 */
export async function loadOwnedOrder(orderId: string): Promise<
  { userId: string; order: DeliverableOrder } | { error: "unauthorized" | "not_found" }
> {
  if (!/^[0-9a-f-]{36}$/i.test(orderId)) return { error: "not_found" };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "unauthorized" };

  const { data } = await supabase
    .from("video_orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle<DeliverableOrder>();
  if (!data) return { error: "not_found" };
  return { userId: user.id, order: data };
}

/** A filename the customer will recognise in their downloads folder. */
export function downloadFilename(title: string | null, clip: number): string {
  const base = (title ?? "praesentationsvideo")
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase()
    .slice(0, 60) || "praesentationsvideo";
  return clip > 0 ? `${base}-klip-${clip}.mp4` : `${base}.mp4`;
}
