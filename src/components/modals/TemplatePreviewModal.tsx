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

const MotionBox = motion(Box)

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
          borderBottom="1px solid rgba(255, 255, 255, 0.2)"
          color="white"
          py={6}
        >
          <Flex justify="space-between" align="center">
            <HStack spacing={4}>
              <Box
                w="60px"
                h="60px"
                background={tierConfig.gradient}
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon size={28} color="white" />
              </Box>
              <VStack align="start" spacing={1}>
                <Heading size="lg" color="white">
                  {tierConfig.name} Templates
                </Heading>
                <Text fontSize="md" color="rgba(255, 255, 255, 0.8)">
                  {tierConfig.price} • {previewData.templateCount} template{previewData.templateCount > 1 ? 's' : ''} available
                </Text>
              </VStack>
            </HStack>
            
            {previewData.templateCount > 1 && (
              <HStack spacing={2}>
                <IconButton
                  aria-label="Previous template"
                  icon={<ChevronLeft />}
                  onClick={prevTemplate}
                  bg="rgba(255, 255, 255, 0.2)"
                  color="white"
                  _hover={{ bg: "rgba(255, 255, 255, 0.3)" }}
                  size="lg"
                />
                <Badge
                  bg="rgba(255, 255, 255, 0.2)"
                  color="white"
                  px={3}
                  py={1}
                  borderRadius="md"
                  fontSize="sm"
                >
                  {currentTemplate + 1} of {previewData.templateCount}
                </Badge>
                <IconButton
                  aria-label="Next template"
                  icon={<ChevronRight />}
                  onClick={nextTemplate}
                  bg="rgba(255, 255, 255, 0.2)"
                  color="white"
                  _hover={{ bg: "rgba(255, 255, 255, 0.3)" }}
                  size="lg"
                />
              </HStack>
            )}
          </Flex>
        </ModalHeader>

        <ModalCloseButton 
          color="white" 
          size="lg"
          bg="rgba(255, 255, 255, 0.2)"
          _hover={{ bg: "rgba(255, 255, 255, 0.3)" }}
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

            {/* Features Sidebar */}
            <Box
              w="400px"
              bg="rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(20px)"
              borderLeft="1px solid rgba(255, 255, 255, 0.2)"
              p={6}
              overflow="auto"
            >
              <VStack spacing={6} align="stretch">
                <Box>
                  <Heading size="md" color="white" mb={4}>
                    ✨ Tier Features
                  </Heading>
                  <List spacing={3}>
                    {previewData.features.map((feature, index) => (
                      <ListItem key={index} color="white" fontSize="sm">
                        <ListIcon as={CheckCircle} color="green.300" />
                        {feature}
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Divider borderColor="rgba(255, 255, 255, 0.2)" />

                <Box>
                  <Heading size="md" color="white" mb={4}>
                    ⚠️ Limitations
                  </Heading>
                  <List spacing={3}>
                    {previewData.limitations.map((limitation, index) => (
                      <ListItem key={index} color="rgba(255, 255, 255, 0.8)" fontSize="sm">
                        <ListIcon as={XCircle} color="orange.300" />
                        {limitation}
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Divider borderColor="rgba(255, 255, 255, 0.2)" />

                <VStack spacing={4}>
                  <Button
                    w="full"
                    size="lg"
                    background={tierConfig.gradient}
                    color="white"
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "lg"
                    }}
                    onClick={handleGetStarted}
                    rightIcon={<ExternalLink size={18} />}
                  >
                    Get Started with {tierConfig.name}
                  </Button>
                  
                  <Text
                    fontSize="xs"
                    color="rgba(255, 255, 255, 0.6)"
                    textAlign="center"
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
