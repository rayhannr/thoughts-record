'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useId, useState } from 'react'
import { toast } from 'sonner'
import { DeskBar, Paper, deskLink } from '@/components/book-page'
import { ROOT_CAUSE } from '@/components/prompts'
import { RuledField } from '@/components/ruled-field'
import { useCreateRootCause, useDeleteRootCause, useRestoreRootCause, useUpdateRootCause } from '@/lib/root-causes/client'
import { CreateRootCause, type RootCause } from '@/lib/root-causes/schema'

type Errors = { condition?: string; triggers?: string }

/** Writes a new root cause record, or edits one when `item` is given. */
export function RootCauseForm({ item, cancelHref }: { item?: RootCause; cancelHref: string }) {
  const router = useRouter()
  const ids = useId()
  const [condition, setCondition] = useState(item?.condition ?? '')
  const [triggers, setTriggers] = useState(item?.triggers ?? '')
  const [errors, setErrors] = useState<Errors>({})

  const create = useCreateRootCause()
  const update = useUpdateRootCause(item?.id ?? '')
  const saving = create.isPending || update.isPending

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    const parsed = CreateRootCause.safeParse({ condition, triggers })
    if (!parsed.success) {
      const next: Errors = {}
      for (const issue of parsed.error.issues) next[issue.path[0] as keyof Errors] = 'belum diisi'
      setErrors(next)
      const first = next.condition ? 'condition' : 'triggers'
      document.getElementById(`${ids}-${first}`)?.focus()
      return
    }

    try {
      if (item) await update.mutateAsync(parsed.data)
      else await create.mutateAsync(parsed.data)
      router.push(cancelHref)
    } catch {
      toast.error('belum tersimpan. coba lagi.')
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col">
      <DeskBar>
        <h1 className="font-write text-[28px] leading-none text-chrome">{ROOT_CAUSE.title}</h1>
        <Link href={cancelHref} className={deskLink}>
          batal
        </Link>
      </DeskBar>

      <Paper className="flex flex-col gap-8">
        <RuledField
          id={`${ids}-condition`}
          question={ROOT_CAUSE.condition}
          value={condition}
          onChange={v => {
            setCondition(v)
            if (errors.condition) setErrors(e => ({ ...e, condition: undefined }))
          }}
          error={errors.condition}
          autoFocus={!item}
        />

        <div>
          <RuledField
            id={`${ids}-triggers`}
            question={ROOT_CAUSE.triggers}
            value={triggers}
            onChange={v => {
              setTriggers(v)
              if (errors.triggers) setErrors(e => ({ ...e, triggers: undefined }))
            }}
            error={errors.triggers}
          />
          <p className="label-hand mt-2">{ROOT_CAUSE.triggersHint}</p>
        </div>

        {item && <DeleteControl item={item} />}
      </Paper>

      <div className="sticky bottom-0 z-20 -mx-3 bg-desk px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:-mx-4 sm:px-4">
        <button type="submit" disabled={saving} className="btn-signal on-desk h-12 w-full text-[22px]">
          {saving ? 'menyimpan…' : 'simpan'}
        </button>
      </div>
    </form>
  )
}

function DeleteControl({ item }: { item: RootCause }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const remove = useDeleteRootCause()
  const restore = useRestoreRootCause()

  async function onDelete() {
    // Leave first, so the edit page never re-renders as "not found".
    router.push('/root-causes')
    try {
      await remove.mutateAsync(item.id)
    } catch {
      toast.error('belum terhapus. coba lagi.')
      return
    }
    toast('catatan dihapus', {
      action: { label: 'kembalikan', onClick: () => restore.mutate(item) }
    })
  }

  // Delete sits alone and stays quiet until chosen, as on an entry.
  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className="btn-quiet -ml-2 self-start hover:text-signal">
        hapus catatan
      </button>
    )
  }

  return (
    <div role="group" aria-label="konfirmasi hapus" className="flex flex-wrap items-center gap-2">
      <span className="mr-2 text-lg text-ink">hapus catatan ini?</span>
      <button
        type="button"
        autoFocus
        onClick={onDelete}
        disabled={remove.isPending}
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
