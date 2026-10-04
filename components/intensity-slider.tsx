'use client'

import { useRef } from 'react'
import { cn } from '@/lib/utils'

const STEP = 5

function snap(n: number) {
  return Math.min(100, Math.max(0, Math.round(n / STEP) * STEP))
}

/**
 * Starts empty on purpose: a pre-filled number anchors the answer before the
 * user has considered it. Shows a dash until touched, snaps in steps of 5. The
 * track is the same twenty-cell strip the list reads back.
 */
export function IntensitySlider({
  id,
  value,
  onChange,
  labelledBy,
  describedBy,
  invalid
}: {
  id?: string
  value: number | null
  onChange: (value: number) => void
  labelledBy: string
  describedBy?: string
  invalid?: boolean
}) {
  const trackRef = useRef<HTMLDivElement>(null)

  function valueAt(clientX: number) {
    const rect = trackRef.current!.getBoundingClientRect()
    return snap(((clientX - rect.left) / rect.width) * 100)
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    e.currentTarget.focus()
    onChange(valueAt(e.clientX))
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
    onChange(valueAt(e.clientX))
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const current = value ?? 0
    const next: Record<string, number> = {
      ArrowRight: current + STEP,
      ArrowUp: current + STEP,
      ArrowLeft: current - STEP,
      ArrowDown: current - STEP,
      PageUp: current + 4 * STEP,
      PageDown: current - 4 * STEP,
      Home: 0,
      End: 100
    }
    if (!(e.key in next)) return
    e.preventDefault()
    onChange(snap(next[e.key]))
  }

  return (
    <div className="flex items-center gap-4">
      <div
        id={id}
        role="slider"
        tabIndex={0}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value ?? undefined}
        aria-valuetext={value == null ? 'belum dinilai' : String(value)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={onKeyDown}
        className={cn(
          'flex h-14 flex-1 cursor-pointer touch-none items-center rounded-sm border bg-surface px-3 focus-visible:outline-offset-2',
          invalid ? 'border-signal' : value == null ? 'border-edge' : 'border-ink'
        )}
      >
        <div ref={trackRef} className="flex w-full justify-between">
          {Array.from({ length: 20 }, (_, i) => (
            <span
              key={i}
              className="strip-cell h-7 w-[3.5%] min-w-1"
              data-on={value != null && i < Math.round(value / 5)}
              style={{ '--i': i + 1 } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
      <output aria-hidden className={cn('w-14 text-right font-catalog text-5xl font-semibold tabular-nums', value == null ? 'text-ink-muted' : 'text-ink')}>
        {value ?? '–'}
      </output>
    </div>
  )
}
