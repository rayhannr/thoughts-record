import type { CreateGratitude, Gratitude, ListGratitudes, UpdateGratitude } from '../schema'

// Signed-in mode: items live in the account, reached through app/api/gratitudes.
async function request(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(path, {
    ...init,
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined
  })
  if (!res.ok && res.status !== 404) throw new Error(`${init?.method ?? 'GET'} ${path} failed: ${res.status}`)
  return res
}

export async function listGratitudes(filter: ListGratitudes = {}): Promise<Gratitude[]> {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filter)) if (value) params.set(key, value)
  const query = params.size ? `?${params}` : ''
  return (await request(`/api/gratitudes${query}`)).json()
}

export async function getGratitude(id: string): Promise<Gratitude | null> {
  const res = await request(`/api/gratitudes/${id}`)
  return res.status === 404 ? null : res.json()
}

export async function createGratitude(input: CreateGratitude): Promise<Gratitude> {
  return (await request('/api/gratitudes', { method: 'POST', body: JSON.stringify(input) })).json()
}

export async function updateGratitude(id: string, input: UpdateGratitude): Promise<Gratitude> {
  const res = await request(`/api/gratitudes/${id}`, { method: 'PATCH', body: JSON.stringify(input) })
  if (res.status === 404) throw new Error(`gratitude ${id} not found`)
  return res.json()
}

export async function deleteGratitude(id: string): Promise<void> {
  await request(`/api/gratitudes/${id}`, { method: 'DELETE' })
}

/** Puts back an item exactly as it was, for undoing a delete. */
export async function restoreGratitude(item: Gratitude): Promise<void> {
  await request(`/api/gratitudes/${item.id}`, { method: 'PUT', body: JSON.stringify(item) })
}
