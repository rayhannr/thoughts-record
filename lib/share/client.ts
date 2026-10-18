'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useUser } from '@/components/auth-provider'
import type { CreateShareLink, ShareLink } from './schema'

async function request(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(path, {
    ...init,
    headers: init?.body ? { 'Content-Type': 'application/json' } : undefined
  })
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} failed: ${res.status}`)
  return res
}

const key = ['share'] as const

export function useShareLinks() {
  const user = useUser()
  return useQuery<ShareLink[]>({
    queryKey: [...key, user?.id],
    queryFn: async () => (await request('/api/share')).json(),
    enabled: !!user
  })
}

export function useCreateShareLink() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateShareLink): Promise<{ link: ShareLink; token: string }> =>
      (await request('/api/share', { method: 'POST', body: JSON.stringify(input) })).json(),
    onSuccess: () => qc.invalidateQueries({ queryKey: key })
  })
}

export function useRevokeShareLink() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await request(`/api/share/${id}`, { method: 'DELETE' })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key })
  })
}
