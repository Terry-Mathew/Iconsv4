'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Box,
  Container,
  Card,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Alert,
  AlertIcon,
  Divider,
  useToast,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, Crown } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'

const MotionBox = motion(Box)
const MotionCard = motion(Card)

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()
  const supabase = createClient()

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      const redirectTo = searchParams.get('redirectTo') || '/dashboard'
      router.push(redirectTo)
    }
  }, [user, loading, router, searchParams])

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }

      setMessage({
        type: 'success',
        text: 'Check your email for a magic link to sign in!'
      })

      toast({
        title: 'Magic Link Sent',
        description: 'Check your email and click the link to sign in.',
        status: 'success',
        duration: 8000,
        isClosable: true,
      })
    } catch (error: any) {
      console.error('Auth error:', error)
      setMessage({
        type: 'error',
        text: error.message || 'Failed to send magic link. Please try again.'
      })

      toast({
        title: 'Sign In Failed',
        description: 'Please check your email and try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <Box minH="100vh" bg="#D2B48C" display="flex" alignItems="center" justifyContent="center">
        <Text fontFamily="'Lato', sans-serif" color="#1A1A1A">
          Loading...
        </Text>
      </Box>
    )
  }

  if (user) {
    return null // Will redirect in useEffect
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <Box 
      minH="100vh" 
      bg="#D2B48C" 
      py={{ base: 8, md: 16 }}
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
        zIndex: 1
      }}
    >
      <Container maxW="500px" position="relative" zIndex={2}>
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <MotionBox textAlign="center" mb={8} variants={itemVariants}>
            <HStack justify="center" mb={4}>
              <Box
                w={12}
                h={12}
                bg="linear-gradient(135deg, #D4AF37, #F4E4BC)"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Crown size={24} color="white" />
              </Box>
            </HStack>
            <Heading
              as="h1"
              fontSize={{ base: '2xl', md: '3xl' }}
              fontFamily="'Playfair Display', serif"
              color="#1A1A1A"
              fontWeight="400"
              mb={3}
            >
              Welcome to Icons Herald
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              fontFamily="'Lato', sans-serif"
              color="#333"
              lineHeight="1.6"
            >
              Sign in to access your exclusive profile builder and join the vault of excellence.
            </Text>
          </MotionBox>

          {/* Auth Card */}
          <MotionCard
            bg="white"
            borderRadius="12px"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.12)"
            border="1px solid"
            borderColor="rgba(212, 175, 55, 0.2)"
            variants={itemVariants}
          >
            <CardBody p={{ base: 6, md: 8 }}>
              <VStack spacing={6}>
                <Box textAlign="center">
                  <Heading
                    as="h2"
                    fontSize="xl"
                    fontFamily="'Playfair Display', serif"
                    color="#1A1A1A"
                    fontWeight="400"
                    mb={2}
                  >
                    Sign In with Magic Link
                  </Heading>
                  <Text
                    fontSize="sm"
                    color="#666"
                    fontFamily="'Lato', sans-serif"
                  >
                    Enter your email to receive a secure sign-in link
                  </Text>
                </Box>

                {message && (
                  <Alert 
                    status={message.type} 
                    borderRadius="8px"
                    bg={message.type === 'success' ? 'green.50' : 'red.50'}
                    border="1px solid"
                    borderColor={message.type === 'success' ? 'green.200' : 'red.200'}
                  >
                    <AlertIcon />
                    <Text fontSize="sm" fontFamily="'Lato', sans-serif">
                      {message.text}
                    </Text>
                  </Alert>
                )}

                <form onSubmit={handleMagicLinkSignIn} style={{ width: '100%' }}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel
                        fontSize="md"
                        fontFamily="'Lato', sans-serif"
                        color="#1A1A1A"
                        fontWeight="500"
                      >
                        Email Address
                      </FormLabel>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        size="lg"
                        borderColor="gray.300"
                        _hover={{ borderColor: "#D4AF37" }}
                        _focus={{ borderColor: "#D4AF37", boxShadow: "0 0 0 1px #D4AF37" }}
                        bg="white"
                        fontFamily="'Lato', sans-serif"
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      isLoading={isLoading}
                      loadingText="Sending Magic Link..."
                      bg="#D4AF37"
                      color="white"
                      size="lg"
                      w="full"
                      fontFamily="'Lato', sans-serif"
                      fontWeight="500"
                      rightIcon={<ArrowRight size={16} />}
                      _hover={{
                        bg: "#B8941F",
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(212, 175, 55, 0.3)"
                      }}
                      _disabled={{
                        bg: "gray.300",
                        color: "gray.500",
                        cursor: "not-allowed",
                        transform: "none",
                        boxShadow: "none"
                      }}
                      transition="all 0.2s"
                      isDisabled={!email || isLoading}
                    >
                      Send Magic Link
                    </Button>
                  </VStack>
                </form>

                <Divider borderColor="rgba(212, 175, 55, 0.3)" />

                <Box textAlign="center">
                  <Text
                    fontSize="xs"
                    color="#666"
                    fontFamily="'Lato', sans-serif"
                    lineHeight="1.5"
                  >
                    By signing in, you agree to our Terms of Service and Privacy Policy. 
                    Access is granted to approved nominees and invited members only.
                  </Text>
                </Box>
              </VStack>
            </CardBody>
          </MotionCard>

          {/* Help Text */}
          <MotionBox textAlign="center" mt={6} variants={itemVariants}>
            <Text
              fontSize="sm"
              color="#666"
              fontFamily="'Lato', sans-serif"
              mb={2}
            >
              Don't have access yet?
            </Text>
            <Button
              as="a"
              href="/nominate"
              variant="link"
              color="#D4AF37"
              fontFamily="'Lato', sans-serif"
              fontWeight="500"
              _hover={{ textDecoration: "underline" }}
            >
              Submit a nomination to get started
            </Button>
          </MotionBox>
        </MotionBox>
      </Container>
    </Box>
  )
}
