'use client'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  Button,
  SimpleGrid,
  List,
  ListItem,
  ListIcon,
  Heading,
  Flex,
  useToast,
  Divider
} from '@chakra-ui/react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Star,
  Crown,
  Trophy,
  Archive,
  ExternalLink
} from 'lucide-react'
import { ProfileTier } from '@/types/profile'
import { TEMPLATE_PREVIEW_DATA, TemplatePreviewData } from '@/data/templatePreviewData'
import { EmergingTemplate } from '@/components/templates/EmergingTemplate'
import { AccomplishedTemplate } from '@/components/templates/AccomplishedTemplate'
import { DistinguishedTemplate } from '@/components/templates/DistinguishedTemplate'
import { LegacyTemplate } from '@/components/templates/LegacyTemplate'

const MotionBox = motion.create(Box)

interface TemplatePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  tier: ProfileTier
}

const TIER_CONFIGS = {
  emerging: {
    name: 'Emerging',
    icon: Star,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    price: '₹2,500/year'
  },
  accomplished: {
    name: 'Accomplished',
    icon: Crown,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    price: '₹5,000/year'
  },
  distinguished: {
    name: 'Distinguished',
    icon: Trophy,
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    price: '₹12,000/year'
  },
  legacy: {
    name: 'Legacy Memorial',
    icon: Archive,
    gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    price: '₹50,000 lifetime'
  }
}

