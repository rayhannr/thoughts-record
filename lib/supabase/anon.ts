import { createClient } from '@supabase/supabase-js'

/** A client with no session, for pages opened without an account. Everything it can reach is behind RLS. */
export function createAnonClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false }
  })
}
