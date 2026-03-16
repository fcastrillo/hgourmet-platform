-- HU-7.2 hardening: reconcile grants + RLS policies in environments with drift.
-- Ensures inserts work for both anonymous storefront users and authenticated admins.

alter table if exists public.whatsapp_interactions enable row level security;

grant usage on schema public to anon, authenticated;
grant insert on table public.whatsapp_interactions to anon;
grant insert, select on table public.whatsapp_interactions to authenticated;

drop policy if exists whatsapp_interactions_anon_insert on public.whatsapp_interactions;
create policy whatsapp_interactions_anon_insert
  on public.whatsapp_interactions
  for insert
  to anon
  with check (channel = 'whatsapp');

drop policy if exists whatsapp_interactions_auth_insert on public.whatsapp_interactions;
create policy whatsapp_interactions_auth_insert
  on public.whatsapp_interactions
  for insert
  to authenticated
  with check (channel = 'whatsapp');

drop policy if exists whatsapp_interactions_auth_select on public.whatsapp_interactions;
create policy whatsapp_interactions_auth_select
  on public.whatsapp_interactions
  for select
  to authenticated
  using (true);
