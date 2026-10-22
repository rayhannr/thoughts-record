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
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-3 py-6 sm:px-4 sm:py-10">
      {view ? <SharedEntries view={view} /> : <p className="py-10 text-lg text-chrome-muted">tautan ini sudah tidak berlaku.</p>}
    </main>
  )
}
