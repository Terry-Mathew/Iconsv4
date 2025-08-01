'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Select,
  Button,
  IconButton,
  Badge,
  Card,
  CardBody,
  Image,
  Link,
  Spinner,
  Alert,
  AlertIcon,
  Tooltip,
  useToast,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ExternalLink,
  Check,
  X,
  AlertCircle,
  Globe,
  Linkedin,
  Twitter,
  Github,
  Instagram,
  Facebook,
  Youtube,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react'

const MotionBox = motion.create(Box)
const MotionCard = motion.create(Card)

interface SocialLink {
  id: string
  title: string
  url: string
  type: 'website' | 'linkedin' | 'twitter' | 'github' | 'instagram' | 'facebook' | 'youtube' | 'other'
  isValid?: boolean
  preview?: {
    title?: string
    description?: string
    image?: string
    favicon?: string
  }
  isValidating?: boolean
}

interface SocialLinkValidatorProps {
  links: SocialLink[]
  onChange: (links: SocialLink[]) => void
  maxLinks?: number
  enablePreview?: boolean
  enableValidation?: boolean
}

// Social platform configurations
const socialPlatforms = {
  website: {
    label: 'Website',
    icon: Globe,
    color: 'gray',
    placeholder: 'https://yourwebsite.com',
    pattern: /^https?:\/\/.+/,
  },
  linkedin: {
    label: 'LinkedIn',
    icon: Linkedin,
    color: 'blue',
    placeholder: 'https://linkedin.com/in/yourprofile',
    pattern: /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/.+/,
  },
  twitter: {
    label: 'Twitter',
    icon: Twitter,
    color: 'twitter',
    placeholder: 'https://twitter.com/yourusername',
    pattern: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+/,
  },
  github: {
    label: 'GitHub',
    icon: Github,
    color: 'gray',
    placeholder: 'https://github.com/yourusername',
    pattern: /^https?:\/\/(www\.)?github\.com\/.+/,
  },
  instagram: {
    label: 'Instagram',
    icon: Instagram,
    color: 'pink',
    placeholder: 'https://instagram.com/yourusername',
    pattern: /^https?:\/\/(www\.)?instagram\.com\/.+/,
  },
  facebook: {
    label: 'Facebook',
    icon: Facebook,
    color: 'facebook',
    placeholder: 'https://facebook.com/yourpage',
    pattern: /^https?:\/\/(www\.)?facebook\.com\/.+/,
  },
  youtube: {
    label: 'YouTube',
    icon: Youtube,
    color: 'red',
    placeholder: 'https://youtube.com/c/yourchannel',
    pattern: /^https?:\/\/(www\.)?youtube\.com\/.+/,
  },
  other: {
    label: 'Other',
    icon: Globe,
    color: 'gray',
    placeholder: 'https://yourlink.com',
    pattern: /^https?:\/\/.+/,
  },
} as const

// Link Preview Component
function LinkPreview({ link }: { link: SocialLink }) {
  const platform = socialPlatforms[link.type]
  const IconComponent = platform.icon

  return (
    <MotionCard
      size="sm"
      variant="outline"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <CardBody p={3}>
        <HStack spacing={3}>
          {/* Platform Icon */}
          <Box
            w={10}
            h={10}
            bg={`${platform.color}.100`}
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <IconComponent size={20} color={`var(--chakra-colors-${platform.color}-500)`} />
          </Box>

          {/* Link Info */}
          <VStack align="start" spacing={1} flex={1}>
            <HStack spacing={2} align="center">
              <Text
                fontSize="sm"
                fontWeight="600"
                color="#1A1A1A"
                fontFamily="'Lato', sans-serif"
              >
                {link.title || platform.label}
              </Text>
              
              {link.isValidating && <Spinner size="xs" color={`${platform.color}.500`} />}
              
              {!link.isValidating && link.isValid !== undefined && (
                <Badge
                  colorScheme={link.isValid ? 'green' : 'red'}
                  variant="subtle"
                  fontSize="xs"
                >
                  {link.isValid ? <Check size={10} /> : <X size={10} />}
                </Badge>
              )}
            </HStack>

            <Text
              fontSize="xs"
              color="gray.600"
              fontFamily="'Lato', sans-serif"
              noOfLines={1}
            >
              {link.url}
            </Text>

            {link.preview?.description && (
              <Text
                fontSize="xs"
                color="gray.500"
                fontFamily="'Lato', sans-serif"
                noOfLines={2}
              >
                {link.preview.description}
              </Text>
            )}
          </VStack>

          {/* Preview Image */}
          {link.preview?.image && (
            <Image
              src={link.preview.image}
              alt="Link preview"
              w={12}
              h={12}
              objectFit="cover"
              borderRadius="md"
            />
          )}

          {/* External Link */}
          <Tooltip label="Open link" placement="top">
            <IconButton
              as={Link}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open link"
              icon={<ExternalLink size={14} />}
              size="sm"
              variant="ghost"
              colorScheme={platform.color}
            />
          </Tooltip>
        </HStack>
      </CardBody>
    </MotionCard>
  )
}

