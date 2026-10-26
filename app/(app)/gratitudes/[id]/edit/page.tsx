'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useId, useState } from 'react'
import { toast } from 'sonner'
import { DeskBar, Paper, deskLink } from '@/components/book-page'
import { DateTimePicker } from '@/components/date-time-picker'
import { GRATITUDE } from '@/components/prompts'
import { RuledField } from '@/components/ruled-field'
import { StatusLine, StorageError } from '@/components/status-line'
import { formatDayTime } from '@/lib/format'
import { useGratitudes, useUpdateGratitude } from '@/lib/gratitudes/client'
import { UpdateGratitude, type Gratitude } from '@/lib/gratitudes/schema'

const BACK = '/gratitudes'

export default function EditGratitudePage() {
  const { id } = useParams<{ id: string }>()
  const items = useGratitudes()

  if (items.isPending) return <StatusLine>memuat catatan…</StatusLine>
  if (items.isError) return <StorageError />

  const item = items.data.find(g => g.id === id)
  if (!item) {
    return (
      <div className="py-10">
        <p className="text-lg text-chrome-muted">catatan ini tidak ada.</p>
        <Link href={BACK} className="btn-desk on-desk mt-3">
          ke {GRATITUDE.title}
        </Link>
      </div>
    )
  }

  return <EditForm item={item} />
}

function EditForm({ item }: { item: Gratitude }) {
  const router = useRouter()
  const ids = useId()
  const update = useUpdateGratitude(item.id)
  const [content, setContent] = useState(item.content)
  const [occurredAt, setOccurredAt] = useState(item.occurred_at)
  const [editingTime, setEditingTime] = useState(false)
  const [error, setError] = useState<string>()

  async function onSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    const parsed = UpdateGratitude.safeParse({ content, occurred_at: occurredAt })
    if (!parsed.success) {
      setError('belum diisi')
      document.getElementById(`${ids}-content`)?.focus()
      return
    }
    try {
      await update.mutateAsync(parsed.data)
      router.push(BACK)
    } catch {
      toast.error('belum tersimpan. coba lagi.')
    }
  }

  const timeId = `${ids}-occurred_at`

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col">
      <DeskBar>
        <button
          type="button"
          aria-expanded={editingTime}
          aria-controls={timeId}
          onClick={() => setEditingTime(v => !v)}
          className={`${deskLink} -ml-2 gap-1.5`}
        >
          <span className="sr-only">untuk kapan: </span>
          {formatDayTime(occurredAt)}
          <ChevronDown aria-hidden className={editingTime ? 'size-5 rotate-180 text-chrome-muted' : 'size-5 text-chrome-muted'} />
        </button>
        <Link href={BACK} className={deskLink}>
          batal
        </Link>
      </DeskBar>

      <Paper className="flex flex-col gap-8">
        {editingTime && (
          <div>
            <p className="prompt">untuk kapan?</p>
            <DateTimePicker id={timeId} value={occurredAt} onChange={setOccurredAt} />
          </div>
        )}

        <RuledField
          id={`${ids}-content`}
          question={GRATITUDE.prompt}
          value={content}
          onChange={v => {
            setContent(v)
            if (error) setError(undefined)
          }}
          error={error}
        />
      </Paper>

      <div className="sticky bottom-0 z-20 -mx-3 bg-desk px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:-mx-4 sm:px-4">
        <button type="submit" disabled={update.isPending} className="btn-signal on-desk h-12 w-full text-[22px]">
          {update.isPending ? 'menyimpan…' : 'simpan'}
        </button>
      </div>
    </form>
  )
}
