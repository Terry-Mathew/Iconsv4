'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  IconButton,
  useBreakpointValue,
  Collapse,
  Flex
} from '@chakra-ui/react'
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion'
import { ChevronLeft, ChevronRight, GripHorizontal } from 'lucide-react'
import { categories, CategoryData } from '@/lib/data/categories'

const MotionBox = motion.create(Box)
const MotionCard = motion.create(Card)
const MotionFlex = motion.create(Flex)

interface CategoriesCarouselProps {
  autoScroll?: boolean
  autoScrollInterval?: number
  showArrows?: boolean
  className?: string
}

export function CategoriesCarousel({
  autoScroll = true,
  autoScrollInterval = 4000,
  showArrows = false,
  className
}: CategoriesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isAutoScrollPaused, setIsAutoScrollPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoScrollRef = useRef<NodeJS.Timeout>()

  // Responsive settings
  const cardsToShow = useBreakpointValue({ base: 1, md: 2, lg: 3, xl: 4 }) || 1
  const cardWidth = useBreakpointValue({ base: '100%', md: '50%', lg: '33.333%', xl: '25%' }) || '100%'
  const dragConstraints = {
    left: -(categories.length - cardsToShow) * (100 / cardsToShow),
    right: 0
  }

  // Auto-scroll functionality
  const nextSlide = useCallback(() => {
    if (!isAutoScrollPaused && !isDragging) {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, categories.length - cardsToShow + 1))
    }
  }, [cardsToShow, isAutoScrollPaused, isDragging])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, categories.length - cardsToShow + 1)) % Math.max(1, categories.length - cardsToShow + 1))
  }, [cardsToShow])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  // Auto-scroll effect
  useEffect(() => {
    if (autoScroll && !showArrows) {
      autoScrollRef.current = setInterval(nextSlide, autoScrollInterval)
      return () => {
        if (autoScrollRef.current) {
          clearInterval(autoScrollRef.current)
        }
      }
    }
  }, [autoScroll, autoScrollInterval, nextSlide, showArrows])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        prevSlide()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        nextSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  // Drag handlers
  const handleDragStart = () => {
    setIsDragging(true)
    setIsAutoScrollPaused(true)
  }

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    setIsAutoScrollPaused(false)

    const threshold = 50
    if (info.offset.x > threshold && currentIndex > 0) {
      prevSlide()
    } else if (info.offset.x < -threshold && currentIndex < categories.length - cardsToShow) {
      nextSlide()
    }
  }

  // Mouse enter/leave handlers for auto-scroll pause
  const handleMouseEnter = () => {
    setIsAutoScrollPaused(true)
  }

  const handleMouseLeave = () => {
    setIsAutoScrollPaused(false)
  }

  const maxSlides = Math.max(1, categories.length - cardsToShow + 1)

  return (
    <Box className={className} py={16} bg="linear-gradient(135deg, #FDF6E3 0%, #F5E6D3 100%)">
      <Container maxW="7xl">
        <VStack spacing={12} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading
              as="h2"
              fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
              fontFamily="'Playfair Display', serif"
              color="#1A1A1A"
              fontWeight="400"
            >
              Discover Icons Across
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color="#666"
              fontFamily="'Lato', sans-serif"
              maxW="2xl"
            >
              Explore the diverse categories of exceptional individuals who shape our world
            </Text>
          </VStack>

          {/* Carousel Container */}
          <Box
            position="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            cursor={isDragging ? 'grabbing' : 'grab'}
            role="region"
            aria-label="Categories carousel"
            tabIndex={0}
          >
            <MotionFlex
              ref={containerRef}
              drag="x"
              dragConstraints={dragConstraints}
              dragElastic={0.1}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              animate={{
                x: `-${currentIndex * (100 / cardsToShow)}%`
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                duration: 0.8
              }}
              style={{
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
            >
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                  isHovered={hoveredCard === category.id}
                  onHover={setHoveredCard}
                  cardWidth={cardWidth}
                  currentIndex={currentIndex}
                  cardsToShow={cardsToShow}
                />
              ))}
            </MotionFlex>

            {/* Navigation Arrows (only if showArrows is true) */}
            {showArrows && (
              <>
                <IconButton
                  aria-label="Previous categories"
                  icon={<ChevronLeft size={24} />}
                  position="absolute"
                  left={4}
                  top="50%"
                  transform="translateY(-50%)"
                  bg="white"
                  color="#D4AF37"
                  border="2px solid #D4AF37"
                  borderRadius="full"
                  size="lg"
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                  _hover={{
                    bg: '#D4AF37',
                    color: 'white',
                    transform: 'translateY(-50%) scale(1.1)'
                  }}
                  _disabled={{
                    opacity: 0.5,
                    cursor: 'not-allowed'
                  }}
                  zIndex={2}
                />
                <IconButton
                  aria-label="Next categories"
                  icon={<ChevronRight size={24} />}
                  position="absolute"
                  right={4}
                  top="50%"
                  transform="translateY(-50%)"
                  bg="white"
                  color="#D4AF37"
                  border="2px solid #D4AF37"
                  borderRadius="full"
                  size="lg"
                  onClick={nextSlide}
                  disabled={currentIndex >= maxSlides - 1}
                  _hover={{
                    bg: '#D4AF37',
                    color: 'white',
                    transform: 'translateY(-50%) scale(1.1)'
                  }}
                  _disabled={{
                    opacity: 0.5,
                    cursor: 'not-allowed'
                  }}
                  zIndex={2}
                />
              </>
            )}
          </Box>

          {/* Progress Dots */}
          <HStack justify="center" spacing={3}>
            {Array.from({ length: maxSlides }).map((_, index) => (
              <MotionBox
                key={index}
                w={currentIndex === index ? 12 : 3}
                h={3}
                bg={currentIndex === index ? '#D4AF37' : 'rgba(212, 175, 55, 0.3)'}
                borderRadius="full"
                cursor="pointer"
                onClick={() => goToSlide(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                  width: currentIndex === index ? 48 : 12,
                  backgroundColor: currentIndex === index ? '#D4AF37' : 'rgba(212, 175, 55, 0.3)'
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30
                }}
                aria-label={`Go to slide ${index + 1}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    goToSlide(index)
                  }
                }}
              />
            ))}
          </HStack>
        </VStack>
      </Container>
    </Box>
  )
}

interface CategoryCardProps {
  category: CategoryData
  index: number
  isHovered: boolean
  onHover: (id: string | null) => void
  cardWidth: string
  currentIndex: number
  cardsToShow: number
}

function CategoryCard({
  category,
  index,
  isHovered,
  onHover,
  cardWidth,
  currentIndex,
  cardsToShow
}: CategoryCardProps) {
  const IconComponent = category.icon
  const isVisible = index >= currentIndex && index < currentIndex + cardsToShow

  return (
    <MotionBox
      flex={`0 0 ${cardWidth}`}
      px={4}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{
        opacity: isVisible ? 1 : 0.7,
        y: 0,
        scale: isHovered ? 1.05 : 1
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        delay: index * 0.1
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      }}
      onMouseEnter={() => onHover(category.id)}
      onMouseLeave={() => onHover(null)}
      role="article"
      aria-label={`${category.name} category`}
    >
      <MotionCard
        h="auto"
        minH="320px"
        bg="white"
        borderRadius="20px"
        overflow="hidden"
        boxShadow={isHovered ? "0 20px 60px rgba(212, 175, 55, 0.2)" : "0 8px 30px rgba(0, 0, 0, 0.1)"}
        border={isHovered ? "2px solid #D4AF37" : "2px solid transparent"}
        position="relative"
        cursor="pointer"
        animate={{
          boxShadow: isHovered
            ? "0 20px 60px rgba(212, 175, 55, 0.2)"
            : "0 8px 30px rgba(0, 0, 0, 0.1)",
          borderColor: isHovered ? "#D4AF37" : "transparent"
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Gradient Background */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="120px"
          background={category.gradient}
          opacity={0.1}
        />

        <CardBody p={8} position="relative" zIndex={1}>
          <VStack spacing={6} align="center" textAlign="center">
            {/* Icon */}
            <MotionBox
              w={16}
              h={16}
              bg={isHovered ? category.color : "gray.100"}
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color={isHovered ? "white" : "gray.500"}
              animate={{
                backgroundColor: isHovered ? category.color : "#F7FAFC",
                color: isHovered ? "white" : "#A0AEC0",
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? 5 : 0
              }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <IconComponent size={32} />
            </MotionBox>

            {/* Category Name */}
            <Heading
              as="h3"
              fontSize="xl"
              fontFamily="'Playfair Display', serif"
              color="#1A1A1A"
              fontWeight="600"
              lineHeight="1.2"
              textAlign="center"
            >
              {category.name}
            </Heading>

            {/* Description with Accordion Effect */}
            <Collapse in={isHovered} animateOpacity>
              <MotionBox
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  height: isHovered ? 'auto' : 0
                }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <Text
                  fontSize="sm"
                  color="#666"
                  fontFamily="'Lato', sans-serif"
                  lineHeight="1.6"
                  textAlign="center"
                  px={2}
                >
                  {category.description}
                </Text>
              </MotionBox>
            </Collapse>

            {/* Always visible short description */}
            {!isHovered && (
              <Text
                fontSize="sm"
                color="#999"
                fontFamily="'Lato', sans-serif"
                lineHeight="1.4"
                textAlign="center"
                noOfLines={2}
              >
                {category.description.split('.')[0]}.
              </Text>
            )}
          </VStack>

          {/* Hover Glow Effect */}
          <MotionBox
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            borderRadius="20px"
            background={`linear-gradient(135deg, ${category.color}20, transparent)`}
            opacity={isHovered ? 1 : 0}
            transition={{ duration: 0.3 }}
            pointerEvents="none"
          />
        </CardBody>
      </MotionCard>
    </MotionBox>
  )
}
