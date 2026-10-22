'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { BookReader } from '@/components/book-reader'
import { EntryBody } from '@/components/entry-body'
import { useDeleteEntry, useRestoreEntry } from '@/lib/entries/client'
import type { Entry } from '@/lib/entries/schema'
import { formatDayTime } from '@/lib/format'

/** The entry detail: the whole record as a book, opened at one page. */
export function EntryView({ entries, initialId }: { entries: Entry[]; initialId: string }) {
  return <BookReader entries={entries} initialId={initialId} renderPage={entry => <Leaf entry={entry} />} />
}

function Leaf({ entry }: { entry: Entry }) {
  return (
    <>
      <EntryBody entry={entry} editable />
      <footer className="mt-14 border-t border-rule pt-4">
        <p className="label-hand text-base" suppressHydrationWarning>
          ditulis {formatDayTime(entry.created_at).toLowerCase()}
        </p>
        <DeleteControl entry={entry} />
      </footer>
    </>
  )
}

function DeleteControl({ entry }: { entry: Entry }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const remove = useDeleteEntry()
  const restore = useRestoreEntry()

  async function onDelete() {
    // Leave first, so this view never re-renders as "not found".
    router.push('/')
    try {
      await remove.mutateAsync(entry.id)
    } catch {
      toast.error('catatan belum terhapus. penyimpanan browser ini tidak bisa ditulis.')
      return
    }
    toast('catatan dihapus', {
      action: { label: 'kembalikan', onClick: () => restore.mutate(entry) }
    })
  }

  // Delete sits alone, well away from the other controls, and stays quiet until chosen.
  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className="btn-quiet -ml-2 mt-4 hover:text-signal">
        hapus catatan
      </button>
    )
  }

  return (
    <div role="group" aria-label="konfirmasi hapus" className="mt-4 flex flex-wrap items-center gap-2">
      <span className="mr-2 text-lg text-ink">hapus catatan ini?</span>
      <button
        type="button"
        autoFocus
        onClick={onDelete}
        disabled={remove.isPending}
        className="btn-pen border-signal text-signal hover:bg-signal hover:text-signal-ink"
      >
        ya, hapus
      </button>
      <button type="button" onClick={() => setConfirming(false)} className="btn-quiet">
        batal
      </button>
    </div>
  )
}
