'use client'

import { useState } from 'react'
import {
  Box,
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
  Input,
  Textarea,
  Button,
  IconButton,
  Badge,
  Divider,
  useToast,
  Progress,
  SimpleGrid,
  Image,
  AspectRatio,
} from '@chakra-ui/react'
import { 
  Plus, 
  Trash2, 
  Upload, 
  Sparkles,
  GripVertical,
  Video,
  Image as ImageIcon,
  BarChart3,
  Quote,
  Target,
  Award,
  Users,
  Calendar,
  Link as LinkIcon
} from 'lucide-react'
import { useFieldArray, Control, UseFormRegister, FieldErrors } from 'react-hook-form'

interface EnhancedFormSectionsProps {
  control: Control<any>
  register: UseFormRegister<any>
  errors: FieldErrors<any>
  selectedTier: 'rising' | 'elite' | 'legacy'
  isFieldVisible: (fieldName: string) => boolean
  onAIPolish: (text: string, field: string) => Promise<string>
}

export function EnhancedFormSections({
  control,
  register,
  errors,
  selectedTier,
  isFieldVisible,
  onAIPolish
}: EnhancedFormSectionsProps) {
  const toast = useToast()
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [polishingField, setPolishingField] = useState<string | null>(null)

  // Field arrays for all sections
  const { fields: galleryFields, append: appendGallery, remove: removeGallery } = useFieldArray({
    control,
    name: 'gallery',
  })

  const { fields: milestoneFields, append: appendMilestone, remove: removeMilestone } = useFieldArray({
    control,
    name: 'milestones',
  })

  const { fields: inspirationFields, append: appendInspiration, remove: removeInspiration } = useFieldArray({
    control,
    name: 'inspirations',
  })

  const { fields: leadershipFields, append: appendLeadership, remove: removeLeadership } = useFieldArray({
    control,
    name: 'leadershipHighlights',
  })

  const { fields: metricFields, append: appendMetric, remove: removeMetric } = useFieldArray({
    control,
    name: 'impactMetrics',
  })

  const { fields: tributeFields, append: appendTribute, remove: removeTribute } = useFieldArray({
    control,
    name: 'tributes',
  })

  // Mock file upload function
  const handleFileUpload = async (file: File, fieldName: string, index?: number) => {
    const uploadId = `${fieldName}-${index || 0}`
    setUploadProgress(prev => ({ ...prev, [uploadId]: 0 }))

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setUploadProgress(prev => ({ ...prev, [uploadId]: i }))
    }

    // Mock URL - in real implementation, upload to Supabase Storage
    const mockUrl = `https://images.unsplash.com/photo-${Date.now()}?w=800&h=600&fit=crop`
    
    setUploadProgress(prev => {
      const newProgress = { ...prev }
      delete newProgress[uploadId]
      return newProgress
    })

    toast({
      title: 'Upload successful',
      status: 'success',
      duration: 2000,
    })

    return mockUrl
  }

  // AI Polish handler
  const handleAIPolish = async (fieldName: string, currentValue: string) => {
    setPolishingField(fieldName)
    try {
      const polished = await onAIPolish(currentValue, fieldName)
      toast({
        title: 'AI Enhancement Complete',
        description: 'Your content has been polished and enhanced.',
        status: 'success',
        duration: 3000,
      })
      return polished
    } catch (error) {
      toast({
        title: 'AI Enhancement Failed',
        description: 'Please try again later.',
        status: 'error',
        duration: 3000,
      })
      throw error
    } finally {
      setPolishingField(null)
    }
  }

  return (
    <VStack spacing={8} align="stretch">
      {/* Hero Video Section (Elite & Legacy) */}
      {isFieldVisible('heroVideo') && (
        <Card>
          <CardHeader>
            <HStack>
              <Video size={20} color="#D4AF37" />
              <Heading size="md">Hero Video</Heading>
              <Badge colorScheme="blue">Elite & Legacy</Badge>
            </HStack>
          </CardHeader>
          <CardBody>
            <FormControl isInvalid={!!errors.heroVideo}>
              <FormLabel>Video URL or Upload</FormLabel>
              <VStack spacing={4}>
                <Input
                  {...register('heroVideo')}
                  placeholder="https://youtube.com/embed/... or upload video"
                />
                <Button
                  leftIcon={<Upload size={16} />}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Trigger file upload
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'video/*'
                    input.onchange = async (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) {
                        const url = await handleFileUpload(file, 'heroVideo')
                        // Set the URL in the form
                      }
                    }
                    input.click()
                  }}
                >
                  Upload Video
                </Button>
              </VStack>
              <FormErrorMessage>{errors.heroVideo?.message as string}</FormErrorMessage>
            </FormControl>
          </CardBody>
        </Card>
      )}

      {/* Media Gallery Section */}
      {isFieldVisible('gallery') && (
        <Card>
          <CardHeader>
            <HStack justify="space-between">
              <HStack>
                <ImageIcon size={20} color="#D4AF37" />
                <Heading size="md">Media Gallery</Heading>
                <Badge>{galleryFields.length}/20</Badge>
              </HStack>
              <Button
                leftIcon={<Plus size={16} />}
                size="sm"
                onClick={() => appendGallery({ url: '', caption: '', type: 'image' })}
                isDisabled={galleryFields.length >= 20}
              >
                Add Media
              </Button>
            </HStack>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {galleryFields.map((field, index) => (
                <Box key={field.id} p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
                  <VStack spacing={3}>
                    <AspectRatio ratio={16/9} w="full">
                      <Box bg="gray.100" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                        <ImageIcon size={32} color="gray.400" />
                      </Box>
                    </AspectRatio>
                    <FormControl>
                      <Input
                        {...register(`gallery.${index}.url`)}
                        placeholder="Image/Video URL"
                        size="sm"
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        {...register(`gallery.${index}.caption`)}
                        placeholder="Caption"
                        size="sm"
                      />
                    </FormControl>
                    <HStack w="full" justify="space-between">
                      <Button
                        leftIcon={<Upload size={14} />}
                        size="xs"
                        variant="outline"
                        onClick={() => {
                          // Trigger file upload for this gallery item
                        }}
                      >
                        Upload
                      </Button>
                      <IconButton
                        aria-label="Remove media"
                        icon={<Trash2 size={14} />}
                        size="xs"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => removeGallery(index)}
                      />
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
            {galleryFields.length === 0 && (
              <Box
                p={8}
                textAlign="center"
                border="2px dashed"
                borderColor="gray.300"
                borderRadius="md"
                bg="gray.50"
              >
                <ImageIcon size={48} color="gray.400" style={{ margin: '0 auto 16px' }} />
                <Text color="gray.600" mb={4}>
                  No media added yet. Upload images and videos to showcase your work.
                </Text>
                <Button
                  leftIcon={<Plus size={16} />}
                  onClick={() => appendGallery({ url: '', caption: '', type: 'image' })}
                >
                  Add First Media
                </Button>
              </Box>
            )}
          </CardBody>
        </Card>
      )}

      {/* Impact Metrics Section (Elite only) */}
      {isFieldVisible('impactMetrics') && (
        <Card>
          <CardHeader>
            <HStack justify="space-between">
              <HStack>
                <BarChart3 size={20} color="#D4AF37" />
                <Heading size="md">Impact Metrics</Heading>
                <Badge colorScheme="blue">Elite</Badge>
              </HStack>
              <Button
                leftIcon={<Plus size={16} />}
                size="sm"
                onClick={() => appendMetric({ metric: '', value: '', description: '' })}
              >
                Add Metric
              </Button>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {metricFields.map((field, index) => (
                <Box key={field.id} p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
                  <HStack spacing={4} align="start">
                    <GripVertical size={16} color="gray.400" />
                    <VStack spacing={3} flex={1}>
                      <HStack w="full" spacing={4}>
                        <FormControl flex={2}>
                          <FormLabel size="sm">Metric</FormLabel>
                          <Input
                            {...register(`impactMetrics.${index}.metric`)}
                            placeholder="e.g., Revenue Generated"
                            size="sm"
                          />
                        </FormControl>
                        <FormControl flex={1}>
                          <FormLabel size="sm">Value</FormLabel>
                          <Input
                            {...register(`impactMetrics.${index}.value`)}
                            placeholder="e.g., $2.5M"
                            size="sm"
                          />
                        </FormControl>
                      </HStack>
                      <FormControl>
                        <FormLabel size="sm">Description</FormLabel>
                        <Textarea
                          {...register(`impactMetrics.${index}.description`)}
                          placeholder="Brief description of this metric..."
                          size="sm"
                          rows={2}
                        />
                      </FormControl>
                    </VStack>
                    <IconButton
                      aria-label="Remove metric"
                      icon={<Trash2 size={16} />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => removeMetric(index)}
                    />
                  </HStack>
                </Box>
              ))}
              {metricFields.length === 0 && (
                <Box
                  p={8}
                  textAlign="center"
                  border="2px dashed"
                  borderColor="gray.300"
                  borderRadius="md"
                  bg="gray.50"
                >
                  <BarChart3 size={48} color="gray.400" style={{ margin: '0 auto 16px' }} />
                  <Text color="gray.600" mb={4}>
                    Showcase your quantifiable impact with key metrics.
                  </Text>
                  <Button
                    leftIcon={<Plus size={16} />}
                    onClick={() => appendMetric({ metric: '', value: '', description: '' })}
                  >
                    Add First Metric
                  </Button>
                </Box>
              )}
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Tributes Section (Legacy only) */}
      {isFieldVisible('tributes') && (
        <Card>
          <CardHeader>
            <HStack justify="space-between">
              <HStack>
                <Quote size={20} color="#D4AF37" />
                <Heading size="md">Tributes & Testimonials</Heading>
                <Badge colorScheme="purple">Legacy</Badge>
              </HStack>
              <Button
                leftIcon={<Plus size={16} />}
                size="sm"
                onClick={() => appendTribute({ text: '', author: '', relationship: '', date: '' })}
              >
                Add Tribute
              </Button>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {tributeFields.map((field, index) => (
                <Box key={field.id} p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
                  <VStack spacing={3} align="stretch">
                    <FormControl>
                      <FormLabel size="sm">Tribute Text</FormLabel>
                      <Textarea
                        {...register(`tributes.${index}.text`)}
                        placeholder="The tribute or testimonial text..."
                        rows={4}
                      />
                    </FormControl>
                    <HStack spacing={4}>
                      <FormControl flex={1}>
                        <FormLabel size="sm">Author</FormLabel>
                        <Input
                          {...register(`tributes.${index}.author`)}
                          placeholder="Author name"
                          size="sm"
                        />
                      </FormControl>
                      <FormControl flex={1}>
                        <FormLabel size="sm">Relationship</FormLabel>
                        <Input
                          {...register(`tributes.${index}.relationship`)}
                          placeholder="e.g., Colleague, Student"
                          size="sm"
                        />
                      </FormControl>
                      <FormControl flex={1}>
                        <FormLabel size="sm">Date</FormLabel>
                        <Input
                          {...register(`tributes.${index}.date`)}
                          placeholder="Date"
                          size="sm"
                        />
                      </FormControl>
                    </HStack>
                    <HStack justify="end">
                      <IconButton
                        aria-label="Remove tribute"
                        icon={<Trash2 size={16} />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => removeTribute(index)}
                      />
                    </HStack>
                  </VStack>
                </Box>
              ))}
              {tributeFields.length === 0 && (
                <Box
                  p={8}
                  textAlign="center"
                  border="2px dashed"
                  borderColor="gray.300"
                  borderRadius="md"
                  bg="gray.50"
                >
                  <Quote size={48} color="gray.400" style={{ margin: '0 auto 16px' }} />
                  <Text color="gray.600" mb={4}>
                    Add meaningful tributes and testimonials from colleagues, students, or admirers.
                  </Text>
                  <Button
                    leftIcon={<Plus size={16} />}
                    onClick={() => appendTribute({ text: '', author: '', relationship: '', date: '' })}
                  >
                    Add First Tribute
                  </Button>
                </Box>
              )}
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Future Vision Section (Rising only) */}
      {isFieldVisible('futureVision') && (
        <Card>
          <CardHeader>
            <HStack>
              <Target size={20} color="#D4AF37" />
              <Heading size="md">Future Vision</Heading>
              <Badge colorScheme="green">Rising</Badge>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Your Vision for the Future</FormLabel>
                <Textarea
                  {...register('futureVision.original')}
                  placeholder="Describe your aspirations, goals, and vision for the future..."
                  rows={6}
                />
              </FormControl>
              <HStack>
                <Button
                  leftIcon={<Sparkles size={16} />}
                  size="sm"
                  variant="outline"
                  colorScheme="purple"
                  isLoading={polishingField === 'futureVision'}
                  onClick={() => {
                    // Handle AI polish for future vision
                  }}
                >
                  AI Polish
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Milestones Section (Rising only) */}
      {isFieldVisible('milestones') && (
        <Card>
          <CardHeader>
            <HStack justify="space-between">
              <HStack>
                <Award size={20} color="#D4AF37" />
                <Heading size="md">Key Milestones</Heading>
                <Badge colorScheme="green">Rising</Badge>
              </HStack>
              <Button
                leftIcon={<Plus size={16} />}
                size="sm"
                onClick={() => appendMilestone({ title: '', description: '', date: '', category: '' })}
              >
                Add Milestone
              </Button>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {milestoneFields.map((field, index) => (
                <Box key={field.id} p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
                  <VStack spacing={3} align="stretch">
                    <HStack spacing={4}>
                      <FormControl flex={2}>
                        <FormLabel size="sm">Milestone Title</FormLabel>
                        <Input
                          {...register(`milestones.${index}.title`)}
                          placeholder="e.g., First Leadership Role"
                          size="sm"
                        />
                      </FormControl>
                      <FormControl flex={1}>
                        <FormLabel size="sm">Date</FormLabel>
                        <Input
                          {...register(`milestones.${index}.date`)}
                          placeholder="MM/YYYY"
                          size="sm"
                        />
                      </FormControl>
                      <FormControl flex={1}>
                        <FormLabel size="sm">Category</FormLabel>
                        <Input
                          {...register(`milestones.${index}.category`)}
                          placeholder="e.g., Career"
                          size="sm"
                        />
                      </FormControl>
                    </HStack>
                    <FormControl>
                      <FormLabel size="sm">Description</FormLabel>
                      <Textarea
                        {...register(`milestones.${index}.description`)}
                        placeholder="Describe this milestone and its significance..."
                        size="sm"
                        rows={3}
                      />
                    </FormControl>
                    <HStack justify="end">
                      <IconButton
                        aria-label="Remove milestone"
                        icon={<Trash2 size={16} />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => removeMilestone(index)}
                      />
                    </HStack>
                  </VStack>
                </Box>
              ))}
              {milestoneFields.length === 0 && (
                <Box
                  p={8}
                  textAlign="center"
                  border="2px dashed"
                  borderColor="gray.300"
                  borderRadius="md"
                  bg="gray.50"
                >
                  <Award size={48} color="gray.400" style={{ margin: '0 auto 16px' }} />
                  <Text color="gray.600" mb={4}>
                    Document your key milestones and achievements on your journey.
                  </Text>
                  <Button
                    leftIcon={<Plus size={16} />}
                    onClick={() => appendMilestone({ title: '', description: '', date: '', category: '' })}
                  >
                    Add First Milestone
                  </Button>
                </Box>
              )}
            </VStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  )
}
