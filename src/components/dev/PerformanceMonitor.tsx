'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Collapse,
  IconButton,
  useDisclosure,
  Tooltip,
  Progress
} from '@chakra-ui/react'
import { Activity, ChevronDown, ChevronUp } from 'lucide-react'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  bundleSize: number
  memoryUsage: number
  fps: number
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { isOpen, onToggle } = useDisclosure()

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return

    setIsVisible(true)

    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const paint = performance.getEntriesByType('paint')
      
      // Basic metrics
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart
      const renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
      
      // Memory usage (if available)
      const memoryInfo = (performance as any).memory
      const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / 1024 / 1024 : 0

      // Web Vitals approximation
      const lcp = paint.find(entry => entry.name === 'largest-contentful-paint')?.startTime || 0
      
      setMetrics({
        loadTime: Math.round(loadTime),
        renderTime: Math.round(renderTime),
        bundleSize: 0, // Would need webpack stats
        memoryUsage: Math.round(memoryUsage),
        fps: 60, // Simplified
        lcp: Math.round(lcp),
        fid: 0, // Would need real measurement
        cls: 0  // Would need real measurement
      })
    }

    // Measure after page load
    if (document.readyState === 'complete') {
      measurePerformance()
    } else {
      window.addEventListener('load', measurePerformance)
    }

    return () => {
      window.removeEventListener('load', measurePerformance)
    }
  }, [])

  if (!isVisible || !metrics) return null

  const getPerformanceColor = (value: number, thresholds: { good: number; poor: number }) => {
    if (value <= thresholds.good) return 'green'
    if (value <= thresholds.poor) return 'yellow'
    return 'red'
  }

  const performanceScore = () => {
    let score = 100
    
    // Deduct points for poor metrics
    if (metrics.loadTime > 3000) score -= 20
    if (metrics.renderTime > 1000) score -= 15
    if (metrics.lcp > 2500) score -= 25
    if (metrics.memoryUsage > 50) score -= 10
    
    return Math.max(0, score)
  }

  return (
    <Box
      position="fixed"
      bottom={4}
      right={4}
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      shadow="lg"
      zIndex={1000}
      maxW="300px"
    >
      <HStack
        p={3}
        cursor="pointer"
        onClick={onToggle}
        _hover={{ bg: 'gray.50' }}
        borderRadius="lg"
      >
        <Activity size={16} color="#D4AF37" />
        <Text fontSize="sm" fontWeight="600" flex={1}>
          Performance Monitor
        </Text>
        <Badge
          colorScheme={performanceScore() >= 80 ? 'green' : performanceScore() >= 60 ? 'yellow' : 'red'}
          variant="solid"
        >
          {performanceScore()}
        </Badge>
        <IconButton
          aria-label="Toggle performance details"
          icon={isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          size="xs"
          variant="ghost"
        />
      </HStack>

      <Collapse in={isOpen}>
        <VStack spacing={3} p={3} pt={0} align="stretch">
          <Text fontSize="xs" color="gray.600" fontWeight="600">
            Core Web Vitals
          </Text>
          
          {/* Load Time */}
          <HStack justify="space-between">
            <Tooltip label="Time to fully load the page">
              <Text fontSize="xs">Load Time</Text>
            </Tooltip>
            <HStack spacing={2}>
              <Text fontSize="xs" fontWeight="600">
                {metrics.loadTime}ms
              </Text>
              <Badge
                size="sm"
                colorScheme={getPerformanceColor(metrics.loadTime, { good: 1000, poor: 3000 })}
              >
                {metrics.loadTime <= 1000 ? 'Good' : metrics.loadTime <= 3000 ? 'OK' : 'Poor'}
              </Badge>
            </HStack>
          </HStack>

          {/* Render Time */}
          <HStack justify="space-between">
            <Tooltip label="Time to render DOM content">
              <Text fontSize="xs">Render Time</Text>
            </Tooltip>
            <HStack spacing={2}>
              <Text fontSize="xs" fontWeight="600">
                {metrics.renderTime}ms
              </Text>
              <Badge
                size="sm"
                colorScheme={getPerformanceColor(metrics.renderTime, { good: 500, poor: 1000 })}
              >
                {metrics.renderTime <= 500 ? 'Good' : metrics.renderTime <= 1000 ? 'OK' : 'Poor'}
              </Badge>
            </HStack>
          </HStack>

          {/* LCP */}
          <HStack justify="space-between">
            <Tooltip label="Largest Contentful Paint - when main content loads">
              <Text fontSize="xs">LCP</Text>
            </Tooltip>
            <HStack spacing={2}>
              <Text fontSize="xs" fontWeight="600">
                {metrics.lcp}ms
              </Text>
              <Badge
                size="sm"
                colorScheme={getPerformanceColor(metrics.lcp, { good: 2500, poor: 4000 })}
              >
                {metrics.lcp <= 2500 ? 'Good' : metrics.lcp <= 4000 ? 'OK' : 'Poor'}
              </Badge>
            </HStack>
          </HStack>

          {/* Memory Usage */}
          <HStack justify="space-between">
            <Tooltip label="JavaScript heap memory usage">
              <Text fontSize="xs">Memory</Text>
            </Tooltip>
            <HStack spacing={2}>
              <Text fontSize="xs" fontWeight="600">
                {metrics.memoryUsage}MB
              </Text>
              <Badge
                size="sm"
                colorScheme={getPerformanceColor(metrics.memoryUsage, { good: 20, poor: 50 })}
              >
                {metrics.memoryUsage <= 20 ? 'Good' : metrics.memoryUsage <= 50 ? 'OK' : 'High'}
              </Badge>
            </HStack>
          </HStack>

          {/* Performance Score */}
          <Box>
            <HStack justify="space-between" mb={1}>
              <Text fontSize="xs" fontWeight="600">Overall Score</Text>
              <Text fontSize="xs" fontWeight="600">{performanceScore()}/100</Text>
            </HStack>
            <Progress
              value={performanceScore()}
              colorScheme={performanceScore() >= 80 ? 'green' : performanceScore() >= 60 ? 'yellow' : 'red'}
              size="sm"
              borderRadius="md"
            />
          </Box>

          <Text fontSize="xs" color="gray.500" textAlign="center">
            Development mode only
          </Text>
        </VStack>
      </Collapse>
    </Box>
  )
}

// Hook for measuring component render performance
export function useRenderPerformance(componentName: string) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      if (renderTime > 16) { // More than one frame at 60fps
        console.warn(`🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`)
      }
    }
  })
}
