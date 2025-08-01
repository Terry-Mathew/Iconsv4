'use client'

import { Box, Text, Alert, AlertIcon } from '@chakra-ui/react'
import { profileContentSchema, ProfileContentData } from '@/lib/validations/profile'

interface EliteProfileFormProps {
  initialData?: Partial<ProfileContentData>
  onChange?: (data: Partial<ProfileContentData>) => void
}

export function EliteProfileForm({ initialData, onChange }: EliteProfileFormProps) {
  return (
    <Box p={6}>
      <Alert status="info" mb={4}>
        <AlertIcon />
        <Text>
          Elite Profile Form is being refactored to match the new comprehensive schema.
          Please use the main Profile Builder for now.
        </Text>
      </Alert>
      <Text color="gray.600">
        This form will be updated to include all Elite tier features including:
        Leadership Highlights, Impact Metrics, Featured Press, and Advanced Media Gallery.
      </Text>
    </Box>
  )
}
