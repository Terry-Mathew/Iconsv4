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
      py={16}
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
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(229, 228, 226, 0.03) 1px, transparent 0)',
        backgroundSize: '20px 20px',
        pointerEvents: 'none',
      }}
    >
      <Container maxW="6xl">
        <VStack spacing={12} align="center">
          {/* Optimized Section Header */}
          <VStack spacing={4} textAlign="center" maxW="700px">
            <Box>
              <Text
                fontSize="xs"
                color="gold.500"
                fontWeight="600"
                letterSpacing="1.5px"
                textTransform="uppercase"
                mb={3}
                className="gold-accent"
              >
                About Icons Herald
              </Text>
              <Heading
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontFamily="heading"
                fontWeight="700"
                lineHeight="1.1"
                color="white"
                textShadow="0 2px 4px rgba(0, 0, 0, 0.3)"
              >
                A Digital
                <Text
                  as="span"
                  display="block"
                  fontWeight="600"
                  color="white.50"
                  textShadow="0 2px 4px rgba(0, 0, 0, 0.3)"
                >
                  Pantheon
                </Text>
              </Heading>

              {/* Refined gold underline */}
              <Box
                w="120px"
                h="2px"
                bg="linear-gradient(90deg, #D4AF37 0%, rgba(212, 175, 55, 0.3) 100%)"
                mx="auto"
                mt={6}
                borderRadius="full"
                boxShadow="0 0 16px rgba(212, 175, 55, 0.3)"
              />
            </Box>

            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="rgba(255, 255, 255, 0.8)"
              lineHeight="1.6"
              fontWeight="400"
              maxW="600px"
            >
              Not a directory. Not a database. A carefully curated sanctuary where the world's most influential figures are immortalized through editorial excellence and visual mastery.
            </Text>
          </VStack>

          {/* Optimized Features Grid */}
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={5}
            w="full"
            maxW="1200px"
          >
            {features.map((feature, index) => (
              <MotionBox
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
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
      spacing={4}
      textAlign="center"
      p={6}
      bg="rgba(255, 255, 255, 0.05)"
      backdropFilter="blur(10px)"
      borderRadius="20px"
      border="1px solid"
      borderColor="rgba(255, 255, 255, 0.1)"
      className="floating-card"
      _hover={{
        transform: 'translateY(-8px)',
        bg: "rgba(255, 255, 255, 0.08)",
        borderColor: "rgba(212, 175, 55, 0.3)",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(212, 175, 55, 0.1)"
      }}
      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      cursor="pointer"
      h="full"
    >
      {/* Enhanced Icon */}
      <Box
        p={3}
        bg="linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.08) 100%)"
        borderRadius="14px"
        color="gold.400"
        border="1px solid"
        borderColor="rgba(212, 175, 55, 0.25)"
        className="gold-accent"
        _groupHover={{
          bg: "linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)",
          borderColor: "rgba(212, 175, 55, 0.4)"
        }}
        transition="all 0.3s ease"
      >
        <IconComponent size={28} />
      </Box>

      {/* Optimized Content */}
      <VStack spacing={2} flex="1">
        <Heading
          fontSize="lg"
          color="white"
          fontWeight="600"
          lineHeight="1.3"
          fontFamily="heading"
        >
          {feature.title}
        </Heading>
        <Text
          fontSize="sm"
          color="rgba(255, 255, 255, 0.7)"
          lineHeight="1.5"
          fontWeight="400"
        >
          {feature.description}
        </Text>
      </VStack>
    </VStack>
  )
}
