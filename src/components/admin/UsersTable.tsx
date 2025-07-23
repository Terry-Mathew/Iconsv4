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
  Select,
  useToast,
  Spinner,
  Center,
  Avatar,
} from '@chakra-ui/react'
import { Edit, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth/auth-context'

interface UsersTableProps {
  onUpdate?: () => void
}

export function UsersTable({ onUpdate }: UsersTableProps) {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const { user } = useAuth()
  const toast = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          profiles (
            id,
            tier,
            status,
            slug
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (err: any) {
      toast({
        title: 'Error loading users',
        description: err.message,
        status: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    setUpdating(userId)
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      toast({
        title: 'Role updated successfully',
        status: 'success',
        duration: 3000,
      })

      await loadUsers()
      onUpdate?.()
    } catch (err: any) {
      toast({
        title: 'Error updating role',
        description: err.message,
        status: 'error',
        duration: 5000,
      })
    } finally {
      setUpdating(null)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'red'
      case 'admin': return 'orange'
      case 'member': return 'blue'
      case 'applicant': return 'yellow'
      default: return 'gray'
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'rising': return 'green'
      case 'elite': return 'blue'
      case 'legacy': return 'purple'
      default: return 'gray'
    }
  }

  if (loading) {
    return (
      <Center py={8}>
        <Spinner size="lg" />
      </Center>
    )
  }

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="space-between">
        <Text fontSize="lg" fontWeight="semibold">
          Users Management ({users.length} total)
        </Text>
      </HStack>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>User</Th>
            <Th>Role</Th>
            <Th>Profile Status</Th>
            <Th>Joined</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((userData) => (
            <Tr key={userData.id}>
              <Td>
                <HStack spacing={3}>
                  <Avatar size="sm" name={userData.email} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium">{userData.email}</Text>
                    <Text fontSize="xs" color="gray.500">
                      ID: {userData.id.slice(0, 8)}...
                    </Text>
                  </VStack>
                </HStack>
              </Td>
              <Td>
                <Badge colorScheme={getRoleColor(userData.role)}>
                  {userData.role}
                </Badge>
              </Td>
              <Td>
                {userData.profiles && userData.profiles.length > 0 ? (
                  <VStack align="start" spacing={1}>
                    {userData.profiles.map((profile: any) => (
                      <HStack key={profile.id} spacing={2}>
                        <Badge colorScheme={getTierColor(profile.tier)} size="sm">
                          {profile.tier}
                        </Badge>
                        <Badge
                          colorScheme={profile.status === 'published' ? 'green' : 'yellow'}
                          size="sm"
                        >
                          {profile.status}
                        </Badge>
                      </HStack>
                    ))}
                  </VStack>
                ) : (
                  <Text color="gray.400" fontSize="sm">No profile</Text>
                )}
              </Td>
              <Td>
                <Text fontSize="sm">
                  {new Date(userData.created_at).toLocaleDateString()}
                </Text>
              </Td>
              <Td>
                <HStack spacing={2}>
                  <Select
                    size="sm"
                    value={userData.role}
                    onChange={(e) => handleRoleUpdate(userData.id, e.target.value)}
                    isDisabled={updating === userData.id || userData.id === user?.id}
                    w="auto"
                  >
                    <option value="visitor">Visitor</option>
                    <option value="applicant">Applicant</option>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </Select>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </VStack>
  )
}
