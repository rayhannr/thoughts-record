import type { NextRequest } from 'next/server'
import { deleteEntry, getEntry, restoreEntry, updateEntry } from '@/lib/entries/actions'
import { readJson, withUser } from '@/lib/entries/http'

export async function GET(_request: NextRequest, ctx: RouteContext<'/api/entries/[id]'>) {
  const { id } = await ctx.params
  return withUser(async (db, userId) => {
    const entry = await getEntry(db, userId, id)
    return entry ? Response.json(entry) : Response.json({ error: 'not found' }, { status: 404 })
  })
}

export async function PATCH(request: NextRequest, ctx: RouteContext<'/api/entries/[id]'>) {
  const { id } = await ctx.params
  const body = await readJson(request)
  return withUser(async (db, userId) => Response.json(await updateEntry(db, userId, id, body)))
}

export async function DELETE(_request: NextRequest, ctx: RouteContext<'/api/entries/[id]'>) {
  const { id } = await ctx.params
  return withUser(async (db, userId) => {
    await deleteEntry(db, userId, id)
    return new Response(null, { status: 204 })
  })
}

// Undo a delete: puts the entry back exactly as it was.
export async function PUT(request: NextRequest, ctx: RouteContext<'/api/entries/[id]'>) {
  const { id } = await ctx.params
  const body = (await readJson(request)) as { id?: string } | null
  return withUser(async (db, userId) => {
    if (body?.id !== id) return Response.json({ error: 'invalid input' }, { status: 400 })
    await restoreEntry(db, userId, body)
    return new Response(null, { status: 204 })
  })
}
