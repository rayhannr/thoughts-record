'use client'

import Link from 'next/link'
import { useId, useState } from 'react'
import { toast } from 'sonner'
import { DeskBar, Paper, deskLink } from '@/components/book-page'
import { ConfirmDelete } from '@/components/confirm-delete'
import { GRATITUDE } from '@/components/prompts'
import { RuledField } from '@/components/ruled-field'
import { StatusLine, StorageError } from '@/components/status-line'
import { formatDay, formatDayTime } from '@/lib/format'
import { useCreateGratitude, useGratitudes, useRemoveGratitude } from '@/lib/gratitudes/client'
import type { Gratitude } from '@/lib/gratitudes/schema'

export default function GratitudesPage() {
  const items = useGratitudes()

  return (
    <>
      <DeskBar>
        <Link href="/" className={`${deskLink} -ml-2`}>
          semua catatan
        </Link>
      </DeskBar>

      <Paper>
        <h1 className="font-write text-[40px] leading-9 text-ink">{GRATITUDE.title}</h1>

        <AddForm hasItems={!!items.data?.length} />

        {items.isPending && <StatusLine onPaper>memuat catatan…</StatusLine>}
        {items.isError && <StorageError />}
        {items.data && items.data.length > 0 && <Days items={items.data} />}
      </Paper>
    </>
  )
}

// Stays at the top so writing one is a single step; the field empties for the next.
function AddForm({ hasItems }: { hasItems: boolean }) {
  const ids = useId()
  const create = useCreateGratitude()
  const [content, setContent] = useState('')
  const [error, setError] = useState<string>()

  async function onSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!content.trim()) {
      setError('belum diisi')
      document.getElementById(`${ids}-content`)?.focus()
      return
    }
    try {
      await create.mutateAsync({ occurred_at: new Date().toISOString(), content })
      setContent('')
      document.getElementById(`${ids}-content`)?.focus()
    } catch {
      toast.error('belum tersimpan. coba lagi.')
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-4">
      <RuledField
        id={`${ids}-content`}
        question={hasItems ? GRATITUDE.another : GRATITUDE.prompt}
        value={content}
        onChange={v => {
          setContent(v)
          if (error) setError(undefined)
        }}
        error={error}
        autoFocus
      />
      <button type="submit" disabled={create.isPending} className="btn-signal w-fit">
        {create.isPending ? 'menyimpan…' : 'simpan'}
      </button>
    </form>
  )
}

// Grouped by the day each was written for. Nothing counts them or remarks on a quiet day.
function Days({ items }: { items: Gratitude[] }) {
  const groups: { day: string; items: Gratitude[] }[] = []
  for (const item of items) {
    const day = formatDay(item.occurred_at)
    const last = groups[groups.length - 1]
    if (last?.day === day) last.items.push(item)
    else groups.push({ day, items: [item] })
  }

  return (
    <div className="mt-10 flex flex-col gap-8">
      {groups.map(group => (
        <section key={group.day}>
          <h2 className="prompt" suppressHydrationWarning>
            {group.day}
          </h2>
          <ul className="border-t border-rule">
            {group.items.map(item => (
              <li key={item.id} className="border-b border-rule py-4">
                <Row item={item} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function Row({ item }: { item: Gratitude }) {
  const remove = useRemoveGratitude()

  return (
    <>
      <p className="font-write text-[28px] leading-9 whitespace-pre-line text-ink">{item.content}</p>
      <p className="label-hand" suppressHydrationWarning>
        {formatDayTime(item.occurred_at)}
      </p>
      <div className="-ml-2 mt-1 flex flex-wrap items-center gap-x-2">
        <Link href={`/gratitudes/${item.id}/edit`} className="btn-quiet">
          ubah
        </Link>
        <ConfirmDelete label="hapus" onConfirm={() => void remove(item)} />
      </div>
    </>
  )
}
