'use client'

import { useLayoutEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * A question in small sans with the answer written beneath it. The field is a
 * visible block that grows with the writing, so the whole area reads as tappable.
 */
export function RuledField({
  id,
  question,
  value,
  onChange,
  placeholder,
  error,
  autoFocus
}: {
  id: string
  question: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  autoFocus?: boolean
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  // Grow with the writing instead of scrolling inside a box.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return (
    <div>
      <label htmlFor={id} className="block font-catalog text-xl font-semibold tracking-wide text-ink">
        {question}
      </label>
      <textarea
        ref={ref}
        id={id}
        rows={2}
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          'mt-2 block min-h-18 w-full resize-none overflow-hidden rounded-sm border bg-surface px-3.5 py-3 text-lg leading-relaxed text-ink outline-none placeholder:text-ink-muted focus:border-signal focus:ring-1 focus:ring-signal',
          error ? 'border-signal' : value.trim() ? 'border-ink' : 'border-edge'
        )}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-signal">
          {error}
        </p>
      )}
    </div>
  )
}
