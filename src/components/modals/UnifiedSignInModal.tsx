'use client'

import { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Divider,
  Box,
  Heading,
  Icon
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const MotionBox = motion(Box)

interface UnifiedSignInModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UnifiedSignInModal({ isOpen, onClose }: UnifiedSignInModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [error, setError] = useState('')
  
  const toast = useToast()
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.')
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link.')
        } else {
          setError(error.message)
        }
        return
      }

      // Check user role and redirect accordingly
      if (!data.user?.id) {
        setError('Authentication failed. Please try again.')
        return
      }

      const { data: userProfile } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single()

      onClose()

      if (userProfile?.role === 'admin' || userProfile?.role === 'super_admin') {
        router.push('/admin')
      } else {
        router.push('/builder')
      }

      toast({
        title: 'Welcome back!',
        description: 'You have been successfully signed in',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (err: any) {
      setError('Sign in failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        setError(error.message)
        return
      }

      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your email for password reset instructions',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setShowForgotPassword(false)
    } catch (err: any) {
      setError('Failed to send password reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setError('')
    setShowForgotPassword(false)
    setIsLoading(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered>
      <ModalOverlay 
        bg="rgba(0, 0, 0, 0.6)" 
        backdropFilter="blur(10px)"
      />
      <ModalContent
        bg="white"
        borderRadius="20px"
        border="2px solid #D4AF37"
        boxShadow="0 25px 50px rgba(212, 175, 55, 0.3)"
        overflow="hidden"
      >
        <ModalHeader
          bg="linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)"
          color="white"
          textAlign="center"
          py={6}
        >
          <VStack spacing={2}>
            <Heading 
              as="h2" 
              size="lg" 
              fontFamily="'Playfair Display', serif"
              fontWeight="400"
            >
              Welcome Back
            </Heading>
            <Text fontSize="sm" opacity={0.9} fontFamily="'Lora', serif">
              Sign in to your ICONS HERALD account
            </Text>
          </VStack>
        </ModalHeader>
        
        <ModalCloseButton color="white" />
        
        <ModalBody p={8}>
          <VStack spacing={6}>
            {!showForgotPassword ? (
              <>
                <FormControl isInvalid={!!error}>
                  <FormLabel
                    color="#666"
                    fontFamily="'Lora', serif"
                    fontSize="sm"
                    fontWeight="500"
                  >
                    Email Address
                  </FormLabel>
                  <HStack>
                    <Icon as={Mail} color="#D4AF37" boxSize={5} />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      bg="gray.50"
                      border="2px solid transparent"
                      borderRadius="12px"
                      _focus={{
                        borderColor: "#D4AF37",
                        bg: "white",
                        boxShadow: "0 0 0 1px #D4AF37"
                      }}
                      _hover={{
                        borderColor: "#D4AF37"
                      }}
                      fontFamily="'Lora', serif"
                    />
                  </HStack>
                </FormControl>

                <FormControl isInvalid={!!error}>
                  <FormLabel
                    color="#666"
                    fontFamily="'Lora', serif"
                    fontSize="sm"
                    fontWeight="500"
                  >
                    Password
                  </FormLabel>
                  <HStack>
                    <Icon as={Lock} color="#D4AF37" boxSize={5} />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      bg="gray.50"
                      border="2px solid transparent"
                      borderRadius="12px"
                      _focus={{
                        borderColor: "#D4AF37",
                        bg: "white",
                        boxShadow: "0 0 0 1px #D4AF37"
                      }}
                      _hover={{
                        borderColor: "#D4AF37"
                      }}
                      fontFamily="'Lora', serif"
                    />
                  </HStack>
                  {error && <FormErrorMessage>{error}</FormErrorMessage>}
                </FormControl>

                <VStack spacing={3} w="full">
                  <Button
                    onClick={handleSignIn}
                    isLoading={isLoading}
                    loadingText="Signing in..."
                    w="full"
                    bg="#D4AF37"
                    color="white"
                    size="lg"
                    borderRadius="12px"
                    _hover={{
                      bg: "#B8941F",
                      transform: "translateY(-2px)"
                    }}
                    _active={{
                      transform: "translateY(0)"
                    }}
                    transition="all 0.2s"
                    rightIcon={<ArrowRight size={18} />}
                    fontFamily="'Lora', serif"
                    fontWeight="500"
                  >
                    Sign In
                  </Button>

                  <Button
                    onClick={() => setShowForgotPassword(true)}
                    variant="ghost"
                    size="sm"
                    color="#666"
                    _hover={{ color: "#D4AF37" }}
                    fontFamily="'Lora', serif"
                  >
                    Forgot your password?
                  </Button>
                </VStack>
              </>
            ) : (
              <>
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  w="full"
                >
                  <Text
                    textAlign="center"
                    color="#666"
                    fontSize="sm"
                    fontFamily="'Lora', serif"
                    mb={6}
                  >
                    Enter your email address and we'll send you a link to reset your password.
                  </Text>

                  <FormControl isInvalid={!!error}>
                    <FormLabel
                      color="#666"
                      fontFamily="'Lora', serif"
                      fontSize="sm"
                      fontWeight="500"
                    >
                      Email Address
                    </FormLabel>
                    <HStack>
                      <Icon as={Mail} color="#D4AF37" boxSize={5} />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        bg="gray.50"
                        border="2px solid transparent"
                        borderRadius="12px"
                        _focus={{
                          borderColor: "#D4AF37",
                          bg: "white",
                          boxShadow: "0 0 0 1px #D4AF37"
                        }}
                        _hover={{
                          borderColor: "#D4AF37"
                        }}
                        fontFamily="'Lora', serif"
                      />
                    </HStack>
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>

                  <VStack spacing={3} mt={6}>
                    <Button
                      onClick={handleForgotPassword}
                      isLoading={isLoading}
                      loadingText="Sending..."
                      w="full"
                      bg="#D4AF37"
                      color="white"
                      size="lg"
                      borderRadius="12px"
                      _hover={{
                        bg: "#B8941F",
                        transform: "translateY(-2px)"
                      }}
                      _active={{
                        transform: "translateY(0)"
                      }}
                      transition="all 0.2s"
                      rightIcon={<ArrowRight size={18} />}
                      fontFamily="'Lora', serif"
                      fontWeight="500"
                    >
                      Send Reset Link
                    </Button>

                    <Button
                      onClick={() => setShowForgotPassword(false)}
                      variant="ghost"
                      size="sm"
                      color="#666"
                      _hover={{ color: "#D4AF37" }}
                      fontFamily="'Lora', serif"
                    >
                      Back to Sign In
                    </Button>
                  </VStack>
                </MotionBox>
              </>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
