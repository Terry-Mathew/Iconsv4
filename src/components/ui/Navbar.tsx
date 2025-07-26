'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { scrollToElement } from '@/components/providers/LenisProvider'
import { useScrollSpy } from '@/hooks/useScrollSpy'
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
import { Menu, X, Crown, LogIn } from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
// import { useImpersonation } from '@/lib/auth/impersonation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#process', label: 'Process' },
  { href: '#contact', label: 'Contact' }
]

export function Navbar() {
  const pathname = usePathname()
  const { user } = useAuth()
  // const { isImpersonating, targetUser, endImpersonation } = useImpersonation()
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Scroll spy for active section highlighting
  const activeSection = useScrollSpy({
    sectionIds: ['about', 'process', 'contact'],
    offset: 80
  })

  // Temporary: disable impersonation features for now
  const isImpersonating = false
  const isAdmin = false

  // Don't show navbar on auth pages or admin dashboard
  if (pathname.startsWith('/auth') || pathname.startsWith('/admin')) {
    return null
  }

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/' && !activeSection
    }
    if (href.startsWith('#')) {
      // For anchor links, check if the section is active
      const sectionId = href.substring(1)
      return activeSection === sectionId
    }
    return pathname.startsWith(href)
  }

  const handleNavClick = (href: string) => {
    if (mobile) onClose()

    if (href.startsWith('#')) {
      // Handle anchor links with Lenis smooth scrolling
      // Offset by navbar height (64px) to prevent content hiding
      scrollToElement(href, -80)
    }
  }

  const NavLink = ({ href, label, mobile = false }: { href: string; label: string; mobile?: boolean }) => {
    if (href.startsWith('#')) {
      return (
        <Text
          fontFamily="'Lato', sans-serif"
          fontWeight={isActiveLink(href) ? '600' : '400'}
          color={isActiveLink(href) ? '#D4AF37' : '#1A1A1A'}
          fontSize={mobile ? 'lg' : 'md'}
          _hover={{ color: '#D4AF37' }}
          transition="color 0.2s"
          cursor="pointer"
          onClick={() => handleNavClick(href)}
        >
          {label}
        </Text>
      )
    }

    return (
      <Link href={href} onClick={mobile ? onClose : undefined}>
        <Text
          fontFamily="'Lato', sans-serif"
          fontWeight={isActiveLink(href) ? '600' : '400'}
          color={isActiveLink(href) ? '#D4AF37' : '#1A1A1A'}
          fontSize={mobile ? 'lg' : 'md'}
          _hover={{ color: '#D4AF37' }}
          transition="color 0.2s"
          cursor="pointer"
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
                <Crown size={16} />
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
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        position="sticky"
        top="0"
        zIndex="sticky"
        shadow="sm"
      >
        <Container maxW="7xl">
          <Flex h="16" align="center" justify="space-between">
            {/* Logo */}
            <Link href="/">
              <HStack spacing={2} cursor="pointer">
                <Crown size={24} color="#D4AF37" />
                <Text
                  fontFamily="'Playfair Display', serif"
                  fontSize="xl"
                  fontWeight="600"
                  color="#1A1A1A"
                >
                  ICONS HERALD
                </Text>
              </HStack>
            </Link>

            {/* Desktop Navigation */}
            <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
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
                      variant="outline"
                      borderColor="#D4AF37"
                      color="#D4AF37"
                      _hover={{ bg: "#D4AF37", color: "white" }}
                      size="sm"
                    >
                      Dashboard
                    </Button>
                  </Link>
                </HStack>
              ) : (
                <Link href="/auth/signin">
                  <Button
                    leftIcon={<LogIn size={16} />}
                    bg="#D4AF37"
                    color="white"
                    _hover={{ bg: "#B8941F" }}
                    size="sm"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </HStack>

            {/* Mobile Menu Button */}
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              aria-label="Open menu"
              icon={<Menu size={20} />}
              variant="ghost"
              onClick={onOpen}
            />
          </Flex>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <HStack spacing={2}>
              <Crown size={20} color="#D4AF37" />
              <Text fontFamily="'Playfair Display', serif" fontSize="lg">
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
              <Box pt={4} borderTop="1px solid" borderColor="gray.200">
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
                        variant="outline"
                        borderColor="#D4AF37"
                        color="#D4AF37"
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
                      leftIcon={<LogIn size={16} />}
                      bg="#D4AF37"
                      color="white"
                      _hover={{ bg: "#B8941F" }}
                      w="full"
                      justifyContent="flex-start"
                    >
                      Sign In
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
