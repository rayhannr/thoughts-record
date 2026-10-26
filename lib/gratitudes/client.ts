'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useUser } from '@/components/auth-provider'
import type { CreateGratitude, Gratitude, UpdateGratitude } from './schema'
import * as api from './store/api'
import * as local from './store/local'

// The one place that chooses where items go: the account when signed in,
// this browser's localStorage only when not.
function useStore() {
  const user = useUser()
  return {
    ready: user !== undefined,
    scope: user?.id ?? 'anonymous',
    store: user ? api : local
  }
}

const keys = {
  all: ['gratitudes'] as const,
  list: (scope: string) => ['gratitudes', scope, 'list'] as const
}

export function useGratitudes() {
  const { ready, scope, store } = useStore()
  return useQuery({
    queryKey: keys.list(scope),
    queryFn: () => store.listGratitudes(),
    enabled: ready
  })
}

export function useCreateGratitude() {
  const { store } = useStore()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateGratitude) => store.createGratitude(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all })
  })
}

export function useUpdateGratitude(id: string) {
  const { store } = useStore()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateGratitude) => store.updateGratitude(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all })
  })
}

/** Deletes an item and offers to put it back. */
export function useRemoveGratitude() {
  const { store } = useStore()
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: keys.all })

  return async (item: Gratitude) => {
    try {
      await store.deleteGratitude(item.id)
    } catch {
      toast.error('belum terhapus. coba lagi.')
      return
    }
    await invalidate()
    toast('catatan dihapus', {
      action: { label: 'kembalikan', onClick: () => store.restoreGratitude(item).then(invalidate) }
    })
  }
}
