'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Box,
  Container,
  HStack,
  Text,
  Link as ChakraLink,
  Image
} from '@chakra-ui/react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const MotionBox = motion(Box)

interface ProfileFooterProps {
  tier: 'emerging' | 'accomplished' | 'distinguished' | 'legacy' | 'rising' | 'elite'
}

function ProfileFooterContent({ tier }: ProfileFooterProps) {
  const [isVisible, setIsVisible] = useState(false)
  const searchParams = useSearchParams()
  const isEmbedded = searchParams.get('embed') === 'true'
  
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 200], [0, 1])

  useEffect(() => {
    const handleScroll = () => {
      // Show footer after scrolling 200px
      setIsVisible(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Hide footer if embedded (for clean sharing)
  if (isEmbedded) {
    return null
  }

  // Tier-specific styling
  const tierStyles = {
    emerging: {
      bg: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
      borderColor: 'rgba(102, 126, 234, 0.2)',
      textColor: '#667eea',
      accentColor: '#764ba2'
    },
    accomplished: {
      bg: 'linear-gradient(135deg, rgba(79, 172, 254, 0.05) 0%, rgba(0, 242, 254, 0.05) 100%)',
      borderColor: 'rgba(79, 172, 254, 0.2)',
      textColor: '#4facfe',
      accentColor: '#00f2fe'
    },
    distinguished: {
      bg: 'linear-gradient(135deg, rgba(250, 112, 154, 0.05) 0%, rgba(254, 225, 64, 0.05) 100%)',
      borderColor: 'rgba(250, 112, 154, 0.2)',
      textColor: '#fa709a',
      accentColor: '#fee140'
    },
    legacy: {
      bg: 'linear-gradient(135deg, rgba(210, 153, 194, 0.05) 0%, rgba(254, 249, 215, 0.05) 100%)',
      borderColor: 'rgba(210, 153, 194, 0.2)',
      textColor: '#d299c2',
      accentColor: '#fef9d7'
    },
    // Backward compatibility
    rising: {
      bg: 'linear-gradient(135deg, rgba(79, 172, 254, 0.05) 0%, rgba(0, 242, 254, 0.05) 100%)',
      borderColor: 'rgba(79, 172, 254, 0.2)',
      textColor: '#4facfe',
      accentColor: '#00f2fe'
    },
    elite: {
      bg: 'linear-gradient(135deg, rgba(250, 112, 154, 0.05) 0%, rgba(254, 225, 64, 0.05) 100%)',
      borderColor: 'rgba(250, 112, 154, 0.2)',
      textColor: '#fa709a',
      accentColor: '#fee140'
    }
  }

  const currentStyle = tierStyles[tier]

  return (
    <MotionBox
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex={10}
      style={{ opacity }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : 100, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ 
        duration: 0.4, 
        ease: [0.4, 0, 0.2, 1] 
      }}
    >
      <Box
        bg={currentStyle.bg}
        borderTop="1px solid"
        borderColor={currentStyle.borderColor}
        backdropFilter="blur(10px)"
        py={3}
      >
        <Container maxW="6xl">
          <HStack justify="space-between" align="center">
            {/* Logo and Brand */}
            <HStack spacing={3}>
              <Image
                src="/icons-herald-logo.svg"
                alt="ICONS HERALD"
                height="24px"
                width="auto"
                fallback={
                  <Text
                    fontSize="lg"
                    fontFamily="'Playfair Display', serif"
                    fontWeight="600"
                    color={currentStyle.accentColor}
                  >
                    ICONS HERALD
                  </Text>
                }
              />
              <Text
                fontSize="sm"
                color={currentStyle.textColor}
                fontFamily="'Lora', serif"
                display={{ base: 'none', md: 'block' }}
              >
                Preserving Excellence for Eternity
              </Text>
            </HStack>

            {/* Navigation Link */}
            <ChakraLink
              as={Link}
              href="/"
              display="flex"
              alignItems="center"
              gap={2}
              fontSize="sm"
              color={currentStyle.textColor}
              fontFamily="'Lora', serif"
              fontWeight="500"
              _hover={{
                color: currentStyle.accentColor,
                textDecoration: 'none',
                transform: 'translateX(-2px)'
              }}
              transition="all 0.2s ease"
              aria-label="Return to ICONS HERALD homepage"
            >
              <ArrowLeft size={16} />
              <Text display={{ base: 'none', sm: 'block' }}>
                Back to ICONS HERALD
              </Text>
              <Text display={{ base: 'block', sm: 'none' }}>
                Home
              </Text>
            </ChakraLink>
          </HStack>
        </Container>
      </Box>
    </MotionBox>
  )
}

export function ProfileFooter({ tier }: ProfileFooterProps) {
  return (
    <Suspense fallback={null}>
      <ProfileFooterContent tier={tier} />
    </Suspense>
  )
}
