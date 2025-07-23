'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Button,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Crown, CheckCircle, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const MotionBox = motion(Box)

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the code from URL parameters
        const code = searchParams.get('code')
        
        if (code) {
          // Exchange the code for a session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            throw error
          }

          if (data.user) {
            setStatus('success')
            setMessage('Successfully signed in! Redirecting to your dashboard...')
            
            // Redirect after a short delay
            setTimeout(() => {
              router.push('/dashboard')
            }, 2000)
          } else {
            throw new Error('No user data received')
          }
        } else {
          throw new Error('No authentication code found')
        }
      } catch (error: any) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage(error.message || 'Authentication failed. Please try signing in again.')
      }
    }

    handleAuthCallback()
  }, [searchParams, router, supabase.auth])

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
      display="flex"
      alignItems="center"
      justifyContent="center"
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
          textAlign="center"
        >
          <VStack spacing={6}>
            {/* Icon */}
            <MotionBox variants={itemVariants}>
              <Box
                w={16}
                h={16}
                bg="linear-gradient(135deg, #D4AF37, #F4E4BC)"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={4}
              >
                {status === 'loading' && <Spinner size="lg" color="white" />}
                {status === 'success' && <CheckCircle size={32} color="white" />}
                {status === 'error' && <AlertCircle size={32} color="white" />}
              </Box>
            </MotionBox>

            {/* Content */}
            <MotionBox variants={itemVariants}>
              <Heading
                as="h1"
                fontSize={{ base: '2xl', md: '3xl' }}
                fontFamily="'Playfair Display', serif"
                color="#1A1A1A"
                fontWeight="400"
                mb={4}
              >
                {status === 'loading' && 'Signing you in...'}
                {status === 'success' && 'Welcome to Icons Herald!'}
                {status === 'error' && 'Authentication Failed'}
              </Heading>

              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                fontFamily="'Lato', sans-serif"
                color="#333"
                lineHeight="1.6"
                mb={6}
              >
                {message}
              </Text>

              {status === 'error' && (
                <VStack spacing={4}>
                  <Alert 
                    status="error" 
                    borderRadius="8px"
                    bg="red.50"
                    border="1px solid"
                    borderColor="red.200"
                    maxW="400px"
                  >
                    <AlertIcon />
                    <Text fontSize="sm" fontFamily="'Lato', sans-serif">
                      Please try signing in again or contact support if the problem persists.
                    </Text>
                  </Alert>

                  <Button
                    as="a"
                    href="/auth"
                    bg="#D4AF37"
                    color="white"
                    size="lg"
                    fontFamily="'Lato', sans-serif"
                    fontWeight="500"
                    _hover={{
                      bg: "#B8941F",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(212, 175, 55, 0.3)"
                    }}
                    transition="all 0.2s"
                  >
                    Try Again
                  </Button>
                </VStack>
              )}

              {status === 'loading' && (
                <Text
                  fontSize="sm"
                  color="#666"
                  fontFamily="'Lato', sans-serif"
                  fontStyle="italic"
                >
                  This may take a few moments...
                </Text>
              )}
            </MotionBox>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  )
}
