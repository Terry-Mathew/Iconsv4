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
  Textarea,
  Button,
  Card,
  CardBody,
  CardHeader,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  useToast,
  Alert,
  AlertIcon,
  Divider,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FileText, Sparkles, Eye, Edit3 } from 'lucide-react'
import { useState } from 'react'
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form'

const MotionBox = motion.create(Box)
const MotionCard = motion.create(Card)

interface BiographyStepProps {
  register: UseFormRegister<any>
  errors: FieldErrors
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
  onNext: () => void
  onPrevious: () => void
  selectedTier: string
}

export function BiographyStep({
  register,
  errors,
  setValue,
  watch,
  onNext,
  onPrevious,
  selectedTier,
}: BiographyStepProps) {
  const toast = useToast()
  const [isPolishing, setIsPolishing] = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  const originalBio = watch('bio.original')
  const polishedBio = watch('bio.ai_polished')

  const handleAIPolish = async () => {
    if (!originalBio?.trim()) {
      toast({
        title: 'No Content to Polish',
        description: 'Please write your biography first',
        status: 'warning',
        duration: 3000,
      })
      return
    }

    setIsPolishing(true)

    try {
      const response = await fetch('/api/ai/polish-bio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalBio,
          tone: 'professional',
          tier: selectedTier,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to polish biography')
      }

      const data = await response.json()
      setValue('bio.ai_polished', data.polishedBio)
      setActiveTab(1) // Switch to polished tab

      toast({
        title: 'Biography Polished!',
        description: 'AI has enhanced your biography with professional language',
        status: 'success',
        duration: 5000,
      })
    } catch (error) {
      console.error('AI Polish error:', error)
      toast({
        title: 'Polish Failed',
        description: 'Unable to polish biography. Please try again.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsPolishing(false)
    }
  }

  const usePolishedVersion = () => {
    if (polishedBio) {
      setValue('bio.original', polishedBio)
      setValue('bio.ai_polished', '')
      setActiveTab(0)
      toast({
        title: 'Biography Updated',
        description: 'Polished version is now your main biography',
        status: 'success',
        duration: 3000,
      })
    }
  }

  const isValid = originalBio?.trim()

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
            Your Biography
          </Heading>
          <Text color="#8B8680" fontSize="lg" maxW="600px">
            Tell your story in your own words. Our AI can help polish it to perfection.
          </Text>
        </MotionBox>

        {/* Biography Form */}
        <MotionCard variants={itemVariants} w="full">
          <CardHeader pb={2}>
            <HStack justify="space-between" align="center">
              <HStack>
                <FileText size={20} />
                <Text fontSize="lg" fontWeight="600" color="#1A1A1A">
                  Biography Content
                </Text>
              </HStack>
              <Button
                leftIcon={<Sparkles size={16} />}
                size="sm"
                bg="#D4AF37"
                color="white"
                _hover={{ bg: '#B8941F' }}
                onClick={handleAIPolish}
                isLoading={isPolishing}
                loadingText="Polishing..."
                isDisabled={!originalBio?.trim()}
              >
                AI Polish
              </Button>
            </HStack>
          </CardHeader>

          <CardBody pt={2}>
            <Tabs index={activeTab} onChange={setActiveTab}>
              <TabList>
                <Tab>
                  <HStack>
                    <Edit3 size={16} />
                    <Text>Original</Text>
                  </HStack>
                </Tab>
                {polishedBio && (
                  <Tab>
                    <HStack>
                      <Sparkles size={16} />
                      <Text>AI Polished</Text>
                      <Badge colorScheme="green" size="sm">
                        New
                      </Badge>
                    </HStack>
                  </Tab>
                )}
              </TabList>

              <TabPanels>
                {/* Original Biography Tab */}
                <TabPanel px={0} py={4}>
                  <FormControl isInvalid={!!(errors.bio as any)?.original}>
                    <FormLabel fontSize="sm" color="#8B8680" mb={2}>
                      Write your biography in your own voice
                    </FormLabel>
                    <Textarea
                      {...register('bio.original', {
                        required: 'Biography is required',
                        minLength: {
                          value: 100,
                          message: 'Biography should be at least 100 characters',
                        },
                      })}
                      placeholder="Share your journey, achievements, and what drives you. Include your background, key accomplishments, and what makes you unique..."
                      size="lg"
                      bg="white"
                      border="2px solid #E8E0D0"
                      _focus={{
                        borderColor: '#D4AF37',
                        boxShadow: '0 0 0 1px #D4AF37',
                      }}
                      rows={8}
                      resize="vertical"
                    />
                    <FormErrorMessage>{((errors.bio as any)?.original?.message) as string}</FormErrorMessage>
                    <FormHelperText>
                      {originalBio?.length || 0} characters • Minimum 100 characters recommended
                    </FormHelperText>
                  </FormControl>
                </TabPanel>

                {/* AI Polished Biography Tab */}
                {polishedBio && (
                  <TabPanel px={0} py={4}>
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="#8B8680">
                          AI-enhanced version with professional language
                        </Text>
                        <Button
                          size="sm"
                          variant="outline"
                          colorScheme="green"
                          onClick={usePolishedVersion}
                        >
                          Use This Version
                        </Button>
                      </HStack>
                      
                      <Box
                        p={4}
                        bg="rgba(212, 175, 55, 0.05)"
                        border="2px solid #E8E0D0"
                        borderRadius="md"
                        minH="200px"
                      >
                        <Text
                          fontSize="md"
                          lineHeight="1.6"
                          color="#1A1A1A"
                          whiteSpace="pre-wrap"
                        >
                          {polishedBio}
                        </Text>
                      </Box>
                      
                      <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm" fontWeight="600">
                            AI Enhancement Applied
                          </Text>
                          <Text fontSize="xs">
                            Your biography has been refined for clarity, impact, and professional tone.
                            You can use this version or continue editing your original.
                          </Text>
                        </VStack>
                      </Alert>
                    </VStack>
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </CardBody>
        </MotionCard>

        {/* Writing Tips */}
        <MotionCard variants={itemVariants} w="full" bg="rgba(212, 175, 55, 0.05)">
          <CardBody p={6}>
            <VStack spacing={3} align="start">
              <HStack>
                <Eye size={18} color="#D4AF37" />
                <Text fontSize="md" fontWeight="600" color="#1A1A1A">
                  Writing Tips
                </Text>
              </HStack>
              <VStack spacing={2} align="start" fontSize="sm" color="#8B8680">
                <Text>• Start with your current role or main achievement</Text>
                <Text>• Include 3-5 key accomplishments or experiences</Text>
                <Text>• Mention your expertise areas and passions</Text>
                <Text>• End with your vision or what drives you</Text>
                <Text>• Keep it authentic and in your own voice</Text>
              </VStack>
            </VStack>
          </CardBody>
        </MotionCard>

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
          >
            Continue
          </Button>
        </HStack>

        {!isValid && (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            Please write your biography to continue
          </Alert>
        )}
      </VStack>
    </MotionBox>
  )
}
