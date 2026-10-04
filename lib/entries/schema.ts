import { z } from 'zod'

const Intensity = z.number().int().min(0).max(100)

const RequiredText = z.string().trim().min(1)

// Blank optional columns are stored as null, never as empty strings.
const OptionalText = z
  .string()
  .trim()
  .nullish()
  .transform(v => (v ? v : null))

export const EntryStatus = z.enum(['draft', 'done'])
export type EntryStatus = z.infer<typeof EntryStatus>

export const CreateEntry = z.object({
  occurred_at: z.iso.datetime(),

  situation: RequiredText,
  thoughts: RequiredText,
  feelings: RequiredText,
  intensity: Intensity,
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
