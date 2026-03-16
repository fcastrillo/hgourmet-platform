-- HU-7.2 hard reset for RLS policy drift.
-- Drops ALL existing policies on whatsapp_interactions and recreates the expected set.

do $$
declare
  policy_row record;
begin
  for policy_row in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'whatsapp_interactions'
  loop
    execute format(
      'drop policy if exists %I on public.whatsapp_interactions',
      policy_row.policyname
    );
  end loop;
end
$$;

alter table if exists public.whatsapp_interactions enable row level security;

grant usage on schema public to anon, authenticated;
grant insert on table public.whatsapp_interactions to anon;
grant insert, select on table public.whatsapp_interactions to authenticated;

create policy whatsapp_interactions_anon_insert
  on public.whatsapp_interactions
  for insert
  to anon
  with check (channel = 'whatsapp');

create policy whatsapp_interactions_auth_insert
  on public.whatsapp_interactions
  for insert
  to authenticated
  with check (channel = 'whatsapp');

create policy whatsapp_interactions_auth_select
  on public.whatsapp_interactions
  for select
  to authenticated
  using (true);
