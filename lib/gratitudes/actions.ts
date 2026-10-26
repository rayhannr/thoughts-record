import type { SupabaseClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { CreateGratitude, ListGratitudes, RestoreGratitude, UpdateGratitude, type Gratitude } from './schema'
import * as store from './store/supabase'

// The shared action layer: validation lives here, so HTTP routes and MCP tools
// are thin wrappers. `db` is a client already acting as `userId`.
const Id = z.uuid()

export async function listGratitudes(db: SupabaseClient, userId: string, filter: unknown = {}): Promise<Gratitude[]> {
  return store.list(db, userId, ListGratitudes.parse(filter))
}

export async function getGratitude(db: SupabaseClient, userId: string, id: string): Promise<Gratitude | null> {
  return store.get(db, userId, Id.parse(id))
}

export async function createGratitude(db: SupabaseClient, userId: string, input: unknown): Promise<Gratitude> {
  return store.insert(db, userId, CreateGratitude.parse(input))
}

export async function updateGratitude(db: SupabaseClient, userId: string, id: string, input: unknown): Promise<Gratitude> {
  const data = Object.fromEntries(Object.entries(UpdateGratitude.parse(input)).filter(([, v]) => v !== undefined))
  return store.update(db, userId, Id.parse(id), data)
}

export async function deleteGratitude(db: SupabaseClient, userId: string, id: string): Promise<void> {
  return store.remove(db, userId, Id.parse(id))
}

/** Puts back an item exactly as it was, for undoing a delete. */
export async function restoreGratitude(db: SupabaseClient, userId: string, input: unknown): Promise<void> {
  return store.upsert(db, userId, RestoreGratitude.parse(input))
}
