'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  Badge,
  Card,
  CardBody,
  Grid,
  GridItem,
  AspectRatio,
  Button,
  IconButton,
  Divider,
  Link,
  useBreakpointValue,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye,
  EyeOff,
  Smartphone,
  Monitor,
  Tablet,
  ExternalLink,
  Calendar,
  MapPin,
  Award,
  Globe,
  Linkedin,
  Twitter,
  Github,
} from 'lucide-react'
import { ProfileBuilderData, achievementCategories } from '@/lib/validations/profile-builder'

const MotionBox = motion.create(Box)
const MotionCard = motion.create(Card)

interface RealTimePreviewProps {
  data: Partial<ProfileBuilderData>
  isVisible: boolean
  onToggle: () => void
  viewMode?: 'desktop' | 'tablet' | 'mobile'
  onViewModeChange?: (mode: 'desktop' | 'tablet' | 'mobile') => void
  tier: 'rising' | 'elite' | 'legacy'
  isLoading?: boolean
}

// Device viewport configurations
const deviceViewports = {
  desktop: { width: '100%', maxWidth: '1200px' },
  tablet: { width: '768px', maxWidth: '768px' },
  mobile: { width: '375px', maxWidth: '375px' },
}

// Tier-specific styling
const tierStyles = {
  emerging: {
    primaryColor: '#667eea',
    secondaryColor: '#F7F3E9',
    accentColor: '#764ba2',
    gradient: 'linear(to-r, #667eea, #764ba2)',
    theme: 'vibrant',
  },
  accomplished: {
    primaryColor: '#4facfe',
    secondaryColor: '#EDF2F7',
    accentColor: '#00f2fe',
    gradient: 'linear(to-r, #4facfe, #00f2fe)',
    theme: 'professional',
  },
  distinguished: {
    primaryColor: '#fa709a',
    secondaryColor: '#FFF5F5',
    accentColor: '#fee140',
    gradient: 'linear(to-r, #fa709a, #fee140)',
    theme: 'premium',
  },
  legacy: {
    primaryColor: '#d299c2',
    secondaryColor: '#F7FAFC',
    accentColor: '#fef9d7',
    gradient: 'linear(to-r, #d299c2, #fef9d7)',
    theme: 'timeless',
  },
}

// Social platform icons
const socialIcons = {
  website: Globe,
  linkedin: Linkedin,
  twitter: Twitter,
  github: Github,
}

// Preview Header Component
function PreviewHeader({ 
  data, 
  tier, 
  isLoading 
}: { 
  data: Partial<ProfileBuilderData>
  tier: 'rising' | 'elite' | 'legacy'
  isLoading?: boolean 
}) {
  const styles = tierStyles[tier]

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      bg={styles.gradient}
      color="white"
      p={8}
      borderRadius="12px 12px 0 0"
      position="relative"
      overflow="hidden"
    >
      {/* Background Pattern */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.1}
        bgImage="radial-gradient(circle, white 1px, transparent 1px)"
        bgSize="20px 20px"
      />

      <VStack spacing={6} align="center" position="relative" zIndex={1}>
        {/* Hero Image */}
        {data.heroImage ? (
          <AspectRatio ratio={1} w="120px">
            <Image
              src={data.heroImage}
              alt={data.name || 'Profile image'}
              borderRadius="full"
              border="4px solid white"
              objectFit="cover"
            />
          </AspectRatio>
        ) : (
          <Skeleton
            w="120px"
            h="120px"
            borderRadius="full"
            startColor="whiteAlpha.300"
            endColor="whiteAlpha.500"
          />
        )}

        {/* Name and Tagline */}
        <VStack spacing={2} textAlign="center">
          {data.name ? (
            <Text
              fontSize="3xl"
              fontWeight="700"
              fontFamily="'Playfair Display', serif"
              lineHeight="1.2"
            >
              {data.name}
            </Text>
          ) : (
            <Skeleton height="40px" width="200px" startColor="whiteAlpha.300" endColor="whiteAlpha.500" />
          )}

          {data.tagline ? (
            <Text
              fontSize="lg"
              opacity={0.9}
              fontFamily="'Lato', sans-serif"
              maxW="600px"
              lineHeight="1.4"
            >
              {data.tagline}
            </Text>
          ) : (
            <Skeleton height="24px" width="300px" startColor="whiteAlpha.300" endColor="whiteAlpha.500" />
          )}
        </VStack>

        {/* Tier Badge */}
        <Badge
          size="lg"
          px={4}
          py={2}
          bg="whiteAlpha.200"
          color="white"
          borderRadius="full"
          fontWeight="600"
          textTransform="uppercase"
          letterSpacing="1px"
        >
          {tier} Profile
        </Badge>
      </VStack>
    </MotionBox>
  )
}

