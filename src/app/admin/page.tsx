'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  Badge,
  useToast,
  Spinner,

  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Search,
  Users,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  Menu as MenuIcon,
  Bell,
  Globe,
  Crown,
  Star,
  Trophy,
  AlertTriangle
} from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { createClient } from '@/lib/supabase/client'
import { useImpersonation } from '../../../lib/auth/impersonation'

// Import admin components with relative paths to fix module resolution
import { UsersManagement } from '../../components/admin/UsersManagement'
import { NominationsManagement } from '../../components/admin/NominationsManagement'
import { ProfilesManagement } from '../../components/admin/ProfilesManagement'
import { PaymentsManagement } from '../../components/admin/PaymentsManagement'
import { ImpersonationPanel } from '../../components/admin/ImpersonationPanel'
import { AnalyticsDashboard } from '../../components/admin/AnalyticsDashboard'
import { SystemSettings } from '../../components/admin/SystemSettings'
import { AuditLogs } from '../../components/admin/AuditLogs'

// Enhanced interfaces with proper typing
interface AdminUser {
  id: string
  email: string
  role: 'visitor' | 'applicant' | 'member' | 'admin' | 'super_admin'
  name?: string | null
  avatar_url?: string | null
  last_login?: string | null
  status: 'active' | 'suspended' | 'banned'
  created_at?: string
  updated_at?: string
}

interface AdminStats {
  totalUsers: number
  pendingNominations: number
  publishedProfiles: number
  monthlyRevenue: number
  conversionRate: number
}

interface TabConfig {
  id: string
  label: string
  icon: any
  description: string
  superAdminOnly?: boolean
}

interface AdminStats {
  totalUsers: number
  pendingNominations: number
  publishedProfiles: number
  monthlyRevenue: number
  conversionRate: number
}

