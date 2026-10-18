import type { NextRequest } from 'next/server'
import { withUser } from '@/lib/entries/http'
import { revokeShareLink } from '@/lib/share/actions'

export async function DELETE(_request: NextRequest, ctx: RouteContext<'/api/share/[id]'>) {
  const { id } = await ctx.params
  return withUser(async (db, userId) => {
    await revokeShareLink(db, userId, id)
    return new Response(null, { status: 204 })
  })
}
