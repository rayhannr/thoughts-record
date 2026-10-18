import { createHash, randomBytes } from 'node:crypto'
import type { SupabaseClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { CreateShareLink, type ShareLink, type SharedView } from './schema'
import * as store from './store/supabase'

const Id = z.uuid()
// 32 random bytes as base64url. Anything else cannot be a token, so it never reaches the database.
const Token = z.string().regex(/^[A-Za-z0-9_-]{43}$/)

const DAY_MS = 86_400_000

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export async function listShareLinks(db: SupabaseClient, userId: string): Promise<ShareLink[]> {
  return store.list(db, userId)
}

/** The token is returned once and cannot be recovered later: only its hash is kept. */
export async function createShareLink(
  db: SupabaseClient,
  userId: string,
  input: unknown
): Promise<{ link: ShareLink; token: string }> {
  const data = CreateShareLink.parse(input)
  const token = randomBytes(32).toString('base64url')
  const link = await store.insert(db, userId, {
    token_hash: hashToken(token),
    range_from: data.range_from,
    range_to: data.range_to,
    expires_at: new Date(Date.now() + data.expires_in_days * DAY_MS).toISOString()
  })
  return { link, token }
}

/** Revoking is deleting: the link stops opening immediately. */
export async function revokeShareLink(db: SupabaseClient, userId: string, id: string): Promise<void> {
  return store.remove(db, userId, Id.parse(id))
}

/** For a viewer with no account. Null for a malformed, unknown or expired token alike. */
export async function getSharedView(db: SupabaseClient, token: string): Promise<SharedView | null> {
  const parsed = Token.safeParse(token)
  return parsed.success ? store.fetchShared(db, hashToken(parsed.data)) : null
}
