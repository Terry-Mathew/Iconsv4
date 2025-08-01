'use client'

import { Box, Container } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { Navbar } from '@/components/ui/Navbar'
import { PremiumFooter } from '@/components/sections/PremiumFooter'

const MotionBox = motion.create(Box)

interface PageLayoutProps {
  children: ReactNode
  showNavbar?: boolean
  showFooter?: boolean
  maxWidth?: string
  containerPadding?: number | string
}

export function PageLayout({
  children,
  showNavbar = true,
  showFooter = true,
  maxWidth = "6xl",
  containerPadding = 0
}: PageLayoutProps) {
  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)"
      color="white"
      position="relative"
      _before={{
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.02) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.01) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
        zIndex: -1
      }}
    >
      {showNavbar && <Navbar />}

      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        pt={showNavbar ? "80px" : 0}
      >
        {containerPadding ? (
          <Container maxW={maxWidth} py={containerPadding}>
            {children}
          </Container>
        ) : (
          children
        )}
      </MotionBox>

      {showFooter && <PremiumFooter />}
    </Box>
  )
}