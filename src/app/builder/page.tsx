'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Box,
  Container,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  Select,
  Button,
  IconButton,
  Switch,
  Badge,
  Divider,
  Tooltip,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Alert,
  AlertIcon,
  Image,
  AspectRatio,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Trash2,
  Upload,
  Eye,
  Sparkles,
  Save,
  Send,
  Crown,
  Star,
  Trophy,
  Info,
  ChevronRight,
  GripVertical
} from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { Breadcrumbs } from '../../components/ui/Breadcrumbs'

const MotionBox = motion(Box)
const MotionCard = motion(Card)
const MotionGridItem = motion(GridItem)

// Profile tier type
type ProfileTier = 'rising' | 'elite' | 'legacy'

// Profile data interface
interface ProfileBuilderData {
  tier: ProfileTier
  name: string
  tagline: string
  heroImage: string
  biography: string
  achievements: Array<{ title: string; description: string; year?: string }>
  links: Array<{ title: string; url: string; type: string }>
  quote?: string
  gallery?: Array<{ url: string; caption: string }>
  projects?: Array<{ title: string; description: string; url?: string; year?: string }>
  timeline?: Array<{ year: string; event: string; significance: string }>
  memorialGallery?: Array<{ url: string; caption: string; type: 'image' | 'video' }>
  legacyStatement?: string
  isPublic: boolean
}

// Tier configurations
const TIER_CONFIG = {
  rising: {
    name: 'Rising',
    price: '₹3,000/year',
    description: 'For emerging brilliance—showcase your potential',
    icon: Star,
    color: 'green.500',
    fields: ['name', 'tagline', 'heroImage', 'biography', 'achievements', 'links']
  },
  elite: {
    name: 'Elite',
    price: '₹10,000/year',
    description: 'For commanding presence—establish your authority',
    icon: Crown,
    color: 'blue.500',
    fields: ['name', 'tagline', 'heroImage', 'biography', 'achievements', 'links', 'quote', 'gallery', 'projects']
  },
  legacy: {
    name: 'Legacy',
    price: '₹20,000 lifetime',
    description: 'For eternal reverence—immortalize your impact',
    icon: Trophy,
    color: 'purple.500',
    fields: ['name', 'tagline', 'heroImage', 'biography', 'achievements', 'links', 'quote', 'gallery', 'projects', 'timeline', 'memorialGallery', 'legacyStatement']
  }
} as const

