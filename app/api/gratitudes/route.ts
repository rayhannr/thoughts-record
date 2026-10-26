import type { NextRequest } from 'next/server'
import { readJson, withUser } from '@/lib/entries/http'
import { createGratitude, listGratitudes } from '@/lib/gratitudes/actions'

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const filter = { from: params.get('from') ?? undefined, to: params.get('to') ?? undefined }
  return withUser(async (db, userId) => Response.json(await listGratitudes(db, userId, filter)))
}

export async function POST(request: NextRequest) {
  const body = await readJson(request)
  return withUser(async (db, userId) => Response.json(await createGratitude(db, userId, body), { status: 201 }))
}
