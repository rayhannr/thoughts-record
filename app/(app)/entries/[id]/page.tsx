'use client'

import { useParams } from 'next/navigation'
import { EntryView } from '@/components/entry-view'
import { EntryNotFound, StatusLine, StorageError } from '@/components/status-line'
import { useEntries } from '@/lib/entries/client'

export default function EntryPage() {
  const { id } = useParams<{ id: string }>()
  const entries = useEntries()

  if (entries.isPending) return <StatusLine>memuat catatan…</StatusLine>
  if (entries.isError) return <StorageError />
  if (!entries.data.some(e => e.id === id)) return <EntryNotFound />

  return <EntryView entries={entries.data} initialId={id} />
}
