'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { AccountMenu } from '@/components/account-menu'
import { CatalogNumber } from '@/components/catalog-number'
import { DateTimePicker } from '@/components/date-time-picker'
import { IntensitySlider } from '@/components/intensity-slider'
import { PROMPTS } from '@/components/prompts'
import { RuledField } from '@/components/ruled-field'
import { Button } from '@/components/ui/button'
import { markJustCompleted, useCreateEntry, useUpdateEntry } from '@/lib/entries/client'
import { CreateEntry, type Entry } from '@/lib/entries/schema'
import { formatDayTime } from '@/lib/format'

type Draft = {
  occurred_at: string
  situation: string
  thoughts: string
  feelings: string
  intensity: number | null
  evidence_for: string
}

type Field = keyof Draft

const ERRORS: Partial<Record<Field, string>> = {
  occurred_at: 'waktunya tidak terbaca',
  situation: 'belum diisi',
  thoughts: 'belum diisi',
  feelings: 'belum diisi',
  intensity: 'geser untuk menilai'
}

const FIELD_ORDER: Field[] = ['situation', 'thoughts', 'feelings', 'intensity']

// An unsaved new entry survives a closed tab or an accidental back.
const UNSENT_KEY = 'thought-record:unsent:v1'

function loadUnsent(): Draft | null {
  try {
    const raw = window.localStorage.getItem(UNSENT_KEY)
    return raw ? (JSON.parse(raw) as Draft) : null
  } catch {
    return null
  }
}

function saveUnsent(draft: Draft | null) {
  try {
    if (draft) window.localStorage.setItem(UNSENT_KEY, JSON.stringify(draft))
    else window.localStorage.removeItem(UNSENT_KEY)
  } catch {
    // Storage unavailable: the entry can still be saved, only not recovered.
  }
}

function isBlank(d: Draft) {
  return !d.situation && !d.thoughts && !d.feelings && d.intensity == null && !d.evidence_for
}

function fromEntry(entry: Entry): Draft {
  return {
    occurred_at: entry.occurred_at,
    situation: entry.situation,
    thoughts: entry.thoughts,
    feelings: entry.feelings,
    intensity: entry.intensity,
    evidence_for: entry.evidence_for ?? ''
  }
}

function blankDraft(): Draft {
  return {
    occurred_at: new Date().toISOString(),
    situation: '',
    thoughts: '',
    feelings: '',
    intensity: null,
    evidence_for: ''
  }
}

/**
 * Writes a new entry, or edits an existing one when `entry` is given.
 * Must render client-side only: it reads localStorage on first render.
 */
