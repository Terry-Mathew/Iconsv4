'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Divider,
  SimpleGrid,
  Icon,
  Spinner,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import {
  User,
  Edit3,
  Eye,
  Crown,
  Star,
  Trophy,
  Plus,
  Settings,
  LogOut,
  FileText,
  Globe,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { PageLayout } from '@/components/layout/PageLayout'
import { FloatingCard } from '@/components/ui/FloatingCard'

const MotionBox = motion.create(Box)
const MotionCard = motion.create(Card)

interface ProfileStatus {
  hasDraft: boolean
  isPublished: boolean
  slug?: string
  publishedAt?: string
  lastSaved?: string
}

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>({
    hasDraft: false,
    isPublished: false
  })
  const [loadingProfile, setLoadingProfile] = useState(true)

  // Load profile status
  useEffect(() => {
    if (user && !loading) {
      loadProfileStatus()
    }
  }, [user, loading])

  const loadProfileStatus = async () => {
    try {
      setLoadingProfile(true)

      // Check for draft
      const draftResponse = await fetch('/api/profiles/draft')
      const draftData = await draftResponse.json()

      let publishStatus = { isPublished: false, publishedAt: null }

      // Check publication status if draft exists
      if (draftData.profile?.slug) {
        const publishResponse = await fetch(`/api/profiles/publish?slug=${draftData.profile.slug}`)
        if (publishResponse.ok) {
          publishStatus = await publishResponse.json()
        }
      }

      setProfileStatus({
        hasDraft: draftData.hasDraft,
        isPublished: publishStatus.isPublished,
        slug: draftData.profile?.slug,
        publishedAt: publishStatus.publishedAt || undefined,
        lastSaved: draftData.profile?.updated_at
      })
    } catch (error) {
      console.error('Failed to load profile status:', error)
    } finally {
      setLoadingProfile(false)
    }
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <PageLayout>
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
          <VStack spacing={4}>
            <Spinner size="xl" color="#D4AF37" thickness="4px" />
            <Text fontFamily="'Lato', sans-serif" color="white">
              Loading your dashboard...
            </Text>
          </VStack>
        </Box>
      </PageLayout>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <PageLayout containerPadding={{ base: 8, md: 16 }}>
      <Container maxW="6xl">
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <MotionBox variants={itemVariants} mb={8}>
            <HStack justify="space-between" align="center" mb={6}>
              <VStack align="start" spacing={1}>
                <Heading
                  as="h1"
                  fontSize={{ base: '2xl', md: '3xl' }}
                  fontFamily="'Playfair Display', serif"
                  color="#1A1A1A"
                  fontWeight="400"
                >
                  Welcome back
                </Heading>
                <Text
                  fontSize="lg"
                  color="#666"
                  fontFamily="'Lato', sans-serif"
                >
                  {user.email}
                </Text>
              </VStack>
              
              <Button
                leftIcon={<LogOut size={16} />}
                onClick={handleSignOut}
                variant="outline"
                borderColor="#D4AF37"
                color="#D4AF37"
                _hover={{ bg: "#D4AF37", color: "white" }}
                fontFamily="'Lato', sans-serif"
              >
                Sign Out
              </Button>
            </HStack>

            <Divider borderColor="rgba(212, 175, 55, 0.3)" />
          </MotionBox>

          {/* Profile Management Section */}
          <MotionBox variants={itemVariants} mb={8}>
            <MotionCard
              bg="white"
              borderRadius="16px"
              boxShadow="xl"
              border="2px solid rgba(212, 175, 55, 0.3)"
              mb={8}
            >
              <CardHeader>
                <HStack spacing={3}>
                  <Icon as={FileText} color="#D4AF37" boxSize={6} />
                  <Heading size="lg" fontFamily="'Playfair Display', serif">
                    Profile Management
                  </Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                {loadingProfile ? (
                  <HStack justify="center" py={8}>
                    <Spinner color="#D4AF37" />
                    <Text>Loading profile status...</Text>
                  </HStack>
                ) : (
                  <VStack spacing={6} align="stretch">
                    {/* Profile Status */}
                    <HStack spacing={4} p={4} bg="gray.50" borderRadius="lg">
                      <Icon
                        as={profileStatus.hasDraft ? CheckCircle : AlertCircle}
                        color={profileStatus.hasDraft ? "green.500" : "orange.500"}
                        boxSize={5}
                      />
                      <VStack align="start" spacing={1} flex={1}>
                        <Text fontWeight="medium">
                          {profileStatus.hasDraft ? 'Draft Available' : 'No Draft Found'}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {profileStatus.hasDraft
                            ? `Last saved: ${profileStatus.lastSaved ? new Date(profileStatus.lastSaved).toLocaleDateString() : 'Unknown'}`
                            : 'Start building your profile to create a draft'
                          }
                        </Text>
                      </VStack>
                      {profileStatus.isPublished && (
                        <Badge colorScheme="green" size="lg">
                          Published
                        </Badge>
                      )}
                    </HStack>

                    {/* Quick Actions */}
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                      <Button
                        leftIcon={<Edit3 size={18} />}
                        colorScheme="yellow"
                        variant="solid"
                        onClick={() => router.push('/builder')}
                        size="lg"
                      >
                        {profileStatus.hasDraft ? 'Continue Editing' : 'Start Building'}
                      </Button>

                      {profileStatus.hasDraft && (
                        <Button
                          leftIcon={<Eye size={18} />}
                          variant="outline"
                          colorScheme="blue"
                          onClick={() => router.push(`/profile/${profileStatus.slug}?preview=true`)}
                          size="lg"
                        >
                          Preview
                        </Button>
                      )}

                      {profileStatus.isPublished && (
                        <Button
                          leftIcon={<Globe size={18} />}
                          variant="outline"
                          colorScheme="green"
                          onClick={() => window.open(`/profile/${profileStatus.slug}`, '_blank')}
                          size="lg"
                        >
                          View Live
                        </Button>
                      )}
                    </SimpleGrid>
                  </VStack>
                )}
              </CardBody>
            </MotionCard>
          </MotionBox>

          {/* Quick Actions */}
          <MotionBox variants={itemVariants} mb={8}>
            <Heading
              as="h2"
              fontSize="xl"
              fontFamily="'Playfair Display', serif"
              color="#1A1A1A"
              fontWeight="400"
              mb={6}
            >
              Quick Actions
            </Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              <MotionCard
                bg="white"
                borderRadius="12px"
                boxShadow="lg"
                border="1px solid rgba(212, 175, 55, 0.2)"
                cursor="pointer"
                onClick={() => router.push('/builder')}
                whileHover={{ 
                  y: -4,
                  boxShadow: "0 12px 40px rgba(212, 175, 55, 0.15)",
                  transition: { duration: 0.3 }
                }}
                transition={{ duration: 0.2 }}
              >
                <CardBody textAlign="center" p={6}>
                  <Box
                    w={12}
                    h={12}
                    bg="linear-gradient(135deg, #D4AF37, #F4E4BC)"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mx="auto"
                    mb={4}
                  >
                    <Edit3 size={24} color="white" />
                  </Box>
                  <Heading
                    as="h3"
                    fontSize="lg"
                    fontFamily="'Playfair Display', serif"
                    color="#1A1A1A"
                    fontWeight="400"
                    mb={2}
                  >
                    Build Profile
                  </Heading>
                  <Text
                    fontSize="sm"
                    color="#666"
                    fontFamily="'Lato', sans-serif"
                  >
                    Create your premium profile
                  </Text>
                </CardBody>
              </MotionCard>

              <MotionCard
                bg="white"
                borderRadius="12px"
                boxShadow="lg"
                border="1px solid rgba(212, 175, 55, 0.2)"
                cursor="pointer"
                onClick={() => router.push('/nominate')}
                whileHover={{ 
                  y: -4,
                  boxShadow: "0 12px 40px rgba(212, 175, 55, 0.15)",
                  transition: { duration: 0.3 }
                }}
                transition={{ duration: 0.2 }}
              >
                <CardBody textAlign="center" p={6}>
                  <Box
                    w={12}
                    h={12}
                    bg="linear-gradient(135deg, #D4AF37, #F4E4BC)"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mx="auto"
                    mb={4}
                  >
                    <Plus size={24} color="white" />
                  </Box>
                  <Heading
                    as="h3"
                    fontSize="lg"
                    fontFamily="'Playfair Display', serif"
                    color="#1A1A1A"
                    fontWeight="400"
                    mb={2}
                  >
                    Nominate
                  </Heading>
                  <Text
                    fontSize="sm"
                    color="#666"
                    fontFamily="'Lato', sans-serif"
                  >
                    Nominate someone exceptional
                  </Text>
                </CardBody>
              </MotionCard>

              <MotionCard
                bg="white"
                borderRadius="12px"
                boxShadow="lg"
                border="1px solid rgba(212, 175, 55, 0.2)"
                cursor="pointer"
                onClick={() => router.push('/profiles')}
                whileHover={{ 
                  y: -4,
                  boxShadow: "0 12px 40px rgba(212, 175, 55, 0.15)",
                  transition: { duration: 0.3 }
                }}
                transition={{ duration: 0.2 }}
              >
                <CardBody textAlign="center" p={6}>
                  <Box
                    w={12}
                    h={12}
                    bg="linear-gradient(135deg, #D4AF37, #F4E4BC)"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mx="auto"
                    mb={4}
                  >
                    <Eye size={24} color="white" />
                  </Box>
                  <Heading
                    as="h3"
                    fontSize="lg"
                    fontFamily="'Playfair Display', serif"
                    color="#1A1A1A"
                    fontWeight="400"
                    mb={2}
                  >
                    Browse
                  </Heading>
                  <Text
                    fontSize="sm"
                    color="#666"
                    fontFamily="'Lato', sans-serif"
                  >
                    Explore published profiles
                  </Text>
                </CardBody>
              </MotionCard>

              <MotionCard
                bg="white"
                borderRadius="12px"
                boxShadow="lg"
                border="1px solid rgba(212, 175, 55, 0.2)"
                cursor="pointer"
                whileHover={{ 
                  y: -4,
                  boxShadow: "0 12px 40px rgba(212, 175, 55, 0.15)",
                  transition: { duration: 0.3 }
                }}
                transition={{ duration: 0.2 }}
              >
                <CardBody textAlign="center" p={6}>
                  <Box
                    w={12}
                    h={12}
                    bg="linear-gradient(135deg, #D4AF37, #F4E4BC)"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mx="auto"
                    mb={4}
                  >
                    <Settings size={24} color="white" />
                  </Box>
                  <Heading
                    as="h3"
                    fontSize="lg"
                    fontFamily="'Playfair Display', serif"
                    color="#1A1A1A"
                    fontWeight="400"
                    mb={2}
                  >
                    Settings
                  </Heading>
                  <Text
                    fontSize="sm"
                    color="#666"
                    fontFamily="'Lato', sans-serif"
                  >
                    Manage your account
                  </Text>
                </CardBody>
              </MotionCard>
            </SimpleGrid>
          </MotionBox>

          {/* Status Card */}
          <MotionBox variants={itemVariants}>
            <MotionCard
              bg="white"
              borderRadius="12px"
              boxShadow="lg"
              border="1px solid rgba(212, 175, 55, 0.2)"
            >
              <CardHeader>
                <Heading
                  as="h2"
                  fontSize="xl"
                  fontFamily="'Playfair Display', serif"
                  color="#1A1A1A"
                  fontWeight="400"
                >
                  Your Profile Status
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between" align="center">
                    <Text
                      fontSize="md"
                      fontFamily="'Lato', sans-serif"
                      color="#1A1A1A"
                    >
                      Profile Status
                    </Text>
                    <Badge
                      colorScheme="yellow"
                      variant="subtle"
                      fontSize="sm"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      Draft
                    </Badge>
                  </HStack>
                  
                  <Text
                    fontSize="sm"
                    color="#666"
                    fontFamily="'Lato', sans-serif"
                    lineHeight="1.6"
                  >
                    Your profile is ready to be created. Use the Profile Builder to craft your story 
                    and submit it for editorial review. Once approved, it will be published to the 
                    Icons Herald archive.
                  </Text>

                  <Button
                    onClick={() => router.push('/builder')}
                    bg="#D4AF37"
                    color="white"
                    size="lg"
                    fontFamily="'Lato', sans-serif"
                    fontWeight="500"
                    leftIcon={<Edit3 size={16} />}
                    _hover={{
                      bg: "#B8941F",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(212, 175, 55, 0.3)"
                    }}
                    transition="all 0.2s"
                    alignSelf="flex-start"
                  >
                    Start Building Your Profile
                  </Button>
                </VStack>
              </CardBody>
            </MotionCard>
          </MotionBox>
        </MotionBox>
      </Container>
    </PageLayout>
  )
}
