'use client'

import { useState, useEffect } from 'react'
import {
  VStack,
  HStack,
  Text,
  useToast,
  Link as ChakraLink,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { PremiumModal } from '@/components/ui/PremiumModal'
import { CustomToggle } from '@/components/ui/CustomToggle'
import { AnimatedButton } from '@/components/ui/AnimatedButton'
import { InputField, TextareaField, SelectField } from '@/components/ui/FormField'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const MotionVStack = motion(VStack)

// Validation schemas
const nominationSchema = z.object({
  nominee_name: z.string().min(2, 'Name must be at least 2 characters'),
  nominee_email: z.string().email('Please enter a valid email'),
  nominator_name: z.string().min(2, 'Your name must be at least 2 characters'),
  nominator_email: z.string().email('Please enter a valid email'),
  pitch: z.string().min(50, 'Pitch must be at least 50 characters'),
  desired_tier: z.enum(['rising', 'elite', 'legacy']),
})

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type NominationFormData = z.infer<typeof nominationSchema>
type SignInFormData = z.infer<typeof signInSchema>

interface EntryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function EntryModal({ isOpen, onClose }: EntryModalProps) {
  const [mode, setMode] = useState<'nominate' | 'signin'>('nominate')
  const [nominationType, setNominationType] = useState<'self' | 'icon'>('self')
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const toast = useToast()
  const router = useRouter()
  const supabase = createClient()

  // Form hooks
  const nominationForm = useForm<NominationFormData>({
    resolver: zodResolver(nominationSchema),
    defaultValues: {
      desired_tier: 'rising'
    }
  })

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema)
  })

  // Pre-fill nomination form when user is logged in and mode changes
  useEffect(() => {
    if (user && mode === 'nominate') {
      if (nominationType === 'self') {
        nominationForm.setValue('nominee_name', user.user_metadata?.full_name || '')
        nominationForm.setValue('nominee_email', user.email || '')
        nominationForm.setValue('nominator_name', user.user_metadata?.full_name || '')
        nominationForm.setValue('nominator_email', user.email || '')
      } else {
        // For nominating others, only pre-fill nominator fields
        nominationForm.setValue('nominator_name', user.user_metadata?.full_name || '')
        nominationForm.setValue('nominator_email', user.email || '')
        nominationForm.setValue('nominee_name', '')
        nominationForm.setValue('nominee_email', '')
      }
    }
  }, [user, mode, nominationType, nominationForm])

  const handleNominationSubmit = async (data: NominationFormData) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('nominations')
        .insert({
          nominee_name: data.nominee_name,
          nominee_email: data.nominee_email,
          nominator_name: data.nominator_name,
          nominator_email: data.nominator_email,
          pitch: data.pitch,
          desired_tier: data.desired_tier,
          status: 'pending'
        })

      if (error) throw error

      toast({
        title: 'Nomination Submitted!',
        description: 'Thank you for your nomination. We\'ll review it shortly.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      nominationForm.reset()
      onClose()
    } catch (error) {
      console.error('Nomination error:', error)
      toast({
        title: 'Submission Failed',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignInSubmit = async (data: SignInFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/check-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Sign-in failed')
      }

      toast({
        title: 'Welcome back!',
        description: 'Redirecting you to your dashboard...',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      // Close modal and redirect
      onClose()
      router.push(result.redirectPath)
    } catch (error) {
      console.error('Sign-in error:', error)
      toast({
        title: 'Sign-in Failed',
        description: error instanceof Error ? error.message : 'Please check your credentials.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle options for primary mode selection
  const primaryToggleOptions = [
    { value: 'nominate', label: 'Nominate', ariaLabel: 'Switch to nomination mode' },
    { value: 'signin', label: 'Sign In', ariaLabel: 'Switch to sign in mode' },
  ]

  // Toggle options for nomination type
  const nominationToggleOptions = [
    { value: 'self', label: 'Nominate Yourself', ariaLabel: 'Nominate yourself for the archive' },
    { value: 'icon', label: 'Nominate an Icon', ariaLabel: 'Nominate someone else for the archive' },
  ]

  return (
    <PremiumModal
      isOpen={isOpen}
      onClose={onClose}
      title="Welcome to ICONS HERALD"
      size="xl"
      variant="premium"
    >
        <VStack spacing={6}>
          {/* Primary Toggle */}
          <CustomToggle
            options={primaryToggleOptions}
            value={mode}
            onValueChange={(value) => setMode(value as 'nominate' | 'signin')}
            size="lg"
            aria-label="Choose between nomination and sign in"
          />

            <AnimatePresence mode="wait">
              {mode === 'nominate' ? (
                <MotionVStack
                  key="nominate"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  spacing={6}
                  w="full"
                >
                  {/* Nomination Sub-toggle */}
                  <CustomToggle
                    options={nominationToggleOptions}
                    value={nominationType}
                    onValueChange={(value) => setNominationType(value as 'self' | 'icon')}
                    size="md"
                    aria-label="Choose nomination type"
                    style={{ maxWidth: '400px' }}
                  />

                  {/* Nomination Form */}
                  <VStack 
                    as="form" 
                    spacing={4} 
                    w="full"
                    onSubmit={nominationForm.handleSubmit(handleNominationSubmit)}
                  >
                    <HStack spacing={4} w="full">
                      <InputField
                        {...nominationForm.register('nominee_name')}
                        label={nominationType === 'self' ? 'Your Name' : 'Nominee Name'}
                        placeholder="Full name"
                        error={nominationForm.formState.errors.nominee_name?.message}
                        isRequired
                        aria-label={nominationType === 'self' ? 'Enter your full name' : 'Enter nominee full name'}
                      />

                      <InputField
                        {...nominationForm.register('nominee_email')}
                        type="email"
                        label={nominationType === 'self' ? 'Your Email' : 'Nominee Email'}
                        placeholder="email@example.com"
                        error={nominationForm.formState.errors.nominee_email?.message}
                        isRequired
                        aria-label={nominationType === 'self' ? 'Enter your email address' : 'Enter nominee email address'}
                      />
                    </HStack>

                    {nominationType === 'icon' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <HStack spacing={4} w="full">
                          <InputField
                            {...nominationForm.register('nominator_name')}
                            label="Your Name"
                            placeholder="Your full name"
                            error={nominationForm.formState.errors.nominator_name?.message}
                            isRequired
                            aria-label="Enter your full name as the nominator"
                          />

                          <InputField
                            {...nominationForm.register('nominator_email')}
                            type="email"
                            label="Your Email"
                            placeholder="your@email.com"
                            error={nominationForm.formState.errors.nominator_email?.message}
                            isRequired
                            aria-label="Enter your email address as the nominator"
                          />
                        </HStack>
                      </motion.div>
                    )}

                    <TextareaField
                      {...nominationForm.register('pitch')}
                      label={`Why ${nominationType === 'self' ? 'should you' : 'should they'} be featured?`}
                      placeholder="Share the story, achievements, and impact that make this nomination special..."
                      rows={4}
                      error={nominationForm.formState.errors.pitch?.message}
                      isRequired
                      aria-label="Describe why this person should be featured in the archive"
                      helperText="Minimum 50 characters required"
                    />

                    <SelectField
                      {...nominationForm.register('desired_tier')}
                      label="Suggested Tier"
                      aria-label="Select the appropriate tier for this nomination"
                    >
                      <option value="rising">Rising - Emerging Talent</option>
                      <option value="elite">Elite - Established Leader</option>
                      <option value="legacy">Legacy - Enduring Impact</option>
                    </SelectField>

                    <AnimatedButton
                      type="submit"
                      variant="primary"
                      animation="lift"
                      size="lg"
                      w="full"
                      py={6}
                      fontSize="lg"
                      isLoading={isLoading}
                      loadingText="Submitting..."
                      aria-label="Submit nomination to ICONS HERALD"
                    >
                      Submit Nomination
                    </AnimatedButton>
                  </VStack>
                </MotionVStack>
              ) : (
                <MotionVStack
                  key="signin"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  spacing={6}
                  w="full"
                >
                  {/* Sign In Form */}
                  <VStack 
                    as="form" 
                    spacing={4} 
                    w="full"
                    onSubmit={signInForm.handleSubmit(handleSignInSubmit)}
                  >
                    <InputField
                      {...signInForm.register('email')}
                      type="email"
                      label="Email"
                      placeholder="your@email.com"
                      error={signInForm.formState.errors.email?.message}
                      isRequired
                      aria-label="Enter your email address to sign in"
                    />

                    <InputField
                      {...signInForm.register('password')}
                      type="password"
                      label="Password"
                      placeholder="••••••••"
                      error={signInForm.formState.errors.password?.message}
                      isRequired
                      aria-label="Enter your password to sign in"
                    />

                    <AnimatedButton
                      type="submit"
                      variant="primary"
                      animation="lift"
                      size="lg"
                      w="full"
                      py={6}
                      fontSize="lg"
                      isLoading={isLoading}
                      loadingText="Signing In..."
                      aria-label="Sign in to ICONS HERALD"
                    >
                      Sign In
                    </AnimatedButton>

                    <HStack spacing={4} fontSize="sm" color="#8B7355">
                      <ChakraLink href="/auth/forgot-password" _hover={{ color: '#D4AF37' }}>
                        Forgot password?
                      </ChakraLink>
                      <Text>•</Text>
                      <ChakraLink href="/auth/signup" _hover={{ color: '#D4AF37' }}>
                        Create account
                      </ChakraLink>
                    </HStack>
                  </VStack>
                </MotionVStack>
              )}
            </AnimatePresence>
        </VStack>
    </PremiumModal>
  )
}
