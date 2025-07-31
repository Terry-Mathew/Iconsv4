'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Button,
  IconButton,
  Select,
  Checkbox,
  Textarea,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  Card,
  CardBody,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Link,
} from '@chakra-ui/react'
import { 
  Eye, 
  Check, 
  X, 
  MoreVertical, 
  FileText, 
  ExternalLink,
  Flag,
  Mail,
  Crown,
  Star,
  Trophy,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

// Using motion.div directly to avoid deprecation warnings

interface Nomination {
  id: string
  nominator_name?: string
  nominator_email: string
  nominee_name: string
  nominee_email?: string
  pitch: string
  desired_tier: 'emerging' | 'accomplished' | 'distinguished' | 'legacy'
  assigned_tier?: 'emerging' | 'accomplished' | 'distinguished' | 'legacy'
  status: 'pending' | 'approved' | 'rejected' | 'flagged'
  admin_notes?: string
  links?: string[]
  created_at: string
  reviewed_by?: string
  reviewed_at?: string
  updated_at?: string
}

interface NominationsManagementProps {
  globalSearch: string
  adminUser: { role: string; id: string; name?: string | null }
  onRefresh: () => void
}

const TIER_CONFIG = {
  emerging: {
    name: 'Emerging',
    price: '₹2,500/year',
    icon: Star,
    color: 'green'
  },
  accomplished: {
    name: 'Accomplished',
    price: '₹5,000/year',
    icon: Crown,
    color: 'blue'
  },
  distinguished: {
    name: 'Distinguished',
    price: '₹12,000/year',
    icon: Trophy,
    color: 'purple'
  },
  legacy: {
    name: 'Legacy',
    price: '₹50,000 lifetime',
    icon: Trophy,
    color: 'purple'
  }
} as const

const STATUS_COLORS = {
  pending: 'yellow',
  approved: 'green',
  rejected: 'red',
  flagged: 'orange'
}

export function NominationsManagement({ globalSearch, adminUser, onRefresh }: NominationsManagementProps) {
  const [nominations, setNominations] = useState<Nomination[]>([])
  const [filteredNominations, setFilteredNominations] = useState<Nomination[]>([])
  const [selectedNominations, setSelectedNominations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('pending')
  const [tierFilter, setTierFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedNomination, setSelectedNomination] = useState<Nomination | null>(null)
  const [assignedTier, setAssignedTier] = useState<'emerging' | 'accomplished' | 'distinguished' | 'legacy'>('emerging')
  const [adminNotes, setAdminNotes] = useState('')
  const [tempPassword, setTempPassword] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  const { isOpen: isReviewModalOpen, onOpen: onReviewModalOpen, onClose: onReviewModalClose } = useDisclosure()
  
  const toast = useToast()
  const supabase = createClient()

  // Load nominations
  useEffect(() => {
    loadNominations()
  }, [])

  // Filter nominations based on search and filters
  useEffect(() => {
    let filtered = nominations.filter(nomination => {
      const matchesSearch = globalSearch === '' ||
        nomination.nominee_name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        (nomination.nominator_name || '').toLowerCase().includes(globalSearch.toLowerCase()) ||
        (nomination.nominee_email || '').toLowerCase().includes(globalSearch.toLowerCase()) ||
        nomination.pitch.toLowerCase().includes(globalSearch.toLowerCase())

      const matchesStatus = statusFilter === 'all' || nomination.status === statusFilter
      const matchesTier = tierFilter === 'all' || nomination.desired_tier === tierFilter

      return matchesSearch && matchesStatus && matchesTier
    })

    // Sort nominations
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof Nomination] || ''
      let bValue = b[sortBy as keyof Nomination] || ''
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase()
      if (typeof bValue === 'string') bValue = bValue.toLowerCase()
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    setFilteredNominations(filtered)
  }, [nominations, globalSearch, statusFilter, tierFilter, sortBy, sortOrder])

  const loadNominations = async () => {
    try {
      setIsLoading(true)

      // For now, use mock data until database schema is updated
      // TODO: Replace with actual database query after running migration
      const mockNominations: Nomination[] = [
        {
          id: '1',
          nominator_name: 'Sarah Johnson',
          nominator_email: 'sarah.johnson@example.com',
          nominee_name: 'Dr. Michael Chen',
          nominee_email: 'michael.chen@example.com',
          pitch: 'Dr. Chen is a renowned cardiologist who has saved countless lives and pioneered new surgical techniques. His innovative approaches to cardiac surgery have reduced patient recovery times by 40% and his research on minimally invasive procedures has been published in leading medical journals.',
          desired_tier: 'accomplished',
          links: ['https://linkedin.com/in/michael-chen', 'https://hospital.com/dr-chen'],
          status: 'pending',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          nominator_name: 'David Wilson',
          nominator_email: 'david.wilson@example.com',
          nominee_name: 'Prof. Lisa Rodriguez',
          nominee_email: 'lisa.rodriguez@example.com',
          pitch: 'Professor Rodriguez has revolutionized environmental science and led groundbreaking climate research. Her work on carbon capture technology has been adopted by 15 countries and her climate models are used by the IPCC.',
          desired_tier: 'legacy',
          links: ['https://university.edu/prof-rodriguez', 'https://climate-research.org'],
          status: 'approved',
          created_at: '2024-01-14T14:20:00Z',
          reviewed_by: 'admin@iconsherald.com',
          reviewed_at: '2024-01-16T09:15:00Z',
          assigned_tier: 'legacy'
        },
        {
          id: '3',
          nominator_name: 'Emily Davis',
          nominator_email: 'emily.davis@example.com',
          nominee_name: 'James Thompson',
          nominee_email: 'james.thompson@example.com',
          pitch: 'James is an inspiring teacher who has transformed education in underserved communities. He has developed innovative teaching methods that have improved student outcomes by 60% and trained over 500 teachers.',
          desired_tier: 'emerging',
          links: ['https://school.edu/james-thompson'],
          status: 'rejected',
          created_at: '2024-01-13T16:45:00Z',
          reviewed_by: 'admin@iconsherald.com',
          reviewed_at: '2024-01-15T11:30:00Z',
          admin_notes: 'Insufficient supporting evidence for nomination criteria. Need more documentation of impact.'
        },
        {
          id: '4',
          nominator_name: 'Robert Brown',
          nominator_email: 'robert.brown@example.com',
          nominee_name: 'Dr. Amanda Foster',
          nominee_email: 'amanda.foster@example.com',
          pitch: 'Dr. Foster has made significant contributions to pediatric medicine and child welfare. She has pioneered new treatments for rare childhood diseases and established free clinics in 12 countries.',
          desired_tier: 'accomplished',
          links: ['https://hospital.com/dr-foster', 'https://pediatrics.org/amanda-foster'],
          status: 'flagged',
          created_at: '2024-01-12T12:00:00Z',
          admin_notes: 'Flagged for review - need to verify credentials and supporting documentation.'
        },
        {
          id: '5',
          nominator_name: 'Maria Garcia',
          nominator_email: 'maria.garcia@example.com',
          nominee_name: 'Dr. Raj Patel',
          nominee_email: 'raj.patel@example.com',
          pitch: 'Dr. Patel is a pioneering researcher in artificial intelligence and machine learning. His algorithms are used by major tech companies and his work on ethical AI has influenced global policy.',
          desired_tier: 'distinguished',
          links: ['https://university.edu/raj-patel', 'https://ai-research.org/raj-patel'],
          status: 'pending',
          created_at: '2024-01-11T08:15:00Z'
        }
      ]

      setNominations(mockNominations)

      console.log(`Loaded ${mockNominations.length} mock nominations for development`)

      toast({
        title: 'Development Mode',
        description: `Loaded ${mockNominations.length} mock nominations - database schema update needed for live data`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      })

    } catch (error) {
      console.error('Error loading nominations:', error)
      setNominations([])

      toast({
        title: 'Error',
        description: 'Failed to load nominations',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateTempPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const handleApproveNomination = async () => {
    if (!selectedNomination) return

    setIsProcessing(true)
    try {
      const password = tempPassword || generateTempPassword()

      // Update nomination status and assigned tier
      const { error: updateError } = await supabase
        .from('nominations')
        .update({
          status: 'approved',
          assigned_tier: assignedTier,
          admin_notes: adminNotes,
          reviewed_by: adminUser.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', selectedNomination.id)

      if (updateError) throw updateError

      // Send invitation email via API
      try {
        const response = await fetch('/api/admin/send-invitation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: selectedNomination.nominee_email,
            name: selectedNomination.nominee_name,
            tier: assignedTier,
            tempPassword: password
          })
        })

        if (!response.ok) {
          console.warn('Failed to send invitation email')
        }
      } catch (emailError) {
        console.warn('Email sending failed:', emailError)
      }

      toast({
        title: 'Nomination Approved',
        description: `${selectedNomination.nominee_name} has been approved for ${TIER_CONFIG[assignedTier].name} tier`,
        status: 'success',
        duration: 8000,
        isClosable: true,
      })

      loadNominations()
      onReviewModalClose()
      resetModalState()
    } catch (error) {
      console.error('Error approving nomination:', error)
      toast({
        title: 'Approval Failed',
        description: 'Failed to approve nomination. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectNomination = async () => {
    if (!selectedNomination) return

    setIsProcessing(true)
    try {
      const { error } = await supabase
        .from('nominations')
        .update({
          status: 'rejected',
          admin_notes: adminNotes,
          reviewed_by: adminUser.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', selectedNomination.id)

      if (error) throw error

      toast({
        title: 'Nomination Rejected',
        description: `${selectedNomination.nominee_name}'s nomination has been rejected`,
        status: 'info',
        duration: 5000,
        isClosable: true,
      })

      loadNominations()
      onReviewModalClose()
      resetModalState()
    } catch (error) {
      console.error('Error rejecting nomination:', error)
      toast({
        title: 'Rejection Failed',
        description: 'Failed to reject nomination. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFlagNomination = async (nominationId: string) => {
    try {
      const { error } = await supabase
        .from('nominations')
        .update({
          status: 'flagged',
          admin_notes: 'Flagged for review - inappropriate content detected',
          reviewed_by: adminUser.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', nominationId)

      if (error) throw error

      toast({
        title: 'Nomination Flagged',
        description: 'Nomination has been flagged for review',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })

      loadNominations()
    } catch (error) {
      console.error('Error flagging nomination:', error)
      toast({
        title: 'Error',
        description: 'Failed to flag nomination',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedNominations.length === 0) {
      toast({
        title: 'No Selection',
        description: 'Please select nominations to perform bulk actions',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      let updateData: any = {
        reviewed_by: adminUser.id,
        reviewed_at: new Date().toISOString()
      }
      
      switch (action) {
        case 'approve':
          updateData.status = 'approved'
          updateData.assigned_tier = 'emerging' // Default tier for bulk approval
          break
        case 'reject':
          updateData.status = 'rejected'
          updateData.admin_notes = 'Bulk rejected'
          break
        case 'flag':
          updateData.status = 'flagged'
          updateData.admin_notes = 'Bulk flagged for review'
          break
        default:
          return
      }

      const { error } = await supabase
        .from('nominations')
        .update(updateData)
        .in('id', selectedNominations)

      if (error) throw error

      toast({
        title: 'Bulk Action Completed',
        description: `${selectedNominations.length} nominations updated successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      setSelectedNominations([])
      loadNominations()
    } catch (error) {
      console.error('Error performing bulk action:', error)
      toast({
        title: 'Error',
        description: 'Failed to perform bulk action',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const openReviewModal = (nomination: Nomination) => {
    setSelectedNomination(nomination)
    setAssignedTier(nomination.desired_tier)
    setAdminNotes(nomination.admin_notes || '')
    setTempPassword('')
    onReviewModalOpen()
  }

  const resetModalState = () => {
    setSelectedNomination(null)
    setAdminNotes('')
    setTempPassword('')
  }

  const toggleNominationSelection = (nominationId: string) => {
    setSelectedNominations(prev => 
      prev.includes(nominationId) 
        ? prev.filter(id => id !== nominationId)
        : [...prev, nominationId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedNominations.length === filteredNominations.length) {
      setSelectedNominations([])
    } else {
      setSelectedNominations(filteredNominations.map(nomination => nomination.id))
    }
  }

  const getStatusBadge = (status: string) => {
    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle,
      flagged: Flag
    }
    
    const IconComponent = icons[status as keyof typeof icons] || Clock
    
    return (
      <Badge
        colorScheme={STATUS_COLORS[status as keyof typeof STATUS_COLORS]}
        variant="subtle"
        fontSize="xs"
      >
        <HStack spacing={1}>
          <IconComponent size={10} />
          <Text>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
        </HStack>
      </Badge>
    )
  }

  const getTierBadge = (tier: string) => {
    const config = TIER_CONFIG[tier as keyof typeof TIER_CONFIG]
    if (!config) return null
    
    const IconComponent = config.icon
    
    return (
      <Badge colorScheme={config.color} variant="subtle" fontSize="xs">
        <HStack spacing={1}>
          <IconComponent size={10} />
          <Text>{config.name}</Text>
        </HStack>
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="400px">
        <VStack spacing={4}>
          <Spinner size="xl" color="#D4AF37" thickness="4px" />
          <Text fontFamily="'Lato', sans-serif" color="#666">
            Loading nominations...
          </Text>
        </VStack>
      </Flex>
    )
  }

  const stats = {
    total: nominations.length,
    pending: nominations.filter(n => n.status === 'pending').length,
    approved: nominations.filter(n => n.status === 'approved').length,
    rejected: nominations.filter(n => n.status === 'rejected').length,
    flagged: nominations.filter(n => n.status === 'flagged').length,
    approvalRate: nominations.length > 0 ? Math.round((nominations.filter(n => n.status === 'approved').length / nominations.length) * 100) : 0
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
              Nominations Management
            </Heading>
            <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
              Review and approve nominations for the platform
            </Text>
          </VStack>

          <Button
            leftIcon={<Mail size={16} />}
            bg="#D4AF37"
            color="white"
            _hover={{ bg: "#B8941F" }}
            fontFamily="'Lato', sans-serif"
            onClick={() => {/* TODO: Implement bulk email */}}
          >
            Send Notifications
          </Button>
        </HStack>

        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="sm" color="#666">Total</StatLabel>
                <StatNumber fontSize="2xl" color="#1A1A1A">{stats.total}</StatNumber>
                <StatHelpText>
                  <HStack spacing={1}>
                    <FileText size={12} />
                    <Text fontSize="xs">All nominations</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="sm" color="#666">Pending</StatLabel>
                <StatNumber fontSize="2xl" color="#ECC94B">{stats.pending}</StatNumber>
                <StatHelpText>
                  <HStack spacing={1}>
                    <Clock size={12} />
                    <Text fontSize="xs">Awaiting review</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="sm" color="#666">Approved</StatLabel>
                <StatNumber fontSize="2xl" color="#38A169">{stats.approved}</StatNumber>
                <StatHelpText>
                  <HStack spacing={1}>
                    <CheckCircle size={12} />
                    <Text fontSize="xs">Accepted</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="sm" color="#666">Rejected</StatLabel>
                <StatNumber fontSize="2xl" color="#E53E3E">{stats.rejected}</StatNumber>
                <StatHelpText>
                  <HStack spacing={1}>
                    <XCircle size={12} />
                    <Text fontSize="xs">Declined</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="sm" color="#666">Approval Rate</StatLabel>
                <StatNumber fontSize="2xl" color="#9F7AEA">{stats.approvalRate}%</StatNumber>
                <StatHelpText>
                  <HStack spacing={1}>
                    <TrendingUp size={12} />
                    <Text fontSize="xs">Success rate</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Filters and Bulk Actions */}
        <Card>
          <CardBody>
            <HStack spacing={4} wrap="wrap">
              <HStack spacing={2}>
                <Text fontSize="sm" fontWeight="500" color="#1A1A1A">Filters:</Text>
                <Select
                  size="sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  w="120px"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="flagged">Flagged</option>
                </Select>

                <Select
                  size="sm"
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  w="120px"
                >
                  <option value="all">All Tiers</option>
                  <option value="emerging">Emerging</option>
                  <option value="accomplished">Accomplished</option>
                  <option value="distinguished">Distinguished</option>
                  <option value="legacy">Legacy</option>
                </Select>

                <Select
                  size="sm"
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-')
                    setSortBy(field)
                    setSortOrder(order as 'asc' | 'desc')
                  }}
                  w="140px"
                >
                  <option value="created_at-desc">Newest First</option>
                  <option value="created_at-asc">Oldest First</option>
                  <option value="nominee_name-asc">Nominee A-Z</option>
                  <option value="nominee_name-desc">Nominee Z-A</option>
                </Select>
              </HStack>

              {selectedNominations.length > 0 && (
                <HStack spacing={2} ml="auto">
                  <Text fontSize="sm" color="#666">
                    {selectedNominations.length} selected
                  </Text>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="green"
                    onClick={() => handleBulkAction('approve')}
                  >
                    Bulk Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="red"
                    onClick={() => handleBulkAction('reject')}
                  >
                    Bulk Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="orange"
                    onClick={() => handleBulkAction('flag')}
                  >
                    Bulk Flag
                  </Button>
                </HStack>
              )}
            </HStack>
          </CardBody>
        </Card>

        {/* Nominations Table */}
        <Card>
          <CardBody p={0}>
            <TableContainer>
              <Table variant="simple" size="sm">
                <Thead bg="gray.50">
                  <Tr>
                    <Th w="40px">
                      <Checkbox
                        isChecked={selectedNominations.length === filteredNominations.length && filteredNominations.length > 0}
                        isIndeterminate={selectedNominations.length > 0 && selectedNominations.length < filteredNominations.length}
                        onChange={toggleSelectAll}
                      />
                    </Th>
                    <Th fontFamily="'Lato', sans-serif">Nominee</Th>
                    <Th fontFamily="'Lato', sans-serif">Nominator</Th>
                    <Th fontFamily="'Lato', sans-serif">Desired Tier</Th>
                    <Th fontFamily="'Lato', sans-serif">Status</Th>
                    <Th fontFamily="'Lato', sans-serif">Submitted</Th>
                    <Th fontFamily="'Lato', sans-serif" w="120px">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredNominations.map((nomination) => (
                    <Tr key={nomination.id} _hover={{ bg: "gray.50" }}>
                      <Td>
                        <Checkbox
                          isChecked={selectedNominations.includes(nomination.id)}
                          onChange={() => toggleNominationSelection(nomination.id)}
                        />
                      </Td>
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="500" fontSize="sm" fontFamily="'Lato', sans-serif">
                            {nomination.nominee_name}
                          </Text>
                          <Text fontSize="xs" color="#666" fontFamily="'Lato', sans-serif">
                            {nomination.nominee_email}
                          </Text>
                        </VStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" fontFamily="'Lato', sans-serif">
                            {nomination.nominator_name}
                          </Text>
                          <Text fontSize="xs" color="#666" fontFamily="'Lato', sans-serif">
                            {nomination.nominator_email}
                          </Text>
                        </VStack>
                      </Td>
                      <Td>
                        {getTierBadge(nomination.desired_tier)}
                      </Td>
                      <Td>
                        {getStatusBadge(nomination.status)}
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                          {new Date(nomination.created_at).toLocaleDateString()}
                        </Text>
                      </Td>
                      <Td>
                        <HStack spacing={1}>
                          <Button
                            size="xs"
                            variant="outline"
                            leftIcon={<Eye size={12} />}
                            onClick={() => openReviewModal(nomination)}
                            borderColor="#D4AF37"
                            color="#D4AF37"
                            _hover={{ bg: "#D4AF37", color: "white" }}
                          >
                            Review
                          </Button>

                          {nomination.links && nomination.links.length > 0 && (
                            <IconButton
                              size="xs"
                              variant="ghost"
                              aria-label="View links"
                              icon={<ExternalLink size={12} />}
                              as="a"
                              href={nomination.links[0]}
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          )}

                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<MoreVertical size={12} />}
                              variant="ghost"
                              size="xs"
                              aria-label="More actions"
                            />
                            <MenuList>
                              <MenuItem
                                icon={<Flag size={14} />}
                                onClick={() => handleFlagNomination(nomination.id)}
                              >
                                Flag for Review
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            {filteredNominations.length === 0 && (
              <Box textAlign="center" py={12}>
                <Text fontSize="lg" color="#666" fontFamily="'Lato', sans-serif">
                  No nominations found matching your criteria
                </Text>
              </Box>
            )}
          </CardBody>
        </Card>
      </VStack>

      {/* Review Modal */}
      <Modal isOpen={isReviewModalOpen} onClose={onReviewModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily="'Playfair Display', serif">
            Review Nomination
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedNomination && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold" mb={2}>Nominee:</Text>
                  <Text>{selectedNomination.nominee_name} ({selectedNomination.nominee_email})</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={2}>Nominator:</Text>
                  <Text>{selectedNomination.nominator_name} ({selectedNomination.nominator_email})</Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={2}>Pitch:</Text>
                  <Text whiteSpace="pre-wrap" fontSize="sm" p={3} bg="gray.50" borderRadius="md">
                    {selectedNomination.pitch}
                  </Text>
                </Box>

                <Box>
                  <Text fontWeight="bold" mb={2}>Desired Tier:</Text>
                  {getTierBadge(selectedNomination.desired_tier)}
                </Box>

                {selectedNomination.links && selectedNomination.links.length > 0 && (
                  <Box>
                    <Text fontWeight="bold" mb={2}>Supporting Links:</Text>
                    <VStack align="start" spacing={1}>
                      {selectedNomination.links.map((link, index) => (
                        <Link key={index} href={link} isExternal color="blue.500" fontSize="sm">
                          {link} <ExternalLink size={12} style={{ display: 'inline' }} />
                        </Link>
                      ))}
                    </VStack>
                  </Box>
                )}

                {selectedNomination.status === 'pending' && (
                  <>
                    <FormControl>
                      <FormLabel>Assign Tier:</FormLabel>
                      <Select
                        value={assignedTier}
                        onChange={(e) => setAssignedTier(e.target.value as 'emerging' | 'accomplished' | 'distinguished' | 'legacy')}
                      >
                        <option value="emerging">Emerging - ₹2,500/year</option>
                        <option value="accomplished">Accomplished - ₹5,000/year</option>
                        <option value="distinguished">Distinguished - ₹12,000/year</option>
                        <option value="legacy">Legacy - ₹50,000 lifetime</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Admin Notes:</FormLabel>
                      <Textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Internal notes about this nomination..."
                        rows={3}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Temporary Password (optional):</FormLabel>
                      <Input
                        value={tempPassword}
                        onChange={(e) => setTempPassword(e.target.value)}
                        placeholder="Leave blank to auto-generate"
                      />
                    </FormControl>
                  </>
                )}

                {selectedNomination.admin_notes && (
                  <Box>
                    <Text fontWeight="bold" mb={2}>Admin Notes:</Text>
                    <Text whiteSpace="pre-wrap" fontSize="sm" p={3} bg="gray.50" borderRadius="md">
                      {selectedNomination.admin_notes}
                    </Text>
                  </Box>
                )}

                {selectedNomination.reviewed_by && (
                  <Box>
                    <Text fontWeight="bold" mb={2}>Review Details:</Text>
                    <Text fontSize="sm" color="#666">
                      Reviewed on {selectedNomination.reviewed_at ? new Date(selectedNomination.reviewed_at).toLocaleDateString() : 'Unknown'}
                    </Text>
                  </Box>
                )}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onReviewModalClose}>
                Cancel
              </Button>
              {selectedNomination?.status === 'pending' && (
                <>
                  <Button
                    colorScheme="red"
                    onClick={handleRejectNomination}
                    isLoading={isProcessing}
                    leftIcon={<X size={16} />}
                  >
                    Reject
                  </Button>
                  <Button
                    colorScheme="green"
                    onClick={handleApproveNomination}
                    isLoading={isProcessing}
                    leftIcon={<Check size={16} />}
                  >
                    Approve & Send Invitation
                  </Button>
                </>
              )}
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </motion.div>
  )
}
