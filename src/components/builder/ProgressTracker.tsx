'use client'

import {
  Box,
  Card,
  CardBody,
  VStack,
  HStack,
  Text,
  Progress,
  Badge,
  Button,
  Heading,
  Divider,
  Icon,
  useColorModeValue
} from '@chakra-ui/react'
import { CheckCircle, Circle, Lock, Crown, Star, Award } from 'lucide-react'

interface ProgressTrackerProps {
  currentTier: 'emerging' | 'accomplished' | 'distinguished' | 'legacy'
  completedSections: string[]
  totalSections: number
  onUpgrade?: () => void
}

interface SectionConfig {
  id: string
  name: string
  required: boolean
  tiers: ('emerging' | 'accomplished' | 'distinguished' | 'legacy')[]
  icon: any
}

const SECTION_CONFIG: SectionConfig[] = [
  {
    id: 'basic',
    name: 'Basic Information',
    required: true,
    tiers: ['emerging', 'accomplished', 'distinguished', 'legacy'],
    icon: Circle
  },
  {
    id: 'bio',
    name: 'Curated Bio',
    required: true,
    tiers: ['emerging', 'accomplished', 'distinguished', 'legacy'],
    icon: Circle
  },
  {
    id: 'links',
    name: 'Links & Social',
    required: true,
    tiers: ['emerging', 'accomplished', 'distinguished', 'legacy'],
    icon: Circle
  },
  {
    id: 'hero',
    name: 'Hero Banner',
    required: false,
    tiers: ['emerging', 'accomplished', 'distinguished', 'legacy'],
    icon: Circle
  },
  {
    id: 'metrics',
    name: 'Impact Metrics',
    required: false,
    tiers: ['accomplished', 'distinguished', 'legacy'],
    icon: Star
  },
  {
    id: 'gallery',
    name: 'Media Gallery',
    required: false,
    tiers: ['accomplished', 'distinguished', 'legacy'],
    icon: Star
  },
  {
    id: 'achievements',
    name: 'Achievements Timeline',
    required: false,
    tiers: ['distinguished', 'legacy'],
    icon: Award
  },
  {
    id: 'tributes',
    name: 'Tributes & Quotes',
    required: false,
    tiers: ['legacy'],
    icon: Award
  },
  {
    id: 'vision',
    name: 'Future Vision',
    required: false,
    tiers: ['legacy'],
    icon: Award
  },
  {
    id: 'analytics',
    name: 'Analytics Preview',
    required: false,
    tiers: ['distinguished', 'legacy'],
    icon: Award
  }
]

