'use client'

import { useState } from 'react'

/** Delete stays quiet until chosen, then asks once. */
export function ConfirmDelete({
  label = 'hapus catatan',
  question = 'hapus catatan ini?',
  onConfirm,
  pending
}: {
  label?: string
  question?: string
  onConfirm: () => void
  pending?: boolean
}) {
  const [confirming, setConfirming] = useState(false)

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className="btn-quiet -ml-2 self-start hover:text-signal">
        {label}
      </button>
    )
  }

  return (
    <div role="group" aria-label="konfirmasi hapus" className="flex flex-wrap items-center gap-2">
      <span className="mr-2 text-lg text-ink">{question}</span>
      <button
        type="button"
        autoFocus
        onClick={onConfirm}
        disabled={pending}
        className="btn-pen border-signal text-signal hover:bg-signal hover:text-signal-ink"
      >
        ya, hapus
      </button>
      <button type="button" onClick={() => setConfirming(false)} className="btn-quiet">
        batal
      </button>
    </div>
  )
}
