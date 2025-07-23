'use client'

import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export interface ImpersonationSession {
  originalUserId: string
  targetUserId: string
  expiresAt: Date
  sessionToken: string
}

export interface ImpersonationContext {
  isImpersonating: boolean
  originalUser: User | null
  targetUser: User | null
  session: ImpersonationSession | null
}

class ImpersonationManager {
  private static instance: ImpersonationManager
  private context: ImpersonationContext = {
    isImpersonating: false,
    originalUser: null,
    targetUser: null,
    session: null
  }

  static getInstance(): ImpersonationManager {
    if (!ImpersonationManager.instance) {
      ImpersonationManager.instance = new ImpersonationManager()
    }
    return ImpersonationManager.instance
  }

  async startImpersonation(targetUserId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient()
      const { data: { user: currentUser } } = await supabase.auth.getUser()

      if (!currentUser) {
        return { success: false, error: 'Not authenticated' }
      }

      // Verify super-admin role
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', currentUser.id)
        .single()

      if (userData?.role !== 'super_admin') {
        return { success: false, error: 'Insufficient permissions' }
      }

      // Get target user
      const { data: targetUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', targetUserId)
        .single()

      if (!targetUser) {
        return { success: false, error: 'Target user not found' }
      }

      // Create impersonation session
      const response = await fetch('/api/admin/impersonate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId })
      })

      if (!response.ok) {
        const error = await response.text()
        return { success: false, error }
      }

      const { sessionToken, expiresAt } = await response.json()

      // Update context
      this.context = {
        isImpersonating: true,
        originalUser: currentUser,
        targetUser: targetUser as any,
        session: {
          originalUserId: currentUser.id,
          targetUserId,
          expiresAt: new Date(expiresAt),
          sessionToken
        }
      }

      // Store in sessionStorage for persistence
      sessionStorage.setItem('impersonation_context', JSON.stringify(this.context))

      return { success: true }
    } catch (error) {
      console.error('Impersonation start error:', error)
      return { success: false, error: 'Failed to start impersonation' }
    }
  }

  async endImpersonation(): Promise<void> {
    try {
      if (this.context.session) {
        // Notify server to invalidate session
        await fetch('/api/admin/impersonate', {
          method: 'DELETE',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.context.session.sessionToken}`
          }
        })
      }

      // Clear context
      this.context = {
        isImpersonating: false,
        originalUser: null,
        targetUser: null,
        session: null
      }

      // Clear storage
      sessionStorage.removeItem('impersonation_context')

      // Reload to reset auth state
      window.location.reload()
    } catch (error) {
      console.error('Impersonation end error:', error)
    }
  }

  getContext(): ImpersonationContext {
    return this.context
  }

  restoreFromStorage(): void {
    try {
      const stored = sessionStorage.getItem('impersonation_context')
      if (stored) {
        const context = JSON.parse(stored)
        
        // Check if session is still valid
        if (context.session && new Date(context.session.expiresAt) > new Date()) {
          this.context = context
        } else {
          // Session expired, clear it
          sessionStorage.removeItem('impersonation_context')
        }
      }
    } catch (error) {
      console.error('Failed to restore impersonation context:', error)
      sessionStorage.removeItem('impersonation_context')
    }
  }

  isSessionValid(): boolean {
    if (!this.context.session) return false
    return new Date(this.context.session.expiresAt) > new Date()
  }
}

export const impersonationManager = ImpersonationManager.getInstance()

// React hook for impersonation
export function useImpersonation() {
  const context = impersonationManager.getContext()
  
  return {
    ...context,
    startImpersonation: impersonationManager.startImpersonation.bind(impersonationManager),
    endImpersonation: impersonationManager.endImpersonation.bind(impersonationManager),
    isSessionValid: impersonationManager.isSessionValid.bind(impersonationManager)
  }
}
