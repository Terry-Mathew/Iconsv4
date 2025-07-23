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
} from '@chakra-ui/react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { risingProfileSchema, RisingProfileFormData } from '@/lib/validations/profile'

interface RisingProfileFormProps {
  initialData?: Partial<RisingProfileFormData>
  onChange?: (data: Partial<RisingProfileFormData>) => void
}

export function RisingProfileForm({ initialData, onChange }: RisingProfileFormProps) {
  const {
    register,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm<RisingProfileFormData>({
    resolver: zodResolver(risingProfileSchema),
    defaultValues: {
      tier: 'rising',
      skills: [],
      achievements: [],
      projects: [],
      mentors: [],
      socialLinks: {},
      ...initialData,
    },
  })

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: 'skills',
  })

  const { fields: achievementFields, append: appendAchievement, remove: removeAchievement } = useFieldArray({
    control,
    name: 'achievements',
  })

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: 'projects',
  })

  const { fields: mentorFields, append: appendMentor, remove: removeMentor } = useFieldArray({
    control,
    name: 'mentors',
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
              <Input {...register('tagline')} placeholder="e.g., Innovative Software Engineer & Tech Entrepreneur" />
              <FormErrorMessage>{errors.tagline?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.bio}>
              <FormLabel>Bio</FormLabel>
              <Textarea
                {...register('bio')}
                placeholder="Tell your story, background, and what drives you..."
                rows={4}
              />
              <FormErrorMessage>{errors.bio?.message}</FormErrorMessage>
            </FormControl>

            <HStack w="full" spacing={4}>
              <FormControl isInvalid={!!errors.currentRole}>
                <FormLabel>Current Role</FormLabel>
                <Input {...register('currentRole')} placeholder="e.g., Senior Developer" />
                <FormErrorMessage>{errors.currentRole?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.company}>
                <FormLabel>Company</FormLabel>
                <Input {...register('company')} placeholder="e.g., Tech Startup Inc." />
                <FormErrorMessage>{errors.company?.message}</FormErrorMessage>
              </FormControl>
            </HStack>

            <HStack w="full" spacing={4}>
              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input {...register('location')} placeholder="e.g., San Francisco, CA" />
              </FormControl>

              <FormControl>
                <FormLabel>Website</FormLabel>
                <Input {...register('website')} placeholder="https://yourwebsite.com" />
              </FormControl>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Skills */}
      <Card>
        <CardBody>
          <HStack justify="space-between" mb={4}>
            <Heading as="h3" size="md" color="primary.600">
              Skills
            </Heading>
            <Button
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => appendSkill('')}
              variant="outline"
            >
              Add Skill
            </Button>
          </HStack>
          <VStack spacing={3}>
            {skillFields.map((field, index) => (
              <HStack key={field.id} w="full">
                <Input
                  {...register(`skills.${index}` as const)}
                  placeholder="e.g., React, Python, Machine Learning"
                />
                <IconButton
                  icon={<Trash2 size={16} />}
                  onClick={() => removeSkill(index)}
                  variant="ghost"
                  colorScheme="red"
                  aria-label="Remove skill"
                />
              </HStack>
            ))}
            {skillFields.length === 0 && (
              <Button
                onClick={() => appendSkill('')}
                variant="dashed"
                w="full"
                h="40px"
                borderStyle="dashed"
                borderWidth="2px"
                borderColor="gray.300"
              >
                Add your first skill
              </Button>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Achievements */}
      <Card>
        <CardBody>
          <HStack justify="space-between" mb={4}>
            <Heading as="h3" size="md" color="primary.600">
              Key Achievements
            </Heading>
            <Button
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => appendAchievement('')}
              variant="outline"
            >
              Add Achievement
            </Button>
          </HStack>
          <VStack spacing={3}>
            {achievementFields.map((field, index) => (
              <HStack key={field.id} w="full">
                <Input
                  {...register(`achievements.${index}` as const)}
                  placeholder="Describe a significant achievement"
                />
                <IconButton
                  icon={<Trash2 size={16} />}
                  onClick={() => removeAchievement(index)}
                  variant="ghost"
                  colorScheme="red"
                  aria-label="Remove achievement"
                />
              </HStack>
            ))}
          </VStack>
        </CardBody>
      </Card>

      {/* Aspirations */}
      <Card>
        <CardBody>
          <Heading as="h3" size="md" mb={4} color="primary.600">
            Aspirations & Goals
          </Heading>
          <FormControl isInvalid={!!errors.aspirations}>
            <FormLabel>What are your future goals and aspirations?</FormLabel>
            <Textarea
              {...register('aspirations')}
              placeholder="Describe your vision for the future, career goals, and what you hope to achieve..."
              rows={4}
            />
            <FormErrorMessage>{errors.aspirations?.message}</FormErrorMessage>
          </FormControl>
        </CardBody>
      </Card>

      {/* Projects */}
      <Card>
        <CardBody>
          <HStack justify="space-between" mb={4}>
            <Heading as="h3" size="md" color="primary.600">
              Featured Projects
            </Heading>
            <Button
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => appendProject({ title: '', description: '', link: '', image: '' })}
              variant="outline"
            >
              Add Project
            </Button>
          </HStack>
          <VStack spacing={4}>
            {projectFields.map((field, index) => (
              <Card key={field.id} variant="outline" w="full">
                <CardBody>
                  <HStack justify="space-between" mb={3}>
                    <Badge colorScheme="primary">Project {index + 1}</Badge>
                    <IconButton
                      size="sm"
                      icon={<Trash2 size={16} />}
                      onClick={() => removeProject(index)}
                      variant="ghost"
                      colorScheme="red"
                      aria-label="Remove project"
                    />
                  </HStack>
                  <VStack spacing={3}>
                    <FormControl>
                      <FormLabel fontSize="sm">Project Title</FormLabel>
                      <Input
                        {...register(`projects.${index}.title` as const)}
                        placeholder="Project name"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm">Description</FormLabel>
                      <Textarea
                        {...register(`projects.${index}.description` as const)}
                        placeholder="Describe the project, your role, and its impact"
                        rows={3}
                      />
                    </FormControl>
                    <HStack w="full">
                      <FormControl>
                        <FormLabel fontSize="sm">Project Link</FormLabel>
                        <Input
                          {...register(`projects.${index}.link` as const)}
                          placeholder="https://project-url.com"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm">Image URL</FormLabel>
                        <Input
                          {...register(`projects.${index}.image` as const)}
                          placeholder="https://image-url.com"
                        />
                      </FormControl>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </CardBody>
      </Card>

      {/* Social Links */}
      <Card>
        <CardBody>
          <Heading as="h3" size="md" mb={4} color="primary.600">
            Social Links
          </Heading>
          <VStack spacing={4}>
            <HStack w="full" spacing={4}>
              <FormControl>
                <FormLabel>LinkedIn</FormLabel>
                <Input {...register('socialLinks.linkedin')} placeholder="https://linkedin.com/in/username" />
              </FormControl>
              <FormControl>
                <FormLabel>Twitter</FormLabel>
                <Input {...register('socialLinks.twitter')} placeholder="https://twitter.com/username" />
              </FormControl>
            </HStack>
            <HStack w="full" spacing={4}>
              <FormControl>
                <FormLabel>GitHub</FormLabel>
                <Input {...register('socialLinks.github')} placeholder="https://github.com/username" />
              </FormControl>
              <FormControl>
                <FormLabel>Instagram</FormLabel>
                <Input {...register('socialLinks.instagram')} placeholder="https://instagram.com/username" />
              </FormControl>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  )
}
