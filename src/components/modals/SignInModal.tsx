'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Text,
  Alert,
  AlertIcon,
  HStack,
  PinInput,
  PinInputField,
  useToast
} from '@chakra-ui/react'
import { Mail, ArrowRight } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn } = useAuth()
  const router = useRouter()
  const toast = useToast()

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // For now, simulate OTP sending
      setStep('otp')
      toast({
        title: "OTP Sent",
        description: "Check your email for the verification code.",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) return

    setIsLoading(true)
    setError('')

    try {
      // For demo purposes, accept any 6-digit code
      const { error } = await signIn(email)

      if (error) {
        throw new Error(error.message)
      }

      toast({
        title: "Welcome!",
        description: "Successfully signed in.",
        status: "success",
        duration: 3000,
        isClosable: true,
      })

      onClose()

      // Role-based redirect - for demo, check email domain
      if (email.includes('admin') || email.includes('@iconsherald.com')) {
        router.push('/admin')
      } else {
        router.push('/builder')
      }
    } catch (err: any) {
      setError(err.message || 'Invalid verification code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setStep('email')
    setEmail('')
    setOtp('')
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="xl" mx={4}>
        <ModalHeader 
          textAlign="center" 
          fontFamily="'Playfair Display', serif"
          fontSize="2xl"
          color="#1A1A1A"
          pb={2}
        >
          {step === 'email' ? 'Sign In' : 'Enter Verification Code'}
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody pb={8}>
          {step === 'email' ? (
            <VStack spacing={6} as="form" onSubmit={handleEmailSubmit}>
              <Text 
                textAlign="center" 
                color="#666" 
                fontFamily="'Lora', serif"
                fontSize="sm"
              >
                Enter your email to receive a secure sign-in code
              </Text>

              <FormControl isRequired>
                <FormLabel fontFamily="'Lora', serif">Email Address</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Mail size={20} color="#D4AF37" />
                  </InputLeftElement>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    borderColor="#D4AF37"
                    _focus={{ borderColor: "#B8941F", boxShadow: "0 0 0 1px #B8941F" }}
                  />
                </InputGroup>
              </FormControl>

              {error && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  <Text fontSize="sm">{error}</Text>
                </Alert>
              )}

              <Button
                type="submit"
                w="full"
                bg="#D4AF37"
                color="white"
                size="lg"
                isLoading={isLoading}
                loadingText="Sending..."
                _hover={{ bg: "#B8941F" }}
                rightIcon={<ArrowRight size={20} />}
              >
                Send Verification Code
              </Button>
            </VStack>
          ) : (
            <VStack spacing={6} as="form" onSubmit={handleOtpSubmit}>
              <Text 
                textAlign="center" 
                color="#666" 
                fontFamily="'Lora', serif"
                fontSize="sm"
              >
                We sent a 6-digit code to <strong>{email}</strong>
              </Text>

              <FormControl>
                <FormLabel textAlign="center" fontFamily="'Lora', serif">
                  Verification Code
                </FormLabel>
                <HStack justify="center">
                  <PinInput 
                    value={otp} 
                    onChange={setOtp}
                    size="lg"
                    focusBorderColor="#D4AF37"
                  >
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                    <PinInputField />
                  </PinInput>
                </HStack>
              </FormControl>

              {error && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  <Text fontSize="sm">{error}</Text>
                </Alert>
              )}

              <VStack spacing={3} w="full">
                <Button
                  type="submit"
                  w="full"
                  bg="#D4AF37"
                  color="white"
                  size="lg"
                  isLoading={isLoading}
                  loadingText="Verifying..."
                  _hover={{ bg: "#B8941F" }}
                  isDisabled={otp.length !== 6}
                >
                  Verify & Sign In
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  color="#666"
                  onClick={() => setStep('email')}
                >
                  Use different email
                </Button>
              </VStack>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
