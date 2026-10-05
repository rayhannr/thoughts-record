import { CreateEntry, ListEntries, UpdateEntry, statusFor, type Entry } from '../schema'

// Anonymous mode: entries live only in this browser and never reach the server.
const KEY = 'thought-record:entries:v1'

function read(): Entry[] {
  const raw = window.localStorage.getItem(KEY)
  if (!raw) return []
  const parsed: unknown = JSON.parse(raw)
  if (!Array.isArray(parsed)) throw new Error('entries in localStorage are not an array')
  return parsed.map(upgrade)
}

// Entries written before feelings carried their own intensity had a text
// `feelings` and a top-level `intensity`.
function upgrade(raw: unknown): Entry {
  const e = raw as Entry & { intensity?: number }
  if (Array.isArray(e.feelings)) return e
  const { intensity, ...rest } = e
  return { ...rest, feelings: [{ name: String(e.feelings), intensity: intensity ?? 0, valence: null }] }
}

function write(entries: Entry[]) {
  window.localStorage.setItem(KEY, JSON.stringify(entries))
}

function byOccurredDesc(a: Entry, b: Entry) {
  return b.occurred_at.localeCompare(a.occurred_at)
}

export async function listEntries(filter: ListEntries = {}): Promise<Entry[]> {
  const { status, from, to } = ListEntries.parse(filter)
  return read()
    .filter(e => !status || e.status === status)
    .filter(e => !from || e.occurred_at >= from)
    .filter(e => !to || e.occurred_at <= to)
    .sort(byOccurredDesc)
}

export async function getEntry(id: string): Promise<Entry | null> {
  return read().find(e => e.id === id) ?? null
}

export async function createEntry(input: CreateEntry): Promise<Entry> {
  const data = CreateEntry.parse(input)
  const now = new Date().toISOString()
  const entry: Entry = {
    ...data,
    id: crypto.randomUUID(),
    created_at: now,
    updated_at: now,
    status: statusFor(data.evidence_for)
  }
  write([...read(), entry])
  return entry
}

export async function updateEntry(id: string, input: UpdateEntry): Promise<Entry> {
  const data = UpdateEntry.parse(input)
  const entries = read()
  const index = entries.findIndex(e => e.id === id)
  if (index === -1) throw new Error(`entry ${id} not found`)

  const merged = { ...entries[index], ...stripUndefined(data) }
  const entry: Entry = {
    ...merged,
    updated_at: new Date().toISOString(),
    status: statusFor(merged.evidence_for)
  }
  entries[index] = entry
  write(entries)
  return entry
}

export async function deleteEntry(id: string): Promise<void> {
  write(read().filter(e => e.id !== id))
}

/** Puts back an entry exactly as it was, for undoing a delete. */
export async function restoreEntry(entry: Entry): Promise<void> {
  write([...read().filter(e => e.id !== entry.id), entry])
}

function stripUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>
}
