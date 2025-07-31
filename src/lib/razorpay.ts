import Razorpay from 'razorpay'

// Server-side Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Tier pricing in INR (paise)
export const TIER_PRICING = {
  emerging: 250000,      // ₹2,500
  accomplished: 500000,  // ₹5,000
  distinguished: 1200000, // ₹12,000
  legacy: 5000000,       // ₹50,000
} as const

export const TIER_PRICING_DISPLAY = {
  emerging: '₹2,500',
  accomplished: '₹5,000',
  distinguished: '₹12,000',
  legacy: '₹50,000',
} as const

export interface CreateOrderParams {
  amount: number
  currency: string
  receipt: string
  notes?: Record<string, string>
}

export interface RazorpayOrder {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  status: string
  attempts: number
  notes: Record<string, string>
  created_at: number
}

export interface RazorpayPayment {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

// Client-side payment options
export interface PaymentOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayPayment) => void
  prefill: {
    name: string
    email: string
  }
  theme: {
    color: string
  }
  modal: {
    ondismiss: () => void
  }
}

export function createPaymentOptions(
  order: RazorpayOrder,
  userDetails: { name: string; email: string },
  onSuccess: (response: RazorpayPayment) => void,
  onDismiss: () => void
): PaymentOptions {
  return {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    amount: order.amount,
    currency: order.currency,
    name: 'Icons Herald',
    description: 'Premium Profile Publication',
    order_id: order.id,
    handler: onSuccess,
    prefill: {
      name: userDetails.name,
      email: userDetails.email,
    },
    theme: {
      color: '#0ea5e9',
    },
    modal: {
      ondismiss: onDismiss,
    },
  }
}

// Utility to verify payment signature
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const crypto = require('crypto')
  const body = orderId + '|' + paymentId
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest('hex')
  
  return expectedSignature === signature
}
