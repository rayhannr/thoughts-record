# Thought Record

A personal CBT thought-record journal: situation, automatic thoughts, feelings with an intensity rating, and evidence. Entries can be saved as drafts and finished later.

There are two front ends over one shared action layer:

- **Web app** for writing and reviewing entries. It works without an account (entries stay in `localStorage`) or signed in with Google (entries stored in Supabase).
- **MCP server** at `/api/mcp`, so entries can be written and reviewed from Claude on desktop and mobile. Signed-in entries only.

The UI is in Indonesian. The full design, data model and decisions are in [AGENTS.md](AGENTS.md).

## Stack

Next.js 16 (App Router), Tailwind CSS 4, TanStack Query, Supabase (Postgres, Auth, RLS), Zod 4, `@modelcontextprotocol/sdk`, deployed on Vercel.

## Local setup

1. `npm install`
2. Create a Supabase project and apply [supabase/migrations/](supabase/migrations/).
3. Enable the Google provider under Authentication → Providers.
4. Create `.env.local`:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```

5. `npm run dev` and open [http://localhost:3000](http://localhost:3000).

## Deploying

Deploy to Vercel with the two variables above, plus:

| Variable | Purpose |
|---|---|
| `CRON_SECRET` | Any long random string. Vercel sends it to `/api/cron/ping`, which rejects requests without it. |

[vercel.json](vercel.json) schedules that route daily at 03:00 UTC. It runs a trivial query so the Supabase free tier does not pause the project for inactivity. It reads no entry content.

In Supabase, set **Authentication → URL Configuration** to your deployed URL (Site URL, and the same URL plus `/**` in Redirect URLs).

## Connecting Claude (MCP)

Authentication is OAuth 2.1 with Supabase Auth as the authorization server. There are no tokens to copy. The access token Claude receives is the user's own Supabase JWT, so row level security scopes every tool call to that user.

**Supabase dashboard, once:**

1. Authentication → OAuth Server: turn it on.
2. Set **Authorization Path** to `/oauth/consent`.
3. Enable **dynamic client registration** (Claude registers itself this way).
4. Project Settings → JWT Keys: use an asymmetric signing key.

**Claude:** Settings → Connectors → Add custom connector, and paste `https://<your-app>.vercel.app/api/mcp`. Sign in with Google, approve on the consent screen, and the connector syncs to desktop and mobile.

**Tools:** `add_entry`, `list_entries`, `get_drafts`, `update_entry`, `delete_entry`. `occurred_at` must be a UTC ISO 8601 timestamp ending in `Z`.

How it fits together: an unauthenticated request to `/api/mcp` returns 401 with a `WWW-Authenticate` header pointing at `/.well-known/oauth-protected-resource`, which names Supabase as the authorization server. Claude then runs the login and consent flow there.

## Layout

```
lib/entries/       zod schemas, shared actions, Supabase and localStorage stores
lib/mcp/           MCP tool definitions over the actions
app/api/entries/   HTTP routes over the actions
app/api/mcp/       MCP endpoint
app/api/cron/ping/ daily keep-alive
app/(app)/         writing and review UI
app/(auth)/        login and OAuth consent
```
