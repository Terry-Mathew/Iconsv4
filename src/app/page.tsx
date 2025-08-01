'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Box, Spinner, Center } from '@chakra-ui/react'

// Unified loading state for seamless experience
const UnifiedPageLoader = () => (
  <Center
    h="100vh"
    bg="linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)"
    position="fixed"
    top="0"
    left="0"
    right="0"
    zIndex="9999"
  >
    <Spinner size="xl" color="#D4AF37" thickness="4px" />
  </Center>
)

// Dynamic imports with unified loading experience
const PremiumHero = dynamic(
  () => import('@/components/sections/PremiumHero').then(mod => ({ default: mod.PremiumHero })),
  {
    loading: () => null, // No individual loading states
    ssr: false
  }
)

const PremiumCategories = dynamic(
  () => import('@/components/sections/PremiumCategories').then(mod => ({ default: mod.PremiumCategories })),
  {
    loading: () => null, // No individual loading states
    ssr: false
  }
)

const PremiumPricing = dynamic(
  () => import('@/components/sections/PremiumPricing').then(mod => ({ default: mod.PremiumPricing })),
  {
    loading: () => null, // No individual loading states
    ssr: false
  }
)

const PremiumAbout = dynamic(
  () => import('@/components/sections/PremiumAbout').then(mod => ({ default: mod.PremiumAbout })),
  {
    loading: () => null, // No individual loading states
    ssr: false
  }
)

const PremiumProcess = dynamic(
  () => import('@/components/sections/PremiumProcess').then(mod => ({ default: mod.PremiumProcess })),
  {
    loading: () => null, // No individual loading states
    ssr: false
  }
)

const PremiumFooter = dynamic(
  () => import('@/components/sections/PremiumFooter').then(mod => ({ default: mod.PremiumFooter })),
  {
    loading: () => null, // No individual loading states
    ssr: false
  }
)

const UnifiedSignInModal = dynamic(
  () => import('@/components/modals/UnifiedSignInModal').then(mod => ({ default: mod.UnifiedSignInModal })),
  {
    loading: () => null,
    ssr: false
  }
)

const TemplatePreviewModal = dynamic(
  () => import('@/components/modals/TemplatePreviewModal').then(mod => ({ default: mod.TemplatePreviewModal })),
  {
    loading: () => null,
    ssr: false
  }
)

export default function HomePage() {
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isTemplatePreviewOpen, setIsTemplatePreviewOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState<'emerging' | 'accomplished' | 'distinguished' | 'legacy'>('emerging')
  const [isLoading, setIsLoading] = useState(true)

  // Unified loading state management for seamless experience
  useEffect(() => {
    // Ensure all critical resources are loaded before showing content
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600) // Optimized timing for smooth navbar + content appearance

    // Preload critical fonts and assets
    const preloadCriticalAssets = () => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    }

    preloadCriticalAssets()
    return () => clearTimeout(timer)
  }, [])

  // Show unified loader while components initialize
  if (isLoading) {
    return <UnifiedPageLoader />
  }

  return (
    <>
      {/* Premium Hero Section */}
      <PremiumHero />

      {/* Premium About Section */}
      <PremiumAbout />

      {/* Premium Categories Section */}
      <PremiumCategories />

      {/* Premium Process Section */}
      <PremiumProcess />

      {/* Premium Pricing Section */}
      <PremiumPricing />

      {/* Premium Footer */}
      <PremiumFooter />

      {/* Modals */}
      <UnifiedSignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />

      <TemplatePreviewModal
        isOpen={isTemplatePreviewOpen}
        onClose={() => setIsTemplatePreviewOpen(false)}
        tier={selectedTier}
      />
    </>
  )
}
