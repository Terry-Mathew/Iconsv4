'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Progress,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Save, Eye, CreditCard } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { ProfileFormData, ThemeSettingsFormData } from '@/lib/validations/profile'
import { ProfileTier } from '@/types/profile'
import { RisingProfileForm } from './RisingProfileForm'
import { EliteProfileForm } from './EliteProfileForm'
import { LegacyProfileForm } from './LegacyProfileForm'
import { ThemeCustomizer } from './ThemeCustomizer'
import { ProfilePreview } from '../ProfilePreview'

const MotionBox = motion(Box)

interface ProfileBuilderProps {
  tier: ProfileTier
  existingProfile?: any
  onSave?: (profile: any) => void
  onPayment?: () => void
}

export function ProfileBuilder({ tier, existingProfile, onSave, onPayment }: ProfileBuilderProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [profileData, setProfileData] = useState<Partial<ProfileFormData> | null>(null)
  const [themeSettings, setThemeSettings] = useState<ThemeSettingsFormData>({
    colorScheme: 'blue',
    layout: 'modern',
    typography: 'sans',
    backgroundPattern: 'none',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [progress, setProgress] = useState(0)
  
  const { user } = useAuth()
  const toast = useToast()
  const supabase = createClient()

  useEffect(() => {
    if (existingProfile) {
      setProfileData(existingProfile.data)
      setThemeSettings(existingProfile.theme_settings || themeSettings)
    }
  }, [existingProfile])

  const handleProfileDataChange = (data: Partial<ProfileFormData>) => {
    setProfileData(data)
    calculateProgress(data)
  }

  const handleThemeChange = (theme: ThemeSettingsFormData) => {
    setThemeSettings(theme)
  }

  const calculateProgress = (data: Partial<ProfileFormData>) => {
    if (!data) return
    
    const requiredFields = getRequiredFieldsForTier(tier)
    const filledFields = requiredFields.filter(field => {
      const value = getNestedValue(data, field)
      return value !== undefined && value !== '' && value !== null
    })
    
    const newProgress = (filledFields.length / requiredFields.length) * 100
    setProgress(newProgress)
  }

  const handleSave = async (isDraft = true) => {
    if (!user || !profileData) return

    setIsSaving(true)
    try {
      const profilePayload = {
        user_id: user.id!,
        tier,
        status: isDraft ? 'draft' : 'published',
        slug: generateSlug(profileData.name || ''),
        data: profileData,
        theme_settings: themeSettings,
        payment_status: isDraft ? 'pending' : 'completed',
      }

      let result
      if (existingProfile) {
        result = await supabase
          .from('profiles')
          .update(profilePayload)
          .eq('id', existingProfile.id)
          .select()
          .single()
      } else {
        result = await supabase
          .from('profiles')
          .insert(profilePayload)
          .select()
          .single()
      }

      if (result.error) throw result.error

      toast({
        title: isDraft ? 'Profile saved as draft' : 'Profile published',
        status: 'success',
        duration: 3000,
      })

      onSave?.(result.data)
    } catch (error: any) {
      toast({
        title: 'Error saving profile',
        description: error.message,
        status: 'error',
        duration: 5000,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = () => {
    if (progress < 90) {
      toast({
        title: 'Profile incomplete',
        description: 'Please complete at least 90% of your profile before publishing',
        status: 'warning',
        duration: 5000,
      })
      return
    }
    
    onPayment?.()
  }

  const renderProfileForm = () => {
    switch (tier) {
      case 'rising':
        return (
          <RisingProfileForm
            initialData={profileData as any}
            onChange={handleProfileDataChange}
          />
        )
      case 'elite':
        return (
          <EliteProfileForm
            initialData={profileData as any}
            onChange={handleProfileDataChange}
          />
        )
      case 'legacy':
        return (
          <LegacyProfileForm
            initialData={profileData as any}
            onChange={handleProfileDataChange}
          />
        )
      default:
        return null
    }
  }

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8}>
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          textAlign="center"
          w="full"
        >
          <Heading as="h1" size="xl" mb={2}>
            Build Your {tier.charAt(0).toUpperCase() + tier.slice(1)} Profile
          </Heading>
          <Text color="gray.600" mb={4}>
            Create your premium digital profile with our guided builder
          </Text>
          <Progress value={progress} colorScheme="primary" size="lg" borderRadius="full" />
          <Text fontSize="sm" color="gray.500" mt={2}>
            {Math.round(progress)}% Complete
          </Text>
        </MotionBox>

        {/* Action Buttons */}
        <HStack spacing={4}>
          <Button
            leftIcon={<Save size={20} />}
            onClick={() => handleSave(true)}
            isLoading={isSaving}
            loadingText="Saving..."
            variant="outline"
          >
            Save Draft
          </Button>
          <Button
            leftIcon={<CreditCard size={20} />}
            onClick={handlePublish}
            colorScheme="primary"
            isDisabled={progress < 90}
          >
            Publish & Pay
          </Button>
        </HStack>

        {progress < 90 && (
          <Alert status="info" borderRadius="lg" maxW="2xl">
            <AlertIcon />
            Complete at least 90% of your profile to enable publishing and payment.
          </Alert>
        )}

        {/* Main Content */}
        <Card w="full" shadow="xl">
          <CardBody p={0}>
            <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
              <TabList>
                <Tab>Profile Information</Tab>
                <Tab>Theme & Design</Tab>
                <Tab>Preview</Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={8}>
                  {renderProfileForm()}
                </TabPanel>

                <TabPanel p={8}>
                  <ThemeCustomizer
                    settings={themeSettings}
                    onChange={handleThemeChange}
                    tier={tier}
                  />
                </TabPanel>

                <TabPanel p={0}>
                  {profileData && (
                    <ProfilePreview
                      data={profileData as any}
                      theme={themeSettings}
                      tier={tier}
                    />
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  )
}

// Helper functions
function getRequiredFieldsForTier(tier: ProfileTier): string[] {
  const baseFields = ['name', 'tagline', 'bio']
  
  switch (tier) {
    case 'rising':
      return [...baseFields, 'currentRole', 'company', 'skills', 'achievements', 'aspirations', 'projects']
    case 'elite':
      return [...baseFields, 'currentRole', 'company', 'industry', 'yearsOfExperience', 'expertise', 'majorAchievements', 'leadership', 'awards']
    case 'legacy':
      return [...baseFields, 'legacy', 'era', 'primaryContributions', 'historicalImpact', 'timeline', 'quotes', 'recognitions', 'influence']
    default:
      return baseFields
  }
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 50)
}
