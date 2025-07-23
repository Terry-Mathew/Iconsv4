'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Container,
  Card,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Select,
  Button,
  Progress,
  IconButton,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Badge,
  Divider,
  Checkbox,
  FormHelperText,
  SimpleGrid,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Check, AlertCircle, Crown, Star, Trophy } from 'lucide-react'
// Updated nomination schema for public form with tier selection
interface NominationFormData {
  nominatorName: string
  nominatorEmail: string
  nomineeName: string
  nomineeEmail: string
  pitch: string
  desiredTier: 'rising' | 'elite' | 'legacy'
  links: string[]
  consent: boolean
  website: string // honeypot
}

const MotionBox = motion(Box)
const MotionCard = motion(Card)
const MotionVStack = motion(VStack)
const MotionFormControl = motion(FormControl)

// Tier configuration for public nomination
const TIER_CONFIG = {
  rising: {
    name: 'Rising',
    price: '₹3,000/year',
    description: 'For emerging brilliance—showcase your potential with essential profile features',
    icon: Star,
    color: 'green.500',
    features: ['Professional profile', 'Biography & achievements', 'Contact links', 'Basic gallery']
  },
  elite: {
    name: 'Elite',
    price: '₹10,000/year',
    description: 'For commanding presence—establish authority with enhanced features',
    icon: Crown,
    color: 'blue.500',
    features: ['Everything in Rising', 'Featured quote section', 'Extended gallery', 'Project showcase', 'Priority support']
  },
  legacy: {
    name: 'Legacy',
    price: '₹20,000 one-time',
    description: 'For eternal reverence—immortalize your impact with premium features',
    icon: Trophy,
    color: 'purple.500',
    features: ['Everything in Elite', 'Timeline & milestones', 'Memorial gallery', 'Legacy statement', 'Lifetime preservation']
  }
} as const

// Helper function to calculate form completion progress
function calculateProgress(data: Partial<NominationFormData>): number {
  const requiredFields = [
    'nominatorEmail',
    'nominatorName',
    'nomineeName',
    'nomineeEmail',
    'pitch',
    'desiredTier',
    'consent'
  ]

  let completed = 0
  requiredFields.forEach(field => {
    if (data[field as keyof NominationFormData]) {
      completed++
    }
  })

  return Math.round((completed / requiredFields.length) * 100)
}

