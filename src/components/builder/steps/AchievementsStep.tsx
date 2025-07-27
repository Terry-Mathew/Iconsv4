'use client'

import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  IconButton,
  Badge,
  SimpleGrid,
  useDisclosure,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Plus, Edit3, Trash2, Calendar, Tag } from 'lucide-react'
import { useState } from 'react'
import { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { AchievementModal } from '../modals/AchievementModal'

const MotionBox = motion.create(Box)
const MotionCard = motion.create(Card)

interface Achievement {
  title: string
  description: string
  year: string
  category: string
}

interface AchievementsStepProps {
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
  onNext: () => void
  onPrevious: () => void
  selectedTier: string
}

export function AchievementsStep({
  setValue,
  watch,
  onNext,
  onPrevious,
  selectedTier,
}: AchievementsStepProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const achievements = watch('achievements') || []

  const handleAddAchievement = (achievement: Achievement) => {
    if (editingIndex !== null) {
      // Edit existing achievement
      const updatedAchievements = [...achievements]
      updatedAchievements[editingIndex] = achievement
      setValue('achievements', updatedAchievements)
      setEditingIndex(null)
    } else {
      // Add new achievement
      setValue('achievements', [...achievements, achievement])
    }
    onClose()
  }

  const handleEditAchievement = (index: number) => {
    setEditingIndex(index)
    onOpen()
  }

  const handleDeleteAchievement = (index: number) => {
    const updatedAchievements = achievements.filter((_: any, i: number) => i !== index)
    setValue('achievements', updatedAchievements)
  }

  const openAddModal = () => {
    setEditingIndex(null)
    onOpen()
  }

  const isValid = achievements.length > 0

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  }

  return (
    <MotionBox
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      maxW="4xl"
      mx="auto"
      px={6}
      py={8}
    >
      <VStack spacing={8}>
        {/* Header */}
        <MotionBox variants={itemVariants} textAlign="center">
          <Heading
            as="h2"
            fontSize={{ base: '2xl', md: '3xl' }}
            fontFamily="'Playfair Display', serif"
            color="#1A1A1A"
            mb={2}
          >
            Achievements & Milestones
          </Heading>
          <Text color="#8B8680" fontSize="lg" maxW="600px">
            Showcase your key accomplishments, awards, and significant milestones
          </Text>
        </MotionBox>

        {/* Add Achievement Button */}
        <MotionBox variants={itemVariants} w="full">
          <Button
            leftIcon={<Plus size={20} />}
            onClick={openAddModal}
            size="lg"
            bg="#D4AF37"
            color="white"
            _hover={{ bg: '#B8941F' }}
            w="full"
          >
            Add Achievement
          </Button>
        </MotionBox>

        {/* Achievements List */}
        {achievements.length > 0 ? (
          <MotionBox variants={itemVariants} w="full">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <AnimatePresence>
                {achievements.map((achievement: Achievement, index: number) => (
                  <MotionCard
                    key={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    border="1px solid #E8E0D0"
                    _hover={{ shadow: 'md', borderColor: '#D4AF37' }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardBody p={4}>
                      <VStack spacing={3} align="start">
                        {/* Header with actions */}
                        <HStack justify="space-between" w="full">
                          <HStack>
                            <Trophy size={18} color="#D4AF37" />
                            <Badge colorScheme="gray" size="sm">
                              {achievement.category}
                            </Badge>
                          </HStack>
                          <HStack spacing={1}>
                            <IconButton
                              aria-label="Edit achievement"
                              icon={<Edit3 size={14} />}
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditAchievement(index)}
                            />
                            <IconButton
                              aria-label="Delete achievement"
                              icon={<Trash2 size={14} />}
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => handleDeleteAchievement(index)}
                            />
                          </HStack>
                        </HStack>

                        {/* Content */}
                        <VStack spacing={2} align="start" w="full">
                          <Heading
                            as="h4"
                            fontSize="md"
                            fontWeight="600"
                            color="#1A1A1A"
                            lineHeight="1.3"
                          >
                            {achievement.title}
                          </Heading>
                          
                          <Text
                            fontSize="sm"
                            color="#8B8680"
                            lineHeight="1.4"
                            noOfLines={3}
                          >
                            {achievement.description}
                          </Text>

                          <HStack spacing={2} mt={2}>
                            <Calendar size={14} color="#8B8680" />
                            <Text fontSize="xs" color="#8B8680" fontWeight="500">
                              {achievement.year}
                            </Text>
                          </HStack>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </MotionCard>
                ))}
              </AnimatePresence>
            </SimpleGrid>
          </MotionBox>
        ) : (
          <MotionBox variants={itemVariants} w="full">
            <Card bg="rgba(212, 175, 55, 0.05)" border="2px dashed #E8E0D0">
              <CardBody p={8} textAlign="center">
                <VStack spacing={4}>
                  <Trophy size={48} color="#D4AF37" />
                  <VStack spacing={2}>
                    <Text fontSize="lg" fontWeight="600" color="#1A1A1A">
                      No achievements added yet
                    </Text>
                    <Text fontSize="sm" color="#8B8680" maxW="400px">
                      Add your key accomplishments, awards, certifications, or significant milestones
                      to showcase your journey and expertise.
                    </Text>
                  </VStack>
                  <Button
                    leftIcon={<Plus size={16} />}
                    onClick={openAddModal}
                    variant="outline"
                    colorScheme="gray"
                  >
                    Add Your First Achievement
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>
        )}

        {/* Tips */}
        <MotionBox variants={itemVariants} w="full">
          <Card bg="rgba(212, 175, 55, 0.05)">
            <CardBody p={6}>
              <VStack spacing={3} align="start">
                <HStack>
                  <Tag size={18} color="#D4AF37" />
                  <Text fontSize="md" fontWeight="600" color="#1A1A1A">
                    Achievement Tips
                  </Text>
                </HStack>
                <VStack spacing={2} align="start" fontSize="sm" color="#8B8680">
                  <Text>• Include awards, certifications, and recognitions</Text>
                  <Text>• Add career milestones and promotions</Text>
                  <Text>• Mention published works or speaking engagements</Text>
                  <Text>• Include educational achievements and degrees</Text>
                  <Text>• Add volunteer work and community contributions</Text>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </MotionBox>

        {/* Navigation Buttons */}
        <HStack spacing={4} w="full" justify="space-between">
          <Button
            variant="outline"
            colorScheme="gray"
            onClick={onPrevious}
            size="lg"
          >
            Previous
          </Button>

          <Button
            bg="#D4AF37"
            color="white"
            _hover={{ bg: '#B8941F' }}
            onClick={onNext}
            size="lg"
            isDisabled={!isValid}
          >
            Continue
          </Button>
        </HStack>

        {!isValid && (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            Please add at least one achievement to continue
          </Alert>
        )}
      </VStack>

      {/* Achievement Modal */}
      <AchievementModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleAddAchievement}
        achievement={editingIndex !== null ? achievements[editingIndex] : undefined}
        isEditing={editingIndex !== null}
      />
    </MotionBox>
  )
}
