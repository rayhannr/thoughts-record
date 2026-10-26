-- Things to be grateful for, one row each. A day has as many as were written;
-- the day is read from occurred_at, so nothing here counts or expects any number.
create table public.gratitudes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,

  occurred_at timestamptz not null,
  content     text not null,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index gratitudes_user_occurred_idx on public.gratitudes (user_id, occurred_at desc);

create trigger gratitudes_set_updated_at
  before update on public.gratitudes
  for each row execute function public.set_updated_at();

alter table public.gratitudes enable row level security;

create policy "gratitudes_select_own" on public.gratitudes
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "gratitudes_insert_own" on public.gratitudes
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "gratitudes_update_own" on public.gratitudes
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "gratitudes_delete_own" on public.gratitudes
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Opt-in per link, like root causes: links made before this keep showing what they showed.
-- Unlike root causes these have an occurred time, so an opted-in link shows only the link's range.
alter table public.share_links
  add column include_gratitudes boolean not null default false;

create or replace function public.get_shared_entries(p_token_hash text) returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'range_from', l.range_from,
    'range_to', l.range_to,
    'expires_at', l.expires_at,
    'entries', coalesce((
      select jsonb_agg(to_jsonb(e) - 'user_id' order by e.occurred_at desc)
      from public.entries e
      where e.user_id = l.user_id
        and e.occurred_at >= l.range_from
        and (l.range_to is null or e.occurred_at <= l.range_to)
    ), '[]'::jsonb),
    'root_causes', case when l.include_root_causes then coalesce((
      select jsonb_agg(to_jsonb(r) - 'user_id' order by r.created_at desc)
      from public.root_causes r
      where r.user_id = l.user_id
    ), '[]'::jsonb) else '[]'::jsonb end,
    'gratitudes', case when l.include_gratitudes then coalesce((
      select jsonb_agg(to_jsonb(g) - 'user_id' order by g.occurred_at desc)
      from public.gratitudes g
      where g.user_id = l.user_id
        and g.occurred_at >= l.range_from
        and (l.range_to is null or g.occurred_at <= l.range_to)
    ), '[]'::jsonb) else '[]'::jsonb end
  )
  from public.share_links l
  where l.token_hash = p_token_hash
    and l.expires_at > now()
$$;
