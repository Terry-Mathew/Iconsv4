'use client'

import { Box } from '@chakra-ui/react'
import { ProfileData, ThemeSettings, ProfileTier } from '@/types/profile'
import { RisingTemplate } from './templates/RisingTemplate'
import { EliteTemplate } from './templates/EliteTemplate'
import { LegacyTemplate } from './templates/LegacyTemplate'

interface ProfilePreviewProps {
  data: ProfileData
  theme: ThemeSettings
  tier: ProfileTier
}

export function ProfilePreview({ data, theme, tier }: ProfilePreviewProps) {
  const renderTemplate = () => {
    switch (tier) {
      case 'rising':
        return <RisingTemplate data={data as any} theme={theme} isPreview />
      case 'elite':
        return <EliteTemplate data={data as any} theme={theme} isPreview />
      case 'legacy':
        return <LegacyTemplate data={data as any} theme={theme} isPreview />
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
