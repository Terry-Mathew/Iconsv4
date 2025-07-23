'use client'

import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Card,
  CardBody,
} from '@chakra-ui/react'
import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center">
      <Container maxW="2xl">
        <Card shadow="xl">
          <CardBody p={12} textAlign="center">
            <VStack spacing={6}>
              <Box fontSize="6xl">🚫</Box>
              
              <VStack spacing={3}>
                <Heading as="h1" size="xl" color="gray.800">
                  Access Denied
                </Heading>
                <Text color="gray.600" fontSize="lg" maxW="md">
                  You don't have permission to access this page. Please contact an administrator if you believe this is an error.
                </Text>
              </VStack>

              <VStack spacing={3} pt={4}>
                <Link href="/">
                  <Button
                    leftIcon={<Home size={20} />}
                    colorScheme="primary"
                    size="lg"
                  >
                    Go Home
                  </Button>
                </Link>
                
                <Button
                  leftIcon={<ArrowLeft size={20} />}
                  variant="outline"
                  size="lg"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </Button>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  )
}
