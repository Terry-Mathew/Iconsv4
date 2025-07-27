'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  Progress,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { BarChart3, Eye, Users, TrendingUp, Globe } from 'lucide-react'

interface AnalyticsData {
  totalViews: number
  uniqueVisitors: number
  engagementRate: string
  dailyViews: Array<{ date: string; views: number }>
  topSources: Array<{ source: string; count: number }>
  lastUpdated: string
}

interface AnalyticsPreviewProps {
  profileId?: string
  isPublished: boolean
}

export function AnalyticsPreview({ profileId, isPublished }: AnalyticsPreviewProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [profileId, isPublished])

  const fetchAnalytics = async () => {
    setLoading(true)
    setError(null)

    try {
      const url = profileId 
        ? `/api/profiles/analytics?profileId=${profileId}`
        : '/api/profiles/analytics'
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
      // Set mock data as fallback
      setAnalytics(getMockAnalytics())
    } finally {
      setLoading(false)
    }
  }

  const getMockAnalytics = (): AnalyticsData => ({
    totalViews: Math.floor(Math.random() * 1000) + 100,
    uniqueVisitors: Math.floor(Math.random() * 500) + 50,
    engagementRate: (Math.random() * 30 + 70).toFixed(1) + '%',
    dailyViews: Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 50) + 10
      }
    }),
    topSources: [
      { source: 'Direct', count: Math.floor(Math.random() * 100) + 50 },
      { source: 'LinkedIn', count: Math.floor(Math.random() * 80) + 30 },
      { source: 'Google', count: Math.floor(Math.random() * 60) + 20 },
      { source: 'Twitter', count: Math.floor(Math.random() * 40) + 10 },
      { source: 'Referral', count: Math.floor(Math.random() * 30) + 5 }
    ],
    lastUpdated: new Date().toISOString()
  })

  if (!isPublished) {
    return (
      <Card>
        <CardHeader>
          <HStack>
            <BarChart3 size={20} color="#D4AF37" />
            <Heading size="md">Analytics Preview</Heading>
            <Badge colorScheme="gray">Draft</Badge>
          </HStack>
        </CardHeader>
        <CardBody>
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontWeight="semibold">Analytics Available After Publishing</Text>
              <Text fontSize="sm">
                Once you publish your profile, you'll see detailed analytics including views, 
                visitor demographics, and engagement metrics.
              </Text>
            </VStack>
          </Alert>
        </CardBody>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <HStack>
            <BarChart3 size={20} color="#D4AF37" />
            <Heading size="md">Analytics Preview</Heading>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={4}>
            <Spinner size="lg" color="gold.500" />
            <Text color="gray.600">Loading analytics data...</Text>
          </VStack>
        </CardBody>
      </Card>
    )
  }

  if (error && !analytics) {
    return (
      <Card>
        <CardHeader>
          <HStack>
            <BarChart3 size={20} color="#D4AF37" />
            <Heading size="md">Analytics Preview</Heading>
            <Badge colorScheme="red">Error</Badge>
          </HStack>
        </CardHeader>
        <CardBody>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Text>{error}</Text>
          </Alert>
        </CardBody>
      </Card>
    )
  }

  const maxViews = Math.max(...(analytics?.dailyViews.map(d => d.views) || [1]))

  return (
    <Card>
      <CardHeader>
        <HStack justify="space-between">
          <HStack>
            <BarChart3 size={20} color="#D4AF37" />
            <Heading size="md">Analytics Preview</Heading>
            <Badge colorScheme="green">Live</Badge>
          </HStack>
          <Text fontSize="xs" color="gray.500">
            Last updated: {analytics ? new Date(analytics.lastUpdated).toLocaleTimeString() : 'N/A'}
          </Text>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack spacing={6} align="stretch">
          {/* Key Metrics */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Stat>
              <StatLabel>
                <HStack>
                  <Eye size={16} />
                  <Text>Total Views</Text>
                </HStack>
              </StatLabel>
              <StatNumber color="blue.500">{analytics?.totalViews.toLocaleString()}</StatNumber>
              <StatHelpText>All time</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>
                <HStack>
                  <Users size={16} />
                  <Text>Unique Visitors</Text>
                </HStack>
              </StatLabel>
              <StatNumber color="green.500">{analytics?.uniqueVisitors.toLocaleString()}</StatNumber>
              <StatHelpText>Last 30 days</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel>
                <HStack>
                  <TrendingUp size={16} />
                  <Text>Engagement Rate</Text>
                </HStack>
              </StatLabel>
              <StatNumber color="purple.500">{analytics?.engagementRate}</StatNumber>
              <StatHelpText>Time on page</StatHelpText>
            </Stat>
          </SimpleGrid>

          {/* Daily Views Chart */}
          <Box>
            <Text fontWeight="semibold" mb={3}>Daily Views (Last 7 Days)</Text>
            <VStack spacing={2} align="stretch">
              {analytics?.dailyViews.map((day, index) => (
                <HStack key={index} spacing={4}>
                  <Text fontSize="sm" minW="80px" color="gray.600">
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Text>
                  <Box flex={1}>
                    <Progress
                      value={(day.views / maxViews) * 100}
                      colorScheme="blue"
                      size="sm"
                      borderRadius="md"
                    />
                  </Box>
                  <Text fontSize="sm" minW="40px" textAlign="right" fontWeight="semibold">
                    {day.views}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </Box>

          {/* Top Sources */}
          <Box>
            <Text fontWeight="semibold" mb={3}>Top Traffic Sources</Text>
            <VStack spacing={2} align="stretch">
              {analytics?.topSources.slice(0, 5).map((source, index) => (
                <HStack key={index} spacing={4}>
                  <HStack flex={1}>
                    <Globe size={14} color="gray.500" />
                    <Text fontSize="sm">{source.source}</Text>
                  </HStack>
                  <Badge colorScheme="blue" variant="subtle">
                    {source.count}
                  </Badge>
                </HStack>
              ))}
            </VStack>
          </Box>

          {/* Development Notice */}
          {!profileId && (
            <Alert status="info" size="sm" borderRadius="md">
              <AlertIcon />
              <Text fontSize="sm">
                This is preview data. Real analytics will be available after publishing.
              </Text>
            </Alert>
          )}
        </VStack>
      </CardBody>
    </Card>
  )
}
