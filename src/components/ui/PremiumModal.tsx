'use client'

import { ReactNode, useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useBreakpointValue,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FocusTrap from '@radix-ui/react-focus-scope'

interface PremiumModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  variant?: 'premium' | 'elegant' | 'minimal'
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
  className?: string
}

const MotionModalContent = motion(ModalContent)

const variantConfig = {
  premium: {
    background: '#FEFDF8',
    border: '2px solid #D4AF37',
    borderRadius: { base: 0, md: '20px' },
    boxShadow: '0 20px 60px rgba(212, 175, 55, 0.2)',
    headerColor: '#8B7355',
  },
  elegant: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: { base: 0, md: '16px' },
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    headerColor: '#2D3748',
  },
  minimal: {
    background: '#FFFFFF',
    border: 'none',
    borderRadius: { base: 0, md: '12px' },
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    headerColor: '#4A5568',
  },
}

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
}

const overlayVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
}

export function PremiumModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'xl',
  variant = 'premium',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className,
}: PremiumModalProps) {
  const isMobile = useBreakpointValue({ base: true, md: false })
  const modalSize = isMobile ? 'full' : size
  const config = variantConfig[variant]

  // Handle escape key
  useEffect(() => {
    if (!closeOnEsc) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, closeOnEsc])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size={modalSize}
          isCentered={!isMobile}
          closeOnOverlayClick={closeOnOverlayClick}
          closeOnEsc={false} // We handle this manually for better control
          motionPreset="none" // Disable default Chakra animations
        >
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ModalOverlay
              bg="blackAlpha.600"
              backdropFilter="blur(10px)"
              style={{
                display: 'flex',
                alignItems: isMobile ? 'flex-end' : 'center',
                justifyContent: 'center',
              }}
            />
          </motion.div>

          <FocusTrap.Root trapped={isOpen}>
            <MotionModalContent
              bg={config.background}
              border={config.border}
              borderRadius={config.borderRadius}
              boxShadow={config.boxShadow}
              maxH="90vh"
              overflow="auto"
              className={className}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
              style={{
                position: 'relative',
                margin: isMobile ? 0 : 'auto',
              }}
            >
              {title && (
                <ModalHeader
                  id="modal-title"
                  textAlign="center"
                  fontSize="2xl"
                  fontWeight="700"
                  color={config.headerColor}
                  pb={2}
                >
                  {title}
                </ModalHeader>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <ModalCloseButton
                  color={config.headerColor}
                  _hover={{
                    bg: 'blackAlpha.100',
                    transform: 'scale(1.1)',
                  }}
                  _active={{
                    transform: 'scale(0.95)',
                  }}
                  transition="all 0.2s ease"
                  aria-label="Close modal"
                />
              </motion.div>

              <ModalBody pb={8}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {children}
                </motion.div>
              </ModalBody>
            </MotionModalContent>
          </FocusTrap.Root>
        </Modal>
      )}
    </AnimatePresence>
  )
}

// Preset modal variants
export const PremiumGoldModal = (props: Omit<PremiumModalProps, 'variant'>) => (
  <PremiumModal {...props} variant="premium" />
)

export const ElegantModal = (props: Omit<PremiumModalProps, 'variant'>) => (
  <PremiumModal {...props} variant="elegant" />
)

export const MinimalModal = (props: Omit<PremiumModalProps, 'variant'>) => (
  <PremiumModal {...props} variant="minimal" />
)

// Hook for modal state management
export const useModal = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(!isOpen)

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  }
}
