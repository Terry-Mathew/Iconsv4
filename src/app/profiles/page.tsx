'use client'

import { useState, useEffect } from 'react'
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
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Spinner,
  Center,
  Flex,
  Divider,
  useToast,
  Icon
} from '@chakra-ui/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Filter, Eye, ArrowRight, Crown, Star, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ProfileGridSkeleton, FeaturedGridSkeleton } from '@/components/ui/ProfileSkeleton'
import { PageLayout } from '@/components/layout/PageLayout'
import { FloatingCard } from '@/components/ui/FloatingCard'

const MotionCard = motion.create(Card)
const MotionBox = motion.create(Box)

interface Profile {
  id: string
  slug: string
  tier: string
  status: string
  content: any // Using any for JSONB content
  is_published: boolean | null
  is_demo?: boolean | null
  view_count: number | null
  published_at: string | null
  created_at: string | null
}

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [demoProfiles, setDemoProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTier, setSelectedTier] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const supabase = createClient()
  const toast = useToast()

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'rising': return 'green'
      case 'elite': return 'blue'
      case 'legacy': return 'purple'
      default: return 'gray'
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'rising': return Star
      case 'elite': return Crown
      case 'legacy': return Users
      default: return Star
    }
  }

  // Load demo profiles
  const loadDemoProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_demo', true)
        .eq('is_published', true)
        .order('tier', { ascending: false }) // Legacy first, then Elite, then Rising

      if (error) throw error
      setDemoProfiles(data || [])
    } catch (err: any) {
      console.error('Error loading demo profiles:', err)
    }
  }

  // Load regular profiles with filters
  const loadProfiles = async (reset = false) => {
    try {
      setLoading(true)

      let query = supabase
        .from('profiles')
        .select('*')
        .eq('is_published', true)
        .eq('is_demo', false)

      // Apply filters
      if (selectedTier !== 'all') {
        query = query.eq('tier', selectedTier)
      }

      if (searchTerm) {
        query = query.ilike('content->>name', `%${searchTerm}%`)
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('published_at', { ascending: false })
          break
        case 'oldest':
          query = query.order('published_at', { ascending: true })
          break
        case 'name':
          query = query.order('content->>name', { ascending: true })
          break
        case 'views':
          query = query.order('view_count', { ascending: false })
          break
        default:
          query = query.order('published_at', { ascending: false })
      }

      const currentPage = reset ? 1 : page
      const limit = 12
      const offset = (currentPage - 1) * limit

      query = query.range(offset, offset + limit - 1)

      const { data, error } = await query

      if (error) throw error

      if (reset) {
        setProfiles(data || [])
        setPage(1)
      } else {
        setProfiles(prev => [...prev, ...(data || [])])
      }

      setHasMore((data || []).length === limit)

    } catch (err: any) {
      toast({
        title: 'Error loading profiles',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  // Load data on mount
  useEffect(() => {
    loadDemoProfiles()
    loadProfiles(true)
  }, [])

  // Reload profiles when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadProfiles(true)
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedTier, sortBy])

  const loadMore = () => {
    if (!loading && !isLoadingMore && hasMore) {
      setIsLoadingMore(true)
      setPage(prev => prev + 1)
      loadProfiles(false).finally(() => setIsLoadingMore(false))
    }
  }

  return (
    <PageLayout>
      {/* Header Section */}
      <FloatingCard variant="default" hoverEffect={false} mt={8} mx={8}>
        <Container maxW="6xl" py={16}>
          <VStack spacing={6} textAlign="center">
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <HStack spacing={3} justify="center" mb={4}>
                <Crown size={40} color="#D4AF37" />
                <Heading
                  as="h1"
                  fontSize={{ base: "3xl", md: "5xl" }}
                  fontFamily="'Playfair Display', serif"
                  color="#1A1A1A"
                  fontWeight="400"
                >
                  Browse Icons
                </Heading>
              </HStack>

              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color="#666"
                fontFamily="'Lato', sans-serif"
                maxW="3xl"
                lineHeight="1.7"
              >
                Discover extraordinary individuals featured in our exclusive digital archive.
                Each profile represents a legacy of excellence and achievement.
              </Text>
            </MotionBox>
          </VStack>
        </Container>
      </FloatingCard>

      {/* Featured Examples Section */}
      {loading ? (
        <FloatingCard variant="default" hoverEffect={false} mt={8} mx={8}>
          <Container maxW="6xl" py={16}>
            <VStack spacing={8}>
              <VStack spacing={4} textAlign="center">
                <Heading
                  as="h2"
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontFamily="'Playfair Display', serif"
                  color="#1A1A1A"
                  fontWeight="400"
                >
                  Legendary Icons
                </Heading>
                <Text
                  fontSize="lg"
                  color="#666"
                  fontFamily="'Lato', sans-serif"
                  maxW="2xl"
                  lineHeight="1.7"
                >
                  Discover exceptional individuals who have shaped our world through their extraordinary achievements
                </Text>
              </VStack>
              <FeaturedGridSkeleton count={3} />
            </VStack>
          </Container>
        </FloatingCard>
      ) : demoProfiles.length > 0 && (
        <FloatingCard variant="default" hoverEffect={false} mt={8} mx={8}>
          <Container maxW="6xl" py={16}>
            <VStack spacing={8}>
              <VStack spacing={4} textAlign="center">
                <Heading
                  as="h2"
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontFamily="'Playfair Display', serif"
                  color="#1A1A1A"
                  fontWeight="400"
                >
                  Legendary Icons
                </Heading>
                <Text
                  fontSize="lg"
                  color="#666"
                  fontFamily="'Lato', sans-serif"
                  maxW="2xl"
                  lineHeight="1.7"
                >
                  Discover exceptional individuals who have shaped our world through their extraordinary achievements
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} w="full">
                {demoProfiles.map((profile, index) => (
                  <MotionCard
                    key={profile.id}
                    bg="rgba(255, 255, 255, 0.95)"
                    borderRadius="xl"
                    overflow="hidden"
                    border="2px solid #D4AF37"
                    shadow="lg"
                    backdropFilter="blur(10px)"
                    _hover={{
                      transform: "translateY(-4px)",
                      shadow: "xl",
                      borderColor: "#B8941F",
                      bg: "rgba(255, 255, 255, 1)"
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <CardBody p={6}>
                      <VStack spacing={4} align="center">
                        <Avatar
                          size="xl"
                          src={profile.content.profileImage}
                          name={profile.content.name}
                          border="3px solid #D4AF37"
                        />

                        <VStack spacing={2} textAlign="center">
                          <Heading
                            as="h3"
                            size="md"
                            fontFamily="'Playfair Display', serif"
                            color="#1A1A1A"
                          >
                            {profile.content.name}
                          </Heading>

                          <Text
                            fontSize="sm"
                            color="#666"
                            fontFamily="'Lato', sans-serif"
                            noOfLines={2}
                            lineHeight="1.6"
                          >
                            {profile.content.tagline}
                          </Text>
                        </VStack>

                        <HStack spacing={3}>
                          <Badge
                            colorScheme={getTierColor(profile.tier)}
                            variant="subtle"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontWeight="600"
                            textTransform="capitalize"
                          >
                            <HStack spacing={1}>
                              <Icon as={getTierIcon(profile.tier)} boxSize={3} />
                              <Text>{profile.tier}</Text>
                            </HStack>
                          </Badge>

                          <Badge
                            bg="#D4AF37"
                            color="white"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontWeight="600"
                          >
                            Featured
                          </Badge>
                        </HStack>

                        <HStack spacing={2} fontSize="sm" color="#666">
                          <Eye size={16} />
                          <Text>{profile.view_count?.toLocaleString() || 0} views</Text>
                        </HStack>

                        <Link href={`/profile/${profile.slug}`} style={{ width: '100%' }}>
                          <Button
                            w="full"
                            bg="#D4AF37"
                            color="white"
                            _hover={{ bg: "#B8941F" }}
                            rightIcon={<ArrowRight size={16} />}
                          >
                            View Profile
                          </Button>
                        </Link>
                      </VStack>
                    </CardBody>
                  </MotionCard>
                ))}
              </SimpleGrid>
            </VStack>
          </Container>
        </FloatingCard>
      )}

      {/* Search and Filter Section */}
      <FloatingCard variant="glass" hoverEffect={false} mt={8} mx={8}>
        <Container maxW="6xl" py={8}>
          <VStack spacing={6}>
            <Heading
              as="h2"
              fontSize={{ base: "xl", md: "2xl" }}
              fontFamily="'Playfair Display', serif"
              color="#1A1A1A"
              fontWeight="400"
              textAlign="center"
            >
              All Profiles
            </Heading>

            <Flex
              direction={{ base: "column", md: "row" }}
              gap={4}
              w="full"
              maxW="4xl"
              align="center"
            >
              <InputGroup flex="2">
                <InputLeftElement pointerEvents="none">
                  <Search size={20} color="#D4AF37" />
                </InputLeftElement>
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  borderColor="#D4AF37"
                  _focus={{ borderColor: "#B8941F", boxShadow: "0 0 0 1px #B8941F" }}
                  bg="rgba(255, 255, 255, 0.9)"
                  backdropFilter="blur(10px)"
                />
              </InputGroup>

              <Select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                borderColor="#D4AF37"
                _focus={{ borderColor: "#B8941F", boxShadow: "0 0 0 1px #B8941F" }}
                bg="rgba(255, 255, 255, 0.9)"
                backdropFilter="blur(10px)"
                maxW={{ base: "full", md: "200px" }}
              >
                <option value="all">All Tiers</option>
                <option value="legacy">Legacy</option>
                <option value="elite">Elite</option>
                <option value="rising">Rising</option>
              </Select>

              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                borderColor="#D4AF37"
                _focus={{ borderColor: "#B8941F", boxShadow: "0 0 0 1px #B8941F" }}
                bg="rgba(255, 255, 255, 0.9)"
                backdropFilter="blur(10px)"
                maxW={{ base: "full", md: "200px" }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Alphabetical</option>
                <option value="views">Most Viewed</option>
              </Select>
            </Flex>
          </VStack>
        </Container>
      </FloatingCard>

      {/* Main Profiles Grid */}
      <FloatingCard variant="default" hoverEffect={false} mt={8} mx={8} mb={8}>
        <Container maxW="6xl" py={12}>
          {loading && profiles.length === 0 ? (
            <ProfileGridSkeleton count={12} />
          ) : profiles.length === 0 ? (
            <Center py={20}>
              <VStack spacing={4}>
                <Text fontSize="xl" color="#666" fontFamily="'Lato', sans-serif">
                  No profiles found
                </Text>
                <Text color="#666" fontFamily="'Lato', sans-serif">
                  Try adjusting your search or filter criteria
                </Text>
              </VStack>
            </Center>
          ) : (
            <VStack spacing={8}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6} w="full">
                {profiles.map((profile, index) => (
                  <MotionCard
                    key={profile.id}
                    bg="rgba(255, 255, 255, 0.95)"
                    borderRadius="xl"
                    overflow="hidden"
                    border="1px solid"
                    borderColor="rgba(212, 175, 55, 0.3)"
                    shadow="md"
                    backdropFilter="blur(10px)"
                    _hover={{
                      transform: "translateY(-2px)",
                      shadow: "lg",
                      borderColor: "#D4AF37",
                      bg: "rgba(255, 255, 255, 1)"
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <CardBody p={5}>
                      <VStack spacing={3} align="center">
                        <Avatar
                          size="lg"
                          src={profile.content.profileImage}
                          name={profile.content.name}
                          border="2px solid #D4AF37"
                        />

                        <VStack spacing={1} textAlign="center">
                          <Heading
                            as="h3"
                            size="sm"
                            fontFamily="'Playfair Display', serif"
                            color="#1A1A1A"
                            noOfLines={1}
                          >
                            {profile.content.name}
                          </Heading>

                          <Text
                            fontSize="xs"
                            color="#666"
                            fontFamily="'Lato', sans-serif"
                            noOfLines={2}
                            minH="32px"
                            lineHeight="1.6"
                          >
                            {profile.content.tagline}
                          </Text>
                        </VStack>

                        <Badge
                          colorScheme={getTierColor(profile.tier)}
                          variant="subtle"
                          px={2}
                          py={1}
                          borderRadius="full"
                          fontSize="xs"
                          fontWeight="600"
                          textTransform="capitalize"
                        >
                          <HStack spacing={1}>
                            <Icon as={getTierIcon(profile.tier)} boxSize={2.5} />
                            <Text>{profile.tier}</Text>
                          </HStack>
                        </Badge>

                        <HStack spacing={2} fontSize="xs" color="#666">
                          <Eye size={12} />
                          <Text>{profile.view_count?.toLocaleString() || 0}</Text>
                        </HStack>

                        <Link href={`/profile/${profile.slug}`} style={{ width: '100%' }}>
                          <Button
                            w="full"
                            size="sm"
                            variant="outline"
                            borderColor="#D4AF37"
                            color="#D4AF37"
                            _hover={{
                              bg: "#D4AF37",
                              color: "white"
                            }}
                            rightIcon={<ArrowRight size={14} />}
                          >
                            View
                          </Button>
                        </Link>
                      </VStack>
                    </CardBody>
                  </MotionCard>
                ))}
              </SimpleGrid>

              {/* Load More Button */}
              {hasMore && (
                <Center>
                  <Button
                    onClick={loadMore}
                    isLoading={isLoadingMore}
                    loadingText="Loading more..."
                    bg="#D4AF37"
                    color="white"
                    _hover={{ bg: "#B8941F" }}
                    size="lg"
                    px={8}
                  >
                    Load More Profiles
                  </Button>
                </Center>
              )}
            </VStack>
          )}
        </Container>
      </FloatingCard>
    </PageLayout>
  )
}
