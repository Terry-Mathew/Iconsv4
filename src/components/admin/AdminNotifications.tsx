'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Card,
  CardBody,
  Button,
  useToast,
  Spinner,
  Icon,
  Divider,
  Heading,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { Bell, User, FileText, Clock, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth/AuthProvider'

interface AdminNotification {
  id: string
  event_type: string
  metadata: any
  created_at: string
  notification_message: string
  notification_type: 'nomination' | 'profile' | 'system'
}

export function AdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useAuth()
  const toast = useToast()
  const supabase = createClient()

  useEffect(() => {
    if (!user) return

    // Load initial notifications
    loadNotifications()

    // Set up real-time subscription
    const channel = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'analytics_events',
          filter: 'event_type=like.admin_notification_%'
        },
        (payload) => {
          const newNotification = transformNotification(payload.new)
          setNotifications(prev => [newNotification, ...prev])
          setUnreadCount(prev => prev + 1)
          
          // Show toast notification
          toast({
            title: 'New Admin Notification',
            description: newNotification.notification_message,
            status: 'info',
            duration: 5000,
            isClosable: true,
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_notifications')
        .select('*')
        .limit(50)

      if (error) throw error

      setNotifications(data || [])
      setUnreadCount(data?.length || 0)
    } catch (error) {
      console.error('Error loading notifications:', error)
      toast({
        title: 'Error loading notifications',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const transformNotification = (rawNotification: any): AdminNotification => {
    const message = rawNotification.event_type === 'admin_notification_new_nomination'
      ? `New nomination: ${rawNotification.metadata?.nominee_name}`
      : rawNotification.event_type === 'admin_notification_profile_status_change'
      ? `Profile status changed: ${rawNotification.metadata?.slug}`
      : rawNotification.event_type

    const type = rawNotification.event_type.includes('nomination') ? 'nomination' 
      : rawNotification.event_type.includes('profile') ? 'profile' 
      : 'system'

    return {
      id: rawNotification.id,
      event_type: rawNotification.event_type,
      metadata: rawNotification.metadata,
      created_at: rawNotification.created_at,
      notification_message: message,
      notification_type: type
    }
  }

  const markAllAsRead = () => {
    setUnreadCount(0)
    toast({
      title: 'All notifications marked as read',
      status: 'success',
      duration: 2000,
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'nomination':
        return User
      case 'profile':
        return FileText
      default:
        return Bell
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'nomination':
        return 'blue'
      case 'profile':
        return 'green'
      default:
        return 'gray'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <Spinner size="lg" color="primary.500" />
        <Text mt={2}>Loading notifications...</Text>
      </Box>
    )
  }

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <HStack>
          <Icon as={Bell} boxSize={5} />
          <Heading size="md">Admin Notifications</Heading>
          {unreadCount > 0 && (
            <Badge colorScheme="red" borderRadius="full">
              {unreadCount}
            </Badge>
          )}
        </HStack>
        {unreadCount > 0 && (
          <Button size="sm" variant="ghost" onClick={markAllAsRead}>
            <Icon as={CheckCircle} mr={2} />
            Mark all read
          </Button>
        )}
      </HStack>

      {notifications.length === 0 ? (
        <Alert status="info">
          <AlertIcon />
          No notifications yet. You'll see real-time updates here.
        </Alert>
      ) : (
        <VStack spacing={3} align="stretch">
          {notifications.map((notification, index) => (
            <Card key={notification.id} size="sm">
              <CardBody>
                <HStack justify="space-between" align="start">
                  <HStack spacing={3} flex={1}>
                    <Icon 
                      as={getNotificationIcon(notification.notification_type)} 
                      color={`${getNotificationColor(notification.notification_type)}.500`}
                      boxSize={5}
                    />
                    <VStack align="start" spacing={1} flex={1}>
                      <Text fontSize="sm" fontWeight="medium">
                        {notification.notification_message}
                      </Text>
                      <HStack spacing={2}>
                        <Badge 
                          size="sm" 
                          colorScheme={getNotificationColor(notification.notification_type)}
                        >
                          {notification.notification_type}
                        </Badge>
                        <HStack spacing={1}>
                          <Icon as={Clock} boxSize={3} color="gray.500" />
                          <Text fontSize="xs" color="gray.500">
                            {formatTimeAgo(notification.created_at)}
                          </Text>
                        </HStack>
                      </HStack>
                    </VStack>
                  </HStack>
                </HStack>
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}
    </Box>
  )
}
