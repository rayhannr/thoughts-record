import { createClient } from '@supabase/supabase-js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { createMcpServer } from '@/lib/mcp/server'

// Stateless Streamable HTTP: a fresh server and transport per request, which is
// what serverless needs. Auth is the Supabase OAuth access token Claude obtained.
export const dynamic = 'force-dynamic'

function unauthorized(request: Request) {
  const metadata = `${new URL(request.url).origin}/.well-known/oauth-protected-resource`
  return Response.json(
    { error: 'unauthorized' },
    { status: 401, headers: { 'WWW-Authenticate': `Bearer resource_metadata="${metadata}"` } }
  )
}

async function handle(request: Request): Promise<Response> {
  const token = request.headers.get('authorization')?.match(/^Bearer (.+)$/i)?.[1]
  if (!token) return unauthorized(request)

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false }
  })
  const { data } = await db.auth.getUser(token)
  if (!data.user) return unauthorized(request)

  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true })
  await createMcpServer(db, data.user.id).connect(transport)
  return transport.handleRequest(request)
}

export { handle as GET, handle as POST, handle as DELETE }
