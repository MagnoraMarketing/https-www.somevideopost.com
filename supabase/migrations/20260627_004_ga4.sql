create table if not exists ga4_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ga4_property_id text not null,
  property_name text,
  access_token text not null,
  refresh_token text,
  token_expiry timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

alter table ga4_connections enable row level security;

create policy "Users can manage their own GA4 connection"
  on ga4_connections for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- set_updated_at() is defined in migration 001. This previously named a
-- function (update_updated_at_column) that no migration ever creates, so the
-- migration failed outright against a fresh project.
drop trigger if exists ga4_connections_updated_at on ga4_connections;
create trigger ga4_connections_updated_at
  before update on ga4_connections
  for each row execute function set_updated_at();
