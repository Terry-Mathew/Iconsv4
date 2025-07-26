'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

type UserRole = Database['public']['Enums']['user_role']

interface AuthUser extends User {
  role?: UserRole
  profile_id?: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  hasRole: (roles: UserRole[]) => boolean
  isAdmin: boolean
  isMember: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(false)

  // Initialize Supabase client with error handling
  useEffect(() => {
    try {
      const supabase = createClient()
      console.log('✅ AuthProvider: Supabase client initialized')

      // TODO: Implement full authentication flow when ready
      // For now, running in demo mode
      setLoading(false)
    } catch (error) {
      console.warn('⚠️ AuthProvider: Running in demo mode due to Supabase config:', error)
      setLoading(false)
    }
  }, [])

  // Enhanced sign-in function (demo mode)
  const signIn = async (email: string) => {
    console.log('🔐 Demo sign-in attempt for:', email)
    return { error: null }
  }

  // Enhanced sign-out function (demo mode)
  const signOut = async () => {
    console.log('🔐 Demo sign-out')
    setUser(null)
  }

  const hasRole = (roles: UserRole[]) => {
    return user?.role ? roles.includes(user.role) : false
  }

  const isAdmin = hasRole(['admin', 'super_admin'])
  const isMember = hasRole(['member', 'admin', 'super_admin'])

  const value = {
    user,
    loading,
    signIn,
    signOut,
    hasRole,
    isAdmin,
    isMember,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
