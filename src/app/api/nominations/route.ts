import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { nominationSchema } from '@/lib/validations/nomination'
import { rateLimit } from '@/lib/utils/rate-limit'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = request.headers.get('x-forwarded-for') ?? 'anonymous'
    const { success } = await rateLimit.limit(identifier)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validationResult = nominationSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input data',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Check honeypot field
    if (data.website && data.website.length > 0) {
      return NextResponse.json(
        { error: 'Spam detected' },
        { status: 400 }
      )
    }

    const supabase = await createServerClient()

    // Insert nomination
    const { error } = await supabase
      .from('nominations')
      .insert({
        nominator_email: data.nominatorEmail,
        nominator_name: data.nominatorName,
        nominee_name: data.nomineeName,
        nominee_email: data.nomineeEmail,
        pitch: data.pitch,
        links: data.links.length > 0 ? data.links : null,
        assigned_tier: data.suggestedTier || null,
        status: 'pending',
      })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to submit nomination' },
        { status: 500 }
      )
    }

    // TODO: Send notification email to admins
    // await sendNotificationEmail({
    //   type: 'new_nomination',
    //   nomineeName: data.nomineeName,
    //   nominatorName: data.nominatorName
    // })

    return NextResponse.json(
      { 
        success: true,
        message: 'Nomination submitted successfully'
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Check if user is authenticated and has admin role
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData || !['admin', 'super_admin'].includes(userData.role)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get nominations with pagination
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const status = url.searchParams.get('status')
    
    const offset = (page - 1) * limit

    let query = supabase
      .from('nominations')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: nominations, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch nominations' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      nominations,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
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
