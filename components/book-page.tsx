import { cn } from 'cn'

/** The desk the book lies on: the strip of chrome above a page. Always dark, so its text is always light. */
export function DeskBar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <header className={cn('sticky top-0 z-20 -mx-3 flex min-h-14 items-center justify-between gap-2 bg-desk px-3 text-chrome sm:-mx-4 sm:px-4', className)}>
      {children}
    </header>
  )
}

/** A link or button set directly on the desk. */
export const deskLink = 'on-desk flex min-h-11 items-center rounded-sm px-2 text-lg text-chrome underline-offset-4 hover:underline'

/** One leaf of the book, growing with what is written on it. */
export function Paper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="page-stack flex flex-1 flex-col">
      <div className={cn('page-sheet flex-1', className)}>{children}</div>
    </div>
  )
}
