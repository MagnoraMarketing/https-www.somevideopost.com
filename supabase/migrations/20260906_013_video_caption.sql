-- Keep the AI-generated sales text with the order it belongs to.
--
-- The caption was generated fresh on every visit and lived only in React
-- state: a text the customer had already edited was gone the moment they
-- reloaded, and nothing about it was stored alongside the photographs and the
-- video it accompanies. Additive and nullable — orders without one behave
-- exactly as before.

alter table video_orders add column if not exists caption text;

-- Which platform the stored caption was written for, so the panel comes back
-- on the same tab it was left on.
alter table video_orders add column if not exists caption_platform text;
