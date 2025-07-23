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
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        // Fetch user role and profile info
        const { data: userData } = await supabase
          .from('users')
          .select('role, profile_id')
          .eq('id', authUser.id)
          .single()

        setUser({
          ...authUser,
          role: userData?.role,
          profile_id: userData?.profile_id,
        })
      } else {
        setUser(null)
      }
      
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('role, profile_id')
            .eq('id', session.user.id)
            .single()

          setUser({
            ...session.user,
            role: userData?.role,
            profile_id: userData?.profile_id,
          })
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const signIn = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
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