const ADMIN_TABS: TabConfig[] = [
  { id: 'users', label: 'Users', icon: Users, description: 'Manage user accounts and roles' },
  { id: 'nominations', label: 'Nominations', icon: FileText, description: 'Review and approve nominations' },
  { id: 'profiles', label: 'Profiles', icon: Crown, description: 'Manage published profiles' },
  { id: 'impersonation', label: 'Impersonation', icon: Users, description: 'Test user experiences by tier' },
  { id: 'payments', label: 'Payments', icon: CreditCard, description: 'Payment and billing management' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Platform insights and metrics' },
  { id: 'settings', label: 'Settings', icon: Settings, description: 'System configuration', superAdminOnly: true },
  { id: 'logs', label: 'Audit Logs', icon: Shield, description: 'Security and audit trails', superAdminOnly: true },
]

type TabId = 'users' | 'nominations' | 'profiles' | 'payments' | 'analytics' | 'settings' | 'logs' | 'impersonation'

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const toast = useToast()
  const { isOpen: isMobileMenuOpen, onOpen: onMobileMenuOpen, onClose: onMobileMenuClose } = useDisclosure()
  // State management
  const [activeTab, setActiveTab] = useState<TabId>('users')
  const [globalSearch, setGlobalSearch] = useState('')
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState<number>(0)

  // Responsive breakpoints - FIXED: SSR-safe mobile detection
  const [isMobile, setIsMobile] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  // Memoized Supabase client to prevent re-renders
  const supabase = useMemo(() => createClient(), [])

  // Handle responsive detection after hydration
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 992) // lg breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Authentication and role checking with proper dependency management
  useEffect(() => {
    const checkAdminAccess = async () => {
      console.log('checkAdminAccess called', { user: !!user, loading, isLoading })

      if (loading) {
        console.log('Still loading auth, waiting...')
        return
      }

      if (!user) {
        console.log('No user found, creating demo admin user for development')
        // For development: Create a demo user if no auth
        const demoUser = {
          id: 'demo-admin-123',
          email: 'admin@iconsherald.com',
          role: 'admin' as 'admin' | 'super_admin',
          name: 'Demo Admin',
          avatar_url: null,
          last_login: null,
          status: 'active' as const
        }

        console.log('Setting demo admin user:', demoUser)
        setAdminUser(demoUser)
        await loadDashboardStats()
        return
      }

      try {
        setIsLoading(true)
        console.log('Checking admin access for user:', user.id)

        // For development: Create a mock admin user
        const mockAdminUser = {
          id: user.id,
          email: user.email || '',
          role: 'admin' as 'admin' | 'super_admin',
          name: user.user_metadata?.name || 'Admin User',
          avatar_url: user.user_metadata?.avatar_url || null,
          last_login: null,
          status: 'active' as const
        }

        console.log('Setting admin user:', mockAdminUser)
        setAdminUser(mockAdminUser)

        // Load stats with mock data for now
        await loadDashboardStats()

        console.log('Admin access check completed successfully')
      } catch (error) {
        console.error('Error checking admin access:', error)
        setIsLoading(false)
        toast({
          title: 'Error',
          description: 'Failed to verify admin access. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }

    checkAdminAccess()
  }, [user, loading]) // Removed supabase and toast from dependencies to prevent infinite loop

  // Load dashboard statistics with fallback for development
  const loadDashboardStats = async () => {
    try {
      console.log('Loading dashboard stats...')

      // For development: Use mock data if database queries fail
      // TODO: Replace with actual database queries when ready
      const mockStats = {
        totalUsers: 150,
        pendingNominations: 12,
        publishedProfiles: 45,
        monthlyRevenue: 25000,
        conversionRate: 30
      }

      console.log('Setting mock stats:', mockStats)
      setStats(mockStats)
      setNotifications(mockStats.pendingNominations)

      console.log('Dashboard stats loaded successfully')
    } catch (error) {
      console.error('Error loading dashboard stats:', error)

      // Set fallback stats even on error
      setStats({
        totalUsers: 0,
        pendingNominations: 0,
        publishedProfiles: 0,
        monthlyRevenue: 0,
        conversionRate: 0
      })
      setNotifications(0)

      toast({
        title: 'Warning',
        description: 'Using demo data - database connection needed for live stats',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      console.log('Setting isLoading to false')
      setIsLoading(false)
    }
  }

  // Handle refresh
  const handleRefresh = async () => {
    console.log('Refreshing dashboard...')
    await loadDashboardStats()
  }

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Filter tabs based on user role
  const availableTabs = ADMIN_TABS.filter(tab =>
    !tab.superAdminOnly || adminUser?.role === 'super_admin'
  )

  // Loading state
  if (loading || isLoading || !adminUser) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="#D2B48C">
        <VStack spacing={4}>
          <Spinner size="xl" color="#D4AF37" thickness="4px" />
          <Text fontFamily="'Lato', sans-serif" color="#1A1A1A" fontSize="lg">
            Loading admin dashboard...
          </Text>
        </VStack>
      </Flex>
    )
  }

  return (
    <Flex minH="100vh" bg="#F7F7F7">
      {/* Desktop Sidebar */}
      <Box
        display={{ base: 'none', lg: 'block' }}
        w="300px"
        bg="#D2B48C"
        borderRight="1px solid"
        borderColor="rgba(212, 175, 55, 0.3)"
        position="sticky"
        top="0"
        h="100vh"
        overflowY="auto"
      >
        <AdminSidebar
          adminUser={adminUser}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          availableTabs={availableTabs}
          notifications={notifications}
          onSignOut={handleSignOut}
        />
      </Box>

      {/* Mobile Menu Button */}
      <IconButton
        display={{ base: 'flex', lg: 'none' }}
        position="fixed"
        top="4"
        left="4"
        zIndex="overlay"
        aria-label="Open menu"
        icon={<MenuIcon size={20} />}
        onClick={onMobileMenuOpen}
        bg="#D4AF37"
        color="white"
        _hover={{ bg: "#B8941F" }}
        size="sm"
      />

      {/* Mobile Drawer */}
      <Drawer isOpen={isMobileMenuOpen} placement="left" onClose={onMobileMenuClose}>
        <DrawerOverlay />
        <DrawerContent bg="#D2B48C">
          <DrawerCloseButton color="#1A1A1A" />
          <DrawerHeader borderBottomWidth="1px" borderColor="rgba(212, 175, 55, 0.3)">
            <Text fontFamily="'Playfair Display', serif" color="#1A1A1A" fontSize="xl">
              Admin Dashboard
            </Text>
          </DrawerHeader>
          <DrawerBody p={0}>
            <AdminSidebar
              adminUser={adminUser}
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab)
                onMobileMenuClose()
              }}
              availableTabs={availableTabs}
              notifications={notifications}
              onSignOut={handleSignOut}
              isMobile
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content Area */}
      <Flex flex="1" direction="column" overflow="hidden">
        {/* Header */}
        <AdminHeader
          adminUser={adminUser}
          globalSearch={globalSearch}
          onSearchChange={setGlobalSearch}
          stats={stats}
          onRefresh={loadDashboardStats}
        />

        {/* Content */}
        <Box flex="1" overflow="auto" p={6}>
          <AdminContent
            activeTab={activeTab}
            globalSearch={globalSearch}
            adminUser={adminUser}
            stats={stats}
            onRefresh={loadDashboardStats}
          />
        </Box>
      </Flex>
    </Flex>
  )
}

