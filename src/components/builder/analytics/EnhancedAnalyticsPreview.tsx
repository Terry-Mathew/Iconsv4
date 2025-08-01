'use client'

import { useState, useMemo } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Badge,
  Progress,
  Select,
  Button,
  IconButton,
  Tooltip,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Globe,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  ExternalLink,
  Download,
  Share2,
  RefreshCw,
} from 'lucide-react'

const MotionBox = motion.create(Box)
const MotionCard = motion.create(Card)

interface AnalyticsData {
  views: {
    total: number
    unique: number
    trend: number // percentage change
    daily: number[]
    weekly: number[]
    monthly: number[]
  }
  engagement: {
    averageTime: number // in seconds
    bounceRate: number // percentage
    interactions: number
    shares: number
    downloads: number
  }
  demographics: {
    countries: Array<{ name: string; count: number; percentage: number }>
    devices: Array<{ type: string; count: number; percentage: number }>
    referrers: Array<{ source: string; count: number; percentage: number }>
  }
  performance: {
    loadTime: number // in milliseconds
    uptime: number // percentage
    errors: number
  }
}

interface EnhancedAnalyticsPreviewProps {
  tier: 'rising' | 'elite' | 'legacy'
  isEnabled?: boolean
  timeRange?: '7d' | '30d' | '90d' | '1y'
  onTimeRangeChange?: (range: '7d' | '30d' | '90d' | '1y') => void
}

// Mock data generator
const generateMockData = (tier: 'rising' | 'elite' | 'legacy', timeRange: string): AnalyticsData => {
  const multiplier = tier === 'legacy' ? 3 : tier === 'elite' ? 2 : 1
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365

  return {
    views: {
      total: Math.floor((Math.random() * 5000 + 1000) * multiplier),
      unique: Math.floor((Math.random() * 3000 + 500) * multiplier),
      trend: Math.floor(Math.random() * 40 - 10), // -10% to +30%
      daily: Array.from({ length: Math.min(days, 30) }, () => Math.floor(Math.random() * 100 * multiplier)),
      weekly: Array.from({ length: Math.min(Math.ceil(days / 7), 12) }, () => Math.floor(Math.random() * 500 * multiplier)),
      monthly: Array.from({ length: Math.min(Math.ceil(days / 30), 12) }, () => Math.floor(Math.random() * 2000 * multiplier)),
    },
    engagement: {
      averageTime: Math.floor(Math.random() * 300 + 60), // 1-5 minutes
      bounceRate: Math.floor(Math.random() * 30 + 20), // 20-50%
      interactions: Math.floor((Math.random() * 200 + 50) * multiplier),
      shares: Math.floor((Math.random() * 50 + 10) * multiplier),
      downloads: Math.floor((Math.random() * 30 + 5) * multiplier),
    },
    demographics: {
      countries: [
        { name: 'United States', count: Math.floor(Math.random() * 500 * multiplier), percentage: 35 },
        { name: 'India', count: Math.floor(Math.random() * 400 * multiplier), percentage: 25 },
        { name: 'United Kingdom', count: Math.floor(Math.random() * 200 * multiplier), percentage: 15 },
        { name: 'Canada', count: Math.floor(Math.random() * 150 * multiplier), percentage: 12 },
        { name: 'Australia', count: Math.floor(Math.random() * 100 * multiplier), percentage: 8 },
        { name: 'Others', count: Math.floor(Math.random() * 80 * multiplier), percentage: 5 },
      ],
      devices: [
        { type: 'Desktop', count: Math.floor(Math.random() * 600 * multiplier), percentage: 45 },
        { type: 'Mobile', count: Math.floor(Math.random() * 500 * multiplier), percentage: 40 },
        { type: 'Tablet', count: Math.floor(Math.random() * 200 * multiplier), percentage: 15 },
      ],
      referrers: [
        { source: 'Direct', count: Math.floor(Math.random() * 400 * multiplier), percentage: 40 },
        { source: 'LinkedIn', count: Math.floor(Math.random() * 300 * multiplier), percentage: 30 },
        { source: 'Google', count: Math.floor(Math.random() * 200 * multiplier), percentage: 20 },
        { source: 'Twitter', count: Math.floor(Math.random() * 100 * multiplier), percentage: 10 },
      ],
    },
    performance: {
      loadTime: Math.floor(Math.random() * 1000 + 500), // 0.5-1.5 seconds
      uptime: Math.floor(Math.random() * 5 + 95), // 95-100%
      errors: Math.floor(Math.random() * 10),
    },
  }
}

