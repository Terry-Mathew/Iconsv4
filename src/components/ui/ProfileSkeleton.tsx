'use client'

import {
  Box,
  Card,
  CardBody,
  VStack,
  HStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  SimpleGrid
} from '@chakra-ui/react'

export function ProfileCardSkeleton() {
  return (
    <Card
      h="360px"
      bg="white"
      borderRadius="20px"
      overflow="hidden"
      border="2px solid transparent"
      shadow="md"
    >
      <CardBody p={6}>
        <VStack spacing={4} align="start" h="full">
          <HStack spacing={4} w="full">
            <SkeletonCircle size="16" />
            <VStack align="start" spacing={2} flex={1}>
              <Skeleton height="20px" width="60%" />
              <Skeleton height="16px" width="80%" />
              <Skeleton height="20px" width="40%" borderRadius="full" />
            </VStack>
          </HStack>

          <SkeletonText mt="4" noOfLines={3} spacing="4" skeletonHeight="2" />

          <Skeleton height="40px" width="full" borderRadius="md" mt="auto" />
        </VStack>
      </CardBody>
    </Card>
  )
}

export function ProfileGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={8} w="full">
      {Array.from({ length: count }).map((_, index) => (
        <ProfileCardSkeleton key={index} />
      ))}
    </SimpleGrid>
  )
}

export function FeaturedProfileSkeleton() {
  return (
    <Card
      h="380px"
      bg="white"
      borderRadius="20px"
      overflow="hidden"
      border="2px solid transparent"
      shadow="lg"
    >
      <CardBody p={8}>
        <VStack spacing={6} align="start" h="full">
          <HStack spacing={6} w="full">
            <SkeletonCircle size="20" />
            <VStack align="start" spacing={3} flex={1}>
              <Skeleton height="24px" width="70%" />
              <Skeleton height="18px" width="90%" />
              <Skeleton height="22px" width="50%" borderRadius="full" />
            </VStack>
          </HStack>

          <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="3" />

          <Skeleton height="48px" width="full" borderRadius="lg" mt="auto" />
        </VStack>
      </CardBody>
    </Card>
  )
}

export function FeaturedGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
      {Array.from({ length: count }).map((_, index) => (
        <FeaturedProfileSkeleton key={index} />
      ))}
    </SimpleGrid>
  )
}
