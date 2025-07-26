import type { Metadata } from 'next'
import { Inter, Playfair_Display, Lato } from 'next/font/google'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from '@/lib/auth/auth-context'
import { Navbar } from '@/components/ui/Navbar'
import { LenisProvider } from '@/components/providers/LenisProvider'
import { BackToTop } from '@/components/ui/BackToTop'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair'
})
const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato'
})

export const metadata: Metadata = {
  title: 'Icons Herald: Where Legacies Endure | Premium Digital Archive',
  description: 'An exclusive, invitation-only digital archive for world-class legacies. Transform your achievements into an editorial masterpiece with our tiered profile system.',
  keywords: ['premium legacy archive', 'digital profiles', 'executive profiles', 'professional legacy', 'invitation only platform', 'editorial grade profiles'],
  authors: [{ name: 'Icons Herald' }],
  creator: 'Icons Herald',
  publisher: 'Icons Herald',
  openGraph: {
    title: 'Icons Herald: Where Legacies Endure',
    description: 'Claim your permanent place among the extraordinary. Our invitation-only platform transforms achievements into editorial masterpieces.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Icons Herald',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Icons Herald - Premium Digital Archive',
    description: 'An invitation-only digital archive for editorial-grade profiles',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.variable} ${lato.variable}`}>
        <ChakraProvider>
          <AuthProvider>
            <LenisProvider>
              <Navbar />
              {children}
              <BackToTop />
            </LenisProvider>
          </AuthProvider>
        </ChakraProvider>
      </body>
    </html>
  )
}
