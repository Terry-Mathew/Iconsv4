'use client'

import { Box, BoxProps } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

const MotionBox = motion.create(Box)

interface FloatingCardProps extends Omit<BoxProps, 'children'> {
  children: ReactNode
  variant?: 'default' | 'glass' | 'premium'
  hoverEffect?: boolean
  animationDelay?: number
}

export function FloatingCard({
  children,
  variant = 'default',
  hoverEffect = true,
  animationDelay = 0,
  ...props
}: FloatingCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'glass':
        return {
          bg: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)'
        }
      case 'premium':
        return {
          bg: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          boxShadow: `
            0 32px 64px rgba(0, 0, 0, 0.25),
            0 8px 16px rgba(0, 0, 0, 0.1),
            0 0 40px rgba(255, 255, 255, 0.08)
          `
        }
      default:
        return {
          bg: '#FFFFFF',
          border: '1px solid rgba(212, 175, 55, 0.1)',
          boxShadow: `
            0 32px 64px rgba(0, 0, 0, 0.25),
            0 8px 16px rgba(0, 0, 0, 0.1),
            0 0 40px rgba(255, 255, 255, 0.08)
          `
        }
    }
  }

  const hoverStyles = hoverEffect ? {
    transform: 'translateY(-12px)',
    boxShadow: `
      0 40px 80px rgba(0, 0, 0, 0.3),
      0 12px 24px rgba(0, 0, 0, 0.15),
      0 0 60px rgba(212, 175, 55, 0.3)
    `,
    borderColor: 'rgba(212, 175, 55, 0.2)'
  } : {}

  return (
    <MotionBox
      borderRadius="24px"
      p={12}
      color="#1A1A1A"
      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={hoverStyles}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: animationDelay,
        ease: 'easeOut'
      }}
      {...getVariantStyles()}
      {...props}
    >
      {children}
    </MotionBox>
  )
}