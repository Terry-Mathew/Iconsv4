'use client'

import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Container,
  Divider,
  Badge,
  Code,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion.create(Box)
const MotionText = motion.create(Text)

export function TypographyShowcase() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <Container maxW="4xl" py={16}>
      <motion.div
        variants={staggerChildren}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <MotionBox variants={fadeInUp} mb={12} textAlign="center">
          <Heading size="4xl" mb={4} color="brown.800">
            ICONS HERALD
          </Heading>
          <Text variant="accent" fontSize="xl" color="brown.600">
            Typography & Design System
          </Text>
        </MotionBox>

        <VStack spacing={12} align="stretch">
          {/* Playfair Display - Headlines */}
          <MotionBox variants={fadeInUp}>
            <HStack mb={4}>
              <Heading size="lg" color="gold.600">Playfair Display</Heading>
              <Badge colorScheme="gold" variant="subtle">Headlines</Badge>
            </HStack>
            <VStack align="start" spacing={4}>
              <Heading size="4xl" fontFamily="heading">
                Where Legacies Endure
              </Heading>
              <Heading size="3xl" fontFamily="heading" color="brown.700">
                Editorial Excellence
              </Heading>
              <Heading size="2xl" fontFamily="heading" variant="display">
                Premium Digital Archive
              </Heading>
              <Heading size="xl" fontFamily="heading">
                Invitation-Only Platform
              </Heading>
            </VStack>
            <Text fontSize="sm" color="brown.500" mt={2}>
              <Code>fontFamily: 'heading' | weights: 400, 600, 700</Code>
            </Text>
          </MotionBox>

          <Divider borderColor="gold.200" />

          {/* Lato - Body Text */}
          <MotionBox variants={fadeInUp}>
            <HStack mb={4}>
              <Heading size="lg" color="gold.600">Lato</Heading>
              <Badge colorScheme="blue" variant="subtle">Body Text</Badge>
            </HStack>
            <VStack align="start" spacing={4}>
              <Text fontSize="xl" fontWeight="light">
                An exclusive, invitation-only digital archive for world-class legacies. 
                Transform your achievements into an editorial masterpiece with our tiered profile system.
              </Text>
              <Text fontSize="lg">
                Our platform serves distinguished individuals who have shaped industries, 
                influenced cultures, and left indelible marks on society.
              </Text>
              <Text fontSize="md">
                Each profile undergoes rigorous editorial review to ensure the highest 
                standards of storytelling and presentation.
              </Text>
              <Text fontSize="sm" color="brown.600">
                Navigation, UI elements, and interface text utilize Lato for optimal readability 
                across all devices and screen sizes.
              </Text>
            </VStack>
            <Text fontSize="sm" color="brown.500" mt={2}>
              <Code>fontFamily: 'body' | weights: 300, 400, 700</Code>
            </Text>
          </MotionBox>

          <Divider borderColor="gold.200" />

          {/* Lora - Accents */}
          <MotionBox variants={fadeInUp}>
            <HStack mb={4}>
              <Heading size="lg" color="gold.600">Lora</Heading>
              <Badge colorScheme="purple" variant="subtle">Accents</Badge>
            </HStack>
            <VStack align="start" spacing={4}>
              <Text variant="quote" maxW="2xl">
                "The true measure of a legacy is not in its duration, 
                but in its depth of impact on the human experience."
              </Text>
              <Text variant="accent" fontSize="lg">
                Featured in The New York Times, Forbes, and Harvard Business Review
              </Text>
              <Text variant="caption">
                Editorial note: All profiles undergo a comprehensive review process 
                to ensure authenticity and editorial excellence.
              </Text>
              <Box p={4} bg="ivory.100" borderRadius="lg" borderLeft="4px solid" borderColor="gold.500">
                <Text fontFamily="accent" fontStyle="italic" color="brown.700">
                  "ICONS HERALD represents the pinnacle of digital legacy preservation, 
                  where each story is crafted with the precision of fine literature."
                </Text>
                <Text fontSize="sm" color="brown.500" mt={2} fontFamily="accent">
                  — Editorial Board
                </Text>
              </Box>
            </VStack>
            <Text fontSize="sm" color="brown.500" mt={2}>
              <Code>fontFamily: 'accent' | weights: 400, 500, 600</Code>
            </Text>
          </MotionBox>

          <Divider borderColor="gold.200" />

          {/* Typography Variants */}
          <MotionBox variants={fadeInUp}>
            <Heading size="lg" color="gold.600" mb={4}>Typography Variants</Heading>
            <VStack align="start" spacing={3}>
              <Heading variant="editorial" size="xl">
                Editorial Headline Style
              </Heading>
              <Heading variant="display" size="2xl">
                Display Headline Style
              </Heading>
              <Text variant="accent">
                Accent text for emphasis and editorial notes
              </Text>
              <Text variant="caption">
                Caption text for image descriptions and metadata
              </Text>
              <Text variant="quote">
                Quote styling for testimonials and featured content
              </Text>
            </VStack>
          </MotionBox>

          {/* Color Palette */}
          <MotionBox variants={fadeInUp}>
            <Heading size="lg" color="gold.600" mb={4}>Brand Colors</Heading>
            <HStack spacing={4} flexWrap="wrap">
              <VStack>
                <Box w={16} h={16} bg="gold.500" borderRadius="lg" />
                <Text fontSize="sm" fontWeight="medium">Gold Primary</Text>
                <Code fontSize="xs">#D4AF37</Code>
              </VStack>
              <VStack>
                <Box w={16} h={16} bg="brown.500" borderRadius="lg" />
                <Text fontSize="sm" fontWeight="medium">Brown Secondary</Text>
                <Code fontSize="xs">#8B7355</Code>
              </VStack>
              <VStack>
                <Box w={16} h={16} bg="ivory.100" borderRadius="lg" border="1px solid" borderColor="ivory.300" />
                <Text fontSize="sm" fontWeight="medium">Ivory Background</Text>
                <Code fontSize="xs">#FDFCF3</Code>
              </VStack>
            </HStack>
          </MotionBox>
        </VStack>
      </motion.div>
    </Container>
  )
}
