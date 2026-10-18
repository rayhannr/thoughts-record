'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { useUser } from '@/components/auth-provider'
import { DateTimePicker } from '@/components/date-time-picker'
import { StatusLine } from '@/components/status-line'
import { formatDay, formatDayTime } from '@/lib/format'
import { useCreateShareLink, useRevokeShareLink, useShareLinks } from '@/lib/share/client'
import type { ShareLink } from '@/lib/share/schema'

const chrome = 'flex min-h-11 items-center rounded-sm px-2 text-sm'
const label = 'block font-catalog text-xl font-semibold tracking-wide text-ink'
const input =
  'mt-2 block min-h-11 w-full rounded-sm border border-edge bg-surface px-3.5 text-lg text-ink outline-none focus:border-signal focus:ring-1 focus:ring-signal'

const EXPIRY_OPTIONS = [
  { days: 1, label: '1 hari' },
  { days: 7, label: '7 hari' },
  { days: 30, label: '30 hari' }
]

function daysAgoIso(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

/** The chosen moment as a dropdown button that opens the calendar, as the composer does for its date. */
function DateField({ id, question, value, onChange }: { id: string; question: string; value: string; onChange: (iso: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(v => !v)}
        className="label-caps -ml-2 flex min-h-11 items-center gap-1.5 rounded-sm px-2 text-ink"
      >
        <span className="sr-only">{question}: </span>
        {formatDayTime(value)}
        <ChevronDown aria-hidden className={open ? 'size-4 rotate-180 text-ink-muted' : 'size-4 text-ink-muted'} />
      </button>
      {open && (
        <div className="mt-2">
          <DateTimePicker id={id} value={value} onChange={onChange} />
        </div>
      )}
    </div>
  )
}

export default function SharePage() {
  const user = useUser()

  return (
    <>
      <nav className="sticky top-0 z-10 -mx-5 flex min-h-12 items-center bg-paper px-3 py-2 sm:-mx-6 sm:px-4">
        <Link href="/" className={`${chrome} text-ink-muted hover:text-ink`}>
          semua catatan
        </Link>
      </nav>

      <h1 className="mt-4 font-catalog text-4xl leading-none font-semibold tracking-[0.01em] text-ink">bagikan ke psikolog</h1>

      {user === undefined && <StatusLine>memuat…</StatusLine>}

      {user === null && (
        <div className="mt-6">
          <p className="text-base text-ink-muted">tautan hanya bisa dibuat dari akun. catatan di browser ini tidak ikut terbagi.</p>
          <Link
            href="/login"
            className="mt-3 inline-flex h-11 items-center rounded-sm border border-edge px-4 text-sm text-ink hover:border-ink"
          >
            masuk
          </Link>
        </div>
      )}

      {user && (
        <div className="mt-6 flex flex-col gap-12">
          <CreateForm />
          <ActiveLinks />
        </div>
      )}
    </>
  )
}

function CreateForm() {
  const create = useCreateShareLink()
  const [from, setFrom] = useState(() => daysAgoIso(14))
  const [to, setTo] = useState<string | null>(null)
  const [days, setDays] = useState(7)
  const [url, setUrl] = useState<string | null>(null)

  // The range runs between the exact moments chosen. Neither end may pass the other,
  // so the range never inverts.
  function changeFrom(iso: string) {
    setFrom(iso)
    if (to && to < iso) setTo(iso)
  }

  function changeTo(iso: string) {
    setTo(iso < from ? from : iso)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const { token } = await create.mutateAsync({
        range_from: from,
        range_to: to,
        expires_in_days: days
      })
      setUrl(`${window.location.origin}/s/${token}`)
    } catch {
      toast.error('tautan belum terbuat. coba lagi.')
    }
  }

  async function copy() {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      toast('tautan disalin')
    } catch {
      toast.error('tidak bisa menyalin. salin manual dari kolom di atas.')
    }
  }

  return (
    <section>
      <p className="max-w-[65ch] text-base text-ink-muted">
        orang yang punya tautan bisa membaca semua catatan di rentang ini, tanpa akun. catatan baru di rentang ini ikut
        terbaca. tautan bisa dicabut kapan saja.
      </p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-6">
        <div>
          <p className={label}>dari kapan?</p>
          <DateField id="share-from" question="dari kapan" value={from} onChange={changeFrom} />
        </div>

        <div>
          <p className={label}>sampai kapan?</p>
          <div className="mt-2 flex flex-wrap items-start gap-2">
            <button
              type="button"
              aria-pressed={to === null}
              onClick={() => setTo(null)}
              className={`min-h-11 rounded-sm border px-3.5 text-sm ${
                to === null ? 'border-ink bg-ink text-paper' : 'border-edge text-ink-muted hover:border-ink hover:text-ink'
              }`}
            >
              tanpa batas akhir
            </button>
            {to === null && (
              <button
                type="button"
                onClick={() => setTo(new Date().toISOString())}
                className="min-h-11 rounded-sm border border-edge px-3.5 text-sm text-ink-muted hover:border-ink hover:text-ink"
              >
                pilih waktu
              </button>
            )}
          </div>
          {to !== null && (
            <div className="mt-2">
              <DateField id="share-to" question="sampai kapan" value={to} onChange={changeTo} />
              <button type="button" onClick={() => setTo(null)} className={`${chrome} -ml-2 text-ink-muted hover:text-ink`}>
                hapus batas akhir
              </button>
            </div>
          )}
        </div>

        <fieldset>
          <legend className={label}>berlaku berapa lama?</legend>
          <div className="mt-2 flex gap-2">
            {EXPIRY_OPTIONS.map(o => (
              <button
                key={o.days}
                type="button"
                aria-pressed={days === o.days}
                onClick={() => setDays(o.days)}
                className={`min-h-11 rounded-sm border px-3.5 text-sm ${
                  days === o.days ? 'border-ink bg-ink text-paper' : 'border-edge text-ink-muted hover:border-ink hover:text-ink'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={create.isPending}
          className="inline-flex h-11 w-fit items-center rounded-sm bg-signal px-5 font-catalog text-lg font-semibold tracking-wide text-signal-ink hover:brightness-110 disabled:opacity-50"
        >
          buat tautan
        </button>
      </form>

      {url && (
        <div className="mt-8 border-t border-rule pt-6">
          <label htmlFor="share-url" className={label}>
            tautan
          </label>
          <input id="share-url" readOnly value={url} onFocus={e => e.currentTarget.select()} className={input} />
          <p className="mt-1.5 text-sm text-ink-muted">tautan ini hanya ditampilkan sekarang. salin sebelum pindah halaman.</p>
          <button type="button" onClick={copy} className={`${chrome} mt-3 border border-edge px-4 text-ink hover:border-ink`}>
            salin
          </button>
        </div>
      )}
    </section>
  )
}

function ActiveLinks() {
  const links = useShareLinks()

  if (links.isPending) return <StatusLine>memuat tautan…</StatusLine>
  if (links.isError) return <StatusLine>tautan tidak bisa dimuat. coba muat ulang halaman.</StatusLine>
  if (links.data.length === 0) return null

  return (
    <section>
      <h2 className="font-catalog text-xl font-semibold tracking-wide text-ink-muted">tautan yang aktif</h2>
      <ul className="mt-2 border-t border-rule">
        {links.data.map(link => (
          <li key={link.id} className="border-b border-rule">
            <LinkRow link={link} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function LinkRow({ link }: { link: ShareLink }) {
  const revoke = useRevokeShareLink()
  const [confirming, setConfirming] = useState(false)

  async function onRevoke() {
    try {
      await revoke.mutateAsync(link.id)
      toast('tautan dicabut')
    } catch {
      toast.error('tautan belum tercabut. coba lagi.')
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-4">
      <div className="min-w-0 text-base text-ink">
        <p>
          {formatDayTime(link.range_from)} – {link.range_to ? formatDayTime(link.range_to) : 'sekarang'}
        </p>
        <p className="text-sm text-ink-muted">berlaku sampai {formatDay(link.expires_at)}</p>
      </div>

      {confirming ? (
        <div role="group" aria-label="konfirmasi cabut" className="flex items-center gap-2">
          <button
            type="button"
            autoFocus
            onClick={onRevoke}
            disabled={revoke.isPending}
            className="flex min-h-11 items-center rounded-sm border border-signal px-4 text-sm font-semibold text-signal hover:bg-signal hover:text-signal-ink"
          >
            ya, cabut
          </button>
          <button type="button" onClick={() => setConfirming(false)} className={`${chrome} text-ink-muted hover:text-ink`}>
            batal
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => setConfirming(true)} className={`${chrome} text-ink-muted hover:text-signal`}>
          cabut
        </button>
      )}
    </div>
  )
}
