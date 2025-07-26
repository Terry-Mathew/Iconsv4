'use client'

import { useState, useRef } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  HStack,
  Text,
  Image,
  AspectRatio,
  IconButton,
  useToast,
  Progress,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react'
import { Upload, X, ExternalLink, Play } from 'lucide-react'
import { createClientClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth/AuthProvider'

interface MediaUploadFieldProps {
  value?: string
  onChange: (url: string) => void
  onClear?: () => void
  type: 'image' | 'video'
  label: string
  maxSize?: number // in MB, default 10MB
  required?: boolean
  error?: string
}

export function MediaUploadField({
  value,
  onChange,
  onClear,
  type,
  label,
  maxSize = 10,
  required = false,
  error
}: MediaUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [urlInput, setUrlInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const supabase = createClientClient()
  const { user } = useAuth()

  // Client-side file validation
  const validateFile = (file: File): string | null => {
    // Check file size (convert MB to bytes)
    const maxSizeBytes = maxSize * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSize}MB. Current size: ${(file.size / 1024 / 1024).toFixed(1)}MB`
    }

    // Check file type
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const validVideoTypes = ['video/mp4', 'video/webm']
    
    if (type === 'image' && !validImageTypes.includes(file.type)) {
      return 'Invalid image format. Please use JPEG, PNG, or WebP.'
    }
    
    if (type === 'video' && !validVideoTypes.includes(file.type)) {
      return 'Invalid video format. Please use MP4 or WebM.'
    }

    return null
  }

  const handleFileUpload = async (file: File) => {
    // Client-side validation before upload
    const validationError = validateFile(file)
    if (validationError) {
      toast({
        title: 'Upload Error',
        description: validationError,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      if (!user) {
        throw new Error('User must be authenticated to upload files')
      }

      // Generate unique filename with user folder structure
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const bucket = type === 'image' ? 'profile-images' : 'media-gallery'

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      onChange(publicUrl)
      
      toast({
        title: 'Upload Successful',
        description: `${type === 'image' ? 'Image' : 'Video'} uploaded successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload file',
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      // Basic URL validation
      try {
        new URL(urlInput)
        onChange(urlInput.trim())
        setUrlInput('')
        toast({
          title: 'URL Added',
          description: 'External media URL added successfully',
          status: 'success',
          duration: 3000,
          isClosable: true
        })
      } catch {
        toast({
          title: 'Invalid URL',
          description: 'Please enter a valid URL',
          status: 'error',
          duration: 3000,
          isClosable: true
        })
      }
    }
  }

  const handleClear = () => {
    onChange('')
    setUrlInput('')
    if (onClear) onClear()
  }

  const isImage = type === 'image'
  const acceptedFormats = isImage 
    ? '.jpg,.jpeg,.png,.webp' 
    : '.mp4,.webm'

  return (
    <FormControl isRequired={required} isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      
      <Tabs variant="enclosed" size="sm">
        <TabList>
          <Tab>Upload File</Tab>
          <Tab>External URL</Tab>
        </TabList>
        
        <TabPanels>
          {/* File Upload Tab */}
          <TabPanel px={0}>
            <VStack spacing={4} align="stretch">
              {!value && (
                <Box
                  border="2px dashed"
                  borderColor="gray.300"
                  borderRadius="lg"
                  p={8}
                  textAlign="center"
                  cursor="pointer"
                  _hover={{ borderColor: 'blue.400', bg: 'gray.50' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <VStack spacing={2}>
                    <Upload size={32} color="#718096" />
                    <Text fontSize="sm" color="gray.600">
                      Click to upload {isImage ? 'image' : 'video'} or drag and drop
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {isImage ? 'JPEG, PNG, WebP' : 'MP4, WebM'} (max {maxSize}MB)
                    </Text>
                  </VStack>
                </Box>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFormats}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />

              {isUploading && (
                <Box>
                  <Text fontSize="sm" mb={2}>Uploading...</Text>
                  <Progress value={uploadProgress} colorScheme="blue" />
                </Box>
              )}
            </VStack>
          </TabPanel>

          {/* External URL Tab */}
          <TabPanel px={0}>
            <VStack spacing={3} align="stretch">
              <HStack>
                <Input
                  placeholder={`Enter ${isImage ? 'image' : 'video'} URL`}
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                />
                <Button
                  leftIcon={<ExternalLink size={16} />}
                  onClick={handleUrlSubmit}
                  isDisabled={!urlInput.trim()}
                  colorScheme="blue"
                  size="sm"
                >
                  Add
                </Button>
              </HStack>
              
              <Alert status="info" size="sm">
                <AlertIcon />
                <Text fontSize="xs">
                  For videos: YouTube, Vimeo embed URLs or direct video file links
                </Text>
              </Alert>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Preview */}
      {value && (
        <Box mt={4} position="relative">
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" fontWeight="medium">Preview</Text>
            <IconButton
              aria-label="Remove media"
              icon={<X size={16} />}
              size="sm"
              variant="ghost"
              onClick={handleClear}
            />
          </HStack>
          
          <AspectRatio ratio={isImage ? 16/9 : 16/9} maxW="300px">
            {isImage ? (
              <Image
                src={value}
                alt="Preview"
                borderRadius="md"
                objectFit="cover"
                fallback={
                  <Box bg="gray.100" display="flex" alignItems="center" justifyContent="center">
                    <Text fontSize="sm" color="gray.500">Image preview</Text>
                  </Box>
                }
              />
            ) : (
              <Box
                bg="gray.100"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
              >
                <Play size={32} color="#718096" />
                <Text
                  position="absolute"
                  bottom={2}
                  left={2}
                  fontSize="xs"
                  color="gray.600"
                  bg="white"
                  px={2}
                  py={1}
                  borderRadius="sm"
                >
                  Video
                </Text>
              </Box>
            )}
          </AspectRatio>
        </Box>
      )}

      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  )
}
