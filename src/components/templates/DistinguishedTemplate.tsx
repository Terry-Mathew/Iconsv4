'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Grid,
  GridItem,
  Card,
  CardBody,
  SimpleGrid,
  Image,
  Link,
  Icon,
  Divider,
  Avatar,
  Flex,
  Spacer
} from '@chakra-ui/react'
import { ExternalLink, Award, Users, Briefcase, Calendar, MapPin } from 'lucide-react'

interface DistinguishedTemplateProps {
  profile: {
    id?: string
    name: string
    tagline?: string
    heroImage?: string
    biography?: string
    bio?: {
      original?: string
      ai_polished?: string
    }
    currentRole?: string
    company?: string
    industry?: string
    yearsOfExperience?: number
    expertise?: string[]
    achievements?: Array<{
      title: string
      description: string
      year?: string
      category?: string
    }>
    leadership?: Array<{
      title: string
      organization: string
      duration: string
      description: string
    }>
    awards?: Array<{
      title: string
      organization: string
      year: number
      description?: string
    }>
    publications?: Array<{
      title: string
      publication: string
      year: number
      link?: string
      description?: string
    }>
    impactMetrics?: Array<{
      metric: string
      value: string
      description?: string
    }>
    gallery?: Array<{
      url: string
      caption?: string
    }>
    links?: Array<{
      title: string
      url: string
      type: string
    }>
    quote?: {
      text: string
      attribution?: string
    }
  }
}

