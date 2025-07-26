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
  SimpleGrid,
  Icon,
  Divider
} from '@chakra-ui/react'
import { Crown, Users, Award, Mail, Phone, MapPin, CheckCircle, Star, Target } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <Box>
      {/* Hero Section */}
      <Container maxW="6xl" py={20}>
        <VStack spacing={12} textAlign="center">
          {/* Header */}
          <VStack spacing={6}>
            <HStack spacing={3}>
              <Crown size={40} color="#D4AF37" />
              <Heading
                as="h1"
                fontSize="5xl"
                fontFamily="'Playfair Display', serif"
                color="#1A1A1A"
                fontWeight="400"
              >
                ICONS HERALD
              </Heading>
            </HStack>

            <Heading
              as="h2"
              fontSize="3xl"
              fontFamily="'Playfair Display', serif"
              color="#D4AF37"
              fontWeight="300"
            >
              Where Legacies Endure
            </Heading>

            <Text
              fontSize="xl"
              color="#666"
              fontFamily="'Lato', sans-serif"
              maxW="4xl"
              lineHeight="1.6"
            >
              An exclusive, invitation-only digital archive for world-class legacies.
              Transform your achievements into an editorial masterpiece with our tiered profile system.
            </Text>
          </VStack>

          {/* Call to Action */}
          <VStack spacing={4}>
            <HStack spacing={6} flexWrap="wrap" justify="center">
              <Link href="/nominate">
                <Button
                  size="lg"
                  bg="#D4AF37"
                  color="white"
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="600"
                  _hover={{
                    bg: "#B8941F",
                    transform: "translateY(-2px)"
                  }}
                >
                  Nominate Yourself
                </Button>
              </Link>

              <Link href="/nominate">
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
                >
                  Nominate an Icon
                </Button>
              </Link>
            </HStack>

            <Text
              fontSize="sm"
              color="#999"
              fontStyle="italic"
              fontFamily="'Lato', sans-serif"
            >
              By invitation only • Premium profiles • Editorial excellence
            </Text>
          </VStack>
        </VStack>
      </Container>

      {/* About Section */}
      <Box id="about" bg="gray.50" py={20} scrollMarginTop="80px">
        <Container maxW="6xl">
          <VStack spacing={12} textAlign="center">
            <VStack spacing={4}>
              <Heading
                as="h2"
                fontSize="4xl"
                fontFamily="'Playfair Display', serif"
                color="#1A1A1A"
                fontWeight="400"
              >
                About Icons Herald
              </Heading>
              <Text
                fontSize="xl"
                color="#666"
                fontFamily="'Lato', sans-serif"
                maxW="3xl"
                lineHeight="1.6"
              >
                We curate and preserve the stories of extraordinary individuals who have shaped our world.
                Our platform transforms achievements into timeless digital legacies.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              <Card bg="white" borderRadius="12px" boxShadow="md" border="1px solid rgba(212, 175, 55, 0.2)">
                <CardBody textAlign="center" p={8}>
                  <Icon as={Users} boxSize={12} color="#D4AF37" mb={4} />
                  <Heading as="h3" fontSize="xl" fontFamily="'Playfair Display', serif" mb={3}>
                    Exclusive Community
                  </Heading>
                  <Text color="#666" fontFamily="'Lato', sans-serif">
                    Join an elite network of visionaries, leaders, and innovators who have left an indelible mark on history.
                  </Text>
                </CardBody>
              </Card>

              <Card bg="white" borderRadius="12px" boxShadow="md" border="1px solid rgba(212, 175, 55, 0.2)">
                <CardBody textAlign="center" p={8}>
                  <Icon as={Award} boxSize={12} color="#D4AF37" mb={4} />
                  <Heading as="h3" fontSize="xl" fontFamily="'Playfair Display', serif" mb={3}>
                    Editorial Excellence
                  </Heading>
                  <Text color="#666" fontFamily="'Lato', sans-serif">
                    Every profile is crafted with journalistic precision and editorial sophistication to honor your legacy.
                  </Text>
                </CardBody>
              </Card>

              <Card bg="white" borderRadius="12px" boxShadow="md" border="1px solid rgba(212, 175, 55, 0.2)">
                <CardBody textAlign="center" p={8}>
                  <Icon as={Crown} boxSize={12} color="#D4AF37" mb={4} />
                  <Heading as="h3" fontSize="xl" fontFamily="'Playfair Display', serif" mb={3}>
                    Permanent Archive
                  </Heading>
                  <Text color="#666" fontFamily="'Lato', sans-serif">
                    Your story becomes part of a permanent digital archive, ensuring your legacy endures for generations.
                  </Text>
                </CardBody>
              </Card>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Process Section */}
      <Box id="process" py={20} scrollMarginTop="80px">
        <Container maxW="6xl">
          <VStack spacing={12} textAlign="center">
            <VStack spacing={4}>
              <Heading
                as="h2"
                fontSize="4xl"
                fontFamily="'Playfair Display', serif"
                color="#1A1A1A"
                fontWeight="400"
              >
                Our Process
              </Heading>
              <Text
                fontSize="xl"
                color="#666"
                fontFamily="'Lato', sans-serif"
                maxW="3xl"
                lineHeight="1.6"
              >
                From nomination to publication, every step is designed to honor your achievements
                with the dignity and excellence they deserve.
              </Text>
            </VStack>

            <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={8} w="full">
              <GridItem>
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
                    fontSize="2xl"
                    fontWeight="bold"
                    fontFamily="'Playfair Display', serif"
                  >
                    1
                  </Box>
                  <Heading as="h3" fontSize="lg" fontFamily="'Playfair Display', serif">
                    Nomination
                  </Heading>
                  <Text color="#666" fontFamily="'Lato', sans-serif" textAlign="center">
                    Submit your nomination with supporting materials and achievements.
                  </Text>
                </VStack>
              </GridItem>

              <GridItem>
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
                    fontSize="2xl"
                    fontWeight="bold"
                    fontFamily="'Playfair Display', serif"
                  >
                    2
                  </Box>
                  <Heading as="h3" fontSize="lg" fontFamily="'Playfair Display', serif">
                    Review
                  </Heading>
                  <Text color="#666" fontFamily="'Lato', sans-serif" textAlign="center">
                    Our editorial team carefully reviews and verifies your accomplishments.
                  </Text>
                </VStack>
              </GridItem>

              <GridItem>
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
                    fontSize="2xl"
                    fontWeight="bold"
                    fontFamily="'Playfair Display', serif"
                  >
                    3
                  </Box>
                  <Heading as="h3" fontSize="lg" fontFamily="'Playfair Display', serif">
                    Creation
                  </Heading>
                  <Text color="#666" fontFamily="'Lato', sans-serif" textAlign="center">
                    We craft your profile with editorial excellence and visual sophistication.
                  </Text>
                </VStack>
              </GridItem>

              <GridItem>
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
                    fontSize="2xl"
                    fontWeight="bold"
                    fontFamily="'Playfair Display', serif"
                  >
                    4
                  </Box>
                  <Heading as="h3" fontSize="lg" fontFamily="'Playfair Display', serif">
                    Publication
                  </Heading>
                  <Text color="#666" fontFamily="'Lato', sans-serif" textAlign="center">
                    Your legacy joins our permanent archive for the world to discover.
                  </Text>
                </VStack>
              </GridItem>
            </Grid>

            <Box bg="gray.50" p={8} borderRadius="12px" maxW="4xl">
              <VStack spacing={4}>
                <Icon as={CheckCircle} boxSize={8} color="#D4AF37" />
                <Text
                  fontSize="lg"
                  fontWeight="600"
                  color="#1A1A1A"
                  fontFamily="'Playfair Display', serif"
                >
                  Quality Guarantee
                </Text>
                <Text
                  color="#666"
                  fontFamily="'Lato', sans-serif"
                  textAlign="center"
                  lineHeight="1.6"
                >
                  Every profile undergoes rigorous editorial review to ensure accuracy,
                  elegance, and lasting impact. We don't just document achievements—we celebrate them.
                </Text>
              </VStack>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box id="contact" bg="gray.50" py={20} scrollMarginTop="80px">
        <Container maxW="6xl">
          <VStack spacing={12} textAlign="center">
            <VStack spacing={4}>
              <Heading
                as="h2"
                fontSize="4xl"
                fontFamily="'Playfair Display', serif"
                color="#1A1A1A"
                fontWeight="400"
              >
                Contact Us
              </Heading>
              <Text
                fontSize="xl"
                color="#666"
                fontFamily="'Lato', sans-serif"
                maxW="3xl"
                lineHeight="1.6"
              >
                Ready to secure your place in history? Get in touch with our editorial team
                to begin your journey toward digital immortality.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full" maxW="4xl">
              <Card bg="white" borderRadius="12px" boxShadow="md" border="1px solid rgba(212, 175, 55, 0.2)">
                <CardBody textAlign="center" p={8}>
                  <Icon as={Mail} boxSize={8} color="#D4AF37" mb={4} />
                  <Heading as="h3" fontSize="lg" fontFamily="'Playfair Display', serif" mb={3}>
                    Email
                  </Heading>
                  <Text color="#666" fontFamily="'Lato', sans-serif">
                    editorial@iconsherald.com
                  </Text>
                  <Text color="#999" fontSize="sm" mt={2}>
                    For nominations and inquiries
                  </Text>
                </CardBody>
              </Card>

              <Card bg="white" borderRadius="12px" boxShadow="md" border="1px solid rgba(212, 175, 55, 0.2)">
                <CardBody textAlign="center" p={8}>
                  <Icon as={Phone} boxSize={8} color="#D4AF37" mb={4} />
                  <Heading as="h3" fontSize="lg" fontFamily="'Playfair Display', serif" mb={3}>
                    Phone
                  </Heading>
                  <Text color="#666" fontFamily="'Lato', sans-serif">
                    +1 (555) 123-4567
                  </Text>
                  <Text color="#999" fontSize="sm" mt={2}>
                    Editorial consultation
                  </Text>
                </CardBody>
              </Card>

              <Card bg="white" borderRadius="12px" boxShadow="md" border="1px solid rgba(212, 175, 55, 0.2)">
                <CardBody textAlign="center" p={8}>
                  <Icon as={MapPin} boxSize={8} color="#D4AF37" mb={4} />
                  <Heading as="h3" fontSize="lg" fontFamily="'Playfair Display', serif" mb={3}>
                    Office
                  </Heading>
                  <Text color="#666" fontFamily="'Lato', sans-serif">
                    New York, NY
                  </Text>
                  <Text color="#999" fontSize="sm" mt={2}>
                    By appointment only
                  </Text>
                </CardBody>
              </Card>
            </SimpleGrid>

            <Divider maxW="4xl" />

            <VStack spacing={6}>
              <Heading
                as="h3"
                fontSize="2xl"
                fontFamily="'Playfair Display', serif"
                color="#1A1A1A"
                fontWeight="400"
              >
                Start Your Legacy Today
              </Heading>

              <HStack spacing={6} flexWrap="wrap" justify="center">
                <Link href="/nominate">
                  <Button
                    size="lg"
                    bg="#D4AF37"
                    color="white"
                    px={8}
                    py={6}
                    fontSize="lg"
                    fontWeight="600"
                    _hover={{
                      bg: "#B8941F",
                      transform: "translateY(-2px)"
                    }}
                  >
                    Begin Nomination
                  </Button>
                </Link>

                <Link href="/auth/signin">
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
                  >
                    Admin Access
                  </Button>
                </Link>
              </HStack>

              <Text
                fontSize="sm"
                color="#999"
                fontStyle="italic"
                fontFamily="'Lato', sans-serif"
                maxW="2xl"
                textAlign="center"
              >
                Icons Herald is an invitation-only platform dedicated to preserving the legacies
                of extraordinary individuals. All profiles are subject to editorial review and approval.
              </Text>
            </VStack>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}