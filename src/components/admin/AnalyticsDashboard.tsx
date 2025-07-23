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
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  MapPin,
  Calendar,
  Download
} from 'lucide-react'
import { motion } from 'framer-motion'

// Using motion.div directly to avoid deprecation warnings

interface AnalyticsDashboardProps {
  globalSearch: string
  adminUser: { role: string; id: string; name?: string | null }
  stats: any
  onRefresh: () => void
}

export function AnalyticsDashboard({ globalSearch, adminUser, stats, onRefresh }: AnalyticsDashboardProps) {
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
              Analytics Dashboard
            </Heading>
            <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
              Platform insights and performance metrics
            </Text>
          </VStack>
          
          <HStack spacing={2}>
            <Button
              leftIcon={<Download size={16} />}
              variant="outline"
              borderColor="#D4AF37"
              color="#D4AF37"
              _hover={{ bg: "#D4AF37", color: "white" }}
              fontFamily="'Lato', sans-serif"
            >
              Export Analytics
            </Button>
            <Button
              leftIcon={<Calendar size={16} />}
              bg="#D4AF37"
              color="white"
              _hover={{ bg: "#B8941F" }}
              fontFamily="'Lato', sans-serif"
            >
              Custom Report
            </Button>
          </HStack>
        </HStack>

        {/* Key Metrics */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="sm" color="#666">Total Users</StatLabel>
                <StatNumber fontSize="2xl" color="#1A1A1A">{stats?.totalUsers || 0}</StatNumber>
                <StatHelpText>
                  <HStack spacing={1}>
                    <Users size={12} />
                    <Text fontSize="xs">Registered members</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="sm" color="#666">Profile Views</StatLabel>
                <StatNumber fontSize="2xl" color="#38A169">0</StatNumber>
                <StatHelpText>
                  <HStack spacing={1}>
                    <Eye size={12} />
                    <Text fontSize="xs">This month</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="sm" color="#666">Conversion Rate</StatLabel>
                <StatNumber fontSize="2xl" color="#9F7AEA">{stats?.conversionRate || 0}%</StatNumber>
                <StatHelpText>
                  <HStack spacing={1}>
                    <TrendingUp size={12} />
                    <Text fontSize="xs">Nomination to profile</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="sm" color="#666">Geographic Reach</StatLabel>
                <StatNumber fontSize="2xl" color="#ECC94B">1</StatNumber>
                <StatHelpText>
                  <HStack spacing={1}>
                    <MapPin size={12} />
                    <Text fontSize="xs">Cities covered</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Tier Distribution */}
        <Card>
          <CardBody>
            <Heading
              as="h3"
              fontSize="lg"
              fontFamily="'Playfair Display', serif"
              color="#1A1A1A"
              fontWeight="400"
              mb={4}
            >
              Tier Distribution
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Card bg="green.50" borderColor="green.200" borderWidth="1px">
                <CardBody>
                  <Stat>
                    <StatLabel fontSize="sm" color="green.600">Rising Tier</StatLabel>
                    <StatNumber fontSize="xl" color="green.700">0</StatNumber>
                    <StatHelpText color="green.600">₹3,000/year</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
              
              <Card bg="blue.50" borderColor="blue.200" borderWidth="1px">
                <CardBody>
                  <Stat>
                    <StatLabel fontSize="sm" color="blue.600">Elite Tier</StatLabel>
                    <StatNumber fontSize="xl" color="blue.700">0</StatNumber>
                    <StatHelpText color="blue.600">₹10,000/year</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
              
              <Card bg="purple.50" borderColor="purple.200" borderWidth="1px">
                <CardBody>
                  <Stat>
                    <StatLabel fontSize="sm" color="purple.600">Legacy Tier</StatLabel>
                    <StatNumber fontSize="xl" color="purple.700">0</StatNumber>
                    <StatHelpText color="purple.600">₹20,000 one-time</StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Coming Soon */}
        <Card>
          <CardBody>
            <VStack spacing={4} py={12}>
              <BarChart3 size={48} color="#D4AF37" />
              <Heading
                as="h3"
                fontSize="xl"
                fontFamily="'Playfair Display', serif"
                color="#1A1A1A"
                fontWeight="400"
              >
                Advanced Analytics
              </Heading>
              <Text fontSize="md" color="#666" fontFamily="'Lato', sans-serif" textAlign="center" maxW="500px">
                Comprehensive analytics dashboard coming soon. This will include:
              </Text>
              <VStack spacing={2} align="start">
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • Real-time user engagement tracking
                </Text>
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • Conversion funnel analysis (nomination → payment)
                </Text>
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • Geographic distribution maps
                </Text>
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • Profile view and share analytics
                </Text>
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • Revenue trends and forecasting
                </Text>
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • Custom report generation
                </Text>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </motion.div>
  )
}
