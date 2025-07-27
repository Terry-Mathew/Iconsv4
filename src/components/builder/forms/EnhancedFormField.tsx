'use client'

import { useState, useEffect } from 'react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  Select,
  Box,
  Text,
  HStack,
  VStack,
  Icon,
  Tooltip,
  Progress,
  Badge,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { validateField } from '@/lib/validations/profile-builder'
import { z } from 'zod'

const MotionBox = motion.create(Box)

interface EnhancedFormFieldProps {
  name: string
  label: string
  type?: 'text' | 'email' | 'url' | 'textarea' | 'select' | 'password'
  placeholder?: string
  helperText?: string
  tooltip?: string
  isRequired?: boolean
  maxLength?: number
  minLength?: number
  options?: Array<{ value: string; label: string }>
  validation?: z.ZodSchema
  value?: string
  onChange?: (value: string) => void
  onBlur?: () => void
  isDisabled?: boolean
  showCharacterCount?: boolean
  realTimeValidation?: boolean
  groupLabel?: string
  priority?: 'high' | 'medium' | 'low'
}

export function EnhancedFormField({
  name,
  label,
  type = 'text',
  placeholder,
  helperText,
  tooltip,
  isRequired = false,
  maxLength,
  minLength,
  options,
  validation,
  value = '',
  onChange,
  onBlur,
  isDisabled = false,
  showCharacterCount = false,
  realTimeValidation = true,
  groupLabel,
  priority = 'medium',
}: EnhancedFormFieldProps) {
  const [localValue, setLocalValue] = useState(value)
  const [validationState, setValidationState] = useState<{
    isValid: boolean
    error: string | null
    isValidating: boolean
  }>({
    isValid: true,
    error: null,
    isValidating: false,
  })
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Real-time validation
  useEffect(() => {
    if (realTimeValidation && validation && localValue) {
      setValidationState(prev => ({ ...prev, isValidating: true }))
      
      const timeoutId = setTimeout(() => {
        const result = validateField(name, localValue, validation)
        setValidationState({
          isValid: result.isValid,
          error: result.error,
          isValidating: false,
        })
      }, 300) // Debounce validation

      return () => clearTimeout(timeoutId)
    }
  }, [localValue, validation, name, realTimeValidation])

  const handleChange = (newValue: string) => {
    setLocalValue(newValue)
    onChange?.(newValue)
  }

  const handleBlur = () => {
    setIsFocused(false)
    onBlur?.()
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  // Character count and progress
  const characterCount = localValue.length
  const characterProgress = maxLength ? (characterCount / maxLength) * 100 : 0
  const isNearLimit = maxLength && characterCount > maxLength * 0.8

  // Priority styling
  const priorityColors = {
    high: 'red.500',
    medium: '#D4AF37',
    low: 'gray.500',
  }

  const priorityBorderColors = {
    high: 'red.200',
    medium: 'rgba(212, 175, 55, 0.3)',
    low: 'gray.200',
  }

  // Validation styling
  const getValidationColor = () => {
    if (validationState.isValidating) return 'blue.500'
    if (!validationState.isValid) return 'red.500'
    if (localValue && validationState.isValid) return 'green.500'
    return 'gray.300'
  }

  const renderInput = () => {
    const commonProps = {
      value: localValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
        handleChange(e.target.value),
      onFocus: handleFocus,
      onBlur: handleBlur,
      placeholder,
      isDisabled,
      maxLength,
      size: 'lg' as const,
      borderColor: isFocused ? priorityColors[priority] : priorityBorderColors[priority],
      _hover: { borderColor: priorityColors[priority] },
      _focus: { 
        borderColor: priorityColors[priority], 
        boxShadow: `0 0 0 1px ${priorityColors[priority]}` 
      },
      bg: 'white',
      transition: 'all 0.2s',
    }

    switch (type) {
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            minH="120px"
            resize="vertical"
          />
        )
      
      case 'select':
        return (
          <Select {...commonProps}>
            <option value="">Select an option</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        )
      
      case 'password':
        return (
          <Box position="relative">
            <Input
              {...commonProps}
              type={showPassword ? 'text' : 'password'}
              pr="3rem"
            />
            <Box
              position="absolute"
              right="0.75rem"
              top="50%"
              transform="translateY(-50%)"
              cursor="pointer"
              onClick={() => setShowPassword(!showPassword)}
              color="gray.500"
              _hover={{ color: priorityColors[priority] }}
            >
              <Icon as={showPassword ? EyeOff : Eye} size={20} />
            </Box>
          </Box>
        )
      
      default:
        return <Input {...commonProps} type={type} />
    }
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {groupLabel && (
        <Text
          fontSize="sm"
          fontWeight="600"
          color="gray.600"
          mb={2}
          textTransform="uppercase"
          letterSpacing="0.5px"
        >
          {groupLabel}
        </Text>
      )}
      
      <FormControl 
        isInvalid={!validationState.isValid && !!validationState.error}
        isRequired={isRequired}
      >
        <HStack justify="space-between" align="center" mb={2}>
          <HStack spacing={2}>
            <FormLabel
              fontSize="md"
              fontFamily="'Lato', sans-serif"
              color="#1A1A1A"
              fontWeight="500"
              mb={0}
            >
              {label}
              {isRequired && (
                <Text as="span" color="red.500" ml={1}>*</Text>
              )}
            </FormLabel>
            
            {tooltip && (
              <Tooltip
                label={tooltip}
                bg="#D4AF37"
                color="white"
                fontSize="sm"
                borderRadius="md"
                placement="top"
              >
                <Box cursor="help">
                  <Icon as={Info} size={14} color="gray.500" />
                </Box>
              </Tooltip>
            )}
            
            {priority === 'high' && (
              <Badge colorScheme="red" size="sm" variant="subtle">
                Required
              </Badge>
            )}
          </HStack>

          {/* Validation indicator */}
          <HStack spacing={1}>
            {validationState.isValidating && (
              <Box w={4} h={4}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Box w={4} h={4} borderRadius="full" border="2px solid" 
                       borderColor="blue.200" borderTopColor="blue.500" />
                </motion.div>
              </Box>
            )}
            
            {!validationState.isValidating && localValue && (
              <Icon
                as={validationState.isValid ? CheckCircle : AlertCircle}
                size={16}
                color={validationState.isValid ? 'green.500' : 'red.500'}
              />
            )}
          </HStack>
        </HStack>

        {renderInput()}

        {/* Character count and progress */}
        {showCharacterCount && maxLength && (
          <VStack spacing={1} align="stretch" mt={2}>
            <HStack justify="space-between">
              <Text fontSize="xs" color={isNearLimit ? 'red.500' : 'gray.500'}>
                {characterCount} / {maxLength} characters
              </Text>
              {minLength && characterCount < minLength && (
                <Text fontSize="xs" color="orange.500">
                  {minLength - characterCount} more needed
                </Text>
              )}
            </HStack>
            <Progress
              value={characterProgress}
              size="sm"
              colorScheme={isNearLimit ? 'red' : characterCount >= (minLength || 0) ? 'green' : 'gray'}
              bg="gray.100"
              borderRadius="full"
            />
          </VStack>
        )}

        {/* Error message with animation */}
        <AnimatePresence>
          {validationState.error && !validationState.isValidating && (
            <MotionBox
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FormErrorMessage color="red.500" fontSize="sm" mt={1}>
                {validationState.error}
              </FormErrorMessage>
            </MotionBox>
          )}
        </AnimatePresence>

        {/* Helper text */}
        {helperText && !validationState.error && (
          <FormHelperText color="gray.600" fontSize="sm" mt={1}>
            {helperText}
          </FormHelperText>
        )}
      </FormControl>
    </MotionBox>
  )
}

