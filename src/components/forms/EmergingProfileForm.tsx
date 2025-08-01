'use client'

import { Box, Text, Alert, AlertIcon } from '@chakra-ui/react'
import { profileContentSchema, ProfileContentData } from '@/lib/validations/profile'

interface EmergingProfileFormProps {
  initialData?: Partial<ProfileContentData>
  onChange?: (data: Partial<ProfileContentData>) => void
}

export function EmergingProfileForm({ initialData, onChange }: EmergingProfileFormProps) {
  return (
    <Box p={6}>
      <Alert status="info" mb={4}>
        <AlertIcon />
        <Text>
          Emerging Profile Form is being refactored to match the new comprehensive schema.
          Please use the main Profile Builder for now.
        </Text>
      </Alert>
      <Text color="gray.600">
        This form will be updated to include all Emerging tier features including:
        Skills showcase, Basic achievements, and Professional highlights.
      </Text>
    </Box>
  )
}
