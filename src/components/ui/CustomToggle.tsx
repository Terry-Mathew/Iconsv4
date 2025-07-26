'use client'

import { forwardRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { Box } from '@chakra-ui/react'

interface ToggleOption {
  value: string
  label: string
  ariaLabel?: string
}

interface CustomToggleProps {
  options: ToggleOption[]
  value: string
  onValueChange: (value: string) => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary'
  className?: string
  'aria-label'?: string
}

const sizeConfig = {
  sm: {
    padding: '8px 16px',
    fontSize: '14px',
    height: '36px',
  },
  md: {
    padding: '12px 24px',
    fontSize: '16px',
    height: '44px',
  },
  lg: {
    padding: '16px 32px',
    fontSize: '18px',
    height: '52px',
  },
}

const variantConfig = {
  primary: {
    background: '#F7F5F0',
    activeBackground: '#D4AF37',
    activeColor: 'white',
    inactiveColor: '#8B7355',
    hoverBackground: '#E8E0D0',
    activeHoverBackground: '#B8941F',
    shadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
  },
  secondary: {
    background: '#FFFFFF',
    activeBackground: '#8B7355',
    activeColor: 'white',
    inactiveColor: '#666666',
    hoverBackground: '#F5F5F5',
    activeHoverBackground: '#6B5B47',
    shadow: '0 2px 8px rgba(139, 115, 85, 0.2)',
  },
}

export const CustomToggle = forwardRef<HTMLDivElement, CustomToggleProps>(
  ({ 
    options, 
    value, 
    onValueChange, 
    size = 'md', 
    variant = 'primary',
    className,
    'aria-label': ariaLabel,
    ...props 
  }, ref) => {
    const sizeStyles = sizeConfig[size]
    const variantStyles = variantConfig[variant]

    return (
      <Box
        ref={ref}
        className={className}
        {...props}
      >
        <ToggleGroup.Root
          type="single"
          value={value}
          onValueChange={(newValue) => newValue && onValueChange(newValue)}
          aria-label={ariaLabel || 'Toggle options'}
          style={{
            display: 'flex',
            backgroundColor: variantStyles.background,
            borderRadius: '50px',
            padding: '4px',
            gap: '4px',
            position: 'relative',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          {options.map((option, index) => (
            <motion.div
              key={option.value}
              style={{ position: 'relative', flex: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
                duration: 0.3,
              }}
            >
              <ToggleGroup.Item
                value={option.value}
                aria-label={option.ariaLabel || option.label}
                style={{
                  width: '100%',
                  height: sizeStyles.height,
                  padding: sizeStyles.padding,
                  borderRadius: '50px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: value === option.value ? variantStyles.activeColor : variantStyles.inactiveColor,
                  fontWeight: '600',
                  fontSize: sizeStyles.fontSize,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  outline: 'none',
                  userSelect: 'none',
                }}
                onMouseEnter={(e) => {
                  if (value !== option.value) {
                    e.currentTarget.style.backgroundColor = variantStyles.hoverBackground
                  }
                }}
                onMouseLeave={(e) => {
                  if (value !== option.value) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${variantStyles.activeBackground}40`
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {option.label}
              </ToggleGroup.Item>

              {/* Active state background with animation */}
              <AnimatePresence>
                {value === option.value && (
                  <motion.div
                    layoutId={`toggle-background-${variant}-${size}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 25,
                      duration: 0.3,
                    }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: variantStyles.activeBackground,
                      borderRadius: '50px',
                      boxShadow: variantStyles.shadow,
                      zIndex: 1,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = variantStyles.activeHoverBackground
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = variantStyles.activeBackground
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </ToggleGroup.Root>
      </Box>
    )
  }
)

CustomToggle.displayName = 'CustomToggle'

// Preset configurations for common use cases
export const PrimaryToggle = (props: Omit<CustomToggleProps, 'variant'>) => (
  <CustomToggle {...props} variant="primary" />
)

export const SecondaryToggle = (props: Omit<CustomToggleProps, 'variant'>) => (
  <CustomToggle {...props} variant="secondary" />
)

// Hook for managing toggle state
export const useToggle = (initialValue: string) => {
  const [value, setValue] = useState(initialValue)
  
  const handleChange = (newValue: string) => {
    setValue(newValue)
  }
  
  return [value, handleChange] as const
}
