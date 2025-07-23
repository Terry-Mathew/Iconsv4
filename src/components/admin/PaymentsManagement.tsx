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
  CreditCard,
  DollarSign,
  TrendingUp,
  Download,
  RefreshCw,
  AlertTriangle
} from 'lucide-react'
import { motion } from 'framer-motion'

// Using motion.div directly to avoid deprecation warnings

interface PaymentsManagementProps {
  globalSearch: string
  adminUser: { role: string; id: string; name?: string | null }
  onRefresh: () => void
}

export function PaymentsManagement({ globalSearch, adminUser, onRefresh }: PaymentsManagementProps) {
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
              Payments Management
            </Heading>
            <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
              Monitor revenue, transactions, and billing
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
              Export Report
            </Button>
            <Button
              leftIcon={<RefreshCw size={16} />}
              bg="#D4AF37"
              color="white"
              _hover={{ bg: "#B8941F" }}
              fontFamily="'Lato', sans-serif"
            >
              Sync Razorpay
            </Button>
          </HStack>
        </HStack>

        {/* Revenue Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="sm" color="#666">Total Revenue</StatLabel>
                <StatNumber fontSize="2xl" color="#1A1A1A">₹0</StatNumber>
                <StatHelpText>
                  <HStack spacing={1}>
                    <DollarSign size={12} />
                    <Text fontSize="xs">All time</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="sm" color="#666">This Month</StatLabel>
                <StatNumber fontSize="2xl" color="#38A169">₹0</StatNumber>
                <StatHelpText>
                  <HStack spacing={1}>
                    <TrendingUp size={12} />
                    <Text fontSize="xs">Monthly revenue</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="sm" color="#666">Successful</StatLabel>
                <StatNumber fontSize="2xl" color="#38A169">0</StatNumber>
                <StatHelpText>
                  <HStack spacing={1}>
                    <CreditCard size={12} />
                    <Text fontSize="xs">Paid transactions</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="sm" color="#666">Failed</StatLabel>
                <StatNumber fontSize="2xl" color="#E53E3E">0</StatNumber>
                <StatHelpText>
                  <HStack spacing={1}>
                    <AlertTriangle size={12} />
                    <Text fontSize="xs">Failed payments</Text>
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
              <CreditCard size={48} color="#D4AF37" />
              <Heading
                as="h3"
                fontSize="xl"
                fontFamily="'Playfair Display', serif"
                color="#1A1A1A"
                fontWeight="400"
              >
                Payments Management
              </Heading>
              <Text fontSize="md" color="#666" fontFamily="'Lato', sans-serif" textAlign="center" maxW="500px">
                Comprehensive payment management system coming soon. This will include:
              </Text>
              <VStack spacing={2} align="start">
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • Real-time Razorpay transaction monitoring
                </Text>
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • Revenue analytics and trend charts
                </Text>
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • Manual refund processing (super-admin only)
                </Text>
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • Payment failure analysis and retry logic
                </Text>
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • Automated billing and renewal reminders
                </Text>
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • Export reports (CSV/PDF) for accounting
                </Text>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </motion.div>
  )
}
