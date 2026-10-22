import { cn } from 'cn'

/** Lighter near the page when the feeling is faint, full orange when it is strong. Only reinforces the length and the number. */
export function toneFor(value: number) {
  return `color-mix(in oklab, var(--signal) ${Math.round(45 + 0.55 * value)}%, var(--paper))`
}

/**
 * A marker swipe whose length is the value, with the number ringed in pen beside it.
 * Intensity is never colour alone: the swipe is a length and the number is always present.
 * `hatched` draws the re-rated value as pencil hatching so it reads apart from the first one.
 */
export function IntensityBar({ value, className, large, hatched }: { value: number; className?: string; large?: boolean; hatched?: boolean }) {
  const tone = toneFor(value)
  return (
    <span className={cn('flex items-center gap-3', className)} style={{ '--tone': tone } as React.CSSProperties}>
      <span aria-hidden className={cn('relative block flex-1', large ? 'h-7' : 'h-5')}>
        <span className={cn('marker absolute inset-y-0 left-0', hatched && 'marker-after')} style={{ width: `${value}%`, background: tone }} />
      </span>
      <span className={cn('circled shrink-0 px-2 pt-1.5 pb-1', large ? 'min-w-16 text-[40px]' : 'min-w-14 text-[32px]')}>
        <span className="sr-only">intensitas </span>
        {value}
      </span>
    </span>
  )
}
