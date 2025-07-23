import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { razorpay, TIER_PRICING, CreateOrderParams } from '@/lib/razorpay'
import { Database } from '@/types/supabase'

export async function POST(request: NextRequest) {
  try {
    const { profileId, tier } = await request.json()

    if (!profileId || !tier) {
      return NextResponse.json(
        { error: 'Profile ID and tier are required' },
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

    // Verify the profile belongs to the user
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Check if payment already exists and is completed
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('*')
      .eq('profile_id', profileId)
      .eq('status', 'captured')
      .single()

    if (existingPayment) {
      return NextResponse.json(
        { error: 'Payment already completed for this profile' },
        { status: 400 }
      )
    }

    const amount = TIER_PRICING[tier as keyof typeof TIER_PRICING]
    if (!amount) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      )
    }

    // Create Razorpay order
    const orderParams: CreateOrderParams = {
      amount,
      currency: 'INR',
      receipt: `profile_${profileId}_${Date.now()}`,
      notes: {
        profile_id: profileId,
        user_id: user.id,
        tier,
      },
    }

    const order = await razorpay.orders.create(orderParams)

    // Save payment record in database
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        profile_id: profileId,
        razorpay_order_id: order.id,
        amount,
        currency: 'INR',
        status: 'created',
        tier,
      })
      .select()
      .single()

    if (paymentError) {
      throw paymentError
    }

    return NextResponse.json({
      order,
      payment,
    })
  } catch (error: any) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment order' },
      { status: 500 }
    )
  }
}
