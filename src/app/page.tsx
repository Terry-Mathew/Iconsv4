'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Box, Spinner, Center } from '@chakra-ui/react'

// Dynamic imports for better performance
const PremiumHero = dynamic(
  () => import('@/components/sections/PremiumHero').then(mod => ({ default: mod.PremiumHero })),
  {
    loading: () => (
      <Center h="100vh">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    ),
    ssr: false
  }
)

const PremiumCategories = dynamic(
  () => import('@/components/sections/PremiumCategories').then(mod => ({ default: mod.PremiumCategories })),
  {
    loading: () => (
      <Center h="400px">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    ),
    ssr: false
  }
)

const PremiumPricing = dynamic(
  () => import('@/components/sections/PremiumPricing').then(mod => ({ default: mod.PremiumPricing })),
  {
    loading: () => (
      <Center h="400px">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    ),
    ssr: false
  }
)

const PremiumAbout = dynamic(
  () => import('@/components/sections/PremiumAbout').then(mod => ({ default: mod.PremiumAbout })),
  {
    loading: () => (
      <Center h="400px">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    ),
    ssr: false
  }
)

const PremiumProcess = dynamic(
  () => import('@/components/sections/PremiumProcess').then(mod => ({ default: mod.PremiumProcess })),
  {
    loading: () => (
      <Center h="400px">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    ),
    ssr: false
  }
)

const PremiumFooter = dynamic(
  () => import('@/components/sections/PremiumFooter').then(mod => ({ default: mod.PremiumFooter })),
  {
    loading: () => (
      <Center h="200px">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    ),
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
