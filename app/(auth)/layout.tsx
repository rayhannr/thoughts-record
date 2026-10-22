export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-3 py-6 sm:px-4 sm:py-10">{children}</main>
}
