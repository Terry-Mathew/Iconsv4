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
import { PageLayout } from '@/components/layout/PageLayout'
import { FloatingCard } from '@/components/ui/FloatingCard'

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
type ProfileTier = 'emerging' | 'accomplished' | 'distinguished' | 'legacy'

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
  emerging: {
    name: 'Emerging',
    price: '₹2,500/year',
    description: 'For emerging brilliance—showcase your potential',
    fieldCount: 4,
    fields: ['name', 'tagline', 'heroImage', 'bio'] as const
  },
  accomplished: {
    name: 'Accomplished',
    price: '₹5,000/year',
    description: 'For accomplished professionals—amplify your influence',
    fieldCount: 6,
    fields: ['name', 'tagline', 'heroImage', 'bio', 'achievements', 'links'] as const
  },
  distinguished: {
    name: 'Distinguished',
    price: '₹12,000/year',
    description: 'For distinguished leaders—demonstrate your excellence',
    fieldCount: 8,
    fields: ['name', 'tagline', 'heroImage', 'bio', 'achievements', 'links', 'publications', 'metrics'] as const
  },
  legacy: {
    name: 'Legacy',
    price: '₹50,000 lifetime',
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
  const [selectedTier, setSelectedTier] = useState<ProfileTier>('emerging')
  
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
      tier: 'emerging',
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

    const formData = watch()

    // Only auto-save if there's meaningful content
    if (!formData.name || formData.name.trim().length < 2) {
      return // Don't save empty or minimal content
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/profiles/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: formData,
          tier: selectedTier,
          slug: generateSlug(formData.name || 'profile'),
          auto_save: true
        }),
      })

      if (response.ok) {
        setLastSaved(new Date())
        console.log('✅ Auto-save successful')
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.warn('Auto-save failed:', response.status, errorData.error)

        // Don't show error toast for auto-save failures to avoid annoying users
        // Just log it for debugging
      }
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }, [watch, isImpersonating, selectedTier])

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(autoSave, 30000)
    return () => clearInterval(interval)
  }, [autoSave])

  // Form submission
  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true)
    try {
      // Step 1: Save as draft first
      const draftResponse = await fetch('/api/profiles/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: data,
          tier: selectedTier,
          slug: generateSlug(data.name || 'profile')
        }),
      })

      if (!draftResponse.ok) {
        const draftError = await draftResponse.json()
        throw new Error(draftError.error || 'Failed to save draft')
      }

      const draftResult = await draftResponse.json()
      const profileSlug = draftResult.profile?.slug

      if (!profileSlug) {
        throw new Error('No profile slug returned from draft save')
      }

      // Step 2: Publish the draft
      const publishResponse = await fetch('/api/profiles/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: profileSlug }),
      })

      if (!publishResponse.ok) {
        const publishError = await publishResponse.json()
        throw new Error(publishError.error || 'Failed to publish profile')
      }

      const publishResult = await publishResponse.json()

      toast({
        title: 'Profile Published!',
        description: 'Your profile is now live and accessible.',
        status: 'success',
        duration: 5000,
      })

      // Redirect to the published profile or dashboard
      if (publishResult.profileUrl) {
        // Show success message with profile link
        toast({
          title: 'Profile Published Successfully!',
          description: `Your profile is now live at ${publishResult.profileUrl}`,
          status: 'success',
          duration: 8000,
          isClosable: true,
        })
        router.push(publishResult.profileUrl)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Publish failed:', error)
      toast({
        title: 'Publish Failed',
        description: error instanceof Error ? error.message : 'Unable to publish your profile. Please try again.',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Manual save function
  const saveAsDraft = async () => {
    const formData = watch()

    if (!formData.name || formData.name.trim().length < 2) {
      toast({
        title: 'Cannot Save Draft',
        description: 'Please enter a name before saving.',
        status: 'warning',
        duration: 3000,
      })
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/profiles/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: formData,
          tier: selectedTier,
          slug: generateSlug(formData.name || 'profile'),
          manual_save: true
        }),
      })

      if (response.ok) {
        setLastSaved(new Date())
        toast({
          title: 'Draft Saved!',
          description: 'Your profile has been saved as a draft.',
          status: 'success',
          duration: 3000,
        })
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to save draft')
      }
    } catch (error) {
      console.error('Manual save failed:', error)
      toast({
        title: 'Save Failed',
        description: 'Unable to save your draft. Please try again.',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Helper function to generate slug from name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
      .substring(0, 50) // Limit length
      + '-' + Date.now() // Add timestamp for uniqueness
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
            onSaveDraft={saveAsDraft}
            isSubmitting={isSubmitting}
            isSaving={isSaving}
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
      <PageLayout>
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
          <VStack spacing={4}>
            <Spinner size="xl" color="#D4AF37" thickness="4px" />
            <Text fontFamily="'Lato', sans-serif" color="white">
              Loading profile builder...
            </Text>
          </VStack>
        </Box>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <Suspense fallback={
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
          <VStack spacing={4}>
            <Spinner size="xl" color="#D4AF37" thickness="4px" />
            <Text fontFamily="'Lato', sans-serif" color="white">
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
        <Box flex={1} w="full">
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
    </PageLayout>
  )
}

// Export with Suspense wrapper
export default function ProfileBuilder() {
  return (
    <Suspense fallback={
      <PageLayout>
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
          <VStack spacing={4}>
            <Spinner size="xl" color="#D4AF37" thickness="4px" />
            <Text fontFamily="'Lato', sans-serif" color="white">
              Loading profile builder...
            </Text>
          </VStack>
        </Box>
      </PageLayout>
    }>
      <ProfileBuilderContent />
    </Suspense>
  )
}
