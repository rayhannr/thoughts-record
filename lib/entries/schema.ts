import { z } from 'zod'

const Intensity = z.number().int().min(0).max(100)

const RequiredText = z.string().trim().min(1)

// Blank optional columns are stored as null, never as empty strings.
const OptionalText = z
  .string()
  .trim()
  .nullish()
  .transform(v => (v ? v : null))

// One situation can bring several feelings, each at its own strength.
export const Feeling = z.object({
  name: RequiredText,
  intensity: Intensity
})
export type Feeling = z.infer<typeof Feeling>

export const MAX_FEELINGS = 5

/** The strongest feeling in an entry: what the list bar and the plot read. */
export function peakIntensity(feelings: Feeling[]): number {
  return feelings.reduce((max, f) => Math.max(max, f.intensity), 0)
}

export const EntryStatus = z.enum(['draft', 'done'])
export type EntryStatus = z.infer<typeof EntryStatus>

export const CreateEntry = z.object({
  occurred_at: z.iso.datetime(),

  situation: RequiredText,
  thoughts: RequiredText,
  feelings: z.array(Feeling).min(1).max(MAX_FEELINGS),
  evidence_for: OptionalText,

  evidence_against: OptionalText,
  balanced_thought: OptionalText,
  feeling_after: OptionalText,
  intensity_after: Intensity.nullish().transform(v => v ?? null)
})
export type CreateEntry = z.input<typeof CreateEntry>

export const UpdateEntry = CreateEntry.partial()
export type UpdateEntry = z.input<typeof UpdateEntry>

export const ListEntries = z.object({
  status: EntryStatus.optional(),
  from: z.iso.datetime().optional(),
  to: z.iso.datetime().optional()
})
export type ListEntries = z.input<typeof ListEntries>

export type Entry = z.output<typeof CreateEntry> & {
  id: string
  created_at: string
  updated_at: string
  status: EntryStatus
}

/** An entry without column 4 is a draft. */
export function statusFor(evidenceFor: string | null): EntryStatus {
  return evidenceFor ? 'done' : 'draft'
}

/** A whole entry as it was, for undoing a delete. */
export const RestoreEntry = CreateEntry.extend({
  id: z.uuid(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  status: EntryStatus
})
