'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FeelingsAfter } from '@/components/feelings-after'
import { IntensityBar } from '@/components/intensity-bar'
import { DRAFT_LABEL, PROMPTS, VALENCE_LABEL } from '@/components/prompts'
import { Section } from '@/components/section'
import { wasJustCompleted } from '@/lib/entries/client'
import type { Entry } from '@/lib/entries/schema'
import { formatDayTime } from '@/lib/format'

/**
 * What is written on one leaf. `editable` is the owner's page, where a draft offers to be finished;
 * the shared view leaves that out and simply shows no alternative-thought section for a draft.
 */
export function EntryBody({ entry, editable }: { entry: Entry; editable?: boolean }) {
  const [settle] = useState(() => editable && wasJustCompleted(entry.id))

  return (
    <article className="flex flex-col gap-7">
      <p className="font-write text-[32px] leading-9 text-ink" suppressHydrationWarning>
        {formatDayTime(entry.occurred_at)}
      </p>

      <Section question={PROMPTS.situation}>{entry.situation}</Section>
      <Section question={PROMPTS.thoughts}>{entry.thoughts}</Section>

      <Section question={PROMPTS.feelings} plain>
        <ul className="flex flex-col gap-3">
          {entry.feelings.map((f, i) => (
            <li key={i}>
              {f.name}
              {f.valence && <span className="label-hand ml-2 font-sans text-lg">· {VALENCE_LABEL[f.valence]}</span>}
              <IntensityBar value={f.intensity} large className="mt-1" />
            </li>
          ))}
        </ul>
      </Section>

      {entry.balanced_thought ? (
        <div className={settle ? 'settle-in' : undefined}>
          <Section question={PROMPTS.balanced}>{entry.balanced_thought}</Section>
        </div>
      ) : (
        editable && (
          <section>
            <h2 className="prompt">{PROMPTS.balanced}</h2>
            <p className="text-lg leading-9 text-ink-muted">{DRAFT_LABEL}</p>
            <Link href={`/entries/${entry.id}/edit?isi=alternatif`} className="btn-signal mt-2">
              lanjutkan sekarang
            </Link>
          </section>
        )
      )}

      <FeelingsAfter feelings={entry.feelings} />
    </article>
  )
}
