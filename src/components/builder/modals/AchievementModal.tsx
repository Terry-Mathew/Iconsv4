'use client'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Select,
  Button,
  Text,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { Trophy, Calendar, Tag, FileText } from 'lucide-react'
import { useEffect } from 'react'

interface Achievement {
  title: string
  description: string
  year: string
  category: string
}

interface AchievementModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (achievement: Achievement) => void
  achievement?: Achievement
  isEditing?: boolean
}

const ACHIEVEMENT_CATEGORIES = [
  'Award',
  'Certification',
  'Publication',
  'Speaking',
  'Leadership',
  'Education',
  'Recognition',
  'Milestone',
  'Project',
  'Other',
]

export function AchievementModal({
  isOpen,
  onClose,
  onSave,
  achievement,
  isEditing = false,
}: AchievementModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<Achievement>({
    mode: 'onChange',
  })

  useEffect(() => {
    if (isOpen) {
      if (achievement) {
        // Populate form with existing achievement data
        setValue('title', achievement.title)
        setValue('description', achievement.description)
        setValue('year', achievement.year)
        setValue('category', achievement.category)
      } else {
        // Reset form for new achievement
        reset({
          title: '',
          description: '',
          year: new Date().getFullYear().toString(),
          category: 'Award',
        })
      }
    }
  }, [isOpen, achievement, setValue, reset])

  const onSubmit = (data: Achievement) => {
    onSave(data)
    reset()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  // Generate year options (current year back to 50 years)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 51 }, (_, i) => currentYear - i)

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <Trophy size={24} color="#D4AF37" />
            <Text>
              {isEditing ? 'Edit Achievement' : 'Add Achievement'}
            </Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4}>
              {/* Title */}
              <FormControl isInvalid={!!errors.title}>
                <FormLabel>
                  <HStack>
                    <FileText size={16} />
                    <Text>Achievement Title</Text>
                  </HStack>
                </FormLabel>
                <Input
                  {...register('title', {
                    required: 'Title is required',
                    minLength: {
                      value: 3,
                      message: 'Title must be at least 3 characters',
                    },
                  })}
                  placeholder="e.g., Best Employee Award, PhD in Computer Science"
                  size="lg"
                  bg="white"
                  border="2px solid #E8E0D0"
                  _focus={{
                    borderColor: '#D4AF37',
                    boxShadow: '0 0 0 1px #D4AF37',
                  }}
                />
                <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
              </FormControl>

              {/* Category and Year */}
              <HStack spacing={4} w="full">
                <FormControl isInvalid={!!errors.category}>
                  <FormLabel>
                    <HStack>
                      <Tag size={16} />
                      <Text>Category</Text>
                    </HStack>
                  </FormLabel>
                  <Select
                    {...register('category', {
                      required: 'Category is required',
                    })}
                    size="lg"
                    bg="white"
                    border="2px solid #E8E0D0"
                    _focus={{
                      borderColor: '#D4AF37',
                      boxShadow: '0 0 0 1px #D4AF37',
                    }}
                  >
                    {ACHIEVEMENT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.year}>
                  <FormLabel>
                    <HStack>
                      <Calendar size={16} />
                      <Text>Year</Text>
                    </HStack>
                  </FormLabel>
                  <Select
                    {...register('year', {
                      required: 'Year is required',
                    })}
                    size="lg"
                    bg="white"
                    border="2px solid #E8E0D0"
                    _focus={{
                      borderColor: '#D4AF37',
                      boxShadow: '0 0 0 1px #D4AF37',
                    }}
                  >
                    {yearOptions.map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.year?.message}</FormErrorMessage>
                </FormControl>
              </HStack>

              {/* Description */}
              <FormControl isInvalid={!!errors.description}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  {...register('description', {
                    required: 'Description is required',
                    minLength: {
                      value: 10,
                      message: 'Description must be at least 10 characters',
                    },
                  })}
                  placeholder="Describe the achievement, its significance, and any relevant details..."
                  size="lg"
                  bg="white"
                  border="2px solid #E8E0D0"
                  _focus={{
                    borderColor: '#D4AF37',
                    boxShadow: '0 0 0 1px #D4AF37',
                  }}
                  rows={4}
                  resize="vertical"
                />
                <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <HStack spacing={3}>
              <Button
                variant="outline"
                colorScheme="gray"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                bg="#D4AF37"
                color="white"
                _hover={{ bg: '#B8941F' }}
                isDisabled={!isValid}
              >
                {isEditing ? 'Update' : 'Add'} Achievement
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