// Preview Biography Component
function PreviewBiography({ 
  data, 
  tier,
  isLoading 
}: { 
  data: Partial<ProfileBuilderData>
  tier: 'rising' | 'elite' | 'legacy'
  isLoading?: boolean 
}) {
  const styles = tierStyles[tier]
  const bioText = data.bio?.ai_polished || data.bio?.original

  if (!bioText && !isLoading) return null

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      variant="outline"
      borderColor={styles.primaryColor}
    >
      <CardBody p={6}>
        <VStack spacing={4} align="stretch">
          <Text
            fontSize="xl"
            fontWeight="600"
            color={styles.primaryColor}
            fontFamily="'Playfair Display', serif"
          >
            Biography
          </Text>
          
          {bioText ? (
            <Text
              fontSize="md"
              lineHeight="1.7"
              color="gray.700"
              fontFamily="'Lato', sans-serif"
              whiteSpace="pre-wrap"
            >
              {bioText}
            </Text>
          ) : (
            <SkeletonText noOfLines={6} spacing="4" />
          )}

          {data.bio?.ai_polished && (
            <Badge
              alignSelf="start"
              colorScheme="blue"
              variant="subtle"
              fontSize="xs"
            >
              AI Enhanced
            </Badge>
          )}
        </VStack>
      </CardBody>
    </MotionCard>
  )
}

// Preview Achievements Component
function PreviewAchievements({ 
  data, 
  tier,
  isLoading 
}: { 
  data: Partial<ProfileBuilderData>
  tier: 'rising' | 'elite' | 'legacy'
  isLoading?: boolean 
}) {
  const styles = tierStyles[tier]
  const achievements = data.achievements || []

  if (achievements.length === 0 && !isLoading) return null

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      variant="outline"
      borderColor={styles.primaryColor}
    >
      <CardBody p={6}>
        <VStack spacing={6} align="stretch">
          <Text
            fontSize="xl"
            fontWeight="600"
            color={styles.primaryColor}
            fontFamily="'Playfair Display', serif"
          >
            Achievements & Milestones
          </Text>
          
          {achievements.length > 0 ? (
            <VStack spacing={4} align="stretch">
              <AnimatePresence>
                {achievements.map((achievement, index) => {
                  const category = achievementCategories[achievement.category || 'other']
                  
                  return (
                    <MotionBox
                      key={achievement.title || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card variant="outline" size="sm">
                        <CardBody p={4}>
                          <HStack spacing={4} align="start">
                            <Box
                              w={10}
                              h={10}
                              bg={`${category.color}.100`}
                              borderRadius="lg"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              flexShrink={0}
                            >
                              <Text fontSize="lg">{category.icon}</Text>
                            </Box>
                            
                            <VStack align="start" spacing={2} flex={1}>
                              <HStack justify="space-between" w="full" align="start">
                                <Text
                                  fontSize="md"
                                  fontWeight="600"
                                  color="#1A1A1A"
                                  fontFamily="'Lato', sans-serif"
                                  lineHeight="1.3"
                                >
                                  {achievement.title}
                                </Text>
                                
                                {achievement.year && (
                                  <Badge
                                    colorScheme="blue"
                                    variant="subtle"
                                    fontSize="xs"
                                  >
                                    {achievement.year}
                                  </Badge>
                                )}
                              </HStack>
                              
                              <Text
                                fontSize="sm"
                                color="gray.600"
                                fontFamily="'Lato', sans-serif"
                                lineHeight="1.5"
                              >
                                {achievement.description}
                              </Text>
                              
                              <Badge
                                colorScheme={category.color}
                                variant="subtle"
                                fontSize="xs"
                              >
                                {category.label}
                              </Badge>
                            </VStack>
                          </HStack>
                        </CardBody>
                      </Card>
                    </MotionBox>
                  )
                })}
              </AnimatePresence>
            </VStack>
          ) : (
            <VStack spacing={3}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} height="80px" borderRadius="md" />
              ))}
            </VStack>
          )}
        </VStack>
      </CardBody>
    </MotionCard>
  )
}

// Preview Links Component
function PreviewLinks({ 
  data, 
  tier,
  isLoading 
}: { 
  data: Partial<ProfileBuilderData>
  tier: 'rising' | 'elite' | 'legacy'
  isLoading?: boolean 
}) {
  const styles = tierStyles[tier]
  const links = data.links || []

  if (links.length === 0 && !isLoading) return null

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      variant="outline"
      borderColor={styles.primaryColor}
    >
      <CardBody p={6}>
        <VStack spacing={4} align="stretch">
          <Text
            fontSize="xl"
            fontWeight="600"
            color={styles.primaryColor}
            fontFamily="'Playfair Display', serif"
          >
            Connect With Me
          </Text>
          
          {links.length > 0 ? (
            <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={3}>
              <AnimatePresence>
                {links.map((link, index) => {
                  const IconComponent = socialIcons[link.type as keyof typeof socialIcons] || Globe
                  
                  return (
                    <GridItem key={link.url || index}>
                      <MotionBox
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Link
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          _hover={{ textDecoration: 'none' }}
                        >
                          <Card
                            variant="outline"
                            size="sm"
                            _hover={{
                              borderColor: styles.primaryColor,
                              transform: 'translateY(-2px)',
                              boxShadow: 'md',
                            }}
                            transition="all 0.2s"
                            cursor="pointer"
                          >
                            <CardBody p={3}>
                              <HStack spacing={3}>
                                <Box
                                  w={8}
                                  h={8}
                                  bg={`${styles.primaryColor}15`}
                                  borderRadius="lg"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <IconComponent size={16} color={styles.primaryColor} />
                                </Box>
                                
                                <VStack align="start" spacing={0} flex={1}>
                                  <Text
                                    fontSize="sm"
                                    fontWeight="600"
                                    color="#1A1A1A"
                                    fontFamily="'Lato', sans-serif"
                                    noOfLines={1}
                                  >
                                    {link.title}
                                  </Text>
                                  <Text
                                    fontSize="xs"
                                    color="gray.500"
                                    fontFamily="'Lato', sans-serif"
                                    noOfLines={1}
                                  >
                                    {link.type.charAt(0).toUpperCase() + link.type.slice(1)}
                                  </Text>
                                </VStack>
                                
                                <ExternalLink size={14} color="gray.400" />
                              </HStack>
                            </CardBody>
                          </Card>
                        </Link>
                      </MotionBox>
                    </GridItem>
                  )
                })}
              </AnimatePresence>
            </Grid>
          ) : (
            <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={3}>
              {[1, 2, 3].map((i) => (
                <GridItem key={i}>
                  <Skeleton height="60px" borderRadius="md" />
                </GridItem>
              ))}
            </Grid>
          )}
        </VStack>
      </CardBody>
    </MotionCard>
  )
}

