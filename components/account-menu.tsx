'use client'

import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// undefined until the first session read, so the control never flashes "masuk" for a signed-in user.
function useUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
    return () => data.subscription.unsubscribe()
  }, [])

  return user
}

export function AccountMenu() {
  const user = useUser()

  if (user === undefined) return <span aria-hidden className="size-11" />

  if (user === null) {
    return (
      <Link href="/login" className="flex min-h-11 items-center rounded-sm px-2 text-sm text-ink-muted hover:text-ink">
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
        className="flex size-11 items-center justify-center rounded-sm"
      >
        <Avatar src={avatar} initial={initial} />
      </button>
      {open && (
        <div id={panelId} className="absolute right-0 top-full z-10 w-64 border border-rule bg-surface p-4">
          <div className="flex items-center gap-3">
            <Avatar src={avatar} initial={initial} />
            <div className="min-w-0 text-sm">
              {name && <p className="truncate font-semibold text-ink">{name}</p>}
              <p className="truncate text-ink-muted">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={signOut}
            disabled={pending}
            className="mt-3 flex min-h-11 w-full items-center rounded-sm border border-edge px-3 text-sm text-ink hover:border-ink disabled:opacity-60"
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
        className="size-8 shrink-0 rounded-full border border-rule object-cover"
      />
    )
  }

  return (
    <span
      aria-hidden
      className="flex size-8 shrink-0 items-center justify-center rounded-full border border-rule bg-paper text-sm text-ink"
    >
      {initial}
    </span>
  )
}
