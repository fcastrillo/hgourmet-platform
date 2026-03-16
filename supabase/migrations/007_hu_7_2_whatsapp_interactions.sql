-- HU-7.2: WhatsApp interaction traceability
-- Creates a unified table for contact form and product interest interactions.

create table if not exists public.whatsapp_interactions (
  id uuid primary key default gen_random_uuid(),
  interaction_type text not null check (interaction_type in ('contact_form', 'product_interest')),
  channel text not null default 'whatsapp',
  page_path text,
  product_id uuid references public.products(id) on delete set null,
  product_name text,
  customer_name text,
  customer_phone text,
  customer_email text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_whatsapp_interactions_type_created
  on public.whatsapp_interactions (interaction_type, created_at desc);

create index if not exists idx_whatsapp_interactions_product
  on public.whatsapp_interactions (product_id);

alter table public.whatsapp_interactions enable row level security;

drop policy if exists whatsapp_interactions_anon_insert on public.whatsapp_interactions;
create policy whatsapp_interactions_anon_insert
  on public.whatsapp_interactions
  for insert
  to anon
  with check (channel = 'whatsapp');

drop policy if exists whatsapp_interactions_auth_select on public.whatsapp_interactions;
create policy whatsapp_interactions_auth_select
  on public.whatsapp_interactions
  for select
  to authenticated
  using (true);
