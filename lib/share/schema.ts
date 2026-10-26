import { z } from 'zod'
import type { Entry } from '@/lib/entries/schema'
import type { Gratitude } from '@/lib/gratitudes/schema'
import type { RootCause } from '@/lib/root-causes/schema'

export const MAX_EXPIRY_DAYS = 90

export const CreateShareLink = z
  .object({
    range_from: z.iso.datetime(),
    range_to: z.iso
      .datetime()
      .nullish()
      .transform(v => v ?? null),
    expires_in_days: z.number().int().min(1).max(MAX_EXPIRY_DAYS),
    include_root_causes: z.boolean().optional().default(false),
    include_gratitudes: z.boolean().optional().default(false)
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
  include_root_causes: boolean
  include_gratitudes: boolean
}

/** What a viewer of a link sees: the entries in its range. */
export type SharedView = {
  range_from: string
  range_to: string | null
  expires_at: string
  entries: Entry[]
  /** Empty unless the link's owner opted in. */
  root_causes: RootCause[]
  /** Empty unless the link's owner opted in; limited to the link's range. */
  gratitudes: Gratitude[]
}
