import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { profileData, slug } = await request.json()

    if (!profileData || !slug) {
      return NextResponse.json(
        { error: 'Profile data and slug are required' },
        { status: 400 }
      )
    }

    const supabase = await createServerClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Save preview data to temporary storage or database
    // For now, we'll store it in the profiles table with a preview flag
    const { data: profile, error: saveError } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        slug: slug,
        content: profileData,
        status: 'draft',
        tier: profileData.tier,
        is_preview: true,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving preview:', saveError)
      return NextResponse.json(
        { error: 'Failed to save preview' },
        { status: 500 }
      )
    }

    // Generate preview URL
    const previewUrl = `/profile/${slug}?preview=true`

    return NextResponse.json({
      success: true,
      previewUrl,
      profileId: profile.id
    })

  } catch (error) {
    console.error('Preview generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const preview = searchParams.get('preview')

    if (!slug || preview !== 'true') {
      return NextResponse.json(
        { error: 'Invalid preview request' },
        { status: 400 }
      )
    }

    const supabase = await createServerClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get preview profile (only owner can access)
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('slug', slug)
      .eq('user_id', user.id)
      .eq('is_preview', true)
      .single()

    if (fetchError || !profile) {
      return NextResponse.json(
        { error: 'Preview not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      profile
    })

  } catch (error) {
    console.error('Preview fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
