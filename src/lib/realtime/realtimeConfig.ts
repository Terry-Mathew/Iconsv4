/**
 * ICONS HERALD Real-time Configuration
 * Complete setup for real-time subscriptions and notifications
 */

import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface RealtimeConfig {
  channel: string
  table: string
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  filter?: string
  schema?: string
}

export interface NotificationPayload {
  id: string
  event_type: string
  metadata: any
  created_at: string
  old_record?: any
  new_record?: any
}

export class RealtimeManager {
  private supabase = createClient()
  private channels: Map<string, RealtimeChannel> = new Map()
  private callbacks: Map<string, Function[]> = new Map()

  /**
   * Subscribe to admin notifications
   */
  subscribeToAdminNotifications(callback: (payload: NotificationPayload) => void): () => void {
    const channelName = 'admin-notifications'
    
    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'analytics_events',
          filter: 'event_type=like.admin_notification_%'
        },
        (payload) => {
          callback({
            id: payload.new.id,
            event_type: payload.new.event_type,
            metadata: payload.new.metadata,
            created_at: payload.new.created_at,
            new_record: payload.new
          })
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)

    // Return unsubscribe function
    return () => {
      this.unsubscribe(channelName)
    }
  }

  /**
   * Subscribe to nomination changes
   */
  subscribeToNominations(callback: (payload: NotificationPayload) => void): () => void {
    const channelName = 'nominations-changes'
    
    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nominations'
        },
        (payload) => {
          callback({
            id: (payload.new as any)?.id || (payload.old as any)?.id,
            event_type: `nomination_${payload.eventType.toLowerCase()}`,
            metadata: payload.new || payload.old,
            created_at: new Date().toISOString(),
            old_record: payload.old,
            new_record: payload.new
          })
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)

    return () => {
      this.unsubscribe(channelName)
    }
  }

  /**
   * Subscribe to profile changes
   */
  subscribeToProfiles(callback: (payload: NotificationPayload) => void): () => void {
    const channelName = 'profiles-changes'
    
    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          // Only notify on status changes
          if (payload.old?.status !== payload.new?.status) {
            callback({
              id: payload.new.id,
              event_type: 'profile_status_changed',
              metadata: {
                slug: payload.new.slug,
                old_status: payload.old.status,
                new_status: payload.new.status,
                tier: payload.new.tier
              },
              created_at: new Date().toISOString(),
              old_record: payload.old,
              new_record: payload.new
            })
          }
        }
      )
      .subscribe()

    this.channels.set(channelName, channel)

    return () => {
      this.unsubscribe(channelName)
    }
  }

  /**
   * Subscribe to custom events
   */
  subscribe(config: RealtimeConfig, callback: (payload: any) => void): () => void {
    const channel = this.supabase
      .channel(config.channel)
      .on(
        'postgres_changes' as any,
        {
          event: config.event,
          schema: config.schema || 'public',
          table: config.table,
          filter: config.filter
        },
        callback
      )
      .subscribe()

    this.channels.set(config.channel, channel)

    return () => {
      this.unsubscribe(config.channel)
    }
  }

  /**
   * Unsubscribe from a channel
   */
  unsubscribe(channelName: string): void {
    const channel = this.channels.get(channelName)
    if (channel) {
      this.supabase.removeChannel(channel)
      this.channels.delete(channelName)
    }
  }

  /**
   * Unsubscribe from all channels
   */
  unsubscribeAll(): void {
    this.channels.forEach((channel, name) => {
      this.supabase.removeChannel(channel)
    })
    this.channels.clear()
  }

  /**
   * Get channel status
   */
  getChannelStatus(channelName: string): string | null {
    const channel = this.channels.get(channelName)
    return channel?.state || null
  }

  /**
   * Get all active channels
   */
  getActiveChannels(): string[] {
    return Array.from(this.channels.keys())
  }
}

// Singleton instance
export const realtimeManager = new RealtimeManager()

// Utility functions for common use cases
export const subscribeToAdminNotifications = (callback: (payload: NotificationPayload) => void) => {
  return realtimeManager.subscribeToAdminNotifications(callback)
}

export const subscribeToNominations = (callback: (payload: NotificationPayload) => void) => {
  return realtimeManager.subscribeToNominations(callback)
}

export const subscribeToProfiles = (callback: (payload: NotificationPayload) => void) => {
  return realtimeManager.subscribeToProfiles(callback)
}

// Cleanup function for app shutdown
export const cleanupRealtime = () => {
  realtimeManager.unsubscribeAll()
}

// Types for external use
export type { RealtimeChannel } from '@supabase/supabase-js'
