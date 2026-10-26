import type { NextRequest } from 'next/server'
import { readJson, withUser } from '@/lib/entries/http'
import { createRootCause, listRootCauses } from '@/lib/root-causes/actions'

export function GET() {
  return withUser(async (db, userId) => Response.json(await listRootCauses(db, userId)))
}

export async function POST(request: NextRequest) {
  const body = await readJson(request)
  return withUser(async (db, userId) => Response.json(await createRootCause(db, userId, body), { status: 201 }))
}
