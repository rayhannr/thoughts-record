'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { IntensityBar } from '@/components/intensity-bar'
import { DRAFT_LABEL, PROMPTS } from '@/components/prompts'
import { useDeleteEntry, useRestoreEntry, wasJustCompleted } from '@/lib/entries/client'
import type { Entry } from '@/lib/entries/schema'
import { formatDayTime } from '@/lib/format'

const chrome = 'flex min-h-11 items-center rounded-sm px-2 text-sm'

export function EntryView({ entry }: { entry: Entry }) {
  const [settle] = useState(() => wasJustCompleted(entry.id))

  return (
    <article>
      <nav className="-mx-2 flex items-center justify-between">
        <Link href="/" className={`${chrome} text-ink-muted`}>
          semua catatan
        </Link>
        <Link href={`/entries/${entry.id}/edit`} className={`${chrome} text-ink`}>
          ubah
        </Link>
      </nav>

      <p className="mt-4 text-sm text-ink-muted">{formatDayTime(entry.occurred_at)}</p>

      <div className="mt-8 flex flex-col gap-10">
        <Section question={PROMPTS.situation}>{entry.situation}</Section>
        <Section question={PROMPTS.thoughts}>{entry.thoughts}</Section>
        <Section question={PROMPTS.feelings}>
          {entry.feelings}
          <IntensityBar value={entry.intensity} className="mt-3" />
        </Section>

        {entry.evidence_for ? (
          <div className={settle ? 'settle-in' : undefined}>
            <Section question={PROMPTS.evidence}>{entry.evidence_for}</Section>
          </div>
        ) : (
          <section>
            <h2 className="text-sm text-ink-muted">{PROMPTS.evidence}</h2>
            <p className="mt-1.5 text-sm text-ink-muted">{DRAFT_LABEL}</p>
            <Link
              href={`/entries/${entry.id}/edit?isi=bukti`}
              className="-ml-2 mt-1 inline-flex min-h-11 items-center rounded-sm px-2 text-sm text-ink underline decoration-1 underline-offset-4"
            >
              lanjutkan sekarang
            </Link>
          </section>
        )}
      </div>

      <footer className="mt-14 border-t border-rule pt-4">
        <p className="text-sm text-ink-muted">ditulis {formatDayTime(entry.created_at).toLowerCase()}</p>
        <DeleteControl entry={entry} />
      </footer>
    </article>
  )
}

function Section({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-sm text-ink-muted">{question}</h2>
      <div className="mt-1.5 max-w-[65ch] whitespace-pre-wrap font-serif text-lg leading-relaxed text-ink">{children}</div>
    </section>
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

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className={`${chrome} -ml-2 mt-2 text-ink-muted`}>
        hapus catatan
      </button>
    )
  }

  return (
    <div role="group" aria-label="konfirmasi hapus" className="mt-2 flex flex-wrap items-center gap-x-1">
      <span className="mr-2 text-sm text-ink">hapus catatan ini?</span>
      <button
        type="button"
        autoFocus
        onClick={onDelete}
        disabled={remove.isPending}
        className={`${chrome} font-semibold text-ink underline decoration-1 underline-offset-4`}
      >
        ya, hapus
      </button>
      <button type="button" onClick={() => setConfirming(false)} className={`${chrome} text-ink-muted`}>
        batal
      </button>
    </div>
  )
}
