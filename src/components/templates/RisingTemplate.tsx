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
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #FFFEF7 0%, #FFF8E1 50%, #F4E4BC 100%)"
      position="relative"
      overflow="hidden"
    >
      {/* Energetic background pattern */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.05}
        backgroundImage="radial-gradient(circle at 25% 25%, #D4AF37 2px, transparent 2px), radial-gradient(circle at 75% 75%, #D4AF37 2px, transparent 2px)"
        backgroundSize="50px 50px"
        backgroundPosition="0 0, 25px 25px"
      />

      <Container maxW="6xl" py={20} position="relative" zIndex={1}>
        <VStack spacing={12} textAlign="center">
          <Badge
            variant="solid"
            fontSize="md"
            px={6}
            py={3}
            borderRadius="full"
            bg="linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)"
            color="white"
            fontFamily="'Lora', serif"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing="0.5px"
            boxShadow="0 4px 15px rgba(212, 175, 55, 0.3)"
          >
            🌟 Rising Tier - Ascending to Greatness
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