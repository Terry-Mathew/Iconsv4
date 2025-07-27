import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json()

    if (!slug) {
      return NextResponse.json(
        { error: 'Profile slug is required' },
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

    // Get the draft profile
    const { data: draftProfile, error: draftError } = await supabase
      .from('profiles')
      .select('*')
      .eq('slug', slug)
      .eq('user_id', user.id)
      .eq('status', 'draft')
      .single()

    if (draftError || !draftProfile) {
      return NextResponse.json(
        { error: 'Draft profile not found' },
        { status: 404 }
      )
    }

    // Check payment status (mock for now - always allow for development)
    const isPaid = true // Mock payment verification

    if (!isPaid) {
      return NextResponse.json(
        {
          error: 'Payment required',
          requiresPayment: true,
          tier: draftProfile.tier,
          amount: getTierPrice(draftProfile.tier)
        },
        { status: 402 }
      )
    }

    // Check if a published profile with this slug already exists
    const { data: existingPublished } = await supabase
      .from('profiles')
      .select('id')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    let publishedProfile

    if (existingPublished) {
      // Update existing published profile
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          content: draftProfile.content,
          tier: draftProfile.tier,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPublished.id)
        .select()
        .single()

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to update published profile' },
          { status: 500 }
        )
      }

      publishedProfile = data
    } else {
      // Create new published profile
      const { data, error: createError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          content: draftProfile.content,
          tier: draftProfile.tier,
          slug: draftProfile.slug,
          status: 'published',
          is_published: true,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) {
        return NextResponse.json(
          { error: 'Failed to create published profile' },
          { status: 500 }
        )
      }

      publishedProfile = data
    }

    // Remove this block since we handle errors in the if/else above

    // Revalidate ISR for the public profile
    try {
      revalidatePath(`/profile/${slug}`)
      revalidatePath('/profiles') // Also revalidate the profiles listing
    } catch (revalidateError) {
      console.error('Revalidation error:', revalidateError)
      // Don't fail the request if revalidation fails
    }

    // Log analytics event (optional - remove if analytics_events table doesn't exist)
    try {
      await supabase
        .from('analytics_events')
        .insert({
          user_id: user.id,
          event_type: 'profile_published',
          metadata: {
            profile_id: publishedProfile.id,
            tier: draftProfile.tier,
            slug: slug
          }
        })
    } catch (analyticsError) {
      console.warn('Analytics logging failed:', analyticsError)
    }

    return NextResponse.json({
      success: true,
      profile: publishedProfile,
      publicUrl: `/profile/${slug}`,
      message: 'Profile published successfully!'
    })

  } catch (error) {
    console.error('Publish error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to get tier pricing
function getTierPrice(tier: string) {
  const prices = {
    rising: { amount: 3000, currency: 'INR', period: 'year' },
    elite: { amount: 10000, currency: 'INR', period: 'year' },
    legacy: { amount: 20000, currency: 'INR', period: 'lifetime' }
  }
  
  return prices[tier as keyof typeof prices] || prices.rising
}
