'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ROOT_CAUSE } from '@/components/prompts'
import { RootCauseForm } from '@/components/root-cause-form'
import { StatusLine, StorageError } from '@/components/status-line'
import { useRootCauses } from '@/lib/root-causes/client'

export default function EditRootCausePage() {
  const { id } = useParams<{ id: string }>()
  const items = useRootCauses()

  if (items.isPending) return <StatusLine>memuat catatan…</StatusLine>
  if (items.isError) return <StorageError />

  const item = items.data.find(r => r.id === id)
  if (!item) {
    return (
      <div className="py-10">
        <p className="text-lg text-chrome-muted">catatan ini tidak ada.</p>
        <Link href="/root-causes" className="btn-desk on-desk mt-3">
          ke {ROOT_CAUSE.title}
        </Link>
      </div>
    )
  }

  return <RootCauseForm item={item} cancelHref="/root-causes" />
}
