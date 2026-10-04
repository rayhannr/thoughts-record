export default function AppLayout({ children }: LayoutProps<'/'>) {
  return <main className="mx-auto w-full max-w-[38rem] px-4 pt-3 pb-24 sm:px-6 sm:pt-8">{children}</main>
}
