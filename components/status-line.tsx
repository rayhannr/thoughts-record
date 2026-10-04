import Link from 'next/link'

/** Loading and error states: a quiet line of muted text, never a spinner or alert box. */
export function StatusLine({ children }: { children: React.ReactNode }) {
  return (
    <p role="status" className="py-10 text-sm text-ink-muted">
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
      <p className="text-sm text-ink-muted">catatan ini tidak ada di browser ini.</p>
      <Link
        href="/"
        className="mt-3 inline-flex h-11 items-center rounded-sm border border-edge px-4 text-sm text-ink hover:border-ink"
      >
        ke semua catatan
      </Link>
    </div>
  )
}
