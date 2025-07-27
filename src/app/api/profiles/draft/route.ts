import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's draft profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'draft')
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching draft:', error)
      return NextResponse.json({ error: 'Failed to fetch draft' }, { status: 500 })
    }

    // Also fetch user tier information
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, tier')
      .eq('id', user.id)
      .single()

    if (userError) {
      console.error('Error fetching user data:', userError)
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
    }

    return NextResponse.json({
      profile: profile || null,
      user: userData,
      hasDraft: !!profile
    })

  } catch (error) {
    console.error('Draft API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, tier, slug } = body

    if (!content || !tier) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate slug if not provided
    const profileSlug = slug || `${content.name?.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`

    // Check if user already has ANY profile (due to unique constraint on user_id)
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, status, slug')
      .eq('user_id', user.id)
      .single()

    let result

    if (existingProfile) {
      // Update existing profile (regardless of status)
      const { data, error } = await supabase
        .from('profiles')
        .update({
          content,
          tier,
          slug: profileSlug,
          status: 'draft', // Always set to draft when saving
          is_published: false, // Reset published status when editing
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProfile.id)
        .select()
        .single()

      result = { data, error }
    } else {
      // Create new profile (first time for this user)
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          content,
          tier,
          slug: profileSlug,
          status: 'draft',
          is_published: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      result = { data, error }
    }

    if (result.error) {
      console.error('Error saving draft:', result.error)

      // Handle specific database errors
      if (result.error.code === '23505') {
        return NextResponse.json(
          { error: 'Profile already exists for this user. Please try refreshing the page.' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        {
          error: 'Failed to save draft',
          details: result.error.message
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      profile: result.data,
      message: 'Draft saved successfully'
    })

  } catch (error) {
    console.error('Draft save error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete user's draft profile
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', user.id)
      .eq('status', 'draft')

    if (error) {
      console.error('Error deleting draft:', error)
      return NextResponse.json({ error: 'Failed to delete draft' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Draft deleted successfully'
    })

  } catch (error) {
    console.error('Draft delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
