'use client'

import { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Badge,
  Card,
  CardBody,
  Button,
  useDisclosure,
  Tooltip,
  Alert,
  AlertIcon,
  Flex,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  GripVertical, 
  Edit, 
  Trash2, 
  Plus, 
  Award,
  Calendar,
  Tag,
  Eye,
  EyeOff,
} from 'lucide-react'
import { AchievementModal } from '../modals/AchievementModal'
import { achievementCategories, type AchievementCategory } from '@/lib/validations/profile-builder'

const MotionBox = motion.create(Box)
const MotionCard = motion.create(Card)

interface Achievement {
  id: string
  title: string
  description: string
  year: string
  category: AchievementCategory
  order: number
  isVisible?: boolean
}

interface DragDropAchievementsProps {
  achievements: Achievement[]
  onChange: (achievements: Achievement[]) => void
  maxAchievements?: number
  allowCategorization?: boolean
  showVisibilityToggle?: boolean
}

// Sortable Achievement Item Component
function SortableAchievementItem({ 
  achievement, 
  onEdit, 
  onDelete, 
  onToggleVisibility,
  showVisibilityToggle = false,
  isDragging = false,
}: {
  achievement: Achievement
  onEdit: (achievement: Achievement) => void
  onDelete: (id: string) => void
  onToggleVisibility?: (id: string) => void
  showVisibilityToggle?: boolean
  isDragging?: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: achievement.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  }

  const category = achievementCategories[achievement.category]

  return (
    <MotionCard
      ref={setNodeRef}
      style={{ ...style, transition: 'all 0.2s' }}
      bg={achievement.isVisible === false ? 'gray.50' : 'white'}
      border="1px solid"
      borderColor={isSortableDragging ? '#D4AF37' : 'gray.200'}
      borderRadius="12px"
      boxShadow={isSortableDragging ? 'lg' : 'sm'}
      _hover={{
        borderColor: '#D4AF37',
        boxShadow: 'md',
        transform: 'translateY(-1px)',
      }}
      cursor={isDragging ? 'grabbing' : 'grab'}
      opacity={achievement.isVisible === false ? 0.6 : 1}
    >
      <CardBody p={4}>
        <HStack spacing={3} align="start">
          {/* Drag Handle */}
          <Box
            {...attributes}
            {...listeners}
            color="gray.400"
            _hover={{ color: '#D4AF37' }}
            cursor="grab"
            _active={{ cursor: 'grabbing' }}
            p={1}
            borderRadius="md"
            transition="all 0.2s"
          >
            <GripVertical size={20} />
          </Box>

          {/* Content */}
          <VStack flex={1} align="start" spacing={2}>
            <HStack justify="space-between" w="full" align="start">
              <VStack align="start" spacing={1} flex={1}>
                <HStack spacing={2} align="center">
                  <Text
                    fontWeight="600"
                    fontSize="md"
                    color="#1A1A1A"
                    fontFamily="'Lato', sans-serif"
                    lineHeight="1.2"
                  >
                    {achievement.title}
                  </Text>
                  {achievement.year && (
                    <Badge
                      colorScheme="blue"
                      variant="subtle"
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      <HStack spacing={1}>
                        <Calendar size={10} />
                        <Text>{achievement.year}</Text>
                      </HStack>
                    </Badge>
                  )}
                </HStack>

                <Text
                  fontSize="sm"
                  color="gray.600"
                  fontFamily="'Lato', sans-serif"
                  lineHeight="1.4"
                  noOfLines={2}
                >
                  {achievement.description}
                </Text>

                <HStack spacing={2}>
                  <Badge
                    colorScheme={category.color}
                    variant="subtle"
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="full"
                  >
                    <HStack spacing={1}>
                      <Text>{category.icon}</Text>
                      <Text>{category.label}</Text>
                    </HStack>
                  </Badge>
                  
                  <Badge
                    variant="outline"
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="full"
                    color="gray.500"
                  >
                    #{achievement.order + 1}
                  </Badge>
                </HStack>
              </VStack>

              {/* Action Buttons */}
              <HStack spacing={1}>
                {showVisibilityToggle && onToggleVisibility && (
                  <Tooltip 
                    label={achievement.isVisible === false ? 'Show in profile' : 'Hide from profile'}
                    placement="top"
                  >
                    <IconButton
                      aria-label="Toggle visibility"
                      icon={achievement.isVisible === false ? <EyeOff size={16} /> : <Eye size={16} />}
                      size="sm"
                      variant="ghost"
                      colorScheme={achievement.isVisible === false ? 'gray' : 'blue'}
                      onClick={() => onToggleVisibility(achievement.id)}
                    />
                  </Tooltip>
                )}
                
                <Tooltip label="Edit achievement" placement="top">
                  <IconButton
                    aria-label="Edit achievement"
                    icon={<Edit size={16} />}
                    size="sm"
                    variant="ghost"
                    colorScheme="blue"
                    onClick={() => onEdit(achievement)}
                  />
                </Tooltip>
                
                <Tooltip label="Delete achievement" placement="top">
                  <IconButton
                    aria-label="Delete achievement"
                    icon={<Trash2 size={16} />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => onDelete(achievement.id)}
                  />
                </Tooltip>
              </HStack>
            </HStack>
          </VStack>
        </HStack>
      </CardBody>
    </MotionCard>
  )
}

