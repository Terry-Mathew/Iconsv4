'use client'

import {
  Box,
  FormControl,
  FormLabel,
  Switch,
  Text,
  VStack,
  HStack,
  Tooltip,
  Icon
} from '@chakra-ui/react'
import { Eye, EyeOff, Info } from 'lucide-react'

interface SectionToggleProps {
  sectionName: string
  label: string
  description?: string
  visible: boolean
  autoHideIfEmpty: boolean
  onVisibleChange: (visible: boolean) => void
  onAutoHideChange: (autoHide: boolean) => void
  hasData?: boolean
  dataCount?: number
}

export function SectionToggle({
  sectionName,
  label,
  description,
  visible,
  autoHideIfEmpty,
  onVisibleChange,
  onAutoHideChange,
  hasData = false,
  dataCount = 0
}: SectionToggleProps) {
  return (
    <Box
      p={4}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="lg"
      bg="gray.50"
    >
      <VStack spacing={3} align="stretch">
        {/* Section Header */}
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Text fontWeight="semibold" fontSize="sm" color="gray.700">
              {label}
            </Text>
            {description && (
              <Text fontSize="xs" color="gray.500">
                {description}
              </Text>
            )}
          </VStack>
          
          <HStack spacing={2}>
            {/* Data Status Indicator */}
            {hasData && (
              <Tooltip label={`${dataCount} item${dataCount !== 1 ? 's' : ''} added`}>
                <Box
                  w={2}
                  h={2}
                  borderRadius="full"
                  bg="green.400"
                />
              </Tooltip>
            )}
            
            {/* Visibility Toggle */}
            <FormControl display="flex" alignItems="center">
              <Switch
                id={`${sectionName}-visible`}
                isChecked={visible}
                onChange={(e) => onVisibleChange(e.target.checked)}
                colorScheme="blue"
                size="sm"
              />
              <FormLabel
                htmlFor={`${sectionName}-visible`}
                mb={0}
                ml={2}
                fontSize="xs"
                color="gray.600"
              >
                <Icon as={visible ? Eye : EyeOff} w={3} h={3} />
              </FormLabel>
            </FormControl>
          </HStack>
        </HStack>

        {/* Auto-hide Option */}
        <HStack justify="space-between" align="center" pl={2}>
          <HStack spacing={2}>
            <Text fontSize="xs" color="gray.600">
              Auto-hide if empty
            </Text>
            <Tooltip 
              label="Automatically hide this section if no content is added"
              fontSize="xs"
            >
              <Icon as={Info} w={3} h={3} color="gray.400" />
            </Tooltip>
          </HStack>
          
          <FormControl display="flex" alignItems="center">
            <Switch
              id={`${sectionName}-auto-hide`}
              isChecked={autoHideIfEmpty}
              onChange={(e) => onAutoHideChange(e.target.checked)}
              colorScheme="gray"
              size="sm"
            />
          </FormControl>
        </HStack>

        {/* Status Message */}
        {!visible && (
          <Text fontSize="xs" color="orange.600" fontStyle="italic">
            Section is hidden and will not appear on the profile
          </Text>
        )}
        
        {visible && autoHideIfEmpty && !hasData && (
          <Text fontSize="xs" color="blue.600" fontStyle="italic">
            Section will auto-hide when profile is saved (no content added)
          </Text>
        )}
      </VStack>
    </Box>
  )
}
