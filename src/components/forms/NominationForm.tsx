'use client'

import { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  Textarea,
  Select,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Card,
  CardBody,
  Checkbox,
  Alert,
  AlertIcon,
  Progress,
  Divider,
  Badge,
  IconButton,
} from '@chakra-ui/react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Send } from 'lucide-react'
import { nominationSchema, type NominationFormData } from '@/lib/validations/nomination'
import { createClient } from '@/lib/supabase/client'

const tierDescriptions = {
  rising: 'For emerging talents making their mark in their field',
  elite: 'For established professionals at the peak of their career',
  legacy: 'For legendary figures who have shaped history',
} as const

interface NominationFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function NominationForm({ onSuccess, onError }: NominationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const supabase = createClient()

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<NominationFormData>({
    resolver: zodResolver(nominationSchema),
    mode: 'onChange',
    defaultValues: {
      links: [],
      website: '', // Honeypot field
    },
  })

  // Handle links manually since it's an array of strings
  const linkFields = watch('links') || []
  const appendLink = (value: string) => {
    const current = watch('links') || []
    setValue('links', [...current, value])
  }
  const removeLink = (index: number) => {
    const current = watch('links') || []
    setValue('links', current.filter((_, i) => i !== index))
  }

  const watchedFields = watch()
  const progress = calculateProgress(watchedFields)

  // Fixed submit button logic - check all required fields and form validity
  const canSubmit = isValid &&
    watchedFields.nominatorEmail &&
    watchedFields.nominatorName &&
    watchedFields.nomineeName &&
    watchedFields.nomineeEmail &&
    watchedFields.pitch &&
    watchedFields.consent &&
    !watchedFields.website // Honeypot check

  const onSubmit = async (data: NominationFormData) => {
    setIsSubmitting(true)
    setSubmitMessage(null)

    // Check honeypot field
    if (data.website && data.website.length > 0) {
      setSubmitMessage({
        type: 'error',
        text: 'Spam detected. Please try again.',
      })
      setIsSubmitting(false)
      return
    }

    try {
      const { error } = await supabase
        .from('nominations')
        .insert({
          nominator_email: data.nominatorEmail,
          nominator_name: data.nominatorName,
          nominee_name: data.nomineeName,
          nominee_email: data.nomineeEmail,
          pitch: data.pitch,
          links: data.links.length > 0 ? data.links : null,
          assigned_tier: data.suggestedTier || null,
          status: 'pending',
        })

      if (error) {
        throw error
      }

      setSubmitMessage({
        type: 'success',
        text: 'Nomination submitted successfully! We will review it and get back to you within 5-7 business days.',
      })

      reset()
      onSuccess?.()
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred while submitting your nomination'
      setSubmitMessage({
        type: 'error',
        text: errorMessage,
      })
      onError?.(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addSupportingLink = () => {
    appendLink('')
  }

  return (
    <Card maxW="4xl" mx="auto" shadow="xl">
      <CardBody p={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading as="h1" size="xl" mb={2} color="primary.600">
              Submit a Nomination
            </Heading>
            <Text color="gray.600" mb={4}>
              Nominate someone exceptional for our digital archive
            </Text>
            <Progress value={progress} colorScheme="primary" size="sm" borderRadius="full" />
            <Text fontSize="sm" color="gray.500" mt={2}>
              {Math.round(progress)}% Complete
            </Text>
          </Box>

          {submitMessage && (
            <Alert status={submitMessage.type} borderRadius="lg">
              <AlertIcon />
              {submitMessage.text}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={6} align="stretch">
              {/* Nominator Information */}
              <Box>
                <Heading as="h2" size="md" mb={4} color="gray.700">
                  Your Information
                </Heading>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!errors.nominatorEmail}>
                    <FormLabel>Your Email Address</FormLabel>
                    <Input
                      {...register('nominatorEmail')}
                      type="email"
                      placeholder="your.email@example.com"
                    />
                    <FormErrorMessage>{errors.nominatorEmail?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.nominatorName}>
                    <FormLabel>Your Full Name</FormLabel>
                    <Input
                      {...register('nominatorName')}
                      placeholder="Enter your full name"
                    />
                    <FormErrorMessage>{errors.nominatorName?.message}</FormErrorMessage>
                  </FormControl>
                </VStack>
              </Box>

              <Divider />

              {/* Nominee Information */}
              <Box>
                <Heading as="h2" size="md" mb={4} color="gray.700">
                  Nominee Information
                </Heading>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!errors.nomineeName}>
                    <FormLabel>Nominee's Full Name</FormLabel>
                    <Input
                      {...register('nomineeName')}
                      placeholder="Enter the nominee's full name"
                    />
                    <FormErrorMessage>{errors.nomineeName?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.nomineeEmail}>
                    <FormLabel>Nominee's Email</FormLabel>
                    <Input
                      {...register('nomineeEmail')}
                      type="email"
                      placeholder="nominee@example.com"
                    />
                    <FormErrorMessage>{errors.nomineeEmail?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.suggestedTier}>
                    <FormLabel>Suggested Tier (Optional)</FormLabel>
                    <Select {...register('suggestedTier')} placeholder="Select a tier">
                      {Object.entries(tierDescriptions).map(([tier, description]) => (
                        <option key={tier} value={tier}>
                          {tier.charAt(0).toUpperCase() + tier.slice(1)} - {description}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>{errors.suggestedTier?.message}</FormErrorMessage>
                  </FormControl>
                </VStack>
              </Box>

              <Divider />

              {/* Nomination Details */}
              <Box>
                <Heading as="h2" size="md" mb={4} color="gray.700">
                  Nomination Pitch
                </Heading>
                <FormControl isInvalid={!!errors.pitch}>
                  <FormLabel>Why should this person be featured?</FormLabel>
                  <Textarea
                    {...register('pitch')}
                    placeholder="Provide a compelling pitch for why this person deserves to be featured in our archive. Include their background, achievements, impact, and what makes them exceptional..."
                    rows={6}
                  />
                  <FormErrorMessage>{errors.pitch?.message}</FormErrorMessage>
                </FormControl>
              </Box>

              {/* Honeypot field - hidden from users */}
              <Input
                {...register('website')}
                type="text"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <Divider />

              {/* Supporting Links */}
              <Box>
                <HStack justify="space-between" mb={4}>
                  <Heading as="h2" size="md" color="gray.700">
                    Supporting Links (Optional)
                  </Heading>
                  <Button
                    size="sm"
                    leftIcon={<Plus size={16} />}
                    onClick={addSupportingLink}
                    variant="outline"
                  >
                    Add Link
                  </Button>
                </HStack>
                
                {linkFields.length > 0 && (
                  <VStack spacing={4}>
                    {linkFields.map((_, index) => (
                      <Card key={index} w="full" variant="outline">
                        <CardBody>
                          <HStack justify="space-between" mb={3}>
                            <Badge colorScheme="primary">Link {index + 1}</Badge>
                            <IconButton
                              size="sm"
                              icon={<Trash2 size={16} />}
                              onClick={() => removeLink(index)}
                              variant="ghost"
                              colorScheme="red"
                              aria-label="Remove link"
                            />
                          </HStack>
                          <FormControl isInvalid={!!errors.links?.[index]}>
                            <FormLabel fontSize="sm">URL</FormLabel>
                            <Input
                              {...register(`links.${index}`)}
                              placeholder="https://..."
                              size="sm"
                            />
                            <FormErrorMessage>{errors.links?.[index]?.message}</FormErrorMessage>
                          </FormControl>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                )}
              </Box>

              <Divider />

              {/* Consent */}
              <FormControl isInvalid={!!errors.consent}>
                <Checkbox {...register('consent')}>
                  I confirm that I have the right to nominate this person and agree to the{' '}
                  <Text as="span" color="primary.500" textDecoration="underline">
                    Terms of Service
                  </Text>{' '}
                  and{' '}
                  <Text as="span" color="primary.500" textDecoration="underline">
                    Privacy Policy
                  </Text>
                </Checkbox>
                <FormErrorMessage>{errors.consent?.message}</FormErrorMessage>
              </FormControl>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                colorScheme="primary"
                isLoading={isSubmitting}
                loadingText="Submitting..."
                leftIcon={<Send size={20} />}
                isDisabled={!canSubmit || isSubmitting}
              >
                Submit Nomination
              </Button>
            </VStack>
          </form>
        </VStack>
      </CardBody>
    </Card>
  )
}

function calculateProgress(data: Partial<NominationFormData>): number {
  const requiredFields = [
    'nominatorEmail',
    'nominatorName',
    'nomineeName',
    'nomineeEmail',
    'pitch',
    'consent',
  ]

  const filledFields = requiredFields.filter(field => {
    const value = data[field as keyof NominationFormData]
    return value !== undefined && value !== '' && value !== false
  })

  return (filledFields.length / requiredFields.length) * 100
}