// Link Form Component
function LinkForm({
  link,
  onSave,
  onCancel,
}: {
  link?: SocialLink
  onSave: (linkData: Omit<SocialLink, 'id'>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: link?.title || '',
    url: link?.url || '',
    type: link?.type || 'website' as const,
  })
  const [isValidating, setIsValidating] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const platform = socialPlatforms[formData.type]

  const validateUrl = useCallback(async (url: string, type: keyof typeof socialPlatforms) => {
    if (!url) return { isValid: false, error: 'URL is required' }

    const platformConfig = socialPlatforms[type]
    
    // Basic URL validation
    try {
      new URL(url)
    } catch {
      return { isValid: false, error: 'Invalid URL format' }
    }

    // Platform-specific validation
    if (!platformConfig.pattern.test(url)) {
      return { 
        isValid: false, 
        error: `URL doesn't match ${platformConfig.label} format` 
      }
    }

    // Simulate URL accessibility check (replace with actual implementation)
    setIsValidating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Mock validation result
      const isAccessible = Math.random() > 0.1 // 90% success rate
      
      if (!isAccessible) {
        return { isValid: false, error: 'URL is not accessible' }
      }

      return { isValid: true, error: null }
    } finally {
      setIsValidating(false)
    }
  }, [])

  const handleUrlChange = async (url: string) => {
    setFormData(prev => ({ ...prev, url }))
    setValidationError(null)

    if (url) {
      const result = await validateUrl(url, formData.type)
      if (!result.isValid) {
        setValidationError(result.error)
      }
    }
  }

  const handleSubmit = () => {
    if (!formData.url || validationError) return

    onSave({
      title: formData.title || platform.label,
      url: formData.url,
      type: formData.type,
      isValid: !validationError,
    })
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardBody p={6}>
          <VStack spacing={4} align="stretch">
            <Text
              fontSize="lg"
              fontWeight="600"
              color="#1A1A1A"
              fontFamily="'Playfair Display', serif"
            >
              {link ? 'Edit Link' : 'Add New Link'}
            </Text>

            {/* Platform Type */}
            <Box>
              <Text fontSize="sm" fontWeight="500" mb={2}>
                Platform Type
              </Text>
              <Select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  type: e.target.value as keyof typeof socialPlatforms 
                }))}
                size="lg"
              >
                {Object.entries(socialPlatforms).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </Select>
            </Box>

            {/* URL */}
            <Box>
              <Text fontSize="sm" fontWeight="500" mb={2}>
                URL *
              </Text>
              <Input
                value={formData.url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder={platform.placeholder}
                size="lg"
                isInvalid={!!validationError}
              />
              {validationError && (
                <Text fontSize="sm" color="red.500" mt={1}>
                  {validationError}
                </Text>
              )}
              {isValidating && (
                <HStack spacing={2} mt={2}>
                  <Spinner size="xs" />
                  <Text fontSize="sm" color="gray.500">
                    Validating URL...
                  </Text>
                </HStack>
              )}
            </Box>

            {/* Title */}
            <Box>
              <Text fontSize="sm" fontWeight="500" mb={2}>
                Display Title
              </Text>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder={`My ${platform.label} Profile`}
                size="lg"
              />
            </Box>

            {/* Actions */}
            <HStack spacing={3} justify="end">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                bg="#D4AF37"
                color="white"
                _hover={{ bg: "#B8941F" }}
                onClick={handleSubmit}
                isDisabled={!formData.url || !!validationError || isValidating}
                isLoading={isValidating}
              >
                {link ? 'Update Link' : 'Add Link'}
              </Button>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </MotionBox>
  )
}

