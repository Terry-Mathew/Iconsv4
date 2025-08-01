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
  Input,
  Textarea,
  Button,
  IconButton,
  Badge,
  SimpleGrid,
  Select
} from '@chakra-ui/react'
import { 
  Plus, 
  Trash2, 
  Quote,
  BarChart3,
  Camera,
  LinkIcon,
  Target,
  FileText,
  TrendingUp
} from 'lucide-react'
import { useFieldArray, Control, UseFormRegister, FieldErrors } from 'react-hook-form'

interface SectionProps {
  control: Control<any>
  register: UseFormRegister<any>
  errors: FieldErrors
  isLocked?: boolean
  onUpgrade?: () => void
}

// 4. Media Gallery Section
export function MediaGallerySection({ control, register, errors, isLocked, onUpgrade }: SectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'gallery'
  })

  if (isLocked) {
    return (
      <Card opacity={0.6}>
        <CardHeader>
          <HStack>
            <Camera size={20} color="#D4AF37" />
            <Heading size="md">Media Gallery</Heading>
            <Badge colorScheme="yellow">Elite+</Badge>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={4}>
            <Text color="gray.500" textAlign="center">
              Upgrade to Elite or Legacy tier for media gallery with 20 slots
            </Text>
            <Button onClick={onUpgrade} colorScheme="yellow" size="sm">
              Upgrade Tier
            </Button>
          </VStack>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <HStack justify="space-between">
          <HStack>
            <Camera size={20} color="#D4AF37" />
            <Heading size="md">Media Gallery</Heading>
            <Badge>{fields.length}/20</Badge>
          </HStack>
          <Button
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={() => append({ type: 'image', url: '', caption: '', alt: '' })}
            isDisabled={fields.length >= 20}
          >
            Add Media
          </Button>
        </HStack>
      </CardHeader>
      <CardBody>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {fields.map((field, index) => (
            <Card key={field.id} variant="outline" size="sm">
              <CardBody p={3}>
                <VStack spacing={2}>
                  <Box 
                    w="full" 
                    h="120px" 
                    bg="gray.100" 
                    borderRadius="md" 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center"
                  >
                    <Camera size={24} color="gray.400" />
                  </Box>
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
                  <IconButton
                    aria-label="Remove media"
                    icon={<Trash2 size={14} />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => remove(index)}
                  />
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
        
        {fields.length === 0 && (
          <Box textAlign="center" py={8} color="gray.500">
            <Camera size={32} style={{ margin: '0 auto 16px' }} />
            <Text>No media added yet</Text>
            <Text fontSize="sm">Add images and videos to showcase your work</Text>
          </Box>
        )}
      </CardBody>
    </Card>
  )
}

// 5. Impact Metrics Section
export function ImpactMetricsSection({ control, register, errors, isLocked, onUpgrade }: SectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'metrics'
  })

  if (isLocked) {
    return (
      <Card opacity={0.6}>
        <CardHeader>
          <HStack>
            <BarChart3 size={20} color="#D4AF37" />
            <Heading size="md">Impact Metrics</Heading>
            <Badge colorScheme="yellow">Elite+</Badge>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={4}>
            <Text color="gray.500" textAlign="center">
              Upgrade to Elite or Legacy tier to showcase key statistics
            </Text>
            <Button onClick={onUpgrade} colorScheme="yellow" size="sm">
              Upgrade Tier
            </Button>
          </VStack>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <HStack justify="space-between">
          <HStack>
            <BarChart3 size={20} color="#D4AF37" />
            <Heading size="md">Impact Metrics</Heading>
          </HStack>
          <Button
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={() => append({ name: '', value: '', description: '', unit: '' })}
          >
            Add Metric
          </Button>
        </HStack>
      </CardHeader>
      <CardBody>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {fields.map((field, index) => (
            <Card key={field.id} variant="outline">
              <CardBody>
                <VStack spacing={3}>
                  <HStack w="full" justify="space-between">
                    <Text fontWeight="medium">Metric {index + 1}</Text>
                    <IconButton
                      aria-label="Remove metric"
                      icon={<Trash2 size={16} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => remove(index)}
                    />
                  </HStack>
                  
                  <FormControl>
                    <FormLabel fontSize="sm">Metric Name</FormLabel>
                    <Input
                      {...register(`metrics.${index}.name`)}
                      placeholder="e.g., People Impacted"
                      size="sm"
                    />
                  </FormControl>
                  
                  <HStack w="full">
                    <FormControl>
                      <FormLabel fontSize="sm">Value</FormLabel>
                      <Input
                        {...register(`metrics.${index}.value`)}
                        placeholder="1,000,000"
                        size="sm"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm">Unit</FormLabel>
                      <Input
                        {...register(`metrics.${index}.unit`)}
                        placeholder="people"
                        size="sm"
                      />
                    </FormControl>
                  </HStack>
                  
                  <FormControl>
                    <FormLabel fontSize="sm">Description</FormLabel>
                    <Textarea
                      {...register(`metrics.${index}.description`)}
                      placeholder="Brief description of this metric..."
                      rows={2}
                      size="sm"
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
        
        {fields.length === 0 && (
          <Box textAlign="center" py={8} color="gray.500">
            <BarChart3 size={32} style={{ margin: '0 auto 16px' }} />
            <Text>No metrics added yet</Text>
            <Text fontSize="sm">Add key statistics to showcase your impact</Text>
          </Box>
        )}
      </CardBody>
    </Card>
  )
}

// 6. Links & Social Section
export function LinksSocialSection({ control, register, errors }: SectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'links'
  })

  const platformOptions = [
    { value: 'website', label: 'Website' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'github', label: 'GitHub' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <Card>
      <CardHeader>
        <HStack justify="space-between">
          <HStack>
            <LinkIcon size={20} color="#D4AF37" />
            <Heading size="md">Links & Social</Heading>
          </HStack>
          <Button
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={() => append({ title: '', url: '', platform: 'website' })}
          >
            Add Link
          </Button>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack spacing={4}>
          {fields.map((field, index) => (
            <Card key={field.id} variant="outline" w="full">
              <CardBody>
                <VStack spacing={3}>
                  <HStack w="full" justify="space-between">
                    <Text fontWeight="medium">Link {index + 1}</Text>
                    <IconButton
                      aria-label="Remove link"
                      icon={<Trash2 size={16} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => remove(index)}
                    />
                  </HStack>
                  
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3} w="full">
                    <FormControl>
                      <FormLabel fontSize="sm">Title</FormLabel>
                      <Input
                        {...register(`links.${index}.title`)}
                        placeholder="Link title"
                        size="sm"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm">Platform</FormLabel>
                      <Select
                        {...register(`links.${index}.platform`)}
                        size="sm"
                      >
                        {platformOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm">URL</FormLabel>
                      <Input
                        {...register(`links.${index}.url`)}
                        placeholder="https://..."
                        size="sm"
                      />
                    </FormControl>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>
          ))}
          
          {fields.length === 0 && (
            <Box textAlign="center" py={8} color="gray.500">
              <LinkIcon size={32} style={{ margin: '0 auto 16px' }} />
              <Text>No links added yet</Text>
              <Text fontSize="sm">Add your website and social media links</Text>
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  )
}
