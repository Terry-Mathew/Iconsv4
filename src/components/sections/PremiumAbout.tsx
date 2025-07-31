'use client'

import { Box, Container, Heading, Text, VStack, HStack, SimpleGrid } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Crown, FileText, Sparkles, Shield, Users, Award } from 'lucide-react'

const MotionBox = motion.create(Box)

const features = [
  {
    icon: Crown,
    title: "Curated Excellence",
    description: "Rigorous editorial standards ensure only exceptional achievements and contributions are featured in our archive."
  },
  {
    icon: FileText,
    title: "Editorial Quality",
    description: "Professional storytelling and design capture the essence of each legacy with unparalleled attention to detail."
  },
  {
    icon: Sparkles,
    title: "Timeless Design",
    description: "Beautiful, sophisticated profiles that honor achievements and create lasting digital monuments."
  },
  {
    icon: Shield,
    title: "Permanent Archive",
    description: "Your legacy is preserved forever with enterprise-grade security and redundancy across multiple data centers."
  },
  {
    icon: Users,
    title: "Exclusive Community",
    description: "Join a distinguished network of leaders, innovators, and visionaries from every field of human endeavor."
  },
  {
    icon: Award,
    title: "Recognition Platform",
    description: "Showcase achievements, awards, and contributions in a format worthy of your life's work and impact."
  }
]

export function PremiumAbout() {
  return (
    <Box
      py="section"
      bg="linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)"
      position="relative"
      className="dark-section"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bg: 'radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.02) 0%, transparent 50%)',
        pointerEvents: 'none',
      }}
    >
      <Container maxW="2xl">
        <VStack spacing="section" align="center">
          {/* Section Header - Dark Optimized */}
          <VStack spacing={6} textAlign="center" maxW="800px">
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
                About Icons Herald
              </Text>
              <Heading
                variant="dark-section"
                fontFamily="heading"
              >
                A Premium Digital
                <Text
                  as="span"
                  display="block"
                  fontWeight="600"
                  color="white.50"
                  textShadow="0 2px 4px rgba(0, 0, 0, 0.3)"
                >
                  Archive
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
              Transform achievements into lasting digital legacies. Our platform creates
              editorial-quality profiles for visionaries and leaders across every field,
              preserving their contributions for future generations.
            </Text>
          </VStack>

          {/* Features Grid */}
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={8}
            w="full"
            maxW="1200px"
          >
            {features.map((feature, index) => (
              <MotionBox
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
              >
                <FeatureCard feature={feature} />
              </MotionBox>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}

interface FeatureCardProps {
  feature: {
    icon: React.ComponentType<any>
    title: string
    description: string
  }
}

function FeatureCard({ feature }: FeatureCardProps) {
  const IconComponent = feature.icon

  return (
    <VStack
      align="center"
      spacing="element"
      textAlign="center"
      className="floating-card"
      _hover={{
        transform: 'translateY(-12px)',
      }}
      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      {/* Icon - Gold Accent */}
      <Box
        p={4}
        bg="linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)"
        borderRadius="16px"
        color="gold.500"
        border="1px solid"
        borderColor="rgba(212, 175, 55, 0.2)"
        className="gold-accent"
      >
        <IconComponent size={32} />
      </Box>

      {/* Content */}
      <VStack spacing={3}>
        <Heading
          fontSize="xl"
          color="black.900"
          fontWeight="600"
          lineHeight="heading"
        >
          {feature.title}
        </Heading>
        <Text
          fontSize="sm"
          color="gray.600"
          lineHeight="relaxed"
          fontWeight="400"
        >
          {feature.description}
        </Text>
      </VStack>
    </VStack>
  )
}
