-- Migration 004: Recipes table + display_order for admin panel (HU-2.8)
-- Safe to run even if table already exists via CREATE TABLE IF NOT EXISTS.

create table if not exists public.recipes (
  id           uuid        primary key default gen_random_uuid(),
  title        text        not null,
  slug         text        not null unique,
  content      text        not null,
  image_url    text,
  is_published boolean     not null default false,
  display_order integer    not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Add display_order if table already existed without it
alter table public.recipes
  add column if not exists display_order integer not null default 0;

-- Index for admin ordering
create index if not exists idx_recipes_display_order
  on public.recipes (display_order);

-- Index for storefront (published only)
create index if not exists idx_recipes_published
  on public.recipes (is_published, display_order);

-- Backfill display_order for existing rows that have it at 0
with ordered as (
  select id,
         row_number() over (order by created_at asc) as rn
  from public.recipes
  where display_order = 0
)
update public.recipes r
set    display_order = o.rn
from   ordered o
where  r.id = o.id;

-- RLS
alter table public.recipes enable row level security;

drop policy if exists "anon can read published recipes" on public.recipes;
create policy "anon can read published recipes"
  on public.recipes for select
  to anon
  using (is_published = true);

drop policy if exists "authenticated full access on recipes" on public.recipes;
create policy "authenticated full access on recipes"
  on public.recipes for all
  to authenticated
  using (true)
  with check (true);
