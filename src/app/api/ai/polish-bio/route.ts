import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { polishBioWithClaude } from '@/lib/ai/claude'
import { rateLimit } from '@/lib/utils/rate-limit'
import { z } from 'zod'

const polishTextSchema = z.object({
  // Support both 'bio' and 'text' for backward compatibility
  bio: z.string().optional(),
  text: z.string().optional(),
  fieldType: z.enum(['bio', 'achievement', 'description', 'tagline', 'summary']).optional().default('bio'),
  tone: z.enum(['professional', 'casual', 'formal', 'confident', 'compelling', 'clear']).optional().default('professional'),
  tier: z.enum(['emerging', 'accomplished', 'distinguished', 'legacy']).optional().default('accomplished'),
  length: z.enum(['concise', 'balanced', 'detailed', 'comprehensive']).optional().default('balanced')
}).refine(data => data.bio || data.text, {
  message: "Either 'bio' or 'text' must be provided"
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
    const validationResult = polishTextSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input data',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    const { bio, text, fieldType, tone, tier, length } = validationResult.data
    const inputText = text || bio || ''

    // Validate text length based on field type
    const minLength = fieldType === 'tagline' ? 5 : fieldType === 'achievement' ? 10 : 50
    const maxLength = fieldType === 'tagline' ? 200 : fieldType === 'achievement' ? 1000 : 5000

    if (inputText.length < minLength || inputText.length > maxLength) {
      return NextResponse.json(
        {
          error: `Text must be between ${minLength} and ${maxLength} characters for ${fieldType}`,
        },
        { status: 400 }
      )
    }

    try {
      // Call Claude API to polish the text
      const polishedText = await polishBioWithClaude({
        originalBio: inputText,
        fieldType,
        tone,
        tier,
        length,
        userTier: userData.tier || 'rising'
      })

      // Log AI usage for analytics
      await supabase
        .from('analytics_events')
        .insert({
          user_id: user.id,
          event_type: `ai_${fieldType}_polish`,
          metadata: {
            feature: `${fieldType}_polish`,
            field_type: fieldType,
            input_length: inputText.length,
            output_length: polishedText.length,
            tier,
            tone,
            length
          }
        })

      return NextResponse.json({
        success: true,
        originalText: inputText,
        polishedText,
        fieldType,
        metadata: {
          tone,
          tier,
          length,
          originalLength: inputText.length,
          polishedLength: polishedText.length
        },
        // Backward compatibility
        originalBio: inputText,
        polishedBio: polishedText
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
        supportedTiers: ['emerging', 'accomplished', 'distinguished', 'legacy']
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
