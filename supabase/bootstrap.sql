-- ═══════════════════════════════════════════════════════════════════════════
-- somevideopost.com — full schema bootstrap
--
-- Brings an EMPTY Supabase project up to the current schema in one paste:
-- everything migrations 001–012 do, in order, made safe to run more than once.
--
-- Use this when standing up a new Supabase project (as opposed to applying the
-- individual migrations in supabase/migrations/, which assume they run exactly
-- once, in order, against a database that has seen every earlier one).
--
-- Run it in the SQL Editor of the target project, or:
--   supabase link --project-ref <ref> && supabase db push
--
-- Safe to re-run: every CREATE is guarded, and the only data write is a
-- backfill that touches accounts with no credit row at all.
-- ═══════════════════════════════════════════════════════════════════════════


-- ── Enum types (CREATE TYPE has no IF NOT EXISTS) ─────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'post_status') then
    create type post_status as enum ('draft','scheduled','published','failed');
  end if;
  if not exists (select 1 from pg_type where typname = 'distribution_status') then
    create type distribution_status as enum ('pending','sent','failed');
  end if;
  if not exists (select 1 from pg_type where typname = 'subscription_status') then
    create type subscription_status as enum ('active','canceled','past_due','trialing');
  end if;
  if not exists (select 1 from pg_type where typname = 'video_status') then
    create type video_status as enum ('pending','processing','ready','failed');
  end if;
end $$;


-- ── Shared updated_at trigger function ────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end;
$$;


-- ═══ 001 — core schema ════════════════════════════════════════════════════

