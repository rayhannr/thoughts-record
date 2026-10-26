import type { NextRequest } from 'next/server'
import { readJson, withUser } from '@/lib/entries/http'
import { deleteGratitude, getGratitude, restoreGratitude, updateGratitude } from '@/lib/gratitudes/actions'

export async function GET(_request: NextRequest, ctx: RouteContext<'/api/gratitudes/[id]'>) {
  const { id } = await ctx.params
  return withUser(async (db, userId) => {
    const item = await getGratitude(db, userId, id)
    return item ? Response.json(item) : Response.json({ error: 'not found' }, { status: 404 })
  })
}

export async function PATCH(request: NextRequest, ctx: RouteContext<'/api/gratitudes/[id]'>) {
  const { id } = await ctx.params
  const body = await readJson(request)
  return withUser(async (db, userId) => Response.json(await updateGratitude(db, userId, id, body)))
}

export async function DELETE(_request: NextRequest, ctx: RouteContext<'/api/gratitudes/[id]'>) {
  const { id } = await ctx.params
  return withUser(async (db, userId) => {
    await deleteGratitude(db, userId, id)
    return new Response(null, { status: 204 })
  })
}

// Undo a delete: puts the item back exactly as it was.
export async function PUT(request: NextRequest, ctx: RouteContext<'/api/gratitudes/[id]'>) {
  const { id } = await ctx.params
  const body = (await readJson(request)) as { id?: string } | null
  return withUser(async (db, userId) => {
    if (body?.id !== id) return Response.json({ error: 'invalid input' }, { status: 400 })
    await restoreGratitude(db, userId, body)
    return new Response(null, { status: 204 })
  })
}
