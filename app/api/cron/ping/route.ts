import { createClient } from '@supabase/supabase-js'

// Vercel Cron calls this daily so the Supabase free tier does not pause the
// project for inactivity. It is an anonymous query: RLS returns no rows, so no
// entry content is read.
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'unauthorized' }, { status: 401 })
  }

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const { error } = await db.from('entries').select('id').limit(1)
  if (error) {
    console.error('ping failed:', error.message)
    return Response.json({ ok: false }, { status: 500 })
  }
  return Response.json({ ok: true })
}
