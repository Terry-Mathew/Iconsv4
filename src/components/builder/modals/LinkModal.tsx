'use client'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Button,
  Text,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { Link as LinkIcon, Globe, Linkedin, Twitter, ExternalLink } from 'lucide-react'
import { useEffect } from 'react'

interface Link {
  title: string
  url: string
  type: 'website' | 'linkedin' | 'twitter' | 'other'
}

interface LinkModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (link: Link) => void
  link?: Link
  isEditing?: boolean
}

const LINK_TYPES = [
  { value: 'website', label: 'Website', icon: Globe },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'twitter', label: 'Twitter', icon: Twitter },
  { value: 'other', label: 'Other', icon: LinkIcon },
]

export function LinkModal({
  isOpen,
  onClose,
  onSave,
  link,
  isEditing = false,
}: LinkModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<Link>({
    mode: 'onChange',
  })

  const selectedType = watch('type')

  useEffect(() => {
    if (isOpen) {
      if (link) {
        setValue('title', link.title)
        setValue('url', link.url)
        setValue('type', link.type)
      } else {
        reset({
          title: '',
          url: '',
          type: 'website',
        })
      }
    }
  }, [isOpen, link, setValue, reset])

  const onSubmit = (data: Link) => {
    // Ensure URL has protocol
    let url = data.url.trim()
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }
    
    onSave({
      ...data,
      url,
    })
    reset()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const getPlaceholderUrl = (type: string) => {
    switch (type) {
      case 'linkedin':
        return 'https://linkedin.com/in/yourprofile'
      case 'twitter':
        return 'https://twitter.com/yourusername'
      case 'website':
        return 'https://yourwebsite.com'
      default:
        return 'https://example.com'
    }
  }

  const getPlaceholderTitle = (type: string) => {
    switch (type) {
      case 'linkedin':
        return 'LinkedIn Profile'
      case 'twitter':
        return 'Twitter Profile'
      case 'website':
        return 'Personal Website'
      default:
        return 'Link Title'
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <LinkIcon size={24} color="#D4AF37" />
            <Text>
              {isEditing ? 'Edit Link' : 'Add Link'}
            </Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={4}>
              {/* Link Type */}
              <FormControl isInvalid={!!errors.type}>
                <FormLabel>
                  <HStack>
                    <ExternalLink size={16} />
                    <Text>Link Type</Text>
                  </HStack>
                </FormLabel>
                <Select
                  {...register('type', {
                    required: 'Link type is required',
                  })}
                  size="lg"
                  bg="white"
                  border="2px solid #E8E0D0"
                  _focus={{
                    borderColor: '#D4AF37',
                    boxShadow: '0 0 0 1px #D4AF37',
                  }}
                >
                  {LINK_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.type?.message}</FormErrorMessage>
              </FormControl>

              {/* Title */}
              <FormControl isInvalid={!!errors.title}>
                <FormLabel>Link Title</FormLabel>
                <Input
                  {...register('title', {
                    required: 'Title is required',
                    minLength: {
                      value: 2,
                      message: 'Title must be at least 2 characters',
                    },
                  })}
                  placeholder={getPlaceholderTitle(selectedType || 'website')}
                  size="lg"
                  bg="white"
                  border="2px solid #E8E0D0"
                  _focus={{
                    borderColor: '#D4AF37',
                    boxShadow: '0 0 0 1px #D4AF37',
                  }}
                />
                <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
              </FormControl>

              {/* URL */}
              <FormControl isInvalid={!!errors.url}>
                <FormLabel>URL</FormLabel>
                <Input
                  {...register('url', {
                    required: 'URL is required',
                    pattern: {
                      value: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                      message: 'Please enter a valid URL',
                    },
                  })}
                  placeholder={getPlaceholderUrl(selectedType || 'website')}
                  size="lg"
                  bg="white"
                  border="2px solid #E8E0D0"
                  _focus={{
                    borderColor: '#D4AF37',
                    boxShadow: '0 0 0 1px #D4AF37',
                  }}
                />
                <FormErrorMessage>{errors.url?.message}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <HStack spacing={3}>
              <Button
                variant="outline"
                colorScheme="gray"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                bg="#D4AF37"
                color="white"
                _hover={{ bg: '#B8941F' }}
                isDisabled={!isValid}
              >
                {isEditing ? 'Update' : 'Add'} Link
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
