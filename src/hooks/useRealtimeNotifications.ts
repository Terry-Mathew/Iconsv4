'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth/AuthProvider'

export interface RealtimeNotification {
  id: string
  event_type: string
  metadata: any
  created_at: string
  notification_message: string
  notification_type: 'nomination' | 'profile' | 'system'
}

export interface UseRealtimeNotificationsReturn {
  notifications: RealtimeNotification[]
  unreadCount: number
  loading: boolean
  error: string | null
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  refresh: () => Promise<void>
}

export function useRealtimeNotifications(): UseRealtimeNotificationsReturn {
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  const transformNotification = useCallback((rawNotification: any): RealtimeNotification => {
    const message = rawNotification.event_type === 'admin_notification_new_nomination'
      ? `New nomination: ${rawNotification.metadata?.nominee_name}`
      : rawNotification.event_type === 'admin_notification_profile_status_change'
      ? `Profile status changed: ${rawNotification.metadata?.slug} (${rawNotification.metadata?.old_status} → ${rawNotification.metadata?.new_status})`
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
  }, [])

  const loadNotifications = useCallback(async () => {
    if (!user) return

    try {
      setError(null)
      const { data, error: queryError } = await supabase
        .from('admin_notifications')
        .select('*')
        .limit(50)

      if (queryError) throw queryError

      const transformedNotifications = (data || []).map(transformNotification)
      setNotifications(transformedNotifications)
      setUnreadCount(transformedNotifications.length)
    } catch (err) {
      console.error('Error loading notifications:', err)
      setError(err instanceof Error ? err.message : 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }, [user, supabase, transformNotification])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  const markAllAsRead = useCallback(() => {
    setUnreadCount(0)
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    await loadNotifications()
  }, [loadNotifications])

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    // Load initial notifications
    loadNotifications()

    // Set up real-time subscription
    const channel = supabase
      .channel('admin-notifications-hook')
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
          setNotifications(prev => [newNotification, ...prev.slice(0, 49)]) // Keep only 50 most recent
          setUnreadCount(prev => prev + 1)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'nominations'
        },
        () => {
          // Refresh notifications when new nominations are added
          // The trigger will create the notification, this ensures we catch it
          setTimeout(loadNotifications, 100)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: 'status=neq.null'
        },
        () => {
          // Refresh notifications when profile status changes
          setTimeout(loadNotifications, 100)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, loadNotifications, transformNotification])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh
  }
}

// Utility hook for simple notification count
export function useNotificationCount() {
  const { unreadCount, loading } = useRealtimeNotifications()
  return { count: unreadCount, loading }
}

// Utility hook for latest notification
export function useLatestNotification() {
  const { notifications, loading } = useRealtimeNotifications()
  return { 
    latest: notifications[0] || null, 
    loading 
  }
}
