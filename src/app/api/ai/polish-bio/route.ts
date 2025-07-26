import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { polishBioWithClaude } from '@/lib/ai/claude'
import { rateLimit } from '@/lib/utils/rate-limit'
import { z } from 'zod'

const polishBioSchema = z.object({
  bio: z.string().min(50).max(5000),
  tone: z.enum(['professional', 'casual', 'formal']).optional().default('professional'),
  tier: z.enum(['rising', 'elite', 'legacy']).optional().default('elite')
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - more restrictive for AI endpoints
    const identifier = request.headers.get('x-forwarded-for') ?? 'anonymous'
    const { success } = await rateLimit.limit(identifier, {
      requests: 5,
      window: '1h'
    })
    
    if (!success) {
      return NextResponse.json(
        { error: 'AI usage limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const supabase = await createServerClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user role and check if they have access to AI features
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, tier')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user has access to AI features (members and above)
    if (!['member', 'admin', 'super_admin'].includes(userData.role)) {
      return NextResponse.json(
        { error: 'AI features require membership. Please upgrade your account.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validationResult = polishBioSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input data',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    const { bio, tone, tier } = validationResult.data

    try {
      // Call Claude API to polish the bio
      const polishedBio = await polishBioWithClaude({
        originalBio: bio,
        tone,
        tier,
        userTier: userData.tier || 'rising'
      })

      // Log AI usage for analytics
      await supabase
        .from('analytics_events')
        .insert({
          user_id: user.id,
          event_type: 'ai_bio_polish',
          metadata: {
            feature: 'bio_polish',
            input_length: bio.length,
            output_length: polishedBio.length,
            tier,
            tone
          }
        })

      return NextResponse.json({
        success: true,
        originalBio: bio,
        polishedBio,
        metadata: {
          tone,
          tier,
          originalLength: bio.length,
          polishedLength: polishedBio.length
        }
      })

    } catch (aiError: any) {
      console.error('AI processing error:', aiError)
      
      // Handle specific AI errors
      if (aiError.message?.includes('rate_limit')) {
        return NextResponse.json(
          { error: 'AI service is currently busy. Please try again in a few minutes.' },
          { status: 503 }
        )
      }

      if (aiError.message?.includes('content_policy')) {
        return NextResponse.json(
          { error: 'Content violates AI usage policies. Please revise your bio.' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: 'AI processing failed. Please try again.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint to check AI feature availability
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, tier')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const hasAccess = ['member', 'admin', 'super_admin'].includes(userData.role)
    
    // Get usage stats for the current user
    const { data: usageStats, error: usageError } = await supabase
      .from('analytics_events')
      .select('created_at')
      .eq('user_id', user.id)
      .eq('event_type', 'ai_bio_polish')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours

    const dailyUsage = usageStats?.length || 0
    const dailyLimit = hasAccess ? 10 : 0

    return NextResponse.json({
      hasAccess,
      userRole: userData.role,
      userTier: userData.tier,
      usage: {
        daily: dailyUsage,
        dailyLimit,
        remaining: Math.max(0, dailyLimit - dailyUsage)
      },
      features: {
        bioPolish: hasAccess,
        toneOptions: ['professional', 'casual', 'formal'],
        supportedTiers: ['rising', 'elite', 'legacy']
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
