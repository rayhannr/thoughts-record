'use client'

import { useRef } from 'react'
import { toneFor } from '@/components/intensity-bar'
import { cn } from 'cn'

const STEP = 5

function snap(n: number) {
  return Math.min(100, Math.max(0, Math.round(n / STEP) * STEP))
}

/**
 * Starts empty on purpose: a pre-filled number anchors the answer before the user has
 * considered it. Shows a dash until touched, snaps in steps of 5. Dragging draws the same
 * marker swipe the record reads back, and the number is ringed beside it.
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
    <div className="flex items-center gap-3">
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
          'flex h-14 flex-1 cursor-pointer touch-none items-center rounded-[4px_12px_6px_10px] border-2 px-3',
          invalid ? 'border-signal' : value == null ? 'border-edge border-dashed' : 'border-ink'
        )}
      >
        <div ref={trackRef} className="relative h-7 w-full">
          {value == null && (
            <span aria-hidden className="absolute inset-0 flex items-center text-xl text-ink-muted">
              geser di sini →
            </span>
          )}
          {value != null && <span className="marker absolute inset-y-0 left-0" style={{ width: `${value}%`, background: toneFor(value) }} />}
        </div>
      </div>
      <output aria-hidden className={cn('circled min-w-16 shrink-0 px-2 pt-1.5 pb-1 text-[40px]', value == null ? 'border-edge text-ink-muted' : 'text-ink')}>
        {value ?? '–'}
      </output>
    </div>
  )
}
