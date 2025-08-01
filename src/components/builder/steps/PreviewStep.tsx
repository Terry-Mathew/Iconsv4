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
  Grid,
  GridItem,
  Image,
  AspectRatio,
  Badge,
  Divider,
  useToast,
  Alert,
  AlertIcon,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import {
  Eye,
  Send,
  Edit3,
  Globe,
  Linkedin,
  Twitter,
  Link as LinkIcon,
  Trophy,
  Calendar,
  ExternalLink,
  Save,
} from 'lucide-react'
import { useState } from 'react'
import { UseFormWatch, UseFormSetValue } from 'react-hook-form'

const MotionBox = motion.create(Box)
const MotionCard = motion.create(Card)

interface PreviewStepProps {
  watch: UseFormWatch<any>
  setValue: UseFormSetValue<any>
  onPrevious: () => void
  onPublish: () => void
  onSaveDraft?: () => void
  isSubmitting?: boolean
  isSaving?: boolean
  selectedTier: string
}

export function PreviewStep({
  watch,
  setValue,
  onPrevious,
  onPublish,
  onSaveDraft,
  isSubmitting = false,
  isSaving = false,
  selectedTier,
}: PreviewStepProps) {
  const toast = useToast()
  const [isPreviewMode, setIsPreviewMode] = useState(true)

  const formData = watch()
  const {
    name,
    tagline,
    heroImage,
    bio,
    achievements = [],
    links = [],
    isPublic = true,
    analyticsEnabled = true,
  } = formData

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
      maxW="6xl"
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
            Preview & Publish
          </Heading>
          <Text color="#8B8680" fontSize="lg" maxW="600px">
            Review your profile and make it live for the world to see
          </Text>
        </MotionBox>

        {/* Preview Toggle */}
        <MotionBox variants={itemVariants} w="full">
          <HStack justify="center" spacing={4}>
            <Text fontSize="sm" color="#8B8680">
              Edit Mode
            </Text>
            <Switch
              colorScheme="yellow"
              size="lg"
              isChecked={isPreviewMode}
              onChange={(e) => setIsPreviewMode(e.target.checked)}
            />
            <Text fontSize="sm" color="#8B8680">
              Preview Mode
            </Text>
          </HStack>
        </MotionBox>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8} w="full">
          {/* Main Preview */}
          <GridItem>
            <MotionCard variants={itemVariants} border="1px solid #E8E0D0">
              <CardBody p={0}>
                {/* Hero Section */}
                {heroImage && (
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={heroImage}
                      alt="Hero image"
                      objectFit="cover"
                      borderTopRadius="md"
                    />
                  </AspectRatio>
                )}

                <VStack spacing={6} p={6} align="start">
                  {/* Name & Tagline */}
                  <VStack spacing={2} align="start" w="full">
                    <Heading
                      as="h1"
                      fontSize="2xl"
                      fontFamily="'Playfair Display', serif"
                      color="#1A1A1A"
                    >
                      {name || 'Your Name'}
                    </Heading>
                    <Text color="#8B8680" fontSize="lg" lineHeight="1.5">
                      {tagline || 'Your professional tagline'}
                    </Text>
                    <Badge colorScheme="yellow" variant="subtle">
                      {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)} Profile
                    </Badge>
                  </VStack>

                  <Divider />

                  {/* Biography */}
                  <VStack spacing={3} align="start" w="full">
                    <Heading as="h3" fontSize="lg" color="#1A1A1A">
                      Biography
                    </Heading>
                    <Text
                      color="#8B8680"
                      lineHeight="1.6"
                      whiteSpace="pre-wrap"
                    >
                      {bio?.ai_polished || bio?.original || 'Your biography will appear here...'}
                    </Text>
                  </VStack>

                  {/* Achievements */}
                  {achievements.length > 0 && (
                    <>
                      <Divider />
                      <VStack spacing={4} align="start" w="full">
                        <Heading as="h3" fontSize="lg" color="#1A1A1A">
                          Achievements
                        </Heading>
                        <VStack spacing={3} w="full">
                          {achievements.slice(0, 3).map((achievement: any, index: number) => (
                            <Card key={index} w="full" variant="outline">
                              <CardBody p={4}>
                                <HStack justify="space-between" align="start">
                                  <VStack spacing={2} align="start" flex={1}>
                                    <HStack>
                                      <Trophy size={16} color="#D4AF37" />
                                      <Text fontSize="md" fontWeight="600" color="#1A1A1A">
                                        {achievement.title}
                                      </Text>
                                    </HStack>
                                    <Text fontSize="sm" color="#8B8680">
                                      {achievement.description}
                                    </Text>
                                  </VStack>
                                  <VStack spacing={1} align="end">
                                    <Badge size="sm">{achievement.category}</Badge>
                                    <HStack spacing={1}>
                                      <Calendar size={12} />
                                      <Text fontSize="xs" color="#8B8680">
                                        {achievement.year}
                                      </Text>
                                    </HStack>
                                  </VStack>
                                </HStack>
                              </CardBody>
                            </Card>
                          ))}
                          {achievements.length > 3 && (
                            <Text fontSize="sm" color="#8B8680" fontStyle="italic">
                              +{achievements.length - 3} more achievements
                            </Text>
                          )}
                        </VStack>
                      </VStack>
                    </>
                  )}

                  {/* Links */}
                  {links.length > 0 && (
                    <>
                      <Divider />
                      <VStack spacing={4} align="start" w="full">
                        <Heading as="h3" fontSize="lg" color="#1A1A1A">
                          Links
                        </Heading>
                        <VStack spacing={2} w="full">
                          {links.map((link: any, index: number) => (
                            <HStack
                              key={index}
                              p={3}
                              border="1px solid #E8E0D0"
                              borderRadius="md"
                              w="full"
                              justify="space-between"
                              _hover={{ borderColor: '#D4AF37', bg: 'rgba(212, 175, 55, 0.05)' }}
                            >
                              <HStack>
                                {getLinkIcon(link.type)}
                                <Text fontSize="sm" fontWeight="500" color="#1A1A1A">
                                  {link.title}
                                </Text>
                              </HStack>
                              <ExternalLink size={14} color="#8B8680" />
                            </HStack>
                          ))}
                        </VStack>
                      </VStack>
                    </>
                  )}
                </VStack>
              </CardBody>
            </MotionCard>
          </GridItem>

          {/* Settings Panel */}
          <GridItem>
            <VStack spacing={6}>
              {/* Publication Settings */}
              <MotionCard variants={itemVariants} w="full">
                <CardBody p={6}>
                  <VStack spacing={4} align="start">
                    <Heading as="h4" fontSize="md" color="#1A1A1A">
                      Publication Settings
                    </Heading>
                    
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="public-profile" mb="0" fontSize="sm">
                        Make profile public
                      </FormLabel>
                      <Switch
                        id="public-profile"
                        colorScheme="yellow"
                        isChecked={isPublic}
                        onChange={(e) => setValue('isPublic', e.target.checked)}
                      />
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="analytics" mb="0" fontSize="sm">
                        Enable analytics
                      </FormLabel>
                      <Switch
                        id="analytics"
                        colorScheme="yellow"
                        isChecked={analyticsEnabled}
                        onChange={(e) => setValue('analyticsEnabled', e.target.checked)}
                      />
                    </FormControl>
                  </VStack>
                </CardBody>
              </MotionCard>

              {/* Profile Summary */}
              <MotionCard variants={itemVariants} w="full" bg="rgba(212, 175, 55, 0.05)">
                <CardBody p={6}>
                  <VStack spacing={4} align="start">
                    <Heading as="h4" fontSize="md" color="#1A1A1A">
                      Profile Summary
                    </Heading>
                    
                    <VStack spacing={2} align="start" fontSize="sm">
                      <HStack justify="space-between" w="full">
                        <Text color="#8B8680">Tier:</Text>
                        <Badge colorScheme="yellow">
                          {selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1)}
                        </Badge>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text color="#8B8680">Achievements:</Text>
                        <Text color="#1A1A1A" fontWeight="500">{achievements.length}</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text color="#8B8680">Links:</Text>
                        <Text color="#1A1A1A" fontWeight="500">{links.length}</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text color="#8B8680">Status:</Text>
                        <Badge colorScheme={isPublic ? 'green' : 'gray'}>
                          {isPublic ? 'Public' : 'Private'}
                        </Badge>
                      </HStack>
                    </VStack>
                  </VStack>
                </CardBody>
              </MotionCard>

              {/* Action Buttons */}
              <VStack spacing={3} w="full">
                <Button
                  leftIcon={<Send size={20} />}
                  onClick={onPublish}
                  size="lg"
                  bg="#D4AF37"
                  color="white"
                  _hover={{ bg: '#B8941F' }}
                  w="full"
                  isLoading={isSubmitting}
                  loadingText="Publishing..."
                  isDisabled={isSaving}
                >
                  Publish Profile
                </Button>

                {onSaveDraft && (
                  <Button
                    leftIcon={<Save size={16} />}
                    onClick={onSaveDraft}
                    size="md"
                    variant="outline"
                    w="full"
                    borderColor="#8B8680"
                    color="#8B8680"
                    _hover={{ bg: '#8B8680', color: 'white' }}
                    isLoading={isSaving}
                    loadingText="Saving..."
                    isDisabled={isSubmitting}
                  >
                    Save as Draft
                  </Button>
                )}

                <Button
                  leftIcon={<Edit3 size={16} />}
                  onClick={onPrevious}
                  variant="ghost"
                  size="md"
                  w="full"
                  color="#8B8680"
                  _hover={{ bg: '#F7F5F3' }}
                >
                  Back to Edit
                </Button>
              </VStack>
            </VStack>
          </GridItem>
        </Grid>

        {/* Final Notice */}
        <MotionBox variants={itemVariants} w="full">
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <VStack align="start" spacing={1}>
              <Text fontSize="sm" fontWeight="600">
                Ready to publish?
              </Text>
              <Text fontSize="xs">
                Once published, your profile will be live and accessible via your unique URL.
                You can always edit and update your profile later.
              </Text>
            </VStack>
          </Alert>
        </MotionBox>
      </VStack>
    </MotionBox>
  )
}
