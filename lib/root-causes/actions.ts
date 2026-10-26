import type { SupabaseClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { CreateRootCause, RestoreRootCause, UpdateRootCause, type RootCause } from './schema'
import * as store from './store/supabase'

// The shared action layer: validation lives here, so HTTP routes and MCP tools
// are thin wrappers. `db` is a client already acting as `userId`.
const Id = z.uuid()

export async function listRootCauses(db: SupabaseClient, userId: string): Promise<RootCause[]> {
  return store.list(db, userId)
}

export async function getRootCause(db: SupabaseClient, userId: string, id: string): Promise<RootCause | null> {
  return store.get(db, userId, Id.parse(id))
}

export async function createRootCause(db: SupabaseClient, userId: string, input: unknown): Promise<RootCause> {
  return store.insert(db, userId, CreateRootCause.parse(input))
}

export async function updateRootCause(db: SupabaseClient, userId: string, id: string, input: unknown): Promise<RootCause> {
  const data = Object.fromEntries(Object.entries(UpdateRootCause.parse(input)).filter(([, v]) => v !== undefined))
  return store.update(db, userId, Id.parse(id), data)
}

export async function deleteRootCause(db: SupabaseClient, userId: string, id: string): Promise<void> {
  return store.remove(db, userId, Id.parse(id))
}

/** Puts back a record exactly as it was, for undoing a delete. */
export async function restoreRootCause(db: SupabaseClient, userId: string, input: unknown): Promise<void> {
  return store.upsert(db, userId, RestoreRootCause.parse(input))
}
