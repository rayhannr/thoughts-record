import type { SupabaseClient } from '@supabase/supabase-js'
import { ZodError } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { NotFoundError } from './store/supabase'

type Handler = (db: SupabaseClient, userId: string) => Promise<Response>

/** Resolves the session to a user and maps failures to status codes. Never echoes entry bodies. */
export async function withUser(handler: Handler): Promise<Response> {
  const db = await createClient()
  const { data } = await db.auth.getUser()
  if (!data.user) return Response.json({ error: 'unauthorized' }, { status: 401 })

  try {
    return await handler(db, data.user.id)
  } catch (e) {
    if (e instanceof ZodError) return Response.json({ error: 'invalid input' }, { status: 400 })
    if (e instanceof NotFoundError) return Response.json({ error: 'not found' }, { status: 404 })
    console.error('entries route failed:', e instanceof Error ? e.message : 'unknown')
    return Response.json({ error: 'server error' }, { status: 500 })
  }
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json()
  } catch {
    return null
  }
}
