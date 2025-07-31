'use client'

import { Box, Container, Heading, Text, VStack, HStack, SimpleGrid } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Send, UserCheck, Edit3, Globe, ArrowRight } from 'lucide-react'

const MotionBox = motion.create(Box)

const steps = [
  {
    number: "01",
    icon: Send,
    title: "Request Invitation",
    description: "Submit your achievements and contributions for review by our editorial team. We evaluate impact, innovation, and lasting significance.",
    color: "rgba(59, 130, 246, 0.1)"
  },
  {
    number: "02", 
    icon: UserCheck,
    title: "Editorial Review",
    description: "Our curated selection process ensures only exceptional individuals join the archive. We maintain the highest standards of excellence.",
    color: "rgba(59, 130, 246, 0.15)"
  },
  {
    number: "03",
    icon: Edit3,
    title: "Profile Creation",
    description: "Work with our editorial team to craft your story. Professional writers and designers create a lasting digital monument to your legacy.",
    color: "rgba(59, 130, 246, 0.2)"
  },
  {
    number: "04",
    icon: Globe,
    title: "Digital Archive",
    description: "Your profile joins our permanent collection, preserved forever and accessible to future generations seeking inspiration and knowledge.",
    color: "rgba(59, 130, 246, 0.25)"
  }
]

export function PremiumProcess() {
  return (
    <Box
      py="section"
      bg="linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)"
      position="relative"
      className="dark-section"
    >
      <Container maxW="1400px" position="relative" zIndex={1}>
        <VStack spacing={20} align="center">
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
                How It Works
              </Text>
              <Heading
                variant="dark-section"
                fontFamily="heading"
              >
                Your Journey to
                <Text
                  as="span"
                  display="block"
                  fontWeight="600"
                  color="white.50"
                  textShadow="0 2px 4px rgba(0, 0, 0, 0.3)"
                >
                  Digital Immortality
                </Text>
              </Heading>

              {/* Elegant gold underline */}
              <Box
                w="160px"
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
              A carefully curated process that transforms your life's work
              into a lasting digital legacy worthy of your achievements
            </Text>
          </VStack>

          {/* Process Steps */}
          <SimpleGrid
            columns={{ base: 1, lg: 4 }}
            spacing={8}
            w="full"
            maxW="1200px"
          >
            {steps.map((step, index) => (
              <MotionBox
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
              >
                <ProcessStep step={step} isLast={index === steps.length - 1} />
              </MotionBox>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}

interface ProcessStepProps {
  step: {
    number: string
    icon: React.ComponentType<any>
    title: string
    description: string
    color: string
  }
  isLast: boolean
}

function ProcessStep({ step, isLast }: ProcessStepProps) {
  const IconComponent = step.icon

  return (
    <VStack spacing={6} align="center" textAlign="center" position="relative">
      {/* Connection Line - Gold */}
      {!isLast && (
        <Box
          position="absolute"
          top="60px"
          left="50%"
          transform="translateX(-50%)"
          w={{ base: "2px", lg: "calc(100% + 32px)" }}
          h={{ base: "60px", lg: "2px" }}
          bg="linear-gradient(90deg, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.1) 100%)"
          zIndex={0}
          display={{ base: "none", lg: "block" }}
          boxShadow="0 0 10px rgba(212, 175, 55, 0.2)"
        />
      )}

      {/* Step Number & Icon */}
      <VStack spacing={4} position="relative" zIndex={1}>
        <Box
          w="120px"
          h="120px"
          bg="white.50"
          borderRadius="24px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          border="1px solid"
          borderColor="rgba(212, 175, 55, 0.2)"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.15), 0 0 20px rgba(212, 175, 55, 0.1)"
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bg: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, transparent 100%)',
            borderRadius: '24px',
          }}
        >
          <VStack spacing={2}>
            <Text
              fontSize="sm"
              fontWeight="700"
              color="gold.600"
              letterSpacing="1px"
            >
              {step.number}
            </Text>
            <IconComponent size={32} color="#D4AF37" />
          </VStack>
        </Box>
      </VStack>

      {/* Content */}
      <VStack spacing={3} maxW="280px">
        <Heading
          fontSize="xl"
          color="white.50"
          fontWeight="600"
          lineHeight="heading"
          textShadow="0 1px 2px rgba(0, 0, 0, 0.3)"
        >
          {step.title}
        </Heading>
        <Text
          variant="dark-caption"
          lineHeight="relaxed"
        >
          {step.description}
        </Text>
      </VStack>
    </VStack>
  )
}
