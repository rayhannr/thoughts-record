'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: false, staleTime: Infinity } }
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-center"
        theme="system"
        toastOptions={{
          classNames: {
            toast: '!bg-surface !text-ink !border-rule !font-sans !text-sm !rounded-md !shadow-none',
            actionButton: '!bg-ink !text-paper !font-sans'
          }
        }}
      />
    </QueryClientProvider>
  )
}
