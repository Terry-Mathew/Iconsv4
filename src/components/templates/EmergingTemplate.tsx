'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
  GridItem,
  Card,
  CardBody,
  Badge,
  Avatar,
  SimpleGrid,
  Icon,
  Link
} from '@chakra-ui/react'
import Image from 'next/image'
import {
  Briefcase,
  MapPin,
  Star,
  ExternalLink,
  Award,
  Target,
  Lightbulb
} from 'lucide-react'
import { ProfileFooter } from './ProfileFooter'

interface EmergingTemplateProps {
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
    skills?: string[]
    aspirations?: string
    achievements?: Array<{
      title: string
      description: string
      year?: string
      category?: string
    }>
    projects?: Array<{
      title: string
      description: string
      link?: string
      image?: string
    }>
    gallery?: Array<{
      url: string
      caption?: string
      type?: string
    }>
    links?: Array<{
      title: string
      url: string
      type: string
    }>
    certifications?: Array<{
      title: string
      organization: string
      year: number
      link?: string
    }>
    videoLinks?: Array<{
      title: string
      url: string
      platform: 'youtube' | 'vimeo' | 'other'
    }>
  }
}

export function EmergingTemplate({ profile }: EmergingTemplateProps) {
  const {
    name,
    tagline,
    heroImage,
    biography,
    bio,
    currentRole,
    company,
    skills = [],
    aspirations,
    achievements = [],
    projects = [],
    gallery = [],
    links = [],
    certifications = [],
    videoLinks = []
  } = profile

  const displayBio = bio?.ai_polished || bio?.original || biography || ''
  const hasContent = (arr: any[]) => arr && arr.length > 0
  const hasText = (text: any) => text && text.trim().length > 0

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      position="relative"
      overflow="hidden"
    >
      {/* Modern geometric pattern */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.1}
        backgroundImage="radial-gradient(circle at 20% 20%, white 2px, transparent 2px), radial-gradient(circle at 80% 80%, white 2px, transparent 2px)"
        backgroundSize="60px 60px"
        backgroundPosition="0 0, 30px 30px"
      />

      <Container maxW="6xl" py={20} position="relative" zIndex={1}>
        <VStack spacing={16} align="stretch">
          {/* Header Section */}
          <VStack spacing={12} textAlign="center">
            <Badge
              variant="solid"
              fontSize="md"
              px={6}
              py={3}
              borderRadius="full"
              bg="rgba(255, 255, 255, 0.2)"
              color="white"
              fontFamily="'Lora', serif"
              fontWeight="600"
              textTransform="uppercase"
              letterSpacing="0.5px"
              backdropFilter="blur(10px)"
              border="1px solid rgba(255, 255, 255, 0.3)"
            >
              ⭐ Emerging Tier - Rising Potential
            </Badge>

            {heroImage && (
              <Avatar
                size="2xl"
                src={heroImage}
                name={name}
                border="4px solid white"
                shadow="xl"
              />
            )}

            <Heading
              as="h1"
              fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
              fontFamily="'Playfair Display', serif"
              fontWeight="400"
              lineHeight="1.1"
              color="white"
              textShadow="0 2px 4px rgba(0,0,0,0.3)"
            >
              {name}
            </Heading>

            {hasText(tagline) && (
              <Text
                fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
                fontFamily="'Lora', serif"
                fontWeight="300"
                maxW="4xl"
                lineHeight="1.5"
                color="rgba(255, 255, 255, 0.9)"
                fontStyle="italic"
              >
                {tagline}
              </Text>
            )}

            {/* Professional Details */}
            {(hasText(currentRole) || hasText(company)) && (
              <VStack spacing={2}>
                {hasText(currentRole) && (
                  <HStack spacing={3}>
                    <Icon as={Briefcase} color="white" />
                    <Text color="white" fontFamily="'Lora', serif" fontSize="lg">
                      {currentRole}
                      {hasText(company) && ` at ${company}`}
                    </Text>
                  </HStack>
                )}
              </VStack>
            )}
          </VStack>

          {/* Biography Section */}
          {hasText(displayBio) && (
            <Card
              bg="rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(10px)"
              border="1px solid rgba(255, 255, 255, 0.2)"
              borderRadius="xl"
            >
              <CardBody p={8}>
                <Text
                  fontSize="lg"
                  lineHeight="1.8"
                  color="white"
                  fontFamily="'Lora', serif"
                  textAlign="center"
                >
                  {displayBio}
                </Text>
              </CardBody>
            </Card>
          )}

          {/* Skills Section */}
          {hasContent(skills) && (
            <Box>
              <Heading
                as="h2"
                fontSize="3xl"
                fontFamily="'Playfair Display', serif"
                color="white"
                mb={8}
                textAlign="center"
              >
                Core Skills
              </Heading>
              <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
                {skills.map((skill, index) => (
                  <Card
                    key={index}
                    bg="rgba(255, 255, 255, 0.15)"
                    backdropFilter="blur(10px)"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    _hover={{
                      bg: "rgba(255, 255, 255, 0.25)",
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

          {/* Aspirations Section */}
          {hasText(aspirations) && (
            <Box textAlign="center">
              <Heading
                as="h2"
                fontSize="3xl"
                fontFamily="'Playfair Display', serif"
                color="white"
                mb={8}
              >
                Vision & Aspirations
              </Heading>
              <Card
                bg="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(10px)"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="xl"
                maxW="4xl"
                mx="auto"
              >
                <CardBody p={8}>
                  <HStack justify="center" mb={4}>
                    <Icon as={Target} color="white" size={24} />
                  </HStack>
                  <Text
                    fontSize="lg"
                    lineHeight="1.8"
                    color="white"
                    fontFamily="'Lora', serif"
                    fontStyle="italic"
                  >
                    {aspirations}
                  </Text>
                </CardBody>
              </Card>
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
                {achievements.slice(0, 4).map((achievement, index) => (
                  <Card
                    key={index}
                    bg="rgba(255, 255, 255, 0.1)"
                    backdropFilter="blur(10px)"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    borderRadius="xl"
                    _hover={{
                      bg: "rgba(255, 255, 255, 0.15)",
                      transform: "translateY(-2px)",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <CardBody p={6}>
                      <VStack align="start" spacing={3}>
                        <HStack spacing={3}>
                          <Icon as={Award} color="white" />
                          <Text
                            fontSize="lg"
                            fontWeight="600"
                            color="white"
                            fontFamily="'Playfair Display', serif"
                          >
                            {achievement.title}
                          </Text>
                        </HStack>
                        <Text
                          fontSize="md"
                          color="rgba(255, 255, 255, 0.9)"
                          fontFamily="'Lora', serif"
                          lineHeight="1.6"
                        >
                          {achievement.description}
                        </Text>
                        {achievement.year && (
                          <Badge
                            colorScheme="whiteAlpha"
                            variant="subtle"
                            fontSize="xs"
                          >
                            {achievement.year}
                          </Badge>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* Projects Section */}
          {hasContent(projects) && (
            <Box>
              <Heading
                as="h2"
                fontSize="3xl"
                fontFamily="'Playfair Display', serif"
                color="white"
                mb={8}
                textAlign="center"
              >
                Featured Projects
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {projects.slice(0, 4).map((project, index) => (
                  <Card
                    key={index}
                    bg="rgba(255, 255, 255, 0.1)"
                    backdropFilter="blur(10px)"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    borderRadius="xl"
                    _hover={{
                      bg: "rgba(255, 255, 255, 0.15)",
                      transform: "translateY(-2px)",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <CardBody p={6}>
                      <VStack align="start" spacing={3}>
                        <HStack spacing={3}>
                          <Icon as={Lightbulb} color="white" />
                          <Text
                            fontSize="lg"
                            fontWeight="600"
                            color="white"
                            fontFamily="'Playfair Display', serif"
                          >
                            {project.title}
                          </Text>
                        </HStack>
                        <Text
                          fontSize="md"
                          color="rgba(255, 255, 255, 0.9)"
                          fontFamily="'Lora', serif"
                          lineHeight="1.6"
                        >
                          {project.description}
                        </Text>
                        {project.link && (
                          <Link
                            href={project.link}
                            isExternal
                            color="white"
                            _hover={{ textDecoration: 'underline' }}
                          >
                            <HStack spacing={2}>
                              <Text fontSize="sm">View Project</Text>
                              <Icon as={ExternalLink} size={14} />
                            </HStack>
                          </Link>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* Gallery Section - Limited to 4 photos for Emerging tier */}
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
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                {gallery.slice(0, 4).map((item, index) => (
                  <Card
                    key={index}
                    bg="rgba(255, 255, 255, 0.1)"
                    backdropFilter="blur(10px)"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    borderRadius="xl"
                    overflow="hidden"
                    _hover={{
                      transform: "scale(1.05)",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <Box position="relative" h="200px">
                      <Image
                        src={item.url}
                        alt={item.caption || `Gallery image ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>
                    {item.caption && (
                      <CardBody p={3}>
                        <Text
                          fontSize="sm"
                          color="white"
                          fontFamily="'Lora', serif"
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
                      border="1px solid rgba(255, 255, 255, 0.2)"
                      borderRadius="xl"
                      _hover={{
                        bg: "rgba(255, 255, 255, 0.2)",
                        transform: "translateY(-2px)",
                        transition: "all 0.3s ease"
                      }}
                    >
                      <CardBody p={4} textAlign="center">
                        <VStack spacing={2}>
                          <Icon as={ExternalLink} color="white" size={20} />
                          <Text
                            color="white"
                            fontFamily="'Lora', serif"
                            fontWeight="500"
                            fontSize="sm"
                          >
                            {link.title}
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  </Link>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </VStack>
      </Container>

      <ProfileFooter tier="emerging" />
    </Box>
  )
}
