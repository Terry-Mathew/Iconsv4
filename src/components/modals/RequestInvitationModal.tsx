'use client'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  Text,
  Box,
  useToast,
  FormErrorMessage
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Send, Sparkles } from 'lucide-react'
import { useState } from 'react'

const MotionBox = motion.create(Box)

interface RequestInvitationModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  fullName: string
  email: string
  professionalTitle: string
  achievementSummary: string
  portfolioUrl: string
  hearAboutUs: string
}

interface FormErrors {
  fullName?: string
  email?: string
  professionalTitle?: string
  achievementSummary?: string
  hearAboutUs?: string
}

export function RequestInvitationModal({ isOpen, onClose }: RequestInvitationModalProps) {
  const toast = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    professionalTitle: '',
    achievementSummary: '',
    portfolioUrl: '',
    hearAboutUs: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.professionalTitle.trim()) {
      newErrors.professionalTitle = 'Professional title is required'
    }

    if (!formData.achievementSummary.trim()) {
      newErrors.achievementSummary = 'Achievement summary is required'
    } else if (formData.achievementSummary.length > 150) {
      newErrors.achievementSummary = 'Achievement summary must be 150 words or less'
    }

    if (!formData.hearAboutUs) {
      newErrors.hearAboutUs = 'Please select how you heard about us'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setShowSuccess(true)
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
        onClose()
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          professionalTitle: '',
          achievementSummary: '',
          portfolioUrl: '',
          hearAboutUs: ''
        })
        setErrors({})
      }, 3000)

    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (showSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay
          bg="rgba(0, 0, 0, 0.8)"
          backdropFilter="blur(20px)"
        />
        <ModalContent
          bg="rgba(255, 255, 255, 0.1)"
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor="rgba(212, 175, 55, 0.3)"
          borderRadius="24px"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
          mx={4}
        >
          <ModalBody p={12}>
            <VStack spacing={6} align="center" textAlign="center">
              <MotionBox
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <Box
                  w={16}
                  h={16}
                  bg="linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Sparkles size={32} color="white" />
                </Box>
              </MotionBox>
              
              <VStack spacing={3}>
                <Text
                  fontSize="2xl"
                  fontWeight="600"
                  color="white"
                >
                  Request Received
                </Text>
                <Text
                  fontSize="md"
                  color="white.200"
                  maxW="300px"
                >
                  Your invitation request has been received. We'll review and respond within 48 hours.
                </Text>
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay
        bg="rgba(0, 0, 0, 0.8)"
        backdropFilter="blur(20px)"
      />
      <ModalContent
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(20px)"
        border="1px solid"
        borderColor="rgba(212, 175, 55, 0.3)"
        borderRadius="24px"
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
        mx={4}
        maxH="90vh"
        overflowY="auto"
      >
        <ModalHeader
          pb={2}
          pt={8}
          px={8}
          color="white"
          fontSize="2xl"
          fontWeight="600"
        >
          Request Your Invitation
        </ModalHeader>
        <ModalCloseButton
          color="white.200"
          _hover={{ color: "white" }}
          top={6}
          right={6}
        />
        
        <ModalBody px={8} pb={8}>
          <VStack spacing={6} align="stretch">
            <Text color="white.200" fontSize="sm">
              Join an exclusive community of extraordinary individuals. Tell us about your achievements and contributions.
            </Text>

            <VStack spacing={5} align="stretch">
              <FormControl isInvalid={!!errors.fullName}>
                <FormLabel color="white.200" fontSize="sm" fontWeight="500">
                  Full Name *
                </FormLabel>
                <Input
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  bg="rgba(255, 255, 255, 0.05)"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  color="white"
                  _placeholder={{ color: "white.300" }}
                  _hover={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
                  _focus={{ borderColor: "rgba(212, 175, 55, 0.5)", boxShadow: "0 0 0 1px rgba(212, 175, 55, 0.3)" }}
                  borderRadius="12px"
                  h="48px"
                />
                <FormErrorMessage>{errors.fullName}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel color="white.200" fontSize="sm" fontWeight="500">
                  Email Address *
                </FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  bg="rgba(255, 255, 255, 0.05)"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  color="white"
                  _placeholder={{ color: "white.300" }}
                  _hover={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
                  _focus={{ borderColor: "rgba(212, 175, 55, 0.5)", boxShadow: "0 0 0 1px rgba(212, 175, 55, 0.3)" }}
                  borderRadius="12px"
                  h="48px"
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.professionalTitle}>
                <FormLabel color="white.200" fontSize="sm" fontWeight="500">
                  Professional Title/Role *
                </FormLabel>
                <Input
                  value={formData.professionalTitle}
                  onChange={(e) => handleInputChange('professionalTitle', e.target.value)}
                  placeholder="e.g., CEO, Research Scientist, Artist"
                  bg="rgba(255, 255, 255, 0.05)"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  color="white"
                  _placeholder={{ color: "white.300" }}
                  _hover={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
                  _focus={{ borderColor: "rgba(212, 175, 55, 0.5)", boxShadow: "0 0 0 1px rgba(212, 175, 55, 0.3)" }}
                  borderRadius="12px"
                  h="48px"
                />
                <FormErrorMessage>{errors.professionalTitle}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.achievementSummary}>
                <FormLabel color="white.200" fontSize="sm" fontWeight="500">
                  Brief Achievement Summary *
                </FormLabel>
                <Textarea
                  value={formData.achievementSummary}
                  onChange={(e) => handleInputChange('achievementSummary', e.target.value)}
                  placeholder="Describe your key achievements and contributions (150 words max)"
                  bg="rgba(255, 255, 255, 0.05)"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  color="white"
                  _placeholder={{ color: "white.300" }}
                  _hover={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
                  _focus={{ borderColor: "rgba(212, 175, 55, 0.5)", boxShadow: "0 0 0 1px rgba(212, 175, 55, 0.3)" }}
                  borderRadius="12px"
                  minH="120px"
                  resize="vertical"
                />
                <HStack justify="space-between" mt={1}>
                  <FormErrorMessage>{errors.achievementSummary}</FormErrorMessage>
                  <Text fontSize="xs" color="white.300">
                    {formData.achievementSummary.length}/150 words
                  </Text>
                </HStack>
              </FormControl>

              <FormControl>
                <FormLabel color="white.200" fontSize="sm" fontWeight="500">
                  LinkedIn/Portfolio URL (Optional)
                </FormLabel>
                <Input
                  value={formData.portfolioUrl}
                  onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                  placeholder="https://linkedin.com/in/yourname or your portfolio URL"
                  bg="rgba(255, 255, 255, 0.05)"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  color="white"
                  _placeholder={{ color: "white.300" }}
                  _hover={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
                  _focus={{ borderColor: "rgba(212, 175, 55, 0.5)", boxShadow: "0 0 0 1px rgba(212, 175, 55, 0.3)" }}
                  borderRadius="12px"
                  h="48px"
                />
              </FormControl>

              <FormControl isInvalid={!!errors.hearAboutUs}>
                <FormLabel color="white.200" fontSize="sm" fontWeight="500">
                  How did you hear about ICONS HERALD? *
                </FormLabel>
                <Select
                  value={formData.hearAboutUs}
                  onChange={(e) => handleInputChange('hearAboutUs', e.target.value)}
                  placeholder="Select an option"
                  bg="rgba(255, 255, 255, 0.05)"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  color="white"
                  _hover={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
                  _focus={{ borderColor: "rgba(212, 175, 55, 0.5)", boxShadow: "0 0 0 1px rgba(212, 175, 55, 0.3)" }}
                  borderRadius="12px"
                  h="48px"
                >
                  <option value="search-engine" style={{ background: '#2A2A2A', color: 'white' }}>Search Engine</option>
                  <option value="social-media" style={{ background: '#2A2A2A', color: 'white' }}>Social Media</option>
                  <option value="referral" style={{ background: '#2A2A2A', color: 'white' }}>Referral from Member</option>
                  <option value="press-coverage" style={{ background: '#2A2A2A', color: 'white' }}>Press Coverage</option>
                  <option value="professional-network" style={{ background: '#2A2A2A', color: 'white' }}>Professional Network</option>
                  <option value="other" style={{ background: '#2A2A2A', color: 'white' }}>Other</option>
                </Select>
                <FormErrorMessage>{errors.hearAboutUs}</FormErrorMessage>
              </FormControl>
            </VStack>

            <Button
              onClick={handleSubmit}
              isLoading={isSubmitting}
              loadingText="Submitting Request..."
              bg="linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)"
              color="black.900"
              size="lg"
              h="56px"
              borderRadius="16px"
              fontWeight="600"
              fontSize="md"
              rightIcon={<Send size={18} />}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(212, 175, 55, 0.3)',
              }}
              _active={{
                transform: 'translateY(0)',
              }}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              w="full"
              mt={2}
            >
              Submit Invitation Request
            </Button>

            <Text fontSize="xs" color="white.300" textAlign="center">
              By submitting this request, you acknowledge that ICONS HERALD maintains exclusive editorial standards and membership is by invitation only.
            </Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
