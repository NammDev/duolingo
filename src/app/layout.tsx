import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'

import './globals.css'

const font = Nunito({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#22C55E',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={font.className}>
        {/* <Toaster theme='light' richColors closeButton />
          <ExitModal />
          <HeartsModal />
          <PracticeModal /> */}
        {children}
      </body>
    </html>
  )
}
