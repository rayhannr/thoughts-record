import type { NextRequest } from 'next/server'
import { createEntry, listEntries } from '@/lib/entries/actions'
import { readJson, withUser } from '@/lib/entries/http'

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const filter = {
    status: params.get('status') ?? undefined,
    from: params.get('from') ?? undefined,
    to: params.get('to') ?? undefined
  }
  return withUser(async (db, userId) => Response.json(await listEntries(db, userId, filter)))
}

export async function POST(request: NextRequest) {
  const body = await readJson(request)
  return withUser(async (db, userId) => Response.json(await createEntry(db, userId, body), { status: 201 }))
}
