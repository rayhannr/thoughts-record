import { CreateRootCause, UpdateRootCause, type RootCause } from '../schema'

// Anonymous mode: records live only in this browser and never reach the server.
const KEY = 'thought-record:root-causes:v1'

function read(): RootCause[] {
  const raw = window.localStorage.getItem(KEY)
  if (!raw) return []
  const parsed: unknown = JSON.parse(raw)
  if (!Array.isArray(parsed)) throw new Error('root causes in localStorage are not an array')
  return parsed as RootCause[]
}

function write(items: RootCause[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items))
}

export async function listRootCauses(): Promise<RootCause[]> {
  return read().sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function getRootCause(id: string): Promise<RootCause | null> {
  return read().find(r => r.id === id) ?? null
}

export async function createRootCause(input: CreateRootCause): Promise<RootCause> {
  const now = new Date().toISOString()
  const item: RootCause = { ...CreateRootCause.parse(input), id: crypto.randomUUID(), created_at: now, updated_at: now }
  write([...read(), item])
  return item
}

export async function updateRootCause(id: string, input: UpdateRootCause): Promise<RootCause> {
  const data = Object.fromEntries(Object.entries(UpdateRootCause.parse(input)).filter(([, v]) => v !== undefined))
  const items = read()
  const index = items.findIndex(r => r.id === id)
  if (index === -1) throw new Error(`root cause ${id} not found`)
  const item: RootCause = { ...items[index], ...data, updated_at: new Date().toISOString() }
  items[index] = item
  write(items)
  return item
}

export async function deleteRootCause(id: string): Promise<void> {
  write(read().filter(r => r.id !== id))
}

/** Puts back a record exactly as it was, for undoing a delete. */
export async function restoreRootCause(item: RootCause): Promise<void> {
  write([...read().filter(r => r.id !== item.id), item])
}
