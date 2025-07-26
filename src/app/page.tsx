import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button
} from '@chakra-ui/react'
import { Crown } from 'lucide-react'
import Link from 'next/link'
import { CategoriesCarousel } from '@/components/ui/CategoriesCarousel'

export default function HomePage() {
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
              Where Legacies Endure
            </Heading>

            <Text
              fontSize="xl"
              color="#666"
              fontFamily="'Lato', sans-serif"
              maxW="4xl"
              lineHeight="1.6"
            >
              An exclusive, invitation-only digital archive for world-class legacies.
              Transform your achievements into an editorial masterpiece with our tiered profile system.
            </Text>
          </VStack>

          {/* Call to Action */}
          <VStack spacing={4}>
            <HStack spacing={6} flexWrap="wrap" justify="center">
              <Link href="/nominate">
                <Button
                  size="lg"
                  bg="#D4AF37"
                  color="white"
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="600"
                  _hover={{
                    bg: "#B8941F",
                    transform: "translateY(-2px)"
                  }}
                >
                  Nominate Yourself
                </Button>
              </Link>

              <Link href="/nominate">
                <Button
                  size="lg"
                  variant="outline"
                  borderColor="#D4AF37"
                  color="#D4AF37"
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="600"
                  _hover={{
                    bg: "#D4AF37",
                    color: "white"
                  }}
                >
                  Nominate an Icon
                </Button>
              </Link>
            </HStack>

            <Text
              fontSize="sm"
              color="#999"
              fontStyle="italic"
              fontFamily="'Lato', sans-serif"
            >
              By invitation only • Premium profiles • Editorial excellence
            </Text>
          </VStack>
        </VStack>
      </Container>

      {/* Categories Carousel */}
      <CategoriesCarousel autoScroll={true} autoScrollInterval={4000} showArrows={false} />

      {/* Additional Content */}
      <Container maxW="6xl" py={12}>
        <VStack spacing={8} textAlign="center">
          {/* Status */}
          <Box
            bg="green.50"
            border="1px solid"
            borderColor="green.200"
            borderRadius="md"
            p={4}
            maxW="md"
          >
            <Text color="green.700" fontWeight="600">
              ✅ Development server is running successfully!
            </Text>
            <Text color="green.600" fontSize="sm" mt={1}>
              All authentication and admin features have been implemented.
            </Text>
          </Box>

          {/* Navigation Links */}
          <VStack spacing={4}>
            <Text fontSize="lg" fontWeight="600" color="#1A1A1A">
              Quick Navigation:
            </Text>
            <HStack spacing={6} flexWrap="wrap" justify="center">
              <Link href="/about">
                <Text color="#D4AF37" _hover={{ textDecoration: 'underline' }}>
                  About
                </Text>
              </Link>
              <Link href="/process">
                <Text color="#D4AF37" _hover={{ textDecoration: 'underline' }}>
                  Process
                </Text>
              </Link>
              <Link href="/contact">
                <Text color="#D4AF37" _hover={{ textDecoration: 'underline' }}>
                  Contact
                </Text>
              </Link>
              <Link href="/auth/signin">
                <Text color="#D4AF37" _hover={{ textDecoration: 'underline' }}>
                  Admin Sign In
                </Text>
              </Link>
            </HStack>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
}