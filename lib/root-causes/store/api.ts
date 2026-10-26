import type { CreateRootCause, RootCause, UpdateRootCause } from '../schema'

// Signed-in mode: records live in the account, reached through app/api/root-causes.
async function request(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(path, {
    ...init,
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined
  })
  if (!res.ok && res.status !== 404) throw new Error(`${init?.method ?? 'GET'} ${path} failed: ${res.status}`)
  return res
}

export async function listRootCauses(): Promise<RootCause[]> {
  return (await request('/api/root-causes')).json()
}

export async function getRootCause(id: string): Promise<RootCause | null> {
  const res = await request(`/api/root-causes/${id}`)
  return res.status === 404 ? null : res.json()
}

export async function createRootCause(input: CreateRootCause): Promise<RootCause> {
  return (await request('/api/root-causes', { method: 'POST', body: JSON.stringify(input) })).json()
}

export async function updateRootCause(id: string, input: UpdateRootCause): Promise<RootCause> {
  const res = await request(`/api/root-causes/${id}`, { method: 'PATCH', body: JSON.stringify(input) })
  if (res.status === 404) throw new Error(`root cause ${id} not found`)
  return res.json()
}

export async function deleteRootCause(id: string): Promise<void> {
  await request(`/api/root-causes/${id}`, { method: 'DELETE' })
}

/** Puts back a record exactly as it was, for undoing a delete. */
export async function restoreRootCause(item: RootCause): Promise<void> {
  await request(`/api/root-causes/${item.id}`, { method: 'PUT', body: JSON.stringify(item) })
}
