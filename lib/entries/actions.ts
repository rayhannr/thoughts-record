import type { SupabaseClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { CreateEntry, ListEntries, RestoreEntry, UpdateEntry, statusFor, type Entry } from './schema'
import * as store from './store/supabase'

// The shared action layer: validation and rules live here, so HTTP routes (and
// later MCP tools) are thin wrappers. `db` is a client already acting as `userId`.
const Id = z.uuid()

export async function listEntries(db: SupabaseClient, userId: string, filter: unknown = {}): Promise<Entry[]> {
  return store.list(db, userId, ListEntries.parse(filter))
}

export async function getEntry(db: SupabaseClient, userId: string, id: string): Promise<Entry | null> {
  return store.get(db, userId, Id.parse(id))
}

export async function createEntry(db: SupabaseClient, userId: string, input: unknown): Promise<Entry> {
  const data = CreateEntry.parse(input)
  return store.insert(db, userId, { ...data, status: statusFor(data.evidence_for) })
}

export async function updateEntry(db: SupabaseClient, userId: string, id: string, input: unknown): Promise<Entry> {
  const data = Object.fromEntries(Object.entries(UpdateEntry.parse(input)).filter(([, v]) => v !== undefined))
  const status = 'evidence_for' in data ? { status: statusFor(data.evidence_for as string | null) } : {}
  return store.update(db, userId, Id.parse(id), { ...data, ...status })
}

export async function deleteEntry(db: SupabaseClient, userId: string, id: string): Promise<void> {
  return store.remove(db, userId, Id.parse(id))
}

/** Puts back an entry exactly as it was, for undoing a delete. */
export async function restoreEntry(db: SupabaseClient, userId: string, input: unknown): Promise<void> {
  return store.upsert(db, userId, RestoreEntry.parse(input))
}
