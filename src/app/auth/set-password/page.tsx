'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  Progress,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react'
import { Eye, EyeOff, Crown, Check, X } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { createClient } from '@/lib/supabase/client'

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
}

const passwordRequirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'Contains number', test: (p) => /\d/.test(p) },
  { label: 'Contains special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) }
]

export default function SetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()
  const { user, loading } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; general?: string }>({})

  const supabase = createClient()

  // Check if user is authenticated and needs to set password
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

  const getPasswordStrength = (password: string): number => {
    const metRequirements = passwordRequirements.filter(req => req.test(password)).length
    return (metRequirements / passwordRequirements.length) * 100
  }

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength < 40) return 'red'
    if (strength < 80) return 'yellow'
    return 'green'
  }

  const getPasswordStrengthLabel = (strength: number): string => {
    if (strength < 40) return 'Weak'
    if (strength < 80) return 'Medium'
    return 'Strong'
  }

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!password) {
      newErrors.password = 'Password is required'
    } else {
      const unmetRequirements = passwordRequirements.filter(req => !req.test(password))
      if (unmetRequirements.length > 0) {
        newErrors.password = 'Password does not meet all requirements'
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      // Update user password
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        setErrors({ general: error.message })
        return
      }

      // Mark user as having set permanent password
      if (user) {
        await supabase
          .from('users')
          .update({ 
            has_permanent_password: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
      }

      toast({
        title: 'Password Set Successfully!',
        description: 'You can now sign in with your email and password',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // Redirect based on user role
      const redirectTo = searchParams.get('redirect') || '/dashboard'
      router.push(redirectTo)

    } catch (error) {
      console.error('Set password error:', error)
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

  if (!user) {
    return null // Will redirect in useEffect
  }

  const passwordStrength = getPasswordStrength(password)

  return (
    <Container maxW="md" py={8}>
      <Breadcrumbs />
      
      <VStack spacing={8} mt={8}>
        {/* Header */}
        <VStack spacing={4} textAlign="center">
          <HStack spacing={2}>
            <Crown size={32} color="#D4AF37" />
            <Heading
              as="h1"
              fontSize="3xl"
              fontFamily="'Playfair Display', serif"
              color="#1A1A1A"
            >
              Set Your Password
            </Heading>
          </HStack>
          <Text color="#666" fontFamily="'Lato', sans-serif" maxW="sm">
            Create a secure password for your ICONS HERALD account
          </Text>
        </VStack>

        {/* Set Password Form */}
        <Box w="full" bg="white" p={8} borderRadius="lg" shadow="md" border="1px solid" borderColor="gray.200">
          <form onSubmit={handleSetPassword}>
            <VStack spacing={6}>
              {errors.general && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  {errors.general}
                </Alert>
              )}

              <FormControl isInvalid={!!errors.password}>
                <FormLabel fontFamily="'Lato', sans-serif" fontWeight="600">
                  New Password
                </FormLabel>
                <InputGroup size="lg">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your new password"
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

              {/* Password Strength Indicator */}
              {password && (
                <Box w="full">
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm" fontFamily="'Lato', sans-serif" fontWeight="600">
                      Password Strength
                    </Text>
                    <Text 
                      fontSize="sm" 
                      fontFamily="'Lato', sans-serif"
                      color={`${getPasswordStrengthColor(passwordStrength)}.500`}
                      fontWeight="600"
                    >
                      {getPasswordStrengthLabel(passwordStrength)}
                    </Text>
                  </HStack>
                  <Progress 
                    value={passwordStrength} 
                    colorScheme={getPasswordStrengthColor(passwordStrength)}
                    size="sm"
                    borderRadius="full"
                  />
                </Box>
              )}

              {/* Password Requirements */}
              <Box w="full">
                <Text fontSize="sm" fontFamily="'Lato', sans-serif" fontWeight="600" mb={3}>
                  Password Requirements
                </Text>
                <VStack spacing={2} align="stretch">
                  {passwordRequirements.map((requirement, index) => {
                    const isMet = requirement.test(password)
                    return (
                      <HStack key={index} spacing={2}>
                        <Box color={isMet ? 'green.500' : 'gray.400'}>
                          {isMet ? <Check size={16} /> : <X size={16} />}
                        </Box>
                        <Text 
                          fontSize="sm" 
                          color={isMet ? 'green.600' : 'gray.600'}
                          fontFamily="'Lato', sans-serif"
                        >
                          {requirement.label}
                        </Text>
                      </HStack>
                    )
                  })}
                </VStack>
              </Box>

              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel fontFamily="'Lato', sans-serif" fontWeight="600">
                  Confirm Password
                </FormLabel>
                <InputGroup size="lg">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.300"
                    _hover={{ borderColor: "#D4AF37" }}
                    _focus={{ borderColor: "#D4AF37", boxShadow: "0 0 0 1px #D4AF37" }}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      icon={showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
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
                loadingText="Setting password..."
                fontFamily="'Lato', sans-serif"
                fontWeight="600"
                isDisabled={passwordStrength < 100}
              >
                Set Password
              </Button>
            </VStack>
          </form>
        </Box>

        {/* Footer */}
        <VStack spacing={2} textAlign="center">
          <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
            Once set, you can sign in with your email and password
          </Text>
        </VStack>
      </VStack>
    </Container>
  )
}
