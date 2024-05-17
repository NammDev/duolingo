import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'

import './globals.css'
import { siteConfig } from '@/config'

const font = Nunito({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#22C55E',
}

export const metadata: Metadata = siteConfig

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          logoImageUrl: '/favicon.ico',
        },
        variables: {
          colorPrimary: '#22C55E',
        },
      }}
    >
      <html lang='en'>
        <body className={font.className}>
          {/* <Toaster theme='light' richColors closeButton />
          <ExitModal />
          <HeartsModal />
          <PracticeModal /> */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
