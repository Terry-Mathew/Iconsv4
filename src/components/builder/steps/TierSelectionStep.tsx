'use client'

import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  CardBody,
  Button,
  Badge,
  SimpleGrid,
  Icon,
  List,
  ListItem,
  ListIcon,
  useBreakpointValue,
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import {
  Star,
  Crown,
  Trophy,
  CheckCircle,
  Sparkles,
  Users,
  FileText,
  Camera,
  BarChart3,
  Archive,
} from 'lucide-react'

const MotionCard = motion.create(Card)
const MotionBox = motion.create(Box)

type ProfileTier = 'emerging' | 'accomplished' | 'distinguished' | 'legacy'

interface TierConfig {
  name: string
  price: string
  description: string
  icon: React.ElementType
  gradient: string
  features: string[]
  galleryLimit: number
  templateCount: number
  popular?: boolean
  memorial?: boolean
}

const TIER_CONFIGS: Record<ProfileTier, TierConfig> = {
  emerging: {
    name: 'Emerging',
    price: '₹2,500/year',
    description: 'For rising talents—showcase your potential',
    icon: Star,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    galleryLimit: 4,
    templateCount: 2,
    features: [
      'Professional profile with AI bio polishing',
      'Awards & honors showcase',
      'Up to 4 gallery photos with captions',
      '2 customizable template designs',
      'Certifications section (optional)',
      'Resume attachment with preview',
      'Unlimited video links with previews',
      'Mobile-optimized responsive design',
    ],
  },
  accomplished: {
    name: 'Accomplished',
    price: '₹5,000/year',
    description: 'For established professionals—amplify your influence',
    icon: Crown,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    galleryLimit: 10,
    templateCount: 5,
    popular: true,
    features: [
      'Everything in Emerging',
      'Up to 10 gallery photos with captions',
      '5 customizable template designs',
      'QR code generation for easy sharing',
      'Interactive timeline feature',
      'Leadership experience showcase',
      'Priority customer support',
    ],
  },
  distinguished: {
    name: 'Distinguished',
    price: '₹12,000/year',
    description: 'For industry leaders—demonstrate your excellence',
    icon: Trophy,
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    galleryLimit: 20,
    templateCount: 6,
    features: [
      'Everything in Accomplished',
      'Up to 20 gallery photos with captions',
      '6 premium customizable templates',
      'Publications & research showcase',
      'Advanced impact metrics display',
      'White-glove customer service',
      'Premium gradient color schemes',
    ],
  },
  legacy: {
    name: 'Legacy',
    price: '₹50,000 lifetime',
    description: 'Memorial service—preserve their eternal impact',
    icon: Archive,
    gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    galleryLimit: 999,
    templateCount: 1,
    memorial: true,
    features: [
      'Dedicated memorial templates',
      'Unlimited gallery photos',
      'Historical timeline preservation',
      'Tribute collection system',
      'Archival documentation',
      'Memorial service coordination',
      'Lifetime hosting guarantee',
      'Family access management',
    ],
  },
}

interface TierSelectionStepProps {
  selectedTier: ProfileTier
  onTierSelect: (tier: ProfileTier) => void
  onNext: () => void
  isImpersonating?: boolean
  impersonatedTier?: ProfileTier | null
}

