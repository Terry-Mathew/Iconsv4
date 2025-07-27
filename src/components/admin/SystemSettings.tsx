'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Switch,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react'
import { 
  Settings,
  Save,
  Database,
  Mail,
  Shield,
  Globe,
  Zap
} from 'lucide-react'
import { motion } from 'framer-motion'

// Using motion.div directly to avoid deprecation warnings

interface SystemSettingsProps {
  globalSearch: string
  adminUser: { role: string; id: string; name?: string | null }
  onRefresh: () => void
}

export function SystemSettings({ globalSearch, adminUser, onRefresh }: SystemSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    // Tier Pricing
    risingPrice: 3000,
    elitePrice: 10000,
    legacyPrice: 20000,
    
    // Feature Flags
    aiEnabled: true,
    multilingualEnabled: false,
    captchaEnabled: true,
    
    // Email Templates
    invitationTemplate: '',
    renewalTemplate: '',
    
    // System Limits
    maxNominationsPerDay: 10,
    maxLinksPerNomination: 3,
    
    // Multilingual
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'hi'],
  })
  
  const toast = useToast()

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement settings save API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Settings Saved',
        description: 'System settings have been updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: 'Failed to save settings. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (adminUser.role !== 'super_admin') {
    return (
      <Box textAlign="center" py={12}>
        <Shield size={48} color="#E53E3E" />
        <Heading
          as="h3"
          fontSize="xl"
          fontFamily="'Playfair Display', serif"
          color="#1A1A1A"
          fontWeight="400"
          mt={4}
          mb={2}
        >
          Access Restricted
        </Heading>
        <Text fontSize="md" color="#666" fontFamily="'Lato', sans-serif">
          Only super administrators can access system settings.
        </Text>
      </Box>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Heading
              as="h2"
              fontSize="2xl"
              fontFamily="'Playfair Display', serif"
              color="#1A1A1A"
              fontWeight="400"
            >
              System Settings
            </Heading>
            <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
              Configure global platform settings and features
            </Text>
          </VStack>
          
          <Button
            leftIcon={<Save size={16} />}
            bg="#D4AF37"
            color="white"
            _hover={{ bg: "#B8941F" }}
            fontFamily="'Lato', sans-serif"
            onClick={handleSaveSettings}
            isLoading={isLoading}
          >
            Save All Settings
          </Button>
        </HStack>

        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <Text fontSize="sm">
            Changes to system settings affect all users. Please review carefully before saving.
          </Text>
        </Alert>

        {/* Tier Pricing */}
        <Card
          as={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 } as any}
        >
          <CardHeader>
            <HStack spacing={3}>
              <Box
                w={10}
                h={10}
                bg="#D4AF37"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Settings size={20} color="white" />
              </Box>
              <VStack align="start" spacing={0}>
                <Heading
                  as="h3"
                  fontSize="lg"
                  fontFamily="'Playfair Display', serif"
                  color="#1A1A1A"
                  fontWeight="400"
                >
                  Tier Pricing
                </Heading>
                <Text fontSize="sm" color="#666">
                  Configure subscription pricing for each tier
                </Text>
              </VStack>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack spacing={4}>
                <FormControl>
                  <FormLabel fontSize="sm">Rising Tier (₹/year)</FormLabel>
                  <NumberInput
                    value={settings.risingPrice}
                    onChange={(_, value) => setSettings(prev => ({ ...prev, risingPrice: value }))}
                    min={1000}
                    max={50000}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                
                <FormControl>
                  <FormLabel fontSize="sm">Elite Tier (₹/year)</FormLabel>
                  <NumberInput
                    value={settings.elitePrice}
                    onChange={(_, value) => setSettings(prev => ({ ...prev, elitePrice: value }))}
                    min={5000}
                    max={100000}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                
                <FormControl>
                  <FormLabel fontSize="sm">Legacy Tier (₹ one-time)</FormLabel>
                  <NumberInput
                    value={settings.legacyPrice}
                    onChange={(_, value) => setSettings(prev => ({ ...prev, legacyPrice: value }))}
                    min={10000}
                    max={200000}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Feature Flags */}
        <Card
          as={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 } as any}
        >
          <CardHeader>
            <HStack spacing={3}>
              <Box
                w={10}
                h={10}
                bg="#9F7AEA"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Zap size={20} color="white" />
              </Box>
              <VStack align="start" spacing={0}>
                <Heading
                  as="h3"
                  fontSize="lg"
                  fontFamily="'Playfair Display', serif"
                  color="#1A1A1A"
                  fontWeight="400"
                >
                  Feature Flags
                </Heading>
                <Text fontSize="sm" color="#666">
                  Enable or disable platform features
                </Text>
              </VStack>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <VStack align="start" spacing={0}>
                  <Text fontWeight="500">AI Bio Enhancement</Text>
                  <Text fontSize="sm" color="#666">Allow users to polish bios with AI</Text>
                </VStack>
                <Switch
                  isChecked={settings.aiEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, aiEnabled: e.target.checked }))}
                  colorScheme="yellow"
                />
              </HStack>
              
              <Divider />
              
              <HStack justify="space-between">
                <VStack align="start" spacing={0}>
                  <Text fontWeight="500">Multilingual Support</Text>
                  <Text fontSize="sm" color="#666">Enable Hindi translations</Text>
                </VStack>
                <Switch
                  isChecked={settings.multilingualEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, multilingualEnabled: e.target.checked }))}
                  colorScheme="yellow"
                />
              </HStack>
              
              <Divider />
              
              <HStack justify="space-between">
                <VStack align="start" spacing={0}>
                  <Text fontWeight="500">CAPTCHA Protection</Text>
                  <Text fontSize="sm" color="#666">Require CAPTCHA for nominations</Text>
                </VStack>
                <Switch
                  isChecked={settings.captchaEnabled}
                  onChange={(e) => setSettings(prev => ({ ...prev, captchaEnabled: e.target.checked }))}
                  colorScheme="yellow"
                />
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* System Limits */}
        <Card
          as={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 } as any}
        >
          <CardHeader>
            <HStack spacing={3}>
              <Box
                w={10}
                h={10}
                bg="#E53E3E"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Shield size={20} color="white" />
              </Box>
              <VStack align="start" spacing={0}>
                <Heading
                  as="h3"
                  fontSize="lg"
                  fontFamily="'Playfair Display', serif"
                  color="#1A1A1A"
                  fontWeight="400"
                >
                  System Limits
                </Heading>
                <Text fontSize="sm" color="#666">
                  Configure rate limits and restrictions
                </Text>
              </VStack>
            </HStack>
          </CardHeader>
          <CardBody>
            <HStack spacing={4}>
              <FormControl>
                <FormLabel fontSize="sm">Max Nominations per Day</FormLabel>
                <NumberInput
                  value={settings.maxNominationsPerDay}
                  onChange={(_, value) => setSettings(prev => ({ ...prev, maxNominationsPerDay: value }))}
                  min={1}
                  max={100}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              
              <FormControl>
                <FormLabel fontSize="sm">Max Links per Nomination</FormLabel>
                <NumberInput
                  value={settings.maxLinksPerNomination}
                  onChange={(_, value) => setSettings(prev => ({ ...prev, maxLinksPerNomination: value }))}
                  min={1}
                  max={10}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </HStack>
          </CardBody>
        </Card>
      </VStack>
    </motion.div>
  )
}
