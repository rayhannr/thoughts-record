-- Revocable read-only links for showing entries to someone without an account.
-- Only a sha256 hash of the token is stored, so a leaked table gives no working link.
-- Revoking a link is deleting its row.
create table public.share_links (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,

  token_hash  text not null unique,

  -- Live: entries written later inside the range show up too. A null range_to is open-ended.
  range_from  timestamptz not null,
  range_to    timestamptz,

  expires_at  timestamptz not null,
  created_at  timestamptz not null default now(),

  check (range_to is null or range_to >= range_from)
);

create index share_links_user_idx on public.share_links (user_id, created_at desc);

alter table public.share_links enable row level security;

create policy "share_links_select_own" on public.share_links
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "share_links_insert_own" on public.share_links
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "share_links_delete_own" on public.share_links
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- The only read path for a viewer with no account. It answers for exactly one valid
-- token: every entry inside that link's range, owner id stripped. It returns
-- null for an unknown or expired token, so the caller cannot tell which it was.
create function public.get_shared_entries(p_token_hash text) returns jsonb
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
    ), '[]'::jsonb)
  )
  from public.share_links l
  where l.token_hash = p_token_hash
    and l.expires_at > now()
$$;

revoke all on function public.get_shared_entries(text) from public;
grant execute on function public.get_shared_entries(text) to anon, authenticated;
