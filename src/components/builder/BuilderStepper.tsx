'use client'

import {
  Box,
  HStack,
  VStack,
  Text,
  Circle,
  Divider,
  useBreakpointValue,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import {
  Crown,
  User,
  FileText,
  Trophy,
  Link,
  Eye,
} from 'lucide-react'

const MotionBox = motion.create(Box)
const MotionCircle = motion.create(Circle)

interface Step {
  id: number
  title: string
  description: string
  icon: React.ElementType
}

const STEPS: Step[] = [
  {
    id: 1,
    title: 'Tier Selection',
    description: 'Choose your profile tier',
    icon: Crown,
  },
  {
    id: 2,
    title: 'Basic Info',
    description: 'Name, tagline & hero image',
    icon: User,
  },
  {
    id: 3,
    title: 'Biography',
    description: 'AI-enhanced biography',
    icon: FileText,
  },
  {
    id: 4,
    title: 'Achievements',
    description: 'Milestones & accomplishments',
    icon: Trophy,
  },
  {
    id: 5,
    title: 'Links & Media',
    description: 'Social links & gallery',
    icon: Link,
  },
  {
    id: 6,
    title: 'Preview',
    description: 'Review & publish',
    icon: Eye,
  },
]

interface BuilderStepperProps {
  currentStep: number
  completedSteps: number[]
  onStepClick?: (step: number) => void
}

export function BuilderStepper({
  currentStep,
  completedSteps,
  onStepClick,
}: BuilderStepperProps) {
  const isMobile = useBreakpointValue({ base: true, md: false })

  const getStepStatus = (stepId: number) => {
    if (completedSteps.includes(stepId)) return 'completed'
    if (stepId === currentStep) return 'current'
    if (stepId < currentStep) return 'completed'
    return 'upcoming'
  }

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#D4AF37'
      case 'current':
        return '#D4AF37'
      default:
        return '#E8E0D0'
    }
  }

  const getTextColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'current':
        return '#1A1A1A'
      default:
        return '#8B8680'
    }
  }

  if (isMobile) {
    // Mobile: Horizontal scrollable stepper
    return (
      <Box
        bg="white"
        borderBottom="1px solid"
        borderColor="rgba(212, 175, 55, 0.2)"
        px={4}
        py={3}
        overflowX="auto"
      >
        <HStack spacing={4} minW="max-content">
          {STEPS.map((step, index) => {
            const status = getStepStatus(step.id)
            const Icon = step.icon

            return (
              <VStack
                key={step.id}
                spacing={1}
                cursor={onStepClick ? 'pointer' : 'default'}
                onClick={() => onStepClick?.(step.id)}
                minW="80px"
              >
                <MotionCircle
                  size="40px"
                  bg={getStepColor(status)}
                  color={status === 'upcoming' ? '#8B8680' : 'white'}
                  border={status === 'current' ? '2px solid #D4AF37' : 'none'}
                  whileHover={onStepClick ? { scale: 1.05 } : {}}
                  whileTap={onStepClick ? { scale: 0.95 } : {}}
                >
                  <Icon size={18} />
                </MotionCircle>
                <Text
                  fontSize="xs"
                  fontWeight="600"
                  color={getTextColor(status)}
                  textAlign="center"
                  lineHeight="1.2"
                >
                  {step.title}
                </Text>
              </VStack>
            )
          })}
        </HStack>
      </Box>
    )
  }

  // Desktop: Full horizontal stepper
  return (
    <Box
      bg="white"
      borderBottom="1px solid"
      borderColor="rgba(212, 175, 55, 0.2)"
      px={8}
      py={6}
    >
      <HStack spacing={0} justify="space-between">
        {STEPS.map((step, index) => {
          const status = getStepStatus(step.id)
          const Icon = step.icon
          const isLast = index === STEPS.length - 1

          return (
            <HStack key={step.id} spacing={0} flex={1}>
              <VStack
                spacing={3}
                cursor={onStepClick ? 'pointer' : 'default'}
                onClick={() => onStepClick?.(step.id)}
              >
                <MotionCircle
                  size="50px"
                  bg={getStepColor(status)}
                  color={status === 'upcoming' ? '#8B8680' : 'white'}
                  border={status === 'current' ? '3px solid #D4AF37' : 'none'}
                  whileHover={onStepClick ? { scale: 1.05 } : {}}
                  whileTap={onStepClick ? { scale: 0.95 } : {}}
                  transition={{ duration: 0.2 }}
                >
                  <Icon size={22} />
                </MotionCircle>
                <VStack spacing={1}>
                  <Text
                    fontSize="sm"
                    fontWeight="700"
                    color={getTextColor(status)}
                    fontFamily="'Lato', sans-serif"
                  >
                    {step.title}
                  </Text>
                  <Text
                    fontSize="xs"
                    color="#8B8680"
                    textAlign="center"
                    maxW="120px"
                    lineHeight="1.3"
                  >
                    {step.description}
                  </Text>
                </VStack>
              </VStack>

              {!isLast && (
                <Box flex={1} px={4}>
                  <Divider
                    borderColor={
                      completedSteps.includes(step.id + 1) || currentStep > step.id
                        ? '#D4AF37'
                        : '#E8E0D0'
                    }
                    borderWidth="2px"
                  />
                </Box>
              )}
            </HStack>
          )
        })}
      </HStack>
    </Box>
  )
}
