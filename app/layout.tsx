import type { Metadata, Viewport } from 'next'
import { Patrick_Hand, Roboto } from 'next/font/google'
import localFont from 'next/font/local'
import { Providers } from './providers'
import './globals.css'

// The user's own hand: the writing, the numerals and the wordmark. Thin, so it is set large.
// Self-hosted, Basic Latin and Indonesian punctuation only (SIL OFL, from Google Fonts): the family
// ships hundreds of Korean slices that the Google loader tries to fetch and that stall the build.
const nanum = localFont({
  variable: '--font-nanum',
  src: './fonts/NanumPenScript-latin.woff2',
  weight: '400',
  display: 'swap'
})

// Prompts, buttons and labels: a plainer marker hand that stays legible small.
const patrick = Patrick_Hand({
  variable: '--font-patrick',
  subsets: ['latin'],
  weight: '400'
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
    { media: '(prefers-color-scheme: light)', color: '#262626' },
    { media: '(prefers-color-scheme: dark)', color: '#080808' }
  ]
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="id" className={`${nanum.variable} ${patrick.variable} ${roboto.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
