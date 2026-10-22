export default function AppLayout({ children }: LayoutProps<'/'>) {
  return <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-3 pb-8 sm:px-4">{children}</main>
}
