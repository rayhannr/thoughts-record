'use client'

import Link from 'next/link'
import { useState } from 'react'
import { toneFor } from '@/components/intensity-bar'
import { VALENCE_LABEL } from '@/components/prompts'
import type { Entry } from '@/lib/entries/schema'
import { formatDay } from '@/lib/format'
import { cn } from 'cn'

const MAX_ENTRIES = 30
const GRID = [100, 50, 0]

type Mode = 'before' | 'after'

const MODE_LABEL: Record<Mode, string> = { before: 'sebelum', after: 'sesudah' }

function LegendItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-base text-ink-muted">
      <span className="flex size-3 items-center justify-center">{children}</span>
      {label}
    </li>
  )
}

/**
 * Every feeling of the recent entries as a dot: across is when it happened,
 * up is how strongly it was felt. An entry's feelings stack in one column and
 * are never joined to the next entry, since mixed feelings are not one series.
 * Shape carries the person's own valence: filled is nggak enak, a ring is enak,
 * a diamond is not rated. Nothing is inferred from the feeling's name.
 *
 * Once any feeling has been re-rated, a switch plots the after intensity
 * instead. Only re-rated feelings appear then, in the same columns, so the
 * dots can be read as moving between the two views.
 */
export function FeelingsPlot({ entries }: { entries: Entry[] }) {
  const [chosen, setChosen] = useState<Mode>('before')
  const recent = [...entries]
    .sort((a, b) => new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime())
    .slice(-MAX_ENTRIES)

  if (recent.length === 0) return null

  const first = recent[0]
  const last = recent[recent.length - 1]
  const start = new Date(first.occurred_at).getTime()
  const span = new Date(last.occurred_at).getTime() - start
  const xOf = (iso: string) => (span === 0 ? 50 : 4 + 92 * ((new Date(iso).getTime() - start) / span))

  // Evenly spaced date labels so a cluster can be placed in time; a label that
  // repeats its neighbour's day is dropped.
  const ticks: { at: number; label: string; minor: boolean }[] = []
  for (const f of span === 0 ? [0.5] : [0, 0.25, 0.5, 0.75, 1]) {
    const at = start + span * f
    const label = formatDay(new Date(at).toISOString())
    if (ticks.length === 0 || ticks[ticks.length - 1].label !== label) {
      ticks.push({ at, label, minor: f === 0.25 || f === 0.75 })
    }
  }

  const hasAfter = recent.some(e => e.feelings.some(f => f.intensity_after != null))
  const mode = hasAfter ? chosen : 'before'
  const intensityOf = (f: Entry['feelings'][number]) => (mode === 'after' ? f.intensity_after : f.intensity)

  const plotted = recent.map(entry => ({
    entry,
    points: entry.feelings.flatMap(f => {
      const value = intensityOf(f)
      return value == null ? [] : [{ feeling: f, value }]
    })
  }))

  const rated = plotted.some(p => p.points.some(pt => pt.feeling.valence))
  const count = plotted.reduce((n, p) => n + p.points.length, 0)
  const columns = plotted.filter(p => p.points.length > 0).length

  return (
    <figure
      role="group"
      aria-label={`grafik ${count} perasaan ${MODE_LABEL[mode]} dari ${columns} catatan, dari ${formatDay(first.occurred_at)} sampai ${formatDay(last.occurred_at)}. tinggi titik sama dengan seberapa kuat.`}
      className="mt-0"
    >
      {hasAfter && (
        <div role="group" aria-label="tampilkan intensitas" className="mb-3 ml-8 flex gap-2">
          {(Object.keys(MODE_LABEL) as Mode[]).map(m => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setChosen(m)}
              className="btn-pen"
            >
              {MODE_LABEL[m]}
            </button>
          ))}
        </div>
      )}
      <div className="relative ml-8 h-[220px] sm:h-[280px]">
        <div aria-hidden className="absolute inset-y-3 inset-x-0">
          {GRID.map(v => (
            <div key={v} className="absolute inset-x-0 border-t border-rule" style={{ bottom: `${v}%` }}>
              <span className="label-hand absolute -left-8 w-6 -translate-y-1/2 text-right">{v}</span>
            </div>
          ))}
        </div>

        <div className="absolute inset-y-3 inset-x-0">
          {plotted.map(({ entry, points }) => {
            if (points.length === 0) return null
            const levels = points.map(pt => pt.value)
            const low = Math.min(...levels)
            const high = Math.max(...levels)
            return (
              <div key={entry.id} className="absolute inset-y-0 w-0" style={{ left: `${xOf(entry.occurred_at)}%` }}>
                {points.length > 1 && (
                  <span aria-hidden className="absolute -translate-x-1/2 border-l border-edge" style={{ bottom: `${low}%`, height: `${high - low}%` }} />
                )}
                {points.map(({ feeling: f, value }, i) => {
                  const tone = toneFor(value)
                  const valence = f.valence ? VALENCE_LABEL[f.valence] : null
                  const label = `${f.name}, ${MODE_LABEL[mode]} ${value}${valence ? `, ${valence}` : ''}, ${formatDay(entry.occurred_at)}`
                  return (
                    <Link
                      key={i}
                      href={`/entries/${entry.id}`}
                      aria-label={label}
                      title={label}
                      className={cn(
                        'absolute -translate-x-1/2 translate-y-1/2 after:absolute after:-inset-3 after:content-[""]',
                        f.valence === 'good'
                          ? 'size-3 rounded-full border-2 bg-paper'
                          : f.valence === 'bad'
                            ? 'size-3 rounded-full'
                            : 'size-2.5 rotate-45 rounded-[1px]'
                      )}
                      style={{
                        bottom: `${value}%`,
                        ...(f.valence === 'good' ? { borderColor: tone } : { backgroundColor: tone })
                      }}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      <figcaption className="label-hand ml-8 mt-3 text-base">
        <div aria-hidden className="relative h-4 whitespace-nowrap">
          {ticks.map(t => (
            <span
              key={t.at}
              className={cn('absolute -translate-x-1/2', t.minor && 'hidden sm:block')}
              style={{ left: `${xOf(new Date(t.at).toISOString())}%` }}
            >
              {t.label}
            </span>
          ))}
        </div>
        <span className="mt-2 block text-center">tinggi titik = seberapa kuat{mode === 'after' && ' setelahnya'}</span>
        {rated && (
          <ul className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1">
            <LegendItem label="nggak enak">
              <span aria-hidden className="size-3 rounded-full bg-ink-muted" />
            </LegendItem>
            <LegendItem label="enak">
              <span aria-hidden className="size-3 rounded-full border-2 border-ink-muted" />
            </LegendItem>
            <LegendItem label="belum dinilai">
              <span aria-hidden className="size-2 rotate-45 rounded-[1px] bg-ink-muted" />
            </LegendItem>
          </ul>
        )}
      </figcaption>
    </figure>
  )
}