export default function ProfileBuilderPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const { isOpen: isAIOpen, onOpen: onAIOpen, onClose: onAIClose } = useDisclosure()

  const [selectedTier, setSelectedTier] = useState<ProfileTier>('rising')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileBuilderData>({
    defaultValues: {
      tier: 'rising',
      name: '',
      tagline: '',
      heroImage: '',
      biography: '',
      achievements: [],
      links: [],
      quote: '',
      gallery: [],
      projects: [],
      timeline: [],
      memorialGallery: [],
      legacyStatement: '',
      isPublic: false,
    },
    mode: 'onChange',
  })

  const { fields: achievementFields, append: appendAchievement, remove: removeAchievement } = useFieldArray({
    control,
    name: 'achievements',
  })

  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
    control,
    name: 'links',
  })

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: 'projects',
  })

  const { fields: timelineFields, append: appendTimeline, remove: removeTimeline } = useFieldArray({
    control,
    name: 'timeline',
  })

  const watchedData = watch()

  // Auto-save functionality
  const autoSave = useCallback(async (data: ProfileBuilderData) => {
    if (!isDirty) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/profile/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setLastSaved(new Date())
        toast({
          title: 'Draft saved',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'bottom-right',
        })
      }
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }, [isDirty, toast])

  // Debounced auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isDirty) {
        autoSave(watchedData)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [watchedData, isDirty, autoSave])

  // Update tier when selection changes
  useEffect(() => {
    setValue('tier', selectedTier)
  }, [selectedTier, setValue])

  const onSubmit = async (data: ProfileBuilderData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/profile/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to submit profile')
      }

      toast({
        title: 'Profile Submitted',
        description: 'Your profile is now under editorial review. We\'ll notify you of next steps.',
        status: 'success',
        duration: 8000,
        isClosable: true,
      })

      router.push('/dashboard')
    } catch (error) {
      console.error('Submission error:', error)
      toast({
        title: 'Submission Failed',
        description: 'Please try again or contact support.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAIBioPolish = async (originalBio: string) => {
    try {
      const response = await fetch('/api/ai/polish-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: originalBio,
          tier: selectedTier,
          tone: 'professional'
        }),
      })

      if (!response.ok) {
        throw new Error('AI polishing failed')
      }

      const { polishedBio } = await response.json()
      setValue('biography', polishedBio, { shouldValidate: true })

      toast({
        title: 'Biography Enhanced',
        description: 'Your bio has been polished with AI. Review and edit as needed.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error('AI bio polish error:', error)
      toast({
        title: 'AI Enhancement Failed',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const isFieldVisible = (fieldName: string): boolean => {
    return TIER_CONFIG[selectedTier].fields.includes(fieldName as any)
  }

  if (loading) {
    return (
      <Box minH="100vh" bg="#D2B48C" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="#D4AF37" thickness="4px" />
          <Text fontFamily="'Lato', sans-serif" color="#1A1A1A">
            Loading your profile builder...
          </Text>
        </VStack>
      </Box>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
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
    <Box minH="100vh" bg="#D2B48C" position="relative">
      <Container maxW="full" p={0}>
        <Grid
          templateColumns={{ base: '1fr', lg: '300px 1fr' }}
          minH="100vh"
          gap={0}
        >
          {/* Sidebar - Tier Selection & Controls */}
          <MotionGridItem
            bg="white"
            borderRight="1px solid"
            borderColor="rgba(212, 175, 55, 0.2)"
            position="sticky"
            top={0}
            h="100vh"
            overflowY="auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <VStack spacing={6} p={6} align="stretch">
              {/* Header */}
              <MotionBox variants={itemVariants}>
                <Heading
                  as="h1"
                  fontSize="2xl"
                  fontFamily="'Playfair Display', serif"
                  color="#1A1A1A"
                  fontWeight="400"
                  mb={2}
                >
                  Profile Builder
                </Heading>
                <Text
                  fontSize="sm"
                  color="#666"
                  fontFamily="'Lato', sans-serif"
                >
                  Craft your eternal story
                </Text>
              </MotionBox>

              <Divider borderColor="rgba(212, 175, 55, 0.3)" />

              {/* Tier Selection */}
              <MotionBox variants={itemVariants}>
                <FormControl>
                  <FormLabel
                    fontSize="md"
                    fontFamily="'Lato', sans-serif"
                    color="#1A1A1A"
                    fontWeight="600"
                    mb={3}
                  >
                    Preferred Tier
                    <Tooltip
                      label="Final tier assignment is subject to editorial review"
                      bg="#D4AF37"
                      color="white"
                      fontSize="sm"
                      borderRadius="md"
                      placement="top"
                    >
                      <Box as="span" ml={2} cursor="help">
                        <Info size={14} style={{ display: 'inline' }} />
                      </Box>
                    </Tooltip>
                  </FormLabel>

                  <VStack spacing={3} align="stretch">
                    {Object.entries(TIER_CONFIG).map(([key, config]) => {
                      const IconComponent = config.icon
                      const isSelected = selectedTier === key

                      return (
                        <MotionCard
                          key={key}
                          cursor="pointer"
                          onClick={() => setSelectedTier(key as ProfileTier)}
                          bg={isSelected ? "rgba(212, 175, 55, 0.1)" : "white"}
                          border="2px solid"
                          borderColor={isSelected ? "#D4AF37" : "gray.200"}
                          borderRadius="8px"
                          p={4}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          <HStack spacing={3}>
                            <Box
                              w={10}
                              h={10}
                              bg={isSelected ? "#D4AF37" : "gray.100"}
                              borderRadius="full"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              color={isSelected ? "white" : "gray.500"}
                            >
                              <IconComponent size={20} />
                            </Box>
                            <VStack align="start" spacing={1} flex={1}>
                              <Text
                                fontWeight="600"
                                fontSize="sm"
                                color="#1A1A1A"
                                fontFamily="'Lato', sans-serif"
                              >
                                {config.name}
                              </Text>
                              <Text
                                fontSize="xs"
                                color="#666"
                                fontFamily="'Lato', sans-serif"
                              >
                                {config.price}
                              </Text>
                            </VStack>
                          </HStack>
                          <Text
                            fontSize="xs"
                            color="#666"
                            mt={2}
                            fontFamily="'Lato', sans-serif"
                          >
                            {config.description}
                          </Text>
                        </MotionCard>
                      )
                    })}
                  </VStack>
                </FormControl>
              </MotionBox>

              <Divider borderColor="rgba(212, 175, 55, 0.3)" />

              {/* Save Status */}
              <MotionBox variants={itemVariants}>
                <HStack justify="space-between" align="center">
                  <VStack align="start" spacing={1}>
                    <Text
                      fontSize="xs"
                      color="#666"
                      fontFamily="'Lato', sans-serif"
                    >
                      {isSaving ? 'Saving...' : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Not saved'}
                    </Text>
                    {isSaving && <Spinner size="xs" color="#D4AF37" />}
                  </VStack>

                  <HStack spacing={2}>
                    <Tooltip label="Toggle Preview" placement="top">
                      <IconButton
                        aria-label="Toggle preview"
                        icon={<Eye size={16} />}
                        size="sm"
                        variant={previewMode ? "solid" : "outline"}
                        colorScheme="yellow"
                        onClick={() => setPreviewMode(!previewMode)}
                      />
                    </Tooltip>
                  </HStack>
                </HStack>
              </MotionBox>

              {/* Submit Button */}
              <MotionBox variants={itemVariants}>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  isLoading={isSubmitting}
                  loadingText="Submitting..."
                  bg="#D4AF37"
                  color="white"
                  size="lg"
                  w="full"
                  fontFamily="'Lato', sans-serif"
                  fontWeight="500"
                  leftIcon={<Send size={16} />}
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
                >
                  Submit for Review
                </Button>
                <Text
                  fontSize="xs"
                  color="#666"
                  textAlign="center"
                  mt={2}
                  fontFamily="'Lato', sans-serif"
                >
                  Editorial review & payment step follows
                </Text>
              </MotionBox>
            </VStack>
          </MotionGridItem>

          {/* Main Content Area */}
          <MotionGridItem
            bg="rgba(255, 255, 240, 0.5)"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <Box p={6} h="100vh" overflowY="auto">
              {previewMode ? (
                /* Preview Mode */
                <MotionBox variants={itemVariants}>
                  <Card bg="white" borderRadius="12px" boxShadow="lg" border="1px solid rgba(212, 175, 55, 0.2)">
                    <CardHeader>
                      <HStack justify="space-between" align="center">
                        <Heading
                          as="h2"
                          fontSize="xl"
                          fontFamily="'Playfair Display', serif"
                          color="#1A1A1A"
                        >
                          Live Preview - {TIER_CONFIG[selectedTier].name} Tier
                        </Heading>
                        <Badge colorScheme="yellow" variant="subtle">
                          Preview Mode
                        </Badge>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      {/* Simple preview placeholder */}
                      <VStack spacing={6} align="stretch">
                        <Box textAlign="center">
                          <Heading
                            as="h1"
                            fontSize="3xl"
                            fontFamily="'Playfair Display', serif"
                            color="#1A1A1A"
                            mb={2}
                          >
                            {watchedData.name || 'Your Name'}
                          </Heading>
                          <Text
                            fontSize="lg"
                            color="#666"
                            fontFamily="'Lato', sans-serif"
                            fontStyle="italic"
                          >
                            {watchedData.tagline || 'Your tagline will appear here'}
                          </Text>
                        </Box>

                        {watchedData.heroImage && (
                          <AspectRatio ratio={16/9} maxW="400px" mx="auto">
                            <Image
                              src={watchedData.heroImage}
                              alt="Hero image"
                              borderRadius="8px"
                              objectFit="cover"
                            />
                          </AspectRatio>
                        )}

                        <Box>
                          <Heading
                            as="h3"
                            fontSize="lg"
                            fontFamily="'Playfair Display', serif"
                            color="#1A1A1A"
                            mb={3}
                          >
                            Biography
                          </Heading>
                          <Text
                            color="#333"
                            fontFamily="'Lato', sans-serif"
                            lineHeight="1.7"
                            whiteSpace="pre-wrap"
                          >
                            {watchedData.biography || 'Your biography will appear here...'}
                          </Text>
                        </Box>

                        {achievementFields.length > 0 && (
                          <Box>
                            <Heading
                              as="h3"
                              fontSize="lg"
                              fontFamily="'Playfair Display', serif"
                              color="#1A1A1A"
                              mb={3}
                            >
                              Achievements
                            </Heading>
                            <VStack spacing={3} align="stretch">
                              {achievementFields.map((achievement, index) => (
                                <Box key={achievement.id} p={4} bg="gray.50" borderRadius="8px">
                                  <Text
                                    fontWeight="600"
                                    color="#1A1A1A"
                                    fontFamily="'Lato', sans-serif"
                                    mb={1}
                                  >
                                    {watchedData.achievements?.[index]?.title || 'Achievement Title'}
                                  </Text>
                                  <Text
                                    fontSize="sm"
                                    color="#666"
                                    fontFamily="'Lato', sans-serif"
                                  >
                                    {watchedData.achievements?.[index]?.description || 'Achievement description'}
                                  </Text>
                                </Box>
                              ))}
                            </VStack>
                          </Box>
                        )}

                        <Alert status="info" borderRadius="8px">
                          <AlertIcon />
                          <Text fontSize="sm" fontFamily="'Lato', sans-serif">
                            This is a simplified preview. The actual published profile will include enhanced styling and tier-specific features.
                          </Text>
                        </Alert>
                      </VStack>
                    </CardBody>
                  </Card>
                </MotionBox>
              ) : (
                /* Form Mode */
                <form onSubmit={handleSubmit(onSubmit)}>
                  <VStack spacing={8} align="stretch">
                    {/* Basic Information */}
                    <MotionCard
                      bg="white"
                      borderRadius="12px"
                      boxShadow="lg"
                      border="1px solid rgba(212, 175, 55, 0.2)"
                      variants={itemVariants}
                    >
                      <CardHeader>
                        <Heading
                          as="h2"
                          fontSize="xl"
                          fontFamily="'Playfair Display', serif"
                          color="#1A1A1A"
                        >
                          Basic Information
                        </Heading>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={6}>
                          <HStack spacing={4} w="full" flexDirection={{ base: 'column', md: 'row' }}>
                            <FormControl isInvalid={!!errors.name} flex={1}>
                              <FormLabel
                                fontSize="md"
                                fontFamily="'Lato', sans-serif"
                                color="#1A1A1A"
                                fontWeight="500"
                              >
                                Full Name *
                              </FormLabel>
                              <Input
                                {...register('name')}
                                placeholder="Enter your full name"
                                size="lg"
                                borderColor="gray.300"
                                _hover={{ borderColor: "#D4AF37" }}
                                _focus={{ borderColor: "#D4AF37", boxShadow: "0 0 0 1px #D4AF37" }}
                                bg="white"
                              />
                              <FormErrorMessage color="#FF0000">
                                {errors.name?.message}
                              </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.tagline} flex={1}>
                              <FormLabel
                                fontSize="md"
                                fontFamily="'Lato', sans-serif"
                                color="#1A1A1A"
                                fontWeight="500"
                              >
                                Tagline
                              </FormLabel>
                              <Input
                                {...register('tagline')}
                                placeholder="A brief description of who you are"
                                size="lg"
                                borderColor="gray.300"
                                _hover={{ borderColor: "#D4AF37" }}
                                _focus={{ borderColor: "#D4AF37", boxShadow: "0 0 0 1px #D4AF37" }}
                                bg="white"
                              />
                              <FormErrorMessage color="#FF0000">
                                {errors.tagline?.message}
                              </FormErrorMessage>
                            </FormControl>
                          </HStack>

                          <FormControl isInvalid={!!errors.heroImage}>
                            <FormLabel
                              fontSize="md"
                              fontFamily="'Lato', sans-serif"
                              color="#1A1A1A"
                              fontWeight="500"
                            >
                              Hero Image URL
                            </FormLabel>
                            <Input
                              {...register('heroImage')}
                              placeholder="https://example.com/your-image.jpg"
                              size="lg"
                              borderColor="gray.300"
                              _hover={{ borderColor: "#D4AF37" }}
                              _focus={{ borderColor: "#D4AF37", boxShadow: "0 0 0 1px #D4AF37" }}
                              bg="white"
                            />
                            <FormHelperText color="#666" fontSize="sm">
                              Upload your image to a service like Imgur or use a direct URL
                            </FormHelperText>
                            <FormErrorMessage color="#FF0000">
                              {errors.heroImage?.message}
                            </FormErrorMessage>
                          </FormControl>
                        </VStack>
                      </CardBody>
                    </MotionCard>

                    {/* Biography Section */}
                    <MotionCard
                      bg="white"
                      borderRadius="12px"
                      boxShadow="lg"
                      border="1px solid rgba(212, 175, 55, 0.2)"
                      variants={itemVariants}
                    >
                      <CardHeader>
                        <HStack justify="space-between" align="center">
                          <Heading
                            as="h2"
                            fontSize="xl"
                            fontFamily="'Playfair Display', serif"
                            color="#1A1A1A"
                          >
                            Biography
                          </Heading>
                          <Button
                            leftIcon={<Sparkles size={16} />}
                            onClick={() => handleAIBioPolish(watchedData.biography || '')}
                            size="sm"
                            variant="outline"
                            borderColor="#D4AF37"
                            color="#D4AF37"
                            _hover={{ bg: "#D4AF37", color: "white" }}
                            fontFamily="'Lato', sans-serif"
                          >
                            Polish with AI
                          </Button>
                        </HStack>
                      </CardHeader>
                      <CardBody>
                        <FormControl isInvalid={!!errors.biography}>
                          <FormLabel
                            fontSize="md"
                            fontFamily="'Lato', sans-serif"
                            color="#1A1A1A"
                            fontWeight="500"
                          >
                            Your Story *
                            <Tooltip
                              label="Write freely—our AI turns your notes into a polished narrative suitable for editorial showcase."
                              bg="#D4AF37"
                              color="white"
                              fontSize="sm"
                              borderRadius="md"
                              placement="top"
                            >
                              <Box as="span" ml={2} cursor="help">
                                <Info size={14} style={{ display: 'inline' }} />
                              </Box>
                            </Tooltip>
                          </FormLabel>
                          <Textarea
                            {...register('biography')}
                            placeholder="Tell your story... Share your journey, achievements, and what makes you exceptional. Our AI can help polish this into an editorial-grade narrative."
                            size="lg"
                            minH="200px"
                            borderColor="gray.300"
                            _hover={{ borderColor: "#D4AF37" }}
                            _focus={{ borderColor: "#D4AF37", boxShadow: "0 0 0 1px #D4AF37" }}
                            bg="white"
                            resize="vertical"
                          />
                          <FormHelperText color="#666" fontSize="sm">
                            This will be the main narrative of your profile. Be authentic and comprehensive.
                          </FormHelperText>
                          <FormErrorMessage color="#FF0000">
                            {errors.biography?.message}
                          </FormErrorMessage>
                        </FormControl>
                      </CardBody>
                    </MotionCard>

                    {/* Achievements Section */}
                    <MotionCard
                      bg="white"
                      borderRadius="12px"
                      boxShadow="lg"
                      border="1px solid rgba(212, 175, 55, 0.2)"
                      variants={itemVariants}
                    >
                      <CardHeader>
                        <HStack justify="space-between" align="center">
                          <Heading
                            as="h2"
                            fontSize="xl"
                            fontFamily="'Playfair Display', serif"
                            color="#1A1A1A"
                          >
                            Achievements
                          </Heading>
                          <Button
                            leftIcon={<Plus size={16} />}
                            onClick={() => appendAchievement({ title: '', description: '', year: '' })}
                            size="sm"
                            bg="#D4AF37"
                            color="white"
                            _hover={{ bg: "#B8941F" }}
                            fontFamily="'Lato', sans-serif"
                          >
                            Add Achievement
                          </Button>
                        </HStack>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          {achievementFields.map((field, index) => (
                            <Box
                              key={field.id}
                              p={4}
                              border="1px solid"
                              borderColor="gray.200"
                              borderRadius="8px"
                              bg="gray.50"
                            >
                              <HStack justify="space-between" align="start" mb={3}>
                                <Text
                                  fontSize="sm"
                                  fontWeight="600"
                                  color="#1A1A1A"
                                  fontFamily="'Lato', sans-serif"
                                >
                                  Achievement {index + 1}
                                </Text>
                                <IconButton
                                  aria-label="Remove achievement"
                                  icon={<Trash2 size={16} />}
                                  onClick={() => removeAchievement(index)}
                                  size="sm"
                                  variant="ghost"
                                  colorScheme="red"
                                />
                              </HStack>

                              <VStack spacing={3}>
                                <HStack spacing={3} w="full" flexDirection={{ base: 'column', md: 'row' }}>
                                  <FormControl flex={2}>
                                    <FormLabel fontSize="sm" color="#666">Title</FormLabel>
                                    <Input
                                      {...register(`achievements.${index}.title` as const)}
                                      placeholder="Achievement title"
                                      size="md"
                                      bg="white"
                                    />
                                  </FormControl>
                                  <FormControl flex={1}>
                                    <FormLabel fontSize="sm" color="#666">Year (Optional)</FormLabel>
                                    <Input
                                      {...register(`achievements.${index}.year` as const)}
                                      placeholder="2024"
                                      size="md"
                                      bg="white"
                                    />
                                  </FormControl>
                                </HStack>

                                <FormControl>
                                  <FormLabel fontSize="sm" color="#666">Description</FormLabel>
                                  <Textarea
                                    {...register(`achievements.${index}.description` as const)}
                                    placeholder="Describe this achievement and its impact..."
                                    size="md"
                                    minH="80px"
                                    bg="white"
                                    resize="vertical"
                                  />
                                </FormControl>
                              </VStack>
                            </Box>
                          ))}

                          {achievementFields.length === 0 && (
                            <Box
                              p={8}
                              textAlign="center"
                              border="2px dashed"
                              borderColor="gray.300"
                              borderRadius="8px"
                              bg="gray.50"
                            >
                              <Text color="#666" fontFamily="'Lato', sans-serif" mb={3}>
                                No achievements added yet
                              </Text>
                              <Button
                                leftIcon={<Plus size={16} />}
                                onClick={() => appendAchievement({ title: '', description: '', year: '' })}
                                size="sm"
                                variant="outline"
                                borderColor="#D4AF37"
                                color="#D4AF37"
                                _hover={{ bg: "#D4AF37", color: "white" }}
                              >
                                Add Your First Achievement
                              </Button>
                            </Box>
                          )}
                        </VStack>
                      </CardBody>
                    </MotionCard>

                    {/* Links Section */}
                    <MotionCard
                      bg="white"
                      borderRadius="12px"
                      boxShadow="lg"
                      border="1px solid rgba(212, 175, 55, 0.2)"
                      variants={itemVariants}
                    >
                      <CardHeader>
                        <HStack justify="space-between" align="center">
                          <Heading
                            as="h2"
                            fontSize="xl"
                            fontFamily="'Playfair Display', serif"
                            color="#1A1A1A"
                          >
                            Links & Social Media
                          </Heading>
                          <Button
                            leftIcon={<Plus size={16} />}
                            onClick={() => appendLink({ title: '', url: '', type: 'website' })}
                            size="sm"
                            bg="#D4AF37"
                            color="white"
                            _hover={{ bg: "#B8941F" }}
                            fontFamily="'Lato', sans-serif"
                          >
                            Add Link
                          </Button>
                        </HStack>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          {linkFields.map((field, index) => (
                            <Box
                              key={field.id}
                              p={4}
                              border="1px solid"
                              borderColor="gray.200"
                              borderRadius="8px"
                              bg="gray.50"
                            >
                              <HStack justify="space-between" align="start" mb={3}>
                                <Text
                                  fontSize="sm"
                                  fontWeight="600"
                                  color="#1A1A1A"
                                  fontFamily="'Lato', sans-serif"
                                >
                                  Link {index + 1}
                                </Text>
                                <IconButton
                                  aria-label="Remove link"
                                  icon={<Trash2 size={16} />}
                                  onClick={() => removeLink(index)}
                                  size="sm"
                                  variant="ghost"
                                  colorScheme="red"
                                />
                              </HStack>

                              <VStack spacing={3}>
                                <HStack spacing={3} w="full" flexDirection={{ base: 'column', md: 'row' }}>
                                  <FormControl flex={1}>
                                    <FormLabel fontSize="sm" color="#666">Title</FormLabel>
                                    <Input
                                      {...register(`links.${index}.title` as const)}
                                      placeholder="LinkedIn Profile"
                                      size="md"
                                      bg="white"
                                    />
                                  </FormControl>
                                  <FormControl flex={1}>
                                    <FormLabel fontSize="sm" color="#666">Type</FormLabel>
                                    <Select
                                      {...register(`links.${index}.type` as const)}
                                      size="md"
                                      bg="white"
                                    >
                                      <option value="website">Website</option>
                                      <option value="linkedin">LinkedIn</option>
                                      <option value="twitter">Twitter</option>
                                      <option value="github">GitHub</option>
                                      <option value="portfolio">Portfolio</option>
                                      <option value="other">Other</option>
                                    </Select>
                                  </FormControl>
                                </HStack>

                                <FormControl>
                                  <FormLabel fontSize="sm" color="#666">URL</FormLabel>
                                  <Input
                                    {...register(`links.${index}.url` as const)}
                                    placeholder="https://linkedin.com/in/yourprofile"
                                    size="md"
                                    bg="white"
                                  />
                                </FormControl>
                              </VStack>
                            </Box>
                          ))}

                          {linkFields.length === 0 && (
                            <Box
                              p={8}
                              textAlign="center"
                              border="2px dashed"
                              borderColor="gray.300"
                              borderRadius="8px"
                              bg="gray.50"
                            >
                              <Text color="#666" fontFamily="'Lato', sans-serif" mb={3}>
                                No links added yet
                              </Text>
                              <Button
                                leftIcon={<Plus size={16} />}
                                onClick={() => appendLink({ title: '', url: '', type: 'website' })}
                                size="sm"
                                variant="outline"
                                borderColor="#D4AF37"
                                color="#D4AF37"
                                _hover={{ bg: "#D4AF37", color: "white" }}
                              >
                                Add Your First Link
                              </Button>
                            </Box>
                          )}
                        </VStack>
                      </CardBody>
                    </MotionCard>

                    {/* Visibility Settings */}
                    <MotionCard
                      bg="white"
                      borderRadius="12px"
                      boxShadow="lg"
                      border="1px solid rgba(212, 175, 55, 0.2)"
                      variants={itemVariants}
                    >
                      <CardHeader>
                        <Heading
                          as="h2"
                          fontSize="xl"
                          fontFamily="'Playfair Display', serif"
                          color="#1A1A1A"
                        >
                          Profile Settings
                        </Heading>
                      </CardHeader>
                      <CardBody>
                        <FormControl>
                          <HStack justify="space-between" align="center">
                            <VStack align="start" spacing={1}>
                              <Text
                                fontSize="md"
                                fontFamily="'Lato', sans-serif"
                                color="#1A1A1A"
                                fontWeight="500"
                              >
                                Make Profile Public
                              </Text>
                              <Text
                                fontSize="sm"
                                color="#666"
                                fontFamily="'Lato', sans-serif"
                              >
                                Allow your profile to be visible to the public after approval
                              </Text>
                            </VStack>
                            <Switch
                              {...register('isPublic')}
                              colorScheme="yellow"
                              size="lg"
                            />
                          </HStack>
                        </FormControl>
                      </CardBody>
                    </MotionCard>
                  </VStack>
                </form>
              )}
            </Box>
          </MotionGridItem>
        </Grid>
      </Container>
    </Box>
  )
}