// Metric Card Component
function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  color = 'blue',
}: {
  title: string
  value: string | number
  subtitle?: string
  trend?: number
  icon: any
  color?: string
}) {
  const trendColor = trend && trend > 0 ? 'green' : trend && trend < 0 ? 'red' : 'gray'
  const TrendIcon = trend && trend > 0 ? TrendingUp : trend && trend < 0 ? TrendingDown : Activity

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      variant="outline"
      _hover={{ borderColor: `${color}.300`, transform: 'translateY(-2px)' }}
      style={{ transition: 'all 0.2s' }}
    >
      <CardBody p={4}>
        <VStack spacing={3} align="stretch">
          <HStack justify="space-between" align="center">
            <Box
              w={10}
              h={10}
              bg={`${color}.100`}
              borderRadius="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon size={20} color={`var(--chakra-colors-${color}-500)`} />
            </Box>
            
            {trend !== undefined && (
              <HStack spacing={1}>
                <TrendIcon size={14} color={`var(--chakra-colors-${trendColor}-500)`} />
                <Text fontSize="xs" color={`${trendColor}.500`} fontWeight="600">
                  {trend > 0 ? '+' : ''}{trend}%
                </Text>
              </HStack>
            )}
          </HStack>

          <VStack spacing={1} align="start">
            <Text
              fontSize="2xl"
              fontWeight="700"
              color="#1A1A1A"
              fontFamily="'Lato', sans-serif"
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Text>
            
            <Text fontSize="sm" color="gray.600" fontWeight="500">
              {title}
            </Text>
            
            {subtitle && (
              <Text fontSize="xs" color="gray.500">
                {subtitle}
              </Text>
            )}
          </VStack>
        </VStack>
      </CardBody>
    </MotionCard>
  )
}

// Chart Component (simplified visualization)
function SimpleChart({
  data,
  type = 'bar',
  color = 'blue',
  height = '100px',
}: {
  data: number[]
  type?: 'bar' | 'line'
  color?: string
  height?: string
}) {
  const maxValue = Math.max(...data)
  
  return (
    <Box h={height} display="flex" alignItems="end" gap={1}>
      {data.map((value, index) => (
        <Box
          key={index}
          flex={1}
          bg={`${color}.400`}
          h={`${(value / maxValue) * 100}%`}
          borderRadius="2px"
          minH="2px"
          opacity={0.8}
          _hover={{ opacity: 1 }}
          transition="opacity 0.2s"
        />
      ))}
    </Box>
  )
}

// Demographics Chart Component
function DemographicsChart({
  data,
  title,
  color = 'blue',
}: {
  data: Array<{ name: string; count: number; percentage: number }>
  title: string
  color?: string
}) {
  return (
    <VStack spacing={3} align="stretch">
      <Text fontSize="md" fontWeight="600" color="#1A1A1A">
        {title}
      </Text>
      
      {data.map((item, index) => (
        <HStack key={index} justify="space-between" align="center">
          <VStack align="start" spacing={0} flex={1}>
            <Text fontSize="sm" fontWeight="500" color="gray.700">
              {item.name}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {item.count.toLocaleString()} visits
            </Text>
          </VStack>
          
          <VStack align="end" spacing={1}>
            <Text fontSize="sm" fontWeight="600" color={`${color}.600`}>
              {item.percentage}%
            </Text>
            <Box w="60px">
              <Progress
                value={item.percentage}
                size="sm"
                colorScheme={color}
                borderRadius="full"
              />
            </Box>
          </VStack>
        </HStack>
      ))}
    </VStack>
  )
}

