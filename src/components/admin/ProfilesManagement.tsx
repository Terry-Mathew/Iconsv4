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
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Spinner,
  Flex,
} from '@chakra-ui/react'
import { 
  Crown,
  Star,
  Trophy,
  Eye,
  Edit,
  Globe
} from 'lucide-react'
import { motion } from 'framer-motion'

// Using motion.div directly to avoid deprecation warnings

interface ProfilesManagementProps {
  globalSearch: string
  adminUser: { role: string; id: string; name?: string | null }
  onRefresh: () => void
}

export function ProfilesManagement({ globalSearch, adminUser, onRefresh }: ProfilesManagementProps) {
  const [isLoading, setIsLoading] = useState(false)

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
              Profiles Management
            </Heading>
            <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
              Manage published profiles and content moderation
            </Text>
          </VStack>
          
          <Button
            leftIcon={<Globe size={16} />}
            bg="#D4AF37"
            color="white"
            _hover={{ bg: "#B8941F" }}
            fontFamily="'Lato', sans-serif"
          >
            Publish Queue
          </Button>
        </HStack>

        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="sm" color="#666">Total Profiles</StatLabel>
                <StatNumber fontSize="2xl" color="#1A1A1A">0</StatNumber>
                <StatHelpText>
                  <HStack spacing={1}>
                    <Crown size={12} />
                    <Text fontSize="xs">All tiers</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="sm" color="#666">Published</StatLabel>
                <StatNumber fontSize="2xl" color="#38A169">0</StatNumber>
                <StatHelpText>
                  <HStack spacing={1}>
                    <Globe size={12} />
                    <Text fontSize="xs">Live profiles</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="sm" color="#666">Draft</StatLabel>
                <StatNumber fontSize="2xl" color="#ECC94B">0</StatNumber>
                <StatHelpText>
                  <HStack spacing={1}>
                    <Edit size={12} />
                    <Text fontSize="xs">In progress</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="sm" color="#666">Under Review</StatLabel>
                <StatNumber fontSize="2xl" color="#9F7AEA">0</StatNumber>
                <StatHelpText>
                  <HStack spacing={1}>
                    <Eye size={12} />
                    <Text fontSize="xs">Pending approval</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Coming Soon */}
        <Card>
          <CardBody>
            <VStack spacing={4} py={12}>
              <Crown size={48} color="#D4AF37" />
              <Heading
                as="h3"
                fontSize="xl"
                fontFamily="'Playfair Display', serif"
                color="#1A1A1A"
                fontWeight="400"
              >
                Profiles Management
              </Heading>
              <Text fontSize="md" color="#666" fontFamily="'Lato', sans-serif" textAlign="center" maxW="500px">
                Comprehensive profile management system coming soon. This will include:
              </Text>
              <VStack spacing={2} align="start">
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • Draft preview with tier-specific templates
                </Text>
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • Content moderation and AI bio review
                </Text>
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • Multilingual support (English/Hindi)
                </Text>
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • Version history and audit trails
                </Text>
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • Bulk publishing and tier upgrades
                </Text>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </motion.div>
  )
}
