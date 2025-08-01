'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Link,
  Divider,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react'
import { Eye, EyeOff, Crown, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { createClient } from '@/lib/supabase/client'
import { PageLayout } from '@/components/layout/PageLayout'
import { FloatingCard } from '@/components/ui/FloatingCard'

export default function SignInPage() {
  const router = useRouter()
  const toast = useToast()
  const { user, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})

  const supabase = createClient()

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ general: 'Invalid email or password' })
        } else {
          setErrors({ general: error.message })
        }
        return
      }

      if (data.user) {
        // For development: Allow any user to access admin
        // TODO: Replace with actual role check when database is ready
        toast({
          title: 'Welcome back!',
          description: 'Successfully signed in',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })

        router.push('/admin')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setErrors({ general: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <Container maxW="md" py={12}>
        <VStack spacing={4}>
          <Text>Loading...</Text>
        </VStack>
      </Container>
    )
  }

  return (
    <PageLayout containerPadding={8}>
      <Container maxW="md">
        <Breadcrumbs />

        <VStack spacing={8} mt={8}>
          {/* Header */}
          <FloatingCard variant="glass" hoverEffect={false}>
            <VStack spacing={4} textAlign="center">
              <HStack spacing={2}>
                <Crown size={32} color="#D4AF37" />
                <Heading
                  as="h1"
                  fontSize="3xl"
                  fontFamily="'Playfair Display', serif"
                  color="#1A1A1A"
                >
                  Admin Sign In
                </Heading>
              </HStack>
              <Text color="#666" fontFamily="'Lato', sans-serif" maxW="sm">
                Access the ICONS HERALD admin dashboard with your credentials
              </Text>
            </VStack>
          </FloatingCard>

          {/* Sign In Form */}
          {!showForgotPassword ? (
            <FloatingCard variant="default" hoverEffect={false} w="full">
            <form onSubmit={handleSignIn}>
              <VStack spacing={6}>
                {errors.general && (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    {errors.general}
                  </Alert>
                )}

                <FormControl isInvalid={!!errors.email}>
                  <FormLabel fontFamily="'Lato', sans-serif" fontWeight="600">
                    Email Address
                  </FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@iconsherald.com"
                    size="lg"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.300"
                    _hover={{ borderColor: "#D4AF37" }}
                    _focus={{ borderColor: "#D4AF37", boxShadow: "0 0 0 1px #D4AF37" }}
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.password}>
                  <FormLabel fontFamily="'Lato', sans-serif" fontWeight="600">
                    Password
                  </FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.300"
                      _hover={{ borderColor: "#D4AF37" }}
                      _focus={{ borderColor: "#D4AF37", boxShadow: "0 0 0 1px #D4AF37" }}
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        icon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  w="full"
                  size="lg"
                  bg="#D4AF37"
                  color="white"
                  _hover={{ bg: "#B8941F" }}
                  _active={{ bg: "#9A7B1A" }}
                  isLoading={isLoading}
                  loadingText="Signing in..."
                  fontFamily="'Lato', sans-serif"
                  fontWeight="600"
                >
                  Sign In
                </Button>

                <Divider />

                <Button
                  variant="link"
                  color="#D4AF37"
                  fontFamily="'Lato', sans-serif"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot your password?
                </Button>
              </VStack>
            </form>
          </Box>
        ) : (
          /* Forgot Password Form - Simplified for now */
          <Box w="full" bg="white" p={8} borderRadius="lg" shadow="md" border="1px solid" borderColor="gray.200">
            <VStack spacing={6}>
              <VStack spacing={2} textAlign="center">
                <Heading as="h2" fontSize="xl" fontFamily="'Playfair Display', serif">
                  Reset Password
                </Heading>
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  Contact your system administrator for password reset
                </Text>
              </VStack>

              <Button
                variant="outline"
                borderColor="gray.300"
                color="gray.600"
                _hover={{ bg: "gray.50" }}
                onClick={() => setShowForgotPassword(false)}
                leftIcon={<ArrowLeft size={16} />}
                w="full"
              >
                Back to Sign In
              </Button>
            </VStack>
          </Box>
        )}

        {/* Footer */}
        <VStack spacing={2} textAlign="center">
          <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
            Admin access only • No public registration
          </Text>
          <Link
            href="/"
            color="#D4AF37"
            fontFamily="'Lato', sans-serif"
            fontSize="sm"
            _hover={{ textDecoration: 'underline' }}
          >
            ← Back to Home
          </Link>
        </VStack>
      </Container>
    </PageLayout>
  )
}
