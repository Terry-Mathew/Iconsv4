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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  Flex,
} from '@chakra-ui/react'
import { 
  Shield,
  Search,
  Download,
  Filter,
  Clock,
  User,
  AlertTriangle,
  Activity
} from 'lucide-react'
import { motion } from 'framer-motion'

// Using motion.div directly to avoid deprecation warnings

interface AuditLogsProps {
  globalSearch: string
  adminUser: { role: string; id: string; name?: string | null }
  onRefresh: () => void
}

export function AuditLogs({ globalSearch, adminUser, onRefresh }: AuditLogsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [logs, setLogs] = useState([])
  const [logFilter, setLogFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('today')

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
          Only super administrators can access audit logs.
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
              Audit Logs
            </Heading>
            <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
              Security and system activity monitoring
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
              Export Logs
            </Button>
            <Button
              leftIcon={<Filter size={16} />}
              bg="#D4AF37"
              color="white"
              _hover={{ bg: "#B8941F" }}
              fontFamily="'Lato', sans-serif"
            >
              Advanced Filter
            </Button>
          </HStack>
        </HStack>

        {/* Filters */}
        <Card>
          <CardBody>
            <HStack spacing={4} wrap="wrap">
              <InputGroup maxW="300px">
                <InputLeftElement pointerEvents="none">
                  <Search size={16} color="#666" />
                </InputLeftElement>
                <Input
                  placeholder="Search logs..."
                  value={globalSearch}
                  bg="white"
                  border="1px solid"
                  borderColor="gray.300"
                  _hover={{ borderColor: "#D4AF37" }}
                  _focus={{ borderColor: "#D4AF37", boxShadow: "0 0 0 1px #D4AF37" }}
                />
              </InputGroup>
              
              <Select
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value)}
                w="150px"
              >
                <option value="all">All Actions</option>
                <option value="auth">Authentication</option>
                <option value="admin">Admin Actions</option>
                <option value="security">Security Events</option>
                <option value="errors">Error Logs</option>
              </Select>
              
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                w="120px"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </Select>
            </HStack>
          </CardBody>
        </Card>

        {/* Logs Tabs */}
        <Card>
          <CardBody p={0}>
            <Tabs variant="enclosed" colorScheme="yellow">
              <TabList>
                <Tab>
                  <HStack spacing={2}>
                    <Activity size={16} />
                    <Text>User Actions</Text>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={2}>
                    <Shield size={16} />
                    <Text>Security Events</Text>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={2}>
                    <AlertTriangle size={16} />
                    <Text>Error Logs</Text>
                  </HStack>
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={0}>
                  <TableContainer>
                    <Table variant="simple" size="sm">
                      <Thead bg="gray.50">
                        <Tr>
                          <Th fontFamily="'Lato', sans-serif">Timestamp</Th>
                          <Th fontFamily="'Lato', sans-serif">User</Th>
                          <Th fontFamily="'Lato', sans-serif">Action</Th>
                          <Th fontFamily="'Lato', sans-serif">Resource</Th>
                          <Th fontFamily="'Lato', sans-serif">IP Address</Th>
                          <Th fontFamily="'Lato', sans-serif">Status</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td colSpan={6}>
                            <Box textAlign="center" py={8}>
                              <Activity size={32} color="#D4AF37" />
                              <Text fontSize="md" color="#666" fontFamily="'Lato', sans-serif" mt={2}>
                                No audit logs available yet
                              </Text>
                              <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                                User actions will appear here once the system is active
                              </Text>
                            </Box>
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                </TabPanel>

                <TabPanel p={0}>
                  <TableContainer>
                    <Table variant="simple" size="sm">
                      <Thead bg="gray.50">
                        <Tr>
                          <Th fontFamily="'Lato', sans-serif">Timestamp</Th>
                          <Th fontFamily="'Lato', sans-serif">Event Type</Th>
                          <Th fontFamily="'Lato', sans-serif">Description</Th>
                          <Th fontFamily="'Lato', sans-serif">IP Address</Th>
                          <Th fontFamily="'Lato', sans-serif">Severity</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td colSpan={5}>
                            <Box textAlign="center" py={8}>
                              <Shield size={32} color="#D4AF37" />
                              <Text fontSize="md" color="#666" fontFamily="'Lato', sans-serif" mt={2}>
                                No security events recorded
                              </Text>
                              <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                                Security events and alerts will appear here
                              </Text>
                            </Box>
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                </TabPanel>

                <TabPanel p={0}>
                  <TableContainer>
                    <Table variant="simple" size="sm">
                      <Thead bg="gray.50">
                        <Tr>
                          <Th fontFamily="'Lato', sans-serif">Timestamp</Th>
                          <Th fontFamily="'Lato', sans-serif">Level</Th>
                          <Th fontFamily="'Lato', sans-serif">Message</Th>
                          <Th fontFamily="'Lato', sans-serif">Source</Th>
                          <Th fontFamily="'Lato', sans-serif">Stack Trace</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td colSpan={5}>
                            <Box textAlign="center" py={8}>
                              <AlertTriangle size={32} color="#D4AF37" />
                              <Text fontSize="md" color="#666" fontFamily="'Lato', sans-serif" mt={2}>
                                No error logs found
                              </Text>
                              <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                                System errors and exceptions will be logged here
                              </Text>
                            </Box>
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>

        {/* Coming Soon */}
        <Card>
          <CardBody>
            <VStack spacing={4} py={8}>
              <Shield size={48} color="#D4AF37" />
              <Heading
                as="h3"
                fontSize="xl"
                fontFamily="'Playfair Display', serif"
                color="#1A1A1A"
                fontWeight="400"
              >
                Comprehensive Audit System
              </Heading>
              <Text fontSize="md" color="#666" fontFamily="'Lato', sans-serif" textAlign="center" maxW="500px">
                Full audit logging system coming soon. This will include:
              </Text>
              <VStack spacing={2} align="start">
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • Real-time user action tracking
                </Text>
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • Security event monitoring and alerts
                </Text>
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • IP blocking and rate limiting tools
                </Text>
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • Detailed error logging with stack traces
                </Text>
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • Compliance reporting (GDPR, SOC2)
                </Text>
                <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                  • Advanced search and filtering
                </Text>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </motion.div>
  )
}
