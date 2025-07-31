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
  IconButton,
  Collapse,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { useState } from 'react'
import Image from 'next/image'
import {
  Quote,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { ProfileContentData, shouldShowSection } from '@/lib/validations/profile'
import { ProfileFooter } from './ProfileFooter'

interface LegacyTemplateProps {
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
    legacy?: string
    era?: string
    primaryContributions?: string[]
    historicalImpact?: string
    achievements?: Array<{
      title: string
      description: string
      year?: string
      category?: string
    }>
    timeline?: Array<{
      year: number
      event: string
      significance: string
    }>
    quotes?: Array<{
      text: string
      context?: string
      year?: number
    }>
    recognitions?: Array<{
      title: string
      organization: string
      year: number
      significance: string
    }>
    influence?: Array<{
      area: string
      description: string
      continuingImpact: string
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
    quote?: {
      text: string
      attribution?: string
    }
    tributes?: any[]
    enduringContributions?: any
    sections?: any
  }
}

interface GalleryItem {
  url: string
  caption?: string
  year?: string
}

export function LegacyTemplate({ profile }: LegacyTemplateProps) {
  const [expandedTimelineItem, setExpandedTimelineItem] = useState<number | null>(null)
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    name,
    tagline,
    heroImage,
    biography,
    bio,
    legacy,
    era,
    primaryContributions = [],
    historicalImpact,
    achievements = [],
    timeline = [],
    quotes = [],
    recognitions = [],
    influence = [],
    gallery = [],
    links = [],
    quote,
    tributes = [],
    enduringContributions,
    sections = {}
  } = profile

  const displayBio = bio?.ai_polished || bio?.original || biography || ''
  const hasContent = (arr: any[]) => arr && arr.length > 0
  const hasText = (text: any) => text && text.trim().length > 0

  const toggleTimelineItem = (index: number) => {
    setExpandedTimelineItem(expandedTimelineItem === index ? null : index)
  }

  const handleGalleryItemClick = (item: GalleryItem) => {
    setSelectedGalleryItem(item)
    onOpen()
  }

  return (
    <>
      <Box
        minH="100vh"
        bg="linear-gradient(135deg, #F5F5DC 0%, #F0E68C 25%, #DDD8C0 50%, #C8C3A0 75%, #B8B08A 100%)"
        color="#2F1B14"
        position="relative"
        filter="sepia(0.15)"
      >
        {/* Classic paper texture overlay */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          opacity={0.1}
          backgroundImage="radial-gradient(circle at 25% 25%, #D4AF37 1px, transparent 1px), radial-gradient(circle at 75% 75%, #B8860B 1px, transparent 1px)"
          backgroundSize="40px 40px"
          backgroundPosition="0 0, 20px 20px"
        />

        <Container maxW="7xl" py={20} position="relative" zIndex={1}>
          <VStack spacing={16} align="stretch">
            {/* Header Section */}
            <VStack spacing={12} textAlign="center">
              <Badge
                variant="solid"
                fontSize="lg"
                px={8}
                py={4}
                borderRadius="none"
                bg="linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #CD853F 100%)"
                color="#FFF8DC"
                fontFamily="'Playfair Display', serif"
                fontWeight="700"
                textTransform="uppercase"
                letterSpacing="2px"
                boxShadow="inset 0 2px 4px rgba(0,0,0,0.3), 0 4px 20px rgba(139, 69, 19, 0.4)"
                border="2px solid #D4AF37"
              >
                👑 Legacy Tier - Forever Remembered
              </Badge>

              {heroImage && (
                <Box
                  position="relative"
                  borderRadius="full"
                  overflow="hidden"
                  border="6px solid #D4AF37"
                  shadow="2xl"
                  w="200px"
                  h="200px"
                >
                  <Image
                    src={heroImage}
                    alt={name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
              )}

              <Heading
                as="h1"
                fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
                fontFamily="'Playfair Display', serif"
                fontWeight="400"
                lineHeight="1.1"
                color="#1A1A1A"
              >
                {name}
              </Heading>

              {hasText(tagline) && (
                <Text
                  fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
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

              {hasText(era) && (
                <Badge
                  variant="outline"
                  fontSize="md"
                  px={4}
                  py={2}
                  borderColor="#8B4513"
                  color="#8B4513"
                  fontFamily="'Playfair Display', serif"
                  fontWeight="600"
                >
                  {era}
                </Badge>
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

            {/* Legacy Statement Section */}
            {hasText(legacy) && (
              <Box textAlign="center">
                <Heading
                  as="h2"
                  fontSize="3xl"
                  fontFamily="'Playfair Display', serif"
                  color="#1A1A1A"
                  mb={8}
                >
                  Legacy Statement
                </Heading>
                <Card
                  bg="rgba(139, 69, 19, 0.1)"
                  border="2px solid #8B4513"
                  borderRadius="xl"
                  maxW="4xl"
                  mx="auto"
                >
                  <CardBody p={8}>
                    <Text
                      fontSize="xl"
                      lineHeight="1.8"
                      color="#1A1A1A"
                      fontFamily="'Lora', serif"
                      fontStyle="italic"
                    >
                      {legacy}
                    </Text>
                  </CardBody>
                </Card>
              </Box>
            )}

            {/* Primary Contributions Section */}
            {hasContent(primaryContributions) && (
              <Box>
                <Heading
                  as="h2"
                  fontSize="3xl"
                  fontFamily="'Playfair Display', serif"
                  color="#1A1A1A"
                  mb={8}
                  textAlign="center"
                >
                  Primary Contributions
                </Heading>
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
                  {primaryContributions.map((contribution, index) => (
                    <Card
                      key={index}
                      bg="#F8F8F0"
                      border="1px solid #D4AF37"
                      borderRadius="lg"
                      _hover={{
                        transform: "translateY(-4px)",
                        shadow: "lg",
                        transition: "all 0.3s ease"
                      }}
                    >
                      <CardBody p={6} textAlign="center">
                        <Text
                          color="#1A1A1A"
                          fontFamily="'Lora', serif"
                          fontWeight="500"
                          lineHeight="1.6"
                        >
                          {contribution}
                        </Text>
                      </CardBody>
                    </Card>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Historical Impact Section */}
            {hasText(historicalImpact) && (
              <Box textAlign="center">
                <Heading
                  as="h2"
                  fontSize="3xl"
                  fontFamily="'Playfair Display', serif"
                  color="#1A1A1A"
                  mb={8}
                >
                  Historical Impact
                </Heading>
                <Card
                  bg="#F8F8F0"
                  border="1px solid #8B4513"
                  borderRadius="xl"
                  maxW="4xl"
                  mx="auto"
                >
                  <CardBody p={8}>
                    <Text
                      fontSize="lg"
                      lineHeight="1.8"
                      color="#1A1A1A"
                      fontFamily="'Lora', serif"
                    >
                      {historicalImpact}
                    </Text>
                  </CardBody>
                </Card>
              </Box>
            )}

          {/* Quote Block */}
          {quote && (
            <Card
              bg="#F8F8F0"
              border="1px solid #E2E8F0"
              borderRadius="xl"
              maxW="4xl"
              mx="auto"
              mt={12}
            >
              <CardBody p={8} textAlign="center">
                <VStack spacing={6}>
                  <Quote size={32} color="#8B7355" />
                  <Text
                    fontSize={{ base: 'xl', lg: '2xl' }}
                    fontFamily="'Lora', serif"
                    fontStyle="italic"
                    color="#1A1A1A"
                    lineHeight="1.6"
                  >
                    "{quote.text}"
                  </Text>
                  {quote.attribution && (
                    <Text
                      fontSize="md"
                      color="#6B6B6B"
                      fontFamily="'Playfair Display', serif"
                      fontWeight="400"
                    >
                      — {quote.attribution}
                    </Text>
                  )}
                </VStack>
              </CardBody>
            </Card>
          )}

          {/* Timeline Section */}
          {timeline.length > 0 && (
            <VStack spacing={8} w="full" maxW="4xl" mx="auto" mt={16}>
              <Heading
                as="h2"
                fontSize="2xl"
                fontFamily="'Playfair Display', serif"
                color="#1A1A1A"
                fontWeight="400"
                textAlign="center"
              >
                Legacy Timeline
              </Heading>

              <VStack spacing={4} w="full">
                {timeline.map((event, index) => (
                  <Card
                    key={index}
                    w="full"
                    bg="#FAFAFA"
                    border="1px solid #E2E8F0"
                    borderRadius="lg"
                    _hover={{
                      borderColor: '#8B7355',
                      boxShadow: 'md'
                    }}
                    transition="all 0.3s ease"
                  >
                    <CardBody p={6}>
                      <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={3} flex={1}>
                          <HStack spacing={3}>
                            <Badge
                              colorScheme="orange"
                              variant="subtle"
                              fontSize="sm"
                              px={3}
                              py={1}
                              borderRadius="full"
                              bg="#8B7355"
                              color="white"
                            >
                              {event.year}
                            </Badge>
                          </HStack>

                          <Text
                            fontSize="md"
                            color="#4A5568"
                            fontFamily="'Lora', serif"
                            lineHeight="1.6"
                          >
                            {event.event}
                          </Text>

                          <Collapse in={expandedTimelineItem === index}>
                            <Box
                              mt={3}
                              p={3}
                              bg="#F0F0F0"
                              borderRadius="md"
                              borderLeft="3px solid #8B7355"
                            >
                              <Text
                                fontSize="sm"
                                color="#2D3748"
                                fontFamily="'Lora', serif"
                                fontStyle="italic"
                              >
                                <strong>Significance:</strong> {event.significance}
                              </Text>
                            </Box>
                          </Collapse>
                        </VStack>

                        <IconButton
                          aria-label={expandedTimelineItem === index ? "Collapse details" : "Expand details"}
                          icon={expandedTimelineItem === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          size="sm"
                          variant="ghost"
                          color="#8B7355"
                          onClick={() => toggleTimelineItem(index)}
                        />
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </VStack>
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
                Notable Achievements
              </Heading>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                {achievements.map((achievement, index) => (
                  <Card
                    key={index}
                    bg="#F8F8F0"
                    border="1px solid #D4AF37"
                    borderRadius="lg"
                    _hover={{
                      transform: "translateY(-4px)",
                      shadow: "lg",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <CardBody p={6}>
                      <VStack spacing={4} align="start">
                        <HStack spacing={3} w="full">
                          <Heading
                            as="h3"
                            fontSize="lg"
                            fontFamily="'Playfair Display', serif"
                            color="#1A1A1A"
                            flex="1"
                          >
                            {achievement.title}
                          </Heading>
                          {achievement.year && (
                            <Badge
                              colorScheme="orange"
                              variant="solid"
                              bg="#8B4513"
                              color="#FFF8DC"
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
                            fontSize="sm"
                          >
                            {achievement.description}
                          </Text>
                        )}

                        {achievement.category && (
                          <Badge
                            variant="outline"
                            borderColor="#8B4513"
                            color="#8B4513"
                          >
                            {achievement.category}
                          </Badge>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </Grid>
            </Box>
          )}

          {/* Recognitions Section */}
          {hasContent(recognitions) && (
            <Box>
              <Heading
                as="h2"
                fontSize="3xl"
                fontFamily="'Playfair Display', serif"
                color="#1A1A1A"
                mb={8}
                textAlign="center"
              >
                Honors & Recognition
              </Heading>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
                {recognitions.map((recognition, index) => (
                  <Card
                    key={index}
                    bg="#F8F8F0"
                    border="1px solid #8B4513"
                    borderRadius="lg"
                    _hover={{
                      transform: "translateY(-4px)",
                      shadow: "lg",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <CardBody p={6}>
                      <VStack spacing={3} align="start">
                        <HStack spacing={3} w="full">
                          <Badge
                            colorScheme="orange"
                            variant="solid"
                            bg="#8B4513"
                            color="#FFF8DC"
                          >
                            {recognition.year}
                          </Badge>
                        </HStack>

                        <Heading
                          as="h3"
                          fontSize="md"
                          fontFamily="'Playfair Display', serif"
                          color="#1A1A1A"
                        >
                          {recognition.title}
                        </Heading>

                        <Text
                          color="#8B4513"
                          fontFamily="'Lora', serif"
                          fontWeight="600"
                          fontSize="sm"
                        >
                          {recognition.organization}
                        </Text>

                        {hasText(recognition.significance) && (
                          <Text
                            color="#2D3748"
                            fontFamily="'Lora', serif"
                            lineHeight="1.6"
                            fontSize="sm"
                          >
                            {recognition.significance}
                          </Text>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </Grid>
            </Box>
          )}

          {/* Influence & Impact Section */}
          {hasContent(influence) && (
            <Box>
              <Heading
                as="h2"
                fontSize="3xl"
                fontFamily="'Playfair Display', serif"
                color="#1A1A1A"
                mb={8}
                textAlign="center"
              >
                Lasting Influence
              </Heading>
              <VStack spacing={6}>
                {influence.map((impact, index) => (
                  <Card
                    key={index}
                    bg="#F8F8F0"
                    border="1px solid #D4AF37"
                    borderRadius="lg"
                    w="full"
                    maxW="4xl"
                    mx="auto"
                  >
                    <CardBody p={6}>
                      <VStack spacing={4} align="start">
                        <Heading
                          as="h3"
                          fontSize="xl"
                          fontFamily="'Playfair Display', serif"
                          color="#1A1A1A"
                        >
                          {impact.area}
                        </Heading>

                        <Text
                          color="#2D3748"
                          fontFamily="'Lora', serif"
                          lineHeight="1.6"
                        >
                          {impact.description}
                        </Text>

                        <Box
                          p={4}
                          bg="rgba(139, 69, 19, 0.1)"
                          borderRadius="md"
                          borderLeft="3px solid #8B4513"
                          w="full"
                        >
                          <Text
                            color="#1A1A1A"
                            fontFamily="'Lora', serif"
                            fontStyle="italic"
                            fontSize="sm"
                          >
                            <strong>Continuing Impact:</strong> {impact.continuingImpact}
                          </Text>
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </Box>
          )}

          {/* Additional Quotes Section */}
          {hasContent(quotes) && (
            <Box>
              <Heading
                as="h2"
                fontSize="3xl"
                fontFamily="'Playfair Display', serif"
                color="#1A1A1A"
                mb={8}
                textAlign="center"
              >
                Memorable Quotes
              </Heading>
              <VStack spacing={6}>
                {quotes.map((quoteItem, index) => (
                  <Card
                    key={index}
                    bg="#F8F8F0"
                    border="1px solid #8B4513"
                    borderRadius="xl"
                    maxW="4xl"
                    mx="auto"
                  >
                    <CardBody p={8} textAlign="center">
                      <VStack spacing={4}>
                        <Quote size={24} color="#8B7355" />
                        <Text
                          fontSize="lg"
                          fontFamily="'Lora', serif"
                          fontStyle="italic"
                          color="#1A1A1A"
                          lineHeight="1.6"
                        >
                          "{quoteItem.text}"
                        </Text>
                        {(quoteItem.context || quoteItem.year) && (
                          <Text
                            fontSize="sm"
                            color="#6B6B6B"
                            fontFamily="'Playfair Display', serif"
                          >
                            {quoteItem.context && `— ${quoteItem.context}`}
                            {quoteItem.year && ` (${quoteItem.year})`}
                          </Text>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
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
                Historical Gallery
              </Heading>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
                {gallery.slice(0, 12).map((item, index) => (
                  <Card
                    key={index}
                    bg="#F8F8F0"
                    border="1px solid #D4AF37"
                    borderRadius="lg"
                    overflow="hidden"
                    _hover={{
                      transform: "scale(1.02)",
                      transition: "all 0.3s ease",
                      cursor: "pointer"
                    }}
                    onClick={() => handleGalleryItemClick(item)}
                  >
                    <Box position="relative" h="200px">
                      <Image
                        src={item.url}
                        alt={item.caption || `Gallery image ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>
                    {hasText(item.caption) && (
                      <CardBody p={4}>
                        <Text
                          color="#2D3748"
                          fontFamily="'Lora', serif"
                          fontSize="sm"
                          textAlign="center"
                          lineHeight="1.4"
                        >
                          {item.caption}
                        </Text>
                      </CardBody>
                    )}
                  </Card>
                ))}
              </Grid>
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
                Learn More
              </Heading>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
                {links.map((link, index) => (
                  <Card
                    key={index}
                    as="a"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    bg="#F8F8F0"
                    border="1px solid #8B4513"
                    borderRadius="lg"
                    _hover={{
                      bg: "rgba(139, 69, 19, 0.1)",
                      transform: "translateY(-2px)",
                      transition: "all 0.3s ease",
                      textDecoration: "none"
                    }}
                    cursor="pointer"
                  >
                    <CardBody p={4}>
                      <HStack spacing={3} justify="center">
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
                ))}
              </Grid>
            </Box>
          )}

        </VStack>
      </Container>
    </Box>

    {/* Gallery Modal */}
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontFamily="'Playfair Display', serif">
          {selectedGalleryItem?.caption || 'Gallery Image'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {selectedGalleryItem && (
            <Box position="relative" h="400px" w="full">
              <Image
                src={selectedGalleryItem.url}
                alt={selectedGalleryItem.caption || 'Gallery image'}
                fill
                style={{ objectFit: 'contain' }}
              />
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>

    <ProfileFooter tier="legacy" />
  </>
  )
}
