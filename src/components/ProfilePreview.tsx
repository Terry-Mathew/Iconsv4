'use client'

import { Box } from '@chakra-ui/react'
import { ProfileData, ThemeSettings, ProfileTier } from '@/types/profile'
import { EmergingTemplate } from './templates/EmergingTemplate'
import { AccomplishedTemplate } from './templates/AccomplishedTemplate'
import { DistinguishedTemplate } from './templates/DistinguishedTemplate'
import { LegacyTemplate } from './templates/LegacyTemplate'

interface ProfilePreviewProps {
  data: ProfileData
  theme: ThemeSettings
  tier: ProfileTier
}

export function ProfilePreview({ data, theme, tier }: ProfilePreviewProps) {
  const renderTemplate = () => {
    switch (tier) {
      case 'emerging':
        return <EmergingTemplate profile={data as any} />
      case 'accomplished':
        return <AccomplishedTemplate profile={data as any} />
      case 'distinguished':
        return <DistinguishedTemplate profile={data as any} />
      case 'legacy':
        return <LegacyTemplate profile={data as any} />
      default:
        return (
          <Box p={8} textAlign="center">
            <p>Preview not available for this tier</p>
          </Box>
        )
    }
  }

  return (
    <Box w="full" minH="100vh" bg="gray.50">
      {renderTemplate()}
    </Box>
  )
}
