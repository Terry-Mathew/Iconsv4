'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  useBreakpointValue,
} from '@chakra-ui/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
// Using CSS transitions instead of anime.js for better compatibility
import * as THREE from 'three'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface Category {
  title: string
  description: string
  rationale: string
  icon: string
}

const categories: Category[] = [
  {
    title: "Established Leaders",
    description: "Accomplished executives, pioneers, thinkers, and changemakers whose visions have reshaped horizons.",
    rationale: "These icons form the cornerstone of prestige that draws discerning eyes to our platform.",
    icon: "👑"
  },
  {
    title: "Established Professionals", 
    description: "Respected doctors, lawyers, scientists, and civil servants whose expertise commands reverence.",
    rationale: "Broadening the essence of icons to those mastering specialized realms of human knowledge.",
    icon: "🎓"
  },
  {
    title: "Business Icons",
    description: "Entrepreneurs, founders, CEOs, and titans of industry, whose empires inspire networks of innovation.",
    rationale: "Their success stories become blueprints for ambitious minds seeking to build lasting enterprises.",
    icon: "💼"
  },
  {
    title: "Innovators",
    description: "Trailblazers at the vanguard of ideas, technologies, and solutions, forging paths that beckon the future.",
    rationale: "These visionaries push boundaries and create tomorrow's possibilities today.",
    icon: "🚀"
  },
  {
    title: "Academics & Scholars",
    description: "Distinguished professors, researchers, and institutional leaders, infusing the archive with intellectual depth.",
    rationale: "Their scholarly authority elevates the platform's credibility and attracts knowledge seekers.",
    icon: "📚"
  },
  {
    title: "Philanthropists & Humanitarians",
    description: "Guardians of social good, whose contributions to causes and communities embody moral legacy.",
    rationale: "Their compassionate leadership inspires others to create positive change in the world.",
    icon: "❤️"
  },
  {
    title: "Creatives & Performers",
    description: "Artists, authors, musicians, and culture-shapers, whose works resonate across time and borders.",
    rationale: "Cultural icons who define artistic movements and inspire creative expression globally.",
    icon: "🎨"
  },
  {
    title: "Politicians & Public Figures",
    description: "Elected visionaries and policy influencers, steering societal currents with enduring impact.",
    rationale: "Leaders who shape governance and public discourse, leaving lasting institutional legacies.",
    icon: "🏛️"
  },
  {
    title: "Rising Professionals",
    description: "Emerging talents with undeniable momentum, planting seeds for tomorrow's legends.",
    rationale: "Early identification of future icons creates exclusive access to rising stars.",
    icon: "⭐"
  },
  {
    title: "Legacy Icons",
    description: "Honored in memoriam, these timeless figures receive eternal spotlight.",
    rationale: "Bridging past wisdom with future inspiration, preserving greatness for generations.",
    icon: "🕊️"
  }
]

interface CategoryCardProps {
  category: Category
  index: number
  isActive: boolean
}

