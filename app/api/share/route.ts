import type { NextRequest } from 'next/server'
import { readJson, withUser } from '@/lib/entries/http'
import { createShareLink, listShareLinks } from '@/lib/share/actions'

export function GET() {
  return withUser(async (db, userId) => Response.json(await listShareLinks(db, userId)))
}

export async function POST(request: NextRequest) {
  const body = await readJson(request)
  return withUser(async (db, userId) => Response.json(await createShareLink(db, userId, body), { status: 201 }))
}