// Main Social Link Validator Component
export function SocialLinkValidator({
  links,
  onChange,
  maxLinks = 10,
  enablePreview = true,
  enableValidation = true,
}: SocialLinkValidatorProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null)
  const toast = useToast()

  const handleAddLink = () => {
    if (links.length >= maxLinks) {
      toast({
        title: 'Maximum links reached',
        description: `You can only add up to ${maxLinks} links`,
        status: 'warning',
        duration: 3000,
      })
      return
    }
    setEditingLink(null)
    setShowForm(true)
  }

  const handleEditLink = (link: SocialLink) => {
    setEditingLink(link)
    setShowForm(true)
  }

  const handleDeleteLink = (id: string) => {
    const newLinks = links.filter(link => link.id !== id)
    onChange(newLinks)
  }

  const handleSaveLink = (linkData: Omit<SocialLink, 'id'>) => {
    if (editingLink) {
      // Update existing link
      const newLinks = links.map(link =>
        link.id === editingLink.id ? { ...link, ...linkData } : link
      )
      onChange(newLinks)
    } else {
      // Add new link
      const newLink: SocialLink = {
        ...linkData,
        id: `link-${Date.now()}`,
      }
      onChange([...links, newLink])
    }
    setShowForm(false)
    setEditingLink(null)
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <HStack justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text
            fontSize="lg"
            fontWeight="600"
            color="#1A1A1A"
            fontFamily="'Playfair Display', serif"
          >
            Social Links & Websites
          </Text>
          <Text fontSize="sm" color="gray.600">
            {links.length} of {maxLinks} links added
          </Text>
        </VStack>

        <Button
          leftIcon={<Plus size={16} />}
          onClick={handleAddLink}
          bg="#D4AF37"
          color="white"
          _hover={{ bg: "#B8941F" }}
          size="sm"
          isDisabled={links.length >= maxLinks}
        >
          Add Link
        </Button>
      </HStack>

      {/* Links List */}
      {links.length > 0 && (
        <VStack spacing={3} align="stretch">
          <AnimatePresence>
            {links.map((link) => (
              <MotionBox
                key={link.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <HStack spacing={3} align="start">
                  <Box flex={1}>
                    {enablePreview ? (
                      <LinkPreview link={link} />
                    ) : (
                      <Card variant="outline">
                        <CardBody p={3}>
                          <HStack justify="space-between" align="center">
                            <VStack align="start" spacing={1}>
                              <Text fontSize="sm" fontWeight="600">
                                {link.title}
                              </Text>
                              <Text fontSize="xs" color="gray.600">
                                {link.url}
                              </Text>
                            </VStack>
                            <Badge colorScheme={socialPlatforms[link.type].color}>
                              {socialPlatforms[link.type].label}
                            </Badge>
                          </HStack>
                        </CardBody>
                      </Card>
                    )}
                  </Box>

                  <VStack spacing={1}>
                    <Tooltip label="Edit link" placement="top">
                      <IconButton
                        aria-label="Edit link"
                        icon={<Edit size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => handleEditLink(link)}
                      />
                    </Tooltip>
                    
                    <Tooltip label="Delete link" placement="top">
                      <IconButton
                        aria-label="Delete link"
                        icon={<Trash2 size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleDeleteLink(link.id)}
                      />
                    </Tooltip>
                  </VStack>
                </HStack>
              </MotionBox>
            ))}
          </AnimatePresence>
        </VStack>
      )}

      {/* Empty State */}
      {links.length === 0 && !showForm && (
        <Alert status="info" borderRadius="12px">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" fontWeight="600">
              No social links added yet
            </Text>
            <Text fontSize="xs" color="gray.600">
              Add your social media profiles and websites to help people connect with you
            </Text>
          </VStack>
        </Alert>
      )}

      {/* Link Form */}
      <AnimatePresence>
        {showForm && (
          <LinkForm
            link={editingLink || undefined}
            onSave={handleSaveLink}
            onCancel={() => {
              setShowForm(false)
              setEditingLink(null)
            }}
          />
        )}
      </AnimatePresence>
    </VStack>
  )
}
