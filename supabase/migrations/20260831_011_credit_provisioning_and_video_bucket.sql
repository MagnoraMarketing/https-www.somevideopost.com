-- Fixes two gaps that made AI post generation and video delivery fail silently.
--
-- 1) Nothing ever created an ai_credits row. /api/generate-post reads the
--    balance, finds no row, treats it as 0 and refuses with "Ingen saldo
--    tilbage" — so a new account could never generate a post, even though the
--    marketing pages promise 2 free posts at signup.
-- 2) lib/google-video.ts uploads finished clips to a "videos" bucket that no
--    migration ever created, so every upload failed and fell back to proxying
--    straight from Google.

-- ── 1. Free post credits on signup ────────────────────────────────────────

-- Keep in sync with FREE_SIGNUP_POSTS in src/lib/currency.ts.
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

-- Backfill accounts that signed up before the trigger existed and so never
-- received a balance. Only accounts with no row at all are touched, so a
-- spent-down balance is never topped back up.
with provisioned as (
  insert into ai_credits (user_id, balance)
  select u.id, 2
  from auth.users u
  where not exists (select 1 from ai_credits c where c.user_id = u.id)
  returning user_id
)
insert into credit_transactions (user_id, amount, description)
select user_id, 2, 'Gratis opslag ved oprettelse' from provisioned;

-- ── 2. Storage bucket for generated videos ────────────────────────────────

insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do nothing;

-- Clips are written by the service-role client (which bypasses RLS); viewers
-- only need read access so the public URL in video_orders.video_url resolves.
drop policy if exists "Anyone can view generated videos" on storage.objects;
create policy "Anyone can view generated videos"
  on storage.objects for select
  using (bucket_id = 'videos');
