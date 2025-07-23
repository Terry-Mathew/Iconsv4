import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { verifyPaymentSignature } from '@/lib/razorpay'
import { Database } from '@/types/supabase'

export async function POST(request: NextRequest) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await request.json()

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification data' },
        { status: 400 }
      )
    }

    const cookieStore = cookies()
    const supabase = await createServerClient()

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify the payment signature
    const isValidSignature = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    if (!isValidSignature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Find the payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('razorpay_order_id', razorpay_order_id)
      .eq('user_id', user.id)
      .single()

    if (paymentError || !payment) {
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      )
    }

    // Update payment status
    const { error: updatePaymentError } = await supabase
      .from('payments')
      .update({
        razorpay_payment_id,
        status: 'captured',
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.id)

    if (updatePaymentError) {
      throw updatePaymentError
    }

    // Update profile status to published
    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({
        payment_status: 'completed',
        payment_id: payment.id,
        status: 'published',
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.profile_id)

    if (updateProfileError) {
      throw updateProfileError
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and profile published successfully',
    })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
