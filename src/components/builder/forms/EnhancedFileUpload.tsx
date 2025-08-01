'use client'

import { useState, useCallback, useRef } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Image,
  Progress,
  Alert,
  AlertIcon,
  Badge,
  Grid,
  GridItem,
  Input,
  Textarea,
  useToast,
  Tooltip,
  AspectRatio,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  X,
  Edit,
  Eye,
  Download,
  Image as ImageIcon,
  Video,
  File,
  Plus,
  GripVertical,
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const MotionBox = motion.create(Box)
const MotionGrid = motion.create(Grid)

interface MediaFile {
  id: string
  url: string
  caption: string
  type: 'image' | 'video'
  size?: number
  name?: string
  order: number
  isUploading?: boolean
  uploadProgress?: number
}

interface EnhancedFileUploadProps {
  files: MediaFile[]
  onChange: (files: MediaFile[]) => void
  maxFiles?: number
  maxFileSize?: number // in MB
  acceptedTypes?: string[]
  allowReordering?: boolean
  allowCaptions?: boolean
  uploadEndpoint?: string
  mode?: 'single' | 'multiple' | 'gallery'
  aspectRatio?: number
  gridColumns?: number
}

// Sortable Media Item Component
function SortableMediaItem({
  file,
  onEdit,
  onDelete,
  onPreview,
  allowCaptions = true,
  aspectRatio = 16/9,
}: {
  file: MediaFile
  onEdit: (file: MediaFile) => void
  onDelete: (id: string) => void
  onPreview: (file: MediaFile) => void
  allowCaptions?: boolean
  aspectRatio?: number
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <MotionBox
      ref={setNodeRef}
      style={{ ...style, transition: 'all 0.2s' }}
      bg="white"
      border="1px solid"
      borderColor={isDragging ? '#D4AF37' : 'gray.200'}
      borderRadius="12px"
      overflow="hidden"
      boxShadow={isDragging ? 'lg' : 'sm'}
      _hover={{
        borderColor: '#D4AF37',
        boxShadow: 'md',
      }}
      position="relative"
    >
      {/* Upload Progress Overlay */}
      {file.isUploading && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0, 0, 0, 0.7)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={2}
        >
          <VStack spacing={2}>
            <Progress
              value={file.uploadProgress || 0}
              size="sm"
              colorScheme="yellow"
              bg="gray.200"
              w="80%"
              borderRadius="full"
            />
            <Text color="white" fontSize="sm">
              Uploading... {file.uploadProgress || 0}%
            </Text>
          </VStack>
        </Box>
      )}

      {/* Drag Handle */}
      <Box
        position="absolute"
        top={2}
        left={2}
        {...attributes}
        {...listeners}
        bg="rgba(0, 0, 0, 0.7)"
        color="white"
        p={1}
        borderRadius="md"
        cursor="grab"
        _active={{ cursor: 'grabbing' }}
        zIndex={1}
        opacity={0}
        _groupHover={{ opacity: 1 }}
        transition="opacity 0.2s"
      >
        <GripVertical size={16} />
      </Box>

      {/* Action Buttons */}
      <HStack
        position="absolute"
        top={2}
        right={2}
        spacing={1}
        opacity={0}
        _groupHover={{ opacity: 1 }}
        transition="opacity 0.2s"
        zIndex={1}
      >
        <Tooltip label="Preview" placement="top">
          <IconButton
            aria-label="Preview"
            icon={<Eye size={14} />}
            size="xs"
            bg="rgba(0, 0, 0, 0.7)"
            color="white"
            _hover={{ bg: 'rgba(0, 0, 0, 0.9)' }}
            onClick={() => onPreview(file)}
          />
        </Tooltip>
        
        {allowCaptions && (
          <Tooltip label="Edit caption" placement="top">
            <IconButton
              aria-label="Edit caption"
              icon={<Edit size={14} />}
              size="xs"
              bg="rgba(0, 0, 0, 0.7)"
              color="white"
              _hover={{ bg: 'rgba(0, 0, 0, 0.9)' }}
              onClick={() => onEdit(file)}
            />
          </Tooltip>
        )}
        
        <Tooltip label="Delete" placement="top">
          <IconButton
            aria-label="Delete"
            icon={<X size={14} />}
            size="xs"
            bg="rgba(255, 0, 0, 0.7)"
            color="white"
            _hover={{ bg: 'rgba(255, 0, 0, 0.9)' }}
            onClick={() => onDelete(file.id)}
          />
        </Tooltip>
      </HStack>

      {/* Media Content */}
      <AspectRatio ratio={aspectRatio}>
        <Box position="relative" role="group">
          {file.type === 'image' ? (
            <Image
              src={file.url}
              alt={file.caption || 'Uploaded image'}
              objectFit="cover"
              w="full"
              h="full"
            />
          ) : (
            <Box
              w="full"
              h="full"
              bg="gray.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <Video size={32} color="gray.500" />
              <Text fontSize="xs" color="gray.500" mt={1}>
                Video File
              </Text>
            </Box>
          )}
        </Box>
      </AspectRatio>

      {/* File Info */}
      <Box p={3}>
        <VStack spacing={2} align="stretch">
          {file.caption && (
            <Text
              fontSize="sm"
              color="gray.700"
              fontFamily="'Lato', sans-serif"
              noOfLines={2}
              lineHeight="1.3"
            >
              {file.caption}
            </Text>
          )}
          
          <HStack justify="space-between" align="center">
            <Badge
              colorScheme={file.type === 'image' ? 'green' : 'blue'}
              variant="subtle"
              fontSize="xs"
            >
              <HStack spacing={1}>
                {file.type === 'image' ? <ImageIcon size={10} /> : <Video size={10} />}
                <Text>{file.type.toUpperCase()}</Text>
              </HStack>
            </Badge>
            
            {file.size && (
              <Text fontSize="xs" color="gray.500">
                {formatFileSize(file.size)}
              </Text>
            )}
          </HStack>
        </VStack>
      </Box>
    </MotionBox>
  )
}

