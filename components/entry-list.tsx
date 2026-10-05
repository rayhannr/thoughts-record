'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { AccountMenu } from '@/components/account-menu'
import { IntensityBar } from '@/components/intensity-bar'
import { DRAFT_LABEL } from '@/components/prompts'
import { FeelingsPlot } from '@/components/feelings-plot'
import { peakIntensity, type Entry } from '@/lib/entries/schema'
import { formatDay } from '@/lib/format'
import { cn } from '@/lib/utils'

type Filter = 'all' | 'draft'

export function EntryList({ entries }: { entries: Entry[] }) {
  const [filter, setFilter] = useState<Filter>('all')
  const drafts = entries.filter(e => e.status === 'draft')
  const shown = filter === 'draft' && drafts.length > 0 ? drafts : entries

  return (
    <>
      <header className="flex min-h-12 items-center justify-between gap-3">
        <h1 className="font-catalog text-lg font-semibold tracking-[0.12em] text-ink uppercase">Thought Record</h1>
        <div className="-mr-1 flex items-center gap-1">
          <AccountMenu />
          <Link
            href="/new"
            className="flex h-11 items-center gap-1.5 rounded-sm bg-signal px-4 font-catalog text-lg font-semibold tracking-wide text-signal-ink hover:brightness-110"
          >
            <Plus aria-hidden className="size-5" strokeWidth={2.5} />
            tulis
          </Link>
        </div>
      </header>

      <FeelingsPlot entries={entries} />

      {drafts.length > 0 && (
        <div role="group" aria-label="saring catatan" className="mt-6 flex gap-2">
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
            semua ({entries.length})
          </FilterButton>
          <FilterButton active={filter === 'draft'} onClick={() => setFilter('draft')}>
            {DRAFT_LABEL} ({drafts.length})
          </FilterButton>
        </div>
      )}

      <ul className={cn('border-t border-rule', drafts.length > 0 ? 'mt-3' : 'mt-6')}>
        {shown.map(entry => (
          <li key={entry.id} className="border-b border-rule">
            <EntryRow entry={entry} />
          </li>
        ))}
      </ul>
    </>
  )
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'min-h-11 rounded-sm border px-3.5 text-sm',
        active ? 'border-ink bg-ink text-paper' : 'border-edge text-ink-muted hover:border-ink hover:text-ink'
      )}
    >
      {children}
    </button>
  )
}

// Leads with the thought: re-reading is a search for recurring thoughts, and
// the situation differs every time.
function EntryRow({ entry }: { entry: Entry }) {
  return (
    <Link href={`/entries/${entry.id}`} className="-mx-4 block px-4 py-5 hover:bg-surface focus-visible:-outline-offset-2 sm:-mx-6 sm:px-6">
      <span className="line-clamp-3 block text-[19px] leading-snug whitespace-pre-line text-ink">{entry.thoughts}</span>
      <span className="mt-3.5 flex items-center justify-between gap-4">
        <span className="min-w-0">
          <span className="line-clamp-2 block text-base text-ink">{entry.feelings.map(f => f.name).join(', ')}</span>
          <span className="label-caps mt-1.5 flex items-center gap-2 text-ink-muted">
            {formatDay(entry.occurred_at)}
            {entry.status === 'draft' && <span className="font-sans text-sm tracking-normal normal-case">· {DRAFT_LABEL}</span>}
          </span>
        </span>
        <IntensityBar value={peakIntensity(entry.feelings)} />
      </span>
    </Link>
  )
}
