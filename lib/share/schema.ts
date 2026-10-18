import { z } from 'zod'
import type { Entry } from '@/lib/entries/schema'

export const MAX_EXPIRY_DAYS = 90

export const CreateShareLink = z
  .object({
    range_from: z.iso.datetime(),
    range_to: z.iso
      .datetime()
      .nullish()
      .transform(v => v ?? null),
    expires_in_days: z.number().int().min(1).max(MAX_EXPIRY_DAYS)
  })
  .refine(v => !v.range_to || new Date(v.range_to) >= new Date(v.range_from), {
    message: 'range_to is before range_from',
    path: ['range_to']
  })
export type CreateShareLink = z.input<typeof CreateShareLink>

/** A link as its owner sees it. The token itself is never stored, so it is never listed. */
export type ShareLink = {
  id: string
  range_from: string
  range_to: string | null
  expires_at: string
  created_at: string
}

/** What a viewer of a link sees: the entries in its range. */
export type SharedView = {
  range_from: string
  range_to: string | null
  expires_at: string
  entries: Entry[]
}