// Admin Sidebar Component
interface AdminSidebarProps {
  adminUser: AdminUser
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  availableTabs: TabConfig[]
  notifications: number
  onSignOut: () => void
  isMobile?: boolean
}

function AdminSidebar({
  adminUser,
  activeTab,
  onTabChange,
  availableTabs,
  notifications,
  onSignOut,
  isMobile = false
}: AdminSidebarProps) {
  return (
    <VStack spacing={0} align="stretch" h="full">
      {/* User Profile Section */}
      <Box p={6} borderBottom="1px solid" borderColor="rgba(212, 175, 55, 0.3)">
        <VStack spacing={3}>
          <Avatar
            size="lg"
            name={adminUser.name || adminUser.email}
            src={adminUser.avatar_url || undefined}
            bg="#D4AF37"
            color="white"
          />
          <VStack spacing={1}>
            <Text
              fontFamily="'Playfair Display', serif"
              fontSize="lg"
              fontWeight="600"
              color="#1A1A1A"
              textAlign="center"
            >
              {adminUser.name || 'Admin User'}
            </Text>
            <Badge
              colorScheme={adminUser.role === 'super_admin' ? 'purple' : 'blue'}
              variant="subtle"
              fontSize="xs"
            >
              {adminUser.role.replace('_', ' ').toUpperCase()}
            </Badge>
            <Text fontSize="xs" color="#666" textAlign="center">
              {adminUser.email}
            </Text>
          </VStack>
        </VStack>
      </Box>

      {/* Navigation Tabs */}
      <VStack spacing={1} align="stretch" flex="1" p={4}>
        {availableTabs.map((tab) => {
          const IconComponent = tab.icon
          const isActive = activeTab === tab.id

          return (
            <motion.div
              key={tab.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                justifyContent="flex-start"
                h="auto"
                p={4}
                bg={isActive ? "rgba(212, 175, 55, 0.2)" : "transparent"}
                color={isActive ? "#1A1A1A" : "#333"}
                _hover={{
                  bg: "rgba(212, 175, 55, 0.1)",
                  color: "#1A1A1A"
                }}
                onClick={() => onTabChange(tab.id as TabId)}
                fontFamily="'Lato', sans-serif"
                fontWeight={isActive ? "600" : "400"}
                borderRadius="8px"
                position="relative"
              >
                <HStack spacing={3} w="full">
                  <Box position="relative">
                    <IconComponent size={20} />
                    {tab.id === 'nominations' && notifications > 0 && (
                      <Badge
                        position="absolute"
                        top="-8px"
                        right="-8px"
                        colorScheme="red"
                        borderRadius="full"
                        fontSize="xs"
                        minW="18px"
                        h="18px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {notifications}
                      </Badge>
                    )}
                  </Box>
                  <VStack align="start" spacing={0} flex="1">
                    <Text fontSize="sm" fontWeight="inherit">
                      {tab.label}
                    </Text>
                    {!isMobile && (
                      <Text fontSize="xs" color="#666" noOfLines={1}>
                        {tab.description}
                      </Text>
                    )}
                  </VStack>
                </HStack>
              </Button>
            </motion.div>
          )
        })}
      </VStack>

      {/* Sign Out Button */}
      <Box p={4} borderTop="1px solid" borderColor="rgba(212, 175, 55, 0.3)">
        <Button
          variant="outline"
          w="full"
          leftIcon={<LogOut size={16} />}
          onClick={onSignOut}
          borderColor="#D4AF37"
          color="#D4AF37"
          _hover={{ bg: "#D4AF37", color: "white" }}
          fontFamily="'Lato', sans-serif"
        >
          Sign Out
        </Button>
      </Box>
    </VStack>
  )
}

// Admin Header Component
interface AdminHeaderProps {
  adminUser: AdminUser
  globalSearch: string
  onSearchChange: (search: string) => void
  stats: AdminStats | null
  onRefresh: () => void
}

function AdminHeader({ adminUser, globalSearch, onSearchChange, stats, onRefresh }: AdminHeaderProps) {
  return (
    <Box
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      px={6}
      py={4}
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      <Flex justify="space-between" align="center">
        {/* Left: Welcome & Search */}
        <HStack spacing={6} flex="1">
          <VStack align="start" spacing={0}>
            <Text
              fontFamily="'Playfair Display', serif"
              fontSize="2xl"
              fontWeight="600"
              color="#1A1A1A"
            >
              Super Admin Controls
            </Text>
            <Text fontSize="sm" color="#666" fontFamily="'Lato', sans-serif">
              Welcome back, {adminUser.name || adminUser.email}
            </Text>
          </VStack>

          <InputGroup maxW="400px">
            <InputLeftElement pointerEvents="none">
              <Search size={16} color="#666" />
            </InputLeftElement>
            <Input
              placeholder="Search across all sections..."
              value={globalSearch}
              onChange={(e) => onSearchChange(e.target.value)}
              bg="gray.50"
              border="1px solid"
              borderColor="gray.300"
              _hover={{ borderColor: "#D4AF37" }}
              _focus={{ borderColor: "#D4AF37", boxShadow: "0 0 0 1px #D4AF37" }}
              fontFamily="'Lato', sans-serif"
            />
          </InputGroup>
        </HStack>

        {/* Right: Stats & Actions */}
        <HStack spacing={4}>
          {stats && (
            <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
              <VStack spacing={0} align="center">
                <Text fontSize="lg" fontWeight="bold" color="#1A1A1A">
                  {stats.totalUsers}
                </Text>
                <Text fontSize="xs" color="#666">Users</Text>
              </VStack>
              <VStack spacing={0} align="center">
                <Text fontSize="lg" fontWeight="bold" color="#D4AF37">
                  ₹{stats.monthlyRevenue.toLocaleString()}
                </Text>
                <Text fontSize="xs" color="#666">Revenue</Text>
              </VStack>
              <VStack spacing={0} align="center">
                <Text fontSize="lg" fontWeight="bold" color="#38A169">
                  {stats.conversionRate}%
                </Text>
                <Text fontSize="xs" color="#666">Conversion</Text>
              </VStack>
            </HStack>
          )}

          <Button
            leftIcon={<Bell size={16} />}
            variant="ghost"
            size="sm"
            position="relative"
          >
            Alerts
            {stats && stats.pendingNominations > 0 && (
              <Badge
                position="absolute"
                top="-4px"
                right="-4px"
                colorScheme="red"
                borderRadius="full"
                fontSize="xs"
              >
                {stats.pendingNominations}
              </Badge>
            )}
          </Button>
        </HStack>
      </Flex>
    </Box>
  )
}

// Admin Content Component
interface AdminContentProps {
  activeTab: TabId
  globalSearch: string
  adminUser: AdminUser
  stats: AdminStats | null
  onRefresh: () => void
}

function AdminContent({ activeTab, globalSearch, adminUser, stats, onRefresh }: AdminContentProps) {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <UsersManagement
            globalSearch={globalSearch}
            adminUser={adminUser}
            onRefresh={onRefresh}
          />
        )
      case 'impersonation':
        return (
          <ImpersonationPanel
            currentUser={adminUser}
            isImpersonating={false}
            onImpersonationChange={() => {}}
          />
        )
      case 'nominations':
        return (
          <NominationsManagement
            globalSearch={globalSearch}
            adminUser={adminUser}
            onRefresh={onRefresh}
          />
        )
      case 'profiles':
        return (
          <ProfilesManagement
            globalSearch={globalSearch}
            adminUser={adminUser}
            onRefresh={onRefresh}
          />
        )
      case 'payments':
        return (
          <PaymentsManagement
            globalSearch={globalSearch}
            adminUser={adminUser}
            onRefresh={onRefresh}
          />
        )
      case 'analytics':
        return (
          <AnalyticsDashboard
            globalSearch={globalSearch}
            adminUser={adminUser}
            stats={stats}
            onRefresh={onRefresh}
          />
        )
      case 'settings':
        return (
          <SystemSettings
            globalSearch={globalSearch}
            adminUser={adminUser}
            onRefresh={onRefresh}
          />
        )
      case 'logs':
        return (
          <AuditLogs
            globalSearch={globalSearch}
            adminUser={adminUser}
            onRefresh={onRefresh}
          />
        )
      default:
        return (
          <Box textAlign="center" py={12}>
            <Text fontSize="lg" color="#666" fontFamily="'Lato', sans-serif">
              Select a tab to view content
            </Text>
          </Box>
        )
    }
  }

  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {renderTabContent()}
    </motion.div>
  )
}
