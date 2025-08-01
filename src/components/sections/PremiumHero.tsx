'use client'

import { Box, Container, Heading, Text, Button, VStack, HStack, useDisclosure } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { RequestInvitationModal } from '../modals/RequestInvitationModal'

const MotionBox = motion.create(Box)

export function PremiumHero() {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box
      minH="100vh"
      position="relative"
      bg="linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)"
      overflow="hidden"
      className="dark-section"
    >
      {/* Sophisticated Dark Background Elements */}
      <MotionBox
        position="absolute"
        top="10%"
        right="-5%"
        w="50%"
        h="60%"
        bg="linear-gradient(135deg, rgba(212, 175, 55, 0.04) 0%, rgba(212, 175, 55, 0.02) 100%)"
        borderRadius="32px"
        transform="rotate(-8deg)"
        filter="blur(1px)"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      <MotionBox
        position="absolute"
        top="20%"
        left="-10%"
        w="40%"
        h="50%"
        bg="linear-gradient(45deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 100%)"
        borderRadius="40px"
        transform="rotate(12deg)"
        filter="blur(2px)"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
      />

      <MotionBox
        position="absolute"
        bottom="15%"
        right="10%"
        w="30%"
        h="40%"
        bg="linear-gradient(225deg, rgba(212, 175, 55, 0.03) 0%, transparent 100%)"
        borderRadius="50px"
        transform="rotate(-15deg)"
        filter="blur(3px)"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.5, ease: "easeOut", delay: 0.6 }}
      />

      <Container maxW="7xl" h="100vh" py="generous">
        <Box
          display="grid"
          gridTemplateColumns={{ base: "1fr", lg: "3fr 2fr" }}
          alignItems="center"
          h="full"
          gap={{ base: 8, lg: 24 }}
          px={{ base: 4, lg: 8 }}
        >
          {/* Content - Perfectly Centered */}
          <MotionBox
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            maxW="800px"
            mx={{ base: "auto", lg: 0 }}
          >
            <VStack align={{ base: "center", lg: "start" }} spacing={8} w="full" textAlign={{ base: "center", lg: "left" }}>
              {/* Premium Badge - Dark Optimized */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <HStack
                  bg="rgba(212, 175, 55, 0.15)"
                  px={6}
                  py={3}
                  borderRadius="full"
                  border="1px solid"
                  borderColor="rgba(212, 175, 55, 0.3)"
                  backdropFilter="blur(20px)"
                  boxShadow="0 4px 20px rgba(212, 175, 55, 0.1)"
                  className="gold-accent"
                >
                  <Sparkles size={18} color="#D4AF37" />
                  <Text
                    fontSize="sm"
                    color="gold.500"
                    fontWeight="700"
                    letterSpacing="1px"
                    textTransform="uppercase"
                  >
                    Invitation-Only Archive
                  </Text>
                </HStack>
              </MotionBox>

              {/* Headline - Dark Optimized */}
              <Box>
                <Heading
                  variant="dark-hero"
                  fontFamily="heading"
                >
                  Where Legends
                  <Text
                    as="span"
                    display="block"
                    fontWeight="600"
                    color="white.50"
                    textShadow="0 2px 4px rgba(0, 0, 0, 0.3)"
                  >
                    Live Forever
                  </Text>
                </Heading>

                {/* Elegant gold underline */}
                <Box
                  w="140px"
                  h="3px"
                  bg="linear-gradient(90deg, #D4AF37 0%, rgba(212, 175, 55, 0.3) 100%)"
                  mt={8}
                  borderRadius="full"
                  boxShadow="0 0 20px rgba(212, 175, 55, 0.3)"
                />
              </Box>

              {/* Subheading - Dark Optimized */}
              <Text
                variant="dark-large"
                maxW="600px"
              >
                An invitation-only sanctuary for history's most extraordinary minds.
                <Text as="span" display="block" mt={2} color="white.200">
                  Meticulously curated profiles of world-shaping individuals whose contributions transcend time.
                </Text>
                <Text as="span" color="gold.400" fontWeight="600" display="block" mt={3}>
                  By invitation only.
                </Text>
              </Text>

              {/* CTA Buttons - Perfectly Aligned */}
              <VStack spacing={4} align={{ base: "center", lg: "start" }} pt={8} w="full">
                <HStack
                  spacing={6}
                  flexWrap="wrap"
                  justify={{ base: "center", lg: "start" }}
                  w="full"
                >
                  <Button
                    variant="dark-primary"
                    size="lg"
                    px={10}
                    py={7}
                    h="auto"
                    fontSize="lg"
                    borderRadius="16px"
                    rightIcon={<ArrowRight size={20} />}
                    minH="44px"
                    minW="200px"
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    onClick={onOpen}
                    cursor="pointer"
                  >
                    Request Invitation
                  </Button>

                  <Button
                    variant="dark-secondary"
                    size="lg"
                    px={10}
                    py={7}
                    h="auto"
                    fontSize="lg"
                    borderRadius="16px"
                    minH="44px"
                    minW="180px"
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    onClick={() => router.push('/profiles')}
                    cursor="pointer"
                  >
                    Explore Icons
                  </Button>
                </HStack>
              </VStack>
            </VStack>
          </MotionBox>

          {/* Visual Element - Right Side */}
          <MotionBox
            position="relative"
            h="80vh"
            display={{ base: "none", lg: "block" }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            {/* Pure White Floating Cards - Museum Quality */}
            <MotionBox
              position="absolute"
              top="15%"
              left="5%"
              w="300px"
              h="380px"
              className="floating-card"
              transform="rotate(-6deg)"
              zIndex={1}
              initial={{ y: 30, opacity: 0, rotate: -10 }}
              animate={{
                y: [0, -10, 0],
                opacity: 1,
                rotate: -6
              }}
              transition={{
                duration: 1,
                delay: 0.8,
                ease: "easeOut",
                y: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            />

            <MotionBox
              position="absolute"
              top="25%"
              right="-5%"
              w="300px"
              h="380px"
              bg="white.50"
              borderRadius="24px"
              boxShadow="0 35px 70px rgba(0, 0, 0, 0.3), 0 12px 24px rgba(0, 0, 0, 0.15), 0 0 60px rgba(255, 255, 255, 0.08)"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.1)"
              transform="rotate(4deg)"
              zIndex={3}
              initial={{ y: 30, opacity: 0, rotate: 8 }}
              animate={{
                y: [0, 10, 0],
                opacity: 1,
                rotate: 4
              }}
              transition={{
                duration: 1,
                delay: 1,
                ease: "easeOut",
                y: {
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }
              }}
              _hover={{
                transform: 'rotate(4deg) translateY(-12px)',
                boxShadow: '0 45px 90px rgba(0, 0, 0, 0.4), 0 16px 32px rgba(0, 0, 0, 0.2), 0 0 80px rgba(255, 255, 255, 0.12)',
              }}
            />

            <MotionBox
              position="absolute"
              top="35%"
              left="15%"
              w="280px"
              h="360px"
              bg="white.50"
              borderRadius="20px"
              boxShadow="0 25px 50px rgba(0, 0, 0, 0.25), 0 8px 16px rgba(0, 0, 0, 0.1), 0 0 40px rgba(255, 255, 255, 0.05)"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.1)"
              transform="rotate(-2deg)"
              zIndex={2}
              initial={{ y: 40, opacity: 0, rotate: -4 }}
              animate={{
                y: [0, -8, 0],
                opacity: 1,
                rotate: -2
              }}
              transition={{
                duration: 1,
                delay: 1.2,
                ease: "easeOut",
                y: {
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }
              }}
              _hover={{
                transform: 'rotate(-2deg) translateY(-8px)',
                boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.15), 0 0 50px rgba(255, 255, 255, 0.08)',
              }}
            />
          </MotionBox>
        </Box>
      </Container>

      {/* Request Invitation Modal */}
      <RequestInvitationModal isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}
