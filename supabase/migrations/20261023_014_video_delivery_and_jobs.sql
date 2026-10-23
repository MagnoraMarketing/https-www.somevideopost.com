-- Private video delivery, server-driven jobs and embeddable sharing.
--
-- Additive only, and the app keeps working before this runs: every code path
-- that touches these columns or the new bucket falls back to the previous
-- behaviour when they are missing. Existing videos keep their public URLs —
-- nothing here moves, renames or re-permissions a file that already exists.

-- ── 1. Private bucket for new renders ─────────────────────────────────────
-- Final films, scene clips and paywall previews of new orders live here. It
-- has no read policy at all: files are only ever handed out as short-lived
-- signed URLs minted by the server after it has checked ownership and payment.
insert into storage.buckets (id, name, public)
values ('video-private', 'video-private', false)
on conflict (id) do update set public = false;

-- ── 2. Job driving ────────────────────────────────────────────────────────
-- lease_until: whoever advances a job (the customer's browser, the list page
-- or the scheduled driver) claims it for a short window first, so two callers
-- can never run the same step at once — which is what used to submit the same
-- WAN scene twice and pay for it twice.
alter table video_orders
  add column if not exists lease_until      timestamptz,
  add column if not exists last_advanced_at timestamptz,
  add column if not exists advance_count    int not null default 0;

create index if not exists video_orders_active_idx
  on video_orders (last_advanced_at nulls first)
  where status = 'processing';

-- ── 3. Delivery and sharing ───────────────────────────────────────────────
-- preview_video_path: low-resolution, blurred render shown before payment, so
--   the locked preview never hands out the full film.
-- share_token / share_enabled: the public /embed/{token} page. Off by default;
--   turning it off revokes every embed and link immediately.
alter table video_orders
  add column if not exists preview_video_path text,
  add column if not exists share_token        text,
  add column if not exists share_enabled      boolean not null default false;

create unique index if not exists video_orders_share_token_idx
  on video_orders (share_token)
  where share_token is not null;

-- ── 4. Customers cannot unlock or rewrite their own orders ────────────────
-- video_orders has an "owner_all" policy, and the anon key is public by
-- design, so a signed-in customer could previously run
--   update video_orders set paid = true where id = '<their order>'
-- straight from the browser and skip the per-video payment. Row-level
-- security cannot restrict individual columns, so this trigger does: through
-- the customer's own session only the fields they legitimately edit (title,
-- caption, chosen photos, linked property) may change. Payment, pipeline
-- state, delivery and sharing are written by the server's service role,
-- which is unaffected — as are migrations and the SQL editor.
create or replace function video_orders_guard_customer_writes()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if coalesce(auth.role(), 'service_role') not in ('anon', 'authenticated') then
    return new;
  end if;

  if tg_op = 'INSERT' then
    -- A new order always starts unpaid, unshared and undelivered.
    new.paid               := false;
    new.stripe_payment_id  := null;
    new.share_enabled      := false;
    new.share_token        := null;
    new.preview_video_path := null;
    new.final_video_url    := null;
    new.lease_until        := null;
    if new.status = 'ready' then
      new.status := 'processing';
    end if;
    return new;
  end if;

  if new.paid               is distinct from old.paid
  or new.stripe_payment_id  is distinct from old.stripe_payment_id
  or new.status             is distinct from old.status
  or new.job_state          is distinct from old.job_state
  or new.video_url          is distinct from old.video_url
  or new.video_urls         is distinct from old.video_urls
  or new.final_video_url    is distinct from old.final_video_url
  or new.preview_video_path is distinct from old.preview_video_path
  or new.share_enabled      is distinct from old.share_enabled
  or new.share_token        is distinct from old.share_token
  or new.lease_until        is distinct from old.lease_until
  or new.user_id            is distinct from old.user_id
  then
    raise exception 'video_orders: this field can only be changed by the server'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_video_orders_guard on video_orders;
create trigger trg_video_orders_guard
  before insert or update on video_orders
  for each row execute function video_orders_guard_customer_writes();