export function TemplatePreviewModal({ isOpen, onClose, tier }: TemplatePreviewModalProps) {
  const [currentTemplate, setCurrentTemplate] = useState(0)
  const toast = useToast()
  
  const previewData = TEMPLATE_PREVIEW_DATA[tier]
  const tierConfig = TIER_CONFIGS[tier]
  const Icon = tierConfig.icon

  const renderTemplate = (templateIndex: number) => {
    const props = { profile: previewData.mockProfile }
    
    switch (tier) {
      case 'emerging':
        return <EmergingTemplate {...props} />
      case 'accomplished':
        return <AccomplishedTemplate {...props} />
      case 'distinguished':
        return <DistinguishedTemplate {...props} />
      case 'legacy':
        return <LegacyTemplate {...props} />
      default:
        return <EmergingTemplate {...props} />
    }
  }

  const nextTemplate = () => {
    setCurrentTemplate((prev) => (prev + 1) % previewData.templateCount)
  }

  const prevTemplate = () => {
    setCurrentTemplate((prev) => (prev - 1 + previewData.templateCount) % previewData.templateCount)
  }

  const handleGetStarted = () => {
    toast({
      title: "Ready to Create Your Profile?",
      description: `Navigate to the profile builder to get started with the ${tierConfig.name} tier.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    })
    onClose()
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="full"
      motionPreset="slideInBottom"
    >
      <ModalOverlay 
        bg="blackAlpha.800" 
        backdropFilter="blur(10px)"
      />
      <ModalContent
        bg="transparent"
        boxShadow="none"
        m={0}
        borderRadius={0}
        maxH="100vh"
        overflow="hidden"
      >
        <ModalHeader
          bg="rgba(255, 255, 255, 0.1)"
          backdropFilter="blur(20px)"
          borderBottom="1px solid rgba(212, 175, 55, 0.3)"
          color="white"
          py={8}
          px={8}
        >
          <Flex justify="space-between" align="center">
            <HStack spacing={6}>
              <Box
                w="64px"
                h="64px"
                background="linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)"
                borderRadius="16px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="0 8px 32px rgba(212, 175, 55, 0.3)"
              >
                <Icon size={32} color="white" />
              </Box>
              <VStack align="start" spacing={2}>
                <Heading
                  size="xl"
                  color="white"
                  fontFamily="heading"
                  letterSpacing="tight"
                >
                  {tierConfig.name} Templates
                </Heading>
                <Text
                  fontSize="lg"
                  color="rgba(255, 255, 255, 0.8)"
                  fontWeight="500"
                >
                  {tierConfig.price} • {previewData.templateCount} template{previewData.templateCount > 1 ? 's' : ''} available
                </Text>
              </VStack>
            </HStack>

            {previewData.templateCount > 1 && (
              <HStack spacing={3}>
                <IconButton
                  aria-label="Previous template"
                  icon={<ChevronLeft />}
                  onClick={prevTemplate}
                  bg="rgba(212, 175, 55, 0.2)"
                  color="white"
                  border="1px solid rgba(212, 175, 55, 0.3)"
                  _hover={{
                    bg: "rgba(212, 175, 55, 0.3)",
                    borderColor: "rgba(212, 175, 55, 0.5)",
                    transform: "translateY(-1px)"
                  }}
                  size="lg"
                  borderRadius="12px"
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                />
                <Badge
                  bg="rgba(212, 175, 55, 0.2)"
                  color="white"
                  border="1px solid rgba(212, 175, 55, 0.3)"
                  px={4}
                  py={2}
                  borderRadius="12px"
                  fontSize="sm"
                  fontWeight="600"
                >
                  {currentTemplate + 1} of {previewData.templateCount}
                </Badge>
                <IconButton
                  aria-label="Next template"
                  icon={<ChevronRight />}
                  onClick={nextTemplate}
                  bg="rgba(212, 175, 55, 0.2)"
                  color="white"
                  border="1px solid rgba(212, 175, 55, 0.3)"
                  _hover={{
                    bg: "rgba(212, 175, 55, 0.3)",
                    borderColor: "rgba(212, 175, 55, 0.5)",
                    transform: "translateY(-1px)"
                  }}
                  size="lg"
                  borderRadius="12px"
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                />
              </HStack>
            )}
          </Flex>
        </ModalHeader>

        <ModalCloseButton
          color="white"
          size="lg"
          bg="rgba(212, 175, 55, 0.2)"
          border="1px solid rgba(212, 175, 55, 0.3)"
          borderRadius="12px"
          _hover={{
            bg: "rgba(212, 175, 55, 0.3)",
            borderColor: "rgba(212, 175, 55, 0.5)",
            transform: "translateY(-1px)"
          }}
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          top={6}
          right={6}
        />

        <ModalBody p={0} overflow="hidden">
          <Flex h="calc(100vh - 120px)">
            {/* Template Preview */}
            <Box flex="1" overflow="auto" position="relative">
              <AnimatePresence mode="wait">
                <MotionBox
                  key={currentTemplate}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  h="full"
                >
                  {renderTemplate(currentTemplate)}
                </MotionBox>
              </AnimatePresence>
            </Box>

            {/* Professional Features Sidebar */}
            <Box
              w="420px"
              bg="rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(20px)"
              borderLeft="1px solid rgba(212, 175, 55, 0.3)"
              p={8}
              overflow="auto"
            >
              <VStack spacing={8} align="stretch" h="full">
                {/* Tier Features Section */}
                <Box>
                  <HStack spacing={3} mb={6}>
                    <Box
                      w="32px"
                      h="32px"
                      bg="linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)"
                      borderRadius="8px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <CheckCircle size={18} color="white" />
                    </Box>
                    <Heading
                      size="lg"
                      color="white"
                      fontFamily="heading"
                      letterSpacing="tight"
                    >
                      ✨ Tier Features
                    </Heading>
                  </HStack>
                  <VStack spacing={4} align="stretch">
                    {previewData.features.map((feature, index) => (
                      <HStack key={index} spacing={4} align="start">
                        <Box
                          w="20px"
                          h="20px"
                          bg="rgba(34, 197, 94, 0.2)"
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          mt={0.5}
                          flexShrink={0}
                        >
                          <CheckCircle size={12} color="#22c55e" />
                        </Box>
                        <Text
                          color="white"
                          fontSize="sm"
                          lineHeight="relaxed"
                          fontWeight="400"
                        >
                          {feature}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>

                <Divider borderColor="rgba(212, 175, 55, 0.3)" />

                {/* Limitations Section */}
                <Box>
                  <HStack spacing={3} mb={6}>
                    <Box
                      w="32px"
                      h="32px"
                      bg="rgba(251, 146, 60, 0.2)"
                      borderRadius="8px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <XCircle size={18} color="#fb923c" />
                    </Box>
                    <Heading
                      size="lg"
                      color="white"
                      fontFamily="heading"
                      letterSpacing="tight"
                    >
                      ⚠️ Limitations
                    </Heading>
                  </HStack>
                  <VStack spacing={4} align="stretch">
                    {previewData.limitations.map((limitation, index) => (
                      <HStack key={index} spacing={4} align="start">
                        <Box
                          w="20px"
                          h="20px"
                          bg="rgba(251, 146, 60, 0.2)"
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          mt={0.5}
                          flexShrink={0}
                        >
                          <XCircle size={12} color="#fb923c" />
                        </Box>
                        <Text
                          color="rgba(255, 255, 255, 0.8)"
                          fontSize="sm"
                          lineHeight="relaxed"
                          fontWeight="400"
                        >
                          {limitation}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>

                <Divider borderColor="rgba(212, 175, 55, 0.3)" />

                {/* Call to Action */}
                <VStack spacing={6} mt="auto">
                  <Button
                    w="full"
                    size="lg"
                    bg="linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)"
                    color="black.900"
                    py={6}
                    h="auto"
                    borderRadius="16px"
                    fontWeight="600"
                    fontSize="md"
                    rightIcon={<ExternalLink size={18} />}
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 32px rgba(212, 175, 55, 0.4)"
                    }}
                    _active={{
                      transform: "translateY(0)"
                    }}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    onClick={handleGetStarted}
                  >
                    Get Started with {tierConfig.name}
                  </Button>

                  <Text
                    fontSize="xs"
                    color="rgba(255, 255, 255, 0.6)"
                    textAlign="center"
                    lineHeight="relaxed"
                    px={4}
                  >
                    This is a preview with sample data. Your actual profile will use your own content and photos.
                  </Text>
                </VStack>
              </VStack>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
