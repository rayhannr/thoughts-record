'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useUser } from '@/components/auth-provider'
import type { CreateRootCause, RootCause, UpdateRootCause } from './schema'
import * as api from './store/api'
import * as local from './store/local'

// The one place that chooses where records go: the account when signed in,
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
  all: ['root-causes'] as const,
  list: (scope: string) => ['root-causes', scope, 'list'] as const
}

export function useRootCauses() {
  const { ready, scope, store } = useStore()
  return useQuery({
    queryKey: keys.list(scope),
    queryFn: () => store.listRootCauses(),
    enabled: ready
  })
}

export function useCreateRootCause() {
  const { store } = useStore()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateRootCause) => store.createRootCause(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all })
  })
}

export function useUpdateRootCause(id: string) {
  const { store } = useStore()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateRootCause) => store.updateRootCause(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all })
  })
}

export function useDeleteRootCause() {
  const { store } = useStore()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => store.deleteRootCause(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all })
  })
}

export function useRestoreRootCause() {
  const { store } = useStore()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (item: RootCause) => store.restoreRootCause(item),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all })
  })
}
