'use client'

import { useState, useEffect } from 'react'
import { Box, IconButton } from '@chakra-ui/react'
import { ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { scrollToElement } from '@/components/providers/LenisProvider'

const MotionBox = motion(Box)
const MotionIconButton = motion(IconButton)

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show button after 50% scroll
      const scrolled = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollPercentage = scrolled / (documentHeight - windowHeight)
      
      setIsVisible(scrollPercentage > 0.5)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    if (window.lenis) {
      // @ts-ignore
      window.lenis.scrollTo(0, { duration: 1.5 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <MotionBox
          position="fixed"
          bottom={8}
          right={8}
          zIndex={1000}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ 
            duration: 0.3, 
            ease: [0.4, 0, 0.2, 1] 
          }}
        >
          <MotionIconButton
            aria-label="Back to top"
            icon={<ChevronUp size={20} />}
            onClick={scrollToTop}
            bg="#D4AF37"
            color="white"
            size="lg"
            borderRadius="full"
            boxShadow="0 4px 20px rgba(212, 175, 55, 0.3)"
            _hover={{
              bg: "#B8941F",
              transform: "translateY(-2px)",
              boxShadow: "0 6px 25px rgba(212, 175, 55, 0.4)"
            }}
            _active={{
              transform: "translateY(0px)"
            }}
            transition="all 0.2s ease"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          />
        </MotionBox>
      )}
    </AnimatePresence>
  )
}
