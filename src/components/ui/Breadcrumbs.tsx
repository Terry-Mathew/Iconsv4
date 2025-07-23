'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Box,
  Text
} from '@chakra-ui/react'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbConfig {
  [key: string]: {
    label: string
    href?: string
  }
}

const breadcrumbConfig: BreadcrumbConfig = {
  '': { label: 'Home', href: '/' },
  'about': { label: 'About', href: '/about' },
  'process': { label: 'Process', href: '/process' },
  'contact': { label: 'Contact', href: '/contact' },
  'nominate': { label: 'Nominate', href: '/nominate' },
  'builder': { label: 'Profile Builder', href: '/builder' },
  'dashboard': { label: 'Dashboard', href: '/dashboard' },
  'admin': { label: 'Admin', href: '/admin' },
  'auth': { label: 'Authentication' },
  'signin': { label: 'Sign In' },
  'set-password': { label: 'Set Password' },
  'reset-password': { label: 'Reset Password' },
  'profile': { label: 'Profiles' }
}

interface BreadcrumbsProps {
  className?: string
  maxItems?: number
}

export function Breadcrumbs({ className, maxItems = 4 }: BreadcrumbsProps) {
  const pathname = usePathname()

  const breadcrumbs = useMemo(() => {
    // Don't show breadcrumbs on home page
    if (pathname === '/') return []

    const segments = pathname.split('/').filter(Boolean)
    const crumbs = []

    // Always start with Home
    crumbs.push({
      label: 'Home',
      href: '/',
      isCurrentPage: false
    })

    // Build breadcrumbs from path segments
    let currentPath = ''
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1
      
      // Get label from config or format segment
      const config = breadcrumbConfig[segment]
      const label = config?.label || formatSegment(segment)
      
      crumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        isCurrentPage: isLast
      })
    })

    // Truncate if too many items
    if (maxItems && crumbs.length > maxItems) {
      const start = crumbs.slice(0, 1) // Keep Home
      const end = crumbs.slice(-(maxItems - 2)) // Keep last items
      return [
        ...start,
        { label: '...', href: undefined, isCurrentPage: false },
        ...end
      ]
    }

    return crumbs
  }, [pathname, maxItems])

  // Don't render if no breadcrumbs or only home
  if (breadcrumbs.length <= 1) return null

  return (
    <Box className={className} py={2}>
      <Breadcrumb
        spacing={2}
        separator={<ChevronRight size={14} color="#666" />}
        fontFamily="'Lato', sans-serif"
        fontSize="sm"
      >
        {breadcrumbs.map((crumb, index) => (
          <BreadcrumbItem key={index} isCurrentPage={crumb.isCurrentPage}>
            {crumb.href ? (
              <BreadcrumbLink
                as={Link}
                href={crumb.href}
                color="#666"
                _hover={{ color: '#D4AF37' }}
                display="flex"
                alignItems="center"
                gap={1}
              >
                {index === 0 && <Home size={14} />}
                {crumb.label}
              </BreadcrumbLink>
            ) : (
              <Text
                color={crumb.isCurrentPage ? '#1A1A1A' : '#666'}
                fontWeight={crumb.isCurrentPage ? '600' : '400'}
                display="flex"
                alignItems="center"
                gap={1}
              >
                {index === 0 && <Home size={14} />}
                {crumb.label}
              </Text>
            )}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </Box>
  )
}

function formatSegment(segment: string): string {
  // Handle dynamic routes like [slug]
  if (segment.startsWith('[') && segment.endsWith(']')) {
    return 'Profile'
  }
  
  // Convert kebab-case to Title Case
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Specialized breadcrumbs for specific pages
export function ProfileBreadcrumbs({ profileName }: { profileName?: string }) {
  const pathname = usePathname()
  
  if (!pathname.startsWith('/profile/')) return <Breadcrumbs />
  
  return (
    <Box py={2}>
      <Breadcrumb
        spacing={2}
        separator={<ChevronRight size={14} color="#666" />}
        fontFamily="'Lato', sans-serif"
        fontSize="sm"
      >
        <BreadcrumbItem>
          <BreadcrumbLink
            as={Link}
            href="/"
            color="#666"
            _hover={{ color: '#D4AF37' }}
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Home size={14} />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbItem>
          <BreadcrumbLink
            as={Link}
            href="/profiles"
            color="#666"
            _hover={{ color: '#D4AF37' }}
          >
            Profiles
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbItem isCurrentPage>
          <Text color="#1A1A1A" fontWeight="600">
            {profileName || 'Profile'}
          </Text>
        </BreadcrumbItem>
      </Breadcrumb>
    </Box>
  )
}

export function AdminBreadcrumbs({ section }: { section?: string }) {
  return (
    <Box py={2}>
      <Breadcrumb
        spacing={2}
        separator={<ChevronRight size={14} color="#666" />}
        fontFamily="'Lato', sans-serif"
        fontSize="sm"
      >
        <BreadcrumbItem>
          <BreadcrumbLink
            as={Link}
            href="/"
            color="#666"
            _hover={{ color: '#D4AF37' }}
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Home size={14} />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbItem isCurrentPage={!section}>
          <BreadcrumbLink
            as={Link}
            href="/admin"
            color={section ? "#666" : "#1A1A1A"}
            _hover={{ color: '#D4AF37' }}
            fontWeight={section ? "400" : "600"}
          >
            Admin Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {section && (
          <BreadcrumbItem isCurrentPage>
            <Text color="#1A1A1A" fontWeight="600">
              {section}
            </Text>
          </BreadcrumbItem>
        )}
      </Breadcrumb>
    </Box>
  )
}
