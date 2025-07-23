'use client'

import { useEffect } from 'react'
import {
  VStack,
  HStack,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Button,
  IconButton,
  Card,
  CardBody,
  Badge,
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { legacyProfileSchema, LegacyProfileFormData } from '@/lib/validations/profile'

interface LegacyProfileFormProps {
  initialData?: Partial<LegacyProfileFormData>
  onChange?: (data: Partial<LegacyProfileFormData>) => void
}

export function LegacyProfileForm({ initialData, onChange }: LegacyProfileFormProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm<LegacyProfileFormData>({
    resolver: zodResolver(legacyProfileSchema),
    defaultValues: {
      tier: 'legacy',
      primaryContributions: [],
      timeline: [],
      quotes: [],
      recognitions: [],
      influence: [],
      archives: [],
      socialLinks: {},
      ...initialData,
    },
  })

  // Handle primaryContributions manually since it's an array of strings
  const contributionFields = watch('primaryContributions') || []
  const appendContribution = (value: string) => {
    const current = watch('primaryContributions') || []
    setValue('primaryContributions', [...current, value])
  }
  const removeContribution = (index: number) => {
    const current = watch('primaryContributions') || []
    setValue('primaryContributions', current.filter((_, i) => i !== index))
  }

  const { fields: timelineFields, append: appendTimeline, remove: removeTimeline } = useFieldArray({
    control,
    name: 'timeline',
  })

  const { fields: quoteFields, append: appendQuote, remove: removeQuote } = useFieldArray({
    control,
    name: 'quotes',
  })

  // TODO: Implement recognition and influence field arrays

  const watchedData = watch()

  useEffect(() => {
    onChange?.(watchedData)
  }, [watchedData, onChange])

  return (
    <VStack spacing={8} align="stretch">
      {/* Basic Information */}
      <Card>
        <CardBody>
          <Heading as="h3" size="md" mb={4} color="primary.600">
            Basic Information
          </Heading>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Full Name</FormLabel>
              <Input {...register('name')} placeholder="Full name of the legacy figure" />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.tagline}>
              <FormLabel>Legacy Tagline</FormLabel>
              <Input {...register('tagline')} placeholder="e.g., Visionary Leader Who Transformed Modern Computing" />
              <FormErrorMessage>{errors.tagline?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.bio}>
              <FormLabel>Biography</FormLabel>
              <Textarea
                {...register('bio')}
                placeholder="Write a comprehensive biography of this legendary figure..."
                rows={6}
              />
              <FormErrorMessage>{errors.bio?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.era}>
              <FormLabel>Era/Time Period</FormLabel>
              <Input {...register('era')} placeholder="e.g., 1950s - 2010s, Renaissance Period" />
              <FormErrorMessage>{errors.era?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.legacy}>
              <FormLabel>Legacy Description</FormLabel>
              <Textarea
                {...register('legacy')}
                placeholder="Describe the lasting impact and legacy of this person..."
                rows={5}
              />
              <FormErrorMessage>{errors.legacy?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.historicalImpact}>
              <FormLabel>Historical Impact</FormLabel>
              <Textarea
                {...register('historicalImpact')}
                placeholder="Explain the historical significance and broader impact on society..."
                rows={5}
              />
              <FormErrorMessage>{errors.historicalImpact?.message}</FormErrorMessage>
            </FormControl>
          </VStack>
        </CardBody>
      </Card>

      {/* Primary Contributions */}
      <Card>
        <CardBody>
          <HStack justify="space-between" mb={4}>
            <Heading as="h3" size="md" color="primary.600">
              Primary Contributions
            </Heading>
            <Button
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => appendContribution('')}
              variant="outline"
            >
              Add Contribution
            </Button>
          </HStack>
          <VStack spacing={3}>
            {contributionFields.map((_, index) => (
              <HStack key={index} w="full">
                <FormControl isInvalid={!!errors.primaryContributions?.[index]}>
                  <Input
                    {...register(`primaryContributions.${index}`)}
                    placeholder="e.g., Pioneered personal computing, Founded modern philanthropy"
                  />
                  <FormErrorMessage>{errors.primaryContributions?.[index]?.message}</FormErrorMessage>
                </FormControl>
                <IconButton
                  icon={<Trash2 size={16} />}
                  onClick={() => removeContribution(index)}
                  variant="ghost"
                  colorScheme="red"
                  aria-label="Remove contribution"
                />
              </HStack>
            ))}
          </VStack>
        </CardBody>
      </Card>

      {/* Historical Timeline */}
      <Card>
        <CardBody>
          <HStack justify="space-between" mb={4}>
            <Heading as="h3" size="md" color="primary.600">
              Historical Timeline
            </Heading>
            <Button
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => appendTimeline({ year: new Date().getFullYear(), event: '', significance: '' })}
              variant="outline"
            >
              Add Event
            </Button>
          </HStack>
          <VStack spacing={4}>
            {timelineFields.map((field, index) => (
              <Card key={field.id} variant="outline" w="full">
                <CardBody>
                  <HStack justify="space-between" mb={3}>
                    <Badge colorScheme="primary">Event {index + 1}</Badge>
                    <IconButton
                      size="sm"
                      icon={<Trash2 size={16} />}
                      onClick={() => removeTimeline(index)}
                      variant="ghost"
                      colorScheme="red"
                      aria-label="Remove event"
                    />
                  </HStack>
                  <VStack spacing={3}>
                    <FormControl isInvalid={!!errors.timeline?.[index]?.year}>
                      <FormLabel fontSize="sm">Year</FormLabel>
                      <NumberInput min={1800} max={new Date().getFullYear()}>
                        <NumberInputField {...register(`timeline.${index}.year`, { valueAsNumber: true })} />
                      </NumberInput>
                      <FormErrorMessage>{errors.timeline?.[index]?.year?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.timeline?.[index]?.event}>
                      <FormLabel fontSize="sm">Event</FormLabel>
                      <Input
                        {...register(`timeline.${index}.event`)}
                        placeholder="e.g., Founded Apple Computer"
                      />
                      <FormErrorMessage>{errors.timeline?.[index]?.event?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.timeline?.[index]?.significance}>
                      <FormLabel fontSize="sm">Significance</FormLabel>
                      <Textarea
                        {...register(`timeline.${index}.significance`)}
                        placeholder="Explain the significance of this event..."
                        rows={3}
                      />
                      <FormErrorMessage>{errors.timeline?.[index]?.significance?.message}</FormErrorMessage>
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </CardBody>
      </Card>

      {/* Famous Quotes */}
      <Card>
        <CardBody>
          <HStack justify="space-between" mb={4}>
            <Heading as="h3" size="md" color="primary.600">
              Famous Quotes
            </Heading>
            <Button
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => appendQuote({ text: '', context: '', year: undefined })}
              variant="outline"
            >
              Add Quote
            </Button>
          </HStack>
          <VStack spacing={4}>
            {quoteFields.map((field, index) => (
              <Card key={field.id} variant="outline" w="full">
                <CardBody>
                  <HStack justify="space-between" mb={3}>
                    <Badge colorScheme="primary">Quote {index + 1}</Badge>
                    <IconButton
                      size="sm"
                      icon={<Trash2 size={16} />}
                      onClick={() => removeQuote(index)}
                      variant="ghost"
                      colorScheme="red"
                      aria-label="Remove quote"
                    />
                  </HStack>
                  <VStack spacing={3}>
                    <FormControl isInvalid={!!errors.quotes?.[index]?.text}>
                      <FormLabel fontSize="sm">Quote</FormLabel>
                      <Textarea
                        {...register(`quotes.${index}.text`)}
                        placeholder="Enter the famous quote..."
                        rows={3}
                      />
                      <FormErrorMessage>{errors.quotes?.[index]?.text?.message}</FormErrorMessage>
                    </FormControl>
                    <HStack w="full">
                      <FormControl isInvalid={!!errors.quotes?.[index]?.context}>
                        <FormLabel fontSize="sm">Context (Optional)</FormLabel>
                        <Input
                          {...register(`quotes.${index}.context`)}
                          placeholder="e.g., Stanford Commencement Speech"
                        />
                        <FormErrorMessage>{errors.quotes?.[index]?.context?.message}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={!!errors.quotes?.[index]?.year}>
                        <FormLabel fontSize="sm">Year (Optional)</FormLabel>
                        <NumberInput min={1800} max={new Date().getFullYear()}>
                          <NumberInputField {...register(`quotes.${index}.year`, { valueAsNumber: true })} />
                        </NumberInput>
                        <FormErrorMessage>{errors.quotes?.[index]?.year?.message}</FormErrorMessage>
                      </FormControl>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}
