'use client'

import { IntensityBar } from '@/components/intensity-bar'
import { PROMPTS, VALENCE_LABEL } from '@/components/prompts'
import { Section } from '@/components/section'
import type { Entry } from '@/lib/entries/schema'
import { formatDay, formatDayTime } from '@/lib/format'
import type { SharedView } from '@/lib/share/schema'

// A client component only so dates are written in the viewer's own timezone.
// The server's differs, hence suppressHydrationWarning on each date.
export function SharedEntries({ view }: { view: SharedView }) {
  const { entries } = view

  return (
    <>
      <header>
        <h1 className="font-catalog text-lg font-semibold tracking-[0.12em] text-ink uppercase">Thought Record</h1>
        <p className="mt-3 text-sm text-ink-muted" suppressHydrationWarning>
          catatan dari {formatDay(view.range_from)} sampai {view.range_to ? formatDay(view.range_to) : 'sekarang'}.
          dibagikan hanya untuk dibaca.
        </p>
      </header>

      {entries.length === 0 ? (
        <p className="mt-10 text-sm text-ink-muted">belum ada catatan di rentang ini.</p>
      ) : (
        <ol className="mt-8 border-t border-rule">
          {entries.map(entry => (
            <li key={entry.id} className="border-b border-rule py-10">
              <SharedEntry entry={entry} />
            </li>
          ))}
        </ol>
      )}

      <p className="mt-10 text-sm text-ink-muted" suppressHydrationWarning>
        tautan ini berlaku sampai {formatDay(view.expires_at)}.
      </p>
    </>
  )
}

function SharedEntry({ entry }: { entry: Entry }) {
  return (
    <article>
      <p className="label-caps text-ink-muted" suppressHydrationWarning>
        {formatDayTime(entry.occurred_at)}
      </p>

      <div className="mt-6 flex flex-col gap-10">
        <Section question={PROMPTS.situation}>{entry.situation}</Section>
        <Section question={PROMPTS.thoughts}>
          {entry.thoughts}
        </Section>
        <Section question={PROMPTS.feelings}>
          <ul className="flex flex-col gap-6">
            {entry.feelings.map((f, i) => (
              <li key={i}>
                {f.name}
                {f.valence && <span className="ml-2 font-sans text-sm text-ink-muted">· {VALENCE_LABEL[f.valence]}</span>}
                <IntensityBar value={f.intensity} large className="mt-3" />
              </li>
            ))}
          </ul>
        </Section>
        {entry.evidence_for && <Section question={PROMPTS.evidence}>{entry.evidence_for}</Section>}
      </div>
    </article>
  )
}
