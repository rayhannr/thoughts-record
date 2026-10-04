'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/auth-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: Infinity } }
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
      <Toaster
        position="bottom-center"
        theme="system"
        toastOptions={{
          classNames: {
            toast: '!bg-surface !text-ink !border-rule !font-sans !text-sm !rounded-sm !shadow-none',
            actionButton: '!bg-signal !text-signal-ink !font-sans !cursor-pointer'
          }
        }}
      />
    </QueryClientProvider>
  )
}
