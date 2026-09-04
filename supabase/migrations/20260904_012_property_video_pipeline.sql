-- Property-fidelity video pipeline: real property photos → AI Director →
-- WAN 3.0 image-to-video → assembled 15-second MP4.
--
-- Additive only. Existing video_orders rows keep working: every new column is
-- nullable or defaulted, and orders created before this migration simply have
-- no source images, storyboard or scenes attached.

-- ── 1. Video orders: style, job state, storyboard, diagnostics ────────────

alter table video_orders
  add column if not exists video_style   text not null default 'mediterranean',
  add column if not exists job_state     text not null default 'pending',
  add column if not exists source_url    text,
  add column if not exists aspect_ratio  text not null default '9:16',
  add column if not exists storyboard    jsonb,
  add column if not exists diagnostics   jsonb not null default '{}'::jsonb,
  add column if not exists final_video_url text,
  add column if not exists started_at    timestamptz,
  add column if not exists completed_at  timestamptz;

-- Style ids come from src/lib/video-styles.ts. Adding a style means extending
-- this constraint in a follow-up migration; the pipeline itself needs no change.
alter table video_orders drop constraint if exists video_orders_video_style_check;
alter table video_orders add constraint video_orders_video_style_check
  check (video_style in ('nordic','mediterranean','luxury','nature-relax','cinematic'));

-- job_state is the fine-grained pipeline position; the existing `status`
-- column keeps its four coarse values so every existing query still works.
alter table video_orders drop constraint if exists video_orders_job_state_check;
alter table video_orders add constraint video_orders_job_state_check
  check (job_state in (
    'pending','fetching_property','extracting_images','downloading_images',
    'analyzing_images','selecting_images','creating_storyboard',
    'generating_clips','assembling_video','completed','failed',
    'awaiting_images'
  ));

alter table video_orders drop constraint if exists video_orders_aspect_ratio_check;
alter table video_orders add constraint video_orders_aspect_ratio_check
  check (aspect_ratio in ('9:16','1:1','16:9'));

-- Orders that predate this migration are already finished or failed; put them
-- in the matching job_state so the progress UI never shows them as pending.
update video_orders set job_state = 'completed' where status = 'ready'  and job_state = 'pending';
update video_orders set job_state = 'failed'    where status = 'failed' and job_state = 'pending';

-- ── 2. Source images ──────────────────────────────────────────────────────
-- The actual property photographs: one row per image we downloaded and
-- re-hosted, whether it came from a listing URL or a manual upload.

create table if not exists video_source_images (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references video_orders(id) on delete cascade,
  user_id           uuid not null references auth.users(id) on delete cascade,
  source_url        text,
  storage_path      text not null,
  storage_url       text not null,
  width             int  not null,
  height            int  not null,
  file_size         int  not null,
  position          int  not null default 0,
  extraction_method text not null,
  image_hash        text not null,
  analysis          jsonb,
  selected          boolean not null default false,
  selection_rank    int,
  created_at        timestamptz not null default now(),
  unique (order_id, image_hash)
);

create index if not exists video_source_images_order_idx on video_source_images(order_id, position);

alter table video_source_images enable row level security;
drop policy if exists "owner_all" on video_source_images;
create policy "owner_all" on video_source_images
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ── 3. Scenes / WAN tasks ─────────────────────────────────────────────────
-- One row per storyboard scene. Keeping WAN task state per scene is what lets
-- a single failed scene retry without regenerating the whole video.

create table if not exists video_scenes (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references video_orders(id) on delete cascade,
  user_id          uuid not null references auth.users(id) on delete cascade,
  scene_index      int not null,
  image_id         uuid references video_source_images(id) on delete set null,
  purpose          text,
  duration_seconds numeric(5,3) not null,
  camera           text,
  prompt           text not null,
  wan_task_id      text,
  status           text not null default 'pending'
                   check (status in ('pending','submitted','running','succeeded','failed')),
  attempts         int not null default 0,
  input_image_url  text,
  clip_url         text,
  error_message    text,
  created_at       timestamptz not null default now(),
  completed_at     timestamptz,
  unique (order_id, scene_index)
);

create index if not exists video_scenes_order_idx on video_scenes(order_id, scene_index);
create index if not exists video_scenes_task_idx on video_scenes(wan_task_id);

alter table video_scenes enable row level security;
drop policy if exists "owner_all" on video_scenes;
create policy "owner_all" on video_scenes
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ── 4. Property import cache ──────────────────────────────────────────────
-- Re-importing the same listing should not re-fetch and re-download it. The
-- cache stores the extracted property data and the image candidate list; the
-- images themselves are already permanent in storage.

create table if not exists property_import_cache (
  id            uuid primary key default gen_random_uuid(),
  url_key       text not null unique,
  source_url    text not null,
  property_data jsonb not null,
  image_urls    jsonb not null default '[]'::jsonb,
  fetched_at    timestamptz not null default now()
);

create index if not exists property_import_cache_fetched_idx on property_import_cache(fetched_at);

-- Cache rows hold public listing data only and are written by the service-role
-- client; end users never read them directly.
alter table property_import_cache enable row level security;

-- ── 5. Storage ────────────────────────────────────────────────────────────
-- Reuses the buckets the app already has: "video-images" for source photos
-- (public, already read-open) and "videos" for scene clips and the final MP4.
insert into storage.buckets (id, name, public)
values ('video-images', 'video-images', true), ('videos', 'videos', true)
on conflict (id) do nothing;
