'use client'

import { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Select,
  FormControl,
  FormLabel,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Badge,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react'
import { User, UserCheck, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface ImpersonationPanelProps {
  currentUser: any
  isImpersonating: boolean
  onImpersonationChange: (isImpersonating: boolean) => void
}

export function ImpersonationPanel({ 
  currentUser, 
  isImpersonating, 
  onImpersonationChange 
}: ImpersonationPanelProps) {
  const [selectedTier, setSelectedTier] = useState<'rising' | 'elite' | 'legacy'>('rising')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const router = useRouter()
  const supabase = createClient()

  const handleStartImpersonation = async () => {
    setIsLoading(true)
    
    try {
      // Create a temporary impersonation session
      const impersonationData = {
        originalUserId: currentUser.id,
        originalUserEmail: currentUser.email,
        impersonatedTier: selectedTier,
        startedAt: new Date().toISOString()
      }

      // Store impersonation data in localStorage for this session
      localStorage.setItem('impersonation_session', JSON.stringify(impersonationData))
      
      onImpersonationChange(true)
      
      toast({
        title: 'Impersonation Started',
        description: `Now viewing as ${selectedTier} tier user`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      })

      // Redirect to builder with impersonated tier
      router.push(`/builder?tier=${selectedTier}&impersonating=true`)
    } catch (error) {
      toast({
        title: 'Impersonation Failed',
        description: 'Failed to start impersonation session',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStopImpersonation = () => {
    // Clear impersonation session
    localStorage.removeItem('impersonation_session')
    onImpersonationChange(false)
    
    toast({
      title: 'Impersonation Ended',
      description: 'Returned to admin view',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })

    // Redirect back to admin dashboard
    router.push('/admin')
  }

  const getTierDescription = (tier: string) => {
    switch (tier) {
      case 'rising':
        return 'Emerging leaders and innovators'
      case 'elite':
        return 'Established professionals and experts'
      case 'legacy':
        return 'Legendary figures and icons'
      default:
        return ''
    }
  }

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
    <Card>
      <CardHeader>
        <HStack spacing={3}>
          <User size={24} color="#D4AF37" />
          <Heading size="md" fontFamily="'Playfair Display', serif">
            User Impersonation
          </Heading>
        </HStack>
      </CardHeader>
      
      <CardBody>
        <VStack spacing={6} align="stretch">
          {isImpersonating ? (
            <Alert status="info" borderRadius="lg">
              <AlertIcon />
              <Box>
                <AlertTitle>Currently Impersonating</AlertTitle>
                <AlertDescription>
                  You are viewing the platform as a {selectedTier} tier user. 
                  All actions will be performed in this context.
                </AlertDescription>
              </Box>
            </Alert>
          ) : (
            <Text color="gray.600" fontFamily="'Lora', serif">
              Test the user experience by impersonating different tier users. 
              This allows you to see exactly what users see in their profile builder.
            </Text>
          )}

          {!isImpersonating ? (
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel fontFamily="'Lora', serif" fontWeight="500">
                  Select User Tier to Impersonate
                </FormLabel>
                <Select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value as any)}
                  bg="white"
                  borderColor="gray.300"
                  _focus={{ borderColor: "#D4AF37" }}
                  fontFamily="'Lora', serif"
                >
                  <option value="rising">Rising Tier</option>
                  <option value="elite">Elite Tier</option>
                  <option value="legacy">Legacy Tier</option>
                </Select>
              </FormControl>

              <Box p={4} bg="gray.50" borderRadius="lg">
                <HStack spacing={3} mb={2}>
                  <Badge colorScheme={getTierColor(selectedTier)} size="lg">
                    {selectedTier.toUpperCase()}
                  </Badge>
                </HStack>
                <Text fontSize="sm" color="gray.600" fontFamily="'Lora', serif">
                  {getTierDescription(selectedTier)}
                </Text>
              </Box>

              <Button
                onClick={handleStartImpersonation}
                isLoading={isLoading}
                loadingText="Starting..."
                leftIcon={<UserCheck size={18} />}
                bg="#D4AF37"
                color="white"
                _hover={{ bg: "#B8941F" }}
                fontFamily="'Lora', serif"
              >
                Start Impersonation
              </Button>
            </VStack>
          ) : (
            <VStack spacing={4}>
              <Box p={4} bg="blue.50" borderRadius="lg" w="full">
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="500" fontFamily="'Lora', serif">
                    Impersonating:
                  </Text>
                  <Badge colorScheme={getTierColor(selectedTier)} size="lg">
                    {selectedTier.toUpperCase()} USER
                  </Badge>
                </HStack>
                <Text fontSize="sm" color="gray.600" fontFamily="'Lora', serif">
                  {getTierDescription(selectedTier)}
                </Text>
              </Box>

              <Button
                onClick={handleStopImpersonation}
                leftIcon={<LogOut size={18} />}
                variant="outline"
                colorScheme="red"
                w="full"
                fontFamily="'Lora', serif"
              >
                Stop Impersonation
              </Button>
            </VStack>
          )}

          <Box p={3} bg="yellow.50" borderRadius="lg">
            <Text fontSize="xs" color="yellow.800" fontFamily="'Lora', serif">
              <strong>Note:</strong> Impersonation is for testing purposes only. 
              All actions performed during impersonation are logged for security.
            </Text>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  )
}
