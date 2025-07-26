'use client'

import { useState } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  SimpleGrid
} from '@chakra-ui/react'
import { Crown, Star } from 'lucide-react'
import Link from 'next/link'
import { EntryModal } from '@/components/modals/EntryModal'
import { EnhancedCategoriesCarousel } from '@/components/landing/EnhancedCategoriesCarousel'

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <Box>
      {/* Hero Section */}
      <Container
        maxW="6xl"
        py={{ base: 12, md: 16, lg: 20 }}
        id="hero"
        data-parallax="0.1"
        minH={{ base: "500px", md: "600px", lg: "700px" }}
        display="flex"
        alignItems="center"
      >
        <VStack spacing={{ base: 8, md: 10, lg: 12 }} textAlign="center" w="full">
          <VStack spacing={{ base: 6, md: 8 }}>
            <HStack spacing={{ base: 3, md: 4 }} flexWrap="wrap" justify="center">
              <Box fontSize={{ base: "2xl", md: "3xl" }} color="gold.500">
                👑
              </Box>
              <Heading
                as="h1"
                fontSize="clamp(2rem, 6vw, 4rem)"
                fontFamily="heading"
                color="charcoal.900"
                fontWeight="bold"
                letterSpacing="tight"
                lineHeight="shorter"
              >
                ICONS HERALD
              </Heading>
            </HStack>

            <Heading
              as="h2"
              fontSize="clamp(1.5rem, 4vw, 2.5rem)"
              fontFamily="heading"
              color="gold.500"
              fontWeight="semibold"
              letterSpacing="wide"
              fontStyle="italic"
              lineHeight="short"
              maxW="4xl"
            >
              An Exclusive Vault for Timeless Legacies
            </Heading>

            <Text
              fontSize="clamp(1.125rem, 2.5vw, 1.5rem)"
              color="charcoal.700"
              fontFamily="accent"
              maxW="5xl"
              lineHeight="tall"
              fontWeight="normal"
              fontStyle="italic"
            >
              Where extraordinary lives are etched in gold.
            </Text>

            <Text
              fontSize="clamp(1rem, 2vw, 1.25rem)"
              color="charcoal.600"
              fontFamily="body"
              maxW="4xl"
              lineHeight="tall"
              fontWeight="light"
            >
              Discover a digital sanctuary for the world's icons—invitation only, AI-curated, eternally preserved.
            </Text>
          </VStack>

          {/* Hero CTAs */}
          <HStack spacing={{ base: 4, md: 6 }} flexWrap="wrap" justify="center">
            <Button
              size="xl"
              variant="primary"
              onClick={() => setIsModalOpen(true)}
            >
              Begin Your Journey
            </Button>
            <Button
              size="xl"
              variant="secondary"
              as="a"
              href="#process"
            >
              Unveil the Process
            </Button>
          </HStack>

          <Text
            fontSize="clamp(0.875rem, 1.5vw, 1rem)"
            color="charcoal.500"
            fontStyle="italic"
            fontFamily="accent"
            letterSpacing="wide"
            lineHeight="base"
          >
            No clamor. No crowds. Simply your legend, artfully enshrined.
          </Text>
        </VStack>
      </Container>

      {/* About Section */}
      <Box
        bg="cream.50"
        py={{ base: 8, md: 12, lg: 20 }}
        id="about"
        data-parallax="0.2"
        minH={{ base: "300px", md: "400px" }}
      >
        <Container maxW="4xl">
          <VStack spacing={{ base: 6, md: 8 }} textAlign="center">
            <Heading
              as="h2"
              fontSize="clamp(1.75rem, 4vw, 2.5rem)"
              fontFamily="heading"
              color="charcoal.900"
              fontWeight="bold"
              lineHeight="short"
            >
              Custodians of Eternity
            </Heading>
            <Text
              fontSize="clamp(1rem, 2vw, 1.25rem)"
              color="charcoal.700"
              fontFamily="body"
              lineHeight="tall"
              maxW="3xl"
            >
              In a world of fleeting moments, ICONS HERALD stands as a beacon of permanence.
              We blend artificial intelligence with human curation to weave your achievements
              into an editorial masterpiece—a living testament to your impact.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Enhanced Categories Carousel Section */}
      <EnhancedCategoriesCarousel />

      {/* Process Section */}
      <Box
        bg="cream.50"
        py={{ base: 8, md: 12, lg: 20 }}
        id="process"
        data-parallax="0.15"
        minH={{ base: "400px", md: "500px" }}
      >
        <Container maxW="5xl">
          <VStack spacing={{ base: 8, md: 10, lg: 12 }}>
            <VStack spacing={{ base: 4, md: 6 }} textAlign="center">
              <Heading
                as="h2"
                fontSize="clamp(1.75rem, 4vw, 2.5rem)"
                fontFamily="heading"
                color="charcoal.900"
                fontWeight="bold"
                lineHeight="short"
              >
                The Journey
              </Heading>
            </VStack>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 4 }}
              spacing={{ base: 6, md: 8 }}
              minChildWidth={{ base: "250px", md: "200px" }}
            >
              {[
                {
                  title: "Invitation",
                  description: "Whisper your story through our discreet portal—our AI begins the alchemy."
                },
                {
                  title: "Curation",
                  description: "Expert eyes and intelligent refinement transform raw details into polished narrative."
                },
                {
                  title: "Elevation",
                  description: "Choose your realm: Rising for emergence, Elite for command, Legacy for immortality."
                },
                {
                  title: "Eternal Presence",
                  description: "Your archive awakens—update at will, preserved for generations."
                }
              ].map((step, index) => (
                <VStack
                  key={index}
                  spacing={{ base: 3, md: 4 }}
                  textAlign="center"
                  minH="200px"
                  p={{ base: 4, md: 6 }}
                >
                  <Box
                    w={{ base: 12, md: 16 }}
                    h={{ base: 12, md: 16 }}
                    bg="gold.500"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text
                      color="white"
                      fontWeight="bold"
                      fontSize={{ base: "lg", md: "xl" }}
                    >
                      {index + 1}
                    </Text>
                  </Box>
                  <Heading
                    fontSize="clamp(1.125rem, 2.5vw, 1.5rem)"
                    color="charcoal.900"
                    fontFamily="heading"
                    lineHeight="short"
                  >
                    {step.title}
                  </Heading>
                  <Text
                    fontSize="clamp(0.875rem, 1.5vw, 1rem)"
                    color="charcoal.700"
                    lineHeight="tall"
                  >
                    {step.description}
                  </Text>
                </VStack>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Tiers Section */}
      <Container
        maxW="6xl"
        py={{ base: 8, md: 12, lg: 20 }}
        id="tiers"
        data-parallax="0.25"
        minH={{ base: "600px", md: "700px" }}
      >
        <VStack spacing={{ base: 8, md: 10, lg: 12 }}>
          <VStack spacing={{ base: 4, md: 6 }} textAlign="center">
            <Heading
              as="h2"
              fontSize="clamp(1.75rem, 4vw, 2.5rem)"
              fontFamily="heading"
              color="charcoal.900"
              fontWeight="bold"
              lineHeight="short"
            >
              Realms of Recognition
            </Heading>
          </VStack>

          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={{ base: 6, md: 8 }}
            minChildWidth={{ base: "280px", md: "300px" }}
          >
            {[
              {
                tier: "Rising",
                price: "₹3,000/year",
                description: "Emerge with AI narrative and essential showcase",
                features: ["AI-curated profile", "Essential gallery", "Annual updates", "Rising tier badge"]
              },
              {
                tier: "Elite",
                price: "₹10,000/year",
                description: "Command attention with expanded gallery and prominence",
                features: ["Premium curation", "Expanded gallery", "Priority placement", "Elite tier badge", "Quarterly updates"]
              },
              {
                tier: "Legacy",
                price: "₹20,000 one-time",
                description: "Achieve immortality with timeless design and perpetual access",
                features: ["Lifetime access", "Timeless design", "Perpetual updates", "Legacy tier badge", "Premium support"]
              }
            ].map((tier, index) => (
              <Box
                key={index}
                p={8}
                bg={tier.tier === "Elite" ? "gold.50" : "ivory.100"}
                borderRadius="2xl"
                border="2px solid"
                borderColor={tier.tier === "Elite" ? "gold.500" : "cream.300"}
                position="relative"
                _hover={{
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 40px rgba(212, 175, 55, 0.2)"
                }}
                transition="all 0.3s ease"
              >
                {tier.tier === "Elite" && (
                  <Box
                    position="absolute"
                    top="-12px"
                    left="50%"
                    transform="translateX(-50%)"
                    bg="gold.500"
                    color="white"
                    px={4}
                    py={1}
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight="bold"
                  >
                    POPULAR
                  </Box>
                )}
                <VStack spacing={6} textAlign="center">
                  <VStack spacing={2}>
                    <Heading size="xl" color="charcoal.900" fontFamily="heading">
                      {tier.tier}
                    </Heading>
                    <Text fontSize="2xl" fontWeight="bold" color="gold.500">
                      {tier.price}
                    </Text>
                    <Text fontSize="md" color="charcoal.600" fontStyle="italic">
                      {tier.description}
                    </Text>
                  </VStack>

                  <VStack spacing={3} align="start" w="full">
                    {tier.features.map((feature, featureIndex) => (
                      <HStack key={featureIndex} spacing={3}>
                        <Star size={16} color="#D4AF37" />
                        <Text fontSize="sm" color="charcoal.700">
                          {feature}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>

                  <Button
                    variant={tier.tier === "Elite" ? "primary" : "secondary"}
                    size="lg"
                    w="full"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Choose {tier.tier}
                  </Button>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>

          <Text
            fontSize="lg"
            color="charcoal.600"
            fontFamily="accent"
            fontStyle="italic"
            textAlign="center"
            maxW="3xl"
          >
            Each realm offers bespoke curation, dedicated presence, and effortless evolution.
          </Text>
        </VStack>
      </Container>

      {/* Final CTA Section */}
      <Box
        bg="charcoal.900"
        py={{ base: 8, md: 12, lg: 20 }}
        id="nominate"
        data-parallax="0.1"
        minH={{ base: "300px", md: "400px" }}
      >
        <Container maxW="4xl">
          <VStack spacing={{ base: 6, md: 8 }} textAlign="center">
            <Heading
              as="h2"
              size="3xl"
              fontFamily="heading"
              color="gold.500"
              fontWeight="bold"
            >
              Enter the Vault
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color="ivory.50"
              fontFamily="accent"
              fontStyle="italic"
            >
              Dare to be remembered? Share your essence below.
            </Text>
            <Button
              size="xl"
              variant="primary"
              onClick={() => setIsModalOpen(true)}
            >
              Begin Your Journey
            </Button>
            <Text
              fontSize="sm"
              color="cream.500"
              fontFamily="accent"
              fontStyle="italic"
            >
              No clamor. No crowds. Simply your legend, artfully enshrined.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Entry Modal */}
      <EntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  )
}