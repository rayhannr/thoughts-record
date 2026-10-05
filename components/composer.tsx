'use client'

import { ChevronDown, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useState } from 'react'
import { toast } from 'sonner'
import { AccountMenu } from '@/components/account-menu'
import { CatalogNumber } from '@/components/catalog-number'
import { DateTimePicker } from '@/components/date-time-picker'
import { IntensitySlider } from '@/components/intensity-slider'
import { PROMPTS, VALENCE_LABEL } from '@/components/prompts'
import { RuledField } from '@/components/ruled-field'
import { Button } from '@/components/ui/button'
import { markJustCompleted, useCreateEntry, useUpdateEntry } from '@/lib/entries/client'
import { CreateEntry, MAX_FEELINGS, type Entry, type Valence } from '@/lib/entries/schema'
import { formatDayTime } from '@/lib/format'
import { cn } from '@/lib/utils'

type FeelingDraft = { name: string; intensity: number | null; valence: Valence | null }

type Draft = {
  occurred_at: string
  situation: string
  thoughts: string
  feelings: FeelingDraft[]
  evidence_for: string
}

type Field = Exclude<keyof Draft, 'feelings'>

// Keyed by field, or `feelings.<row>.name` / `feelings.<row>.intensity`.
type Errors = Record<string, string | undefined>

const ERRORS: Record<string, string> = {
  occurred_at: 'waktunya tidak terbaca',
  situation: 'belum diisi',
  thoughts: 'belum diisi',
  name: 'belum diisi',
  intensity: 'geser untuk menilai'
}

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

function blankFeeling(): FeelingDraft {
  return { name: '', intensity: null, valence: null }
}

function isBlankFeeling(f: FeelingDraft) {
  return !f.name.trim() && f.intensity == null && !f.valence
}

function isBlank(d: Draft) {
  return !d.situation && !d.thoughts && d.feelings.every(isBlankFeeling) && !d.evidence_for
}

function fromEntry(entry: Entry): Draft {
  return {
    occurred_at: entry.occurred_at,
    situation: entry.situation,
    thoughts: entry.thoughts,
    feelings: entry.feelings.map(f => ({ ...f, valence: f.valence ?? null })),
    evidence_for: entry.evidence_for ?? ''
  }
}

