import Link from 'next/link'

/** Loading and error states: a quiet line of muted sans, never a spinner or alert box. */
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
        className="-ml-2 mt-1 inline-flex min-h-11 items-center rounded-sm px-2 text-sm text-ink underline decoration-1 underline-offset-4"
      >
        ke semua catatan
      </Link>
    </div>
  )
}
