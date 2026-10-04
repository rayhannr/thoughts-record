import type { CreateEntry, Entry, ListEntries, UpdateEntry } from '../schema'

// Signed-in mode: entries live in the account, reached through app/api/entries.
async function request(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(path, {
    ...init,
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined
  })
  if (!res.ok && res.status !== 404) throw new Error(`${init?.method ?? 'GET'} ${path} failed: ${res.status}`)
  return res
}

export async function listEntries(filter: ListEntries = {}): Promise<Entry[]> {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filter)) if (value) params.set(key, value)
  const query = params.size ? `?${params}` : ''
  return (await request(`/api/entries${query}`)).json()
}

export async function getEntry(id: string): Promise<Entry | null> {
  const res = await request(`/api/entries/${id}`)
  return res.status === 404 ? null : res.json()
}

export async function createEntry(input: CreateEntry): Promise<Entry> {
  return (await request('/api/entries', { method: 'POST', body: JSON.stringify(input) })).json()
}

export async function updateEntry(id: string, input: UpdateEntry): Promise<Entry> {
  const res = await request(`/api/entries/${id}`, { method: 'PATCH', body: JSON.stringify(input) })
  if (res.status === 404) throw new Error(`entry ${id} not found`)
  return res.json()
}

export async function deleteEntry(id: string): Promise<void> {
  await request(`/api/entries/${id}`, { method: 'DELETE' })
}

/** Puts back an entry exactly as it was, for undoing a delete. */
export async function restoreEntry(entry: Entry): Promise<void> {
  await request(`/api/entries/${entry.id}`, { method: 'PUT', body: JSON.stringify(entry) })
}
