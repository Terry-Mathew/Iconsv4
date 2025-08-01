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
  Avatar,
  Flex,
  Wrap,
  WrapItem
} from '@chakra-ui/react'
import { ExternalLink, Star, Target, Briefcase, Building, Code, Lightbulb } from 'lucide-react'

interface RisingTemplateProps {
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
  }
}

export function RisingTemplate({ profile }: RisingTemplateProps) {
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
    links = []
  } = profile

  const displayBio = bio?.ai_polished || bio?.original || biography || ''
  const hasContent = (arr: any[]) => arr && arr.length > 0
  const hasText = (text: any) => text && text.trim().length > 0

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #FFFEF7 0%, #FFF8E1 50%, #F4E4BC 100%)"
      position="relative"
      overflow="hidden"
    >
      {/* Energetic background pattern */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.05}
        backgroundImage="radial-gradient(circle at 25% 25%, #D4AF37 2px, transparent 2px), radial-gradient(circle at 75% 75%, #D4AF37 2px, transparent 2px)"
        backgroundSize="50px 50px"
        backgroundPosition="0 0, 25px 25px"
      />

      <Container maxW="7xl" py={20} position="relative" zIndex={1}>
        <VStack spacing={16} align="stretch">
          {/* Header Section */}
          <VStack spacing={12} textAlign="center">
            <Badge
              variant="solid"
              fontSize="md"
              px={6}
              py={3}
              borderRadius="full"
              bg="linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)"
              color="white"
              fontFamily="'Lora', serif"
              fontWeight="600"
              textTransform="uppercase"
              letterSpacing="0.5px"
              boxShadow="0 4px 15px rgba(212, 175, 55, 0.3)"
            >
              🌟 Rising Tier - Ascending to Greatness
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
              fontWeight="400"
              lineHeight="1.1"
              color="#1A1A1A"
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
                color="#2D3748"
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
                    <Icon as={Briefcase} color="#D4AF37" />
                    <Text color="#2D3748" fontFamily="'Lora', serif" fontSize="lg">
                      {currentRole}
                      {hasText(company) && ` at ${company}`}
                    </Text>
                  </HStack>
                )}
              </VStack>
            )}

            {hasText(displayBio) && (
              <Text
                fontSize="lg"
                lineHeight="1.8"
                color="#1A1A1A"
                fontFamily="'Lora', serif"
                maxW="4xl"
                dangerouslySetInnerHTML={{ __html: displayBio }}
              />
            )}
          </VStack>

          {/* Skills Section */}
          {hasContent(skills) && (
            <Box>
              <Heading
                as="h2"
                fontSize="3xl"
                fontFamily="'Playfair Display', serif"
                color="#1A1A1A"
                mb={8}
                textAlign="center"
              >
                Skills & Expertise
              </Heading>
              <Wrap spacing={4} justify="center">
                {skills.map((skill, index) => (
                  <WrapItem key={index}>
                    <Badge
                      variant="solid"
                      bg="#D4AF37"
                      color="white"
                      px={4}
                      py={2}
                      borderRadius="full"
                      fontFamily="'Lora', serif"
                      fontWeight="500"
                      fontSize="sm"
                      _hover={{
                        bg: "#B8941F",
                        transform: "translateY(-2px)",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {skill}
                    </Badge>
                  </WrapItem>
                ))}
              </Wrap>
            </Box>
          )}

          {/* Aspirations Section */}
          {hasText(aspirations) && (
            <Box textAlign="center">
              <Heading
                as="h2"
                fontSize="3xl"
                fontFamily="'Playfair Display', serif"
                color="#1A1A1A"
                mb={8}
              >
                Vision & Aspirations
              </Heading>
              <Card
                bg="rgba(212, 175, 55, 0.1)"
                border="2px solid #D4AF37"
                borderRadius="xl"
                maxW="4xl"
                mx="auto"
              >
                <CardBody p={8}>
                  <HStack spacing={4} justify="center" mb={4}>
                    <Icon as={Target} color="#D4AF37" size="24" />
                    <Icon as={Lightbulb} color="#D4AF37" size="24" />
                  </HStack>
                  <Text
                    fontSize="lg"
                    lineHeight="1.8"
                    color="#1A1A1A"
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
                color="#1A1A1A"
                mb={8}
                textAlign="center"
              >
                Key Achievements
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {achievements.map((achievement, index) => (
                  <Card
                    key={index}
                    bg="white"
                    border="2px solid #D4AF37"
                    borderRadius="xl"
                    _hover={{
                      transform: "translateY(-4px)",
                      shadow: "xl",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <CardBody p={6}>
                      <VStack spacing={4} align="start">
                        <HStack spacing={3} w="full">
                          <Icon as={Star} color="#D4AF37" size="20" />
                          <Heading
                            as="h3"
                            fontSize="xl"
                            fontFamily="'Playfair Display', serif"
                            color="#1A1A1A"
                            flex="1"
                          >
                            {achievement.title}
                          </Heading>
                          {achievement.year && (
                            <Badge
                              colorScheme="yellow"
                              variant="solid"
                              bg="#D4AF37"
                              color="white"
                            >
                              {achievement.year}
                            </Badge>
                          )}
                        </HStack>

                        {hasText(achievement.description) && (
                          <Text
                            color="#2D3748"
                            fontFamily="'Lora', serif"
                            lineHeight="1.6"
                          >
                            {achievement.description}
                          </Text>
                        )}

                        {achievement.category && (
                          <Badge
                            variant="outline"
                            colorScheme="orange"
                            borderColor="#D4AF37"
                            color="#B8941F"
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

          {/* Projects Section */}
          {hasContent(projects) && (
            <Box>
              <Heading
                as="h2"
                fontSize="3xl"
                fontFamily="'Playfair Display', serif"
                color="#1A1A1A"
                mb={8}
                textAlign="center"
              >
                Featured Projects
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {projects.map((project, index) => (
                  <Card
                    key={index}
                    bg="white"
                    border="2px solid #D4AF37"
                    borderRadius="xl"
                    overflow="hidden"
                    _hover={{
                      transform: "translateY(-4px)",
                      shadow: "xl",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {project.image && (
                      <Image
                        src={project.image}
                        alt={project.title}
                        objectFit="cover"
                        h="200px"
                        w="full"
                      />
                    )}
                    <CardBody p={6}>
                      <VStack spacing={4} align="start">
                        <HStack spacing={3} w="full">
                          <Icon as={Code} color="#D4AF37" />
                          <Heading
                            as="h3"
                            fontSize="lg"
                            fontFamily="'Playfair Display', serif"
                            color="#1A1A1A"
                            flex="1"
                          >
                            {project.title}
                          </Heading>
                        </HStack>

                        {hasText(project.description) && (
                          <Text
                            color="#2D3748"
                            fontFamily="'Lora', serif"
                            lineHeight="1.6"
                            fontSize="sm"
                          >
                            {project.description}
                          </Text>
                        )}

                        {project.link && (
                          <Link
                            href={project.link}
                            isExternal
                            color="#D4AF37"
                            fontFamily="'Lora', serif"
                            fontWeight="600"
                            _hover={{ color: "#B8941F" }}
                          >
                            <HStack spacing={2}>
                              <Text>View Project</Text>
                              <Icon as={ExternalLink} size="16" />
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

          {/* Gallery Section */}
          {hasContent(gallery) && (
            <Box>
              <Heading
                as="h2"
                fontSize="3xl"
                fontFamily="'Playfair Display', serif"
                color="#1A1A1A"
                mb={8}
                textAlign="center"
              >
                Gallery
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {gallery.slice(0, 9).map((item, index) => (
                  <Card
                    key={index}
                    bg="white"
                    border="2px solid #D4AF37"
                    borderRadius="xl"
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
                          color="#2D3748"
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
                color="#1A1A1A"
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
                      bg="white"
                      border="2px solid #D4AF37"
                      borderRadius="xl"
                      _hover={{
                        bg: "rgba(212, 175, 55, 0.1)",
                        transform: "translateY(-2px)",
                        transition: "all 0.3s ease"
                      }}
                      cursor="pointer"
                    >
                      <CardBody p={4}>
                        <HStack spacing={3} justify="center">
                          <Icon as={ExternalLink} color="#D4AF37" />
                          <Text
                            color="#1A1A1A"
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