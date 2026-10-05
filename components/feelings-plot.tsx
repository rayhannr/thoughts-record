import Link from 'next/link'
import { VALENCE_LABEL } from '@/components/prompts'
import type { Entry } from '@/lib/entries/schema'
import { formatDay } from '@/lib/format'
import { cn } from '@/lib/utils'

const MAX_ENTRIES = 30
const GRID = [100, 50, 0]

function LegendItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 font-sans text-sm tracking-normal normal-case">
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
 * a small dot is not rated. Nothing is inferred from the feeling's name.
 */
export function FeelingsPlot({ entries }: { entries: Entry[] }) {
  const recent = [...entries]
    .sort((a, b) => new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime())
    .slice(-MAX_ENTRIES)

  if (recent.length === 0) return null

  const first = recent[0]
  const last = recent[recent.length - 1]
  const start = new Date(first.occurred_at).getTime()
  const span = new Date(last.occurred_at).getTime() - start
  const xOf = (iso: string) => (span === 0 ? 50 : 4 + 92 * ((new Date(iso).getTime() - start) / span))

  const rated = recent.some(e => e.feelings.some(f => f.valence))
  const count = recent.reduce((n, e) => n + e.feelings.length, 0)

  return (
    <figure
      role="group"
      aria-label={`grafik ${count} perasaan dari ${recent.length} catatan terakhir, dari ${formatDay(first.occurred_at)} sampai ${formatDay(last.occurred_at)}. tinggi titik sama dengan seberapa kuat.`}
      className="relative left-1/2 mt-5 w-screen max-w-5xl -translate-x-1/2 px-4"
    >
      <div className="relative ml-8 h-[220px] sm:h-[280px]">
        <div aria-hidden className="absolute inset-y-3 inset-x-0">
          {GRID.map(v => (
            <div key={v} className="absolute inset-x-0 border-t border-rule" style={{ bottom: `${v}%` }}>
              <span className="label-caps absolute -left-8 w-6 -translate-y-1/2 text-right text-ink-muted">{v}</span>
            </div>
          ))}
        </div>

        <div className="absolute inset-y-3 inset-x-0">
          {recent.map(entry => {
            const levels = entry.feelings.map(f => f.intensity)
            const low = Math.min(...levels)
            const high = Math.max(...levels)
            return (
              <div key={entry.id} className="absolute inset-y-0 w-0" style={{ left: `${xOf(entry.occurred_at)}%` }}>
                {entry.feelings.length > 1 && (
                  <span aria-hidden className="absolute -translate-x-1/2 border-l border-edge" style={{ bottom: `${low}%`, height: `${high - low}%` }} />
                )}
                {entry.feelings.map((f, i) => {
                  const tone = `color-mix(in oklab, var(--signal) ${Math.min(100, f.intensity * 1.1)}%, var(--cell-low))`
                  const valence = f.valence ? VALENCE_LABEL[f.valence] : null
                  const label = `${f.name}, ${f.intensity}${valence ? `, ${valence}` : ''}, ${formatDay(entry.occurred_at)}`
                  return (
                    <Link
                      key={i}
                      href={`/entries/${entry.id}`}
                      aria-label={label}
                      title={label}
                      className={cn(
                        'absolute -translate-x-1/2 translate-y-1/2 rounded-full after:absolute after:-inset-3 after:content-[""]',
                        f.valence === 'good' ? 'size-3 border-2 bg-paper' : f.valence === 'bad' ? 'size-3' : 'size-2'
                      )}
                      style={{
                        bottom: `${f.intensity}%`,
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

      <figcaption className="label-caps ml-8 mt-3 text-ink-muted">
        <span className="flex justify-between whitespace-nowrap">
          <span>{formatDay(first.occurred_at)}</span>
          <span>{formatDay(last.occurred_at)}</span>
        </span>
        <span className="mt-2 block text-center">tinggi titik = seberapa kuat</span>
        {rated && (
          <ul className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1">
            <LegendItem label="nggak enak">
              <span aria-hidden className="size-3 rounded-full bg-ink-muted" />
            </LegendItem>
            <LegendItem label="enak">
              <span aria-hidden className="size-3 rounded-full border-2 border-ink-muted" />
            </LegendItem>
            <LegendItem label="belum dinilai">
              <span aria-hidden className="size-2 rounded-full bg-ink-muted" />
            </LegendItem>
          </ul>
        )}
      </figcaption>
    </figure>
  )
}
