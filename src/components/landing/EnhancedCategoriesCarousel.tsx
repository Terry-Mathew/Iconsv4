'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  useBreakpointValue,
  IconButton,
} from '@chakra-ui/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination, FreeMode } from 'swiper/modules'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/free-mode'

const MotionBox = motion(Box)

interface Category {
  title: string
  description: string
  rationale: string
  icon: string
}

const categories: Category[] = [
  {
    title: "Established Leaders",
    description: "Visionary CEOs who built empires from ideas, Nobel laureates who redefined science, and cultural architects whose influence spans generations. These are the titans whose decisions echo through history.",
    rationale: "The cornerstone of our archive—legends whose presence elevates every conversation and attracts the world's most discerning minds.",
    icon: "👑"
  },
  {
    title: "Established Professionals",
    description: "Surgeons who pioneered life-saving techniques, Supreme Court justices who shaped law, and diplomats who brokered peace. Masters of their craft with decades of unparalleled expertise.",
    rationale: "Professional excellence at its apex—these icons represent the gold standard in specialized knowledge and ethical leadership.",
    icon: "🎓"
  },
  {
    title: "Business Icons",
    description: "Founders who transformed industries overnight, investors with Midas touch, and CEOs who turned startups into global phenomena. The architects of modern commerce and innovation.",
    rationale: "Their entrepreneurial DNA and strategic brilliance create a magnetic ecosystem for ambitious minds seeking mentorship and inspiration.",
    icon: "💼"
  },
  {
    title: "Innovators",
    description: "Tech pioneers who invented the future, scientists who cracked impossible codes, and designers who reimagined human experience. The minds behind tomorrow's breakthroughs.",
    rationale: "Innovation attracts innovation—their presence signals cutting-edge thinking and draws fellow visionaries to our exclusive community.",
    icon: "🚀"
  },
  {
    title: "Academics & Scholars",
    description: "University presidents who shaped minds, researchers whose discoveries changed medicine, and philosophers who redefined human understanding. The intellectual backbone of civilization.",
    rationale: "Academic prestige and scholarly rigor elevate our platform's credibility, attracting knowledge seekers and thought leaders worldwide.",
    icon: "📚"
  },
  {
    title: "Philanthropists & Humanitarians",
    description: "Billionaire philanthropists who tackle global challenges, humanitarian leaders who've saved millions, and social entrepreneurs who turned compassion into systemic change.",
    rationale: "Their moral authority and global impact attract conscious leaders and create powerful networks for positive transformation.",
    icon: "❤️"
  },
  {
    title: "Creatives & Performers",
    description: "Oscar-winning directors who defined cinema, bestselling authors who captured zeitgeists, and musicians whose melodies became cultural anthems. The artists who shape collective memory.",
    rationale: "Cultural influence transcends industries—their creative genius attracts fellow artists and culturally sophisticated audiences.",
    icon: "🎨"
  },
  {
    title: "Politicians & Public Figures",
    description: "Presidents who navigated historic crises, diplomats who prevented wars, and policy architects whose legislation transformed societies. The shapers of our shared destiny.",
    rationale: "Political gravitas and institutional knowledge create unparalleled networking opportunities for those who influence public discourse.",
    icon: "🏛️"
  },
  {
    title: "Rising Professionals",
    description: "Young CEOs disrupting trillion-dollar industries, breakthrough researchers on Nobel tracks, and emerging leaders already reshaping their fields before age 35.",
    rationale: "Early access to tomorrow's legends—identifying and connecting with future icons before they become household names.",
    icon: "⭐"
  },
  {
    title: "Legacy Icons",
    description: "Departed luminaries whose contributions transcend mortality—from Einstein's theories to Gandhi's philosophy. Eternal wisdom preserved in digital perpetuity.",
    rationale: "Timeless inspiration bridges past genius with future ambition, creating profound connections across generations.",
    icon: "🕊️"
  }
]

interface CategoryCardProps {
  category: Category
  index: number
  isActive: boolean
}

