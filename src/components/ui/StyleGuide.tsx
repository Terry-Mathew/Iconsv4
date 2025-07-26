'use client'

import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Container,
  Divider,
  Button,
  Grid,
  GridItem,
  Badge,
  Code,
  SimpleGrid,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

export function StyleGuide() {
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
    <Container maxW="6xl" py={12}>
      <motion.div
        variants={staggerChildren}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <MotionBox variants={fadeInUp} mb={12} textAlign="center">
          <Heading size="4xl" mb={4} color="charcoal.900">
            ICONS HERALD
          </Heading>
          <Text fontSize="xl" color="charcoal.700" fontFamily="accent">
            Unified Style Guide
          </Text>
        </MotionBox>

        <VStack spacing={12} align="stretch">
          {/* Core Palette */}
          <MotionBox variants={fadeInUp}>
            <Heading size="lg" color="gold.600" mb={6}>Core Palette</Heading>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
              <VStack>
                <Box w={20} h={20} bg="gold.500" borderRadius="lg" />
                <VStack spacing={1}>
                  <Text fontWeight="bold" color="charcoal.900">Gold Primary</Text>
                  <Code fontSize="sm">#D4AF37</Code>
                  <Text fontSize="xs" color="charcoal.600">Luxury, Premium, CTAs</Text>
                </VStack>
              </VStack>
              
              <VStack>
                <Box w={20} h={20} bg="ivory.50" borderRadius="lg" border="2px solid" borderColor="charcoal.200" />
                <VStack spacing={1}>
                  <Text fontWeight="bold" color="charcoal.900">Ivory Background</Text>
                  <Code fontSize="sm">#FFFFF0</Code>
                  <Text fontSize="xs" color="charcoal.600">Clean, Elegant, Surfaces</Text>
                </VStack>
              </VStack>
              
              <VStack>
                <Box w={20} h={20} bg="charcoal.900" borderRadius="lg" />
                <VStack spacing={1}>
                  <Text fontWeight="bold" color="charcoal.900">Charcoal Text</Text>
                  <Code fontSize="sm">#1A1A1A</Code>
                  <Text fontSize="xs" color="charcoal.600">High Contrast, Readability</Text>
                </VStack>
              </VStack>
              
              <VStack>
                <Box w={20} h={20} bg="cream.500" borderRadius="lg" />
                <VStack spacing={1}>
                  <Text fontWeight="bold" color="charcoal.900">Cream Accent</Text>
                  <Code fontSize="sm">#F4E4BC</Code>
                  <Text fontSize="xs" color="charcoal.600">Warm, Subtle, Highlights</Text>
                </VStack>
              </VStack>
            </SimpleGrid>
          </MotionBox>

          <Divider borderColor="cream.300" />

          {/* Button System */}
          <MotionBox variants={fadeInUp}>
            <Heading size="lg" color="gold.600" mb={6}>Button System</Heading>
            <VStack spacing={6} align="start">
              <VStack align="start" spacing={3}>
                <HStack>
                  <Badge colorScheme="yellow" variant="solid">Primary</Badge>
                  <Text fontSize="sm" color="charcoal.600">Gold fill, hover scale</Text>
                </HStack>
                <HStack spacing={4}>
                  <Button variant="primary" size="sm">Small Primary</Button>
                  <Button variant="primary" size="md">Medium Primary</Button>
                  <Button variant="primary" size="lg">Large Primary</Button>
                  <Button variant="primary" size="xl">Extra Large</Button>
                </HStack>
              </VStack>
              
              <VStack align="start" spacing={3}>
                <HStack>
                  <Badge colorScheme="gray" variant="outline">Secondary</Badge>
                  <Text fontSize="sm" color="charcoal.600">Ivory outline, gold hover</Text>
                </HStack>
                <HStack spacing={4}>
                  <Button variant="secondary" size="sm">Small Secondary</Button>
                  <Button variant="secondary" size="md">Medium Secondary</Button>
                  <Button variant="secondary" size="lg">Large Secondary</Button>
                  <Button variant="secondary" size="xl">Extra Large</Button>
                </HStack>
              </VStack>
              
              <VStack align="start" spacing={3}>
                <HStack>
                  <Badge colorScheme="gray" variant="ghost">Ghost</Badge>
                  <Text fontSize="sm" color="charcoal.600">Subtle actions</Text>
                </HStack>
                <HStack spacing={4}>
                  <Button variant="ghost" size="sm">Small Ghost</Button>
                  <Button variant="ghost" size="md">Medium Ghost</Button>
                  <Button variant="ghost" size="lg">Large Ghost</Button>
                </HStack>
              </VStack>
            </VStack>
          </MotionBox>

          <Divider borderColor="cream.300" />

          {/* Grid System */}
          <MotionBox variants={fadeInUp}>
            <Heading size="lg" color="gold.600" mb={6}>12-Column Grid System</Heading>
            <VStack spacing={6} align="stretch">
              <Text color="charcoal.700">
                24px base spacing unit with responsive 12-column grid
              </Text>
              
              {/* Grid Demo */}
              <Box>
                <Text fontSize="sm" color="charcoal.600" mb={3}>Grid Columns (24px gaps)</Text>
                <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <GridItem key={i} bg="cream.200" p={2} borderRadius="md" textAlign="center">
                      <Text fontSize="xs" color="charcoal.700">{i + 1}</Text>
                    </GridItem>
                  ))}
                </Grid>
              </Box>
              
              {/* Layout Examples */}
              <Box>
                <Text fontSize="sm" color="charcoal.600" mb={3}>Layout Examples</Text>
                <VStack spacing={4}>
                  <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                    <GridItem colSpan={8} bg="gold.100" p={4} borderRadius="md">
                      <Text fontSize="sm" color="charcoal.800">Main Content (8 columns)</Text>
                    </GridItem>
                    <GridItem colSpan={4} bg="cream.200" p={4} borderRadius="md">
                      <Text fontSize="sm" color="charcoal.800">Sidebar (4 columns)</Text>
                    </GridItem>
                  </Grid>
                  
                  <Grid templateColumns="repeat(12, 1fr)" gap={6}>
                    <GridItem colSpan={4} bg="cream.200" p={4} borderRadius="md">
                      <Text fontSize="sm" color="charcoal.800">Card (4 columns)</Text>
                    </GridItem>
                    <GridItem colSpan={4} bg="cream.200" p={4} borderRadius="md">
                      <Text fontSize="sm" color="charcoal.800">Card (4 columns)</Text>
                    </GridItem>
                    <GridItem colSpan={4} bg="cream.200" p={4} borderRadius="md">
                      <Text fontSize="sm" color="charcoal.800">Card (4 columns)</Text>
                    </GridItem>
                  </Grid>
                </VStack>
              </Box>
            </VStack>
          </MotionBox>

          <Divider borderColor="cream.300" />

          {/* Spacing Scale */}
          <MotionBox variants={fadeInUp}>
            <Heading size="lg" color="gold.600" mb={6}>Spacing Scale</Heading>
            <VStack spacing={4} align="start">
              <Text color="charcoal.700">24px base unit with consistent scale</Text>
              <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4} w="full">
                <VStack>
                  <Box w="6px" h="6px" bg="gold.500" />
                  <Text fontSize="xs">xs: 6px</Text>
                </VStack>
                <VStack>
                  <Box w="12px" h="12px" bg="gold.500" />
                  <Text fontSize="xs">sm: 12px</Text>
                </VStack>
                <VStack>
                  <Box w="24px" h="24px" bg="gold.500" />
                  <Text fontSize="xs">md: 24px</Text>
                </VStack>
                <VStack>
                  <Box w="48px" h="48px" bg="gold.500" />
                  <Text fontSize="xs">lg: 48px</Text>
                </VStack>
                <VStack>
                  <Box w="96px" h="96px" bg="gold.500" />
                  <Text fontSize="xs">xl: 96px</Text>
                </VStack>
              </SimpleGrid>
            </VStack>
          </MotionBox>

          {/* Accessibility */}
          <MotionBox variants={fadeInUp}>
            <Heading size="lg" color="gold.600" mb={6}>Accessibility Standards</Heading>
            <VStack spacing={4} align="start">
              <HStack>
                <Badge colorScheme="green">✓ 7:1 Contrast</Badge>
                <Text fontSize="sm" color="charcoal.600">Charcoal text on ivory background</Text>
              </HStack>
              <HStack>
                <Badge colorScheme="green">✓ Touch Targets</Badge>
                <Text fontSize="sm" color="charcoal.600">Minimum 44px for interactive elements</Text>
              </HStack>
              <HStack>
                <Badge colorScheme="green">✓ Focus Indicators</Badge>
                <Text fontSize="sm" color="charcoal.600">Gold outline for keyboard navigation</Text>
              </HStack>
              <HStack>
                <Badge colorScheme="green">✓ Color Independence</Badge>
                <Text fontSize="sm" color="charcoal.600">Information not conveyed by color alone</Text>
              </HStack>
            </VStack>
          </MotionBox>
        </VStack>
      </motion.div>
    </Container>
  )
}