// Main Real-Time Preview Component
export function RealTimePreview({
  data,
  isVisible,
  onToggle,
  viewMode = 'desktop',
  onViewModeChange,
  tier,
  isLoading = false,
}: RealTimePreviewProps) {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const viewport = deviceViewports[viewMode]

  // Memoize preview content to prevent unnecessary re-renders
  const previewContent = useMemo(() => (
    <VStack spacing={6} align="stretch">
      <PreviewHeader data={data} tier={tier} isLoading={isLoading} />
      <PreviewBiography data={data} tier={tier} isLoading={isLoading} />
      <PreviewAchievements data={data} tier={tier} isLoading={isLoading} />
      <PreviewLinks data={data} tier={tier} isLoading={isLoading} />
    </VStack>
  ), [data, tier, isLoading])

  if (!isVisible) {
    return (
      <Box position="fixed" bottom={4} right={4} zIndex={1000}>
        <Button
          leftIcon={<Eye size={16} />}
          onClick={onToggle}
          bg="#D4AF37"
          color="white"
          _hover={{ bg: "#B8941F" }}
          boxShadow="lg"
          borderRadius="full"
          px={6}
        >
          Show Preview
        </Button>
      </Box>
    )
  }

  return (
    <MotionBox
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      position="sticky"
      top={4}
      h="calc(100vh - 2rem)"
      w="full"
      bg="white"
      borderRadius="12px"
      border="1px solid"
      borderColor="gray.200"
      overflow="hidden"
      boxShadow="lg"
    >
      {/* Preview Header */}
      <HStack
        justify="space-between"
        align="center"
        p={4}
        borderBottom="1px solid"
        borderColor="gray.200"
        bg="gray.50"
      >
        <HStack spacing={3}>
          <Text
            fontSize="md"
            fontWeight="600"
            color="#1A1A1A"
            fontFamily="'Lato', sans-serif"
          >
            Live Preview
          </Text>
          <Badge colorScheme="green" variant="subtle">
            {tier.toUpperCase()}
          </Badge>
        </HStack>

        <HStack spacing={2}>
          {/* Device Mode Switcher */}
          {!isMobile && onViewModeChange && (
            <HStack spacing={1}>
              <IconButton
                aria-label="Desktop view"
                icon={<Monitor size={16} />}
                size="sm"
                variant={viewMode === 'desktop' ? 'solid' : 'ghost'}
                colorScheme={viewMode === 'desktop' ? 'blue' : 'gray'}
                onClick={() => onViewModeChange('desktop')}
              />
              <IconButton
                aria-label="Tablet view"
                icon={<Tablet size={16} />}
                size="sm"
                variant={viewMode === 'tablet' ? 'solid' : 'ghost'}
                colorScheme={viewMode === 'tablet' ? 'blue' : 'gray'}
                onClick={() => onViewModeChange('tablet')}
              />
              <IconButton
                aria-label="Mobile view"
                icon={<Smartphone size={16} />}
                size="sm"
                variant={viewMode === 'mobile' ? 'solid' : 'ghost'}
                colorScheme={viewMode === 'mobile' ? 'blue' : 'gray'}
                onClick={() => onViewModeChange('mobile')}
              />
            </HStack>
          )}

          <IconButton
            aria-label="Hide preview"
            icon={<EyeOff size={16} />}
            size="sm"
            variant="ghost"
            onClick={onToggle}
          />
        </HStack>
      </HStack>

      {/* Preview Content */}
      <Box
        h="calc(100% - 73px)"
        overflowY="auto"
        p={4}
        display="flex"
        justifyContent="center"
      >
        <Box
          w={viewport.width}
          maxW={viewport.maxWidth}
          transition="all 0.3s"
        >
          {previewContent}
        </Box>
      </Box>
    </MotionBox>
  )
}
