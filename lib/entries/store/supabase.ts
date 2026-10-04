import type { SupabaseClient } from '@supabase/supabase-js'
import type { Entry, ListEntries } from '../schema'

// Server-side and the only module that touches the database. Every query is
// scoped by user_id on top of RLS, and entry bodies are never logged.
const COLUMNS =
  'id, occurred_at, created_at, updated_at, situation, thoughts, feelings, intensity, evidence_for, evidence_against, balanced_thought, feeling_after, intensity_after, status'

export class NotFoundError extends Error {}

// Postgres returns "+00:00" offsets; the client sorts and compares these as strings.
function toEntry(row: unknown): Entry {
  const r = row as Entry
  return {
    ...r,
    occurred_at: new Date(r.occurred_at).toISOString(),
    created_at: new Date(r.created_at).toISOString(),
    updated_at: new Date(r.updated_at).toISOString()
  }
}

function fail(error: { message: string }): never {
  throw new Error(`database error: ${error.message}`)
}

export async function list(db: SupabaseClient, userId: string, filter: ListEntries): Promise<Entry[]> {
  let query = db.from('entries').select(COLUMNS).eq('user_id', userId)
  if (filter.status) query = query.eq('status', filter.status)
  if (filter.from) query = query.gte('occurred_at', filter.from)
  if (filter.to) query = query.lte('occurred_at', filter.to)
  const { data, error } = await query.order('occurred_at', { ascending: false })
  if (error) fail(error)
  return (data ?? []).map(toEntry)
}

export async function get(db: SupabaseClient, userId: string, id: string): Promise<Entry | null> {
  const { data, error } = await db.from('entries').select(COLUMNS).eq('user_id', userId).eq('id', id).maybeSingle()
  if (error) fail(error)
  return data ? toEntry(data) : null
}

export async function insert(db: SupabaseClient, userId: string, values: object): Promise<Entry> {
  const { data, error } = await db
    .from('entries')
    .insert({ ...values, user_id: userId })
    .select(COLUMNS)
    .single()
  if (error) fail(error)
  return toEntry(data)
}

export async function update(db: SupabaseClient, userId: string, id: string, values: object): Promise<Entry> {
  const { data, error } = await db
    .from('entries')
    .update(values)
    .eq('user_id', userId)
    .eq('id', id)
    .select(COLUMNS)
    .maybeSingle()
  if (error) fail(error)
  if (!data) throw new NotFoundError(`entry ${id} not found`)
  return toEntry(data)
}

export async function remove(db: SupabaseClient, userId: string, id: string): Promise<void> {
  const { error } = await db.from('entries').delete().eq('user_id', userId).eq('id', id)
  if (error) fail(error)
}

export async function upsert(db: SupabaseClient, userId: string, values: object): Promise<void> {
  const { error } = await db.from('entries').upsert({ ...values, user_id: userId })
  if (error) fail(error)
}
