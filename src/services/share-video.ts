"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { publishToFacebook, publishToInstagram } from "@/lib/social-publish";
import type { SocialAccount } from "@/types/database";
import { resolveVideoUrl, SOCIAL_SHARE_URL_TTL_SECONDS } from "@/services/video/media";
import { orderMediaList } from "@/lib/video-media";

export async function shareVideoToSocial(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const content = String(formData.get("content") ?? "").trim();
  const orderId = String(formData.get("order_id") ?? "").trim();
  let videoUrl = String(formData.get("video_url") ?? "").trim();

  // Sharing one of the customer's own videos: the link Facebook/Instagram
  // fetch is resolved here, from the order, after checking it is theirs and
  // paid — a privately stored film gets a signed link that outlives the
  // platform's processing, never a permanent public one.
  if (orderId) {
    const { data: order } = await supabase
      .from("video_orders")
      .select("id, status, paid, video_url, video_urls, final_video_url")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .maybeSingle<{ id: string; status: string; paid: boolean | null; video_url: string | null; video_urls: string[] | null; final_video_url: string | null }>();
    if (!order || order.status !== "ready" || !order.paid) {
      return { error: "Videoen er ikke klar til deling endnu." };
    }
    videoUrl = (await resolveVideoUrl(orderMediaList(order)[0], { ttlSeconds: SOCIAL_SHARE_URL_TTL_SECONDS })) ?? "";
  }
  const accountIds = formData.getAll("account_ids[]").map(String).filter(Boolean);
  const scheduledAt = String(formData.get("scheduled_at") ?? "").trim() || null;

  if (!content || !videoUrl || accountIds.length === 0) {
    return { error: "Udfyld billedtekst og vælg mindst én kanal." };
  }

  // Fetch selected accounts
  const { data: accounts } = await supabase
    .from("social_accounts")
    .select("*")
    .in("id", accountIds)
    .eq("user_id", user.id);

  const isImmediate = !scheduledAt;
  const publishErrors: string[] = [];

  // Publish immediately if no schedule and real token exists
  if (isImmediate && accounts?.length) {
    for (const account of accounts as SocialAccount[]) {
      if (!account.access_token || account.access_token === "mock_token") continue;

      if (account.platform === "facebook") {
        const res = await publishToFacebook(account.account_id, account.access_token, content, videoUrl);
        if (!res.success) publishErrors.push(`Facebook (${account.account_name}): ${res.error}`);
      } else if (account.platform === "instagram") {
        const meta = account.meta as Record<string, string> | null;
        const igId = account.account_id;
        const token = meta?.page_token ?? account.access_token;
        const res = await publishToInstagram(igId, token, content, videoUrl);
        if (!res.success) publishErrors.push(`Instagram (${account.account_name}): ${res.error}`);
      }
    }
  }

  // Create post record for tracking / future scheduled posts
  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      content,
      image_urls: [videoUrl],
      status: isImmediate ? "published" : "scheduled",
      scheduled_at: scheduledAt ?? new Date().toISOString(),
    })
    .select()
    .single();

  if (error || !post) return { error: "Kunne ikke oprette opslag." };

  await supabase.from("post_distributions").insert(
    accountIds.map((sid) => ({
      post_id: post.id,
      social_account_id: sid,
      status: isImmediate ? "published" : "pending",
    }))
  );

  revalidatePath("/posts");

  if (publishErrors.length > 0) {
    return { error: publishErrors.join("; ") };
  }

  return {};
}

export async function getConnectedAccounts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase.from("social_accounts").select("*").eq("user_id", user.id).order("created_at");
  return data ?? [];
}
