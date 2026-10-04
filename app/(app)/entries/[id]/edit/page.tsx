'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { Composer } from '@/components/composer'
import { EntryNotFound, StatusLine, StorageError } from '@/components/status-line'
import { useEntry } from '@/lib/entries/client'

export default function EditEntryPage() {
  const { id } = useParams<{ id: string }>()
  const focusEvidence = useSearchParams().get('isi') === 'bukti'
  const entry = useEntry(id)

  if (entry.isPending) return <StatusLine>memuat catatan…</StatusLine>
  if (entry.isError) return <StorageError />
  if (!entry.data) return <EntryNotFound />

  return <Composer entry={entry.data} cancelHref={`/entries/${id}`} focusEvidence={focusEvidence} />
}
