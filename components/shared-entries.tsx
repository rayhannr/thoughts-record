'use client'

import { Paper } from '@/components/book-page'
import { EntryBody } from '@/components/entry-body'
import { formatDay } from '@/lib/format'
import type { SharedView } from '@/lib/share/schema'

// A client component only so dates are written in the viewer's own timezone.
// The server's differs, hence suppressHydrationWarning on each date.
export function SharedEntries({ view }: { view: SharedView }) {
  const { entries } = view

  return (
    <>
      <header className="px-1 pb-5">
        <h1 className="font-write text-[34px] leading-none text-chrome">Thought Record</h1>
        <p className="mt-3 text-lg text-chrome-muted" suppressHydrationWarning>
          catatan dari {formatDay(view.range_from)} sampai {view.range_to ? formatDay(view.range_to) : 'sekarang'}. dibagikan hanya untuk dibaca.
        </p>
      </header>

      <Paper>
        {entries.length === 0 ? (
          <p className="text-lg text-ink-muted">belum ada catatan di rentang ini.</p>
        ) : (
          <ol>
            {entries.map(entry => (
              <li key={entry.id} className="border-b border-rule py-10 first:pt-0 last:border-b-0">
                <EntryBody entry={entry} />
              </li>
            ))}
          </ol>
        )}
      </Paper>

      <p className="mt-6 px-1 text-lg text-chrome-muted" suppressHydrationWarning>
        tautan ini berlaku sampai {formatDay(view.expires_at)}.
      </p>
    </>
  )
}