export function ProgressTracker({ 
  currentTier, 
  completedSections, 
  totalSections, 
  onUpgrade 
}: ProgressTrackerProps) {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  // Filter sections available for current tier
  const availableSections = SECTION_CONFIG.filter(section => 
    section.tiers.includes(currentTier)
  )

  const requiredSections = availableSections.filter(section => section.required)
  const optionalSections = availableSections.filter(section => !section.required)

  const completedRequired = requiredSections.filter(section => 
    completedSections.includes(section.id)
  ).length

  const completedOptional = optionalSections.filter(section => 
    completedSections.includes(section.id)
  ).length

  const totalCompleted = completedSections.length
  const progressPercentage = totalSections > 0 ? (totalCompleted / totalSections) * 100 : 0

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'rising':
        return 'blue'
      case 'elite':
        return 'purple'
      case 'legacy':
        return 'yellow'
      default:
        return 'gray'
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'rising':
        return Circle
      case 'elite':
        return Star
      case 'legacy':
        return Crown
      default:
        return Circle
    }
  }

  return (
    <Card bg={bgColor} borderColor={borderColor} shadow="lg" position="sticky" top="20px">
      <CardBody>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <VStack spacing={3}>
            <HStack>
              <Icon as={getTierIcon(currentTier)} color="#D4AF37" boxSize={6} />
              <Heading size="md" fontFamily="'Playfair Display', serif">
                Profile Progress
              </Heading>
            </HStack>
            <Badge 
              colorScheme={getTierColor(currentTier)} 
              size="lg" 
              px={3} 
              py={1}
              borderRadius="full"
            >
              {currentTier.toUpperCase()} TIER
            </Badge>
          </VStack>

          {/* Overall Progress */}
          <VStack spacing={2}>
            <HStack w="full" justify="space-between">
              <Text fontSize="sm" fontWeight="medium">
                Overall Progress
              </Text>
              <Text fontSize="sm" color="gray.600">
                {totalCompleted}/{totalSections}
              </Text>
            </HStack>
            <Progress 
              value={progressPercentage} 
              colorScheme={getTierColor(currentTier)}
              size="lg" 
              w="full"
              borderRadius="full"
            />
            <Text fontSize="xs" color="gray.500" alignSelf="start">
              {Math.round(progressPercentage)}% complete
            </Text>
          </VStack>

          <Divider />

          {/* Required Sections */}
          <VStack spacing={3} align="stretch">
            <Text fontSize="sm" fontWeight="bold" color="red.500">
              Required Sections ({completedRequired}/{requiredSections.length})
            </Text>
            {requiredSections.map((section) => {
              const isCompleted = completedSections.includes(section.id)
              return (
                <HStack key={section.id} spacing={3}>
                  <Icon 
                    as={isCompleted ? CheckCircle : Circle} 
                    color={isCompleted ? "green.500" : "gray.400"}
                    boxSize={4}
                  />
                  <Text 
                    fontSize="sm" 
                    color={isCompleted ? "green.600" : "gray.600"}
                    textDecoration={isCompleted ? "line-through" : "none"}
                  >
                    {section.name}
                  </Text>
                </HStack>
              )
            })}
          </VStack>

          {/* Optional Sections */}
          {optionalSections.length > 0 && (
            <>
              <Divider />
              <VStack spacing={3} align="stretch">
                <Text fontSize="sm" fontWeight="bold" color="blue.500">
                  Optional Sections ({completedOptional}/{optionalSections.length})
                </Text>
                {optionalSections.map((section) => {
                  const isCompleted = completedSections.includes(section.id)
                  const isAvailable = section.tiers.includes(currentTier)
                  
                  return (
                    <HStack key={section.id} spacing={3}>
                      <Icon 
                        as={isCompleted ? CheckCircle : isAvailable ? section.icon : Lock} 
                        color={
                          isCompleted ? "green.500" : 
                          isAvailable ? "#D4AF37" : "gray.400"
                        }
                        boxSize={4}
                      />
                      <Text 
                        fontSize="sm" 
                        color={
                          isCompleted ? "green.600" : 
                          isAvailable ? "gray.600" : "gray.400"
                        }
                        textDecoration={isCompleted ? "line-through" : "none"}
                      >
                        {section.name}
                      </Text>
                      {!isAvailable && (
                        <Badge size="xs" colorScheme="yellow">
                          {section.tiers.includes('accomplished') ? 'Accomplished+' : 'Legacy'}
                        </Badge>
                      )}
                    </HStack>
                  )
                })}
              </VStack>
            </>
          )}

          {/* Upgrade CTA */}
          {currentTier !== 'legacy' && onUpgrade && (
            <>
              <Divider />
              <VStack spacing={3}>
                <Text fontSize="sm" textAlign="center" color="gray.600">
                  Unlock more sections with a tier upgrade
                </Text>
                <Button
                  onClick={onUpgrade}
                  colorScheme="yellow"
                  size="sm"
                  leftIcon={<Crown size={16} />}
                  w="full"
                >
                  Upgrade Tier
                </Button>
              </VStack>
            </>
          )}

          {/* Completion Status */}
          {completedRequired === requiredSections.length && (
            <Box 
              p={3} 
              bg="green.50" 
              borderRadius="lg" 
              border="1px solid" 
              borderColor="green.200"
            >
              <VStack spacing={2}>
                <Icon as={CheckCircle} color="green.500" boxSize={5} />
                <Text fontSize="sm" fontWeight="medium" color="green.700" textAlign="center">
                  Ready to Preview & Publish!
                </Text>
              </VStack>
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  )
}
