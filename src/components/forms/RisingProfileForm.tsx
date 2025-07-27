'use client'

import { Box, Text, Alert, AlertIcon } from '@chakra-ui/react'
import { profileContentSchema, ProfileContentData } from '@/lib/validations/profile'

interface RisingProfileFormProps {
  initialData?: Partial<ProfileContentData>
  onChange?: (data: Partial<ProfileContentData>) => void
}

export function RisingProfileForm({ initialData, onChange }: RisingProfileFormProps) {
  return (
    <Box p={6}>
      <Alert status="info" mb={4}>
        <AlertIcon />
        <Text>
          Rising Profile Form is being refactored to match the new comprehensive schema.
          Please use the main Profile Builder for now.
        </Text>
      </Alert>
      <Text color="gray.600">
        This form will be updated to include all Rising tier features including:
        Key Milestones, Future Vision, Inspirations, and Enhanced Achievement Tracking.
      </Text>
    </Box>
  )
}
