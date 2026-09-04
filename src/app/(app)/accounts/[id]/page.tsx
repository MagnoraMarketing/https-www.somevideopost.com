import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { ChannelSettingsClient } from "@/components/accounts/channel-settings-client";

const PLATFORM_LABELS: Record<string, string> = {
  facebook: "Facebook Page",
  instagram: "Instagram",
  tiktok: "TikTok",
  linkedin: "LinkedIn Page",
  youtube: "YouTube",
  snapchat: "Snapchat",
};

const PLATFORM_COLORS: Record<string, string> = {
  facebook: "#1877F2",
  instagram: "#E1306C",
  tiktok: "#000000",
  snapchat: "#F7C600",
  youtube: "#FF0000",
  linkedin: "#0A66C2",
};

const DEFAULT_SLOTS = [0, 1, 2, 3, 4, 5, 6].map((day) => ({
  day,
  enabled: true,
  times: ["09:00"],
}));

export default async function AccountSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: account } = await supabase
    .from("social_accounts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!account) notFound();

  const { data: settings } = await supabase
    .from("channel_settings")
    .select("*")
    .eq("social_account_id", id)
    .single();

  const initialSettings = {
    timezone: settings?.timezone ?? "Europe/Copenhagen",
    posting_goal: settings?.posting_goal ?? 7,
    posting_slots: settings?.posting_slots ?? DEFAULT_SLOTS,
  };

  return (
    <>
      <Topbar
        title={account.account_name}
        description={PLATFORM_LABELS[account.platform] ?? account.platform}
      />
      <div className="flex-1 px-8 py-6 max-w-4xl">
        <ChannelSettingsClient
          accountId={id}
          platform={account.platform}
          platformColor={PLATFORM_COLORS[account.platform] ?? "#64748b"}
          initialSettings={initialSettings}
        />
      </div>
    </>
  );
}
