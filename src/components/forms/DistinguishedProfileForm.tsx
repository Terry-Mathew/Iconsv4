'use client'

import { Box, Text, Alert, AlertIcon } from '@chakra-ui/react'
import { profileContentSchema, ProfileContentData } from '@/lib/validations/profile'

interface DistinguishedProfileFormProps {
  initialData?: Partial<ProfileContentData>
  onChange?: (data: Partial<ProfileContentData>) => void
}

export function DistinguishedProfileForm({ initialData, onChange }: DistinguishedProfileFormProps) {
  return (
    <Box p={6}>
      <Alert status="info" mb={4}>
        <AlertIcon />
        <Text>
          Distinguished Profile Form is being refactored to match the new comprehensive schema.
          Please use the main Profile Builder for now.
        </Text>
      </Alert>
      <Text color="gray.600">
        This form will be updated to include all Distinguished tier features including:
        Publications showcase, Advanced impact metrics, Premium templates, and White-glove service.
      </Text>
    </Box>
  )
}
