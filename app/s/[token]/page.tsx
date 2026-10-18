import type { Metadata } from 'next'
import { SharedEntries } from '@/components/shared-entries'
import { getSharedView } from '@/lib/share/actions'
import { createAnonClient } from '@/lib/supabase/anon'

export const metadata: Metadata = {
  title: 'Thought Record',
  robots: { index: false, follow: false }
}

// Opened by someone with no account, so this reads no session and sets no cookies.
// An unknown, expired or revoked link all look the same.
export default async function SharedPage({ params }: PageProps<'/s/[token]'>) {
  const { token } = await params

  let view = null
  try {
    view = await getSharedView(createAnonClient(), token)
  } catch (e) {
    console.error('shared page failed:', e instanceof Error ? e.message : 'unknown')
  }

  return (
    <main className="mx-auto w-full max-w-[38rem] px-5 pt-6 pb-24 sm:px-6 sm:pt-10">
      {view ? <SharedEntries view={view} /> : <p className="py-10 text-sm text-ink-muted">tautan ini sudah tidak berlaku.</p>}
    </main>
  )
}
