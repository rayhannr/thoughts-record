import { CreateGratitude, ListGratitudes, UpdateGratitude, type Gratitude } from '../schema'

// Anonymous mode: items live only in this browser and never reach the server.
const KEY = 'thought-record:gratitudes:v1'

function read(): Gratitude[] {
  const raw = window.localStorage.getItem(KEY)
  if (!raw) return []
  const parsed: unknown = JSON.parse(raw)
  if (!Array.isArray(parsed)) throw new Error('gratitudes in localStorage are not an array')
  return parsed as Gratitude[]
}

function write(items: Gratitude[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items))
}

export async function listGratitudes(filter: ListGratitudes = {}): Promise<Gratitude[]> {
  const { from, to } = ListGratitudes.parse(filter)
  return read()
    .filter(g => !from || g.occurred_at >= from)
    .filter(g => !to || g.occurred_at <= to)
    .sort((a, b) => b.occurred_at.localeCompare(a.occurred_at))
}

export async function getGratitude(id: string): Promise<Gratitude | null> {
  return read().find(g => g.id === id) ?? null
}

export async function createGratitude(input: CreateGratitude): Promise<Gratitude> {
  const now = new Date().toISOString()
  const item: Gratitude = { ...CreateGratitude.parse(input), id: crypto.randomUUID(), created_at: now, updated_at: now }
  write([...read(), item])
  return item
}

export async function updateGratitude(id: string, input: UpdateGratitude): Promise<Gratitude> {
  const data = Object.fromEntries(Object.entries(UpdateGratitude.parse(input)).filter(([, v]) => v !== undefined))
  const items = read()
  const index = items.findIndex(g => g.id === id)
  if (index === -1) throw new Error(`gratitude ${id} not found`)
  const item: Gratitude = { ...items[index], ...data, updated_at: new Date().toISOString() }
  items[index] = item
  write(items)
  return item
}

export async function deleteGratitude(id: string): Promise<void> {
  write(read().filter(g => g.id !== id))
}

/** Puts back an item exactly as it was, for undoing a delete. */
export async function restoreGratitude(item: Gratitude): Promise<void> {
  write([...read().filter(g => g.id !== item.id), item])
}
