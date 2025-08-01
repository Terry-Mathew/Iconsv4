'use client'

import { Box, Container, Heading, Text, VStack, HStack, Button, SimpleGrid, useDisclosure } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TemplatePreviewModal } from '@/components/modals/TemplatePreviewModal'
import { ProfileTier } from '@/types/profile'

const MotionBox = motion.create(Box)

const pricingPlans = [
  {
    name: "Emerging",
    tier: "emerging" as ProfileTier,
    price: "₹3,000",
    period: "per year"
  },
  {
    name: "Accomplished",
    tier: "accomplished" as ProfileTier,
    price: "₹10,000",
    period: "per year"
  },
  {
    name: "Distinguished",
    tier: "distinguished" as ProfileTier,
    price: "₹15,000",
    period: "per year"
  },
  {
    name: "Legacy",
    tier: "legacy" as ProfileTier,
    price: "₹20,000",
    period: "one-time"
  }
]

export function PremiumPricing() {
  const router = useRouter()
  const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure()
  const [selectedTier, setSelectedTier] = useState<ProfileTier>('emerging')

  const handlePreviewTemplate = (tier: ProfileTier) => {
    setSelectedTier(tier)
    onPreviewOpen()
  }



  return (
    <Box
      py={18}
      bg="linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)"
      position="relative"
      className="dark-section"
    >
      <Container maxW="1400px" position="relative" zIndex={1}>
        <VStack spacing={14}>
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
                  Eternal Recognition
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
              Choose the tier that reflects your impact and aspirations. Each level offers increasing sophistication and prominence.
            </Text>
          </VStack>

          {/* Pricing Cards - Perfect Alignment */}
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 4 }}
            spacing={8}
            w="full"
            alignItems="stretch"
          >
            {pricingPlans.map((plan, index) => (
              <MotionBox
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                h="full"
              >
                <PricingCard
                  plan={plan}
                  onPreviewTemplate={() => handlePreviewTemplate(plan.tier)}
                />
              </MotionBox>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        isOpen={isPreviewOpen}
        onClose={onPreviewClose}
        tier={selectedTier}
      />
    </Box>
  )
}

interface PricingCardProps {
  plan: {
    name: string
    tier: ProfileTier
    price: string
    period: string
  }
  onPreviewTemplate: () => void
}

function PricingCard({ plan, onPreviewTemplate }: PricingCardProps) {
  return (
    <MotionBox
      bg="white.50"
      border="1px solid"
      borderColor="rgba(255, 255, 255, 0.1)"
      borderRadius="24px"
      p={8}
      position="relative"
      overflow="hidden"
      h="full"
      display="flex"
      flexDirection="column"
      boxShadow="0 25px 50px rgba(0, 0, 0, 0.25), 0 8px 16px rgba(0, 0, 0, 0.1), 0 0 40px rgba(255, 255, 255, 0.05)"
      whileHover={{
        y: -12,
        boxShadow: "0 35px 70px rgba(0, 0, 0, 0.3), 0 12px 24px rgba(0, 0, 0, 0.15), 0 0 60px rgba(255, 255, 255, 0.08)"
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >


      <VStack spacing={8} align="start" position="relative" zIndex={1} h="full" justify="space-between">
        <VStack spacing={6} align="start" w="full">
          {/* Header */}
          <VStack align="start" spacing={3}>
            <Heading
              fontSize="2xl"
              color="black.900"
              fontWeight="600"
              letterSpacing="-0.01em"
            >
              {plan.name}
            </Heading>
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

          {/* Elegant Spacing */}
          <Box flex="1" />
        </VStack>

        {/* Template Preview Action */}
        <Button
          w="full"
          size="lg"
          variant="outline"
          borderColor="rgba(212, 175, 55, 0.3)"
          color="black.900"
          bg="transparent"
          py={4}
          h="auto"
          borderRadius="12px"
          minH="48px"
          fontWeight="500"
          fontSize="sm"
          leftIcon={<Eye size={16} />}
          _hover={{
            bg: 'rgba(212, 175, 55, 0.05)',
            borderColor: 'rgba(212, 175, 55, 0.5)',
            transform: 'translateY(-1px)',
          }}
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          onClick={onPreviewTemplate}
        >
          View Template
        </Button>
      </VStack>
    </MotionBox>
  )
}
