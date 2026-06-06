-- Silverback Detailing — Supabase schema
-- Run this in the Supabase SQL editor (or via the CLI) to enable booking storage.
-- Storage is optional: with STORAGE_PROVIDER=email the app runs without this table.

create table if not exists public.bookings (
  id                 text primary key,
  status             text not null default 'pending'
                       check (status in ('pending','confirmed','cancelled','refunded')),
  created_at         timestamptz not null default now(),
  service_slug       text not null,
  service_name       text not null,
  price_from         integer not null,
  currency           text not null default 'CAD',
  requires_deposit   boolean not null default false,
  deposit_amount     integer not null default 0,
  deposit_paid       boolean not null default false,
  stripe_session_id  text,
  vehicle            jsonb not null,
  location           jsonb not null,
  date               date not null,
  time               text not null,
  customer           jsonb not null
);

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_date_idx on public.bookings (date);

-- Row Level Security: lock the table down. The server uses the service role key,
-- which bypasses RLS, so no public policies are granted. This prevents any
-- access via the anon/public key from the browser.
alter table public.bookings enable row level security;

-- (Intentionally no policies for anon/authenticated roles — public access denied.)

-- Optional: revoke direct grants from the anon role for defence in depth.
revoke all on public.bookings from anon;
revoke all on public.bookings from authenticated;
