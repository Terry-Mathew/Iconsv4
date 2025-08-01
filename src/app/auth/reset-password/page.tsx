'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Card,
  CardBody,
  HStack,
  Icon
} from '@chakra-ui/react'
import { Lock, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isValidSession, setIsValidSession] = useState(false)
  
  const router = useRouter()
  const toast = useToast()
  const supabase = createClient()

  useEffect(() => {
    // Check if user has a valid session for password reset
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsValidSession(true)
      } else {
        // Check for hash parameters (magic link)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
          
          if (!error) {
            setIsValidSession(true)
          } else {
            setError('Invalid or expired reset link. Please request a new one.')
          }
        } else {
          setError('Invalid or expired reset link. Please request a new one.')
        }
      }
    }

    checkSession()
  }, [supabase.auth])

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        setError(error.message)
        return
      }

      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully updated',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // Redirect to sign in page
      router.push('/auth/signin')
    } catch (err: any) {
      setError('Failed to update password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidSession && !error) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center">
        <Container maxW="md">
          <Card>
            <CardBody p={8} textAlign="center">
              <Text>Verifying reset link...</Text>
            </CardBody>
          </Card>
        </Container>
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center">
      <Container maxW="md">
        <Card
          bg="white"
          shadow="xl"
          borderRadius="2xl"
          border="2px solid rgba(212, 175, 55, 0.2)"
        >
          <CardBody p={10}>
            <VStack spacing={8}>
              <VStack spacing={4} textAlign="center">
                <Heading
                  as="h1"
                  size="xl"
                  fontFamily="'Playfair Display', serif"
                  color="#1A1A1A"
                  fontWeight="400"
                >
                  Reset Your Password
                </Heading>
                <Text
                  color="#666"
                  fontFamily="'Lora', serif"
                  fontSize="lg"
                >
                  Enter your new password below
                </Text>
              </VStack>

              {error && !isValidSession ? (
                <VStack spacing={4} textAlign="center">
                  <Text color="red.500" fontFamily="'Lora', serif">
                    {error}
                  </Text>
                  <Button
                    onClick={() => router.push('/auth/signin')}
                    variant="outline"
                    colorScheme="gray"
                  >
                    Back to Sign In
                  </Button>
                </VStack>
              ) : (
                <VStack spacing={6} w="full">
                  <FormControl isInvalid={!!error}>
                    <FormLabel
                      color="#666"
                      fontFamily="'Lora', serif"
                      fontSize="sm"
                      fontWeight="500"
                    >
                      New Password
                    </FormLabel>
                    <HStack>
                      <Icon as={Lock} color="#D4AF37" boxSize={5} />
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
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
                      Confirm Password
                    </FormLabel>
                    <HStack>
                      <Icon as={Lock} color="#D4AF37" boxSize={5} />
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
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

                  <Button
                    onClick={handleResetPassword}
                    isLoading={isLoading}
                    loadingText="Updating..."
                    w="full"
                    bg="linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)"
                    color="white"
                    size="lg"
                    borderRadius="12px"
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(212, 175, 55, 0.4)"
                    }}
                    _active={{
                      transform: "translateY(0)"
                    }}
                    transition="all 0.3s ease"
                    rightIcon={<ArrowRight size={18} />}
                    fontFamily="'Lora', serif"
                    fontWeight="500"
                  >
                    Update Password
                  </Button>
                </VStack>
              )}
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  )
}
