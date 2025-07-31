'use client'

import { Box, Container, Heading, Text, VStack, HStack, Button, Badge, SimpleGrid } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Check, Crown } from 'lucide-react'

const MotionBox = motion.create(Box)

const pricingPlans = [
  {
    name: "Emerging",
    price: "₹3,000",
    period: "per year",
    description: "For emerging talents making their mark",
    features: ["4 content sections", "Basic profile template", "1-year visibility"],
    featured: false
  },
  {
    name: "Accomplished",
    price: "₹10,000",
    period: "per year",
    description: "For established leaders and innovators",
    features: ["6 content sections", "Enhanced template", "Priority placement", "Analytics"],
    featured: true
  },
  {
    name: "Distinguished",
    price: "₹15,000",
    period: "per year",
    description: "For distinguished professionals and thought leaders",
    features: ["8 content sections", "Premium template", "Featured placement", "Advanced analytics"],
    featured: false
  },
  {
    name: "Legacy",
    price: "₹20,000",
    period: "one-time",
    description: "For icons whose legacies endure forever",
    features: ["10 content sections", "Custom template", "Permanent archive", "Bespoke design"],
    featured: false
  }
]

export function PremiumPricing() {
  return (
    <Box
      py="section"
      bg="linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)"
      position="relative"
      className="dark-section"
    >
      <Container maxW="1400px" position="relative" zIndex={1}>
        <VStack spacing={20}>
          {/* Header - Dark Optimized */}
          <VStack spacing={6} textAlign="center" maxW="700px">
            <Box>
              <Text
                fontSize="sm"
                color="gold.500"
                fontWeight="700"
                letterSpacing="2px"
                textTransform="uppercase"
                mb={4}
                className="gold-accent"
              >
                Membership Tiers
              </Text>
              <Heading
                variant="dark-section"
                fontFamily="heading"
              >
                Investment in
                <Text
                  as="span"
                  display="block"
                  fontWeight="600"
                  color="white.50"
                  textShadow="0 2px 4px rgba(0, 0, 0, 0.3)"
                >
                  Your Legacy
                </Text>
              </Heading>

              {/* Elegant gold underline */}
              <Box
                w="140px"
                h="3px"
                bg="linear-gradient(90deg, #D4AF37 0%, rgba(212, 175, 55, 0.3) 100%)"
                mx="auto"
                mt={8}
                borderRadius="full"
                boxShadow="0 0 20px rgba(212, 175, 55, 0.3)"
              />
            </Box>

            <Text
              variant="dark-large"
            >
              Choose the tier that reflects your impact and aspirations.
              Each level offers increasing sophistication and permanence.
            </Text>
          </VStack>

          {/* Pricing Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
            {pricingPlans.map((plan, index) => (
              <MotionBox
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <PricingCard plan={plan} />
              </MotionBox>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}

interface PricingCardProps {
  plan: {
    name: string
    price: string
    period: string
    description: string
    features: string[]
    featured: boolean
  }
}

function PricingCard({ plan }: PricingCardProps) {
  return (
    <MotionBox
      bg="white.50"
      border="1px solid"
      borderColor={plan.featured ? "rgba(212, 175, 55, 0.3)" : "rgba(255, 255, 255, 0.1)"}
      borderRadius="24px"
      p={8}
      position="relative"
      overflow="hidden"
      boxShadow={plan.featured
        ? "0 30px 60px rgba(0, 0, 0, 0.3), 0 12px 24px rgba(0, 0, 0, 0.15), 0 0 60px rgba(212, 175, 55, 0.1)"
        : "0 25px 50px rgba(0, 0, 0, 0.25), 0 8px 16px rgba(0, 0, 0, 0.1), 0 0 40px rgba(255, 255, 255, 0.05)"
      }
      whileHover={{
        y: -12,
        boxShadow: plan.featured
          ? "0 40px 80px rgba(0, 0, 0, 0.4), 0 16px 32px rgba(0, 0, 0, 0.2), 0 0 80px rgba(212, 175, 55, 0.15)"
          : "0 35px 70px rgba(0, 0, 0, 0.3), 0 12px 24px rgba(0, 0, 0, 0.15), 0 0 60px rgba(255, 255, 255, 0.08)"
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      _before={plan.featured ? {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: 'linear-gradient(135deg, rgba(212, 175, 55, 0.03) 0%, transparent 100%)',
        borderRadius: '24px',
        pointerEvents: 'none',
      } : undefined}
    >
      {/* Featured Badge - Gold Accent */}
      {plan.featured && (
        <Badge
          position="absolute"
          top={-4}
          left="50%"
          transform="translateX(-50%)"
          bg="linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)"
          color="black.900"
          px={6}
          py={2}
          borderRadius="full"
          fontSize="sm"
          fontWeight="700"
          letterSpacing="1px"
          textTransform="uppercase"
          boxShadow="0 8px 32px rgba(212, 175, 55, 0.4), 0 0 20px rgba(212, 175, 55, 0.3)"
          border="1px solid"
          borderColor="rgba(212, 175, 55, 0.5)"
          className="gold-accent"
        >
          Most Popular
        </Badge>
      )}

      <VStack spacing={8} align="start" position="relative" zIndex={1}>
        {/* Header */}
        <VStack align="start" spacing={3}>
          <HStack>
            <Heading
              fontSize="2xl"
              color="black.900"
              fontWeight="600"
              letterSpacing="-0.01em"
            >
              {plan.name}
            </Heading>
            {plan.featured && <Crown size={24} color="#3B82F6" />}
          </HStack>
          <Text
            fontSize="sm"
            color="neutral.600"
            lineHeight="relaxed"
            fontWeight="400"
          >
            {plan.description}
          </Text>
        </VStack>

        {/* Price */}
        <VStack align="start" spacing={2}>
          <HStack align="baseline" spacing={2}>
            <Heading
              fontSize="4xl"
              color="black.900"
              fontWeight="700"
              letterSpacing="-0.02em"
            >
              {plan.price}
            </Heading>
            <Text
              fontSize="md"
              color="neutral.500"
              fontWeight="500"
            >
              {plan.period}
            </Text>
          </HStack>
        </VStack>

        {/* Features */}
        <VStack align="start" spacing={4} w="full">
          {plan.features.map((feature, index) => (
            <HStack key={index} spacing={4} align="start">
              <Box
                color="brand.500"
                bg="rgba(59, 130, 246, 0.1)"
                p={1}
                borderRadius="full"
                mt={0.5}
              >
                <Check size={14} />
              </Box>
              <Text
                fontSize="sm"
                color="neutral.700"
                lineHeight="relaxed"
                fontWeight="400"
              >
                {feature}
              </Text>
            </HStack>
          ))}
        </VStack>

        {/* CTA - Dark Optimized */}
        <Button
          w="full"
          size="lg"
          variant={plan.featured ? "dark-accent" : "primary"}
          py={6}
          h="auto"
          borderRadius="12px"
          minH="44px"
          fontWeight="600"
          fontSize="md"
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        >
          Get Started
        </Button>
      </VStack>
    </MotionBox>
  )
}
