import type { SupabaseClient } from '@supabase/supabase-js'
import { toEntry } from '@/lib/entries/store/supabase'
import { toRootCause } from '@/lib/root-causes/store/supabase'
import type { ShareLink, SharedView } from '../schema'

// Server-side and the only module that touches share_links. Every owner query is
// scoped by user_id on top of RLS; a viewer reaches data only through get_shared_entries.
const COLUMNS = 'id, range_from, range_to, expires_at, created_at, include_root_causes'

function fail(error: { message: string }): never {
  throw new Error(`database error: ${error.message}`)
}

const iso = (v: string) => new Date(v).toISOString()

function toLink(row: unknown): ShareLink {
  const r = row as ShareLink
  return {
    ...r,
    range_from: iso(r.range_from),
    range_to: r.range_to ? iso(r.range_to) : null,
    expires_at: iso(r.expires_at),
    created_at: iso(r.created_at)
  }
}

/** Links that still open. Expired ones are no use to list. */
export async function list(db: SupabaseClient, userId: string): Promise<ShareLink[]> {
  const { data, error } = await db
    .from('share_links')
    .select(COLUMNS)
    .eq('user_id', userId)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
  if (error) fail(error)
  return (data ?? []).map(toLink)
}

export async function insert(db: SupabaseClient, userId: string, values: object): Promise<ShareLink> {
  const { data, error } = await db
    .from('share_links')
    .insert({ ...values, user_id: userId })
    .select(COLUMNS)
    .single()
  if (error) fail(error)
  return toLink(data)
}

export async function remove(db: SupabaseClient, userId: string, id: string): Promise<void> {
  const { error } = await db.from('share_links').delete().eq('user_id', userId).eq('id', id)
  if (error) fail(error)
}

export async function fetchShared(db: SupabaseClient, tokenHash: string): Promise<SharedView | null> {
  const { data, error } = await db.rpc('get_shared_entries', { p_token_hash: tokenHash })
  if (error) fail(error)
  if (!data) return null
  const v = data as SharedView
  return {
    range_from: iso(v.range_from),
    range_to: v.range_to ? iso(v.range_to) : null,
    expires_at: iso(v.expires_at),
    entries: v.entries.map(toEntry),
    root_causes: (v.root_causes ?? []).map(toRootCause)
  }
}
