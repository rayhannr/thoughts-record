import type { SupabaseClient } from '@supabase/supabase-js'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z, ZodError } from 'zod'
import { createEntry, deleteEntry, listEntries, updateEntry } from '@/lib/entries/actions'
import { CreateEntry, ListEntries, UpdateEntry } from '@/lib/entries/schema'
import { NotFoundError } from '@/lib/entries/store/supabase'

// MCP tools over the shared action layer. `db` carries the caller's own token,
// so RLS scopes every call to that user. No model and no prompt live here.
function json(value: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(value) }] }
}

function failure(message: string) {
  return { isError: true, content: [{ type: 'text' as const, text: message }] }
}

async function run(fn: () => Promise<unknown>) {
  try {
    return json(await fn())
  } catch (e) {
    if (e instanceof ZodError) return failure(`invalid input: ${e.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')}`)
    if (e instanceof NotFoundError) return failure('entry not found')
    console.error('mcp tool failed:', e instanceof Error ? e.message : 'unknown')
    return failure('server error')
  }
}

export function createMcpServer(db: SupabaseClient, userId: string) {
  const server = new McpServer({ name: 'thought-record', version: '1.0.0' })

  server.registerTool(
    'add_entry',
    {
      description:
        'Create a thought-record entry. Columns: situation, thoughts, feelings, and evidence_for. ' +
        'feelings is a list of {name, intensity}: one entry per feeling, name in free text, intensity 0-100. A situation can have several. ' +
        'Omit evidence_for to save a draft. occurred_at is when the situation happened (ISO 8601), not now.',
      inputSchema: CreateEntry.shape
    },
    input => run(() => createEntry(db, userId, input))
  )

  server.registerTool(
    'list_entries',
    {
      description: 'List entries, newest first. Optionally filter by status (draft or done) and an occurred_at range (ISO 8601).',
      inputSchema: ListEntries.shape
    },
    filter => run(() => listEntries(db, userId, filter))
  )

  server.registerTool(
    'get_drafts',
    { description: 'List draft entries, the ones still missing evidence_for, so they can be finished.' },
    () => run(() => listEntries(db, userId, { status: 'draft' }))
  )

  server.registerTool(
    'update_entry',
    {
      description: 'Fill in or correct fields on an existing entry. Setting evidence_for turns a draft into done.',
      inputSchema: { id: z.uuid(), ...UpdateEntry.shape }
    },
    ({ id, ...fields }) => run(() => updateEntry(db, userId, id, fields))
  )

  server.registerTool(
    'delete_entry',
    { description: 'Permanently delete an entry.', inputSchema: { id: z.uuid() } },
    ({ id }) => run(async () => (await deleteEntry(db, userId, id), { deleted: id }))
  )

  return server
}
