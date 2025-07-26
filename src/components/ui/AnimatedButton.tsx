'use client'

import { forwardRef, ReactNode } from 'react'
import { Button, ButtonProps } from '@chakra-ui/react'
import { motion, HTMLMotionProps } from 'framer-motion'

type MotionButtonProps = Omit<HTMLMotionProps<'button'>, keyof ButtonProps> & ButtonProps

interface AnimatedButtonProps extends MotionButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  animation?: 'scale' | 'lift' | 'glow' | 'pulse'
  isLoading?: boolean
  loadingText?: string
  className?: string
}

const MotionButton = motion(Button)

const animationVariants = {
  scale: {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      duration: 0.3,
    },
  },
  lift: {
    hover: { 
      y: -2, 
      boxShadow: '0 8px 25px rgba(212, 175, 55, 0.3)' 
    },
    tap: { y: 0 },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
      duration: 0.3,
    },
  },
  glow: {
    hover: { 
      boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
      borderColor: '#D4AF37',
    },
    tap: { scale: 0.98 },
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  pulse: {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
    transition: {
      repeat: Infinity,
      repeatType: 'reverse' as const,
      duration: 1,
      ease: 'easeInOut',
    },
  },
}

const variantStyles = {
  primary: {
    bg: '#D4AF37',
    color: 'white',
    _hover: {
      bg: '#B8941F',
    },
    _active: {
      bg: '#A67C1A',
    },
    _focus: {
      boxShadow: '0 0 0 3px rgba(212, 175, 55, 0.3)',
    },
  },
  secondary: {
    bg: '#8B7355',
    color: 'white',
    _hover: {
      bg: '#6B5B47',
    },
    _active: {
      bg: '#5A4A38',
    },
    _focus: {
      boxShadow: '0 0 0 3px rgba(139, 115, 85, 0.3)',
    },
  },
  ghost: {
    bg: 'transparent',
    color: '#D4AF37',
    _hover: {
      bg: 'rgba(212, 175, 55, 0.1)',
    },
    _active: {
      bg: 'rgba(212, 175, 55, 0.2)',
    },
    _focus: {
      boxShadow: '0 0 0 3px rgba(212, 175, 55, 0.3)',
    },
  },
  outline: {
    bg: 'transparent',
    color: '#D4AF37',
    border: '2px solid #D4AF37',
    _hover: {
      bg: '#D4AF37',
      color: 'white',
    },
    _active: {
      bg: '#B8941F',
    },
    _focus: {
      boxShadow: '0 0 0 3px rgba(212, 175, 55, 0.3)',
    },
  },
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    animation = 'scale',
    isLoading = false,
    loadingText,
    className,
    ...props 
  }, ref) => {
    const animationConfig = animationVariants[animation]
    const styleConfig = variantStyles[variant]

    return (
      <MotionButton
        ref={ref}
        className={className}
        isLoading={isLoading}
        loadingText={loadingText}
        whileHover={animationConfig.hover}
        whileTap={animationConfig.tap}
        transition={animationConfig.transition}
        {...styleConfig}
        {...props}
        style={{
          borderRadius: 'full',
          fontWeight: '700',
          position: 'relative',
          overflow: 'hidden',
          ...props.style,
        }}
      >
        {children}
      </MotionButton>
    )
  }
)

AnimatedButton.displayName = 'AnimatedButton'

// Preset button variants
export const PrimaryButton = (props: Omit<AnimatedButtonProps, 'variant'>) => (
  <AnimatedButton {...props} variant="primary" />
)

export const SecondaryButton = (props: Omit<AnimatedButtonProps, 'variant'>) => (
  <AnimatedButton {...props} variant="secondary" />
)

export const GhostButton = (props: Omit<AnimatedButtonProps, 'variant'>) => (
  <AnimatedButton {...props} variant="ghost" />
)

export const OutlineButton = (props: Omit<AnimatedButtonProps, 'variant'>) => (
  <AnimatedButton {...props} variant="outline" />
)

// Special premium button with enhanced animations
export const PremiumButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, ...props }, ref) => (
    <AnimatedButton
      ref={ref}
      variant="primary"
      animation="lift"
      size="lg"
      px={12}
      py={8}
      fontSize="xl"
      borderRadius="full"
      boxShadow="0 8px 32px rgba(212, 175, 55, 0.3)"
      {...props}
    >
      {children}
    </AnimatedButton>
  )
)

PremiumButton.displayName = 'PremiumButton'
