import { z } from 'zod'

// One thing to be grateful for. A day holds as many as were written.
export const CreateGratitude = z.object({
  occurred_at: z.iso.datetime(),
  content: z.string().trim().min(1)
})
export type CreateGratitude = z.input<typeof CreateGratitude>

export const UpdateGratitude = CreateGratitude.partial()
export type UpdateGratitude = z.input<typeof UpdateGratitude>

export const ListGratitudes = z.object({
  from: z.iso.datetime().optional(),
  to: z.iso.datetime().optional()
})
export type ListGratitudes = z.input<typeof ListGratitudes>

export type Gratitude = z.output<typeof CreateGratitude> & {
  id: string
  created_at: string
  updated_at: string
}

/** A whole item as it was, for undoing a delete. */
export const RestoreGratitude = CreateGratitude.extend({
  id: z.uuid(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime()
})
