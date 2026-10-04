import type { Metadata, Viewport } from "next";
import { Literata, Source_Sans_3 } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

// The user's writing is the display type: a screen serif built for long reading.
const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
});

// App chrome recedes: a humanist sans that stays legible at 13-14px.
const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thought Record",
  description: "Catatan pikiran pribadi",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef0f3" },
    { media: "(prefers-color-scheme: dark)", color: "#14181f" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${literata.variable} ${sourceSans.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
