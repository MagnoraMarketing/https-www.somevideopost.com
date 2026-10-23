-- Drive video jobs every minute from Supabase (pg_cron + pg_net).
--
-- Not a migration: it needs two values only you have, so run it once by hand
-- in the Supabase SQL editor after replacing both placeholders:
--   <APP_URL>      e.g. https://www.somevideopost.com
--   <CRON_SECRET>  the same value as CRON_SECRET in Vercel
--
-- Why here and not in vercel.json: Vercel's Hobby plan only allows cron jobs
-- that run once a day (vercel.json keeps a daily one as a backstop). Without a
-- minute-level driver a video still finishes — the video page and the video
-- list both move it along — but only while one of them is open.
--
-- Enable the extensions first: Database → Extensions → pg_cron and pg_net.

create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.unschedule('drive-video-jobs')
where exists (select 1 from cron.job where jobname = 'drive-video-jobs');

select cron.schedule(
  'drive-video-jobs',
  '* * * * *',
  $$
  select net.http_post(
    url := '<APP_URL>/api/cron/video-jobs',
    headers := jsonb_build_object('Authorization', 'Bearer <CRON_SECRET>'),
    timeout_milliseconds := 60000
  );
  $$
);

-- Check it runs:   select * from cron.job_run_details order by start_time desc limit 5;
-- Stop it again:   select cron.unschedule('drive-video-jobs');
