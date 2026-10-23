import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { VideoStatusClient } from "@/components/video-status-client";
import { getCurrency } from "@/lib/locale-server";
import { formatPriceKey } from "@/lib/currency";
import type { SocialAccount, VideoOrder } from "@/types/database";
import { DEFAULT_VIDEO_STYLE, type VideoStyleId } from "@/lib/video-styles";
import { buildEmbedCode, embedUrl, orderMediaList, videoFileRoute } from "@/lib/video-media";
import type { SharingState } from "@/services/video-sharing";

// The page's poll loop calls advanceJob through a Server Action, and a single
// step can import photographs, poll WAN and re-host a finished clip. Server
// Actions inherit their page's maxDuration, and the platform default cuts a
// step off mid-flight.
export const maxDuration = 60;

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const [{ data: order }, { data: accounts }, currency] = await Promise.all([
    supabase.from("video_orders").select("*").eq("id", id).eq("user_id", user.id).single(),
    supabase.from("social_accounts").select("*").eq("user_id", user.id).order("created_at"),
    getCurrency(),
  ]);

  if (!order) notFound();

  // Pull linked-property context so the AI sales text can match the listing.
  const { data: property } = order.property_id
    ? await supabase
        .from("properties")
        .select("description, location, booking_url")
        .eq("id", order.property_id)
        .single()
    : { data: null };

  // The browser only ever gets app routes; the file route checks payment and
  // hands out a short-lived signed link. Nothing is shown for an order that is
  // not finished yet.
  const ready = order.status === "ready";
  const fileRoutes = ready
    ? orderMediaList(order as VideoOrder).map((_, i) => videoFileRoute(id, { clip: i }))
    : [];

  const shareToken = (order as { share_token?: string | null }).share_token ?? null;
  const sharing: SharingState =
    (order as { share_enabled?: boolean }).share_enabled && shareToken
      ? {
          enabled: true,
          url: embedUrl(shareToken),
          embedCode: buildEmbedCode({ token: shareToken, aspect: order.aspect_ratio, title: order.title }),
        }
      : { enabled: false };

  return (
    <>
      <Topbar
        title={order.title ?? "Video"}
        description="AI-genereret præsentationsvideo"
      />
      <div className="flex-1 px-8 py-8 max-w-3xl">
        <VideoStatusClient
          orderId={id}
          initialStatus={order.status}
          initialVideoUrl={fileRoutes[0]}
          initialVideoUrls={fileRoutes.length ? fileRoutes : undefined}
          title={order.title ?? ""}
          description={property?.description ?? null}
          location={property?.location ?? null}
          bookingUrl={property?.booking_url ?? null}
          imageUrls={order.image_urls ?? []}
          accounts={(accounts ?? []) as SocialAccount[]}
          initialPaid={(order as { paid?: boolean }).paid ?? false}
          videoPrice={formatPriceKey("video", currency)}
          videoStyle={(order as { video_style?: VideoStyleId }).video_style ?? DEFAULT_VIDEO_STYLE}
          initialJobState={(order as { job_state?: string }).job_state ?? "pending"}
          initialCaption={(order as { caption?: string | null }).caption ?? null}
          initialCaptionPlatform={(order as { caption_platform?: string | null }).caption_platform ?? null}
          initialError={(order as { error_message?: string | null }).error_message ?? null}
          initialSharing={sharing}
        />
      </div>
    </>
  );
}
