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


-- ---------------------------------------------------------------------------
-- Accounts (public.profiles)
-- ---------------------------------------------------------------------------
-- One row per signed-up account, whatever kind of account it is. `role` is what
-- separates the shop's own staff from customers, so the admin dashboard and any
-- future customer area read the same table instead of drifting into two
-- overlapping lists of people.
--
-- Named profiles rather than users because auth.users already exists and is
-- managed by Supabase. This table holds the application's view of a person;
-- auth.users holds the credentials. Two names for two jobs.
--
-- Keyed on auth.users.id, not email: an id survives an email change, and the
-- cascade removes the profile when the account is deleted rather than leaving an
-- orphaned row that still grants something.

create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  -- Denormalised copy of auth.users.email so "who has an account?" is a single
  -- query. Display only; the id above is the identity that is matched on.
  email      text not null,
  full_name  text,
  phone      text,
  -- Defaults to customer on purpose. A new sign-up must never arrive as staff,
  -- so the safe value is the one you get by saying nothing.
  role       text not null default 'customer'
               check (role in ('admin', 'customer')),
  created_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);

comment on table public.profiles is
  'Application accounts. role=admin may use /admin; role=customer is a regular account. Server-only (RLS, no policies).';

-- Same lockdown as bookings: RLS on, no policies, so only the service role key
-- reaches it. Everything the site does with profiles happens server-side.
alter table public.profiles enable row level security;

revoke all on public.profiles from anon;
revoke all on public.profiles from authenticated;


-- ---------------------------------------------------------------------------
-- Every new account gets a profile automatically
-- ---------------------------------------------------------------------------
-- Without this, a customer who signs up exists in auth.users and nowhere else,
-- and every read has to cope with a missing profile. The trigger closes that gap
-- at the moment of creation.
--
-- security definer is required to write public.profiles from a trigger on the
-- auth schema. `set search_path = ''` pins resolution so the elevated function
-- cannot be tricked into calling a same-named object from another schema, and is
-- why every reference below is fully qualified.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill anyone who signed up before the trigger existed.
insert into public.profiles (id, email, role)
select id, email, 'customer' from auth.users
on conflict (id) do nothing;


-- ---------------------------------------------------------------------------
-- Making someone an admin
-- ---------------------------------------------------------------------------
-- Create the account first (Authentication > Users > Add user), then run this.
-- The profile already exists by then, courtesy of the trigger, so this is an
-- update of the role rather than an insert.
--
--     update public.profiles
--     set role = 'admin'
--     where email = 'owner@example.com'
--     returning id, email, role;
--
-- An empty result means no account exists with that address. Nothing changed,
-- and sign-in will keep rejecting it. Check for a typo, or that the user was
-- actually created and confirmed.
--
-- Demote back to a normal account:
--
--     update public.profiles set role = 'customer' where email = 'x@example.com';
--
-- Who can reach the dashboard:
--
--     select p.email, p.role, p.created_at, u.last_sign_in_at
--     from public.profiles p
--     join auth.users u on u.id = p.id
--     where p.role = 'admin'
--     order by p.created_at;
--
-- Coming from the earlier public.admins table, carry the grants over first:
--
--     update public.profiles p set role = 'admin'
--     from public.admins a where a.id = p.id;
--     drop table public.admins;


-- ---------------------------------------------------------------------------
-- When the customer area arrives, read this first
-- ---------------------------------------------------------------------------
-- A customer-facing page will want people reading their own profile directly
-- with the anon key, which means adding policies. The one that matters:
--
--     create policy "read own profile" on public.profiles
--       for select to authenticated using ((select auth.uid()) = id);
--
-- Do NOT pair it with a blanket update policy. `role` lives in this table, so
-- "users may update their own row" is also "users may make themselves admin",
-- which is the single most common way a Supabase app gets taken over. Grant the
-- editable columns explicitly and leave role out:
--
--     create policy "update own profile" on public.profiles
--       for update to authenticated
--       using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
--     revoke update on public.profiles from authenticated;
--     grant update (full_name, phone) on public.profiles to authenticated;
--
-- The column grant is what actually stops the escalation. An RLS policy alone
-- decides which rows are writable, never which columns.