// Main Enhanced Analytics Preview Component
export function EnhancedAnalyticsPreview({
  tier,
  isEnabled = true,
  timeRange = '30d',
  onTimeRangeChange,
}: EnhancedAnalyticsPreviewProps) {
  const [refreshing, setRefreshing] = useState(false)
  
  const data = useMemo(() => generateMockData(tier, timeRange), [tier, timeRange])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  if (!isEnabled) {
    return (
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        variant="outline"
        bg="gray.50"
      >
        <CardBody p={8} textAlign="center">
          <VStack spacing={4}>
            <Box
              w={16}
              h={16}
              bg="gray.200"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <BarChart3 size={32} color="gray.400" />
            </Box>
            
            <VStack spacing={2}>
              <Text fontSize="lg" fontWeight="600" color="gray.600">
                Analytics Disabled
              </Text>
              <Text fontSize="sm" color="gray.500" textAlign="center">
                Enable analytics to track your profile performance and visitor insights
              </Text>
            </VStack>
            
            <Button
              bg="#D4AF37"
              color="white"
              _hover={{ bg: "#B8941F" }}
              size="sm"
            >
              Enable Analytics
            </Button>
          </VStack>
        </CardBody>
      </MotionCard>
    )
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
            Analytics Dashboard
          </Text>
          <HStack spacing={2}>
            <Badge colorScheme="green" variant="subtle">
              {tier.toUpperCase()} TIER
            </Badge>
            <Text fontSize="sm" color="gray.600">
              Last updated: {new Date().toLocaleTimeString()}
            </Text>
          </HStack>
        </VStack>

        <HStack spacing={2}>
          <Select
            value={timeRange}
            onChange={(e) => onTimeRangeChange?.(e.target.value as any)}
            size="sm"
            w="120px"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </Select>
          
          <IconButton
            aria-label="Refresh data"
            icon={<RefreshCw size={16} />}
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            isLoading={refreshing}
          />
          
          <IconButton
            aria-label="Export data"
            icon={<Download size={16} />}
            size="sm"
            variant="outline"
          />
        </HStack>
      </HStack>

      {/* Key Metrics */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
        <GridItem>
          <MetricCard
            title="Total Views"
            value={data.views.total}
            subtitle={`${data.views.unique} unique visitors`}
            trend={data.views.trend}
            icon={Eye}
            color="blue"
          />
        </GridItem>
        
        <GridItem>
          <MetricCard
            title="Engagement Rate"
            value={`${100 - data.engagement.bounceRate}%`}
            subtitle={`${formatTime(data.engagement.averageTime)} avg. time`}
            trend={Math.floor(Math.random() * 20 - 5)}
            icon={Activity}
            color="green"
          />
        </GridItem>
        
        <GridItem>
          <MetricCard
            title="Interactions"
            value={data.engagement.interactions}
            subtitle={`${data.engagement.shares} shares`}
            trend={Math.floor(Math.random() * 30)}
            icon={Users}
            color="purple"
          />
        </GridItem>
        
        <GridItem>
          <MetricCard
            title="Performance"
            value={`${data.performance.uptime}%`}
            subtitle={`${(data.performance.loadTime / 1000).toFixed(1)}s load time`}
            trend={Math.floor(Math.random() * 10)}
            icon={TrendingUp}
            color="orange"
          />
        </GridItem>
      </Grid>

      {/* Charts Section */}
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
        {/* Views Chart */}
        <GridItem>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            variant="outline"
          >
            <CardHeader pb={2}>
              <HStack justify="space-between" align="center">
                <Text fontSize="md" fontWeight="600" color="#1A1A1A">
                  Views Over Time
                </Text>
                <Badge colorScheme="blue" variant="subtle">
                  {timeRange.toUpperCase()}
                </Badge>
              </HStack>
            </CardHeader>
            <CardBody pt={2}>
              <SimpleChart
                data={timeRange === '7d' ? data.views.daily : 
                      timeRange === '30d' ? data.views.daily : 
                      timeRange === '90d' ? data.views.weekly : 
                      data.views.monthly}
                type="bar"
                color="blue"
                height="150px"
              />
            </CardBody>
          </MotionCard>
        </GridItem>

        {/* Demographics */}
        <GridItem>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            variant="outline"
          >
            <CardHeader pb={2}>
              <Text fontSize="md" fontWeight="600" color="#1A1A1A">
                Top Countries
              </Text>
            </CardHeader>
            <CardBody pt={2}>
              <DemographicsChart
                data={data.demographics.countries.slice(0, 5)}
                title=""
                color="green"
              />
            </CardBody>
          </MotionCard>
        </GridItem>
      </Grid>

      {/* Additional Analytics */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
        {/* Device Types */}
        <GridItem>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            variant="outline"
          >
            <CardHeader pb={2}>
              <Text fontSize="md" fontWeight="600" color="#1A1A1A">
                Device Types
              </Text>
            </CardHeader>
            <CardBody pt={2}>
              <DemographicsChart
                data={data.demographics.devices.map(device => ({
                  name: device.type,
                  count: device.count,
                  percentage: device.percentage
                }))}
                title=""
                color="purple"
              />
            </CardBody>
          </MotionCard>
        </GridItem>

        {/* Traffic Sources */}
        <GridItem>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            variant="outline"
          >
            <CardHeader pb={2}>
              <Text fontSize="md" fontWeight="600" color="#1A1A1A">
                Traffic Sources
              </Text>
            </CardHeader>
            <CardBody pt={2}>
              <DemographicsChart
                data={data.demographics.referrers.map(referrer => ({
                  name: referrer.source,
                  count: referrer.count,
                  percentage: referrer.percentage
                }))}
                title=""
                color="orange"
              />
            </CardBody>
          </MotionCard>
        </GridItem>
      </Grid>

      {/* Insights */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        variant="outline"
        bg="blue.50"
        borderColor="blue.200"
      >
        <CardBody p={4}>
          <VStack spacing={3} align="stretch">
            <HStack spacing={2}>
              <BarChart3 size={20} color="var(--chakra-colors-blue-500)" />
              <Text fontSize="md" fontWeight="600" color="blue.700">
                AI-Powered Insights
              </Text>
            </HStack>
            
            <VStack spacing={2} align="start">
              <Text fontSize="sm" color="blue.600">
                • Your profile views increased by {Math.abs(data.views.trend)}% this {timeRange}
              </Text>
              <Text fontSize="sm" color="blue.600">
                • Most visitors spend {formatTime(data.engagement.averageTime)} on your profile
              </Text>
              <Text fontSize="sm" color="blue.600">
                • {data.demographics.countries[0].name} is your top visitor location ({data.demographics.countries[0].percentage}%)
              </Text>
              <Text fontSize="sm" color="blue.600">
                • {data.demographics.devices[0].type} users make up {data.demographics.devices[0].percentage}% of your traffic
              </Text>
            </VStack>
          </VStack>
        </CardBody>
      </MotionCard>
    </VStack>
  )
}
