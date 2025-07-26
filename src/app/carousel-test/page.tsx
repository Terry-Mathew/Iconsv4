'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack
} from '@chakra-ui/react'
import { Crown } from 'lucide-react'
import { CategoriesCarousel } from '@/components/ui/CategoriesCarousel'

export default function CarouselTestPage() {
  return (
    <Box minH="100vh">
      {/* Hero Section */}
      <Container maxW="6xl" py={20}>
        <VStack spacing={12} textAlign="center">
          {/* Header */}
          <VStack spacing={6}>
            <HStack spacing={3}>
              <Crown size={40} color="#D4AF37" />
              <Heading
                as="h1"
                fontSize="5xl"
                fontFamily="'Playfair Display', serif"
                color="#1A1A1A"
                fontWeight="400"
              >
                ICONS HERALD
              </Heading>
            </HStack>

            <Heading
              as="h2"
              fontSize="3xl"
              fontFamily="'Playfair Display', serif"
              color="#D4AF37"
              fontWeight="300"
            >
              Categories Carousel Test
            </Heading>

            <Text
              fontSize="xl"
              color="#666"
              fontFamily="'Lato', sans-serif"
              maxW="4xl"
              lineHeight="1.6"
            >
              Testing the luxury categories carousel with auto-scroll, drag functionality, and editorial descriptions.
            </Text>
          </VStack>
        </VStack>
      </Container>

      {/* Categories Carousel */}
      <CategoriesCarousel autoScroll={true} autoScrollInterval={4000} showArrows={false} />

      {/* Additional Content */}
      <Container maxW="6xl" py={12}>
        <VStack spacing={8} textAlign="center">
          <Text fontSize="lg" color="#666" fontFamily="'Lato', sans-serif">
            ✅ Carousel features implemented according to ICONS HERALD Rulebook
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}
