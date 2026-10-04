import type { Metadata, Viewport } from 'next'
import { Barlow_Condensed, Hanken_Grotesk, Roboto } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

// The user's writing: a plain humanist sans that reads easily at 18px in the dark.
const hanken = Hanken_Grotesk({
  variable: '--font-hanken',
  subsets: ['latin']
})

// Catalog labels and numerals: condensed, used only for short marks.
const barlow = Barlow_Condensed({
  variable: '--font-barlow',
  subsets: ['latin'],
  weight: ['500', '600', '700']
})

// Google's sign-in button is set in Roboto Medium by their branding rules.
const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: '500'
})

export const metadata: Metadata = {
  title: 'Thought Record',
  description: 'Catatan pikiran pribadi'
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f1efea' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0c0b' }
  ]
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="id" className={`${hanken.variable} ${barlow.variable} ${roboto.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