export default function NominatePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<NominationFormData>({
    defaultValues: {
      nominatorEmail: '',
      nominatorName: '',
      nomineeName: '',
      nomineeEmail: '',
      pitch: '',
      desiredTier: 'rising' as const,
      links: [],
      consent: false,
      website: '', // Honeypot field
    },
    mode: 'onChange',
  })

  // Handle links manually since it's an array of strings
  const linkFields = watch('links') || []
  const appendLink = (value: string = '') => {
    const current = watch('links') || []
    if (current.length < 3) {
      setValue('links', [...current, value], { shouldValidate: true })
    }
  }
  const removeLink = (index: number) => {
    const current = watch('links') || []
    setValue('links', current.filter((_, i) => i !== index), { shouldValidate: true })
  }

  const watchedFields = watch()
  const progress = calculateProgress(watchedFields)
  const pitchLength = watchedFields.pitch?.length || 0

  // Check if form can be submitted
  const canSubmit = isValid &&
    watchedFields.nominatorEmail &&
    watchedFields.nominatorName &&
    watchedFields.nomineeName &&
    watchedFields.nomineeEmail &&
    watchedFields.pitch &&
    watchedFields.desiredTier &&
    watchedFields.consent &&
    !watchedFields.website // Honeypot check

  const onSubmit = async (data: NominationFormData) => {
    setIsSubmitting(true)

    // Check honeypot field
    if (data.website && data.website.length > 0) {
      toast({
        title: 'Spam Detected',
        description: 'Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/nominations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to submit nomination')
      }

      // Show success modal
      onOpen()
      
      toast({
        title: 'Nomination Submitted',
        description: 'Your nomination is under review. Icons are born here.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      reset()
    } catch (error) {
      console.error('Submission error:', error)
      toast({
        title: 'Submission Failed',
        description: 'Please check your connection and try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
    <>
      <Box 
        minH="100vh" 
        bg="#D2B48C" 
        py={{ base: 8, md: 16 }}
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
        <Container maxW="800px" position="relative" zIndex={2}>
          <MotionVStack
            spacing={8}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <MotionBox textAlign="center" variants={itemVariants}>
              <Heading
                as="h1"
                fontSize={{ base: '2xl', md: '3xl' }}
                fontFamily="'Playfair Display', serif"
                color="#1A1A1A"
                fontWeight="400"
                mb={4}
              >
                Nominate an Icon
              </Heading>
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                fontFamily="'Lato', sans-serif"
                color="#333"
                maxW="600px"
                lineHeight="1.6"
                fontStyle="italic"
              >
                Enter the vault of excellence. Nominating places you or your icon in consideration 
                for an eternal profile—curated, prestigious, and invitation-only.
              </Text>
            </MotionBox>

            {/* Main Form Card */}
            <MotionCard
              w="full"
              bg="white"
              borderRadius="8px"
              boxShadow="0 8px 32px rgba(0, 0, 0, 0.12)"
              border="1px solid"
              borderColor="rgba(212, 175, 55, 0.2)"
              variants={itemVariants}
              whileHover={{
                boxShadow: "0 12px 40px rgba(212, 175, 55, 0.2)",
                transition: { duration: 0.3 }
              }}
            >
              <CardBody p={{ base: 6, md: 8 }}>
                {/* Progress Bar */}
                <MotionBox mb={8} variants={itemVariants}>
                  <HStack justify="space-between" mb={2}>
                    <Text
                      fontSize="sm"
                      fontFamily="'Lato', sans-serif"
                      color="#1A1A1A"
                      fontWeight="500"
                    >
                      Completion Progress
                    </Text>
                    <Badge
                      colorScheme="yellow"
                      variant="subtle"
                      fontSize="xs"
                      px={2}
                      py={1}
                    >
                      {progress}% Complete
                    </Badge>
                  </HStack>
                  <Progress
                    value={progress}
                    colorScheme="yellow"
                    bg="gray.100"
                    borderRadius="full"
                    size="lg"
                    sx={{
                      '& > div': {
                        background: 'linear-gradient(90deg, #D4AF37, #F4E4BC)',
                      }
                    }}
                  />
                </MotionBox>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <VStack spacing={8} align="stretch">
                    {/* Step 1: Personal Information */}
                    <MotionBox variants={itemVariants}>
                      <Heading
                        as="h2"
                        fontSize="xl"
                        fontFamily="'Playfair Display', serif"
                        color="#1A1A1A"
                        mb={6}
                        display="flex"
                        alignItems="center"
                        gap={3}
                      >
                        <Box
                          w={8}
                          h={8}
                          bg="linear-gradient(135deg, #D4AF37, #F4E4BC)"
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          color="white"
                          fontSize="sm"
                          fontWeight="bold"
                        >
                          1
                        </Box>
                        Your Information
                      </Heading>

                      <VStack spacing={6}>
                        <HStack spacing={4} w="full" flexDirection={{ base: 'column', md: 'row' }}>
                          <MotionFormControl
                            isInvalid={!!errors.nominatorName}
                            variants={itemVariants}
                            flex={1}
                          >
                            <FormLabel
                              fontSize="1.25rem"
                              fontFamily="'Lato', sans-serif"
                              color="#1A1A1A"
                              fontWeight="500"
                            >
                              Your Full Name *
                            </FormLabel>
                            <Input
                              {...register('nominatorName')}
                              placeholder="Enter your full name"
                              size="lg"
                              borderColor="gray.300"
                              _hover={{ borderColor: "#D4AF37" }}
                              _focus={{ borderColor: "#D4AF37", boxShadow: "0 0 0 1px #D4AF37" }}
                              bg="white"
                              aria-label="Your full name, required"
                            />
                            <FormErrorMessage color="#FF0000">
                              {errors.nominatorName?.message}
                            </FormErrorMessage>
                          </MotionFormControl>

                          <MotionFormControl
                            isInvalid={!!errors.nominatorEmail}
                            variants={itemVariants}
                            flex={1}
                          >
                            <FormLabel
                              fontSize="1.25rem"
                              fontFamily="'Lato', sans-serif"
                              color="#1A1A1A"
                              fontWeight="500"
                            >
                              Your Email *
                            </FormLabel>
                            <Input
                              {...register('nominatorEmail')}
                              type="email"
                              placeholder="your.email@example.com"
                              size="lg"
                              borderColor="gray.300"
                              _hover={{ borderColor: "#D4AF37" }}
                              _focus={{ borderColor: "#D4AF37", boxShadow: "0 0 0 1px #D4AF37" }}
                              bg="white"
                              aria-label="Your email address, required"
                            />
                            <FormErrorMessage color="#FF0000">
                              {errors.nominatorEmail?.message}
                            </FormErrorMessage>
                          </MotionFormControl>
                        </HStack>
                      </VStack>
                    </MotionBox>

                    <Divider borderColor="rgba(212, 175, 55, 0.3)" />

                    {/* Step 2: Nominee Information */}
                    <MotionBox variants={itemVariants}>
                      <Heading
                        as="h2"
                        fontSize="xl"
                        fontFamily="'Playfair Display', serif"
                        color="#1A1A1A"
                        mb={6}
                        display="flex"
                        alignItems="center"
                        gap={3}
                      >
                        <Box
                          w={8}
                          h={8}
                          bg="linear-gradient(135deg, #D4AF37, #F4E4BC)"
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          color="white"
                          fontSize="sm"
                          fontWeight="bold"
                        >
                          2
                        </Box>
                        Nominee Details
                      </Heading>

                      <VStack spacing={6}>
                        <HStack spacing={4} w="full" flexDirection={{ base: 'column', md: 'row' }}>
                          <MotionFormControl
                            isInvalid={!!errors.nomineeName}
                            variants={itemVariants}
                            flex={1}
                          >
                            <FormLabel
                              fontSize="1.25rem"
                              fontFamily="'Lato', sans-serif"
                              color="#1A1A1A"
                              fontWeight="500"
                            >
                              Nominee Full Name *
                            </FormLabel>
                            <Input
                              {...register('nomineeName')}
                              placeholder="Enter nominee's full name"
                              size="lg"
                              borderColor="gray.300"
                              _hover={{ borderColor: "#D4AF37" }}
                              _focus={{ borderColor: "#D4AF37", boxShadow: "0 0 0 1px #D4AF37" }}
                              bg="white"
                              aria-label="Nominee full name, required"
                            />
                            <FormErrorMessage color="#FF0000">
                              {errors.nomineeName?.message}
                            </FormErrorMessage>
                          </MotionFormControl>

                          <MotionFormControl
                            isInvalid={!!errors.nomineeEmail}
                            variants={itemVariants}
                            flex={1}
                          >
                            <FormLabel
                              fontSize="1.25rem"
                              fontFamily="'Lato', sans-serif"
                              color="#1A1A1A"
                              fontWeight="500"
                            >
                              Nominee Email *
                            </FormLabel>
                            <Input
                              {...register('nomineeEmail')}
                              type="email"
                              placeholder="nominee@example.com"
                              size="lg"
                              borderColor="gray.300"
                              _hover={{ borderColor: "#D4AF37" }}
                              _focus={{ borderColor: "#D4AF37", boxShadow: "0 0 0 1px #D4AF37" }}
                              bg="white"
                              aria-label="Nominee email address, required"
                            />
                            <FormErrorMessage color="#FF0000">
                              {errors.nomineeEmail?.message}
                            </FormErrorMessage>
                          </MotionFormControl>
                        </HStack>

                        {/* Pitch */}
                        <MotionFormControl
                          isInvalid={!!errors.pitch}
                          variants={itemVariants}
                        >
                          <FormLabel
                            fontSize="1.25rem"
                            fontFamily="'Lato', sans-serif"
                            color="#1A1A1A"
                            fontWeight="500"
                          >
                            Why should they be featured? *
                          </FormLabel>
                          <Textarea
                            {...register('pitch')}
                            placeholder="Describe their achievements, impact, and why they deserve recognition..."
                            size="lg"
                            minH="120px"
                            borderColor="gray.300"
                            _hover={{ borderColor: "#D4AF37" }}
                            _focus={{ borderColor: "#D4AF37", boxShadow: "0 0 0 1px #D4AF37" }}
                            bg="white"
                            resize="vertical"
                            aria-label="Nominee achievements and impact, required"
                          />
                          <HStack justify="space-between" mt={1}>
                            <FormErrorMessage color="#FF0000">
                              {errors.pitch?.message}
                            </FormErrorMessage>
                            <Text
                              fontSize="xs"
                              color={pitchLength > 5000 ? "#FF0000" : "#666"}
                              fontFamily="'Lato', sans-serif"
                            >
                              {pitchLength}/5000 characters
                            </Text>
                          </HStack>
                        </MotionFormControl>
                      </VStack>
                    </MotionBox>

                    <Divider borderColor="rgba(212, 175, 55, 0.3)" />

                    {/* Step 3: Tier Selection */}
                    <MotionBox variants={itemVariants}>
                      <Heading
                        as="h2"
                        fontSize="xl"
                        fontFamily="'Playfair Display', serif"
                        color="#1A1A1A"
                        mb={6}
                        display="flex"
                        alignItems="center"
                        gap={3}
                      >
                        <Box
                          w={8}
                          h={8}
                          bg="linear-gradient(135deg, #D4AF37, #F4E4BC)"
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          color="white"
                          fontSize="sm"
                          fontWeight="bold"
                        >
                          3
                        </Box>
                        Desired Tier
                      </Heading>

                      <VStack spacing={6}>
                        <Text
                          fontSize="md"
                          color="#666"
                          fontFamily="'Lato', sans-serif"
                          textAlign="center"
                          fontStyle="italic"
                        >
                          Choose the tier that best represents the nominee's stature.
                          Final tier assignment is subject to editorial review.
                        </Text>

                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} w="full">
                          {Object.entries(TIER_CONFIG).map(([key, config]) => {
                            const IconComponent = config.icon
                            const isSelected = watchedFields.desiredTier === key

                            return (
                              <MotionCard
                                key={key}
                                cursor="pointer"
                                onClick={() => setValue('desiredTier', key as 'rising' | 'elite' | 'legacy', { shouldValidate: true })}
                                bg={isSelected ? "rgba(212, 175, 55, 0.1)" : "white"}
                                border="2px solid"
                                borderColor={isSelected ? "#D4AF37" : "gray.200"}
                                borderRadius="12px"
                                p={6}
                                whileHover={{ scale: 1.02, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                boxShadow={isSelected ? "0 8px 25px rgba(212, 175, 55, 0.2)" : "md"}
                              >
                                <VStack spacing={4} textAlign="center">
                                  <Box
                                    w={12}
                                    h={12}
                                    bg={isSelected ? "#D4AF37" : "gray.100"}
                                    borderRadius="full"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    color={isSelected ? "white" : "gray.500"}
                                  >
                                    <IconComponent size={24} />
                                  </Box>

                                  <VStack spacing={2}>
                                    <Heading
                                      as="h3"
                                      fontSize="xl"
                                      fontFamily="'Playfair Display', serif"
                                      color="#1A1A1A"
                                      fontWeight="400"
                                    >
                                      {config.name}
                                    </Heading>
                                    <Badge
                                      colorScheme={isSelected ? "yellow" : "gray"}
                                      variant="subtle"
                                      fontSize="sm"
                                      px={3}
                                      py={1}
                                    >
                                      {config.price}
                                    </Badge>
                                  </VStack>

                                  <Text
                                    fontSize="sm"
                                    color="#666"
                                    fontFamily="'Lato', sans-serif"
                                    lineHeight="1.5"
                                  >
                                    {config.description}
                                  </Text>

                                  <VStack spacing={1} align="start" w="full">
                                    {config.features.slice(0, 3).map((feature, index) => (
                                      <HStack key={index} spacing={2}>
                                        <Box w={1} h={1} bg="#D4AF37" borderRadius="full" />
                                        <Text fontSize="xs" color="#666" fontFamily="'Lato', sans-serif">
                                          {feature}
                                        </Text>
                                      </HStack>
                                    ))}
                                    {config.features.length > 3 && (
                                      <Text fontSize="xs" color="#D4AF37" fontFamily="'Lato', sans-serif" fontStyle="italic">
                                        +{config.features.length - 3} more features
                                      </Text>
                                    )}
                                  </VStack>
                                </VStack>
                              </MotionCard>
                            )
                          })}
                        </SimpleGrid>

                        <FormControl isInvalid={!!errors.desiredTier}>
                          <FormErrorMessage color="#FF0000">
                            Please select a desired tier
                          </FormErrorMessage>
                        </FormControl>
                      </VStack>
                    </MotionBox>

                    <Divider borderColor="rgba(212, 175, 55, 0.3)" />

                    {/* Step 4: Supporting Links */}
                    <MotionBox variants={itemVariants}>
                      <Heading
                        as="h2"
                        fontSize="xl"
                        fontFamily="'Playfair Display', serif"
                        color="#1A1A1A"
                        mb={6}
                        display="flex"
                        alignItems="center"
                        gap={3}
                      >
                        <Box
                          w={8}
                          h={8}
                          bg="linear-gradient(135deg, #D4AF37, #F4E4BC)"
                          borderRadius="full"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          color="white"
                          fontSize="sm"
                          fontWeight="bold"
                        >
                          4
                        </Box>
                        Supporting Links
                      </Heading>

                      <VStack spacing={6}>
                        {/* Links Section */}
                        <MotionFormControl variants={itemVariants}>
                          <FormLabel
                            fontSize="1.25rem"
                            fontFamily="'Lato', sans-serif"
                            color="#1A1A1A"
                            fontWeight="500"
                          >
                            Supporting Links (Optional)
                          </FormLabel>
                          <VStack spacing={3} align="stretch">
                            {linkFields.map((link, index) => (
                              <HStack key={index} spacing={2}>
                                <Input
                                  value={link}
                                  onChange={(e) => {
                                    const newLinks = [...linkFields]
                                    newLinks[index] = e.target.value
                                    setValue('links', newLinks, { shouldValidate: true })
                                  }}
                                  placeholder={`Link ${index + 1} (e.g., LinkedIn, website, portfolio)`}
                                  size="lg"
                                  borderColor="gray.300"
                                  _hover={{ borderColor: "#D4AF37" }}
                                  _focus={{ borderColor: "#D4AF37", boxShadow: "0 0 0 1px #D4AF37" }}
                                  bg="white"
                                />
                                <IconButton
                                  aria-label="Remove link"
                                  icon={<Trash2 size={16} />}
                                  onClick={() => removeLink(index)}
                                  colorScheme="red"
                                  variant="ghost"
                                  size="lg"
                                />
                              </HStack>
                            ))}
                            {linkFields.length < 3 && (
                              <Button
                                leftIcon={<Plus size={16} />}
                                onClick={() => appendLink()}
                                variant="outline"
                                borderColor="#D4AF37"
                                color="#D4AF37"
                                _hover={{ bg: "#D4AF37", color: "white" }}
                                size="sm"
                                alignSelf="flex-start"
                              >
                                Add Link
                              </Button>
                            )}
                          </VStack>
                          <FormHelperText color="#666" fontSize="sm">
                            Add up to 3 links to showcase the nominee's work or achievements.
                          </FormHelperText>
                        </MotionFormControl>
                      </VStack>
                    </MotionBox>

                    <Divider borderColor="rgba(212, 175, 55, 0.3)" />

                    {/* Consent and Submit */}
                    <MotionBox variants={itemVariants}>
                      <VStack spacing={6}>
                        <MotionFormControl
                          isInvalid={!!errors.consent}
                          variants={itemVariants}
                        >
                          <Checkbox
                            {...register('consent')}
                            colorScheme="yellow"
                            size="lg"
                            fontFamily="'Lato', sans-serif"
                            color="#1A1A1A"
                          >
                            I confirm that I have permission to nominate this person and that all information provided is accurate. *
                          </Checkbox>
                          <FormErrorMessage color="#FF0000">
                            {errors.consent?.message}
                          </FormErrorMessage>
                        </MotionFormControl>

                        {/* Honeypot field - hidden */}
                        <Input
                          {...register('website')}
                          type="text"
                          style={{ display: 'none' }}
                          tabIndex={-1}
                          autoComplete="off"
                        />

                        <Button
                          type="submit"
                          size="lg"
                          bg="#D4AF37"
                          color="white"
                          fontFamily="'Lato', sans-serif"
                          fontWeight="500"
                          px={12}
                          py={6}
                          fontSize="lg"
                          borderRadius="4px"
                          isLoading={isSubmitting}
                          loadingText="Submitting..."
                          isDisabled={!canSubmit}
                          _hover={{
                            bg: "#B8941F",
                            transform: "translateY(-2px)",
                            boxShadow: "0 8px 25px rgba(212, 175, 55, 0.3)"
                          }}
                          _disabled={{
                            bg: "gray.300",
                            color: "gray.500",
                            cursor: "not-allowed",
                            transform: "none",
                            boxShadow: "none"
                          }}
                          transition="all 0.2s"
                          w="full"
                        >
                          Submit Nomination
                        </Button>

                        <Text
                          fontSize="xs"
                          color="#666"
                          textAlign="center"
                          fontFamily="'Lato', sans-serif"
                          maxW="400px"
                        >
                          By submitting, you agree to our terms and acknowledge that nominations are subject to editorial review.
                        </Text>
                      </VStack>
                    </MotionBox>
                  </VStack>
                </form>
              </CardBody>
            </MotionCard>
          </MotionVStack>
        </Container>
      </Box>

      {/* Success Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent
          bg="white"
          borderRadius="12px"
          boxShadow="0 20px 60px rgba(212, 175, 55, 0.3)"
          border="2px solid"
          borderColor="#D4AF37"
          mx={4}
        >
          <ModalCloseButton
            color="#D4AF37"
            _hover={{ bg: "rgba(212, 175, 55, 0.1)" }}
          />
          <ModalBody p={8}>
            <VStack spacing={6} textAlign="center">
              <MotionBox
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              >
                <Box
                  w={20}
                  h={20}
                  bg="linear-gradient(135deg, #D4AF37, #F4E4BC)"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb={4}
                >
                  <Crown size={40} color="white" />
                </Box>
              </MotionBox>

              <VStack spacing={3}>
                <Heading
                  as="h3"
                  fontSize="2xl"
                  fontFamily="'Playfair Display', serif"
                  color="#1A1A1A"
                  fontWeight="400"
                >
                  Nomination Submitted
                </Heading>
                <Text
                  fontSize="lg"
                  fontFamily="'Lato', sans-serif"
                  color="#333"
                  lineHeight="1.6"
                >
                  Your nomination is under review—icons are born here.
                </Text>
                <Text
                  fontSize="sm"
                  color="#666"
                  fontFamily="'Lato', sans-serif"
                  maxW="400px"
                >
                  Our editorial team will carefully evaluate the submission and reach out within 5-7 business days with next steps.
                </Text>
              </VStack>

              <VStack spacing={3} w="full">
                <Button
                  onClick={onClose}
                  bg="#D4AF37"
                  color="white"
                  size="lg"
                  fontFamily="'Lato', sans-serif"
                  _hover={{ bg: "#B8941F" }}
                  w="full"
                >
                  Submit Another Nomination
                </Button>
                <Button
                  as="a"
                  href="/"
                  variant="ghost"
                  color="#D4AF37"
                  size="lg"
                  fontFamily="'Lato', sans-serif"
                  _hover={{ bg: "rgba(212, 175, 55, 0.1)" }}
                >
                  Return to Home
                </Button>
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
