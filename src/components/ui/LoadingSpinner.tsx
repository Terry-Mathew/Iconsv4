'use client'

import { Suspense } from 'react'
import { Box, Spinner, Text, VStack, HStack, Center } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion.create(Box)

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  message?: string
  fullScreen?: boolean
  color?: string
}

export function LoadingSpinner({ 
  size = 'lg', 
  message = 'Loading...', 
  fullScreen = false,
  color = '#D4AF37'
}: LoadingSpinnerProps) {
  const content = (
    <VStack spacing={4}>
      <MotionBox
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Spinner
          size={size}
          color={color}
          thickness="3px"
          speed="0.8s"
        />
      </MotionBox>
      {message && (
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Text
            fontSize="sm"
            color="gray.600"
            fontFamily="'Lato', sans-serif"
            textAlign="center"
          >
            {message}
          </Text>
        </MotionBox>
      )}
    </VStack>
  )

  if (fullScreen) {
    return (
      <Center
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="rgba(255, 255, 255, 0.9)"
        backdropFilter="blur(4px)"
        zIndex={9999}
      >
        {content}
      </Center>
    )
  }

  return (
    <Center py={8}>
      {content}
    </Center>
  )
}

// Skeleton components for better loading UX
export function CardSkeleton() {
  return (
    <MotionBox
      bg="gray.100"
      borderRadius="lg"
      p={6}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <VStack align="start" spacing={3}>
        <Box h="20px" bg="gray.300" borderRadius="md" w="60%" />
        <Box h="16px" bg="gray.300" borderRadius="md" w="80%" />
        <Box h="16px" bg="gray.300" borderRadius="md" w="40%" />
      </VStack>
    </MotionBox>
  )
}

export function ProfileSkeleton() {
  return (
    <MotionBox
      bg="white"
      borderRadius="xl"
      p={8}
      shadow="lg"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <VStack spacing={6}>
        {/* Avatar skeleton */}
        <Box
          w="120px"
          h="120px"
          bg="gray.300"
          borderRadius="full"
        />
        
        {/* Name skeleton */}
        <Box h="24px" bg="gray.300" borderRadius="md" w="200px" />
        
        {/* Title skeleton */}
        <Box h="18px" bg="gray.300" borderRadius="md" w="150px" />
        
        {/* Bio skeleton */}
        <VStack spacing={2} w="full">
          <Box h="16px" bg="gray.300" borderRadius="md" w="100%" />
          <Box h="16px" bg="gray.300" borderRadius="md" w="90%" />
          <Box h="16px" bg="gray.300" borderRadius="md" w="70%" />
        </VStack>
        
        {/* Buttons skeleton */}
        <HStack spacing={4}>
          <Box h="40px" bg="gray.300" borderRadius="md" w="120px" />
          <Box h="40px" bg="gray.300" borderRadius="md" w="100px" />
        </HStack>
      </VStack>
    </MotionBox>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <VStack spacing={3} w="full">
      {/* Header skeleton */}
      <Box
        w="full"
        h="50px"
        bg="gray.200"
        borderRadius="md"
      />
      
      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, index) => (
        <MotionBox
          key={index}
          w="full"
          h="60px"
          bg="gray.100"
          borderRadius="md"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.1
          }}
        />
      ))}
    </VStack>
  )
}

// Performance-optimized loading states
export function LazyComponentWrapper({ 
  children, 
  fallback,
  minHeight = '200px' 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode
  minHeight?: string
}) {
  return (
    <Box minH={minHeight}>
      <Suspense fallback={fallback || <LoadingSpinner />}>
        {children}
      </Suspense>
    </Box>
  )
}
