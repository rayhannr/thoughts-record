import type { SupabaseClient } from '@supabase/supabase-js'
import { NotFoundError } from '@/lib/entries/store/supabase'
import type { RootCause } from '../schema'

// Server-side and the only module that touches root_causes. Every query is
// scoped by user_id on top of RLS, and bodies are never logged.
const COLUMNS = 'id, condition, triggers, created_at, updated_at'

// Postgres returns "+00:00" offsets; the client sorts and compares these as strings.
export function toRootCause(row: unknown): RootCause {
  const r = row as RootCause
  return { ...r, created_at: new Date(r.created_at).toISOString(), updated_at: new Date(r.updated_at).toISOString() }
}

function fail(error: { message: string }): never {
  throw new Error(`database error: ${error.message}`)
}

export async function list(db: SupabaseClient, userId: string): Promise<RootCause[]> {
  const { data, error } = await db
    .from('root_causes')
    .select(COLUMNS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) fail(error)
  return (data ?? []).map(toRootCause)
}

export async function get(db: SupabaseClient, userId: string, id: string): Promise<RootCause | null> {
  const { data, error } = await db.from('root_causes').select(COLUMNS).eq('user_id', userId).eq('id', id).maybeSingle()
  if (error) fail(error)
  return data ? toRootCause(data) : null
}

export async function insert(db: SupabaseClient, userId: string, values: object): Promise<RootCause> {
  const { data, error } = await db
    .from('root_causes')
    .insert({ ...values, user_id: userId })
    .select(COLUMNS)
    .single()
  if (error) fail(error)
  return toRootCause(data)
}

export async function update(db: SupabaseClient, userId: string, id: string, values: object): Promise<RootCause> {
  const { data, error } = await db
    .from('root_causes')
    .update(values)
    .eq('user_id', userId)
    .eq('id', id)
    .select(COLUMNS)
    .maybeSingle()
  if (error) fail(error)
  if (!data) throw new NotFoundError(`root cause ${id} not found`)
  return toRootCause(data)
}

export async function remove(db: SupabaseClient, userId: string, id: string): Promise<void> {
  const { error } = await db.from('root_causes').delete().eq('user_id', userId).eq('id', id)
  if (error) fail(error)
}

export async function upsert(db: SupabaseClient, userId: string, values: object): Promise<void> {
  const { error } = await db.from('root_causes').upsert({ ...values, user_id: userId })
  if (error) fail(error)
}
