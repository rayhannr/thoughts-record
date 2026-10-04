'use client'

import { useLayoutEffect, useRef } from 'react'

/**
 * A question in the sans with the answer written beneath it on a single
 * baseline rule, like writing on ruled paper rather than filling in a form.
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
      <label htmlFor={id} className="block text-sm text-ink-muted">
        {question}
      </label>
      <textarea
        ref={ref}
        id={id}
        rows={1}
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-1.5 block w-full resize-none overflow-hidden border-0 border-b border-rule bg-transparent pb-2 font-serif text-lg leading-relaxed text-ink outline-none placeholder:text-ink-muted focus:border-b-2 focus:border-ink focus:pb-1.75"
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-ink">
          {error}
        </p>
      )}
    </div>
  )
}
