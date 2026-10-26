-- Root cause analysis: a condition the person lives with, and what in the past
-- likely set it off. `triggers` is free text and may run to several paragraphs,
-- one per suspected trigger.
create table public.root_causes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,

  condition   text not null,
  triggers    text not null,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index root_causes_user_created_idx on public.root_causes (user_id, created_at desc);

create trigger root_causes_set_updated_at
  before update on public.root_causes
  for each row execute function public.set_updated_at();

alter table public.root_causes enable row level security;

create policy "root_causes_select_own" on public.root_causes
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "root_causes_insert_own" on public.root_causes
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "root_causes_update_own" on public.root_causes
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "root_causes_delete_own" on public.root_causes
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- A share link shows root causes only when its owner opted in, so links made
-- before this existed keep showing exactly what they showed. Root causes carry
-- no occurred time, so an opted-in link shows all of them, not just a range.
alter table public.share_links
  add column include_root_causes boolean not null default false;

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
    ), '[]'::jsonb) else '[]'::jsonb end
  )
  from public.share_links l
  where l.token_hash = p_token_hash
    and l.expires_at > now()
$$;
