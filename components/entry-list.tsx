'use client'

import { ChevronLeft, ChevronRight, Heart, Plus, Share2, Waypoints } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { AccountMenu } from '@/components/account-menu'
import { useUser } from '@/components/auth-provider'
import { DeskBar, Paper } from '@/components/book-page'
import { FeelingsPlot } from '@/components/feelings-plot'
import { IntensityBar } from '@/components/intensity-bar'
import { DRAFT_LABEL, GRATITUDE, ROOT_CAUSE } from '@/components/prompts'
import { peakIntensity, type Entry } from '@/lib/entries/schema'
import { formatDay } from '@/lib/format'

type Filter = 'all' | 'draft'

const PAGE_SIZE = 5

export function EntryList({ entries }: { entries: Entry[] }) {
  const user = useUser()
  const [filter, setFilter] = useState<Filter>('all')
  const [page, setPage] = useState(1)
  const drafts = entries.filter(e => e.status === 'draft')
  const shown = filter === 'draft' && drafts.length > 0 ? drafts : entries
  const pageCount = Math.max(1, Math.ceil(shown.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visible = shown.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function changeFilter(next: Filter) {
    setFilter(next)
    setPage(1)
  }

  return (
    <>
      <DeskBar className="flex-wrap py-1">
        <h1 className="font-write text-[34px] leading-none text-chrome">Thought Record</h1>
        <div className="-mr-1 flex items-center gap-1">
          <AccountMenu />
          <Link href="/root-causes" className="btn-desk on-desk">
            <Waypoints aria-hidden className="size-4" />
            {ROOT_CAUSE.title}
          </Link>
          <Link href="/gratitudes" className="btn-desk on-desk">
            <Heart aria-hidden className="size-4" />
            {GRATITUDE.title}
          </Link>
          {user && (
            <Link href="/share" className="btn-desk on-desk">
              <Share2 aria-hidden className="size-4" />
              bagikan
            </Link>
          )}
          <Link href="/new" className="btn-signal on-desk">
            <Plus aria-hidden className="size-5" strokeWidth={2.5} />
            tulis
          </Link>
        </div>
      </DeskBar>

      <Paper>
        <FeelingsPlot entries={entries} />

        {drafts.length > 0 && (
          <div role="group" aria-label="saring catatan" className="mt-6 flex flex-wrap gap-2">
            <button type="button" className="btn-pen" aria-pressed={filter === 'all'} onClick={() => changeFilter('all')}>
              semua ({entries.length})
            </button>
            <button type="button" className="btn-pen" aria-pressed={filter === 'draft'} onClick={() => changeFilter('draft')}>
              {DRAFT_LABEL} ({drafts.length})
            </button>
          </div>
        )}

        <ul className="mt-5 border-t border-rule">
          {visible.map(entry => (
            <li key={entry.id} className="border-b border-rule">
              <EntryRow entry={entry} />
            </li>
          ))}
        </ul>

        {pageCount > 1 && (
          <nav aria-label="halaman" className="mt-5 flex items-center justify-between gap-3">
            <button type="button" className="btn-pen" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
              <ChevronLeft aria-hidden className="size-4" />
              baru
            </button>
            <span className="text-lg text-ink-muted" aria-live="polite">
              {currentPage} / {pageCount}
            </span>
            <button type="button" className="btn-pen" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>
              lama
              <ChevronRight aria-hidden className="size-4" />
            </button>
          </nav>
        )}
      </Paper>
    </>
  )
}

// Leads with the date and how strongly the user felt, then the thought behind it.
function EntryRow({ entry }: { entry: Entry }) {
  return (
    <Link href={`/entries/${entry.id}`} className="-mx-3 block rounded-sm px-3 py-4 hover:bg-ink/5 focus-visible:-outline-offset-2">
      <span className="flex items-center gap-2 text-base text-ink-muted" suppressHydrationWarning>
        {formatDay(entry.occurred_at)}
        {entry.status === 'draft' && <span>· {DRAFT_LABEL}</span>}
      </span>
      <span className="mt-1 line-clamp-2 block font-write text-[30px] leading-8 text-ink">{entry.feelings.map(f => f.name).join(', ')}</span>
      <IntensityBar value={peakIntensity(entry.feelings)} className="mt-1" />
      <span className="mt-2 line-clamp-3 block font-write text-[28px] leading-8 whitespace-pre-line text-ink">{entry.thoughts}</span>
    </Link>
  )
}
