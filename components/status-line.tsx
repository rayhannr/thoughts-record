import Link from 'next/link'
import { cn } from 'cn'

/** Loading and error states: a quiet line of text, never a spinner or alert box. Sits on the desk unless `onPaper`. */
export function StatusLine({ children, onPaper }: { children: React.ReactNode; onPaper?: boolean }) {
  return (
    <p role="status" className={cn('py-10 text-lg', onPaper ? 'text-ink-muted' : 'text-chrome-muted')}>
      {children}
    </p>
  )
}

export function StorageError() {
  return (
    <StatusLine>catatan tidak bisa dibaca dari penyimpanan browser ini. coba muat ulang halaman, atau buka di browser lain.</StatusLine>
  )
}

export function EntryNotFound() {
  return (
    <div className="py-10">
      <p className="text-lg text-chrome-muted">catatan ini tidak ada di browser ini.</p>
      <Link href="/" className="btn-desk on-desk mt-3">
        ke semua catatan
      </Link>
    </div>
  )
}