export function TierSelectionStep({
  selectedTier,
  onTierSelect,
  onNext,
  isImpersonating = false,
  impersonatedTier = null,
}: TierSelectionStepProps) {
  const isMobile = useBreakpointValue({ base: true, md: false })

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: {
      y: -8,
      boxShadow: '0 20px 40px rgba(212, 175, 55, 0.2)',
      transition: { duration: 0.3 },
    },
  }

  const effectiveTier = isImpersonating && impersonatedTier ? impersonatedTier : selectedTier

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
      <VStack spacing={8} align="center">
        {/* Header */}
        <VStack spacing={4} textAlign="center">
          <Heading
            as="h1"
            fontSize={{ base: '2xl', md: '4xl' }}
            fontFamily="'Playfair Display', serif"
            color="#1A1A1A"
            fontWeight="400"
          >
            Choose Your Profile Tier
          </Heading>
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            color="#8B8680"
            maxW="600px"
            lineHeight="1.6"
          >
            Select the tier that best represents your journey and achievements.
            Each tier offers unique features to showcase your story.
          </Text>
          
          {isImpersonating && (
            <Badge
              colorScheme="blue"
              variant="solid"
              fontSize="sm"
              px={3}
              py={1}
              borderRadius="full"
            >
              Admin Impersonation Mode
            </Badge>
          )}
        </VStack>

        {/* Main Tier Cards */}
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          spacing={6}
          w="full"
          maxW="1200px"
        >
          {(Object.entries(TIER_CONFIGS) as [ProfileTier, TierConfig][])
            .filter(([_, config]) => !config.memorial)
            .map(([tier, config]) => {
              const Icon = config.icon
              const isSelected = effectiveTier === tier
              const isDisabled = isImpersonating && impersonatedTier !== tier

              return (
                <MotionCard
                  key={tier}
                  variants={cardVariants}
                  whileHover={!isDisabled ? "hover" : {}}
                  cursor={isDisabled ? 'not-allowed' : 'pointer'}
                  onClick={() => !isDisabled && onTierSelect(tier)}
                  position="relative"
                  border={isSelected ? '3px solid #D4AF37' : '1px solid #E8E0D0'}
                  bg={isSelected ? 'rgba(212, 175, 55, 0.05)' : 'white'}
                  opacity={isDisabled ? 0.6 : 1}
                  overflow="hidden"
                >
                  {config.popular && (
                    <Badge
                      position="absolute"
                      top={4}
                      right={4}
                      bg="#D4AF37"
                      color="white"
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      Most Popular
                    </Badge>
                  )}

                  <CardBody p={6}>
                    <VStack spacing={4} align="start">
                      {/* Icon & Title with Gradient */}
                      <Box
                        w="full"
                        h="80px"
                        background={config.gradient}
                        borderRadius="lg"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        mb={4}
                      >
                        <VStack spacing={1}>
                          <Icon
                            size={32}
                            color="white"
                          />
                          <Text
                            fontSize="sm"
                            fontWeight="600"
                            color="white"
                            textAlign="center"
                          >
                            {config.name}
                          </Text>
                        </VStack>
                      </Box>

                      {/* Price */}
                      <Text
                        fontSize="2xl"
                        fontWeight="700"
                        color="#1A1A1A"
                        textAlign="center"
                      >
                        {config.price}
                      </Text>

                      {/* Description */}
                      <Text
                        fontSize="sm"
                        color="#8B8680"
                        lineHeight="1.5"
                        textAlign="center"
                      >
                        {config.description}
                      </Text>

                      {/* Gallery & Template Info */}
                      <HStack spacing={4} justify="center">
                        <Badge
                          colorScheme="blue"
                          variant="subtle"
                          fontSize="xs"
                        >
                          {config.galleryLimit} Photos
                        </Badge>
                        <Badge
                          colorScheme="purple"
                          variant="subtle"
                          fontSize="xs"
                        >
                          {config.templateCount} Templates
                        </Badge>
                      </HStack>

                      {/* Features */}
                      <List spacing={2} w="full">
                        {config.features.map((feature, index) => (
                          <ListItem key={index} fontSize="sm">
                            <ListIcon
                              as={CheckCircle}
                              color="#D4AF37"
                              boxSize={4}
                            />
                            {feature}
                          </ListItem>
                        ))}
                      </List>

                      {/* Select Button */}
                      <Button
                        w="full"
                        bg={isSelected ? '#D4AF37' : 'transparent'}
                        color={isSelected ? 'white' : '#D4AF37'}
                        border="2px solid #D4AF37"
                        _hover={{
                          bg: isSelected ? '#B8941F' : '#D4AF37',
                          color: 'white',
                        }}
                        isDisabled={isDisabled}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (!isDisabled) onTierSelect(tier)
                        }}
                      >
                        {isSelected ? 'Selected' : 'Select Tier'}
                      </Button>
                    </VStack>
                  </CardBody>
                </MotionCard>
              )
            }
          )}
        </SimpleGrid>

        {/* Memorial Service Section */}
        <VStack spacing={6} w="full" maxW="800px" mt={12}>
          <VStack spacing={2} textAlign="center">
            <Heading
              as="h3"
              fontSize="2xl"
              fontFamily="'Playfair Display', serif"
              color="#1A1A1A"
            >
              Memorial Service
            </Heading>
            <Text
              fontSize="md"
              color="#8B8680"
              maxW="600px"
            >
              Honor the memory of departed loved ones with our dedicated memorial service,
              separate from our main profile tiers.
            </Text>
          </VStack>

          {/* Legacy Memorial Card */}
          {(() => {
            const legacyConfig = TIER_CONFIGS.legacy
            const Icon = legacyConfig.icon
            const isSelected = effectiveTier === 'legacy'
            const isDisabled = isImpersonating && impersonatedTier !== 'legacy'

            return (
              <MotionCard
                variants={cardVariants}
                whileHover={!isDisabled ? "hover" : {}}
                cursor={isDisabled ? 'not-allowed' : 'pointer'}
                onClick={() => !isDisabled && onTierSelect('legacy')}
                position="relative"
                border={isSelected ? '3px solid #8B4513' : '1px solid #E8E0D0'}
                bg={isSelected ? 'rgba(139, 69, 19, 0.05)' : 'white'}
                opacity={isDisabled ? 0.6 : 1}
                overflow="hidden"
                w="full"
                maxW="600px"
              >
                <CardBody p={8}>
                  <VStack spacing={6}>
                    {/* Memorial Header */}
                    <Box
                      w="full"
                      h="100px"
                      background={legacyConfig.gradient}
                      borderRadius="lg"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <VStack spacing={2}>
                        <Icon
                          size={40}
                          color="white"
                        />
                        <Text
                          fontSize="lg"
                          fontWeight="600"
                          color="white"
                          textAlign="center"
                        >
                          {legacyConfig.name} Memorial
                        </Text>
                      </VStack>
                    </Box>

                    {/* Price */}
                    <Text
                      fontSize="3xl"
                      fontWeight="700"
                      color="#1A1A1A"
                      textAlign="center"
                    >
                      {legacyConfig.price}
                    </Text>

                    {/* Description */}
                    <Text
                      fontSize="md"
                      color="#8B8680"
                      lineHeight="1.6"
                      textAlign="center"
                    >
                      {legacyConfig.description}
                    </Text>

                    {/* Features */}
                    <List spacing={2} w="full">
                      {legacyConfig.features.slice(0, 4).map((feature, index) => (
                        <ListItem key={index} fontSize="sm">
                          <ListIcon as={CheckCircle} color="#8B4513" />
                          {feature}
                        </ListItem>
                      ))}
                    </List>

                    {/* Select Button */}
                    <Button
                      w="full"
                      bg={isSelected ? '#8B4513' : 'transparent'}
                      color={isSelected ? 'white' : '#8B4513'}
                      border="2px solid #8B4513"
                      _hover={{
                        bg: isSelected ? '#6B3410' : '#8B4513',
                        color: 'white',
                      }}
                      isDisabled={isDisabled}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!isDisabled) onTierSelect('legacy')
                      }}
                    >
                      {isSelected ? 'Selected' : 'Select Memorial Service'}
                    </Button>
                  </VStack>
                </CardBody>
              </MotionCard>
            )
          })()}
        </VStack>

        {/* Continue Button */}
        <Button
          size="lg"
          bg="#D4AF37"
          color="white"
          px={8}
          py={6}
          fontSize="md"
          fontWeight="700"
          _hover={{ bg: '#B8941F' }}
          onClick={onNext}
          rightIcon={<CheckCircle size={20} />}
        >
          Continue with {effectiveTier && TIER_CONFIGS[effectiveTier] ? TIER_CONFIGS[effectiveTier].name : 'Selected Tier'}
        </Button>
      </VStack>
    </MotionBox>
  )
}
