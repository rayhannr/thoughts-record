create table public.entries (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users on delete cascade,

  occurred_at       timestamptz not null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- columns 1-4, shown in v1
  situation         text not null,
  thoughts          text not null,
  feelings          text not null,
  intensity         int  not null check (intensity between 0 and 100),
  evidence_for      text,

  -- columns 5-7, stored from day one, surfaced later
  evidence_against  text,
  balanced_thought  text,
  feeling_after     text,
  intensity_after   int  check (intensity_after between 0 and 100),

  status            text not null default 'draft' check (status in ('draft','done'))
);

create index entries_user_occurred_idx
  on public.entries (user_id, occurred_at desc);

create function public.set_updated_at() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger entries_set_updated_at
  before update on public.entries
  for each row execute function public.set_updated_at();

alter table public.entries enable row level security;

create policy "entries_select_own" on public.entries
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "entries_insert_own" on public.entries
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "entries_update_own" on public.entries
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "entries_delete_own" on public.entries
  for delete to authenticated
  using ((select auth.uid()) = user_id);
