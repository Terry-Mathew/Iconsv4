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
  Image,
  AspectRatio,
  SimpleGrid,
  Divider,
  useToast
} from '@chakra-ui/react'
import { 
  Upload, 
  Plus, 
  Trash2, 
  GripVertical, 
  Calendar,
  Link as LinkIcon,
  Award,
  Quote,
  BarChart3,
  Camera,
  Sparkles
} from 'lucide-react'
import { useFieldArray, Control, UseFormRegister, FieldErrors } from 'react-hook-form'

interface SectionProps {
  control: Control<any>
  register: UseFormRegister<any>
  errors: FieldErrors
  isLocked?: boolean
  onUpgrade?: () => void
}

// 1. Hero Banner Section
export function HeroBannerSection({ control, register, errors, isLocked, onUpgrade }: SectionProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const toast = useToast()

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'File too large',
          description: 'Please select an image under 5MB',
          status: 'error',
          duration: 3000,
        })
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (isLocked) {
    return (
      <Card opacity={0.6} position="relative">
        <CardHeader>
          <HStack justify="space-between">
            <HStack>
              <Camera size={20} color="#D4AF37" />
              <Heading size="md">Hero Banner</Heading>
              <Badge colorScheme="yellow">Premium</Badge>
            </HStack>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={4}>
            <Text color="gray.500" textAlign="center">
              Upgrade to access hero banner with image/video upload
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
        <HStack>
          <Camera size={20} color="#D4AF37" />
          <Heading size="md">Hero Banner</Heading>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.heroImage}>
            <FormLabel>Hero Image</FormLabel>
            <Box
              border="2px dashed"
              borderColor="gray.300"
              borderRadius="lg"
              p={8}
              textAlign="center"
              cursor="pointer"
              _hover={{ borderColor: "#D4AF37" }}
              position="relative"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
              {imagePreview ? (
                <AspectRatio ratio={16/9}>
                  <Image src={imagePreview} alt="Hero preview" borderRadius="md" />
                </AspectRatio>
              ) : (
                <VStack spacing={2}>
                  <Upload size={32} color="#D4AF37" />
                  <Text>Click to upload hero image</Text>
                  <Text fontSize="sm" color="gray.500">
                    Recommended: 1920x1080px, max 5MB
                  </Text>
                </VStack>
              )}
            </Box>
            <FormErrorMessage>{errors.heroImage?.message as string}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Video Embed URL (Optional)</FormLabel>
            <Input
              {...register('heroVideo')}
              placeholder="https://youtube.com/watch?v=..."
            />
            <Text fontSize="sm" color="gray.500" mt={1}>
              YouTube, Vimeo, or direct video URL
            </Text>
          </FormControl>
        </VStack>
      </CardBody>
    </Card>
  )
}

// 2. Curated Bio Section
export function CuratedBioSection({ control, register, errors, isLocked, onUpgrade }: SectionProps) {
  const [charCount, setCharCount] = useState(0)

  if (isLocked) {
    return (
      <Card opacity={0.6}>
        <CardHeader>
          <HStack justify="space-between">
            <HStack>
              <Sparkles size={20} color="#D4AF37" />
              <Heading size="md">Curated Bio</Heading>
              <Badge colorScheme="yellow">Premium</Badge>
            </HStack>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={4}>
            <Text color="gray.500" textAlign="center">
              Upgrade to access AI-polished bio with rich formatting
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
            <Sparkles size={20} color="#D4AF37" />
            <Heading size="md">Curated Bio</Heading>
          </HStack>
          <Button size="sm" variant="outline" leftIcon={<Sparkles size={16} />}>
            AI Polish
          </Button>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.bio}>
            <FormLabel>Your Story</FormLabel>
            <Textarea
              {...register('bio', { 
                required: 'Bio is required',
                maxLength: { value: 2000, message: 'Bio must be under 2000 characters' }
              })}
              placeholder="Tell your story in a compelling way..."
              rows={8}
              onChange={(e) => setCharCount(e.target.value.length)}
            />
            <HStack justify="space-between" mt={1}>
              <FormErrorMessage>{errors.bio?.message as string}</FormErrorMessage>
              <Text fontSize="sm" color={charCount > 1800 ? "red.500" : "gray.500"}>
                {charCount}/2000
              </Text>
            </HStack>
          </FormControl>
        </VStack>
      </CardBody>
    </Card>
  )
}

// 3. Achievements Timeline Section
export function AchievementsTimelineSection({ control, register, errors, isLocked, onUpgrade }: SectionProps) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'achievements'
  })

  if (isLocked) {
    return (
      <Card opacity={0.6}>
        <CardHeader>
          <HStack>
            <Award size={20} color="#D4AF37" />
            <Heading size="md">Achievements Timeline</Heading>
            <Badge colorScheme="yellow">Premium</Badge>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={4}>
            <Text color="gray.500" textAlign="center">
              Upgrade to showcase your achievements in a dynamic timeline
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
            <Award size={20} color="#D4AF37" />
            <Heading size="md">Achievements Timeline</Heading>
          </HStack>
          <Button
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={() => append({ title: '', description: '', date: '', category: '' })}
          >
            Add Achievement
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
                    <HStack>
                      <IconButton
                        aria-label="Drag to reorder"
                        icon={<GripVertical size={16} />}
                        size="sm"
                        variant="ghost"
                        cursor="grab"
                      />
                      <Text fontWeight="medium">Achievement {index + 1}</Text>
                    </HStack>
                    <IconButton
                      aria-label="Remove achievement"
                      icon={<Trash2 size={16} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => remove(index)}
                    />
                  </HStack>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} w="full">
                    <FormControl>
                      <FormLabel fontSize="sm">Title</FormLabel>
                      <Input
                        {...register(`achievements.${index}.title`)}
                        placeholder="Achievement title"
                        size="sm"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm">Date</FormLabel>
                      <Input
                        {...register(`achievements.${index}.date`)}
                        type="date"
                        size="sm"
                      />
                    </FormControl>
                  </SimpleGrid>
                  
                  <FormControl>
                    <FormLabel fontSize="sm">Description</FormLabel>
                    <Textarea
                      {...register(`achievements.${index}.description`)}
                      placeholder="Describe this achievement..."
                      rows={3}
                      size="sm"
                    />
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
          ))}
          
          {fields.length === 0 && (
            <Box textAlign="center" py={8} color="gray.500">
              <Award size={32} style={{ margin: '0 auto 16px' }} />
              <Text>No achievements added yet</Text>
              <Text fontSize="sm">Click "Add Achievement" to get started</Text>
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  )
}
