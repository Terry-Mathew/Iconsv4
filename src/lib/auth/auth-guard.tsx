'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Spinner, Center, Text } from '@chakra-ui/react'
import { useAuth } from './auth-context'
import { Database } from '@/types/supabase'

type UserRole = 'admin' | 'super_admin' | 'member' | 'applicant' | 'visitor'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRoles?: UserRole[]
  fallbackPath?: string
  loadingComponent?: React.ReactNode
}

export function AuthGuard({
  children,
  requiredRoles = [],
  fallbackPath = '/auth/signin',
  loadingComponent,
}: AuthGuardProps) {
  const { user, loading, hasRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(fallbackPath)
        return
      }

      if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
        router.push('/unauthorized')
        return
      }
    }
  }, [user, loading, hasRole, requiredRoles, router, fallbackPath])

  if (loading) {
    return (
      loadingComponent || (
        <Center h="100vh">
          <Box textAlign="center">
            <Spinner size="xl" color="primary.500" thickness="4px" />
            <Text mt={4} color="gray.600">
              Loading...
            </Text>
          </Box>
        </Center>
      )
    )
  }

  if (!user) {
    return null
  }

  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return null
  }

  return <>{children}</>
}

// Higher-order component for page-level protection
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: UserRole[]
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <AuthGuard requiredRoles={requiredRoles}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}
