'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Badge
} from '@chakra-ui/react'

interface RisingTemplateProps {
  profile: {
    name: string
    tagline?: string
    bio?: {
      original?: string
      ai_polished?: string
    }
  }
}

export function RisingTemplate({ profile }: RisingTemplateProps) {
  const { name, tagline, bio } = profile
  const biography = bio?.ai_polished || bio?.original || ''

  return (
    <Box minH="100vh" bg="linear-gradient(135deg, #FFFEF7 0%, #FFF8E1 50%, #F4E4BC 100%)">
      <Container maxW="6xl" py={20}>
        <VStack spacing={8} textAlign="center">
          <Badge
            variant="outline"
            fontSize="sm"
            px={4}
            py={2}
            borderRadius="full"
            bg="rgba(212, 175, 55, 0.15)"
            borderColor="#D4AF37"
            color="#B8860B"
          >
            Rising Tier Profile - Ascending to Greatness
          </Badge>

          <Heading
            as="h1"
            fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
            fontFamily="'Playfair Display', serif"
            fontWeight="400"
            lineHeight="1.1"
            color="#1A1A1A"
          >
            {name}
          </Heading>

          {tagline && (
            <Text
              fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
              fontFamily="'Lora', serif"
              fontWeight="300"
              maxW="4xl"
              lineHeight="1.5"
              color="#2D3748"
              fontStyle="italic"
            >
              {tagline}
            </Text>
          )}

          <Text
            fontSize="lg"
            lineHeight="1.8"
            color="#1A1A1A"
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