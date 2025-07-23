'use client'

import { useEffect } from 'react'
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
  LogOut
} from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'

const MotionBox = motion(Box)
const MotionCard = motion(Card)

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

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
      <Box minH="100vh" bg="#D2B48C" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="#D4AF37" thickness="4px" />
          <Text fontFamily="'Lato', sans-serif" color="#1A1A1A">
            Loading your dashboard...
          </Text>
        </VStack>
      </Box>
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
    <Box minH="100vh" bg="#D2B48C" py={{ base: 8, md: 16 }}>
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
    </Box>
  )
}
