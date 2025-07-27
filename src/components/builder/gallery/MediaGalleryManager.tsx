'use client'

import { useState, useCallback } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Image,
  Badge,
  Card,
  CardBody,
  Grid,
  GridItem,
  AspectRatio,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tooltip,
  Input,
  Textarea,
  Select,
  Alert,
  AlertIcon,
  Progress,
  useToast,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  Edit,
  Trash2,
  Eye,
  Download,
  Plus,
  Grid3X3,
  List,
  Filter,
  Search,
  Star,
  StarOff,
  Move,
  ZoomIn,
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
const MotionCard = motion.create(Card)

interface MediaItem {
  id: string
  url: string
  caption: string
  type: 'image' | 'video'
  size?: number
  name?: string
  order: number
  isFeatured?: boolean
  tags?: string[]
  uploadDate?: Date
  isUploading?: boolean
  uploadProgress?: number
}

interface MediaGalleryManagerProps {
  items: MediaItem[]
  onChange: (items: MediaItem[]) => void
  maxItems?: number
  allowReordering?: boolean
  allowTagging?: boolean
  tier: 'rising' | 'elite' | 'legacy'
}

// Sortable Media Item Component
function SortableMediaItem({
  item,
  onEdit,
  onDelete,
  onPreview,
  onToggleFeatured,
  viewMode = 'grid',
}: {
  item: MediaItem
  onEdit: (item: MediaItem) => void
  onDelete: (id: string) => void
  onPreview: (item: MediaItem) => void
  onToggleFeatured?: (id: string) => void
  viewMode?: 'grid' | 'list'
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

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

  if (viewMode === 'list') {
    return (
      <MotionCard
        ref={setNodeRef}
        style={style}
        variant="outline"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <CardBody p={4}>
          <HStack spacing={4} align="center">
            {/* Drag Handle */}
            <Box
              {...attributes}
              {...listeners}
              cursor="grab"
              _active={{ cursor: 'grabbing' }}
              color="gray.400"
              _hover={{ color: '#D4AF37' }}
            >
              <Move size={16} />
            </Box>

            {/* Thumbnail */}
            <AspectRatio ratio={16/9} w="80px" flexShrink={0}>
              {item.type === 'image' ? (
                <Image
                  src={item.url}
                  alt={item.caption || 'Media item'}
                  objectFit="cover"
                  borderRadius="md"
                />
              ) : (
                <Box
                  bg="gray.100"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <VideoIcon size={24} color="gray.500" />
                </Box>
              )}
            </AspectRatio>

            {/* Info */}
            <VStack align="start" spacing={1} flex={1}>
              <HStack spacing={2} align="center">
                <Text fontSize="sm" fontWeight="600" noOfLines={1}>
                  {item.name || `${item.type} ${item.order + 1}`}
                </Text>
                {item.isFeatured && (
                  <Badge colorScheme="yellow" variant="solid" size="sm">
                    Featured
                  </Badge>
                )}
                <Badge
                  colorScheme={item.type === 'image' ? 'green' : 'blue'}
                  variant="subtle"
                  size="sm"
                >
                  {item.type.toUpperCase()}
                </Badge>
              </HStack>
              
              <Text fontSize="xs" color="gray.600" noOfLines={2}>
                {item.caption || 'No caption'}
              </Text>
              
              {item.size && (
                <Text fontSize="xs" color="gray.500">
                  {formatFileSize(item.size)}
                </Text>
              )}
            </VStack>

            {/* Actions */}
            <HStack spacing={1}>
              {onToggleFeatured && (
                <Tooltip label={item.isFeatured ? 'Remove from featured' : 'Mark as featured'}>
                  <IconButton
                    aria-label="Toggle featured"
                    icon={item.isFeatured ? <StarOff size={16} /> : <Star size={16} />}
                    size="sm"
                    variant="ghost"
                    colorScheme={item.isFeatured ? 'yellow' : 'gray'}
                    onClick={() => onToggleFeatured(item.id)}
                  />
                </Tooltip>
              )}
              
              <Tooltip label="Preview">
                <IconButton
                  aria-label="Preview"
                  icon={<Eye size={16} />}
                  size="sm"
                  variant="ghost"
                  onClick={() => onPreview(item)}
                />
              </Tooltip>
              
              <Tooltip label="Edit">
                <IconButton
                  aria-label="Edit"
                  icon={<Edit size={16} />}
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={() => onEdit(item)}
                />
              </Tooltip>
              
              <Tooltip label="Delete">
                <IconButton
                  aria-label="Delete"
                  icon={<Trash2 size={16} />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => onDelete(item.id)}
                />
              </Tooltip>
            </HStack>
          </HStack>
        </CardBody>
      </MotionCard>
    )
  }

  // Grid view
  return (
    <MotionCard
      ref={setNodeRef}
      style={style}
      variant="outline"
      overflow="hidden"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      _hover={{ borderColor: '#D4AF37', transform: 'translateY(-2px)' }}
      cursor="pointer"
      position="relative"
      role="group"
    >
      {/* Upload Progress Overlay */}
      {item.isUploading && (
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
              value={item.uploadProgress || 0}
              size="sm"
              colorScheme="yellow"
              bg="gray.200"
              w="80%"
              borderRadius="full"
            />
            <Text color="white" fontSize="sm">
              {item.uploadProgress || 0}%
            </Text>
          </VStack>
        </Box>
      )}

      {/* Featured Badge */}
      {item.isFeatured && (
        <Badge
          position="absolute"
          top={2}
          left={2}
          colorScheme="yellow"
          variant="solid"
          size="sm"
          zIndex={1}
        >
          Featured
        </Badge>
      )}

      {/* Drag Handle */}
      <Box
        position="absolute"
        top={2}
        right={2}
        {...attributes}
        {...listeners}
        bg="rgba(0, 0, 0, 0.7)"
        color="white"
        p={1}
        borderRadius="md"
        cursor="grab"
        _active={{ cursor: 'grabbing' }}
        opacity={0}
        _groupHover={{ opacity: 1 }}
        transition="opacity 0.2s"
        zIndex={1}
      >
        <Move size={14} />
      </Box>

      {/* Media Content */}
      <AspectRatio ratio={1}>
        {item.type === 'image' ? (
          <Image
            src={item.url}
            alt={item.caption || 'Media item'}
            objectFit="cover"
            onClick={() => onPreview(item)}
          />
        ) : (
          <Box
            bg="gray.100"
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={() => onPreview(item)}
          >
            <VideoIcon size={32} color="gray.500" />
          </Box>
        )}
      </AspectRatio>

      {/* Action Overlay */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        bg="linear-gradient(transparent, rgba(0, 0, 0, 0.8))"
        p={3}
        opacity={0}
        _groupHover={{ opacity: 1 }}
        transition="opacity 0.2s"
      >
        <VStack spacing={2} align="stretch">
          {item.caption && (
            <Text
              color="white"
              fontSize="sm"
              noOfLines={2}
              lineHeight="1.3"
            >
              {item.caption}
            </Text>
          )}
          
          <HStack justify="center" spacing={2}>
            {onToggleFeatured && (
              <IconButton
                aria-label="Toggle featured"
                icon={item.isFeatured ? <StarOff size={14} /> : <Star size={14} />}
                size="xs"
                variant="solid"
                colorScheme={item.isFeatured ? 'yellow' : 'gray'}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFeatured(item.id)
                }}
              />
            )}
            
            <IconButton
              aria-label="Preview"
              icon={<ZoomIn size={14} />}
              size="xs"
              variant="solid"
              colorScheme="blue"
              onClick={(e) => {
                e.stopPropagation()
                onPreview(item)
              }}
            />
            
            <IconButton
              aria-label="Edit"
              icon={<Edit size={14} />}
              size="xs"
              variant="solid"
              colorScheme="green"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(item)
              }}
            />
            
            <IconButton
              aria-label="Delete"
              icon={<Trash2 size={14} />}
              size="xs"
              variant="solid"
              colorScheme="red"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(item.id)
              }}
            />
          </HStack>
        </VStack>
      </Box>
    </MotionCard>
  )
}

