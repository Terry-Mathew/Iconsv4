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
  profile: ProfileContentData & {
    id: string
    slug: string
    tier: string
    publishedAt?: string
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
    bio,
    quote,
    timeline = [],
    tributes = [],
    enduringContributions,
    sections = {}
  } = profile

  const biography = bio?.ai_polished || bio?.original || ''

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

        <Container maxW="6xl" py={20} position="relative" zIndex={1}>
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
          
          {tagline && (
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
          
          <Text
            fontSize="lg"
            lineHeight="1.8"
            color="#1A1A1A"
            fontFamily="'Lora', serif"
            maxW="4xl"
          >
            {biography}
          </Text>

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


        </VStack>
      </Container>
    </Box>

    <ProfileFooter tier="legacy" />
  </>
  )
}
