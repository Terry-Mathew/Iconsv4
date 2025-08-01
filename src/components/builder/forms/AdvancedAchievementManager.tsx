'use client'

import { useState, useMemo } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Badge,
  Card,
  CardBody,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  GridItem,
  Alert,
  AlertIcon,
  Tooltip,
  useDisclosure,
  Collapse,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Award,
  TrendingUp,
  Users,
  BookOpen,
  Briefcase,
  Palette,
  Crown,
  Heart,
  Trophy,
  Star,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from 'lucide-react'
import { DragDropAchievements } from './DragDropAchievements'
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
  impact?: 'low' | 'medium' | 'high'
  tags?: string[]
  dateAdded?: Date
}

interface AdvancedAchievementManagerProps {
  achievements: Achievement[]
  onChange: (achievements: Achievement[]) => void
  maxAchievements?: number
  tier: 'emerging' | 'accomplished' | 'distinguished' | 'legacy'
  enableAnalytics?: boolean
}

// Category icons mapping
const categoryIcons = {
  professional: Briefcase,
  academic: BookOpen,
  creative: Palette,
  leadership: Crown,
  community: Heart,
  awards: Trophy,
  publications: BookOpen,
  other: Star,
} as const

// Achievement Analytics Component
function AchievementAnalytics({ achievements }: { achievements: Achievement[] }) {
  const analytics = useMemo(() => {
    const categoryDistribution = achievements.reduce((acc, achievement) => {
      acc[achievement.category] = (acc[achievement.category] || 0) + 1
      return acc
    }, {} as Record<AchievementCategory, number>)

    const impactDistribution = achievements.reduce((acc, achievement) => {
      const impact = achievement.impact || 'medium'
      acc[impact] = (acc[impact] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const yearDistribution = achievements.reduce((acc, achievement) => {
      if (achievement.year) {
        acc[achievement.year] = (acc[achievement.year] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const recentAchievements = achievements.filter(a => {
      const year = parseInt(a.year)
      const currentYear = new Date().getFullYear()
      return year >= currentYear - 2
    }).length

    return {
      total: achievements.length,
      visible: achievements.filter(a => a.isVisible !== false).length,
      categoryDistribution,
      impactDistribution,
      yearDistribution,
      recentAchievements,
      mostActiveYear: Object.entries(yearDistribution).sort(([,a], [,b]) => b - a)[0]?.[0],
      topCategory: Object.entries(categoryDistribution).sort(([,a], [,b]) => b - a)[0]?.[0] as AchievementCategory,
    }
  }, [achievements])

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      variant="outline"
      bg="blue.50"
      borderColor="blue.200"
    >
      <CardBody p={4}>
        <VStack spacing={4} align="stretch">
          <HStack spacing={2} align="center">
            <BarChart3 size={20} color="var(--chakra-colors-blue-500)" />
            <Text
              fontSize="md"
              fontWeight="600"
              color="blue.700"
              fontFamily="'Lato', sans-serif"
            >
              Achievement Analytics
            </Text>
          </HStack>

          <Grid templateColumns="repeat(auto-fit, minmax(120px, 1fr))" gap={3}>
            <GridItem>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="700" color="blue.600">
                  {analytics.total}
                </Text>
                <Text fontSize="xs" color="gray.600" textAlign="center">
                  Total Achievements
                </Text>
              </VStack>
            </GridItem>

            <GridItem>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="700" color="green.600">
                  {analytics.visible}
                </Text>
                <Text fontSize="xs" color="gray.600" textAlign="center">
                  Visible
                </Text>
              </VStack>
            </GridItem>

            <GridItem>
              <VStack spacing={1}>
                <Text fontSize="2xl" fontWeight="700" color="orange.600">
                  {analytics.recentAchievements}
                </Text>
                <Text fontSize="xs" color="gray.600" textAlign="center">
                  Recent (2 years)
                </Text>
              </VStack>
            </GridItem>

            {analytics.topCategory && (
              <GridItem>
                <VStack spacing={1}>
                  <Badge
                    colorScheme={achievementCategories[analytics.topCategory].color}
                    variant="solid"
                    fontSize="xs"
                    px={2}
                    py={1}
                  >
                    {achievementCategories[analytics.topCategory].label}
                  </Badge>
                  <Text fontSize="xs" color="gray.600" textAlign="center">
                    Top Category
                  </Text>
                </VStack>
              </GridItem>
            )}
          </Grid>

          {/* Category Distribution */}
          <VStack spacing={2} align="stretch">
            <Text fontSize="sm" fontWeight="600" color="gray.700">
              Category Distribution
            </Text>
            {Object.entries(analytics.categoryDistribution).map(([category, count]) => {
              const categoryConfig = achievementCategories[category as AchievementCategory]
              const percentage = (count / analytics.total) * 100

              return (
                <HStack key={category} justify="space-between">
                  <HStack spacing={2}>
                    <Text fontSize="sm">{categoryConfig.icon}</Text>
                    <Text fontSize="sm" color="gray.600">
                      {categoryConfig.label}
                    </Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Box
                      w="60px"
                      h="4px"
                      bg="gray.200"
                      borderRadius="full"
                      overflow="hidden"
                    >
                      <Box
                        w={`${percentage}%`}
                        h="full"
                        bg={`${categoryConfig.color}.400`}
                        borderRadius="full"
                      />
                    </Box>
                    <Text fontSize="sm" color="gray.600" minW="30px">
                      {count}
                    </Text>
                  </HStack>
                </HStack>
              )
            })}
          </VStack>
        </VStack>
      </CardBody>
    </MotionCard>
  )
}

// Category Filter Component
function CategoryFilter({
  selectedCategories,
  onCategoryChange,
  achievements,
}: {
  selectedCategories: AchievementCategory[]
  onCategoryChange: (categories: AchievementCategory[]) => void
  achievements: Achievement[]
}) {
  const categoryCounts = useMemo(() => {
    return achievements.reduce((acc, achievement) => {
      acc[achievement.category] = (acc[achievement.category] || 0) + 1
      return acc
    }, {} as Record<AchievementCategory, number>)
  }, [achievements])

  const handleCategoryToggle = (category: AchievementCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category))
    } else {
      onCategoryChange([...selectedCategories, category])
    }
  }

  const selectAll = () => {
    onCategoryChange(Object.keys(achievementCategories) as AchievementCategory[])
  }

  const clearAll = () => {
    onCategoryChange([])
  }

  return (
    <VStack spacing={3} align="stretch">
      <HStack justify="space-between" align="center">
        <Text fontSize="sm" fontWeight="600" color="gray.700">
          Filter by Category
        </Text>
        <HStack spacing={2}>
          <Button size="xs" variant="ghost" onClick={selectAll}>
            All
          </Button>
          <Button size="xs" variant="ghost" onClick={clearAll}>
            None
          </Button>
        </HStack>
      </HStack>

      <Grid templateColumns="repeat(auto-fit, minmax(140px, 1fr))" gap={2}>
        {Object.entries(achievementCategories).map(([key, config]) => {
          const category = key as AchievementCategory
          const count = categoryCounts[category] || 0
          const isSelected = selectedCategories.includes(category)
          const IconComponent = categoryIcons[category]

          return (
            <GridItem key={category}>
              <Button
                size="sm"
                variant={isSelected ? 'solid' : 'outline'}
                colorScheme={config.color}
                onClick={() => handleCategoryToggle(category)}
                w="full"
                justifyContent="start"
                leftIcon={<IconComponent size={14} />}
                rightIcon={
                  count > 0 ? (
                    <Badge
                      colorScheme={isSelected ? 'whiteAlpha' : config.color}
                      variant={isSelected ? 'solid' : 'subtle'}
                      fontSize="xs"
                      minW="20px"
                      borderRadius="full"
                    >
                      {count}
                    </Badge>
                  ) : undefined
                }
                isDisabled={count === 0}
              >
                <Text fontSize="xs" noOfLines={1}>
                  {config.label}
                </Text>
              </Button>
            </GridItem>
          )
        })}
      </Grid>
    </VStack>
  )
}

// Main Advanced Achievement Manager Component
export function AdvancedAchievementManager({
  achievements,
  onChange,
  maxAchievements = 20,
  tier,
  enableAnalytics = true,
}: AdvancedAchievementManagerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<AchievementCategory[]>(
    Object.keys(achievementCategories) as AchievementCategory[]
  )
  const [sortBy, setSortBy] = useState<'date' | 'category' | 'impact' | 'year'>('date')
  const [showHidden, setShowHidden] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  
  const { isOpen: isFiltersOpen, onToggle: onFiltersToggle } = useDisclosure({ defaultIsOpen: false })

  // Filter and sort achievements
  const filteredAchievements = useMemo(() => {
    let filtered = achievements.filter(achievement => {
      // Search filter
      const matchesSearch = !searchQuery || 
        achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        achievement.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        achievement.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Category filter
      const matchesCategory = selectedCategories.includes(achievement.category)

      // Visibility filter
      const matchesVisibility = showHidden || achievement.isVisible !== false

      return matchesSearch && matchesCategory && matchesVisibility
    })

    // Sort achievements
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return (b.dateAdded?.getTime() || 0) - (a.dateAdded?.getTime() || 0)
        case 'category':
          return a.category.localeCompare(b.category)
        case 'impact':
          const impactOrder = { high: 3, medium: 2, low: 1 }
          return (impactOrder[b.impact || 'medium'] || 2) - (impactOrder[a.impact || 'medium'] || 2)
        case 'year':
          return parseInt(b.year || '0') - parseInt(a.year || '0')
        default:
          return a.order - b.order
      }
    })

    return filtered
  }, [achievements, searchQuery, selectedCategories, showHidden, sortBy])

  const handleBulkVisibilityToggle = (visible: boolean) => {
    const updatedAchievements = achievements.map(achievement => ({
      ...achievement,
      isVisible: visible,
    }))
    onChange(updatedAchievements)
  }

  const handleBulkCategoryChange = (category: AchievementCategory) => {
    const updatedAchievements = achievements.map(achievement => 
      selectedCategories.includes(achievement.category)
        ? { ...achievement, category }
        : achievement
    )
    onChange(updatedAchievements)
  }

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
            Advanced Achievement Manager
          </Text>
          <Text fontSize="sm" color="gray.600">
            {filteredAchievements.length} of {achievements.length} achievements shown
          </Text>
        </VStack>

        <HStack spacing={2}>
          <Button
            leftIcon={<Filter size={16} />}
            onClick={onFiltersToggle}
            variant="outline"
            size="sm"
            rightIcon={isFiltersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          >
            Filters
          </Button>
          
          <Button
            leftIcon={<Plus size={16} />}
            bg="#D4AF37"
            color="white"
            _hover={{ bg: "#B8941F" }}
            size="sm"
            isDisabled={achievements.length >= maxAchievements}
          >
            Add Achievement
          </Button>
        </HStack>
      </HStack>

      {/* Analytics */}
      {enableAnalytics && achievements.length > 0 && (
        <AchievementAnalytics achievements={achievements} />
      )}

      {/* Filters Panel */}
      <Collapse in={isFiltersOpen} animateOpacity>
        <MotionCard
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          variant="outline"
          bg="gray.50"
        >
          <CardBody p={4}>
            <VStack spacing={4} align="stretch">
              {/* Search and Sort */}
              <HStack spacing={4}>
                <Box flex={1}>
                  <InputGroup>
                    <InputLeftElement>
                      <Search size={16} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search achievements..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      bg="white"
                    />
                  </InputGroup>
                </Box>

                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  w="200px"
                  bg="white"
                >
                  <option value="date">Sort by Date Added</option>
                  <option value="category">Sort by Category</option>
                  <option value="impact">Sort by Impact</option>
                  <option value="year">Sort by Year</option>
                </Select>
              </HStack>

              {/* Category Filter */}
              <CategoryFilter
                selectedCategories={selectedCategories}
                onCategoryChange={setSelectedCategories}
                achievements={achievements}
              />

              {/* Options */}
              <HStack justify="space-between" align="center">
                <FormControl display="flex" alignItems="center" w="auto">
                  <FormLabel htmlFor="show-hidden" mb="0" fontSize="sm">
                    Show hidden achievements
                  </FormLabel>
                  <Switch
                    id="show-hidden"
                    isChecked={showHidden}
                    onChange={(e) => setShowHidden(e.target.checked)}
                    colorScheme="blue"
                  />
                </FormControl>

                <HStack spacing={2}>
                  <Text fontSize="sm" color="gray.600">
                    Bulk actions:
                  </Text>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => handleBulkVisibilityToggle(true)}
                  >
                    Show All
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => handleBulkVisibilityToggle(false)}
                  >
                    Hide All
                  </Button>
                </HStack>
              </HStack>
            </VStack>
          </CardBody>
        </MotionCard>
      </Collapse>

      {/* Achievements List */}
      <DragDropAchievements
        achievements={filteredAchievements}
        onChange={onChange}
        maxAchievements={maxAchievements}
        allowCategorization={true}
        showVisibilityToggle={true}
      />

      {/* Empty State */}
      {filteredAchievements.length === 0 && achievements.length > 0 && (
        <Alert status="info" borderRadius="12px">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" fontWeight="600">
              No achievements match your filters
            </Text>
            <Text fontSize="xs" color="gray.600">
              Try adjusting your search or category filters
            </Text>
          </VStack>
        </Alert>
      )}
    </VStack>
  )
}