function CategoryCard({ category, index, isActive }: CategoryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [supportsWebGL, setSupportsWebGL] = useState(false) // Disabled for performance

  // Initialize Three.js scene for 3D tilt effect
  useEffect(() => {
    if (!supportsWebGL || !cardRef.current) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    
    // Create scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    
    renderer.setSize(rect.width, rect.height)
    renderer.setClearColor(0x000000, 0)
    
    sceneRef.current = scene
    rendererRef.current = renderer
    
    camera.position.z = 5

    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
    }
  }, [supportsWebGL])

  // Handle hover animations with CSS transitions
  const handleMouseEnter = () => {
    setIsHovered(true)
    setIsExpanded(true)

    if (cardRef.current) {
      // Apply CSS transforms directly
      cardRef.current.style.transform = supportsWebGL
        ? 'perspective(1000px) rotateX(-5deg) rotateY(5deg) scale(1.05)'
        : 'scale(1.05)'
      cardRef.current.style.boxShadow = '0 20px 60px rgba(212, 175, 55, 0.4)'
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setIsExpanded(false)

    if (cardRef.current) {
      // Reset transforms
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
      cardRef.current.style.boxShadow = '0 8px 32px rgba(212, 175, 55, 0.2)'
    }
  }

  return (
    <Box
      ref={cardRef}
      w="320px"
      h="400px"
      bg="ivory.50"
      borderRadius="2xl"
      border="3px solid"
      borderColor="gold.500"
      boxShadow="0 8px 32px rgba(212, 175, 55, 0.2)"
      p={6}
      cursor="pointer"
      position="relative"
      overflow="hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`${category.title} category`}
      aria-expanded={isExpanded}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      transformOrigin="center"
      _focus={{
        outline: '3px solid',
        outlineColor: 'gold.500',
        outlineOffset: '2px'
      }}
      _hover={{
        borderColor: 'gold.600'
      }}
    >
      {/* Gold frame effect */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        borderRadius="2xl"
        background="linear-gradient(45deg, transparent 30%, rgba(212, 175, 55, 0.1) 50%, transparent 70%)"
        pointerEvents="none"
      />

      <VStack spacing={4} align="start" h="full">
        {/* Icon and Title */}
        <HStack spacing={4} w="full">
          <Text fontSize="3xl" role="img" aria-label={`${category.title} icon`}>
            {category.icon}
          </Text>
          <VStack align="start" spacing={1} flex={1}>
            <Heading 
              size="lg" 
              color="charcoal.900" 
              fontFamily="heading"
              lineHeight="short"
            >
              {category.title}
            </Heading>
            <HStack spacing={2}>
              <Star size={16} color="#D4AF37" />
              <Text fontSize="xs" color="gold.600" fontWeight="medium">
                PREMIUM CATEGORY
              </Text>
            </HStack>
          </VStack>
        </HStack>

        {/* Base description - always visible */}
        <Text 
          fontSize="sm" 
          color="charcoal.700" 
          lineHeight="tall"
          noOfLines={3}
        >
          {category.description}
        </Text>

        {/* Expanded content - shown on hover */}
        <Box
          className="expanded-content"
          opacity={isExpanded ? 1 : 0}
          transform={isExpanded ? 'translateY(0)' : 'translateY(20px)'}
          transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
          w="full"
          maxH={isExpanded ? "200px" : "0px"}
          overflow="hidden"
        >
          <VStack spacing={3} align="start">
            <Box>
              <Text
                className="description-text"
                fontSize="sm"
                color="charcoal.600"
                lineHeight="tall"
                opacity={isExpanded ? 1 : 0}
                transform={isExpanded ? 'translateY(0)' : 'translateY(10px)'}
                transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s"
              >
                {category.description}
              </Text>
            </Box>

            <Box>
              <Text
                fontSize="xs"
                color="gold.600"
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="wide"
                opacity={isExpanded ? 1 : 0}
                transform={isExpanded ? 'translateY(0)' : 'translateY(10px)'}
                transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.15s"
              >
                Strategic Rationale
              </Text>
              <Text
                className="rationale-text"
                fontSize="xs"
                color="charcoal.500"
                lineHeight="tall"
                fontStyle="italic"
                opacity={isExpanded ? 1 : 0}
                transform={isExpanded ? 'translateY(0)' : 'translateY(10px)'}
                transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.2s"
              >
                {category.rationale}
              </Text>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}

export function CategoriesCarousel() {
  const swiperRef = useRef<any>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const isMobile = useBreakpointValue({ base: true, md: false })

  const swiperConfig = {
    modules: [Autoplay, Navigation, Pagination],
    slidesPerView: 'auto' as const,
    spaceBetween: 24,
    centeredSlides: true,
    loop: true,
    autoplay: {
      delay: 2000,
      pauseOnMouseEnter: true,
      disableOnInteraction: false,
    },
    navigation: {
      prevEl: '.swiper-button-prev-custom',
      nextEl: '.swiper-button-next-custom',
    },
    pagination: {
      el: '.swiper-pagination-custom',
      clickable: true,
      bulletClass: 'custom-bullet',
      bulletActiveClass: 'custom-bullet-active',
    },
    breakpoints: {
      320: {
        slidesPerView: 1.2,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 2.5,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 3.5,
        spaceBetween: 24,
      },
    },
    onSlideChange: (swiper: any) => {
      setActiveIndex(swiper.realIndex)
    },
  }

  return (
    <Box py={20} id="categories" bg="cream.50">
      <Container maxW="full">
        <VStack spacing={12}>
          {/* Header */}
          <VStack spacing={6} textAlign="center" maxW="4xl" mx="auto">
            <Heading
              as="h2"
              size="3xl"
              fontFamily="heading"
              color="charcoal.900"
              fontWeight="bold"
            >
              Who Belongs in the Vault
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color="charcoal.700"
              fontFamily="body"
              lineHeight="tall"
            >
              ICONS HERALD honors a diverse constellation of visionaries, each category a thread 
              in the tapestry of enduring influence. Our editorial curation ensures only the most 
              remarkable find their place here.
            </Text>
          </VStack>

          {/* Carousel Container */}
          <Box position="relative" w="full" overflow="hidden">
            {/* Navigation Buttons */}
            {!isMobile && (
              <>
                <Box
                  className="swiper-button-prev-custom"
                  position="absolute"
                  left={4}
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex={10}
                  w={12}
                  h={12}
                  bg="gold.500"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                  boxShadow="0 4px 16px rgba(212, 175, 55, 0.3)"
                  _hover={{
                    bg: 'gold.600',
                    transform: 'translateY(-50%) scale(1.1)',
                  }}
                  transition="all 0.2s ease"
                >
                  <ChevronLeft size={20} color="white" />
                </Box>
                
                <Box
                  className="swiper-button-next-custom"
                  position="absolute"
                  right={4}
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex={10}
                  w={12}
                  h={12}
                  bg="gold.500"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  cursor="pointer"
                  boxShadow="0 4px 16px rgba(212, 175, 55, 0.3)"
                  _hover={{
                    bg: 'gold.600',
                    transform: 'translateY(-50%) scale(1.1)',
                  }}
                  transition="all 0.2s ease"
                >
                  <ChevronRight size={20} color="white" />
                </Box>
              </>
            )}

            {/* Swiper Carousel */}
            <Swiper
              ref={swiperRef}
              {...swiperConfig}
              style={{ paddingBottom: '60px' }}
            >
              {categories.map((category, index) => (
                <SwiperSlide key={index} style={{ width: 'auto' }}>
                  <CategoryCard 
                    category={category} 
                    index={index}
                    isActive={index === activeIndex}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Pagination */}
            <Box
              className="swiper-pagination-custom"
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={2}
              mt={8}
            />
          </Box>

          {/* Footer Text */}
          <Text
            fontSize="lg"
            color="charcoal.600"
            fontFamily="accent"
            fontStyle="italic"
            textAlign="center"
            maxW="3xl"
          >
            This selective mosaic maximizes our platform's allure, inviting those who define 
            excellence to join an ecosystem of prestige and possibility.
          </Text>
        </VStack>
      </Container>

      {/* Custom Styles */}
      <style jsx global>{`
        .custom-bullet {
          width: 12px;
          height: 12px;
          background: rgba(212, 175, 55, 0.3);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .custom-bullet-active {
          background: #D4AF37;
          transform: scale(1.2);
        }
        
        .swiper-slide {
          height: auto;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .swiper-slide,
          .custom-bullet {
            transition: none;
          }
        }
      `}</style>
    </Box>
  )
}
