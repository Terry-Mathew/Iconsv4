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
  Avatar,
  Badge,
  Button,
  IconButton,
  Select,
  Checkbox,
  Input,
  InputGroup,
  InputLeftElement,
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
} from '@chakra-ui/react'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  Shield, 
  Ban, 
  Trash2, 
  Eye,
  Users,
  UserCheck,
  UserX,
  TrendingUp
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

// Using motion.div directly to avoid deprecation warnings

interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  role: 'visitor' | 'applicant' | 'member' | 'admin' | 'super_admin'
  status: 'active' | 'suspended' | 'banned'
  last_login?: string
  created_at: string
  profile_count?: number
}

interface UsersManagementProps {
  globalSearch: string
  adminUser: { role: string; id: string; name?: string | null }
  onRefresh: () => void
}

const ROLE_COLORS = {
  visitor: 'gray',
  applicant: 'blue',
  member: 'green',
  admin: 'purple',
  super_admin: 'red'
}

const STATUS_COLORS = {
  active: 'green',
  suspended: 'yellow',
  banned: 'red'
}

export function UsersManagement({ globalSearch, adminUser, onRefresh }: UsersManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  
  const { isOpen: isRoleModalOpen, onOpen: onRoleModalOpen, onClose: onRoleModalClose } = useDisclosure()
  const { isOpen: isDetailsModalOpen, onOpen: onDetailsModalOpen, onClose: onDetailsModalClose } = useDisclosure()
  
  const toast = useToast()
  const supabase = createClient()

  // Load users
  useEffect(() => {
    loadUsers()
  }, [])

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users.filter(user => {
      const matchesSearch = globalSearch === '' || 
        user.email.toLowerCase().includes(globalSearch.toLowerCase()) ||
        user.name?.toLowerCase().includes(globalSearch.toLowerCase())
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter
      
      return matchesSearch && matchesRole && matchesStatus
    })

    // Sort users
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof User] || ''
      let bValue = b[sortBy as keyof User] || ''
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase()
      if (typeof bValue === 'string') bValue = bValue.toLowerCase()
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    setFilteredUsers(filtered)
  }, [users, globalSearch, roleFilter, statusFilter, sortBy, sortOrder])

  const loadUsers = async () => {
    try {
      setIsLoading(true)

      // For development: Use mock data when database is not available
      // TODO: Replace with actual database query when ready
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'john.doe@example.com',
          name: 'John Doe',
          avatar_url: undefined,
          role: 'member',
          status: 'active',
          last_login: '2024-01-15T10:30:00Z',
          created_at: '2024-01-01T00:00:00Z',
          profile_count: 1
        },
        {
          id: '2',
          email: 'jane.smith@example.com',
          name: 'Jane Smith',
          avatar_url: undefined,
          role: 'admin',
          status: 'active',
          last_login: '2024-01-16T14:20:00Z',
          created_at: '2024-01-02T00:00:00Z',
          profile_count: 0
        },
        {
          id: '3',
          email: 'bob.wilson@example.com',
          name: 'Bob Wilson',
          avatar_url: undefined,
          role: 'applicant',
          status: 'suspended',
          last_login: '2024-01-10T09:15:00Z',
          created_at: '2024-01-03T00:00:00Z',
          profile_count: 0
        },
        {
          id: '4',
          email: 'alice.brown@example.com',
          name: 'Alice Brown',
          avatar_url: undefined,
          role: 'member',
          status: 'active',
          last_login: '2024-01-17T16:45:00Z',
          created_at: '2024-01-04T00:00:00Z',
          profile_count: 2
        },
        {
          id: '5',
          email: 'charlie.davis@example.com',
          name: 'Charlie Davis',
          avatar_url: undefined,
          role: 'visitor',
          status: 'banned',
          last_login: '2024-01-05T12:00:00Z',
          created_at: '2024-01-05T00:00:00Z',
          profile_count: 0
        }
      ]

      console.log('Loading mock users for development:', mockUsers.length)
      setUsers(mockUsers)

      // Show info toast about using mock data
      toast({
        title: 'Development Mode',
        description: `Loaded ${mockUsers.length} mock users - database connection needed for live data`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      })

    } catch (error) {
      console.error('Error loading users:', error)

      // Set empty array as fallback
      setUsers([])

      toast({
        title: 'Error',
        description: 'Failed to load users - using empty dataset',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      toast({
        title: 'Role Updated',
        description: 'User role has been updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      loadUsers()
    } catch (error) {
      console.error('Error updating role:', error)
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId)

      if (error) throw error

      toast({
        title: 'Status Updated',
        description: 'User status has been updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      loadUsers()
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      toast({
        title: 'No Selection',
        description: 'Please select users to perform bulk actions',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      let updateData: any = {}
      
      switch (action) {
        case 'suspend':
          updateData = { status: 'suspended' }
          break
        case 'activate':
          updateData = { status: 'active' }
          break
        case 'ban':
          updateData = { status: 'banned' }
          break
        default:
          return
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .in('id', selectedUsers)

      if (error) throw error

      toast({
        title: 'Bulk Action Completed',
        description: `${selectedUsers.length} users updated successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      setSelectedUsers([])
      loadUsers()
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

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id))
    }
  }

  const openUserDetails = (user: User) => {
    setSelectedUser(user)
    onDetailsModalOpen()
  }

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="400px">
        <VStack spacing={4}>
          <Spinner size="xl" color="#D4AF37" thickness="4px" />
          <Text fontFamily="'Lato', sans-serif" color="#666">
            Loading users...
          </Text>
        </VStack>
      </Flex>
    )
  }

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    suspended: users.filter(u => u.status === 'suspended').length,
    admins: users.filter(u => ['admin', 'super_admin'].includes(u.role)).length
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
              Users Management
            </Heading>
            <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
              Manage user accounts, roles, and permissions
            </Text>
          </VStack>
          
          <Button
            leftIcon={<UserPlus size={16} />}
            bg="#D4AF37"
            color="white"
            _hover={{ bg: "#B8941F" }}
            fontFamily="'Lato', sans-serif"
            onClick={() => {/* TODO: Implement invite user */}}
          >
            Invite User
          </Button>
        </HStack>

        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="sm" color="#666">Total Users</StatLabel>
                <StatNumber fontSize="2xl" color="#1A1A1A">{stats.total}</StatNumber>
                <StatHelpText>
                  <HStack spacing={1}>
                    <Users size={12} />
                    <Text fontSize="xs">All registered</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="sm" color="#666">Active Users</StatLabel>
                <StatNumber fontSize="2xl" color="#38A169">{stats.active}</StatNumber>
                <StatHelpText>
                  <HStack spacing={1}>
                    <UserCheck size={12} />
                    <Text fontSize="xs">Currently active</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="sm" color="#666">Suspended</StatLabel>
                <StatNumber fontSize="2xl" color="#ECC94B">{stats.suspended}</StatNumber>
                <StatHelpText>
                  <HStack spacing={1}>
                    <UserX size={12} />
                    <Text fontSize="xs">Temporarily suspended</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="sm" color="#666">Admins</StatLabel>
                <StatNumber fontSize="2xl" color="#9F7AEA">{stats.admins}</StatNumber>
                <StatHelpText>
                  <HStack spacing={1}>
                    <Shield size={12} />
                    <Text fontSize="xs">Admin access</Text>
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
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  w="120px"
                >
                  <option value="all">All Roles</option>
                  <option value="visitor">Visitor</option>
                  <option value="applicant">Applicant</option>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </Select>

                <Select
                  size="sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  w="120px"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="banned">Banned</option>
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
                  <option value="email-asc">Email A-Z</option>
                  <option value="email-desc">Email Z-A</option>
                  <option value="last_login-desc">Last Login</option>
                </Select>
              </HStack>

              {selectedUsers.length > 0 && (
                <HStack spacing={2} ml="auto">
                  <Text fontSize="sm" color="#666">
                    {selectedUsers.length} selected
                  </Text>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="green"
                    onClick={() => handleBulkAction('activate')}
                  >
                    Activate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="yellow"
                    onClick={() => handleBulkAction('suspend')}
                  >
                    Suspend
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="red"
                    onClick={() => handleBulkAction('ban')}
                  >
                    Ban
                  </Button>
                </HStack>
              )}
            </HStack>
          </CardBody>
        </Card>

        {/* Users Table */}
        <Card>
          <CardBody p={0}>
            <TableContainer>
              <Table variant="simple" size="sm">
                <Thead bg="gray.50">
                  <Tr>
                    <Th w="40px">
                      <Checkbox
                        isChecked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        isIndeterminate={selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length}
                        onChange={toggleSelectAll}
                      />
                    </Th>
                    <Th fontFamily="'Lato', sans-serif">User</Th>
                    <Th fontFamily="'Lato', sans-serif">Role</Th>
                    <Th fontFamily="'Lato', sans-serif">Status</Th>
                    <Th fontFamily="'Lato', sans-serif">Last Login</Th>
                    <Th fontFamily="'Lato', sans-serif">Joined</Th>
                    <Th fontFamily="'Lato', sans-serif" w="100px">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredUsers.map((user) => (
                    <Tr key={user.id} _hover={{ bg: "gray.50" }}>
                      <Td>
                        <Checkbox
                          isChecked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                        />
                      </Td>
                      <Td>
                        <HStack spacing={3}>
                          <Avatar
                            size="sm"
                            name={user.name || user.email}
                            src={user.avatar_url}
                            bg="#D4AF37"
                            color="white"
                          />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="500" fontSize="sm" fontFamily="'Lato', sans-serif">
                              {user.name || 'Unnamed User'}
                            </Text>
                            <Text fontSize="xs" color="#666" fontFamily="'Lato', sans-serif">
                              {user.email}
                            </Text>
                          </VStack>
                        </HStack>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={ROLE_COLORS[user.role]}
                          variant="subtle"
                          fontSize="xs"
                        >
                          {user.role.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={STATUS_COLORS[user.status]}
                          variant="subtle"
                          fontSize="xs"
                        >
                          {user.status.toUpperCase()}
                        </Badge>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                          {user.last_login
                            ? new Date(user.last_login).toLocaleDateString()
                            : 'Never'
                          }
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                          {new Date(user.created_at).toLocaleDateString()}
                        </Text>
                      </Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<MoreVertical size={16} />}
                            variant="ghost"
                            size="sm"
                            aria-label="User actions"
                          />
                          <MenuList>
                            <MenuItem
                              icon={<Eye size={14} />}
                              onClick={() => openUserDetails(user)}
                            >
                              View Details
                            </MenuItem>
                            {adminUser.role === 'super_admin' && (
                              <MenuItem
                                icon={<Shield size={14} />}
                                onClick={() => {
                                  setSelectedUser(user)
                                  onRoleModalOpen()
                                }}
                              >
                                Change Role
                              </MenuItem>
                            )}
                            <MenuItem
                              icon={<Ban size={14} />}
                              onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'suspended' : 'active')}
                            >
                              {user.status === 'active' ? 'Suspend' : 'Activate'}
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            {filteredUsers.length === 0 && (
              <Box textAlign="center" py={12}>
                <Text fontSize="lg" color="#666" fontFamily="'Lato', sans-serif">
                  No users found matching your criteria
                </Text>
              </Box>
            )}
          </CardBody>
        </Card>
      </VStack>

      {/* Role Change Modal */}
      <Modal isOpen={isRoleModalOpen} onClose={onRoleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily="'Playfair Display', serif">
            Change User Role
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedUser && (
              <VStack spacing={4} align="stretch">
                <HStack spacing={3}>
                  <Avatar
                    size="md"
                    name={selectedUser.name || selectedUser.email}
                    src={selectedUser.avatar_url}
                    bg="#D4AF37"
                    color="white"
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="500" fontFamily="'Lato', sans-serif">
                      {selectedUser.name || 'Unnamed User'}
                    </Text>
                    <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
                      {selectedUser.email}
                    </Text>
                  </VStack>
                </HStack>

                <FormControl>
                  <FormLabel>New Role</FormLabel>
                  <Select
                    defaultValue={selectedUser.role}
                    onChange={(e) => {
                      if (selectedUser) {
                        handleRoleChange(selectedUser.id, e.target.value)
                        onRoleModalClose()
                      }
                    }}
                  >
                    <option value="visitor">Visitor</option>
                    <option value="applicant">Applicant</option>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </Select>
                </FormControl>

                <Alert status="warning" borderRadius="md">
                  <AlertIcon />
                  <Text fontSize="sm">
                    Changing user roles affects their access permissions. This action cannot be undone.
                  </Text>
                </Alert>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onRoleModalClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* User Details Modal */}
      <Modal isOpen={isDetailsModalOpen} onClose={onDetailsModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily="'Playfair Display', serif">
            User Details
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedUser && (
              <VStack spacing={6} align="stretch">
                <HStack spacing={4}>
                  <Avatar
                    size="xl"
                    name={selectedUser.name || selectedUser.email}
                    src={selectedUser.avatar_url}
                    bg="#D4AF37"
                    color="white"
                  />
                  <VStack align="start" spacing={2}>
                    <Text fontSize="xl" fontWeight="600" fontFamily="'Playfair Display', serif">
                      {selectedUser.name || 'Unnamed User'}
                    </Text>
                    <Text color="#666" fontFamily="'Lato', sans-serif">
                      {selectedUser.email}
                    </Text>
                    <HStack spacing={2}>
                      <Badge colorScheme={ROLE_COLORS[selectedUser.role]} variant="subtle">
                        {selectedUser.role.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge colorScheme={STATUS_COLORS[selectedUser.status]} variant="subtle">
                        {selectedUser.status.toUpperCase()}
                      </Badge>
                    </HStack>
                  </VStack>
                </HStack>

                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text fontSize="sm" fontWeight="500" color="#1A1A1A" mb={1}>
                      Member Since
                    </Text>
                    <Text fontSize="sm" color="#666">
                      {new Date(selectedUser.created_at).toLocaleDateString()}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="500" color="#1A1A1A" mb={1}>
                      Last Login
                    </Text>
                    <Text fontSize="sm" color="#666">
                      {selectedUser.last_login
                        ? new Date(selectedUser.last_login).toLocaleDateString()
                        : 'Never logged in'
                      }
                    </Text>
                  </Box>
                </SimpleGrid>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onDetailsModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </motion.div>
  )
}
