import { Metadata } from 'next'
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Avatar,
  Badge,
  Button,
} from '@chakra-ui/react'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { ProfileData } from '@/types/profile'

export const metadata: Metadata = {
  title: 'Browse Profiles - Icons Herald',
  description: 'Discover exceptional individuals featured in our premium digital archive. Browse profiles across Rising, Elite, and Legacy tiers.',
  openGraph: {
    title: 'Browse Profiles - Icons Herald',
    description: 'Discover exceptional individuals featured in our premium digital archive.',
    type: 'website',
  },
}

export default async function ProfilesPage() {
  const supabase = await createServerClient()
  
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(50)

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'rising': return 'green'
      case 'elite': return 'blue'
      case 'legacy': return 'purple'
      default: return 'gray'
    }
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="7xl" py={12}>
        <VStack spacing={12}>
          {/* Header */}
          <Box textAlign="center">
            <Heading as="h1" size="2xl" mb={4} color="gray.800">
              Featured Profiles
            </Heading>
            <Text fontSize="xl" color="gray.600" maxW="3xl">
              Discover exceptional individuals who have made their mark across various fields. 
              Each profile represents a unique story of achievement and impact.
            </Text>
          </Box>

          {/* Profiles Grid */}
          {profiles && profiles.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
              {profiles.map((profile) => {
                const profileData = profile.data as ProfileData
                return (
                  <Card
                    key={profile.id}
                    shadow="lg"
                    _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
                    transition="all 0.2s"
                    overflow="hidden"
                  >
                    <CardBody p={6}>
                      <VStack spacing={4} align="start">
                        <HStack spacing={4} w="full">
                          <Avatar
                            size="lg"
                            src={profileData.profileImage}
                            name={profileData.name}
                          />
                          <VStack align="start" spacing={1} flex={1}>
                            <Heading as="h3" size="md" color="gray.800" noOfLines={1}>
                              {profileData.name}
                            </Heading>
                            <Text fontSize="sm" color="gray.600" noOfLines={2}>
                              {profileData.tagline}
                            </Text>
                            <Badge colorScheme={getTierColor(profile.tier)} size="sm">
                              {profile.tier.charAt(0).toUpperCase() + profile.tier.slice(1)}
                            </Badge>
                          </VStack>
                        </HStack>

                        <Text color="gray.700" fontSize="sm" noOfLines={3} lineHeight="tall">
                          {profileData.bio}
                        </Text>

                        <Link href={`/profile/${profile.slug}`} style={{ width: '100%' }}>
                          <Button w="full" variant="outline" colorScheme="primary">
                            View Profile
                          </Button>
                        </Link>
                      </VStack>
                    </CardBody>
                  </Card>
                )
              })}
            </SimpleGrid>
          ) : (
            <Card w="full" shadow="lg">
              <CardBody p={12} textAlign="center">
                <VStack spacing={4}>
                  <Box fontSize="4xl">📋</Box>
                  <Heading as="h2" size="lg" color="gray.600">
                    No Profiles Yet
                  </Heading>
                  <Text color="gray.500" maxW="md">
                    We're currently building our archive of exceptional individuals. 
                    Check back soon to discover amazing profiles!
                  </Text>
                  <Link href="/nominate">
                    <Button colorScheme="primary" mt={4}>
                      Submit a Nomination
                    </Button>
                  </Link>
                </VStack>
              </CardBody>
            </Card>
          )}
        </VStack>
      </Container>
    </Box>
  )
}

// Enable ISR
export const revalidate = 1800 // Revalidate every 30 minutes
