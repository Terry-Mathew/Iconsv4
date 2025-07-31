'use client'

import { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Button,
  Box,
  Badge,
  Divider,
  Icon,
  useToast,
  Alert,
  AlertIcon,
  Spinner,
} from '@chakra-ui/react'
import { Crown, Star, Trophy, Check, CreditCard } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  tier: 'emerging' | 'accomplished' | 'distinguished' | 'legacy'
  onPaymentSuccess: () => void
}

const TIER_CONFIG = {
  emerging: {
    name: 'Emerging',
    price: '₹2,500',
    period: '/year',
    icon: Star,
    color: 'green.500',
    features: [
      'Professional profile page',
      'AI bio polishing',
      'Awards & honors showcase',
      'Up to 4 gallery photos',
      'Mobile-optimized design'
    ]
  },
  accomplished: {
    name: 'Accomplished',
    price: '₹5,000',
    period: '/year',
    icon: Crown,
    color: 'blue.500',
    features: [
      'Everything in Emerging',
      'Up to 10 gallery photos',
      'QR code generation',
      'Interactive timeline',
      'Leadership showcase',
      'Priority support'
    ]
  },
  distinguished: {
    name: 'Distinguished',
    price: '₹12,000',
    period: '/year',
    icon: Trophy,
    color: 'purple.500',
    features: [
      'Everything in Accomplished',
      'Up to 20 gallery photos',
      'Publications showcase',
      'Advanced impact metrics',
      'Premium templates',
      'White-glove service'
    ]
  },
  legacy: {
    name: 'Legacy',
    price: '₹50,000',
    period: ' lifetime',
    icon: Trophy,
    color: 'purple.500',
    features: [
      'Memorial service templates',
      'Unlimited gallery photos',
      'Timeline preservation',
      'Tribute collection',
      'Archival documentation',
      'Lifetime hosting'
    ]
  }
}

export function PaymentModal({ isOpen, onClose, tier, onPaymentSuccess }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card')
  const toast = useToast()

  const tierConfig = TIER_CONFIG[tier]
  const IconComponent = tierConfig.icon

  const handleMockPayment = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock payment success (90% success rate)
      const isSuccess = Math.random() > 0.1
      
      if (isSuccess) {
        toast({
          title: 'Payment Successful!',
          description: `Your ${tierConfig.name} profile is now ready to publish.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        onPaymentSuccess()
        onClose()
      } else {
        throw new Error('Payment failed')
      }
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description: 'Please try again or contact support.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRazorpayPayment = async () => {
    // TODO: Implement real Razorpay integration
    setIsProcessing(true)
    
    try {
      // This would be the real Razorpay integration
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: parseInt(tierConfig.price.replace('₹', '').replace(',', '')) * 100, // Amount in paise
        currency: 'INR',
        name: 'ICONS HERALD',
        description: `${tierConfig.name} Profile Subscription`,
        handler: function (response: any) {
          toast({
            title: 'Payment Successful!',
            description: `Payment ID: ${response.razorpay_payment_id}`,
            status: 'success',
            duration: 5000,
            isClosable: true,
          })
          onPaymentSuccess()
          onClose()
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
        },
        theme: {
          color: '#D4AF37'
        }
      }

      // For now, use mock payment
      await handleMockPayment()
      
    } catch (error) {
      console.error('Razorpay error:', error)
      await handleMockPayment() // Fallback to mock
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <Icon as={IconComponent} color={tierConfig.color} boxSize={6} />
            <Text>Complete Your {tierConfig.name} Profile</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            {/* Pricing Summary */}
            <Box p={4} bg="gray.50" borderRadius="md">
              <HStack justify="space-between" mb={2}>
                <Text fontWeight="semibold">{tierConfig.name} Profile</Text>
                <Badge colorScheme={tierConfig.color.split('.')[0]} size="lg">
                  {tierConfig.price}{tierConfig.period}
                </Badge>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                Premium profile with advanced features
              </Text>
            </Box>

            {/* Features List */}
            <Box>
              <Text fontWeight="semibold" mb={3}>What's Included:</Text>
              <VStack spacing={2} align="stretch">
                {tierConfig.features.map((feature, index) => (
                  <HStack key={index}>
                    <Icon as={Check} color="green.500" boxSize={4} />
                    <Text fontSize="sm">{feature}</Text>
                  </HStack>
                ))}
              </VStack>
            </Box>

            <Divider />

            {/* Payment Methods */}
            <Box>
              <Text fontWeight="semibold" mb={3}>Payment Method:</Text>
              <VStack spacing={2}>
                <Button
                  variant={paymentMethod === 'card' ? 'solid' : 'outline'}
                  colorScheme="blue"
                  leftIcon={<CreditCard size={16} />}
                  onClick={() => setPaymentMethod('card')}
                  w="full"
                  justifyContent="flex-start"
                >
                  Credit/Debit Card
                </Button>
                <Button
                  variant={paymentMethod === 'upi' ? 'solid' : 'outline'}
                  colorScheme="green"
                  onClick={() => setPaymentMethod('upi')}
                  w="full"
                  justifyContent="flex-start"
                >
                  UPI
                </Button>
                <Button
                  variant={paymentMethod === 'netbanking' ? 'solid' : 'outline'}
                  colorScheme="purple"
                  onClick={() => setPaymentMethod('netbanking')}
                  w="full"
                  justifyContent="flex-start"
                >
                  Net Banking
                </Button>
              </VStack>
            </Box>

            {/* Development Notice */}
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <Text fontSize="sm">
                Development Mode: This is a mock payment for testing. No actual charges will be made.
              </Text>
            </Alert>

            {/* Action Buttons */}
            <HStack spacing={4}>
              <Button variant="outline" onClick={onClose} flex={1}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleRazorpayPayment}
                isLoading={isProcessing}
                loadingText="Processing..."
                flex={2}
                leftIcon={isProcessing ? <Spinner size="sm" /> : <CreditCard size={16} />}
              >
                Pay {tierConfig.price}
              </Button>
            </HStack>

            {/* Security Notice */}
            <Text fontSize="xs" color="gray.500" textAlign="center">
              🔒 Your payment information is secure and encrypted
            </Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
