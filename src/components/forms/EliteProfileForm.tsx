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
import { eliteProfileSchema, EliteProfileFormData } from '@/lib/validations/profile'

interface EliteProfileFormProps {
  initialData?: Partial<EliteProfileFormData>
  onChange?: (data: Partial<EliteProfileFormData>) => void
}

export function EliteProfileForm({ initialData, onChange }: EliteProfileFormProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm<EliteProfileFormData>({
    resolver: zodResolver(eliteProfileSchema),
    defaultValues: {
      tier: 'elite',
      expertise: [],
      majorAchievements: [],
      leadership: [],
      publications: [],
      awards: [],
      socialLinks: {},
      ...initialData,
    },
  })

  const { fields: expertiseFields, append: appendExpertise, remove: removeExpertise } = useFieldArray({
    control,
    name: 'expertise',
  })

  const { fields: achievementFields, append: appendAchievement, remove: removeAchievement } = useFieldArray({
    control,
    name: 'majorAchievements',
  })

  const { fields: leadershipFields, append: appendLeadership, remove: removeLeadership } = useFieldArray({
    control,
    name: 'leadership',
  })

  const { fields: publicationFields, append: appendPublication, remove: removePublication } = useFieldArray({
    control,
    name: 'publications',
  })

  const { fields: awardFields, append: appendAward, remove: removeAward } = useFieldArray({
    control,
    name: 'awards',
  })

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
              <Input {...register('name')} placeholder="Your full name" />
              <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.tagline}>
              <FormLabel>Professional Tagline</FormLabel>
              <Input {...register('tagline')} placeholder="e.g., Chief Technology Officer & Innovation Leader" />
              <FormErrorMessage>{errors.tagline?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.bio}>
              <FormLabel>Professional Bio</FormLabel>
              <Textarea
                {...register('bio')}
                placeholder="Write a comprehensive professional biography..."
                rows={6}
              />
              <FormErrorMessage>{errors.bio?.message}</FormErrorMessage>
            </FormControl>

            <HStack spacing={4} w="full">
              <FormControl isInvalid={!!errors.currentRole}>
                <FormLabel>Current Role</FormLabel>
                <Input {...register('currentRole')} placeholder="Chief Executive Officer" />
                <FormErrorMessage>{errors.currentRole?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.company}>
                <FormLabel>Company</FormLabel>
                <Input {...register('company')} placeholder="Company Name" />
                <FormErrorMessage>{errors.company?.message}</FormErrorMessage>
              </FormControl>
            </HStack>

            <HStack spacing={4} w="full">
              <FormControl isInvalid={!!errors.industry}>
                <FormLabel>Industry</FormLabel>
                <Input {...register('industry')} placeholder="Technology, Finance, Healthcare, etc." />
                <FormErrorMessage>{errors.industry?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.yearsOfExperience}>
                <FormLabel>Years of Experience</FormLabel>
                <NumberInput min={5} max={50}>
                  <NumberInputField {...register('yearsOfExperience', { valueAsNumber: true })} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors.yearsOfExperience?.message}</FormErrorMessage>
              </FormControl>
            </HStack>

            <FormControl isInvalid={!!errors.location}>
              <FormLabel>Location</FormLabel>
              <Input {...register('location')} placeholder="City, Country" />
              <FormErrorMessage>{errors.location?.message}</FormErrorMessage>
            </FormControl>
          </VStack>
        </CardBody>
      </Card>

      {/* Expertise Areas */}
      <Card>
        <CardBody>
          <HStack justify="space-between" mb={4}>
            <Heading as="h3" size="md" color="primary.600">
              Areas of Expertise
            </Heading>
            <Button
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => appendExpertise('')}
              variant="outline"
            >
              Add Expertise
            </Button>
          </HStack>
          <VStack spacing={3}>
            {expertiseFields.map((field, index) => (
              <HStack key={field.id} w="full">
                <FormControl isInvalid={!!errors.expertise?.[index]}>
                  <Input
                    {...register(`expertise.${index}`)}
                    placeholder="e.g., Strategic Planning, Digital Transformation"
                  />
                  <FormErrorMessage>{errors.expertise?.[index]?.message}</FormErrorMessage>
                </FormControl>
                <IconButton
                  icon={<Trash2 size={16} />}
                  onClick={() => removeExpertise(index)}
                  variant="ghost"
                  colorScheme="red"
                  aria-label="Remove expertise"
                />
              </HStack>
            ))}
          </VStack>
        </CardBody>
      </Card>

      {/* Major Achievements */}
      <Card>
        <CardBody>
          <HStack justify="space-between" mb={4}>
            <Heading as="h3" size="md" color="primary.600">
              Major Achievements
            </Heading>
            <Button
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => appendAchievement({ title: '', description: '', year: new Date().getFullYear(), impact: '' })}
              variant="outline"
            >
              Add Achievement
            </Button>
          </HStack>
          <VStack spacing={4}>
            {achievementFields.map((field, index) => (
              <Card key={field.id} variant="outline" w="full">
                <CardBody>
                  <HStack justify="space-between" mb={3}>
                    <Badge colorScheme="primary">Achievement {index + 1}</Badge>
                    <IconButton
                      size="sm"
                      icon={<Trash2 size={16} />}
                      onClick={() => removeAchievement(index)}
                      variant="ghost"
                      colorScheme="red"
                      aria-label="Remove achievement"
                    />
                  </HStack>
                  <VStack spacing={3}>
                    <FormControl isInvalid={!!errors.majorAchievements?.[index]?.title}>
                      <FormLabel fontSize="sm">Achievement Title</FormLabel>
                      <Input
                        {...register(`majorAchievements.${index}.title`)}
                        placeholder="e.g., Led digital transformation initiative"
                      />
                      <FormErrorMessage>{errors.majorAchievements?.[index]?.title?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.majorAchievements?.[index]?.description}>
                      <FormLabel fontSize="sm">Description</FormLabel>
                      <Textarea
                        {...register(`majorAchievements.${index}.description`)}
                        placeholder="Describe the achievement and its significance..."
                        rows={3}
                      />
                      <FormErrorMessage>{errors.majorAchievements?.[index]?.description?.message}</FormErrorMessage>
                    </FormControl>
                    <HStack w="full">
                      <FormControl isInvalid={!!errors.majorAchievements?.[index]?.year}>
                        <FormLabel fontSize="sm">Year</FormLabel>
                        <NumberInput min={1950} max={new Date().getFullYear()}>
                          <NumberInputField {...register(`majorAchievements.${index}.year`, { valueAsNumber: true })} />
                        </NumberInput>
                        <FormErrorMessage>{errors.majorAchievements?.[index]?.year?.message}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={!!errors.majorAchievements?.[index]?.impact}>
                        <FormLabel fontSize="sm">Impact/Results</FormLabel>
                        <Input
                          {...register(`majorAchievements.${index}.impact`)}
                          placeholder="e.g., 40% revenue increase"
                        />
                        <FormErrorMessage>{errors.majorAchievements?.[index]?.impact?.message}</FormErrorMessage>
                      </FormControl>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </CardBody>
      </Card>

      {/* Leadership Roles */}
      <Card>
        <CardBody>
          <HStack justify="space-between" mb={4}>
            <Heading as="h3" size="md" color="primary.600">
              Leadership Experience
            </Heading>
            <Button
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => appendLeadership({ title: '', organization: '', duration: '', description: '' })}
              variant="outline"
            >
              Add Role
            </Button>
          </HStack>
          <VStack spacing={4}>
            {leadershipFields.map((field, index) => (
              <Card key={field.id} variant="outline" w="full">
                <CardBody>
                  <HStack justify="space-between" mb={3}>
                    <Badge colorScheme="primary">Role {index + 1}</Badge>
                    <IconButton
                      size="sm"
                      icon={<Trash2 size={16} />}
                      onClick={() => removeLeadership(index)}
                      variant="ghost"
                      colorScheme="red"
                      aria-label="Remove role"
                    />
                  </HStack>
                  <VStack spacing={3}>
                    <HStack w="full">
                      <FormControl isInvalid={!!errors.leadership?.[index]?.title}>
                        <FormLabel fontSize="sm">Role Title</FormLabel>
                        <Input
                          {...register(`leadership.${index}.title`)}
                          placeholder="e.g., Chief Technology Officer"
                        />
                        <FormErrorMessage>{errors.leadership?.[index]?.title?.message}</FormErrorMessage>
                      </FormControl>
                      <FormControl isInvalid={!!errors.leadership?.[index]?.organization}>
                        <FormLabel fontSize="sm">Organization</FormLabel>
                        <Input
                          {...register(`leadership.${index}.organization`)}
                          placeholder="Organization name"
                        />
                        <FormErrorMessage>{errors.leadership?.[index]?.organization?.message}</FormErrorMessage>
                      </FormControl>
                    </HStack>
                    <FormControl isInvalid={!!errors.leadership?.[index]?.duration}>
                      <FormLabel fontSize="sm">Duration</FormLabel>
                      <Input
                        {...register(`leadership.${index}.duration`)}
                        placeholder="e.g., 2020 - Present"
                      />
                      <FormErrorMessage>{errors.leadership?.[index]?.duration?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.leadership?.[index]?.description}>
                      <FormLabel fontSize="sm">Description</FormLabel>
                      <Textarea
                        {...register(`leadership.${index}.description`)}
                        placeholder="Describe your responsibilities and achievements in this role..."
                        rows={3}
                      />
                      <FormErrorMessage>{errors.leadership?.[index]?.description?.message}</FormErrorMessage>
                    </FormControl>
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
