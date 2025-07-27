'use client'

import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  useColorModeValue
} from '@chakra-ui/react'
import { Eye, Edit, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const MotionBox = motion(Box)

interface PreviewWatermarkProps {
  profileSlug: string
  tier: 'rising' | 'elite' | 'legacy'
  onEdit?: () => void
}

export function PreviewWatermark({ profileSlug, tier, onEdit }: PreviewWatermarkProps) {
  const bgColor = useColorModeValue('rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.9)')
  const borderColor = useColorModeValue('rgba(212, 175, 55, 0.8)', 'rgba(212, 175, 55, 0.9)')

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'rising':
        return 'blue'
      case 'elite':
        return 'purple'
      case 'legacy':
        return 'yellow'
      default:
        return 'gray'
    }
  }

  return (
    <MotionBox
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={9999}
      bg={bgColor}
      borderBottom="3px solid"
      borderColor={borderColor}
      backdropFilter="blur(10px)"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Box p={4}>
        <HStack justify="space-between" align="center" maxW="6xl" mx="auto">
          {/* Left side - Preview indicator */}
          <HStack spacing={4}>
            <HStack spacing={2}>
              <Eye size={20} color="#D4AF37" />
              <Text
                color="white"
                fontFamily="'Playfair Display', serif"
                fontSize="lg"
                fontWeight="600"
              >
                PREVIEW MODE
              </Text>
            </HStack>
            
            <Badge 
              colorScheme={getTierColor(tier)} 
              size="lg"
              px={3}
              py={1}
              borderRadius="full"
              textTransform="uppercase"
            >
              {tier} Tier
            </Badge>
          </HStack>

          {/* Center - Profile info */}
          <VStack spacing={1}>
            <Text
              color="white"
              fontSize="sm"
              fontFamily="'Lora', serif"
              opacity={0.9}
            >
              Profile Preview
            </Text>
            <Text
              color="#D4AF37"
              fontSize="xs"
              fontFamily="'Lora', serif"
              opacity={0.8}
            >
              /{profileSlug}
            </Text>
          </VStack>

          {/* Right side - Action buttons */}
          <HStack spacing={3}>
            <Button
              as={Link}
              href="/builder"
              size="sm"
              variant="outline"
              colorScheme="yellow"
              leftIcon={<Edit size={16} />}
              color="white"
              borderColor="#D4AF37"
              _hover={{
                bg: "#D4AF37",
                color: "black"
              }}
            >
              Edit
            </Button>
            
            <Button
              size="sm"
              bg="#D4AF37"
              color="black"
              leftIcon={<ExternalLink size={16} />}
              _hover={{
                bg: "#B8941F",
                transform: "translateY(-1px)"
              }}
              onClick={() => {
                // Open published profile in new tab (if published)
                window.open(`/profile/${profileSlug}`, '_blank')
              }}
            >
              View Live
            </Button>
          </HStack>
        </HStack>
      </Box>

      {/* Subtle animation indicator */}
      <MotionBox
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        height="2px"
        bg="linear-gradient(90deg, transparent, #D4AF37, transparent)"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </MotionBox>
  )
}

// Preview banner for bottom of page
export function PreviewBanner({ profileSlug, tier }: Omit<PreviewWatermarkProps, 'onEdit'>) {
  return (
    <MotionBox
      position="fixed"
      bottom={4}
      right={4}
      bg="rgba(0, 0, 0, 0.9)"
      borderRadius="lg"
      border="2px solid #D4AF37"
      p={3}
      backdropFilter="blur(10px)"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      zIndex={9998}
    >
      <VStack spacing={2} align="center">
        <HStack spacing={2}>
          <Eye size={16} color="#D4AF37" />
          <Text
            color="white"
            fontSize="sm"
            fontFamily="'Lora', serif"
            fontWeight="500"
          >
            Preview Mode
          </Text>
        </HStack>
        
        <Text
          color="#D4AF37"
          fontSize="xs"
          fontFamily="'Lora', serif"
          opacity={0.8}
          textAlign="center"
        >
          This is how your profile will appear when published
        </Text>
      </VStack>
    </MotionBox>
  )
}
