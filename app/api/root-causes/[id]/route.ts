import type { NextRequest } from 'next/server'
import { readJson, withUser } from '@/lib/entries/http'
import { deleteRootCause, getRootCause, restoreRootCause, updateRootCause } from '@/lib/root-causes/actions'

export async function GET(_request: NextRequest, ctx: RouteContext<'/api/root-causes/[id]'>) {
  const { id } = await ctx.params
  return withUser(async (db, userId) => {
    const item = await getRootCause(db, userId, id)
    return item ? Response.json(item) : Response.json({ error: 'not found' }, { status: 404 })
  })
}

export async function PATCH(request: NextRequest, ctx: RouteContext<'/api/root-causes/[id]'>) {
  const { id } = await ctx.params
  const body = await readJson(request)
  return withUser(async (db, userId) => Response.json(await updateRootCause(db, userId, id, body)))
}

export async function DELETE(_request: NextRequest, ctx: RouteContext<'/api/root-causes/[id]'>) {
  const { id } = await ctx.params
  return withUser(async (db, userId) => {
    await deleteRootCause(db, userId, id)
    return new Response(null, { status: 204 })
  })
}

// Undo a delete: puts the record back exactly as it was.
export async function PUT(request: NextRequest, ctx: RouteContext<'/api/root-causes/[id]'>) {
  const { id } = await ctx.params
  const body = (await readJson(request)) as { id?: string } | null
  return withUser(async (db, userId) => {
    if (body?.id !== id) return Response.json({ error: 'invalid input' }, { status: 400 })
    await restoreRootCause(db, userId, body)
    return new Response(null, { status: 204 })
  })
}
