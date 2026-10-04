"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { CreateEntry, Entry, ListEntries, UpdateEntry } from "./schema";
import * as local from "./store/local";

// The one place that chooses where entries go. Only anonymous (localStorage)
// mode exists for now; signed-in users will call app/api/entries instead.
const store = local;

const keys = {
  all: ["entries"] as const,
  list: (filter: ListEntries) => ["entries", "list", filter] as const,
  one: (id: string) => ["entries", "one", id] as const,
};

export function useEntries(filter: ListEntries = {}) {
  return useQuery({
    queryKey: keys.list(filter),
    queryFn: () => store.listEntries(filter),
  });
}

export function useEntry(id: string) {
  return useQuery({
    queryKey: keys.one(id),
    queryFn: () => store.getEntry(id),
  });
}

export function useCreateEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateEntry) => store.createEntry(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useUpdateEntry(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateEntry) => store.updateEntry(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useDeleteEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => store.deleteEntry(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

export function useRestoreEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (entry: Entry) => store.restoreEntry(entry),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.all }),
  });
}

// Set when a draft's fourth column has just been filled, read once by the
// entry view so that section can settle into place.
// Expires instead of being consumed on read, so StrictMode double renders agree.
let justCompleted: { id: string; at: number } | null = null;

export function markJustCompleted(id: string) {
  justCompleted = { id, at: Date.now() };
}

export function wasJustCompleted(id: string): boolean {
  return justCompleted?.id === id && Date.now() - justCompleted.at < 3000;
}
