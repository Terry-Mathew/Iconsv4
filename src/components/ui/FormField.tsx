'use client'

import { forwardRef, ReactNode, useState } from 'react'
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  FormErrorMessage,
  FormHelperText,
  InputProps,
  TextareaProps,
  SelectProps,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'

interface BaseFormFieldProps {
  label?: string
  error?: string
  helperText?: string
  isRequired?: boolean
  className?: string
  'aria-label'?: string
}

interface InputFieldProps extends BaseFormFieldProps, Omit<InputProps, 'size'> {
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number'
  fieldType: 'input'
}

interface TextareaFieldProps extends BaseFormFieldProps, TextareaProps {
  fieldType: 'textarea'
  rows?: number
}

interface SelectFieldProps extends BaseFormFieldProps, SelectProps {
  fieldType: 'select'
  children: ReactNode
}

type FormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps

const MotionFormControl = motion(FormControl)
const MotionInput = motion(Input)
const MotionTextarea = motion(Textarea)
const MotionSelect = motion(Select)

const fieldVariants = {
  initial: {
    borderColor: '#E8E0D0',
    boxShadow: 'none',
  },
  focus: {
    borderColor: '#D4AF37',
    boxShadow: '0 0 0 1px #D4AF37, 0 0 20px rgba(212, 175, 55, 0.2)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  error: {
    borderColor: '#E53E3E',
    boxShadow: '0 0 0 1px #E53E3E, 0 0 10px rgba(229, 62, 62, 0.2)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

const labelVariants = {
  initial: {
    color: '#8B7355',
    scale: 1,
  },
  focus: {
    color: '#D4AF37',
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  error: {
    color: '#E53E3E',
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
}

const errorVariants = {
  initial: {
    opacity: 0,
    y: -10,
    height: 0,
  },
  animate: {
    opacity: 1,
    y: 0,
    height: 'auto',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    height: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
}

export const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  FormFieldProps
>(({ label, error, helperText, isRequired, className, 'aria-label': ariaLabel, ...props }, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  const hasError = Boolean(error)

  const getFieldState = () => {
    if (hasError) return 'error'
    if (isFocused) return 'focus'
    return 'initial'
  }

  const commonProps = {
    bg: 'white',
    borderWidth: '2px',
    borderRadius: 'md',
    fontSize: 'md',
    _placeholder: {
      color: '#A0AEC0',
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    'aria-label': ariaLabel || label,
    'aria-invalid': hasError,
    'aria-describedby': error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined,
  }

  const renderField = () => {
    switch (props.fieldType) {
      case 'input':
        return (
          <MotionInput
            ref={ref as React.Ref<HTMLInputElement>}
            variants={fieldVariants}
            animate={getFieldState()}
            {...commonProps}
            {...(props as InputFieldProps)}
          />
        )
      case 'textarea':
        return (
          <MotionTextarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            variants={fieldVariants}
            animate={getFieldState()}
            resize="vertical"
            {...commonProps}
            {...(props as TextareaFieldProps)}
          />
        )
      case 'select':
        return (
          <MotionSelect
            ref={ref as React.Ref<HTMLSelectElement>}
            variants={fieldVariants}
            animate={getFieldState()}
            {...commonProps}
            {...(props as SelectFieldProps)}
          >
            {(props as SelectFieldProps).children}
          </MotionSelect>
        )
      default:
        return null
    }
  }

  return (
    <MotionFormControl
      isInvalid={hasError}
      isRequired={isRequired}
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {label && (
        <motion.div
          variants={labelVariants}
          animate={getFieldState()}
        >
          <FormLabel
            fontWeight="600"
            mb={2}
            fontSize="sm"
            letterSpacing="0.5px"
          >
            {label}
            {isRequired && (
              <motion.span
                style={{ color: '#E53E3E', marginLeft: '4px' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
              >
                *
              </motion.span>
            )}
          </FormLabel>
        </motion.div>
      )}

      {renderField()}

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            variants={errorVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <FormErrorMessage
              id={`${props.id}-error`}
              fontSize="sm"
              mt={1}
            >
              {error}
            </FormErrorMessage>
          </motion.div>
        )}
        {!error && helperText && (
          <motion.div
            key="helper"
            variants={errorVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <FormHelperText
              id={`${props.id}-helper`}
              fontSize="sm"
              mt={1}
              color="#718096"
            >
              {helperText}
            </FormHelperText>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionFormControl>
  )
})

FormField.displayName = 'FormField'

// Preset field components
export const InputField = (props: Omit<InputFieldProps, 'fieldType'>) => (
  <FormField {...props} fieldType="input" />
)

export const TextareaField = (props: Omit<TextareaFieldProps, 'fieldType'>) => (
  <FormField {...props} fieldType="textarea" />
)

export const SelectField = (props: Omit<SelectFieldProps, 'fieldType'>) => (
  <FormField {...props} fieldType="select" />
)
