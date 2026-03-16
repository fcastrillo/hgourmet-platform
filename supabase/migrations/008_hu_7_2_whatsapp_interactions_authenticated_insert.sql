-- HU-7.2 fix: allow authenticated users to insert traceability records too.
-- This covers operators testing storefront while logged into admin.

drop policy if exists whatsapp_interactions_auth_insert on public.whatsapp_interactions;
create policy whatsapp_interactions_auth_insert
  on public.whatsapp_interactions
  for insert
  to authenticated
  with check (channel = 'whatsapp');
