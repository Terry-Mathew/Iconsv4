'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Textarea,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { Sparkles, Copy, RotateCcw } from 'lucide-react'

interface AIBioPolisherProps {
  currentBio: string
  onBioUpdate: (newBio: string) => void
  tier: 'rising' | 'elite' | 'legacy'
  disabled?: boolean
}

interface AIFeatureStatus {
  hasAccess: boolean
  userRole: string
  userTier: string
  usage: {
    daily: number
    dailyLimit: number
    remaining: number
  }
  features: {
    bioPolish: boolean
    toneOptions: string[]
    supportedTiers: string[]
  }
}

export function AIBioPolisher({ 
  currentBio, 
  onBioUpdate, 
  tier, 
  disabled = false 
}: AIBioPolisherProps) {
  const [isPolishing, setIsPolishing] = useState(false)
  const [polishedBio, setPolishedBio] = useState('')
  const [selectedTone, setSelectedTone] = useState<'professional' | 'casual' | 'formal'>('professional')
  const [aiStatus, setAIStatus] = useState<AIFeatureStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  // Check AI feature availability
  const checkAIAvailability = async () => {
    try {
      const response = await fetch('/api/ai/polish-bio')
      if (response.ok) {
        const status = await response.json()
        setAIStatus(status)
        return status.hasAccess
      }
      return false
    } catch (error) {
      console.error('Error checking AI availability:', error)
      return false
    }
  }

  const handlePolishBio = async () => {
    if (!currentBio.trim()) {
      toast({
        title: 'No Bio to Polish',
        description: 'Please enter a bio first before using AI enhancement.',
        status: 'warning',
        duration: 3000,
      })
      return
    }

    if (currentBio.length < 50) {
      toast({
        title: 'Bio Too Short',
        description: 'Please write at least 50 characters before using AI enhancement.',
        status: 'warning',
        duration: 3000,
      })
      return
    }

    setIsPolishing(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/polish-bio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio: currentBio,
          tone: selectedTone,
          tier: tier,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to polish bio')
      }

      const result = await response.json()
      setPolishedBio(result.polishedBio)
      onOpen()

      toast({
        title: 'Bio Enhanced!',
        description: 'Your bio has been polished with AI. Review the suggestions.',
        status: 'success',
        duration: 3000,
      })

    } catch (error: any) {
      console.error('Error polishing bio:', error)
      setError(error.message)
      
      toast({
        title: 'Enhancement Failed',
        description: error.message || 'Failed to enhance bio. Please try again.',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setIsPolishing(false)
    }
  }

  const handleAcceptPolishedBio = () => {
    onBioUpdate(polishedBio)
    onClose()
    toast({
      title: 'Bio Updated',
      description: 'Your enhanced bio has been applied.',
      status: 'success',
      duration: 3000,
    })
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(polishedBio)
      toast({
        title: 'Copied!',
        description: 'Enhanced bio copied to clipboard.',
        status: 'success',
        duration: 2000,
      })
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <HStack>
              <Text fontWeight="semibold">AI Bio Enhancement</Text>
              <Badge colorScheme="purple" variant="subtle">
                <HStack spacing={1}>
                  <Sparkles size={12} />
                  <Text fontSize="xs">AI Powered</Text>
                </HStack>
              </Badge>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              Polish your bio with AI for better clarity and impact
            </Text>
          </VStack>

          <VStack spacing={2}>
            <Select
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value as any)}
              size="sm"
              width="140px"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
            </Select>

            <Button
              leftIcon={<Sparkles size={16} />}
              onClick={handlePolishBio}
              isLoading={isPolishing}
              loadingText="Enhancing..."
              colorScheme="purple"
              variant="outline"
              size="sm"
              disabled={disabled || !currentBio.trim() || currentBio.length < 50}
            >
              Polish with AI
            </Button>
          </VStack>
        </HStack>

        {error && (
          <Alert status="error" size="sm">
            <AlertIcon />
            <AlertTitle fontSize="sm">Enhancement Failed:</AlertTitle>
            <AlertDescription fontSize="sm">{error}</AlertDescription>
          </Alert>
        )}

        {aiStatus && !aiStatus.hasAccess && (
          <Alert status="info" size="sm">
            <AlertIcon />
            <AlertTitle fontSize="sm">Upgrade Required:</AlertTitle>
            <AlertDescription fontSize="sm">
              AI features require membership. Please upgrade your account to access bio enhancement.
            </AlertDescription>
          </Alert>
        )}

        {aiStatus && aiStatus.hasAccess && (
          <HStack justify="space-between" fontSize="xs" color="gray.500">
            <Text>Daily usage: {aiStatus.usage.daily}/{aiStatus.usage.dailyLimit}</Text>
            <Text>{aiStatus.usage.remaining} enhancements remaining</Text>
          </HStack>
        )}
      </VStack>

      {/* AI Enhancement Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Sparkles size={20} />
              <Text>AI-Enhanced Biography</Text>
              <Badge colorScheme="purple">{selectedTone}</Badge>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={6} align="stretch">
              {/* Original Bio */}
              <Box>
                <Text fontWeight="semibold" mb={2} color="gray.600">
                  Original Bio:
                </Text>
                <Box
                  p={4}
                  bg="gray.50"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <Text fontSize="sm" whiteSpace="pre-wrap">
                    {currentBio}
                  </Text>
                </Box>
              </Box>

              {/* Enhanced Bio */}
              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="semibold" color="purple.600">
                    AI-Enhanced Bio:
                  </Text>
                  <Button
                    leftIcon={<Copy size={14} />}
                    onClick={copyToClipboard}
                    size="xs"
                    variant="ghost"
                  >
                    Copy
                  </Button>
                </HStack>
                <Box
                  p={4}
                  bg="purple.50"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="purple.200"
                >
                  <Text fontSize="sm" whiteSpace="pre-wrap">
                    {polishedBio}
                  </Text>
                </Box>
              </Box>

              {/* Comparison Stats */}
              <HStack spacing={6} justify="center" fontSize="sm" color="gray.600">
                <VStack spacing={1}>
                  <Text fontWeight="semibold">Original</Text>
                  <Text>{currentBio.length} characters</Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontWeight="semibold">Enhanced</Text>
                  <Text>{polishedBio.length} characters</Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontWeight="semibold">Tone</Text>
                  <Text textTransform="capitalize">{selectedTone}</Text>
                </VStack>
              </HStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <HStack spacing={3}>
              <Button
                leftIcon={<RotateCcw size={16} />}
                onClick={handlePolishBio}
                isLoading={isPolishing}
                variant="outline"
                size="sm"
              >
                Re-enhance
              </Button>
              <Button onClick={onClose} variant="ghost">
                Cancel
              </Button>
              <Button
                colorScheme="purple"
                onClick={handleAcceptPolishedBio}
              >
                Use Enhanced Bio
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
