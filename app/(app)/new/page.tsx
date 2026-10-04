'use client'

import { Composer } from '@/components/composer'
import { useIsClient } from '@/lib/use-is-client'

export default function NewEntryPage() {
  const isClient = useIsClient()
  return isClient ? <Composer cancelHref="/" /> : null
}