export function Composer({ entry, cancelHref, focusEvidence }: { entry?: Entry; cancelHref?: string; focusEvidence?: boolean }) {
  const router = useRouter()
  const ids = useId()
  const isNew = !entry

  const [draft, setDraft] = useState<Draft>(() => (entry ? fromEntry(entry) : (loadUnsent() ?? blankDraft())))
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [editingTime, setEditingTime] = useState(false)

  const create = useCreateEntry()
  const update = useUpdateEntry(entry?.id ?? '')
  const saving = create.isPending || update.isPending

  useEffect(() => {
    if (isNew) saveUnsent(isBlank(draft) ? null : draft)
  }, [draft, isNew])

  function set<K extends Field>(field: K, value: Draft[K]) {
    setDraft(d => ({ ...d, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = CreateEntry.safeParse({
      ...draft,
      intensity: draft.intensity ?? undefined
    })

    if (!parsed.success) {
      const invalid = Object.keys(z.flattenError(parsed.error).fieldErrors) as Field[]
      setErrors(Object.fromEntries(invalid.map(f => [f, ERRORS[f]])))
      const first = FIELD_ORDER.find(f => invalid.includes(f))
      if (first) document.getElementById(`${ids}-${first}`)?.focus()
      return
    }

    try {
      if (isNew) {
        await create.mutateAsync(parsed.data)
        saveUnsent(null)
        router.push('/')
      } else {
        const saved = await update.mutateAsync(parsed.data)
        if (entry.status === 'draft' && saved.status === 'done') {
          markJustCompleted(saved.id)
        }
        router.push(`/entries/${saved.id}`)
      }
    } catch {
      toast.error('catatan belum tersimpan. penyimpanan browser ini tidak bisa ditulis.')
    }
  }

  const timeId = `${ids}-occurred_at`

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
      <div className="flex min-h-12 items-center justify-between gap-4">
        <button
          type="button"
          aria-expanded={editingTime}
          aria-controls={timeId}
          onClick={() => setEditingTime(v => !v)}
          className="label-caps -ml-2 flex min-h-11 items-center gap-1.5 rounded-sm px-2 text-ink"
        >
          <span className="sr-only">kapan terjadinya: </span>
          {formatDayTime(draft.occurred_at)}
          <ChevronDown aria-hidden className={editingTime ? 'size-4 rotate-180 text-ink-muted' : 'size-4 text-ink-muted'} />
        </button>
        {cancelHref ? (
          <Link href={cancelHref} className="-mr-2 flex min-h-11 items-center rounded-sm px-2 text-sm text-ink-muted hover:text-ink">
            batal
          </Link>
        ) : (
          <div className="-mr-2">
            <AccountMenu />
          </div>
        )}
      </div>

      {editingTime && (
        <div className="-mt-6">
          <p className="mb-2 text-sm text-ink-muted">kapan terjadinya?</p>
          <DateTimePicker id={timeId} value={draft.occurred_at} onChange={v => set('occurred_at', v)} />
        </div>
      )}

      <CatalogNumber id={entry?.id} className="-mb-2 text-5xl" />

      <RuledField
        id={`${ids}-situation`}
        question={PROMPTS.situation}
        value={draft.situation}
        onChange={v => set('situation', v)}
        error={errors.situation}
        autoFocus={isNew && !draft.situation}
      />

      <RuledField
        id={`${ids}-thoughts`}
        question={PROMPTS.thoughts}
        value={draft.thoughts}
        onChange={v => set('thoughts', v)}
        error={errors.thoughts}
      />

      <div className="flex flex-col gap-5">
        <RuledField
          id={`${ids}-feelings`}
          question={PROMPTS.feelings}
          value={draft.feelings}
          onChange={v => set('feelings', v)}
          error={errors.feelings}
        />
        <div>
          <span id={`${ids}-intensity-label`} className="mb-2 block font-catalog text-xl font-semibold tracking-wide text-ink">
            {PROMPTS.intensity}
          </span>
          <IntensitySlider
            id={`${ids}-intensity`}
            value={draft.intensity}
            onChange={v => set('intensity', v)}
            labelledBy={`${ids}-intensity-label`}
            describedBy={errors.intensity ? `${ids}-intensity-error` : undefined}
            invalid={!!errors.intensity}
          />
          {errors.intensity && (
            <p id={`${ids}-intensity-error`} className="mt-1.5 text-sm text-signal">
              {errors.intensity}
            </p>
          )}
        </div>
      </div>

      <RuledField
        id={`${ids}-evidence_for`}
        question={PROMPTS.evidence}
        value={draft.evidence_for}
        onChange={v => set('evidence_for', v)}
        placeholder="boleh diisi nanti"
        autoFocus={focusEvidence}
      />

      <div className="flex flex-col gap-3">
        <Button type="submit" disabled={saving} className="h-12 w-full font-catalog text-xl font-semibold tracking-wide">
          {saving ? 'menyimpan…' : 'simpan'}
        </Button>
        {!draft.evidence_for.trim() && (
          <p className="text-sm text-ink-muted">tanpa bukti, catatan disimpan sebagai belum diuji. bisa dilanjutkan nanti.</p>
        )}
      </div>
    </form>
  )
}
