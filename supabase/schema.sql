-- Smile U Love booking demo. Paste this whole file into Supabase > SQL Editor > New query > Run.

create table if not exists public.appointments (
  id             uuid primary key default gen_random_uuid(),
  reference      text not null unique,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  name           text not null check (char_length(name) between 2 and 80),
  phone          text not null,
  email          text not null,
  service        text not null,
  preferred_date date not null,
  preferred_time text not null,
  status         text not null default 'pending' check (status in ('pending', 'confirmed', 'declined')),
  consent        boolean not null default false,
  notified       boolean not null default false
);

create index if not exists appointments_created_idx on public.appointments (created_at desc);

-- Lock the table. No policies are added on purpose: the public (anon) key and logged-in users
-- cannot read or write it directly. Only the website's server, using the service role key, can.
alter table public.appointments enable row level security;
revoke all on public.appointments from anon, authenticated;
