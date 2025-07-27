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

type ProfileTier = 'rising' | 'elite' | 'legacy'

interface TierConfig {
  name: string
  price: string
  description: string
  icon: React.ElementType
  color: string
  features: string[]
  fieldCount: number
  popular?: boolean
}

const TIER_CONFIGS: Record<ProfileTier, TierConfig> = {
  rising: {
    name: 'Rising',
    price: '₹3,000/year',
    description: 'For emerging brilliance—showcase your potential',
    icon: Star,
    color: '#FF6B35',
    fieldCount: 4,
    features: [
      'Basic profile with name & bio',
      'Hero image upload',
      'Social links section',
      'AI-enhanced biography',
      'Mobile-optimized display',
      'Basic analytics',
    ],
  },
  elite: {
    name: 'Elite',
    price: '₹10,000/year',
    description: 'For established leaders—amplify your influence',
    icon: Crown,
    color: '#D4AF37',
    fieldCount: 6,
    popular: true,
    features: [
      'Everything in Rising',
      'Impact metrics showcase',
      'Media gallery section',
      'Leadership highlights',
      'Featured press coverage',
      'Advanced analytics',
      'Priority support',
    ],
  },
  legacy: {
    name: 'Legacy',
    price: '₹20,000 one-time',
    description: 'For icons—preserve your eternal impact',
    icon: Trophy,
    color: '#8B4513',
    fieldCount: 10,
    features: [
      'Everything in Elite',
      'Comprehensive timeline',
      'Tribute collection',
      'Archival documentation',
      'Future vision section',
      'Enduring contributions',
      'Premium preservation',
      'White-glove service',
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

        {/* Tier Cards */}
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          spacing={6}
          w="full"
          maxW="1200px"
        >
          {(Object.entries(TIER_CONFIGS) as [ProfileTier, TierConfig][]).map(
            ([tier, config]) => {
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
                      {/* Icon & Title */}
                      <HStack spacing={3}>
                        <Icon
                          size={32}
                          color={config.color}
                        />
                        <VStack spacing={0} align="start">
                          <Heading
                            as="h3"
                            fontSize="xl"
                            fontFamily="'Playfair Display', serif"
                            color="#1A1A1A"
                          >
                            {config.name}
                          </Heading>
                          <Text
                            fontSize="lg"
                            fontWeight="700"
                            color="#D4AF37"
                          >
                            {config.price}
                          </Text>
                        </VStack>
                      </HStack>

                      {/* Description */}
                      <Text
                        fontSize="sm"
                        color="#8B8680"
                        lineHeight="1.5"
                      >
                        {config.description}
                      </Text>

                      {/* Field Count */}
                      <Badge
                        colorScheme="gray"
                        variant="subtle"
                        fontSize="xs"
                      >
                        {config.fieldCount} Profile Sections
                      </Badge>

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
          Continue with {TIER_CONFIGS[effectiveTier].name}
        </Button>
      </VStack>
    </MotionBox>
  )
}
