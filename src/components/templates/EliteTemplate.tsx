'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Grid,
  GridItem,
  Card,
  CardBody
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
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #0F172A 0%, #1E293B 25%, #334155 50%, #475569 75%, #64748B 100%)"
      position="relative"
    >
      {/* Professional grid overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.1}
        backgroundImage="linear-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.3) 1px, transparent 1px)"
        backgroundSize="60px 60px"
      />

      <Container maxW="7xl" py={20} position="relative" zIndex={1}>
        <Grid templateColumns={{ base: "1fr", lg: "1fr 2fr" }} gap={12} alignItems="start">
          {/* Left Column - Profile Header */}
          <GridItem>
            <VStack spacing={8} align="start">
              <Badge
                variant="solid"
                fontSize="sm"
                px={5}
                py={2}
                borderRadius="md"
                bg="linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)"
                color="white"
                fontFamily="'Lora', serif"
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="1px"
                boxShadow="0 4px 20px rgba(99, 102, 241, 0.4)"
              >
                ⚡ Elite Tier - Commanding Excellence
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
          </GridItem>
        </Grid>
      </Container>
    </Box>
  )
}