import type { Metadata } from 'next'
import { Playfair_Display, Lato, Lora } from 'next/font/google'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from '@/lib/auth/auth-context'
import { Navbar } from '@/components/ui/Navbar'
import { PerformanceMonitor } from '@/components/dev/PerformanceMonitor'
// Removed SmoothScrollProvider - using native browser scrolling for better performance
import { theme } from '@/lib/chakra-theme'
import '@/styles/globals.css'

// ICONS HERALD Typography System
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'serif'],
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
  preload: true,
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
})

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-lora',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'serif'],
})

export const metadata: Metadata = {
  title: 'Icons Herald: Where Legacies Endure | Premium Digital Archive',
  description: 'An exclusive, invitation-only digital archive for world-class legacies. Transform your achievements into an editorial masterpiece with our tiered profile system.',
  keywords: ['premium legacy archive', 'digital profiles', 'executive profiles', 'professional legacy', 'invitation only platform', 'editorial grade profiles'],
  authors: [{ name: 'Icons Herald' }],
  creator: 'Icons Herald',
  publisher: 'Icons Herald',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/favicon.svg', sizes: '180x180', type: 'image/svg+xml' }
    ]
  },
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
    <html lang="en" className={`${playfair.variable} ${lato.variable} ${lora.variable}`}>
      <body className={lato.className}>
        <ChakraProvider theme={theme}>
          <AuthProvider>
            <Navbar />
            <main>
              {children}
            </main>
            <PerformanceMonitor />
          </AuthProvider>
        </ChakraProvider>
      </body>
    </html>
  )
}
