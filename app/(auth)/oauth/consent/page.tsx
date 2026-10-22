'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { Paper } from '@/components/book-page'
import { createClient } from '@/lib/supabase/client'

type Request = { authorizationId: string; clientName: string; email: string }

function Consent() {
  const authorizationId = useSearchParams().get('authorization_id')
  const [request, setRequest] = useState<Request | null>(null)
  const [failed, setFailed] = useState(!authorizationId)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!authorizationId) return
    const supabase = createClient()

    async function load(id: string) {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) {
        const back = `/oauth/consent?authorization_id=${encodeURIComponent(id)}`
        location.replace(`/login?next=${encodeURIComponent(back)}`)
        return
      }
      const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(id)
      if (error || !data) return setFailed(true)
      // Already consented: Supabase hands back the redirect straight away.
      if ('redirect_url' in data) return location.replace(data.redirect_url)
      setRequest({ authorizationId: id, clientName: data.client.name, email: data.user.email })
    }
    load(authorizationId)
  }, [authorizationId])

  async function decide(approve: boolean) {
    if (!request) return
    setPending(true)
    const oauth = createClient().auth.oauth
    const { data, error } = approve
      ? await oauth.approveAuthorization(request.authorizationId)
      : await oauth.denyAuthorization(request.authorizationId)
    if (error || !data) {
      setFailed(true)
      setPending(false)
      return
    }
    location.replace(data.redirect_url)
  }

  if (failed) {
    return (
      <Paper className="pt-16"><p role="alert" className="text-lg text-signal">
        permintaan akses ini tidak valid atau sudah kedaluwarsa. coba sambungkan lagi dari Claude.
      </p></Paper>
    )
  }
  if (!request) return null

  return (
    <Paper className="pt-16">
      <h1 className="font-write text-[40px] leading-9 text-ink">{request.clientName} ingin membaca dan menulis catatanmu.</h1>
      <p className="mt-4 text-lg text-ink-muted">
        masuk sebagai {request.email}. izin ini mencakup melihat, menambah, mengubah, dan menghapus catatan. kamu bisa mencabutnya kapan saja.
      </p>
      <div className="mt-10 flex gap-3">
        <button type="button" className="btn-signal" disabled={pending} onClick={() => decide(true)}>
          izinkan
        </button>
        <button type="button" className="btn-pen" disabled={pending} onClick={() => decide(false)}>
          tolak
        </button>
      </div>
    </Paper>
  )
}

export default function ConsentPage() {
  return (
    <Suspense>
      <Consent />
    </Suspense>
  )
}
