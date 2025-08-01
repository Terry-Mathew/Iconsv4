'use client'

import React from 'react'
import { Box, Container, Heading, Text, VStack, SimpleGrid } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { categories } from '@/lib/data/categories'

const MotionBox = motion.create(Box)

export function PremiumCategories() {
  return (
    <Box
      py={16}
      bg="linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)"
      position="relative"
      className="dark-section"
    >
      <Container maxW="1400px" position="relative" zIndex={1}>
        <VStack spacing={14} align="center">
          {/* Section Header - Dark Optimized */}
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
                Our Community
              </Text>
              <Heading
                variant="dark-section"
                fontFamily="heading"
              >
                Legends Across
                <Text
                  as="span"
                  display="block"
                  fontWeight="600"
                  color="white.50"
                  textShadow="0 2px 4px rgba(0, 0, 0, 0.3)"
                >
                  Every Domain
                </Text>
              </Heading>

              {/* Elegant gold underline */}
              <Box
                w="120px"
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
              From Nobel laureates to industry titans, from cultural revolutionaries to scientific pioneers—each icon is a masterpiece worthy of the legacy it represents.
            </Text>
          </VStack>

          {/* Perfectly Aligned Grid */}
          <Box w="full">
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
              spacing={8}
              alignItems="stretch"
            >
              {categories.map((category, index) => (
                <MotionBox
                  key={category.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.15,
                    ease: "easeOut"
                  }}
                  h="full"
                >
                  <CategoryCard category={category} />
                </MotionBox>
              ))}
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

interface CategoryCardProps {
  category: {
    id: string
    name: string
    description: string
    icon: React.ComponentType<any>
  }
}

function CategoryCard({ category }: CategoryCardProps) {
  const IconComponent = category.icon

  return (
    <MotionBox
      className="floating-card"
      p={8}
      cursor="pointer"
      role="group"
      position="relative"
      overflow="hidden"
      h="full"
      display="flex"
      flexDirection="column"
      whileHover={{
        y: -16,
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <VStack align="start" spacing={6} position="relative" zIndex={1}>
        {/* Icon - Premium Gold Accent */}
        <Box
          p={4}
          bg="linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.04) 100%)"
          borderRadius="16px"
          color="gold.600"
          border="1px solid"
          borderColor="rgba(212, 175, 55, 0.15)"
          _groupHover={{
            color: "gold.500",
            bg: "linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.08) 100%)",
            borderColor: "rgba(212, 175, 55, 0.3)",
            transform: "scale(1.08) rotate(3deg)",
            boxShadow: "0 0 20px rgba(212, 175, 55, 0.2)"
          }}
          transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
        >
          <IconComponent size={32} />
        </Box>

        {/* Content */}
        <VStack align="start" spacing={3}>
          <Heading
            fontSize="xl"
            color="black.900"
            fontWeight="600"
            lineHeight="heading"
            letterSpacing="-0.01em"
          >
            {category.name}
          </Heading>
          <Text
            fontSize="sm"
            color="gray.600"
            lineHeight="relaxed"
            noOfLines={3}
            fontWeight="400"
          >
            {category.description}
          </Text>
        </VStack>
      </VStack>
    </MotionBox>
  )
}