// Main Enhanced File Upload Component
export function EnhancedFileUpload({
  files,
  onChange,
  maxFiles = 10,
  maxFileSize = 5, // 5MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'],
  allowReordering = true,
  allowCaptions = true,
  uploadEndpoint = '/api/upload',
  mode = 'multiple',
  aspectRatio = 16/9,
  gridColumns = 3,
}: EnhancedFileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [editingFile, setEditingFile] = useState<MediaFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = files.findIndex((item) => item.id === active.id)
      const newIndex = files.findIndex((item) => item.id === over?.id)

      const newFiles = arrayMove(files, oldIndex, newIndex).map(
        (file, index) => ({
          ...file,
          order: index,
        })
      )

      onChange(newFiles)
    }
  }

  const handleFileSelect = useCallback(async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const fileArray = Array.from(selectedFiles)
    
    // Validate file count
    if (files.length + fileArray.length > maxFiles) {
      toast({
        title: 'Too many files',
        description: `Maximum ${maxFiles} files allowed`,
        status: 'error',
        duration: 3000,
      })
      return
    }

    // Process each file
    for (const file of fileArray) {
      // Validate file type
      if (!acceptedTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: `${file.name} is not a supported file type`,
          status: 'error',
          duration: 3000,
        })
        continue
      }

      // Validate file size
      if (file.size > maxFileSize * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `${file.name} exceeds ${maxFileSize}MB limit`,
          status: 'error',
          duration: 3000,
        })
        continue
      }

      // Create temporary file object
      const tempFile: MediaFile = {
        id: `temp-${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
        caption: '',
        type: file.type.startsWith('image/') ? 'image' : 'video',
        size: file.size,
        name: file.name,
        order: files.length,
        isUploading: true,
        uploadProgress: 0,
      }

      // Add to files list
      onChange([...files, tempFile])

      // Simulate upload (replace with actual upload logic)
      try {
        await simulateUpload(tempFile, (progress) => {
          const updatedFiles = files.map(f => 
            f.id === tempFile.id 
              ? { ...f, uploadProgress: progress }
              : f
          )
          onChange(updatedFiles)
        })

        // Mark as completed
        const completedFiles = files.map(f => 
          f.id === tempFile.id 
            ? { ...f, isUploading: false, uploadProgress: 100 }
            : f
        )
        onChange(completedFiles)

        toast({
          title: 'Upload successful',
          description: `${file.name} uploaded successfully`,
          status: 'success',
          duration: 3000,
        })
      } catch (error) {
        // Remove failed upload
        const filteredFiles = files.filter(f => f.id !== tempFile.id)
        onChange(filteredFiles)

        toast({
          title: 'Upload failed',
          description: `Failed to upload ${file.name}`,
          status: 'error',
          duration: 3000,
        })
      }
    }
  }, [files, onChange, maxFiles, maxFileSize, acceptedTypes, toast])

  // Simulate upload progress (replace with actual upload implementation)
  const simulateUpload = (file: MediaFile, onProgress: (progress: number) => void) => {
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          resolve(true)
        }
        onProgress(progress)
      }, 200)
    })
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDeleteFile = (id: string) => {
    const newFiles = files
      .filter(file => file.id !== id)
      .map((file, index) => ({ ...file, order: index }))
    onChange(newFiles)
  }

  const handleEditFile = (file: MediaFile) => {
    setEditingFile(file)
  }

  const handlePreviewFile = (file: MediaFile) => {
    window.open(file.url, '_blank')
  }

  const handleSaveCaption = (caption: string) => {
    if (editingFile) {
      const updatedFiles = files.map(file =>
        file.id === editingFile.id ? { ...file, caption } : file
      )
      onChange(updatedFiles)
      setEditingFile(null)
    }
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Upload Area */}
      <Box
        border="2px dashed"
        borderColor={isDragOver ? '#D4AF37' : 'gray.300'}
        borderRadius="12px"
        p={8}
        textAlign="center"
        bg={isDragOver ? 'rgba(212, 175, 55, 0.1)' : 'gray.50'}
        cursor="pointer"
        transition="all 0.2s"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        _hover={{
          borderColor: '#D4AF37',
          bg: 'rgba(212, 175, 55, 0.05)',
        }}
      >
        <VStack spacing={4}>
          <Box
            w={12}
            h={12}
            bg="#D4AF37"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Upload size={24} color="white" />
          </Box>
          
          <VStack spacing={2}>
            <Text
              fontSize="lg"
              fontWeight="600"
              color="#1A1A1A"
              fontFamily="'Lato', sans-serif"
            >
              {mode === 'single' ? 'Upload Image' : 'Upload Media Files'}
            </Text>
            <Text fontSize="sm" color="gray.600">
              Drag and drop files here, or click to browse
            </Text>
            <Text fontSize="xs" color="gray.500">
              Supports: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} • 
              Max {maxFileSize}MB per file • {maxFiles} files max
            </Text>
          </VStack>
        </VStack>

        <Input
          ref={fileInputRef}
          type="file"
          multiple={mode !== 'single'}
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          display="none"
        />
      </Box>

      {/* Files Grid */}
      {files.length > 0 && (
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between" align="center">
            <Text
              fontSize="md"
              fontWeight="600"
              color="#1A1A1A"
              fontFamily="'Lato', sans-serif"
            >
              Uploaded Files ({files.length}/{maxFiles})
            </Text>
            
            {allowReordering && files.length > 1 && (
              <Text fontSize="xs" color="gray.500">
                Drag to reorder
              </Text>
            )}
          </HStack>

          {allowReordering ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={files} strategy={rectSortingStrategy}>
                <MotionGrid
                  templateColumns={`repeat(${gridColumns}, 1fr)`}
                  gap={4}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatePresence>
                    {files.map((file) => (
                      <GridItem key={file.id}>
                        <SortableMediaItem
                          file={file}
                          onEdit={handleEditFile}
                          onDelete={handleDeleteFile}
                          onPreview={handlePreviewFile}
                          allowCaptions={allowCaptions}
                          aspectRatio={aspectRatio}
                        />
                      </GridItem>
                    ))}
                  </AnimatePresence>
                </MotionGrid>
              </SortableContext>
            </DndContext>
          ) : (
            <MotionGrid
              templateColumns={`repeat(${gridColumns}, 1fr)`}
              gap={4}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence>
                {files.map((file) => (
                  <GridItem key={file.id}>
                    <MotionBox
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SortableMediaItem
                        file={file}
                        onEdit={handleEditFile}
                        onDelete={handleDeleteFile}
                        onPreview={handlePreviewFile}
                        allowCaptions={allowCaptions}
                        aspectRatio={aspectRatio}
                      />
                    </MotionBox>
                  </GridItem>
                ))}
              </AnimatePresence>
            </MotionGrid>
          )}
        </VStack>
      )}

      {/* Caption Edit Modal */}
      {editingFile && (
        <MotionBox
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0, 0, 0, 0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={1000}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setEditingFile(null)}
        >
          <MotionBox
            bg="white"
            borderRadius="12px"
            p={6}
            maxW="md"
            w="full"
            mx={4}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <VStack spacing={4} align="stretch">
              <Text
                fontSize="lg"
                fontWeight="600"
                color="#1A1A1A"
                fontFamily="'Playfair Display', serif"
              >
                Edit Caption
              </Text>
              
              <Textarea
                value={editingFile.caption}
                onChange={(e) => setEditingFile({ ...editingFile, caption: e.target.value })}
                placeholder="Add a caption for this image..."
                rows={3}
                resize="vertical"
              />
              
              <HStack spacing={3} justify="end">
                <Button
                  variant="outline"
                  onClick={() => setEditingFile(null)}
                >
                  Cancel
                </Button>
                <Button
                  bg="#D4AF37"
                  color="white"
                  _hover={{ bg: "#B8941F" }}
                  onClick={() => handleSaveCaption(editingFile.caption)}
                >
                  Save Caption
                </Button>
              </HStack>
            </VStack>
          </MotionBox>
        </MotionBox>
      )}
    </VStack>
  )
}