create table if not exists properties (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  description text,
  location    text,
  booking_url text,
  cover_url   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table properties enable row level security;
drop policy if exists "owner_all" on properties;
create policy "owner_all" on properties
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create table if not exists property_images (
  id           uuid primary key default gen_random_uuid(),
  property_id  uuid not null references properties(id) on delete cascade,
  storage_path text not null,
  url          text not null,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now()
);
alter table property_images enable row level security;
drop policy if exists "owner_all" on property_images;
create policy "owner_all" on property_images
  using (
    exists (select 1 from properties p where p.id = property_images.property_id and p.user_id = auth.uid())
  )
  with check (
    exists (select 1 from properties p where p.id = property_images.property_id and p.user_id = auth.uid())
  );

create table if not exists social_accounts (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  platform     text not null check (platform in ('facebook','linkedin')),
  account_name text not null,
  account_id   text not null,
  access_token text,
  created_at   timestamptz not null default now()
);
alter table social_accounts enable row level security;
drop policy if exists "owner_all" on social_accounts;
create policy "owner_all" on social_accounts
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create table if not exists posts (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  property_id          uuid references properties(id) on delete set null,
  content              text not null,
  image_urls           text[] not null default '{}',
  status               post_status not null default 'draft',
  scheduled_at         timestamptz,
  published_at         timestamptz,
  repeat_interval_days int,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
alter table posts enable row level security;
drop policy if exists "owner_all" on posts;
create policy "owner_all" on posts
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create table if not exists post_distributions (
  id                uuid primary key default gen_random_uuid(),
  post_id           uuid not null references posts(id) on delete cascade,
  social_account_id uuid not null references social_accounts(id) on delete cascade,
  status            distribution_status not null default 'pending',
  sent_at           timestamptz,
  error_message     text,
  unique (post_id, social_account_id)
);
alter table post_distributions enable row level security;
drop policy if exists "owner_all" on post_distributions;
create policy "owner_all" on post_distributions
  using (
    exists (select 1 from posts p where p.id = post_distributions.post_id and p.user_id = auth.uid())
  );

create table if not exists calendar_integrations (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  property_id    uuid references properties(id) on delete cascade,
  type           text not null check (type in ('calcom','google','airbnb','ics')),
  url            text not null,
  last_synced_at timestamptz,
  created_at     timestamptz not null default now()
);
alter table calendar_integrations enable row level security;
drop policy if exists "owner_all" on calendar_integrations;
create policy "owner_all" on calendar_integrations
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create table if not exists calendar_events (
  id             uuid primary key default gen_random_uuid(),
  property_id    uuid not null references properties(id) on delete cascade,
  integration_id uuid references calendar_integrations(id) on delete cascade,
  external_uid   text,
  title          text,
  start_date     date not null,
  end_date       date not null,
  status         text not null default 'booked',
  created_at     timestamptz not null default now(),
  unique (integration_id, external_uid)
);
alter table calendar_events enable row level security;
drop policy if exists "owner_all" on calendar_events;
create policy "owner_all" on calendar_events
  using (
    exists (select 1 from properties p where p.id = calendar_events.property_id and p.user_id = auth.uid())
  );

drop trigger if exists trg_properties_updated_at on properties;
create trigger trg_properties_updated_at
  before update on properties for each row execute function set_updated_at();

drop trigger if exists trg_posts_updated_at on posts;
create trigger trg_posts_updated_at
  before update on posts for each row execute function set_updated_at();


-- ═══ 002 — billing ════════════════════════════════════════════════════════

create table if not exists subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users(id) on delete cascade unique,
  stripe_customer_id     text unique,
  stripe_subscription_id text unique,
  status                 subscription_status not null default 'trialing',
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
alter table subscriptions enable row level security;
drop policy if exists "owner_read" on subscriptions;
create policy "owner_read" on subscriptions
  for select using (user_id = auth.uid());

create table if not exists ai_credits (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade unique,
  balance    int not null default 0,
  updated_at timestamptz not null default now()
);
alter table ai_credits enable row level security;
drop policy if exists "owner_read" on ai_credits;
create policy "owner_read" on ai_credits
  for select using (user_id = auth.uid());

create table if not exists credit_transactions (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  amount            int not null, -- positive = topup, negative = usage
  description       text not null,
  stripe_payment_id text,
  created_at        timestamptz not null default now()
);
alter table credit_transactions enable row level security;
drop policy if exists "owner_read" on credit_transactions;
create policy "owner_read" on credit_transactions
  for select using (user_id = auth.uid());

create table if not exists video_orders (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  property_id       uuid references properties(id) on delete set null,
  stripe_payment_id text,
  status            video_status not null default 'pending',
  video_url         text,
  created_at        timestamptz not null default now()
);
alter table video_orders enable row level security;
drop policy if exists "owner_all" on video_orders;
create policy "owner_all" on video_orders
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop trigger if exists trg_subscriptions_updated_at on subscriptions;
create trigger trg_subscriptions_updated_at
  before update on subscriptions for each row execute function set_updated_at();


-- ═══ 003 + 006 + 009 + 010 — video_orders columns ═════════════════════════
-- The app reads and writes video_job_id / video_job_ids / video_urls. Legacy
-- databases carry the old higgsfield_* names, so rename before adding.

do $$
begin
  if exists (select 1 from information_schema.columns
             where table_name = 'video_orders' and column_name = 'higgsfield_job_id') then
    alter table video_orders rename column higgsfield_job_id to video_job_id;
  end if;
  if exists (select 1 from information_schema.columns
             where table_name = 'video_orders' and column_name = 'higgsfield_job_ids') then
    alter table video_orders rename column higgsfield_job_ids to video_job_ids;
  end if;
end $$;

alter table video_orders add column if not exists image_urls    text[] not null default '{}';
alter table video_orders add column if not exists title         text;
alter table video_orders add column if not exists video_job_id  text;
alter table video_orders add column if not exists video_job_ids text[] default '{}';
alter table video_orders add column if not exists video_urls    text[] default '{}';
alter table video_orders add column if not exists error_message text;
alter table video_orders add column if not exists paid          boolean not null default false;

-- Videos already delivered are never locked behind the pay-per-video paywall.
update video_orders set paid = true where status = 'ready' and paid = false;


-- ═══ 004 — GA4 connections ════════════════════════════════════════════════
-- NOTE: the original migration called update_updated_at_column(), which no
-- migration ever defines. On a fresh project that fails outright. The correct
-- name is set_updated_at(), defined above.

create table if not exists ga4_connections (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  ga4_property_id text not null,
  property_name   text,
  access_token    text not null,
  refresh_token   text,
  token_expiry    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (user_id)
);
alter table ga4_connections enable row level security;
drop policy if exists "Users can manage their own GA4 connection" on ga4_connections;
create policy "Users can manage their own GA4 connection"
  on ga4_connections for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop trigger if exists ga4_connections_updated_at on ga4_connections;
create trigger ga4_connections_updated_at
  before update on ga4_connections
  for each row execute function set_updated_at();


-- ═══ 007 — social_accounts metadata ═══════════════════════════════════════

alter table public.social_accounts add column if not exists meta jsonb default null;
alter table public.social_accounts
  drop constraint if exists social_accounts_user_id_account_id_key;
alter table public.social_accounts
  add constraint social_accounts_user_id_account_id_key unique (user_id, account_id);


-- ═══ 008 — free-post flag ═════════════════════════════════════════════════

alter table ai_credits add column if not exists free_post_used boolean not null default false;


-- ═══ 005 + 008 + 011 — storage buckets ════════════════════════════════════

insert into storage.buckets (id, name, public) values
  ('video-images', 'video-images', true),
  ('post-images',  'post-images',  true),
  ('videos',       'videos',       true)
on conflict (id) do nothing;

drop policy if exists "Authenticated users can upload video images" on storage.objects;
create policy "Authenticated users can upload video images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'video-images' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Anyone can view video images" on storage.objects;
create policy "Anyone can view video images"
  on storage.objects for select
  using (bucket_id = 'video-images');

drop policy if exists "Users can delete their own video images" on storage.objects;
create policy "Users can delete their own video images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'video-images' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Authenticated users can upload post images" on storage.objects;
create policy "Authenticated users can upload post images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'post-images' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Anyone can view post images" on storage.objects;
create policy "Anyone can view post images"
  on storage.objects for select
  using (bucket_id = 'post-images');

drop policy if exists "Users can delete their own post images" on storage.objects;
create policy "Users can delete their own post images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'post-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- Clips are written by the service-role client (which bypasses RLS); viewers
-- only need read access so the public URL in video_orders.video_url resolves.
drop policy if exists "Anyone can view generated videos" on storage.objects;
create policy "Anyone can view generated videos"
  on storage.objects for select
  using (bucket_id = 'videos');


-- ═══ 011 — free post credits on signup ════════════════════════════════════
-- Keep the granted amount in sync with FREE_SIGNUP_POSTS in src/lib/currency.ts.

create or replace function grant_signup_post_credits()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- This runs inside the signup transaction: anything raised here aborts the
  -- INSERT into auth.users and the account is never created, surfacing to the
  -- user as an opaque "Database error saving new user". A missing free credit
  -- is never worth blocking a signup over, so swallow any failure and let the
  -- account through — /api/generate-post grants the allowance on first use if
  -- the row is absent.
  begin
    insert into ai_credits (user_id, balance)
    values (new.id, 2)
    on conflict (user_id) do nothing;

    insert into credit_transactions (user_id, amount, description)
    values (new.id, 2, 'Gratis opslag ved oprettelse');
  exception when others then
    raise warning 'grant_signup_post_credits failed for %: %', new.id, sqlerrm;
  end;

  return new;
end;
$$;

drop trigger if exists trg_grant_signup_post_credits on auth.users;
create trigger trg_grant_signup_post_credits
  after insert on auth.users
  for each row execute function grant_signup_post_credits();

-- Backfill accounts that predate the trigger. Only accounts with no row at all
-- are touched, so a spent-down balance is never topped back up.
with provisioned as (
  insert into ai_credits (user_id, balance)
  select u.id, 2
  from auth.users u
  where not exists (select 1 from ai_credits c where c.user_id = u.id)
  returning user_id
)
insert into credit_transactions (user_id, amount, description)
select user_id, 2, 'Gratis opslag ved oprettelse' from provisioned;


-- ═══ 012 — property-fidelity video pipeline ═══════════════════════════════
-- Source images, storyboard scenes, WAN task tracking and the listing cache.
-- Already written to be safe to run more than once, so it is included here
-- verbatim: a fresh project is brought all the way up in one paste.

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

-- ═══ 013 — stored AI sales text ═══════════════════════════════════════════
-- The generated caption is kept with its order instead of living only in the
-- browser. Additive and nullable, like everything above it.

alter table video_orders add column if not exists caption          text;
alter table video_orders add column if not exists caption_platform text;

