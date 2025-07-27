'use client'

import { Box, Text, Alert, AlertIcon } from '@chakra-ui/react'
import { profileContentSchema, ProfileContentData } from '@/lib/validations/profile'

interface LegacyProfileFormProps {
  initialData?: Partial<ProfileContentData>
  onChange?: (data: Partial<ProfileContentData>) => void
}

export function LegacyProfileForm({ initialData, onChange }: LegacyProfileFormProps) {
  return (
    <Box p={6}>
      <Alert status="info" mb={4}>
        <AlertIcon />
        <Text>
          Legacy Profile Form is being refactored to match the new comprehensive schema.
          Please use the main Profile Builder for now.
        </Text>
      </Alert>
      <Text color="gray.600">
        This form will be updated to include all Legacy tier features including:
        Timeline Visualization, Tributes & Testimonials, Archival Documentation, and Premium Design Themes.
      </Text>
    </Box>
  )
}
