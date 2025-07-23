import Link from 'next/link'
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  HStack
} from '@chakra-ui/react'
import { Crown, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <Container maxW="md" py={20}>
      <VStack spacing={8} textAlign="center">
        {/* Logo */}
        <HStack spacing={2}>
          <Crown size={32} color="#D4AF37" />
          <Heading
            as="h1"
            fontSize="2xl"
            fontFamily="'Playfair Display', serif"
            color="#1A1A1A"
          >
            ICONS HERALD
          </Heading>
        </HStack>

        {/* 404 Message */}
        <VStack spacing={4}>
          <Heading
            as="h2"
            fontSize="6xl"
            fontFamily="'Playfair Display', serif"
            color="#D4AF37"
            fontWeight="400"
          >
            404
          </Heading>
          <Heading
            as="h3"
            fontSize="2xl"
            fontFamily="'Playfair Display', serif"
            color="#1A1A1A"
            fontWeight="400"
          >
            Page Not Found
          </Heading>
          <Text
            color="#666"
            fontFamily="'Lato', sans-serif"
            fontSize="lg"
            maxW="sm"
          >
            The page you're looking for doesn't exist or has been moved.
          </Text>
        </VStack>

        {/* Actions */}
        <VStack spacing={4} w="full">
          <Link href="/">
            <Button
              leftIcon={<Home size={20} />}
              bg="#D4AF37"
              color="white"
              _hover={{ bg: "#B8941F" }}
              size="lg"
              fontFamily="'Lato', sans-serif"
              fontWeight="600"
            >
              Go Home
            </Button>
          </Link>
          
          <Button
            leftIcon={<ArrowLeft size={20} />}
            variant="outline"
            borderColor="#D4AF37"
            color="#D4AF37"
            _hover={{ bg: "#D4AF37", color: "white" }}
            size="lg"
            fontFamily="'Lato', sans-serif"
            fontWeight="600"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </VStack>

        {/* Footer */}
        <Text
          fontSize="sm"
          color="#999"
          fontFamily="'Lato', sans-serif"
          mt={8}
        >
          If you believe this is an error, please contact support.
        </Text>
      </VStack>
    </Container>
  )
}
