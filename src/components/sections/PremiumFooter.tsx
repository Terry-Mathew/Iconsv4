'use client'

import { Box, Container, Heading, Text, VStack, HStack, SimpleGrid, Button } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Crown, ArrowUp, Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

const MotionBox = motion.create(Box)

const footerLinks = {
  platform: [
    { label: 'Home', href: '/' },
    { label: 'Icons', href: '/profiles' },
    { label: 'Create Profile', href: '/builder' },
    { label: 'About', href: '/#about' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
  community: [
    { label: 'Featured Icons', href: '/featured' },
    { label: 'Success Stories', href: '/stories' },
    { label: 'Editorial Guidelines', href: '/guidelines' },
    { label: 'Nomination Process', href: '/nominate' },
  ]
}

export function PremiumFooter() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <Box
      bg="linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)"
      color="white.50"
      position="relative"
      overflow="hidden"
      className="dark-section"
    >

      <Container maxW="1400px" position="relative" zIndex={1}>
        {/* Main Footer Content */}
        <Box py={20}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={12}>
            {/* Brand Section */}
            <VStack align="start" spacing={6}>
              <HStack spacing={3}>
                <Crown size={32} color="#D4AF37" />
                <Heading
                  fontSize="2xl"
                  fontWeight="bold"
                  color="white.50"
                  letterSpacing="tight"
                  textShadow="0 1px 2px rgba(0, 0, 0, 0.3)"
                >
                  ICONS HERALD
                </Heading>
              </HStack>
              
              <Text
                fontSize="sm"
                color="white.200"
                lineHeight="relaxed"
                maxW="280px"
              >
                An exclusive digital archive celebrating extraordinary individuals
                whose contributions shape our world. By invitation only.
              </Text>

              <VStack align="start" spacing={2}>
                <HStack spacing={3}>
                  <Mail size={16} color="#D4AF37" />
                  <Text fontSize="sm" color="white.200">
                    hello@iconsherald.com
                  </Text>
                </HStack>
                <HStack spacing={3}>
                  <MapPin size={16} color="#D4AF37" />
                  <Text fontSize="sm" color="white.200">
                    Global Digital Archive
                  </Text>
                </HStack>
              </VStack>
            </VStack>

            {/* Platform Links */}
            <VStack align="start" spacing={4}>
              <Heading fontSize="lg" fontWeight="600" color="white.50">
                Platform
              </Heading>
              <VStack align="start" spacing={3}>
                {footerLinks.platform.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <Text
                      fontSize="sm"
                      color="white.200"
                      _hover={{
                        color: "gold.400",
                        textShadow: "0 0 8px rgba(212, 175, 55, 0.3)"
                      }}
                      transition="all 0.3s ease"
                      cursor="pointer"
                    >
                      {link.label}
                    </Text>
                  </Link>
                ))}
              </VStack>
            </VStack>

            {/* Support Links */}
            <VStack align="start" spacing={4}>
              <Heading fontSize="lg" fontWeight="600" color="white.50">
                Support
              </Heading>
              <VStack align="start" spacing={3}>
                {footerLinks.support.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <Text
                      fontSize="sm"
                      color="white.200"
                      _hover={{
                        color: "gold.400",
                        textShadow: "0 0 8px rgba(212, 175, 55, 0.3)"
                      }}
                      transition="all 0.3s ease"
                      cursor="pointer"
                    >
                      {link.label}
                    </Text>
                  </Link>
                ))}
              </VStack>
            </VStack>

            {/* Community Links */}
            <VStack align="start" spacing={4}>
              <Heading fontSize="lg" fontWeight="600" color="white.50">
                Community
              </Heading>
              <VStack align="start" spacing={3}>
                {footerLinks.community.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <Text
                      fontSize="sm"
                      color="white.200"
                      _hover={{
                        color: "gold.400",
                        textShadow: "0 0 8px rgba(212, 175, 55, 0.3)"
                      }}
                      transition="all 0.3s ease"
                      cursor="pointer"
                    >
                      {link.label}
                    </Text>
                  </Link>
                ))}
              </VStack>
            </VStack>
          </SimpleGrid>
        </Box>

        {/* Bottom Section */}
        <Box
          borderTop="1px solid"
          borderColor="rgba(255, 255, 255, 0.1)"
          py={8}
        >
          <HStack justify="space-between" align="center" flexWrap="wrap" gap={4}>
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" color="white.200">
                © 2024 ICONS HERALD. All rights reserved.
              </Text>
              <Text fontSize="xs" color="white.300">
                Preserving legacies for future generations
              </Text>
            </VStack>

            <Button
              variant="ghost"
              size="sm"
              color="white.200"
              _hover={{
                color: "gold.400",
                bg: "rgba(212, 175, 55, 0.1)",
                transform: "translateY(-2px)",
                textShadow: "0 0 8px rgba(212, 175, 55, 0.3)"
              }}
              onClick={scrollToTop}
              leftIcon={<ArrowUp size={16} />}
              transition="all 0.3s ease"
            >
              Back to Top
            </Button>
          </HStack>
        </Box>
      </Container>
    </Box>
  )
}
