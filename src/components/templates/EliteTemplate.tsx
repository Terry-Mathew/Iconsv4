'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Badge
} from '@chakra-ui/react'

interface EliteTemplateProps {
  profile: {
    name: string
    tagline?: string
    bio?: {
      original?: string
      ai_polished?: string
    }
  }
}

export function EliteTemplate({ profile }: EliteTemplateProps) {
  const { name, tagline, bio } = profile
  const biography = bio?.ai_polished || bio?.original || ''

  return (
    <Box minH="100vh" bg="linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #CBD5E1 100%)">
      <Container maxW="6xl" py={20}>
        <VStack spacing={8} textAlign="center">
          <Badge
            variant="outline"
            fontSize="sm"
            px={4}
            py={2}
            borderRadius="full"
            bg="rgba(71, 85, 105, 0.15)"
            borderColor="#475569"
            color="#334155"
          >
            Elite Tier Profile - Commanding Excellence
          </Badge>

          <Heading
            as="h1"
            fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
            fontFamily="'Playfair Display', serif"
            fontWeight="500"
            lineHeight="1.1"
            color="#1E293B"
          >
            {name}
          </Heading>

          {tagline && (
            <Text
              fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
              fontFamily="'Lora', serif"
              fontWeight="400"
              maxW="4xl"
              lineHeight="1.5"
              color="#475569"
            >
              {tagline}
            </Text>
          )}

          <Text
            fontSize="lg"
            lineHeight="1.8"
            color="#334155"
            fontFamily="'Lora', serif"
            maxW="4xl"
          >
            {biography}
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}