function blankDraft(): Draft {
  return {
    occurred_at: new Date().toISOString(),
    situation: '',
    thoughts: '',
    feelings: [blankFeeling()],
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
  const [errors, setErrors] = useState<Errors>({})
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

  function setFeeling(row: number, key: keyof FeelingDraft, value: string | number | null) {
    setDraft(d => ({ ...d, feelings: d.feelings.map((f, i) => (i === row ? { ...f, [key]: value } : f)) }))
    const errorKey = `feelings.${row}.${key}`
    if (errors[errorKey]) setErrors(e => ({ ...e, [errorKey]: undefined }))
  }

  function addFeeling() {
    setDraft(d => ({ ...d, feelings: [...d.feelings, blankFeeling()] }))
  }

  function removeFeeling(row: number) {
    setDraft(d => ({ ...d, feelings: d.feelings.filter((_, i) => i !== row) }))
    setErrors({})
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    // A row left entirely empty is not an answer, so it is dropped. If nothing
    // remains, one blank row goes through so the error has somewhere to land.
    const rows = draft.feelings.flatMap((f, i) => (isBlankFeeling(f) ? [] : [i]))
    if (rows.length === 0) rows.push(0)

    const parsed = CreateEntry.safeParse({
      ...draft,
      feelings: rows.map(i => ({ name: draft.feelings[i].name, intensity: draft.feelings[i].intensity ?? undefined,
        valence: draft.feelings[i].valence
      }))
    })

    if (!parsed.success) {
      const next: Errors = {}
      for (const issue of parsed.error.issues) {
        const [field, index, sub] = issue.path
        // Map the filtered row back to the row the user sees.
        const key = field === 'feelings' ? `feelings.${rows[index as number] ?? 0}.${String(sub ?? 'name')}` : String(field)
        next[key] = ERRORS[String(sub ?? field)]
      }
      setErrors(next)
      const keys = Object.keys(next)
      const first = ['situation', 'thoughts'].find(k => keys.includes(k)) ?? keys.find(k => k.startsWith('feelings.'))
      if (first) {
        const [, row, sub] = first.split('.')
        document.getElementById(first.startsWith('feelings.') ? `${ids}-feelings-${row}-${sub}` : `${ids}-${first}`)?.focus()
      }
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
      <div className="sticky top-0 py-2 z-10 -mx-5 flex min-h-12 items-center justify-between gap-4 bg-paper px-5 sm:-mx-6 sm:px-6">
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

      <div className="flex flex-col gap-8">
        {draft.feelings.map((feeling, row) => {
          const base = `${ids}-feelings-${row}`
          const nameError = errors[`feelings.${row}.name`]
          const intensityError = errors[`feelings.${row}.intensity`]
          return (
            <div key={row} className="flex flex-col gap-5">
              <RuledField
                id={`${base}-name`}
                question={row === 0 ? PROMPTS.feelings : PROMPTS.anotherFeeling}
                value={feeling.name}
                onChange={v => setFeeling(row, 'name', v)}
                error={nameError}
              />
              <div>
                <span id={`${base}-intensity-label`} className="mb-2 block font-catalog text-xl font-semibold tracking-wide text-ink">
                  {PROMPTS.intensity}
                </span>
                <IntensitySlider
                  id={`${base}-intensity`}
                  value={feeling.intensity}
                  onChange={v => setFeeling(row, 'intensity', v)}
                  labelledBy={`${base}-intensity-label`}
                  describedBy={intensityError ? `${base}-intensity-error` : undefined}
                  invalid={!!intensityError}
                />
                {intensityError && (
                  <p id={`${base}-intensity-error`} className="mt-1.5 text-sm text-signal">
                    {intensityError}
                  </p>
                )}
              </div>
              <div role="group" aria-labelledby={`${base}-valence-label`}>
                <span id={`${base}-valence-label`} className="mb-2 block font-catalog text-xl font-semibold tracking-wide text-ink">
                  {PROMPTS.valence}
                </span>
                <div className="flex gap-2">
                  {(Object.keys(VALENCE_LABEL) as Valence[]).map(v => (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={feeling.valence === v}
                      onClick={() => setFeeling(row, 'valence', feeling.valence === v ? null : v)}
                      className={cn(
                        'flex min-h-11 items-center rounded-sm border px-4 text-base',
                        feeling.valence === v ? 'border-ink bg-ink text-paper' : 'border-edge text-ink hover:border-ink'
                      )}
                    >
                      {VALENCE_LABEL[v]}
                    </button>
                  ))}
                </div>
              </div>
              {draft.feelings.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFeeling(row)}
                  className="-ml-2 flex min-h-11 items-center gap-1.5 self-start rounded-sm px-2 text-sm text-ink-muted hover:text-ink"
                >
                  <X aria-hidden className="size-4" />
                  hapus perasaan ini
                </button>
              )}
            </div>
          )
        })}
        {draft.feelings.length < MAX_FEELINGS && (
          <button
            type="button"
            onClick={addFeeling}
            className="-ml-2 flex min-h-11 items-center gap-1.5 self-start rounded-sm px-2 text-sm text-ink hover:text-ink-muted"
          >
            <Plus aria-hidden className="size-4" />
            ada perasaan lain
          </button>
        )}
      </div>

      <RuledField
        id={`${ids}-evidence_for`}
        question={PROMPTS.evidence}
        value={draft.evidence_for}
        onChange={v => set('evidence_for', v)}
        placeholder="boleh diisi nanti"
        autoFocus={focusEvidence}
      />

      <div className="sticky bottom-0 z-10 -mx-5 flex flex-col gap-3 border-t border-rule bg-paper px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:-mx-6 sm:px-6">
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
