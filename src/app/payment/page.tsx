'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  CardBody,
  Button,
  Alert,
  AlertIcon,
  Spinner,
  Center,
  Divider,
  Badge,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react'
import { CheckCircle, CreditCard, Shield, Clock } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { TIER_PRICING_DISPLAY, createPaymentOptions } from '@/lib/razorpay'
import { ProfileTier } from '@/types/profile'

declare global {
  interface Window {
    Razorpay: any
  }
}

function PaymentPageContent() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin')
      return
    }

    if (user) {
      loadProfile()
    }
  }, [user, authLoading, router])

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const loadProfile = async () => {
    try {
      const profileId = searchParams.get('profile')
      
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user!.id)

      if (profileId) {
        query = query.eq('id', profileId)
      }

      const { data, error } = await query.single()

      if (error) {
        throw error
      }

      if (data.payment_status === 'completed') {
        router.push(`/profile/${data.slug}`)
        return
      }

      setProfile(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!profile) return

    setProcessing(true)
    setError(null)

    try {
      // Create payment order
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId: profile.id,
          tier: profile.tier,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment order')
      }

      // Initialize Razorpay payment
      const options = createPaymentOptions(
        data.order,
        {
          name: user!.user_metadata?.full_name || user!.email!,
          email: user!.email!,
        },
        async (paymentResponse) => {
          // Verify payment
          try {
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(paymentResponse),
            })

            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok) {
              router.push(`/profile/${profile.slug}?published=true`)
            } else {
              throw new Error(verifyData.error || 'Payment verification failed')
            }
          } catch (err: any) {
            setError(err.message)
            setProcessing(false)
          }
        },
        () => {
          setProcessing(false)
        }
      )

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (err: any) {
      setError(err.message)
      setProcessing(false)
    }
  }

  if (authLoading || loading) {
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" color="primary.500" thickness="4px" />
          <Text color="gray.600">Loading payment details...</Text>
        </VStack>
      </Center>
    )
  }

  if (error) {
    return (
      <Container maxW="4xl" py={20}>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          <VStack align="start" spacing={2}>
            <Text fontWeight="medium">Payment Error</Text>
            <Text fontSize="sm">{error}</Text>
          </VStack>
        </Alert>
      </Container>
    )
  }

  if (!profile) {
    return (
      <Container maxW="4xl" py={20}>
        <Alert status="warning" borderRadius="lg">
          <AlertIcon />
          <VStack align="start" spacing={2}>
            <Text fontWeight="medium">No profile found</Text>
            <Text fontSize="sm">
              Please create a profile first before proceeding with payment.
            </Text>
          </VStack>
        </Alert>
      </Container>
    )
  }

  const tierFeatures = {
    rising: [
      'Professional profile page',
      'Custom domain slug',
      'Social media integration',
      'Project showcase',
      'Skills & achievements display',
      '1 year hosting included',
    ],
    elite: [
      'Executive profile page',
      'Custom domain slug',
      'Leadership experience showcase',
      'Publications & awards section',
      'Professional achievements timeline',
      'Priority support',
      '2 years hosting included',
    ],
    legacy: [
      'Premium legacy profile',
      'Custom domain slug',
      'Historical timeline',
      'Quote collections',
      'Archive integration',
      'White-glove service',
      'Lifetime hosting included',
    ],
  }

  return (
    <Container maxW="4xl" py={12}>
      <VStack spacing={8}>
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={2}>
            Complete Your Profile Publication
          </Heading>
          <Text color="gray.600">
            Publish your {profile.tier} profile to the Icons Herald archive
          </Text>
        </Box>

        <Card shadow="xl" w="full">
          <CardBody p={8}>
            <VStack spacing={6}>
              {/* Profile Summary */}
              <Box w="full">
                <HStack justify="space-between" align="start" mb={4}>
                  <VStack align="start" spacing={1}>
                    <Heading as="h2" size="lg">
                      {profile.data?.name || 'Your Profile'}
                    </Heading>
                    <HStack>
                      <Badge colorScheme="primary" size="lg" px={3} py={1}>
                        {profile.tier.charAt(0).toUpperCase() + profile.tier.slice(1)} Tier
                      </Badge>
                      <Text color="gray.500" fontSize="sm">
                        Slug: /{profile.slug}
                      </Text>
                    </HStack>
                  </VStack>
                  <Text fontSize="2xl" fontWeight="bold" color="primary.600">
                    {TIER_PRICING_DISPLAY[profile.tier as ProfileTier]}
                  </Text>
                </HStack>

                <Divider my={6} />

                {/* Features */}
                <Box>
                  <Heading as="h3" size="md" mb={4}>
                    What's Included
                  </Heading>
                  <List spacing={2}>
                    {tierFeatures[profile.tier as ProfileTier].map((feature, index) => (
                      <ListItem key={index}>
                        <ListIcon as={CheckCircle} color="green.500" />
                        {feature}
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Divider my={6} />

                {/* Security Notice */}
                <Alert status="info" borderRadius="lg">
                  <AlertIcon />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium" fontSize="sm">
                      Secure Payment Processing
                    </Text>
                    <Text fontSize="xs" color="gray.600">
                      Payments are processed securely through Razorpay. Your profile will be published immediately after successful payment.
                    </Text>
                  </VStack>
                </Alert>
              </Box>

              {/* Payment Button */}
              <Button
                size="lg"
                colorScheme="primary"
                leftIcon={<CreditCard size={20} />}
                onClick={handlePayment}
                isLoading={processing}
                loadingText="Processing..."
                w="full"
                py={6}
              >
                Pay {TIER_PRICING_DISPLAY[profile.tier as ProfileTier]} & Publish Profile
              </Button>

              {/* Additional Info */}
              <VStack spacing={3} fontSize="sm" color="gray.500" textAlign="center">
                <HStack>
                  <Shield size={16} />
                  <Text>256-bit SSL encryption</Text>
                </HStack>
                <HStack>
                  <Clock size={16} />
                  <Text>Profile goes live immediately after payment</Text>
                </HStack>
                <Text>
                  By proceeding, you agree to our Terms of Service and Privacy Policy
                </Text>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <Container maxW="4xl" py={8}>
        <VStack spacing={8}>
          <Text>Loading payment page...</Text>
        </VStack>
      </Container>
    }>
      <PaymentPageContent />
    </Suspense>
  )
}
