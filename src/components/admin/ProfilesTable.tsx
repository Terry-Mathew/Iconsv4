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
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { Eye, Edit, ExternalLink, CheckCircle, XCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth/auth-context'

interface ProfilesTableProps {
  onUpdate?: () => void
}

export function ProfilesTable({ onUpdate }: ProfilesTableProps) {
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<any>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { user } = useAuth()
  const toast = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadProfiles()
  }, [])

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          users (
            email,
            role
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProfiles(data || [])
    } catch (err: any) {
      toast({
        title: 'Error loading profiles',
        description: err.message,
        status: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (profileId: string, newStatus: string) => {
    setUpdating(profileId)
    try {
      const updateData: any = { status: newStatus }

      if (newStatus === 'published' && !profiles.find(p => p.id === profileId)?.published_at) {
        updateData.published_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profileId)

      if (error) throw error

      toast({
        title: 'Profile status updated successfully',
        status: 'success',
        duration: 3000,
      })

      await loadProfiles()
      onUpdate?.()
    } catch (err: any) {
      toast({
        title: 'Error updating profile status',
        description: err.message,
        status: 'error',
        duration: 5000,
      })
    } finally {
      setUpdating(null)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'green'
      case 'draft': return 'yellow'
      case 'under_review': return 'blue'
      case 'rejected': return 'red'
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
    <>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="semibold">
            Profiles Management ({profiles.length} total)
          </Text>
        </HStack>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Profile</Th>
              <Th>Tier</Th>
              <Th>Status</Th>
              <Th>Owner</Th>
              <Th>Created</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {profiles.map((profile) => {
              const profileData = profile.data as any
              return (
                <Tr key={profile.id}>
                  <Td>
                    <HStack spacing={3}>
                      <Avatar
                        size="sm"
                        src={profileData?.profileImage}
                        name={profileData?.name}
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium" noOfLines={1}>
                          {profileData?.name || 'Unnamed Profile'}
                        </Text>
                        <Text fontSize="xs" color="gray.500" noOfLines={1}>
                          {profileData?.tagline || 'No tagline'}
                        </Text>
                      </VStack>
                    </HStack>
                  </Td>
                  <Td>
                    <Badge colorScheme={getTierColor(profile.tier)}>
                      {profile.tier}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(profile.status)}>
                      {profile.status}
                    </Badge>
                  </Td>
                  <Td>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm">{profile.users?.email}</Text>
                      <Badge size="xs" colorScheme="gray">
                        {profile.users?.role}
                      </Badge>
                    </VStack>
                  </Td>
                  <Td>
                    <Text fontSize="sm">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </Text>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        leftIcon={<Eye size={14} />}
                        onClick={() => {
                          setSelectedProfile(profile)
                          onOpen()
                        }}
                        variant="outline"
                      >
                        View
                      </Button>
                      {profile.status === 'published' && (
                        <Link href={`/profile/${profile.slug}`} isExternal>
                          <Button
                            size="sm"
                            leftIcon={<ExternalLink size={14} />}
                            variant="outline"
                            colorScheme="blue"
                          >
                            Live
                          </Button>
                        </Link>
                      )}
                      <Select
                        size="sm"
                        value={profile.status}
                        onChange={(e) => handleStatusUpdate(profile.id, e.target.value)}
                        isDisabled={updating === profile.id}
                        w="auto"
                      >
                        <option value="draft">Draft</option>
                        <option value="under_review">Under Review</option>
                        <option value="published">Published</option>
                        <option value="rejected">Rejected</option>
                      </Select>
                    </HStack>
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </VStack>

      {/* Profile Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Profile Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedProfile && (
              <VStack spacing={4} align="stretch">
                <HStack spacing={4}>
                  <Avatar
                    size="lg"
                    src={selectedProfile.data?.profileImage}
                    name={selectedProfile.data?.name}
                  />
                  <VStack align="start" spacing={1}>
                    <Text fontSize="xl" fontWeight="bold">
                      {selectedProfile.data?.name}
                    </Text>
                    <Text color="gray.600">
                      {selectedProfile.data?.tagline}
                    </Text>
                    <HStack>
                      <Badge colorScheme={getTierColor(selectedProfile.tier)}>
                        {selectedProfile.tier}
                      </Badge>
                      <Badge colorScheme={getStatusColor(selectedProfile.status)}>
                        {selectedProfile.status}
                      </Badge>
                    </HStack>
                  </VStack>
                </HStack>

                <Text>
                  <strong>Bio:</strong> {selectedProfile.data?.bio || 'No bio provided'}
                </Text>

                <Text fontSize="sm" color="gray.500">
                  <strong>Created:</strong> {new Date(selectedProfile.created_at).toLocaleString()}
                </Text>

                {selectedProfile.published_at && (
                  <Text fontSize="sm" color="gray.500">
                    <strong>Published:</strong> {new Date(selectedProfile.published_at).toLocaleString()}
                  </Text>
                )}
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
