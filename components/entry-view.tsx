'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { CatalogNumber } from '@/components/catalog-number'
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
      <nav className="-mx-2 flex min-h-12 items-center justify-between">
        <Link href="/" className={`${chrome} text-ink-muted hover:text-ink`}>
          semua catatan
        </Link>
        <Link href={`/entries/${entry.id}/edit`} className={`${chrome} border border-edge px-4 text-ink hover:border-ink`}>
          ubah
        </Link>
      </nav>

      <CatalogNumber id={entry.id} className="mt-4 block text-6xl leading-none" />
      <p className="label-caps mt-3 text-ink-muted">{formatDayTime(entry.occurred_at)}</p>

      <div className="mt-8 flex flex-col gap-10">
        <Section question={PROMPTS.situation}>{entry.situation}</Section>
        <Section question={PROMPTS.thoughts} emphasis>
          {entry.thoughts}
        </Section>
        <Section question={PROMPTS.feelings}>
          <ul className="flex flex-col gap-6">
            {entry.feelings.map((f, i) => (
              <li key={i}>
                {f.name}
                <IntensityBar value={f.intensity} large className="mt-3" />
              </li>
            ))}
          </ul>
        </Section>

        {entry.evidence_for ? (
          <div className={settle ? 'settle-in' : undefined}>
            <Section question={PROMPTS.evidence}>{entry.evidence_for}</Section>
          </div>
        ) : (
          <section>
            <h2 className="font-catalog text-xl font-semibold tracking-wide text-ink-muted">{PROMPTS.evidence}</h2>
            <p className="mt-2 text-base text-ink-muted">{DRAFT_LABEL}</p>
            <Link
              href={`/entries/${entry.id}/edit?isi=bukti`}
              className="mt-3 inline-flex h-11 items-center rounded-sm bg-signal px-5 font-catalog text-lg font-semibold tracking-wide text-signal-ink hover:brightness-110"
            >
              lanjutkan sekarang
            </Link>
          </section>
        )}
      </div>

      <footer className="mt-20 border-t border-rule pt-4">
        <p className="text-sm text-ink-muted">ditulis {formatDayTime(entry.created_at).toLowerCase()}</p>
        <DeleteControl entry={entry} />
      </footer>
    </article>
  )
}

// The thought is the headline, but only a short one fits the condensed face; a long
// one stays in the writing face so it reads as the user's own voice.
const HEADLINE_MAX = 90

function Section({ question, children, emphasis }: { question: string; children: React.ReactNode; emphasis?: boolean }) {
  const headline = emphasis && typeof children === 'string' && children.length <= HEADLINE_MAX
  return (
    <section>
      <h2 className="font-catalog text-xl font-semibold tracking-wide text-ink-muted">{question}</h2>
      <div
        className={
          headline
            ? 'mt-2 max-w-[65ch] font-catalog text-[2.25rem] leading-[1.1] font-semibold tracking-[0.01em] whitespace-pre-wrap text-ink'
            : emphasis
              ? 'mt-2 max-w-[65ch] text-2xl leading-snug font-medium whitespace-pre-wrap text-ink'
              : 'mt-2 max-w-[65ch] text-lg leading-relaxed whitespace-pre-wrap text-ink'
        }
      >
        {children}
      </div>
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

  // Delete sits alone, well away from the other controls, and stays quiet until chosen.
  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className={`${chrome} -ml-2 mt-6 text-ink-muted hover:text-signal`}>
        hapus catatan
      </button>
    )
  }

  return (
    <div role="group" aria-label="konfirmasi hapus" className="mt-6 flex flex-wrap items-center gap-2">
      <span className="mr-2 text-sm text-ink">hapus catatan ini?</span>
      <button
        type="button"
        autoFocus
        onClick={onDelete}
        disabled={remove.isPending}
        className="flex min-h-11 items-center rounded-sm border border-signal px-4 text-sm font-semibold text-signal hover:bg-signal hover:text-signal-ink"
      >
        ya, hapus
      </button>
      <button type="button" onClick={() => setConfirming(false)} className={`${chrome} text-ink-muted hover:text-ink`}>
        batal
      </button>
    </div>
  )
}
