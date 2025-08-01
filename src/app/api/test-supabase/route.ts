import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { isAdminAvailable } from '@/lib/supabase/admin'

/**
 * Test API route to verify Supabase connection and configuration
 * GET /api/test-supabase
 */
export async function GET() {
  try {
    console.log('🧪 Testing Supabase connection...')
    
    // Test server client connection
    const supabase = await createServerClient()
    
    // Test basic query to profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, slug, assigned_tier')
      .limit(5)
    
    if (profilesError) {
      console.error('❌ Profiles query error:', profilesError)
      return NextResponse.json({
        success: false,
        error: 'Failed to query profiles table',
        details: profilesError.message
      }, { status: 500 })
    }

    // Test users table access
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, role')
      .limit(3)
    
    if (usersError) {
      console.error('❌ Users query error:', usersError)
      return NextResponse.json({
        success: false,
        error: 'Failed to query users table',
        details: usersError.message
      }, { status: 500 })
    }

    // Check admin availability
    const adminAvailable = isAdminAvailable()

    console.log('✅ Supabase connection test successful')
    
    return NextResponse.json({
      success: true,
      message: 'Supabase connection working correctly',
      data: {
        profilesCount: profiles?.length || 0,
        usersCount: users?.length || 0,
        adminAvailable,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Supabase connection test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Supabase connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
