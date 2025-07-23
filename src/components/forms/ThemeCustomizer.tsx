'use client'

import {
  VStack,
  HStack,
  Heading,
  FormControl,
  FormLabel,
  Select,
  Card,
  CardBody,
  SimpleGrid,
  Box,
  Text,
  Button,
} from '@chakra-ui/react'
import { ThemeSettingsFormData } from '@/lib/validations/profile'
import { ProfileTier } from '@/types/profile'

interface ThemeCustomizerProps {
  settings: ThemeSettingsFormData
  onChange: (settings: ThemeSettingsFormData) => void
  tier: ProfileTier
}

export function ThemeCustomizer({ settings, onChange, tier }: ThemeCustomizerProps) {
  const handleChange = (field: keyof ThemeSettingsFormData, value: any) => {
    onChange({
      ...settings,
      [field]: value,
    })
  }

  const colorSchemes = [
    { value: 'blue', label: 'Ocean Blue', color: 'blue.500' },
    { value: 'green', label: 'Forest Green', color: 'green.500' },
    { value: 'purple', label: 'Royal Purple', color: 'purple.500' },
    { value: 'orange', label: 'Sunset Orange', color: 'orange.500' },
    { value: 'red', label: 'Crimson Red', color: 'red.500' },
  ]

  return (
    <VStack spacing={8} align="stretch">
      <Card>
        <CardBody>
          <Heading as="h3" size="md" mb={6} color="primary.600">
            Color Scheme
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {colorSchemes.map((scheme) => (
              <Box
                key={scheme.value}
                p={4}
                border="2px"
                borderColor={settings.colorScheme === scheme.value ? scheme.color : 'gray.200'}
                borderRadius="lg"
                cursor="pointer"
                onClick={() => handleChange('colorScheme', scheme.value)}
                _hover={{ borderColor: scheme.color }}
                transition="all 0.2s"
              >
                <HStack>
                  <Box w={4} h={4} bg={scheme.color} borderRadius="full" />
                  <Text fontWeight="medium">{scheme.label}</Text>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Heading as="h3" size="md" mb={4} color="primary.600">
            Layout & Typography
          </Heading>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Layout Style</FormLabel>
              <Select
                value={settings.layout}
                onChange={(e) => handleChange('layout', e.target.value)}
              >
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
                <option value="minimal">Minimal</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Typography</FormLabel>
              <Select
                value={settings.typography}
                onChange={(e) => handleChange('typography', e.target.value)}
              >
                <option value="sans">Sans Serif</option>
                <option value="serif">Serif</option>
                <option value="mixed">Mixed</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Background Pattern</FormLabel>
              <Select
                value={settings.backgroundPattern}
                onChange={(e) => handleChange('backgroundPattern', e.target.value)}
              >
                <option value="none">None</option>
                <option value="subtle">Subtle</option>
                <option value="geometric">Geometric</option>
              </Select>
            </FormControl>
          </VStack>
        </CardBody>
      </Card>

      <Card bg="gray.50">
        <CardBody>
          <Heading as="h3" size="md" mb={4} color="primary.600">
            Preview Settings
          </Heading>
          <Text color="gray.600" mb={4}>
            Your {tier} profile will use these theme settings. You can change them anytime before publishing.
          </Text>
          <Button size="sm" variant="outline">
            Reset to Default
          </Button>
        </CardBody>
      </Card>
    </VStack>
  )
}