export function DistinguishedTemplate({ profile }: DistinguishedTemplateProps) {
  const {
    name,
    tagline,
    heroImage,
    biography,
    bio,
    currentRole,
    company,
    industry,
    yearsOfExperience,
    expertise = [],
    achievements = [],
    leadership = [],
    awards = [],
    publications = [],
    impactMetrics = [],
    gallery = [],
    links = [],
    quote
  } = profile

  const displayBio = bio?.ai_polished || bio?.original || biography || ''
  const hasContent = (arr: any[]) => arr && arr.length > 0
  const hasText = (text: any) => text && text.trim().length > 0

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
      position="relative"
    >
      {/* Premium diamond pattern overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.1}
        backgroundImage="radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 2px, transparent 2px)"
        backgroundSize="80px 80px"
      />

      <Container maxW="7xl" py={20} position="relative" zIndex={1}>
        <VStack spacing={16} align="stretch">
          {/* Header Section */}
          <Grid templateColumns={{ base: "1fr", lg: "1fr 2fr" }} gap={12} alignItems="start">
            {/* Left Column - Profile Header */}
            <GridItem>
              <VStack spacing={8} align="start">
                <Badge
                  variant="solid"
                  fontSize="sm"
                  px={5}
                  py={2}
                  borderRadius="md"
                  bg="rgba(255, 255, 255, 0.2)"
                  color="white"
                  fontFamily="'Lora', serif"
                  fontWeight="600"
                  textTransform="uppercase"
                  letterSpacing="1px"
                  backdropFilter="blur(10px)"
                  border="1px solid rgba(255, 255, 255, 0.3)"
                >
                  💎 Distinguished Tier - Industry Leadership
                </Badge>

                {heroImage && (
                  <Avatar
                    size="2xl"
                    src={heroImage}
                    name={name}
                    border="4px solid #D4AF37"
                    shadow="xl"
                  />
                )}

                <Heading
                  as="h1"
                  fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
                  fontFamily="'Playfair Display', serif"
                  fontWeight="500"
                  lineHeight="1.1"
                  color="white"
                >
                  {name}
                </Heading>

                {hasText(tagline) && (
                  <Text
                    fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
                    fontFamily="'Lora', serif"
                    fontWeight="400"
                    maxW="4xl"
                    lineHeight="1.5"
                    color="#CBD5E1"
                  >
                    {tagline}
                  </Text>
                )}

                {/* Professional Details */}
                <VStack spacing={3} align="start">
                  {hasText(currentRole) && (
                    <HStack spacing={3}>
                      <Icon as={Briefcase} color="#D4AF37" />
                      <Text color="#E2E8F0" fontFamily="'Lora', serif">
                        {currentRole}
                        {hasText(company) && ` at ${company}`}
                      </Text>
                    </HStack>
                  )}

                  {hasText(industry) && (
                    <HStack spacing={3}>
                      <Icon as={MapPin} color="#D4AF37" />
                      <Text color="#E2E8F0" fontFamily="'Lora', serif">
                        {industry}
                      </Text>
                    </HStack>
                  )}

                  {yearsOfExperience && yearsOfExperience > 0 && (
                    <HStack spacing={3}>
                      <Icon as={Calendar} color="#D4AF37" />
                      <Text color="#E2E8F0" fontFamily="'Lora', serif">
                        {yearsOfExperience} years of experience
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </VStack>
            </GridItem>

            {/* Right Column - Biography */}
            <GridItem>
              <VStack spacing={8} align="start">
                {hasText(displayBio) && (
                  <Box>
                    <Heading
                      as="h2"
                      fontSize="2xl"
                      fontFamily="'Playfair Display', serif"
                      color="white"
                      mb={4}
                    >
                      Biography
                    </Heading>
                    <Text
                      fontSize="lg"
                      lineHeight="1.8"
                      color="#CBD5E1"
                      fontFamily="'Lora', serif"
                      dangerouslySetInnerHTML={{ __html: displayBio }}
                    />
                  </Box>
                )}

                {/* Quote Section */}
                {quote && hasText(quote.text) && (
                  <Box
                    p={6}
                    bg="rgba(255, 255, 255, 0.1)"
                    borderRadius="lg"
                    borderLeft="4px solid #D4AF37"
                    backdropFilter="blur(10px)"
                  >
                    <Text
                      fontSize="xl"
                      fontStyle="italic"
                      color="white"
                      fontFamily="'Playfair Display', serif"
                      lineHeight="1.6"
                    >
                      "{quote.text}"
                    </Text>
                    {hasText(quote.attribution) && (
                      <Text
                        fontSize="sm"
                        color="#CBD5E1"
                        mt={3}
                        fontFamily="'Lora', serif"
                      >
                        — {quote.attribution}
                      </Text>
                    )}
                  </Box>
                )}
              </VStack>
            </GridItem>
          </Grid>

          {/* Expertise Section */}
          {hasContent(expertise) && (
            <Box>
              <Heading
                as="h2"
                fontSize="3xl"
                fontFamily="'Playfair Display', serif"
                color="white"
                mb={8}
                textAlign="center"
              >
                Areas of Expertise
              </Heading>
              <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
                {expertise.map((skill, index) => (
                  <Card
                    key={index}
                    bg="rgba(255, 255, 255, 0.1)"
                    backdropFilter="blur(10px)"
                    border="1px solid rgba(212, 175, 55, 0.3)"
                    _hover={{
                      bg: "rgba(212, 175, 55, 0.1)",
                      transform: "translateY(-2px)",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <CardBody p={4} textAlign="center">
                      <Text
                        color="white"
                        fontFamily="'Lora', serif"
                        fontWeight="500"
                      >
                        {skill}
                      </Text>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* Achievements Section */}
          {hasContent(achievements) && (
            <Box>
              <Heading
                as="h2"
                fontSize="3xl"
                fontFamily="'Playfair Display', serif"
                color="white"
                mb={8}
                textAlign="center"
              >
                Key Achievements
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {achievements.map((achievement, index) => (
                  <Card
                    key={index}
                    bg="rgba(255, 255, 255, 0.1)"
                    backdropFilter="blur(10px)"
                    border="1px solid rgba(212, 175, 55, 0.3)"
                    _hover={{
                      bg: "rgba(212, 175, 55, 0.1)",
                      transform: "translateY(-4px)",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <CardBody p={6}>
                      <VStack spacing={4} align="start">
                        <HStack spacing={3} w="full">
                          <Icon as={Award} color="#D4AF37" size="20" />
                          <Heading
                            as="h3"
                            fontSize="xl"
                            fontFamily="'Playfair Display', serif"
                            color="white"
                            flex="1"
                          >
                            {achievement.title}
                          </Heading>
                          {achievement.year && (
                            <Badge
                              colorScheme="yellow"
                              variant="solid"
                              bg="#D4AF37"
                              color="black"
                            >
                              {achievement.year}
                            </Badge>
                          )}
                        </HStack>

                        {hasText(achievement.description) && (
                          <Text
                            color="#CBD5E1"
                            fontFamily="'Lora', serif"
                            lineHeight="1.6"
                          >
                            {achievement.description}
                          </Text>
                        )}

                        {achievement.category && (
                          <Badge
                            variant="outline"
                            colorScheme="blue"
                            borderColor="#6366F1"
                            color="#A5B4FC"
                          >
                            {achievement.category}
                          </Badge>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* Leadership Experience Section */}
          {hasContent(leadership) && (
            <Box>
              <Heading
                as="h2"
                fontSize="3xl"
                fontFamily="'Playfair Display', serif"
                color="white"
                mb={8}
                textAlign="center"
              >
                Leadership Experience
              </Heading>
              <VStack spacing={6}>
                {leadership.map((role, index) => (
                  <Card
                    key={index}
                    bg="rgba(255, 255, 255, 0.1)"
                    backdropFilter="blur(10px)"
                    border="1px solid rgba(212, 175, 55, 0.3)"
                    w="full"
                    _hover={{
                      bg: "rgba(212, 175, 55, 0.1)",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <CardBody p={6}>
                      <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={4}>
                        <VStack spacing={3} align="start">
                          <HStack spacing={3}>
                            <Icon as={Users} color="#D4AF37" />
                            <Heading
                              as="h3"
                              fontSize="xl"
                              fontFamily="'Playfair Display', serif"
                              color="white"
                            >
                              {role.title}
                            </Heading>
                          </HStack>

                          <Text
                            color="#D4AF37"
                            fontFamily="'Lora', serif"
                            fontWeight="600"
                          >
                            {role.organization}
                          </Text>

                          {hasText(role.description) && (
                            <Text
                              color="#CBD5E1"
                              fontFamily="'Lora', serif"
                              lineHeight="1.6"
                            >
                              {role.description}
                            </Text>
                          )}
                        </VStack>

                        <VStack spacing={2} align={{ base: "start", md: "end" }}>
                          <Badge
                            colorScheme="purple"
                            variant="solid"
                            bg="#8B5CF6"
                            color="white"
                          >
                            {role.duration}
                          </Badge>
                        </VStack>
                      </Grid>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </Box>
          )}

          {/* Awards Section */}
          {hasContent(awards) && (
            <Box>
              <Heading
                as="h2"
                fontSize="3xl"
                fontFamily="'Playfair Display', serif"
                color="white"
                mb={8}
                textAlign="center"
              >
                Awards & Recognition
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {awards.map((award, index) => (
                  <Card
                    key={index}
                    bg="rgba(255, 255, 255, 0.1)"
                    backdropFilter="blur(10px)"
                    border="1px solid rgba(212, 175, 55, 0.3)"
                    _hover={{
                      bg: "rgba(212, 175, 55, 0.1)",
                      transform: "translateY(-4px)",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <CardBody p={6}>
                      <VStack spacing={4} align="start">
                        <HStack spacing={3} w="full">
                          <Icon as={Award} color="#D4AF37" />
                          <Badge
                            colorScheme="yellow"
                            variant="solid"
                            bg="#D4AF37"
                            color="black"
                          >
                            {award.year}
                          </Badge>
                        </HStack>

                        <Heading
                          as="h3"
                          fontSize="lg"
                          fontFamily="'Playfair Display', serif"
                          color="white"
                          lineHeight="1.3"
                        >
                          {award.title}
                        </Heading>

                        <Text
                          color="#D4AF37"
                          fontFamily="'Lora', serif"
                          fontWeight="600"
                        >
                          {award.organization}
                        </Text>

                        {hasText(award.description) && (
                          <Text
                            color="#CBD5E1"
                            fontFamily="'Lora', serif"
                            lineHeight="1.6"
                            fontSize="sm"
                          >
                            {award.description}
                          </Text>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* Gallery Section */}
          {hasContent(gallery) && (
            <Box>
              <Heading
                as="h2"
                fontSize="3xl"
                fontFamily="'Playfair Display', serif"
                color="white"
                mb={8}
                textAlign="center"
              >
                Gallery
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {gallery.slice(0, 12).map((item, index) => (
                  <Card
                    key={index}
                    bg="rgba(255, 255, 255, 0.1)"
                    backdropFilter="blur(10px)"
                    border="1px solid rgba(212, 175, 55, 0.3)"
                    overflow="hidden"
                    _hover={{
                      transform: "scale(1.02)",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <Image
                      src={item.url}
                      alt={item.caption || `Gallery image ${index + 1}`}
                      objectFit="cover"
                      h="200px"
                      w="full"
                    />
                    {hasText(item.caption) && (
                      <CardBody p={4}>
                        <Text
                          color="#CBD5E1"
                          fontFamily="'Lora', serif"
                          fontSize="sm"
                          textAlign="center"
                        >
                          {item.caption}
                        </Text>
                      </CardBody>
                    )}
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* Links Section */}
          {hasContent(links) && (
            <Box>
              <Heading
                as="h2"
                fontSize="3xl"
                fontFamily="'Playfair Display', serif"
                color="white"
                mb={8}
                textAlign="center"
              >
                Connect & Learn More
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                {links.map((link, index) => (
                  <Link
                    key={index}
                    href={link.url}
                    isExternal
                    _hover={{ textDecoration: 'none' }}
                  >
                    <Card
                      bg="rgba(255, 255, 255, 0.1)"
                      backdropFilter="blur(10px)"
                      border="1px solid rgba(212, 175, 55, 0.3)"
                      _hover={{
                        bg: "rgba(212, 175, 55, 0.2)",
                        transform: "translateY(-2px)",
                        transition: "all 0.3s ease"
                      }}
                      cursor="pointer"
                    >
                      <CardBody p={4}>
                        <HStack spacing={3} justify="center">
                          <Icon as={ExternalLink} color="#D4AF37" />
                          <Text
                            color="white"
                            fontFamily="'Lora', serif"
                            fontWeight="500"
                            textAlign="center"
                          >
                            {link.title}
                          </Text>
                        </HStack>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  )
}