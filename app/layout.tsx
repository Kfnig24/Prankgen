import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'

import { Toaster } from '@/components/ui/toaster'
import NextAuthProvider from '@/components/providers/next-auth'

const inter = Poppins({
  weight: ["400", "600"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: 'Prankgen',
  description: 'Prank your friends !',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
