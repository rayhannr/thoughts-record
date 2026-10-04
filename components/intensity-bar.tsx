import { cn } from '@/lib/utils'

const CELLS = 20

/**
 * Twenty cells, one per five points. Intensity is never colour alone: the strip
 * is a length, and the number always sits beside it.
 */
export function CodeStrip({ value, className, cell = 'h-3.5 w-[5px]' }: { value: number; className?: string; cell?: string }) {
  const filled = Math.round(value / 5)
  return (
    <span aria-hidden className={cn('flex shrink-0 gap-[2px]', className)}>
      {Array.from({ length: CELLS }, (_, i) => (
        <span key={i} className={cn('strip-cell', cell)} data-on={i < filled} style={{ '--i': i + 1 } as React.CSSProperties} />
      ))}
    </span>
  )
}

export function IntensityBar({ value, className, large }: { value: number; className?: string; large?: boolean }) {
  return (
    <span className={cn('flex shrink-0 items-center gap-3', className)}>
      <CodeStrip value={value} cell={large ? 'h-5 w-2' : 'h-3.5 w-[5px]'} />
      <span className={cn('text-right font-catalog font-semibold tabular-nums text-ink', large ? 'min-w-12 text-6xl' : 'min-w-9 text-4xl')}>
        <span className="sr-only">intensitas </span>
        {value}
      </span>
    </span>
  )
}
