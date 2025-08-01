import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = await createServerClient()

    // Attempt to sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 401 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }

    // Get user role from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, tier, full_name')
      .eq('id', authData.user.id)
      .single()

    if (userError) {
      console.error('Error fetching user data:', userError)
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      )
    }

    // Determine redirect path based on role
    let redirectPath = '/builder' // Default for members
    
    if (userData.role === 'super_admin' || userData.role === 'editor' || userData.role === 'reviewer') {
      redirectPath = '/admin'
    }

    // Log successful sign-in
    await supabase
      .from('analytics_events')
      .insert({
        user_id: authData.user.id,
        event_type: 'user_sign_in',
        metadata: {
          role: userData.role,
          tier: userData.tier,
          redirect_path: redirectPath
        },
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      })

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: userData.role,
        tier: userData.tier,
        full_name: userData.full_name
      },
      redirectPath
    })

  } catch (error) {
    console.error('Sign-in error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
