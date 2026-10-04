'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateEntry, Entry, ListEntries, UpdateEntry } from './schema'
import { useUser } from '@/components/auth-provider'
import * as api from './store/api'
import * as local from './store/local'

// The one place that chooses where entries go: the account when signed in,
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
  all: ['entries'] as const,
  list: (scope: string, filter: ListEntries) => ['entries', scope, 'list', filter] as const,
  one: (scope: string, id: string) => ['entries', scope, 'one', id] as const
}

export function useEntries(filter: ListEntries = {}) {
  const { ready, scope, store } = useStore()
  return useQuery({
    queryKey: keys.list(scope, filter),
    queryFn: () => store.listEntries(filter),
    enabled: ready
  })
}

export function useEntry(id: string) {
  const { ready, scope, store } = useStore()
  return useQuery({
    queryKey: keys.one(scope, id),
    queryFn: () => store.getEntry(id),
    enabled: ready
  })
}

export function useCreateEntry() {
  const { store } = useStore()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateEntry) => store.createEntry(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all })
  })
}

export function useUpdateEntry(id: string) {
  const { store } = useStore()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateEntry) => store.updateEntry(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all })
  })
}

export function useDeleteEntry() {
  const { store } = useStore()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => store.deleteEntry(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all })
  })
}

export function useRestoreEntry() {
  const { store } = useStore()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (entry: Entry) => store.restoreEntry(entry),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all })
  })
}

// Set when a draft's fourth column has just been filled, read once by the
// entry view so that section can settle into place.
// Expires instead of being consumed on read, so StrictMode double renders agree.
let justCompleted: { id: string; at: number } | null = null

export function markJustCompleted(id: string) {
  justCompleted = { id, at: Date.now() }
}

export function wasJustCompleted(id: string): boolean {
  return justCompleted?.id === id && Date.now() - justCompleted.at < 3000
}
