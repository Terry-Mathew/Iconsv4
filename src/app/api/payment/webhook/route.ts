import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import crypto from 'crypto'

// Use service role key for webhook operations
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const event = JSON.parse(body)
    
    // Handle different webhook events
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity)
        break
      
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity)
        break
      
      case 'order.paid':
        await handleOrderPaid(event.payload.order.entity)
        break
      
      default:
        console.log('Unhandled webhook event:', event.event)
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentCaptured(payment: any) {
  try {
    // Update payment status
    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        razorpay_payment_id: payment.id,
        status: 'captured',
        updated_at: new Date().toISOString(),
      })
      .eq('razorpay_order_id', payment.order_id)

    if (paymentError) {
      throw paymentError
    }

    // Get the payment record to find the profile
    const { data: paymentRecord, error: fetchError } = await supabase
      .from('payments')
      .select('profile_id')
      .eq('razorpay_order_id', payment.order_id)
      .single()

    if (fetchError || !paymentRecord) {
      throw new Error('Payment record not found')
    }

    // Update profile status
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        payment_status: 'completed',
        status: 'published',
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentRecord.profile_id)

    if (profileError) {
      throw profileError
    }

    console.log('Payment captured and profile published:', payment.id)
  } catch (error) {
    console.error('Error handling payment captured:', error)
  }
}

async function handlePaymentFailed(payment: any) {
  try {
    // Update payment status
    const { error } = await supabase
      .from('payments')
      .update({
        razorpay_payment_id: payment.id,
        status: 'failed',
        updated_at: new Date().toISOString(),
      })
      .eq('razorpay_order_id', payment.order_id)

    if (error) {
      throw error
    }

    console.log('Payment failed:', payment.id)
  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}

async function handleOrderPaid(order: any) {
  try {
    console.log('Order paid:', order.id)
    // Additional order-level processing if needed
  } catch (error) {
    console.error('Error handling order paid:', error)
  }
}
