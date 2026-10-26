'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import { DeskBar, Paper, deskLink } from '@/components/book-page'
import { ROOT_CAUSE } from '@/components/prompts'
import { RootCauseForm } from '@/components/root-cause-form'
import { StatusLine, StorageError } from '@/components/status-line'
import { formatDay } from '@/lib/format'
import { useRootCauses } from '@/lib/root-causes/client'

export default function RootCausesPage() {
  const items = useRootCauses()

  if (items.isPending) return <StatusLine>memuat catatan…</StatusLine>
  if (items.isError) return <StorageError />

  // No empty-state screen: with nothing written yet, the page is the form.
  if (items.data.length === 0) return <RootCauseForm cancelHref="/" />

  return (
    <>
      <DeskBar>
        <Link href="/" className={`${deskLink} -ml-2`}>
          semua catatan
        </Link>
        <Link href="/root-causes/new" className="btn-signal on-desk">
          <Plus aria-hidden className="size-5" strokeWidth={2.5} />
          tulis
        </Link>
      </DeskBar>

      <Paper>
        <h1 className="font-write text-[40px] leading-9 text-ink">{ROOT_CAUSE.title}</h1>

        <ul className="mt-6 border-t border-rule">
          {items.data.map(item => (
            <li key={item.id} className="flex flex-col gap-4 border-b border-rule py-6">
              <p className="label-hand" suppressHydrationWarning>
                {formatDay(item.created_at)}
              </p>
              <div>
                <p className="prompt">{ROOT_CAUSE.condition}</p>
                <p className="font-write text-[30px] leading-9 whitespace-pre-line text-ink">{item.condition}</p>
              </div>
              <div>
                <p className="prompt">{ROOT_CAUSE.triggers}</p>
                <p className="font-write text-[28px] leading-9 whitespace-pre-line text-ink">{item.triggers}</p>
              </div>
              <Link href={`/root-causes/${item.id}/edit`} className="btn-quiet -ml-2 self-start">
                ubah
              </Link>
            </li>
          ))}
        </ul>
      </Paper>
    </>
  )
}
