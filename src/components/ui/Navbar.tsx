'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Button,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Container,
  Badge
} from '@chakra-ui/react'
// Icons replaced with emoji for server-side compatibility
import { useAuth } from '@/lib/auth/auth-context'
// import { useImpersonation } from '@/lib/auth/impersonation'

const navLinks = [
  { href: '/', label: 'Home', isAnchor: false },
  { href: '/#about', label: 'About', isAnchor: true },
  { href: '/#process', label: 'Process', isAnchor: true },
  { href: '/#tiers', label: 'Tiers', isAnchor: true },
  { href: '/#nominate', label: 'Contact', isAnchor: true }
]

export function Navbar() {
  const pathname = usePathname()
  const { user } = useAuth()
  // const { isImpersonating, targetUser, endImpersonation } = useImpersonation()
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Temporary: disable impersonation features for now
  const isImpersonating = false
  const isAdmin = false

  // Don't show navbar on auth pages or admin dashboard
  if (pathname.startsWith('/auth') || pathname.startsWith('/admin')) {
    return null
  }

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/' && !window.location.hash
    }
    // For anchor links, check if we're on the home page and the hash matches
    if (href.includes('#')) {
      const hash = href.split('#')[1]
      return pathname === '/' && window.location.hash === `#${hash}`
    }
    return pathname.startsWith(href)
  }

  const NavLink = ({ href, label, isAnchor, mobile = false }: {
    href: string;
    label: string;
    isAnchor?: boolean;
    mobile?: boolean
  }) => {
    const handleClick = (e: React.MouseEvent) => {
      if (mobile) onClose()

      if (isAnchor && href.includes('#')) {
        e.preventDefault()
        const hash = href.split('#')[1]
        if (hash) {
          const element = document.getElementById(hash)
          if (element && (window as any).lenis) {
            // Update URL hash
            window.history.pushState(null, '', `#${hash}`)

            // Smooth scroll with luxury easing
            ;(window as any).lenis.scrollTo(element, {
              offset: -80,
              duration: 1.4,
              easing: (t: number) => 1 - Math.pow(1 - t, 4) // Luxury quartic easing
            })
          }
        }
      }
    }

    return (
      <Link
        href={href}
        onClick={handleClick}
        aria-current={isActiveLink(href) ? 'page' : undefined}
        role="menuitem"
      >
        <Text
          fontFamily="body"
          fontWeight={isActiveLink(href) ? '600' : '400'}
          color={isActiveLink(href) ? 'gold.500' : 'charcoal.900'}
          fontSize={mobile ? 'lg' : 'md'}
          _hover={{
            color: 'gold.500',
            transform: 'translateY(-1px)'
          }}
          _focus={{
            outline: '2px solid',
            outlineColor: 'gold.600',
            outlineOffset: '2px',
            color: 'gold.500'
          }}
          _focusVisible={{
            outline: '2px solid',
            outlineColor: 'gold.600',
            outlineOffset: '2px'
          }}
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          cursor="pointer"
          tabIndex={0}
        >
          {label}
        </Text>
      </Link>
    )
  }

  return (
    <>
      {/* Impersonation Banner - Temporarily disabled */}
      {/* {isImpersonating && (
        <Box bg="orange.500" color="white" py={2} px={4}>
          <Container maxW="7xl">
            <Flex justify="space-between" align="center">
              <HStack spacing={2}>
                <Text fontSize="lg">👑</Text>
                <Text fontSize="sm" fontWeight="600">
                  Impersonating: {targetUser?.email}
                </Text>
              </HStack>
              <Button
                size="xs"
                variant="outline"
                colorScheme="whiteAlpha"
                onClick={endImpersonation}
              >
                End Impersonation
              </Button>
            </Flex>
          </Container>
        </Box>
      )} */}

      {/* Main Navbar */}
      <Box
        bg="ivory.50"
        borderBottom="1px solid"
        borderColor="cream.300"
        position="sticky"
        top="0"
        zIndex="sticky"
        shadow="0 2px 20px rgba(212, 175, 55, 0.1)"
        backdropFilter="blur(10px)"
      >
        <Container maxW="7xl">
          <Flex h="16" align="center" justify="space-between">
            {/* Logo */}
            <Link href="/">
              <HStack
                spacing={3}
                cursor="pointer"
                _hover={{
                  transform: 'scale(1.02)',
                }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              >
                <Text fontSize="2xl" color="gold.500">👑</Text>
                <Text
                  fontFamily="heading"
                  fontSize="xl"
                  fontWeight="bold"
                  color="charcoal.900"
                  letterSpacing="tight"
                >
                  ICONS HERALD
                </Text>
              </HStack>
            </Link>

            {/* Desktop Navigation */}
            <HStack
              spacing={8}
              display={{ base: 'none', md: 'flex' }}
              role="menubar"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
            </HStack>

            {/* Desktop Auth */}
            <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
              {user ? (
                <HStack spacing={3}>
                  {isAdmin && (
                    <Link href="/admin">
                      <Badge
                        colorScheme="purple"
                        variant="subtle"
                        cursor="pointer"
                        _hover={{ bg: 'purple.200' }}
                      >
                        Admin
                      </Badge>
                    </Link>
                  )}
                  <Link href="/dashboard">
                    <Button
                      variant="secondary"
                      size="sm"
                    >
                      Dashboard
                    </Button>
                  </Link>
                </HStack>
              ) : (
                <Link href="/auth/signin">
                  <Button
                    variant="primary"
                    size="sm"
                  >
                    🔐 Sign In
                  </Button>
                </Link>
              )}
            </HStack>

            {/* Mobile Menu Button */}
            <Button
              display={{ base: 'flex', md: 'none' }}
              aria-label="Open navigation menu"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              variant="ghost"
              onClick={onOpen}
              fontSize="xl"
              _focus={{
                outline: '2px solid',
                outlineColor: 'gold.600',
                outlineOffset: '2px'
              }}
            >
              ☰
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        size="sm"
      >
        <DrawerOverlay />
        <DrawerContent
          bg="ivory.50"
          borderLeft="2px solid"
          borderColor="gold.500"
          id="mobile-navigation"
          role="dialog"
          aria-label="Mobile navigation menu"
        >
          <DrawerCloseButton
            color="charcoal.900"
            aria-label="Close navigation menu"
            _focus={{
              outline: '2px solid',
              outlineColor: 'gold.600',
              outlineOffset: '2px'
            }}
          />
          <DrawerHeader borderBottomWidth="1px" borderColor="cream.300">
            <HStack spacing={3}>
              <Text fontSize="xl" color="gold.500" aria-hidden="true">👑</Text>
              <Text fontFamily="heading" fontSize="lg" fontWeight="bold" color="charcoal.900">
                ICONS HERALD
              </Text>
            </HStack>
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={6} align="stretch" pt={4}>
              {/* Navigation Links */}
              <VStack spacing={4} align="stretch">
                {navLinks.map((link) => (
                  <NavLink key={link.href} {...link} mobile />
                ))}
              </VStack>

              {/* Mobile Auth */}
              <Box pt={4} borderTop="1px solid" borderColor="cream.300">
                {user ? (
                  <VStack spacing={3} align="stretch">
                    {isAdmin && (
                      <Link href="/admin" onClick={onClose}>
                        <Button
                          variant="outline"
                          borderColor="purple.500"
                          color="purple.500"
                          w="full"
                          justifyContent="flex-start"
                        >
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}
                    <Link href="/dashboard" onClick={onClose}>
                      <Button
                        variant="secondary"
                        w="full"
                        justifyContent="flex-start"
                      >
                        Dashboard
                      </Button>
                    </Link>
                  </VStack>
                ) : (
                  <Link href="/auth/signin" onClick={onClose}>
                    <Button
                      variant="primary"
                      w="full"
                      justifyContent="flex-start"
                    >
                      🔐 Sign In
                    </Button>
                  </Link>
                )}
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
