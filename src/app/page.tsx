'use client'

import { useState } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Grid,
  GridItem,
  Card,
  CardBody,
  List,
  ListItem,
  ListIcon,
  SimpleGrid,
  Icon,
  Flex,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Checkbox,
  useToast,
  useDisclosure
} from '@chakra-ui/react'
import {
  Crown,
  CheckCircle,
  Users,
  FileText,
  CreditCard,
  Sparkles,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  ChevronUp,
  Star,
  Trophy,
  Archive
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CategoriesCarousel } from '@/components/ui/CategoriesCarousel'
import { UnifiedSignInModal } from '@/components/modals/UnifiedSignInModal'
import { TemplatePreviewModal } from '@/components/modals/TemplatePreviewModal'
import { ProfileTier } from '@/types/profile'

const MotionBox = motion.create(Box)
const MotionContainer = motion.create(Container)

export default function HomePage() {
  const { isOpen: isSignInOpen, onOpen: onSignInOpen, onClose: onSignInClose } = useDisclosure()
  const { isOpen: isTemplatePreviewOpen, onOpen: onTemplatePreviewOpen, onClose: onTemplatePreviewClose } = useDisclosure()
  const [selectedTier, setSelectedTier] = useState<ProfileTier>('emerging')
  const toast = useToast()

  const handleInvitationRequest = async (formData: any) => {
    // TODO: Implement invitation request submission
    toast({
      title: "Request Submitted",
      description: "We'll review your request and get back to you soon.",
      status: "success",
      duration: 5000,
      isClosable: true,
    })
  }

  const handleTemplatePreview = (tier: ProfileTier) => {
    setSelectedTier(tier)
    onTemplatePreviewOpen()
  }

  // Unified smooth scrolling function using native browser APIs
  const smoothScrollTo = (targetId: string) => {
    const element = document.getElementById(targetId)
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - 80 // Account for sticky header

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <Box minH="100vh">
      {/* Hero Section */}
      <Box id="home" as="section" minH="100vh" display="flex" alignItems="center">
        <MotionContainer
          maxW="6xl"
          py={20}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <VStack spacing={12} textAlign="center">
            {/* Header */}
            <VStack spacing={6}>
              <HStack spacing={3}>
                <Crown size={40} color="#D4AF37" />
                <Heading
                  as="h1"
                  fontSize={{ base: "3xl", md: "5xl" }}
                  fontFamily="'Playfair Display', serif"
                  color="#1A1A1A"
                  fontWeight="400"
                >
                  ICONS HERALD
                </Heading>
              </HStack>

              <Heading
                as="h2"
                fontSize={{ base: "xl", md: "3xl" }}
                fontFamily="'Playfair Display', serif"
                color="#D4AF37"
                fontWeight="300"
              >
                Where Legacies Live Forever
              </Heading>

              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color="#666"
                fontFamily="'Lora', serif"
                maxW="3xl"
                lineHeight="1.6"
              >
                Transform your achievements into editorial masterpieces.
                Join visionaries and leaders in our curated digital archive.
              </Text>
            </VStack>

            {/* Call to Action */}
            <VStack spacing={4}>
              <HStack spacing={6} flexWrap="wrap" justify="center">
                <Button
                  size="lg"
                  bg="#D4AF37"
                  color="white"
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="600"
                  rightIcon={<ArrowRight size={20} />}
                  _hover={{
                    bg: "#B8941F",
                    transform: "translateY(-2px)"
                  }}
                  transition="all 0.3s ease"
                  onClick={() => smoothScrollTo('request-invitation')}
                >
                  Request Invitation
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  borderColor="#D4AF37"
                  color="#D4AF37"
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="600"
                  _hover={{
                    bg: "#D4AF37",
                    color: "white"
                  }}
                  transition="all 0.3s ease"
                  onClick={onSignInOpen}
                >
                  Sign In
                </Button>
              </HStack>

              <Text
                fontSize="sm"
                color="#999"
                fontStyle="italic"
                fontFamily="'Lora', serif"
              >
                Invitation-only • Premium profiles • Editorial excellence
              </Text>
            </VStack>
          </VStack>
        </MotionContainer>
      </Box>

      {/* Categories Carousel */}
      <CategoriesCarousel autoScroll={true} autoScrollInterval={4000} showArrows={false} />

      {/* About Section */}
      <Box id="about" as="section" py={20} bg="gray.50">
        <MotionContainer
          maxW="6xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <VStack spacing={12} textAlign="center">
            <Heading
              as="h2"
              fontSize={{ base: "2xl", md: "4xl" }}
              fontFamily="'Playfair Display', serif"
              color="#1A1A1A"
              fontWeight="400"
            >
              A Premium Digital Archive
            </Heading>

            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="#666"
              fontFamily="'Lora', serif"
              maxW="4xl"
              lineHeight="1.8"
            >
              Transform achievements into lasting digital legacies.
              Our platform creates editorial-quality profiles for
              visionaries and leaders across every field.
            </Text>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full" maxW="5xl">
              <VStack spacing={4}>
                <Icon as={Crown} boxSize={12} color="#D4AF37" />
                <Heading as="h3" size="md" fontFamily="'Playfair Display', serif">
                  Curated Excellence
                </Heading>
                <Text color="#666" textAlign="center" fontFamily="'Lora', serif">
                  Rigorous standards ensure only exceptional achievements.
                </Text>
              </VStack>

              <VStack spacing={4}>
                <Icon as={FileText} boxSize={12} color="#D4AF37" />
                <Heading as="h3" size="md" fontFamily="'Playfair Display', serif">
                  Editorial Quality
                </Heading>
                <Text color="#666" textAlign="center" fontFamily="'Lora', serif">
                  Professional storytelling captures your legacy's essence.
                </Text>
              </VStack>

              <VStack spacing={4}>
                <Icon as={Sparkles} boxSize={12} color="#D4AF37" />
                <Heading as="h3" size="md" fontFamily="'Playfair Display', serif">
                  Timeless Design
                </Heading>
                <Text color="#666" textAlign="center" fontFamily="'Lora', serif">
                  Beautiful profiles that honor your achievements.
                </Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </MotionContainer>
      </Box>

      {/* Process Section */}
      <Box id="process" as="section" py={20}>
        <MotionContainer
          maxW="6xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <VStack spacing={12} textAlign="center">
            <Heading
              as="h2"
              fontSize={{ base: "2xl", md: "4xl" }}
              fontFamily="'Playfair Display', serif"
              color="#1A1A1A"
              fontWeight="400"
            >
              How It Works
            </Heading>

            <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={8} w="full">
              <VStack spacing={4}>
                <Box
                  bg="#D4AF37"
                  color="white"
                  borderRadius="full"
                  w={16}
                  h={16}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xl"
                  fontWeight="bold"
                >
                  1
                </Box>
                <Heading as="h3" size="md" fontFamily="'Playfair Display', serif">
                  Request Invitation
                </Heading>
                <Text color="#666" textAlign="center" fontFamily="'Lora', serif">
                  Submit achievements for editorial team review.
                </Text>
              </VStack>

              <VStack spacing={4}>
                <Box
                  bg="#D4AF37"
                  color="white"
                  borderRadius="full"
                  w={16}
                  h={16}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xl"
                  fontWeight="bold"
                >
                  2
                </Box>
                <Heading as="h3" size="md" fontFamily="'Playfair Display', serif">
                  Profile Creation
                </Heading>
                <Text color="#666" textAlign="center" fontFamily="'Lora', serif">
                  Build your profile using our guided system.
                </Text>
              </VStack>

              <VStack spacing={4}>
                <Box
                  bg="#D4AF37"
                  color="white"
                  borderRadius="full"
                  w={16}
                  h={16}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xl"
                  fontWeight="bold"
                >
                  3
                </Box>
                <Heading as="h3" size="md" fontFamily="'Playfair Display', serif">
                  Editorial Polish
                </Heading>
                <Text color="#666" textAlign="center" fontFamily="'Lora', serif">
                  Our team refines your story for impact.
                </Text>
              </VStack>

              <VStack spacing={4}>
                <Box
                  bg="#D4AF37"
                  color="white"
                  borderRadius="full"
                  w={16}
                  h={16}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xl"
                  fontWeight="bold"
                >
                  4
                </Box>
                <Heading as="h3" size="md" fontFamily="'Playfair Display', serif">
                  Legacy Published
                </Heading>
                <Text color="#666" textAlign="center" fontFamily="'Lora', serif">
                  Your profile joins our permanent archive.
                </Text>
              </VStack>
            </Grid>
          </VStack>
        </MotionContainer>
      </Box>

      {/* Tiers Section */}
      <Box id="tiers" as="section" py={20} bg="gray.50">
        <MotionContainer
          maxW="6xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <VStack spacing={12} textAlign="center">
            <VStack spacing={4} textAlign="center" mb={8}>
              <Heading
                as="h2"
                fontSize={{ base: "2xl", md: "4xl" }}
                fontFamily="'Playfair Display', serif"
                color="#1A1A1A"
                fontWeight="400"
              >
                Choose Your Profile Tier
              </Heading>
              <Text
                fontSize="lg"
                color="#8B8680"
                maxW="600px"
              >
                Select the perfect tier to showcase your achievements and build your digital legacy
              </Text>
            </VStack>

            {/* Main Tiers */}
            <VStack spacing={8} w="full">
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full" maxW="1200px">
                {/* Emerging Tier */}
                <Card
                  bg="white"
                  shadow="lg"
                  borderRadius="xl"
                  overflow="hidden"
                  _hover={{ transform: "translateY(-4px)", shadow: "xl" }}
                  transition="all 0.3s ease"
                >
                  {/* Gradient Header */}
                  <Box
                    h="80px"
                    background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <VStack spacing={1}>
                      <Star size={24} color="white" />
                      <Text fontSize="lg" fontWeight="600" color="white">
                        Emerging
                      </Text>
                    </VStack>
                  </Box>

                  <CardBody p={8}>
                    <VStack spacing={6}>
                      <VStack spacing={2}>
                        <Text fontSize="3xl" fontWeight="bold" color="#1A1A1A">
                          ₹2,500
                        </Text>
                        <Text color="#666" fontSize="sm">
                          Per year • Rising talents
                        </Text>
                      </VStack>

                      <List spacing={3} w="full">
                        <ListItem>
                          <ListIcon as={CheckCircle} color="#667eea" />
                          AI bio polishing
                        </ListItem>
                        <ListItem>
                          <ListIcon as={CheckCircle} color="#667eea" />
                          4 gallery photos
                        </ListItem>
                        <ListItem>
                          <ListIcon as={CheckCircle} color="#667eea" />
                          2 template designs
                        </ListItem>
                        <ListItem>
                          <ListIcon as={CheckCircle} color="#667eea" />
                          Resume attachment
                        </ListItem>
                        <ListItem>
                          <ListIcon as={CheckCircle} color="#667eea" />
                          Unlimited video links
                        </ListItem>
                      </List>

                      <Button
                        w="full"
                        background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        color="white"
                        _hover={{
                          background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                          transform: "translateY(-2px)"
                        }}
                        onClick={() => handleTemplatePreview('emerging')}
                      >
                        View Templates
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Accomplished Tier */}
                <Card
                  bg="white"
                  shadow="xl"
                  borderRadius="xl"
                  overflow="hidden"
                  border="2px solid #4facfe"
                  position="relative"
                  _hover={{ transform: "translateY(-4px)", shadow: "2xl" }}
                  transition="all 0.3s ease"
                >
                  <Box
                    position="absolute"
                    top={0}
                    left="50%"
                    transform="translateX(-50%)"
                    background="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                    color="white"
                    px={4}
                    py={1}
                    borderRadius="0 0 md md"
                    fontSize="sm"
                    fontWeight="bold"
                  >
                    POPULAR
                  </Box>

                  {/* Gradient Header */}
                  <Box
                    h="80px"
                    background="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    mt={6}
                  >
                    <VStack spacing={1}>
                      <Crown size={24} color="white" />
                      <Text fontSize="lg" fontWeight="600" color="white">
                        Accomplished
                      </Text>
                    </VStack>
                  </Box>

                  <CardBody p={8}>
                    <VStack spacing={6}>
                      <VStack spacing={2}>
                        <Text fontSize="3xl" fontWeight="bold" color="#1A1A1A">
                          ₹5,000
                        </Text>
                        <Text color="#666" fontSize="sm">
                          Per year • Established professionals
                        </Text>
                      </VStack>

                    <List spacing={3} w="full">
                      <ListItem>
                        <ListIcon as={CheckCircle} color="#4facfe" />
                        Everything in Emerging
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircle} color="#4facfe" />
                        10 gallery photos
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircle} color="#4facfe" />
                        5 template designs
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircle} color="#4facfe" />
                        QR code generation
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircle} color="#4facfe" />
                        Interactive timeline
                      </ListItem>
                      <ListItem>
                        <ListIcon as={CheckCircle} color="#4facfe" />
                        Priority support
                      </ListItem>
                    </List>

                    <Button
                      w="full"
                      background="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                      color="white"
                      _hover={{
                        background: "linear-gradient(135deg, #3d8bfe 0%, #00d9fe 100%)",
                        transform: "translateY(-2px)"
                      }}
                      onClick={() => handleTemplatePreview('accomplished')}
                    >
                      View Templates
                    </Button>
                  </VStack>
                </CardBody>
              </Card>

                {/* Distinguished Tier */}
                <Card
                  bg="white"
                  shadow="lg"
                  borderRadius="xl"
                  overflow="hidden"
                  _hover={{ transform: "translateY(-4px)", shadow: "xl" }}
                  transition="all 0.3s ease"
                >
                  {/* Gradient Header */}
                  <Box
                    h="80px"
                    background="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <VStack spacing={1}>
                      <Trophy size={24} color="white" />
                      <Text fontSize="lg" fontWeight="600" color="white">
                        Distinguished
                      </Text>
                    </VStack>
                  </Box>

                  <CardBody p={8}>
                    <VStack spacing={6}>
                      <VStack spacing={2}>
                        <Text fontSize="3xl" fontWeight="bold" color="#1A1A1A">
                          ₹12,000
                        </Text>
                        <Text color="#666" fontSize="sm">
                          Per year • Industry leaders
                        </Text>
                      </VStack>

                      <List spacing={3} w="full">
                        <ListItem>
                          <ListIcon as={CheckCircle} color="#fa709a" />
                          Everything in Accomplished
                        </ListItem>
                        <ListItem>
                          <ListIcon as={CheckCircle} color="#fa709a" />
                          20 gallery photos
                        </ListItem>
                        <ListItem>
                          <ListIcon as={CheckCircle} color="#fa709a" />
                          6 premium templates
                        </ListItem>
                        <ListItem>
                          <ListIcon as={CheckCircle} color="#fa709a" />
                          Publications showcase
                        </ListItem>
                        <ListItem>
                          <ListIcon as={CheckCircle} color="#fa709a" />
                          Impact metrics display
                        </ListItem>
                        <ListItem>
                          <ListIcon as={CheckCircle} color="#fa709a" />
                          White-glove service
                        </ListItem>
                      </List>

                      <Button
                        w="full"
                        background="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                        color="white"
                        _hover={{
                          background: "linear-gradient(135deg, #f85a8a 0%, #fed130 100%)",
                          transform: "translateY(-2px)"
                        }}
                        onClick={() => handleTemplatePreview('distinguished')}
                      >
                        View Templates
                      </Button>
                  </VStack>
                </CardBody>
              </Card>
              </SimpleGrid>

              {/* Memorial Service Section */}
              <VStack spacing={6} w="full" maxW="800px" mt={16}>
                <VStack spacing={2} textAlign="center">
                  <Heading
                    as="h3"
                    fontSize="2xl"
                    fontFamily="'Playfair Display', serif"
                    color="#1A1A1A"
                  >
                    Memorial Service
                  </Heading>
                  <Text
                    fontSize="md"
                    color="#8B8680"
                    maxW="600px"
                  >
                    Honor the memory of departed loved ones with our dedicated memorial service,
                    separate from our main profile tiers.
                  </Text>
                </VStack>

                {/* Legacy Memorial Card */}
                <Card
                  bg="white"
                  shadow="lg"
                  borderRadius="xl"
                  overflow="hidden"
                  border="2px solid #8B4513"
                  _hover={{ transform: "translateY(-4px)", shadow: "xl" }}
                  transition="all 0.3s ease"
                  w="full"
                  maxW="600px"
                >
                  {/* Memorial Gradient Header */}
                  <Box
                    h="100px"
                    background="linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <VStack spacing={2}>
                      <Archive size={32} color="white" />
                      <Text fontSize="xl" fontWeight="600" color="white">
                        Legacy Memorial
                      </Text>
                    </VStack>
                  </Box>

                  <CardBody p={8}>
                    <VStack spacing={6}>
                      <VStack spacing={2}>
                        <Text fontSize="3xl" fontWeight="bold" color="#1A1A1A">
                          ₹50,000
                        </Text>
                        <Text color="#666" fontSize="sm">
                          Lifetime • Memorial service
                        </Text>
                      </VStack>

                      <List spacing={3} w="full">
                        <ListItem>
                          <ListIcon as={CheckCircle} color="#8B4513" />
                          Dedicated memorial templates
                        </ListItem>
                        <ListItem>
                          <ListIcon as={CheckCircle} color="#8B4513" />
                          Unlimited gallery photos
                        </ListItem>
                        <ListItem>
                          <ListIcon as={CheckCircle} color="#8B4513" />
                          Historical timeline preservation
                        </ListItem>
                        <ListItem>
                          <ListIcon as={CheckCircle} color="#8B4513" />
                          Tribute collection system
                        </ListItem>
                        <ListItem>
                          <ListIcon as={CheckCircle} color="#8B4513" />
                          Family access management
                        </ListItem>
                        <ListItem>
                          <ListIcon as={CheckCircle} color="#8B4513" />
                          Lifetime hosting guarantee
                        </ListItem>
                      </List>

                      <Button
                        w="full"
                        background="linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)"
                        color="#8B4513"
                        fontWeight="600"
                        _hover={{
                          background: "linear-gradient(135deg, #c088b1 0%, #fdf6c6 100%)",
                          transform: "translateY(-2px)"
                        }}
                        onClick={() => {
                          toast({
                            title: "Memorial Service",
                            description: "Contact our memorial service team for consultation.",
                            status: "info",
                            duration: 3000,
                          })
                        }}
                      >
                        Learn More About Memorial Service
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </VStack>
          </VStack>
        </MotionContainer>
      </Box>

      {/* Request Invitation Section */}
      <Box id="request-invitation" as="section" py={20}>
        <MotionContainer
          maxW="4xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <VStack spacing={12} textAlign="center">
            <Heading
              as="h2"
              fontSize={{ base: "2xl", md: "4xl" }}
              fontFamily="'Playfair Display', serif"
              color="#1A1A1A"
              fontWeight="400"
            >
              Request Your Invitation
            </Heading>

            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="#666"
              fontFamily="'Lora', serif"
              maxW="2xl"
            >
              Join our exclusive community of visionaries and leaders.
              Share your achievements for review.
            </Text>

            <Card
              bg="rgba(255, 255, 255, 0.95)"
              shadow="xl"
              borderRadius="2xl"
              w="full"
              maxW="2xl"
              border="2px solid rgba(212, 175, 55, 0.2)"
              backdropFilter="blur(10px)"
            >
              <CardBody p={8}>
                <VStack spacing={6} as="form" onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target as HTMLFormElement)
                  handleInvitationRequest(Object.fromEntries(formData))
                }}>
                  <FormControl isRequired>
                    <FormLabel fontFamily="'Lora', serif">Full Name</FormLabel>
                    <Input
                      name="name"
                      placeholder="Your full name"
                      borderColor="#D4AF37"
                      _focus={{ borderColor: "#B8941F", boxShadow: "0 0 0 1px #B8941F" }}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontFamily="'Lora', serif">Email Address</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      borderColor="#D4AF37"
                      _focus={{ borderColor: "#B8941F", boxShadow: "0 0 0 1px #B8941F" }}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontFamily="'Lora', serif">Tell Us About Your Achievements</FormLabel>
                    <Textarea
                      name="achievements"
                      placeholder="Describe your key accomplishments, leadership roles, and impact..."
                      rows={5}
                      borderColor="#D4AF37"
                      _focus={{ borderColor: "#B8941F", boxShadow: "0 0 0 1px #B8941F" }}
                    />
                  </FormControl>

                  <FormControl>
                    <Checkbox
                      name="nominatingOther"
                      colorScheme="yellow"
                      fontFamily="'Lora', serif"
                    >
                      I'm nominating someone else (please include their details above)
                    </Checkbox>
                  </FormControl>

                  <Button
                    type="submit"
                    w="full"
                    bg="#D4AF37"
                    color="white"
                    size="lg"
                    _hover={{ bg: "#B8941F" }}
                    rightIcon={<ArrowRight size={20} />}
                  >
                    Submit Request
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </MotionContainer>
      </Box>

      {/* Final CTA */}
      <Box bg="#1A1A1A" color="white" py={16}>
        <Container maxW="4xl" textAlign="center">
          <VStack spacing={6}>
            <Heading
              as="h2"
              fontSize={{ base: "xl", md: "3xl" }}
              fontFamily="'Playfair Display', serif"
              fontWeight="400"
            >
              Claim Your Place in History
            </Heading>
            <Text fontSize="lg" color="gray.300" fontFamily="'Lora', serif">
              Join extraordinary individuals in our exclusive archive.
            </Text>
            <Button
              size="lg"
              bg="#D4AF37"
              color="white"
              px={8}
              py={6}
              fontSize="lg"
              fontWeight="600"
              rightIcon={<ArrowRight size={20} />}
              _hover={{
                bg: "#B8941F",
                transform: "translateY(-2px)"
              }}
              transition="all 0.3s ease"
              onClick={() => smoothScrollTo('request-invitation')}
            >
              Get Started Today
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Mini Footer */}
      <Box bg="gray.100" py={8}>
        <Container maxW="6xl">
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align="center"
            gap={4}
          >
            <HStack spacing={6}>
              <Link href="/#home">
                <Text color="#666" _hover={{ color: "#D4AF37" }} fontFamily="'Lora', serif">
                  Home
                </Text>
              </Link>
              <Link href="/#about">
                <Text color="#666" _hover={{ color: "#D4AF37" }} fontFamily="'Lora', serif">
                  About
                </Text>
              </Link>
              <Link href="/#process">
                <Text color="#666" _hover={{ color: "#D4AF37" }} fontFamily="'Lora', serif">
                  Process
                </Text>
              </Link>
              <Link href="/#tiers">
                <Text color="#666" _hover={{ color: "#D4AF37" }} fontFamily="'Lora', serif">
                  Tiers
                </Text>
              </Link>
              <Link href="/#request-invitation">
                <Text color="#666" _hover={{ color: "#D4AF37" }} fontFamily="'Lora', serif">
                  Contact
                </Text>
              </Link>
            </HStack>

            <Button
              size="sm"
              variant="ghost"
              color="#666"
              _hover={{ color: "#D4AF37", bg: "transparent" }}
              onClick={scrollToTop}
              leftIcon={<ChevronUp size={16} />}
            >
              Back to Top
            </Button>
          </Flex>

          <Box textAlign="center" mt={6} pt={6} borderTop="1px solid" borderColor="gray.300">
            <Text color="#666" fontSize="sm" fontFamily="'Lora', serif">
              © 2024 ICONS HERALD. All rights reserved.
            </Text>
          </Box>
        </Container>
      </Box>

      {/* Unified Sign In Modal */}
      <UnifiedSignInModal isOpen={isSignInOpen} onClose={onSignInClose} />

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        isOpen={isTemplatePreviewOpen}
        onClose={onTemplatePreviewClose}
        tier={selectedTier}
      />
    </Box>
  )
}