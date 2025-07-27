'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

type UserRole = 'admin' | 'super_admin' | 'member' | 'applicant' | 'visitor'

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

  // Initialize Supabase client and auth state
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        const supabase = createClient()
        console.log('✅ AuthProvider: Supabase client initialized')

        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.error('Session error:', sessionError)
        } else if (session?.user && mounted) {
          // Fetch user profile data
          const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single()

          setUser({
            ...session.user,
            role: (profile?.role as UserRole) || 'visitor'
          })
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email)

            if (session?.user && mounted) {
              // Fetch user profile data
              const { data: profile } = await supabase
                .from('users')
                .select('role')
                .eq('id', session.user.id)
                .single()

              setUser({
                ...session.user,
                role: (profile?.role as UserRole) || 'visitor'
              })
            } else if (mounted) {
              setUser(null)
            }
          }
        )

        if (mounted) {
          setLoading(false)
        }

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    return () => {
      mounted = false
    }
  }, [])

  // Enhanced sign-in function
  const signIn = async (email: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('Sign-in error:', error)
        return { error }
      }

      console.log('✅ Sign-in OTP sent to:', email)
      return { error: null }
    } catch (error) {
      console.error('Sign-in error:', error)
      return { error }
    }
  }

  // Enhanced sign-out function
  const signOut = async () => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Sign-out error:', error)
      } else {
        setUser(null)
        console.log('✅ User signed out successfully')
      }
    } catch (error) {
      console.error('Sign-out error:', error)
    }
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