function CategoryCard({ category, index, isActive }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    setIsExpanded(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setIsExpanded(false)
  }

  return (
    <MotionBox
      w={{ base: "280px", md: "320px" }}
      h={{ base: "380px", md: "400px" }}
      minH="350px"
      bg="ivory.50"
      borderRadius="2xl"
      border="3px solid"
      borderColor={isHovered ? "gold.600" : "gold.500"}
      p={{ base: 5, md: 6 }}
      cursor="pointer"
      position="relative"
      overflow="hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="article"
      tabIndex={0}
      aria-label={`${category.title} category: ${category.description}`}
      aria-expanded={isExpanded}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setIsExpanded(!isExpanded)
        }
      }}
      whileHover={{
        scale: 1.03,
        rotateY: 1,
        rotateX: -1,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
        duration: 0.8
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      boxShadow={isHovered 
        ? "0 25px 60px rgba(212, 175, 55, 0.4)" 
        : "0 8px 32px rgba(212, 175, 55, 0.2)"
      }
      _focus={{
        outline: '3px solid',
        outlineColor: 'gold.500',
        outlineOffset: '2px'
      }}
    >
      {/* Background Pattern */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.03}
        backgroundImage="radial-gradient(circle at 25% 25%, currentColor 2px, transparent 2px)"
        backgroundSize="20px 20px"
        color="gold.500"
        pointerEvents="none"
      />

      {/* Content */}
      <VStack spacing={{ base: 3, md: 4 }} align="start" h="full" position="relative" zIndex={1}>
        {/* Header */}
        <HStack spacing={{ base: 2, md: 3 }} w="full">
          <MotionBox
            fontSize={{ base: "2xl", md: "3xl" }}
            animate={{
              rotate: isHovered ? 15 : 0,
              scale: isHovered ? 1.1 : 1
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut"
            }}
          >
            {category.icon}
          </MotionBox>
          <VStack align="start" spacing={1} flex={1}>
            <Heading
              as="h3"
              fontSize="clamp(1rem, 2vw, 1.25rem)"
              fontFamily="heading"
              color="charcoal.900"
              fontWeight="bold"
              lineHeight="short"
            >
              {category.title}
            </Heading>
            <HStack spacing={2}>
              <Box w={2} h={2} bg="gold.500" borderRadius="full" />
              <Text
                fontSize="clamp(0.625rem, 1vw, 0.75rem)"
                color="gold.600"
                fontWeight="bold"
                textTransform="uppercase"
              >
                PREMIUM CATEGORY
              </Text>
            </HStack>
          </VStack>
        </HStack>

        {/* Base Description */}
        <Text
          fontSize="clamp(0.75rem, 1.5vw, 0.875rem)"
          color="charcoal.600"
          lineHeight="tall"
          flex={1}
          minH="60px"
        >
          {category.description}
        </Text>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <MotionBox
              initial={{ opacity: 0, height: 0, y: 10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
                staggerChildren: 0.1
              }}
              w="full"
            >
              <VStack spacing={3} align="start">
                <Box>
                  <Text 
                    fontSize="xs" 
                    color="gold.600" 
                    fontWeight="bold" 
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    Strategic Rationale
                  </Text>
                  <Text 
                    fontSize="xs" 
                    color="charcoal.500" 
                    lineHeight="tall"
                    fontStyle="italic"
                  >
                    {category.rationale}
                  </Text>
                </Box>
              </VStack>
            </MotionBox>
          )}
        </AnimatePresence>
      </VStack>
    </MotionBox>
  )
}

export function EnhancedCategoriesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<any>(null)
  // Removed navigation arrows to avoid conflict with auto-scroll
  // const showNavigation = useBreakpointValue({ base: false, md: true })

  const swiperConfig = {
    modules: [Autoplay, Pagination, FreeMode],
    slidesPerView: 'auto' as const,
    spaceBetween: 24,
    centeredSlides: true,
    loop: true,
    lazy: true, // Enable lazy loading for performance
    preloadImages: false,
    watchSlidesProgress: true,
    freeMode: {
      enabled: true,
      sticky: true,
      momentumRatio: 0.2,
      momentumVelocityRatio: 0.2,
    },
    autoplay: {
      delay: 4500, // Slower for better readability
      pauseOnMouseEnter: true,
      disableOnInteraction: false,
      waitForTransition: true,
    },
    speed: 800, // Smoother transitions
    // Removed navigation to avoid conflict with auto-scroll
    navigation: false,
    pagination: {
      el: '.swiper-pagination-custom',
      clickable: true,
      bulletClass: 'custom-bullet',
      bulletActiveClass: 'custom-bullet-active',
      renderBullet: (index: number, className: string) => {
        return `<span class="${className}" role="tab" aria-label="Go to slide ${index + 1}"></span>`
      },
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
    // Performance optimizations
    updateOnWindowResize: true,
    observer: true,
    observeParents: true,
  }

  return (
    <Box
      py={{ base: 8, md: 12, lg: 20 }}
      bg="cream.50"
      position="relative"
      data-parallax="0.3"
      minH={{ base: "600px", md: "700px", lg: "800px" }}
    >
      <Container maxW="7xl">
        <VStack spacing={{ base: 8, md: 10, lg: 12 }}>
          {/* Header */}
          <VStack spacing={{ base: 4, md: 6 }} textAlign="center" maxW="4xl">
            <Heading
              as="h2"
              fontSize="clamp(1.75rem, 4vw, 3rem)"
              fontFamily="heading"
              color="charcoal.900"
              fontWeight="400"
              lineHeight="short"
            >
              Who Belongs in the Vault
            </Heading>
            <Text
              fontSize="clamp(1rem, 2vw, 1.25rem)"
              color="charcoal.600"
              fontFamily="body"
              lineHeight="tall"
              maxW="3xl"
            >
              ICONS HERALD honors a diverse constellation of visionaries, each category a thread in the tapestry of enduring influence. Our editorial curation ensures only the most remarkable find their place here.
            </Text>
          </VStack>

          {/* Enhanced Carousel */}
          <Box position="relative" w="full">

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

            {/* Luxury Pagination */}
            <Box
              className="swiper-pagination-custom"
              display="flex"
              justifyContent="center"
              mt={12}
              gap={3}
              role="tablist"
              aria-label="Category navigation"
            />
          </Box>

          {/* Footer Text */}
          <Text
            fontSize="clamp(0.875rem, 1.5vw, 1.125rem)"
            color="charcoal.600"
            fontFamily="body"
            textAlign="center"
            maxW="4xl"
            fontStyle="italic"
            lineHeight="tall"
          >
            This selective mosaic maximizes our platform's allure, inviting those who define excellence to join an ecosystem of prestige and possibility.
          </Text>
        </VStack>
      </Container>

      {/* Luxury Pagination Styles */}
      <style jsx global>{`
        .custom-bullet {
          width: 32px;
          height: 4px;
          background: rgba(212, 175, 55, 0.25);
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .custom-bullet::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transition: left 0.6s ease;
        }

        .custom-bullet-active {
          background: #D4AF37;
          transform: scaleX(1.5);
          box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4);
        }

        .custom-bullet-active::before {
          left: 100%;
        }

        .custom-bullet:hover {
          background: rgba(212, 175, 55, 0.6);
          transform: scaleY(1.5);
        }
      `}</style>
    </Box>
  )
}
