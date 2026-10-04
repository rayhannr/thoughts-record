// RFC 9728 metadata: tells an MCP client which authorization server issues
// tokens for /api/mcp. Supabase Auth is that server.
export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  return Response.json({
    resource: `${new URL(request.url).origin}/api/mcp`,
    authorization_servers: [`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1`],
    bearer_methods_supported: ['header']
  })
}