// Main Drag and Drop Achievements Component
export function DragDropAchievements({
  achievements,
  onChange,
  maxAchievements = 10,
  allowCategorization = true,
  showVisibilityToggle = false,
}: DragDropAchievementsProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = achievements.findIndex((item) => item.id === active.id)
      const newIndex = achievements.findIndex((item) => item.id === over?.id)

      const newAchievements = arrayMove(achievements, oldIndex, newIndex).map(
        (achievement, index) => ({
          ...achievement,
          order: index,
        })
      )

      onChange(newAchievements)
    }

    setActiveId(null)
  }

  const handleAddAchievement = () => {
    setEditingAchievement(null)
    onOpen()
  }

  const handleEditAchievement = (achievement: Achievement) => {
    setEditingAchievement(achievement)
    onOpen()
  }

  const handleDeleteAchievement = (id: string) => {
    const newAchievements = achievements
      .filter((achievement) => achievement.id !== id)
      .map((achievement, index) => ({
        ...achievement,
        order: index,
      }))
    onChange(newAchievements)
  }

  const handleToggleVisibility = (id: string) => {
    const newAchievements = achievements.map((achievement) =>
      achievement.id === id
        ? { ...achievement, isVisible: achievement.isVisible === false ? true : false }
        : achievement
    )
    onChange(newAchievements)
  }

  const handleSaveAchievement = (achievementData: any) => {
    if (editingAchievement) {
      // Update existing achievement
      const newAchievements = achievements.map((achievement) =>
        achievement.id === editingAchievement.id
          ? { ...achievement, ...achievementData }
          : achievement
      )
      onChange(newAchievements)
    } else {
      // Add new achievement
      const newAchievement: Achievement = {
        ...achievementData,
        id: `achievement-${Date.now()}`,
        order: achievements.length,
        isVisible: true,
        category: (achievementData.category || 'other') as AchievementCategory,
      }
      onChange([...achievements, newAchievement])
    }
    onClose()
  }

  const activeAchievement = achievements.find((achievement) => achievement.id === activeId)

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <HStack justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text
            fontSize="lg"
            fontWeight="600"
            color="#1A1A1A"
            fontFamily="'Playfair Display', serif"
          >
            Achievements & Milestones
          </Text>
          <Text fontSize="sm" color="gray.600">
            Drag to reorder • {achievements.length} of {maxAchievements} achievements
          </Text>
        </VStack>

        <Button
          leftIcon={<Plus size={16} />}
          onClick={handleAddAchievement}
          bg="#D4AF37"
          color="white"
          _hover={{ bg: "#B8941F" }}
          size="sm"
          isDisabled={achievements.length >= maxAchievements}
        >
          Add Achievement
        </Button>
      </HStack>

      {/* Achievements List */}
      {achievements.length === 0 ? (
        <Alert status="info" borderRadius="12px">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" fontWeight="600">
              No achievements added yet
            </Text>
            <Text fontSize="xs" color="gray.600">
              Add your first achievement to showcase your accomplishments
            </Text>
          </VStack>
        </Alert>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={achievements} strategy={verticalListSortingStrategy}>
            <VStack spacing={3} align="stretch">
              <AnimatePresence>
                {achievements.map((achievement) => (
                  <MotionBox
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SortableAchievementItem
                      achievement={achievement}
                      onEdit={handleEditAchievement}
                      onDelete={handleDeleteAchievement}
                      onToggleVisibility={showVisibilityToggle ? handleToggleVisibility : undefined}
                      showVisibilityToggle={showVisibilityToggle}
                      isDragging={activeId === achievement.id}
                    />
                  </MotionBox>
                ))}
              </AnimatePresence>
            </VStack>
          </SortableContext>

          <DragOverlay>
            {activeAchievement ? (
              <SortableAchievementItem
                achievement={activeAchievement}
                onEdit={() => {}}
                onDelete={() => {}}
                showVisibilityToggle={showVisibilityToggle}
                isDragging={true}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Achievement Modal */}
      <AchievementModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleSaveAchievement}
        achievement={editingAchievement || undefined}
      />
    </VStack>
  )
}
