import type { SupabaseClient } from '@supabase/supabase-js'
import { NotFoundError } from '@/lib/entries/store/supabase'
import type { Gratitude, ListGratitudes } from '../schema'

// Server-side and the only module that touches gratitudes. Every query is
// scoped by user_id on top of RLS, and bodies are never logged.
const COLUMNS = 'id, occurred_at, content, created_at, updated_at'

// Postgres returns "+00:00" offsets; the client sorts and compares these as strings.
export function toGratitude(row: unknown): Gratitude {
  const r = row as Gratitude
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

export async function list(db: SupabaseClient, userId: string, filter: ListGratitudes): Promise<Gratitude[]> {
  let query = db.from('gratitudes').select(COLUMNS).eq('user_id', userId)
  if (filter.from) query = query.gte('occurred_at', filter.from)
  if (filter.to) query = query.lte('occurred_at', filter.to)
  const { data, error } = await query.order('occurred_at', { ascending: false })
  if (error) fail(error)
  return (data ?? []).map(toGratitude)
}

export async function get(db: SupabaseClient, userId: string, id: string): Promise<Gratitude | null> {
  const { data, error } = await db.from('gratitudes').select(COLUMNS).eq('user_id', userId).eq('id', id).maybeSingle()
  if (error) fail(error)
  return data ? toGratitude(data) : null
}

export async function insert(db: SupabaseClient, userId: string, values: object): Promise<Gratitude> {
  const { data, error } = await db
    .from('gratitudes')
    .insert({ ...values, user_id: userId })
    .select(COLUMNS)
    .single()
  if (error) fail(error)
  return toGratitude(data)
}

export async function update(db: SupabaseClient, userId: string, id: string, values: object): Promise<Gratitude> {
  const { data, error } = await db
    .from('gratitudes')
    .update(values)
    .eq('user_id', userId)
    .eq('id', id)
    .select(COLUMNS)
    .maybeSingle()
  if (error) fail(error)
  if (!data) throw new NotFoundError(`gratitude ${id} not found`)
  return toGratitude(data)
}

export async function remove(db: SupabaseClient, userId: string, id: string): Promise<void> {
  const { error } = await db.from('gratitudes').delete().eq('user_id', userId).eq('id', id)
  if (error) fail(error)
}

export async function upsert(db: SupabaseClient, userId: string, values: object): Promise<void> {
  const { error } = await db.from('gratitudes').upsert({ ...values, user_id: userId })
  if (error) fail(error)
}
