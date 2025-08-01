'use client'

import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
  IconButton,
  Badge,
  SimpleGrid,
  useDisclosure,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Link as LinkIcon, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink,
  Globe,
  Linkedin,
  Twitter,
  Camera,
  Image as ImageIcon,
} from 'lucide-react'
import { useState } from 'react'
import { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { LinkModal } from '../modals/LinkModal'

const MotionBox = motion.create(Box)
const MotionCard = motion.create(Card)

interface Link {
  title: string
  url: string
  type: 'website' | 'linkedin' | 'twitter' | 'other'
}

interface LinksMediaStepProps {
  setValue: UseFormSetValue<any>
  watch: UseFormWatch<any>
  onNext: () => void
  onPrevious: () => void
  selectedTier: string
}

// Tier-specific limits
const TIER_LIMITS = {
  emerging: { links: 3, gallery: 0 },
  accomplished: { links: 5, gallery: 4 },
  distinguished: { links: 8, gallery: 10 },
  legacy: { links: 15, gallery: 25 },
} as const

export function LinksMediaStep({
  setValue,
  watch,
  onNext,
  onPrevious,
  selectedTier,
}: LinksMediaStepProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const links = watch('links') || []
  const gallery = watch('gallery') || []

  const tierLimits = TIER_LIMITS[selectedTier as keyof typeof TIER_LIMITS] || TIER_LIMITS.emerging
  const canAddMoreLinks = links.length < tierLimits.links
  const canAddMoreGallery = gallery.length < tierLimits.gallery
  const isGalleryAvailable = tierLimits.gallery > 0

  const handleAddLink = (link: Link) => {
    if (editingIndex !== null) {
      const updatedLinks = [...links]
      updatedLinks[editingIndex] = link
      setValue('links', updatedLinks)
      setEditingIndex(null)
    } else {
      if (canAddMoreLinks) {
        setValue('links', [...links, link])
      }
    }
    onClose()
  }

  const handleEditLink = (index: number) => {
    setEditingIndex(index)
    onOpen()
  }

  const handleDeleteLink = (index: number) => {
    const updatedLinks = links.filter((_: any, i: number) => i !== index)
    setValue('links', updatedLinks)
  }

  const openAddModal = () => {
    if (canAddMoreLinks) {
      setEditingIndex(null)
      onOpen()
    }
  }

  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'linkedin':
        return <Linkedin size={16} />
      case 'twitter':
        return <Twitter size={16} />
      case 'website':
        return <Globe size={16} />
      default:
        return <LinkIcon size={16} />
    }
  }

  const getLinkColor = (type: string) => {
    switch (type) {
      case 'linkedin':
        return 'linkedin'
      case 'twitter':
        return 'twitter'
      case 'website':
        return 'blue'
      default:
        return 'gray'
    }
  }

  // Validation: At least 1 link is recommended for all tiers
  const isValid = links.length > 0

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <MotionBox
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      maxW="4xl"
      mx="auto"
      px={6}
      py={8}
    >
      <VStack spacing={8}>
        {/* Header */}
        <MotionBox variants={itemVariants} textAlign="center">
          <Heading
            as="h2"
            fontSize={{ base: '2xl', md: '3xl' }}
            fontFamily="'Playfair Display', serif"
            color="#1A1A1A"
            mb={2}
          >
            Links & Media
          </Heading>
          <Text color="#8B8680" fontSize="lg" maxW="600px">
            Add your social profiles, websites, and media gallery
          </Text>
          <Text color="#D4AF37" fontSize="sm" mt={2}>
            Links: {links.length}/{tierLimits.links} • Gallery: {gallery.length}/{tierLimits.gallery}
          </Text>
        </MotionBox>

        {/* Tabs for Links and Media */}
        <MotionBox variants={itemVariants} w="full">
          <Tabs colorScheme="yellow" variant="enclosed">
            <TabList>
              <Tab>
                <HStack>
                  <LinkIcon size={16} />
                  <Text>Social Links</Text>
                  {links.length > 0 && (
                    <Badge colorScheme="green" size="sm">
                      {links.length}
                    </Badge>
                  )}
                </HStack>
              </Tab>
              <Tab>
                <HStack>
                  <Camera size={16} />
                  <Text>Media Gallery</Text>
                  {gallery.length > 0 && (
                    <Badge colorScheme="green" size="sm">
                      {gallery.length}
                    </Badge>
                  )}
                </HStack>
              </Tab>
            </TabList>

            <TabPanels>
              {/* Links Tab */}
              <TabPanel px={0} py={6}>
                <VStack spacing={6}>
                  {/* Add Link Button */}
                  <Button
                    leftIcon={<Plus size={20} />}
                    onClick={openAddModal}
                    size="lg"
                    bg={canAddMoreLinks ? "#D4AF37" : "gray.400"}
                    color="white"
                    _hover={{ bg: canAddMoreLinks ? '#B8941F' : 'gray.400' }}
                    w="full"
                    isDisabled={!canAddMoreLinks}
                  >
                    {canAddMoreLinks ? 'Add Social Link' : `Maximum ${tierLimits.links} links reached`}
                  </Button>

                  {/* Links List */}
                  {links.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                      <AnimatePresence>
                        {links.map((link: Link, index: number) => (
                          <MotionCard
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                            border="1px solid #E8E0D0"
                            _hover={{ shadow: 'md', borderColor: '#D4AF37' }}
                          >
                            <CardBody p={4}>
                              <VStack spacing={3} align="start">
                                <HStack justify="space-between" w="full">
                                  <HStack>
                                    {getLinkIcon(link.type)}
                                    <Badge colorScheme={getLinkColor(link.type)} size="sm">
                                      {link.type}
                                    </Badge>
                                  </HStack>
                                  <HStack spacing={1}>
                                    <IconButton
                                      aria-label="Edit link"
                                      icon={<Edit3 size={14} />}
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleEditLink(index)}
                                    />
                                    <IconButton
                                      aria-label="Delete link"
                                      icon={<Trash2 size={14} />}
                                      size="sm"
                                      variant="ghost"
                                      colorScheme="red"
                                      onClick={() => handleDeleteLink(index)}
                                    />
                                  </HStack>
                                </HStack>

                                <VStack spacing={2} align="start" w="full">
                                  <Text
                                    fontSize="md"
                                    fontWeight="600"
                                    color="#1A1A1A"
                                  >
                                    {link.title}
                                  </Text>
                                  
                                  <HStack spacing={2}>
                                    <ExternalLink size={14} color="#8B8680" />
                                    <Text
                                      fontSize="sm"
                                      color="#8B8680"
                                      noOfLines={1}
                                      flex={1}
                                    >
                                      {link.url}
                                    </Text>
                                  </HStack>
                                </VStack>
                              </VStack>
                            </CardBody>
                          </MotionCard>
                        ))}
                      </AnimatePresence>
                    </SimpleGrid>
                  ) : (
                    <Card bg="rgba(212, 175, 55, 0.05)" border="2px dashed #E8E0D0" w="full">
                      <CardBody p={8} textAlign="center">
                        <VStack spacing={4}>
                          <LinkIcon size={48} color="#D4AF37" />
                          <VStack spacing={2}>
                            <Text fontSize="lg" fontWeight="600" color="#1A1A1A">
                              No links added yet
                            </Text>
                            <Text fontSize="sm" color="#8B8680" maxW="400px">
                              Add your social media profiles, personal website, portfolio, 
                              or any other relevant links.
                            </Text>
                          </VStack>
                          <Button
                            leftIcon={<Plus size={16} />}
                            onClick={openAddModal}
                            variant="outline"
                            colorScheme="gray"
                          >
                            Add Your First Link
                          </Button>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}
                </VStack>
              </TabPanel>

              {/* Media Gallery Tab */}
              <TabPanel px={0} py={6}>
                <VStack spacing={6}>
                  <Card bg="rgba(212, 175, 55, 0.05)" border="2px dashed #E8E0D0" w="full">
                    <CardBody p={8} textAlign="center">
                      <VStack spacing={4}>
                        <ImageIcon size={48} color="#D4AF37" />
                        <VStack spacing={2}>
                          <Text fontSize="lg" fontWeight="600" color="#1A1A1A">
                            Media Gallery Coming Soon
                          </Text>
                          <Text fontSize="sm" color="#8B8680" maxW="400px">
                            Upload images and videos to showcase your work, events, 
                            and memorable moments. This feature will be available in the next update.
                          </Text>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </MotionBox>

        {/* Tips */}
        <MotionBox variants={itemVariants} w="full">
          <Card bg="rgba(212, 175, 55, 0.05)">
            <CardBody p={6}>
              <VStack spacing={3} align="start">
                <HStack>
                  <LinkIcon size={18} color="#D4AF37" />
                  <Text fontSize="md" fontWeight="600" color="#1A1A1A">
                    Link Tips
                  </Text>
                </HStack>
                <VStack spacing={2} align="start" fontSize="sm" color="#8B8680">
                  <Text>• Add your LinkedIn profile for professional networking</Text>
                  <Text>• Include your personal or company website</Text>
                  <Text>• Add portfolio links to showcase your work</Text>
                  <Text>• Include relevant social media profiles</Text>
                  <Text>• Make sure all links are active and up-to-date</Text>
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </MotionBox>

        {/* Navigation Buttons */}
        <HStack spacing={4} w="full" justify="space-between">
          <Button
            variant="outline"
            colorScheme="gray"
            onClick={onPrevious}
            size="lg"
          >
            Previous
          </Button>

          <Button
            bg="#D4AF37"
            color="white"
            _hover={{ bg: '#B8941F' }}
            onClick={onNext}
            size="lg"
            isDisabled={!isValid}
          >
            Continue
          </Button>
        </HStack>

        {!isValid && (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            Please add at least one social link to continue
          </Alert>
        )}
      </VStack>

      {/* Link Modal */}
      <LinkModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={handleAddLink}
        link={editingIndex !== null ? links[editingIndex] : undefined}
        isEditing={editingIndex !== null}
      />
    </MotionBox>
  )
}
