'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Box,
  Container,
  VStack,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth/auth-context'

// Import new step components
import { BuilderStepper } from '@/components/builder/BuilderStepper'
import { TierSelectionStep } from '@/components/builder/steps/TierSelectionStep'
import { BasicInfoStep } from '@/components/builder/steps/BasicInfoStep'
import { BiographyStep } from '@/components/builder/steps/BiographyStep'
import { AchievementsStep } from '@/components/builder/steps/AchievementsStep'
import { LinksMediaStep } from '@/components/builder/steps/LinksMediaStep'
import { PreviewStep } from '@/components/builder/steps/PreviewStep'

const MotionBox = motion.create(Box)

// Profile tier type
type ProfileTier = 'rising' | 'elite' | 'legacy'

// Multi-step wizard steps
const STEPS = {
  TIER_SELECTION: 1,
  BASIC_INFO: 2,
  BIOGRAPHY: 3,
  ACHIEVEMENTS: 4,
  LINKS_MEDIA: 5,
  PREVIEW: 6,
} as const

type StepNumber = typeof STEPS[keyof typeof STEPS]

// Simplified Profile data interface for multi-step wizard
interface ProfileFormData {
  // Basic Information (Step 2)
  name: string
  tagline: string
  heroImage: string

  // Biography (Step 3)
  bio: {
    original: string
    ai_polished?: string
  }

  // Achievements (Step 4)
  achievements: Array<{
    title: string
    description: string
    year: string
    category: string
  }>

  // Links & Media (Step 5)
  links: Array<{
    title: string
    url: string
    type: 'website' | 'linkedin' | 'twitter' | 'other'
  }>
  gallery?: Array<{
    url: string
    caption: string
    type: 'image' | 'video'
  }>

  // Meta (Step 1 & 6)
  tier: ProfileTier
  isPublic: boolean
  analyticsEnabled: boolean
}

// Simplified tier configurations for multi-step wizard
const TIER_CONFIG = {
  rising: {
    name: 'Rising',
    price: '₹3,000/year',
    description: 'For emerging brilliance—showcase your potential',
    fieldCount: 4,
    fields: ['name', 'tagline', 'heroImage', 'bio'] as const
  },
  elite: {
    name: 'Elite',
    price: '₹10,000/year',
    description: 'For established leaders—amplify your influence',
    fieldCount: 6,
    fields: ['name', 'tagline', 'heroImage', 'bio', 'achievements', 'links'] as const
  },
  legacy: {
    name: 'Legacy',
    price: '₹20,000 one-time',
    description: 'For icons—preserve your eternal impact',
    fieldCount: 10,
    fields: [
      'name', 'tagline', 'heroImage', 'bio', 'achievements', 'links',
      'gallery', 'impactMetrics', 'tributes', 'analytics'
    ] as const
  }
} as const

// Component to handle impersonation parameters
function ImpersonationHandler({ onImpersonationDetected }: {
  onImpersonationDetected: (tier: ProfileTier | null, isImpersonating: boolean) => void
}) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const tier = searchParams.get('tier') as ProfileTier
    const impersonating = searchParams.get('impersonating') === 'true'

    if (impersonating && tier) {
      onImpersonationDetected(tier, true)
    } else {
      onImpersonationDetected(null, false)
    }
  }, [searchParams, onImpersonationDetected])

  return null
}

