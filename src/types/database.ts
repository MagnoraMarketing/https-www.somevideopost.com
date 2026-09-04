export type Property = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  location: string | null;
  booking_url: string | null;
  cover_url: string | null;
  created_at: string;
  updated_at: string;
};

export type PropertyImage = {
  id: string;
  property_id: string;
  storage_path: string;
  url: string;
  sort_order: number;
  created_at: string;
};

export type SocialPlatform = "facebook" | "instagram" | "tiktok" | "snapchat" | "youtube" | "linkedin";

export type SocialAccount = {
  id: string;
  user_id: string;
  platform: SocialPlatform;
  account_name: string;
  account_id: string;
  access_token: string | null;
  meta: Record<string, string> | null;
  created_at: string;
};

export type PostStatus = "draft" | "scheduled" | "published" | "failed";

export type Post = {
  id: string;
  user_id: string;
  property_id: string | null;
  content: string;
  image_urls: string[];
  status: PostStatus;
  scheduled_at: string | null;
  published_at: string | null;
  repeat_interval_days: number | null;
  created_at: string;
  updated_at: string;
};

export type DistributionStatus = "pending" | "sent" | "failed";

export type PostDistribution = {
  id: string;
  post_id: string;
  social_account_id: string;
  status: DistributionStatus;
  sent_at: string | null;
  error_message: string | null;
};

export type CalendarType = "calcom" | "google" | "airbnb" | "ics";

export type CalendarIntegration = {
  id: string;
  user_id: string;
  property_id: string | null;
  type: CalendarType;
  url: string;
  last_synced_at: string | null;
  created_at: string;
};

export type VideoOrderStatus = "pending" | "processing" | "ready" | "failed";

export type VideoOrder = {
  id: string;
  user_id: string;
  property_id: string | null;
  stripe_payment_id: string | null;
  video_job_id: string | null;
  video_job_ids: string[] | null;
  status: VideoOrderStatus;
  image_urls: string[];
  title: string | null;
  video_url: string | null;
  video_urls: string[] | null;
  created_at: string;
};


export type CalendarEvent = {
  id: string;
  property_id: string;
  integration_id: string | null;
  external_uid: string | null;
  title: string | null;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
};
