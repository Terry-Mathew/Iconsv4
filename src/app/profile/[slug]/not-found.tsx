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
import { Home, Search } from 'lucide-react'

export default function ProfileNotFound() {
  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center">
      <Container maxW="2xl">
        <Card shadow="xl">
          <CardBody p={12} textAlign="center">
            <VStack spacing={6}>
              <Box fontSize="6xl">🔍</Box>
              
              <VStack spacing={3}>
                <Heading as="h1" size="xl" color="gray.800">
                  Profile Not Found
                </Heading>
                <Text color="gray.600" fontSize="lg" maxW="md">
                  The profile you're looking for doesn't exist or may have been removed.
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
                
                <Link href="/profiles">
                  <Button
                    leftIcon={<Search size={20} />}
                    variant="outline"
                    size="lg"
                  >
                    Browse Profiles
                  </Button>
                </Link>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  )
}