// Main component with multi-step wizard
function ProfileBuilderContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const toast = useToast()

  // Multi-step wizard state
  const [currentStep, setCurrentStep] = useState<StepNumber>(STEPS.TIER_SELECTION)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [selectedTier, setSelectedTier] = useState<ProfileTier>('rising')
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Impersonation state
  const [isImpersonating, setIsImpersonating] = useState(false)
  const [impersonatedTier, setImpersonatedTier] = useState<ProfileTier | null>(null)

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
  } = useForm<ProfileFormData>({
    mode: 'onChange',
    defaultValues: {
      tier: 'rising',
      name: '',
      tagline: '',
      heroImage: '',
      bio: { original: '', ai_polished: '' },
      achievements: [],
      links: [],
      gallery: [],
      isPublic: true,
      analyticsEnabled: true,
    },
  })

  // Redirect if not authenticated (temporarily disabled for testing)
  useEffect(() => {
    // TODO: Re-enable authentication when auth system is fully implemented
    // if (!loading && !user) {
    //   router.push('/auth')
    // }
    console.log('🔐 Builder auth check:', { user: !!user, loading })
  }, [user, loading, router])

  // Step navigation functions
  const goToStep = (step: number) => {
    setCurrentStep(step as StepNumber)
  }

  const goToNextStep = () => {
    if (currentStep < STEPS.PREVIEW) {
      const nextStep = (currentStep + 1) as StepNumber
      setCurrentStep(nextStep)
      
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep])
      }
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > STEPS.TIER_SELECTION) {
      const prevStep = (currentStep - 1) as StepNumber
      setCurrentStep(prevStep)
    }
  }

  // Handle tier selection
  const handleTierSelect = (tier: ProfileTier) => {
    setSelectedTier(tier)
    setValue('tier', tier)
  }

  // Handle impersonation detection
  const handleImpersonationDetected = useCallback((tier: ProfileTier | null, impersonating: boolean) => {
    if (impersonating && tier) {
      setIsImpersonating(true)
      setImpersonatedTier(tier)
      setSelectedTier(tier)
      setValue('tier', tier)

      toast({
        title: 'Impersonation Active',
        description: `Viewing as ${tier} tier user`,
        status: 'info',
        duration: 5000,
        isClosable: true,
      })
    } else {
      setIsImpersonating(false)
      setImpersonatedTier(null)
    }
  }, [toast, setValue])

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (isImpersonating) return // Don't save during impersonation
    
    setIsSaving(true)
    try {
      const formData = watch()
      const response = await fetch('/api/profiles/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setLastSaved(new Date())
        console.log('✅ Auto-save successful')
      }
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }, [watch, isImpersonating])

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(autoSave, 30000)
    return () => clearInterval(interval)
  }, [autoSave])

  // Form submission
  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/profiles/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: 'Profile Published!',
          description: 'Your profile is now live and accessible.',
          status: 'success',
          duration: 5000,
        })
        router.push('/dashboard')
      } else {
        throw new Error('Failed to publish profile')
      }
    } catch (error) {
      console.error('Publish failed:', error)
      toast({
        title: 'Publish Failed',
        description: 'Unable to publish your profile. Please try again.',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.TIER_SELECTION:
        return (
          <TierSelectionStep
            selectedTier={selectedTier}
            onTierSelect={handleTierSelect}
            onNext={goToNextStep}
            isImpersonating={isImpersonating}
            impersonatedTier={impersonatedTier}
          />
        )
      
      case STEPS.BASIC_INFO:
        return (
          <BasicInfoStep
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        )
      
      case STEPS.BIOGRAPHY:
        return (
          <BiographyStep
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
            selectedTier={selectedTier}
          />
        )
      
      case STEPS.ACHIEVEMENTS:
        return (
          <AchievementsStep
            setValue={setValue}
            watch={watch}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
            selectedTier={selectedTier}
          />
        )
      
      case STEPS.LINKS_MEDIA:
        return (
          <LinksMediaStep
            setValue={setValue}
            watch={watch}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
            selectedTier={selectedTier}
          />
        )
      
      case STEPS.PREVIEW:
        return (
          <PreviewStep
            watch={watch}
            setValue={setValue}
            onPrevious={goToPreviousStep}
            onPublish={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            selectedTier={selectedTier}
          />
        )
      
      default:
        return null
    }
  }

  // Temporarily allow access without authentication for testing
  // TODO: Re-enable when auth system is fully implemented
  // if (!user) {
  //   return null // Will redirect in useEffect
  // }

  if (loading) {
    return (
      <Box minH="100vh" bg="#D2B48C" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="#D4AF37" thickness="4px" />
          <Text fontFamily="'Lato', sans-serif" color="#1A1A1A">
            Loading profile builder...
          </Text>
        </VStack>
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg="#D2B48C">
      <Suspense fallback={
        <Box minH="100vh" bg="#D2B48C" display="flex" alignItems="center" justifyContent="center">
          <VStack spacing={4}>
            <Spinner size="xl" color="#D4AF37" thickness="4px" />
            <Text fontFamily="'Lato', sans-serif" color="#1A1A1A">
              Loading impersonation handler...
            </Text>
          </VStack>
        </Box>
      }>
        <ImpersonationHandler onImpersonationDetected={handleImpersonationDetected} />
      </Suspense>

      {/* Multi-Step Wizard Layout */}
      <VStack spacing={0} minH="100vh">
        {/* Stepper Navigation */}
        <BuilderStepper
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={goToStep}
        />

        {/* Step Content */}
        <Box flex={1} w="full" bg="white">
          {renderStepContent()}
        </Box>

        {/* Auto-save indicator */}
        {isSaving && (
          <Box
            position="fixed"
            bottom={4}
            right={4}
            bg="rgba(212, 175, 55, 0.9)"
            color="white"
            px={3}
            py={2}
            borderRadius="md"
            fontSize="sm"
            zIndex={1000}
          >
            Saving...
          </Box>
        )}

        {lastSaved && (
          <Box
            position="fixed"
            bottom={4}
            left={4}
            bg="rgba(0, 0, 0, 0.7)"
            color="white"
            px={3}
            py={2}
            borderRadius="md"
            fontSize="xs"
            zIndex={1000}
          >
            Last saved: {lastSaved.toLocaleTimeString()}
          </Box>
        )}
      </VStack>
    </Box>
  )
}

// Export with Suspense wrapper
export default function ProfileBuilder() {
  return (
    <Suspense fallback={
      <Box minH="100vh" bg="#D2B48C" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="#D4AF37" thickness="4px" />
          <Text fontFamily="'Lato', sans-serif" color="#1A1A1A">
            Loading profile builder...
          </Text>
        </VStack>
      </Box>
    }>
      <ProfileBuilderContent />
    </Suspense>
  )
}
