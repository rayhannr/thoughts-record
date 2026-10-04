'use client'

import { useEntries } from '@/lib/entries/client'
import { cn } from '@/lib/utils'

/**
 * Every entry is a catalogue item, numbered in the order it was written.
 * Pass an id for an existing entry; leave it out for the one about to be written.
 */
export function CatalogNumber({ id, className }: { id?: string; className?: string }) {
  const entries = useEntries()
  if (!entries.data) return <span aria-hidden className={cn('inline-block h-[1em]', className)} />

  const byWritten = [...entries.data].sort((a, b) => a.created_at.localeCompare(b.created_at))
  const index = id ? byWritten.findIndex(e => e.id === id) : byWritten.length
  if (index < 0) return null

  return (
    <span className={cn('font-catalog font-semibold tracking-[0.06em] text-ink tabular-nums', className)}>
      TR / {String(index + 1).padStart(4, '0')}
    </span>
  )
}
