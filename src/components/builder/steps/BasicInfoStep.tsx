'use client'

import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  Button,
  Card,
  CardBody,
  Image,
  AspectRatio,
  IconButton,
  useToast,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Upload, X, Camera, User, FileText } from 'lucide-react'
import { useRef, useState } from 'react'
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form'

const MotionBox = motion.create(Box)
const MotionCard = motion.create(Card)

interface BasicInfoStepProps {
  register: UseFormRegister<any>
  errors: FieldErrors
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
  onNext: () => void
  onPrevious: () => void
}

export function BasicInfoStep({
  register,
  errors,
  setValue,
  watch,
  onNext,
  onPrevious,
}: BasicInfoStepProps) {
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const name = watch('name')
  const tagline = watch('tagline')
  const heroImage = watch('heroImage')

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload an image file (JPG, PNG, WebP)',
        status: 'error',
        duration: 3000,
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please upload an image smaller than 5MB',
        status: 'error',
        duration: 3000,
      })
      return
    }

    setIsUploading(true)

    try {
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      // TODO: Upload to actual storage service
      // For now, just use the preview URL
      setValue('heroImage', url)

      toast({
        title: 'Image Uploaded',
        description: 'Your hero image has been uploaded successfully',
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload image. Please try again.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    setValue('heroImage', '')
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const isValid = name && tagline && (heroImage || previewUrl)

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <MotionBox
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      maxW="4xl"
      mx="auto"
      px={6}
      py={8}
    >
      <VStack spacing={8}>
        {/* Header */}
        <MotionBox variants={itemVariants} textAlign="center">
          <Heading
            as="h2"
            fontSize={{ base: '2xl', md: '3xl' }}
            fontFamily="'Playfair Display', serif"
            color="#1A1A1A"
            mb={2}
          >
            Basic Information
          </Heading>
          <Text color="#8B8680" fontSize="lg">
            Let's start with the essentials that define your profile
          </Text>
        </MotionBox>

        {/* Form Fields */}
        <VStack spacing={6} w="full">
          {/* Name Field */}
          <MotionCard variants={itemVariants} w="full">
            <CardBody p={6}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel
                  fontSize="md"
                  fontWeight="600"
                  color="#1A1A1A"
                  mb={2}
                >
                  <HStack>
                    <User size={18} />
                    <Text>Full Name</Text>
                  </HStack>
                </FormLabel>
                <Input
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                  placeholder="Enter your full name"
                  size="lg"
                  bg="white"
                  border="2px solid #E8E0D0"
                  _focus={{
                    borderColor: '#D4AF37',
                    boxShadow: '0 0 0 1px #D4AF37',
                  }}
                />
                <FormErrorMessage>{errors.name?.message as string}</FormErrorMessage>
                <FormHelperText>
                  This will be displayed as your profile headline
                </FormHelperText>
              </FormControl>
            </CardBody>
          </MotionCard>

          {/* Tagline Field */}
          <MotionCard variants={itemVariants} w="full">
            <CardBody p={6}>
              <FormControl isInvalid={!!errors.tagline}>
                <FormLabel
                  fontSize="md"
                  fontWeight="600"
                  color="#1A1A1A"
                  mb={2}
                >
                  <HStack>
                    <FileText size={18} />
                    <Text>Professional Tagline</Text>
                  </HStack>
                </FormLabel>
                <Textarea
                  {...register('tagline', {
                    required: 'Tagline is required',
                    maxLength: {
                      value: 150,
                      message: 'Tagline must be less than 150 characters',
                    },
                  })}
                  placeholder="A brief, compelling description of who you are and what you do"
                  size="lg"
                  bg="white"
                  border="2px solid #E8E0D0"
                  _focus={{
                    borderColor: '#D4AF37',
                    boxShadow: '0 0 0 1px #D4AF37',
                  }}
                  rows={3}
                  resize="vertical"
                />
                <FormErrorMessage>{errors.tagline?.message as string}</FormErrorMessage>
                <FormHelperText>
                  {tagline?.length || 0}/150 characters - This appears below your name
                </FormHelperText>
              </FormControl>
            </CardBody>
          </MotionCard>

          {/* Hero Image Upload */}
          <MotionCard variants={itemVariants} w="full">
            <CardBody p={6}>
              <FormControl isInvalid={!!errors.heroImage}>
                <FormLabel
                  fontSize="md"
                  fontWeight="600"
                  color="#1A1A1A"
                  mb={4}
                >
                  <HStack>
                    <Camera size={18} />
                    <Text>Hero Image</Text>
                  </HStack>
                </FormLabel>

                {previewUrl || heroImage ? (
                  <Box position="relative">
                    <AspectRatio ratio={16 / 9} maxW="500px">
                      <Image
                        src={previewUrl || heroImage}
                        alt="Hero image preview"
                        objectFit="cover"
                        borderRadius="lg"
                        border="2px solid #E8E0D0"
                      />
                    </AspectRatio>
                    <IconButton
                      aria-label="Remove image"
                      icon={<X size={16} />}
                      size="sm"
                      colorScheme="red"
                      position="absolute"
                      top={2}
                      right={2}
                      onClick={removeImage}
                    />
                  </Box>
                ) : (
                  <Box
                    border="2px dashed #E8E0D0"
                    borderRadius="lg"
                    p={8}
                    textAlign="center"
                    cursor="pointer"
                    _hover={{ borderColor: '#D4AF37', bg: 'rgba(212, 175, 55, 0.05)' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <VStack spacing={3}>
                      <Upload size={32} color="#8B8680" />
                      <Text color="#8B8680" fontSize="md">
                        Click to upload your hero image
                      </Text>
                      <Text color="#8B8680" fontSize="sm">
                        JPG, PNG, or WebP • Max 5MB • 16:9 ratio recommended
                      </Text>
                    </VStack>
                  </Box>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />

                <FormErrorMessage>{errors.heroImage?.message as string}</FormErrorMessage>
                <FormHelperText>
                  This image will be the main visual element of your profile
                </FormHelperText>
              </FormControl>
            </CardBody>
          </MotionCard>
        </VStack>

        {/* Navigation Buttons */}
        <HStack spacing={4} w="full" justify="space-between">
          <Button
            variant="outline"
            colorScheme="gray"
            onClick={onPrevious}
            size="lg"
          >
            Previous
          </Button>

          <Button
            bg="#D4AF37"
            color="white"
            _hover={{ bg: '#B8941F' }}
            onClick={onNext}
            size="lg"
            isDisabled={!isValid}
            isLoading={isUploading}
          >
            Continue
          </Button>
        </HStack>

        {!isValid && (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            Please fill in all required fields to continue
          </Alert>
        )}
      </VStack>
    </MotionBox>
  )
}
