'use client'

import { useLayoutEffect, useRef } from 'react'
import { cn } from 'cn'

/**
 * A question in the marker hand with the answer written beneath it on ruled lines. There is no box:
 * the rules are the field, and the field grows with the writing.
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

  // Grow with the writing instead of scrolling inside a box. Whole lines only, so the rules stay under the text.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.max(72, Math.ceil(el.scrollHeight / 36) * 36)}px`
  }, [value])

  return (
    <div>
      <label htmlFor={id} className="prompt block">
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
          'ruled block min-h-18 w-full resize-none overflow-hidden rounded-sm bg-transparent p-0 text-ink outline-none placeholder:text-ink-muted',
          'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal',
          error && 'outline-2 outline-offset-4 outline-signal'
        )}
      />
      {error && (
        <p id={`${id}-error`} className="mt-3 text-base text-signal">
          {error}
        </p>
      )}
    </div>
  )
}
