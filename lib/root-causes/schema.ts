import { z } from 'zod'

const RequiredText = z.string().trim().min(1)

// `triggers` may hold several paragraphs, one per suspected trigger.
export const CreateRootCause = z.object({
  condition: RequiredText,
  triggers: RequiredText
})
export type CreateRootCause = z.input<typeof CreateRootCause>

export const UpdateRootCause = CreateRootCause.partial()
export type UpdateRootCause = z.input<typeof UpdateRootCause>

export type RootCause = z.output<typeof CreateRootCause> & {
  id: string
  created_at: string
  updated_at: string
}

/** A whole record as it was, for undoing a delete. */
export const RestoreRootCause = CreateRootCause.extend({
  id: z.uuid(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime()
})