// Field group component for organizing related fields
interface FieldGroupProps {
  title: string
  description?: string
  children: React.ReactNode
  isCollapsible?: boolean
  defaultExpanded?: boolean
  priority?: 'high' | 'medium' | 'low'
}

export function FieldGroup({
  title,
  description,
  children,
  isCollapsible = false,
  defaultExpanded = true,
  priority = 'medium',
}: FieldGroupProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const priorityColors = {
    high: 'red.500',
    medium: '#D4AF37',
    low: 'gray.500',
  }

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="12px"
      p={6}
      bg="white"
      boxShadow="sm"
    >
      <VStack spacing={4} align="stretch">
        <HStack
          justify="space-between"
          cursor={isCollapsible ? 'pointer' : 'default'}
          onClick={isCollapsible ? () => setIsExpanded(!isExpanded) : undefined}
        >
          <VStack align="start" spacing={1}>
            <HStack>
              <Text
                fontSize="lg"
                fontWeight="600"
                color="#1A1A1A"
                fontFamily="'Playfair Display', serif"
              >
                {title}
              </Text>
              <Badge
                colorScheme={priority === 'high' ? 'red' : priority === 'medium' ? 'yellow' : 'gray'}
                size="sm"
                variant="subtle"
              >
                {priority}
              </Badge>
            </HStack>
            {description && (
              <Text fontSize="sm" color="gray.600">
                {description}
              </Text>
            )}
          </VStack>
          
          {isCollapsible && (
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Icon as={Info} size={20} color={priorityColors[priority]} />
            </motion.div>
          )}
        </HStack>

        <AnimatePresence>
          {isExpanded && (
            <MotionBox
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <VStack spacing={6} align="stretch">
                {children}
              </VStack>
            </MotionBox>
          )}
        </AnimatePresence>
      </VStack>
    </MotionBox>
  )
}
