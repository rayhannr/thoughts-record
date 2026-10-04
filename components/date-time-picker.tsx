'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const monthTitle = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' })
const dayLabel = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

// Monday first, matching how Indonesian calendars are printed.
const WEEKDAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

const SEVEN_COLS = { gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }
const pad = (n: number) => String(n).padStart(2, '0')
const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const timeValue = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`

function daysAgo(n: number, from: Date) {
  const d = new Date(from)
  d.setDate(d.getDate() - n)
  return d
}

/**
 * Picks when the situation happened. Future moments are not selectable: an
 * entry records something that already occurred.
 */
export function DateTimePicker({ id, value, onChange }: { id: string; value: string; onChange: (iso: string) => void }) {
  const selected = new Date(value)
  const now = new Date()
  const todayKey = dayKey(now)
  const selectedKey = dayKey(selected)

  const [view, setView] = useState(() => new Date(selected.getFullYear(), selected.getMonth(), 1))
  const gridRef = useRef<HTMLDivElement>(null)

  const atCurrentMonth = view.getFullYear() === now.getFullYear() && view.getMonth() === now.getMonth()
  const lead = (new Date(view.getFullYear(), view.getMonth(), 1).getDay() + 6) % 7
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()

  // One tab stop for the grid; arrow keys move within it.
  const selectedInView = selected.getFullYear() === view.getFullYear() && selected.getMonth() === view.getMonth()
  const tabStop = selectedInView ? selected.getDate() : 1

  function commit(next: Date) {
    // A time later than now on today's date snaps back to now.
    const capped = next.getTime() > Date.now() ? new Date() : next
    onChange(capped.toISOString())
    setView(new Date(capped.getFullYear(), capped.getMonth(), 1))
  }

  function pickDay(day: Date) {
    const next = new Date(day.getFullYear(), day.getMonth(), day.getDate(), selected.getHours(), selected.getMinutes())
    commit(next)
  }

  function pickTime(hhmm: string) {
    const [h, m] = hhmm.split(':').map(Number)
    if (Number.isNaN(h) || Number.isNaN(m)) return
    commit(new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), h, m))
  }

  function shiftMonth(delta: number) {
    setView(new Date(view.getFullYear(), view.getMonth() + delta, 1))
  }

  function onGridKeyDown(e: React.KeyboardEvent) {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key]
    if (!step) return
    const from = (e.target as HTMLElement).closest<HTMLElement>('[data-day]')
    if (!from) return
    e.preventDefault()
    const to = Number(from.dataset.day) + step
    gridRef.current?.querySelector<HTMLElement>(`[data-day="${to}"]:not(:disabled)`)?.focus()
  }

  const quick = [
    { label: 'sekarang', date: now },
    { label: 'kemarin', date: daysAgo(1, now) },
    { label: '2 hari lalu', date: daysAgo(2, now) }
  ]

  return (
    <div id={id} className="border border-edge bg-surface p-3 sm:p-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="pilihan cepat">
        {quick.map(q => {
          const active = q.label === 'sekarang' ? false : dayKey(q.date) === selectedKey
          return (
            <button
              key={q.label}
              type="button"
              aria-pressed={active}
              onClick={() => (q.label === 'sekarang' ? commit(new Date()) : pickDay(q.date))}
              className={cn(
                'min-h-11 border px-3.5 text-sm',
                active ? 'border-ink bg-ink text-paper' : 'border-edge text-ink hover:border-ink'
              )}
            >
              {q.label}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          aria-label="bulan sebelumnya"
          className="-ml-2 flex size-11 items-center justify-center text-ink-muted hover:text-ink"
        >
          <ChevronLeft aria-hidden className="size-5" />
        </button>
        <p aria-live="polite" className="label-caps text-ink">
          {monthTitle.format(view)}
        </p>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          disabled={atCurrentMonth}
          aria-label="bulan berikutnya"
          className="-mr-2 flex size-11 items-center justify-center text-ink-muted hover:text-ink disabled:opacity-30"
        >
          <ChevronRight aria-hidden className="size-5" />
        </button>
      </div>

      <div className="mt-1 grid text-center" style={SEVEN_COLS} aria-hidden>
        {WEEKDAYS.map(w => (
          <span key={w} className="py-2 text-xs text-ink-muted">
            {w}
          </span>
        ))}
      </div>

      <div ref={gridRef} role="group" aria-label={monthTitle.format(view)} onKeyDown={onGridKeyDown} className="grid gap-y-1" style={SEVEN_COLS}>
        {Array.from({ length: lead }, (_, i) => (
          <span key={`lead-${i}`} aria-hidden />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const n = i + 1
          const date = new Date(view.getFullYear(), view.getMonth(), n)
          const key = dayKey(date)
          const isSelected = key === selectedKey
          const isToday = key === todayKey
          const future = date.getTime() > now.getTime()
          return (
            <button
              key={n}
              type="button"
              data-day={n}
              disabled={future}
              aria-pressed={isSelected}
              aria-label={dayLabel.format(date)}
              aria-current={isToday ? 'date' : undefined}
              tabIndex={n === tabStop ? 0 : -1}
              onClick={() => pickDay(date)}
              className={cn(
                'relative mx-auto flex size-11 items-center justify-center font-catalog text-lg tabular-nums',
                isSelected ? 'bg-signal font-semibold text-signal-ink' : 'text-ink hover:bg-paper',
                future && 'text-ink-muted opacity-40 hover:bg-transparent'
              )}
            >
              {n}
              {isToday && !isSelected && <span aria-hidden className="absolute bottom-1.5 h-0.5 w-3 bg-signal" />}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 border-t border-rule pt-4">
        <label htmlFor={`${id}-time`} className="text-sm text-ink-muted">
          jam berapa?
        </label>
        <input
          id={`${id}-time`}
          type="time"
          value={timeValue(selected)}
          max={selectedKey === todayKey ? timeValue(now) : undefined}
          onChange={e => pickTime(e.target.value)}
          className="min-h-11 border border-edge bg-paper px-3 font-catalog text-xl tabular-nums text-ink outline-none focus:border-signal focus:ring-1 focus:ring-signal"
        />
      </div>
    </div>
  )
}