// Media Preview Modal
function MediaPreviewModal({
  item,
  isOpen,
  onClose,
}: {
  item: MediaItem | null
  isOpen: boolean
  onClose: () => void
}) {
  if (!item) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
      <ModalOverlay bg="blackAlpha.800" />
      <ModalContent bg="transparent" boxShadow="none" maxW="90vw" maxH="90vh">
        <ModalCloseButton color="white" size="lg" />
        <ModalBody p={0} display="flex" alignItems="center" justifyContent="center">
          {item.type === 'image' ? (
            <Image
              src={item.url}
              alt={item.caption || 'Media preview'}
              maxW="100%"
              maxH="90vh"
              objectFit="contain"
              borderRadius="md"
            />
          ) : (
            <video
              controls
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                borderRadius: '8px',
              }}
            >
              <source src={item.url} />
              Your browser does not support the video tag.
            </video>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

// Main Media Gallery Manager Component
export function MediaGalleryManager({
  items,
  onChange,
  maxItems = 20,
  allowReordering = true,
  allowTagging = true,
  tier,
}: MediaGalleryManagerProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all')
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)
  
  const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure()
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
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over?.id)

      const newItems = arrayMove(items, oldIndex, newIndex).map(
        (item, index) => ({
          ...item,
          order: index,
        })
      )

      onChange(newItems)
    }
  }

  const handleEdit = (item: MediaItem) => {
    // Open edit modal (implement as needed)
    console.log('Edit item:', item)
  }

  const handleDelete = (id: string) => {
    const newItems = items
      .filter(item => item.id !== id)
      .map((item, index) => ({ ...item, order: index }))
    onChange(newItems)
  }

  const handlePreview = (item: MediaItem) => {
    setPreviewItem(item)
    onPreviewOpen()
  }

  const handleToggleFeatured = (id: string) => {
    const newItems = items.map(item =>
      item.id === id ? { ...item, isFeatured: !item.isFeatured } : item
    )
    onChange(newItems)
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = !searchQuery || 
      item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = filterType === 'all' || item.type === filterType

    return matchesSearch && matchesType
  })

  const gridColumns = viewMode === 'grid' ?
    { base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)', xl: 'repeat(5, 1fr)' } :
    { base: '1fr' }

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <HStack justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text
            fontSize="xl"
            fontWeight="600"
            color="#1A1A1A"
            fontFamily="'Playfair Display', serif"
          >
            Media Gallery
          </Text>
          <Text fontSize="sm" color="gray.600">
            {filteredItems.length} of {items.length} items • {maxItems - items.length} slots remaining
          </Text>
        </VStack>

        <HStack spacing={2}>
          <Button
            leftIcon={<Plus size={16} />}
            bg="#D4AF37"
            color="white"
            _hover={{ bg: "#B8941F" }}
            size="sm"
            isDisabled={items.length >= maxItems}
          >
            Add Media
          </Button>
        </HStack>
      </HStack>

      {/* Controls */}
      <HStack spacing={4} wrap="wrap">
        <HStack spacing={2} flex={1} minW="200px">
          <Input
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
            maxW="300px"
          />
          
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            size="sm"
            w="120px"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </Select>
        </HStack>

        <HStack spacing={1}>
          <IconButton
            aria-label="Grid view"
            icon={<Grid3X3 size={16} />}
            size="sm"
            variant={viewMode === 'grid' ? 'solid' : 'outline'}
            colorScheme={viewMode === 'grid' ? 'blue' : 'gray'}
            onClick={() => setViewMode('grid')}
          />
          <IconButton
            aria-label="List view"
            icon={<List size={16} />}
            size="sm"
            variant={viewMode === 'list' ? 'solid' : 'outline'}
            colorScheme={viewMode === 'list' ? 'blue' : 'gray'}
            onClick={() => setViewMode('list')}
          />
        </HStack>
      </HStack>

      {/* Media Grid/List */}
      {filteredItems.length > 0 ? (
        allowReordering ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={filteredItems} strategy={rectSortingStrategy}>
              <Grid templateColumns={gridColumns} gap={4}>
                <AnimatePresence>
                  {filteredItems.map((item) => (
                    <GridItem key={item.id}>
                      <SortableMediaItem
                        item={item}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onPreview={handlePreview}
                        onToggleFeatured={handleToggleFeatured}
                        viewMode={viewMode}
                      />
                    </GridItem>
                  ))}
                </AnimatePresence>
              </Grid>
            </SortableContext>
          </DndContext>
        ) : (
          <Grid templateColumns={gridColumns} gap={4}>
            <AnimatePresence>
              {filteredItems.map((item) => (
                <GridItem key={item.id}>
                  <SortableMediaItem
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onPreview={handlePreview}
                    onToggleFeatured={handleToggleFeatured}
                    viewMode={viewMode}
                  />
                </GridItem>
              ))}
            </AnimatePresence>
          </Grid>
        )
      ) : (
        <Alert status="info" borderRadius="12px">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" fontWeight="600">
              {items.length === 0 ? 'No media files added yet' : 'No media matches your filters'}
            </Text>
            <Text fontSize="xs" color="gray.600">
              {items.length === 0 
                ? 'Upload images and videos to showcase your work'
                : 'Try adjusting your search or filter criteria'
              }
            </Text>
          </VStack>
        </Alert>
      )}

      {/* Preview Modal */}
      <MediaPreviewModal
        item={previewItem}
        isOpen={isPreviewOpen}
        onClose={() => {
          onPreviewClose()
          setPreviewItem(null)
        }}
      />
    </VStack>
  )
}
