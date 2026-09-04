import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { VideoStatusClient } from "@/components/video-status-client";
import { getCurrency } from "@/lib/locale-server";
import { formatPriceKey } from "@/lib/currency";
import type { SocialAccount, VideoOrder } from "@/types/database";

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
          initialVideoUrl={order.video_url ?? undefined}
          initialVideoUrls={(order as VideoOrder).video_urls ?? undefined}
          title={order.title ?? ""}
          description={property?.description ?? null}
          location={property?.location ?? null}
          bookingUrl={property?.booking_url ?? null}
          imageUrls={order.image_urls ?? []}
          accounts={(accounts ?? []) as SocialAccount[]}
          initialPaid={(order as { paid?: boolean }).paid ?? false}
          videoPrice={formatPriceKey("video", currency)}
        />
      </div>
    </>
  );
}
