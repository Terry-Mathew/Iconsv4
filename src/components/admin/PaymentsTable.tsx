'use client'

import { useState, useEffect } from 'react'
import {
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Text,
  useToast,
  Spinner,
  Center,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Card,
  CardBody,
} from '@chakra-ui/react'
import { RefreshCw, Download } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function PaymentsTable() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPayments: 0,
    successfulPayments: 0,
    pendingPayments: 0,
  })

  const toast = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          users (
            email
          ),
          profiles (
            data,
            tier
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error

      setPayments(data || [])

      // Calculate stats
      const totalRevenue = data?.reduce((sum, payment) => {
        return payment.status === 'captured' ? sum + payment.amount : sum
      }, 0) || 0

      const totalPayments = data?.length || 0
      const successfulPayments = data?.filter(p => p.status === 'captured').length || 0
      const pendingPayments = data?.filter(p => p.status === 'pending').length || 0

      setStats({
        totalRevenue: totalRevenue / 100, // Convert from paise to rupees
        totalPayments,
        successfulPayments,
        pendingPayments,
      })

    } catch (err: any) {
      toast({
        title: 'Error loading payments',
        description: err.message,
        status: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'captured': return 'green'
      case 'pending': return 'yellow'
      case 'failed': return 'red'
      case 'refunded': return 'purple'
      default: return 'gray'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount / 100) // Convert from paise to rupees
  }

  if (loading) {
    return (
      <Center py={8}>
        <Spinner size="lg" />
      </Center>
    )
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Payment Stats */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Revenue</StatLabel>
              <StatNumber color="green.600">
                ₹{stats.totalRevenue.toLocaleString()}
              </StatNumber>
              <StatHelpText>All time</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Payments</StatLabel>
              <StatNumber>{stats.totalPayments}</StatNumber>
              <StatHelpText>All transactions</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Successful</StatLabel>
              <StatNumber color="green.600">{stats.successfulPayments}</StatNumber>
              <StatHelpText>Captured payments</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Pending</StatLabel>
              <StatNumber color="yellow.600">{stats.pendingPayments}</StatNumber>
              <StatHelpText>Awaiting capture</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Payments Table */}
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="semibold">
            Recent Payments ({payments.length})
          </Text>
          <HStack>
            <Button
              size="sm"
              leftIcon={<RefreshCw size={16} />}
              onClick={loadPayments}
              variant="outline"
            >
              Refresh
            </Button>
            <Button
              size="sm"
              leftIcon={<Download size={16} />}
              variant="outline"
              isDisabled
            >
              Export
            </Button>
          </HStack>
        </HStack>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Payment ID</Th>
              <Th>User</Th>
              <Th>Profile Tier</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {payments.map((payment) => {
              const profileData = payment.profiles?.data as any
              return (
                <Tr key={payment.id}>
                  <Td>
                    <Text fontSize="sm" fontFamily="mono">
                      {payment.razorpay_payment_id || payment.id.slice(0, 8)}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm">{payment.users?.email}</Text>
                  </Td>
                  <Td>
                    {payment.profiles ? (
                      <VStack align="start" spacing={0}>
                        <Badge colorScheme="blue" size="sm">
                          {payment.profiles.tier}
                        </Badge>
                        <Text fontSize="xs" color="gray.500" noOfLines={1}>
                          {profileData?.name}
                        </Text>
                      </VStack>
                    ) : (
                      <Text color="gray.400" fontSize="sm">-</Text>
                    )}
                  </Td>
                  <Td>
                    <Text fontWeight="medium">
                      {formatCurrency(payment.amount)}
                    </Text>
                  </Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </Td>
                  <Td>
                    <Text fontSize="sm">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </Text>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>

        {payments.length === 0 && (
          <Center py={8}>
            <Text color="gray.500">No payments found</Text>
          </Center>
        )}
      </VStack>
    </VStack>
  )
}
