'use client'

import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { useUser } from '@/components/auth-provider'
import { deskLink } from '@/components/book-page'
import { createClient } from '@/lib/supabase/client'

export function AccountMenu() {
  const user = useUser()

  if (user === undefined) return <span aria-hidden className="size-11" />

  if (user === null) {
    return (
      <Link href="/login" className={deskLink}>
        masuk
      </Link>
    )
  }

  return <Profile user={user} />
}

function Profile({ user }: { user: User }) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const panelId = useId()

  const name: string = user.user_metadata.full_name ?? user.user_metadata.name ?? ''
  const avatar: string | undefined = user.user_metadata.avatar_url ?? user.user_metadata.picture
  const initial = (name || user.email || '?').charAt(0).toUpperCase()

  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  async function signOut() {
    setPending(true)
    await createClient().auth.signOut()
    setPending(false)
    setOpen(false)
  }

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="akun"
        onClick={() => setOpen(v => !v)}
        className="on-desk flex size-11 items-center justify-center rounded-sm"
      >
        <Avatar src={avatar} initial={initial} />
      </button>
      {open && (
        <div id={panelId} className="absolute right-0 top-full z-30 w-64 rounded-[4px_12px_6px_10px] border-2 border-edge bg-surface p-4 text-ink">
          <div className="flex items-center gap-3">
            <Avatar src={avatar} initial={initial} />
            <div className="min-w-0 text-base">
              {name && <p className="truncate font-semibold text-ink">{name}</p>}
              <p className="truncate text-ink-muted">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={signOut}
            disabled={pending}
            className="btn-pen mt-3 w-full"
          >
            keluar
          </button>
        </div>
      )}
    </div>
  )
}

function Avatar({ src, initial }: { src?: string; initial: string }) {
  const [failed, setFailed] = useState(false)

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="size-8 shrink-0 rounded-full border-2 border-chrome-muted object-cover"
      />
    )
  }

  return (
    <span
      aria-hidden
      className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-chrome-muted bg-desk text-base text-chrome"
    >
      {initial}
    </span>
  )
}
