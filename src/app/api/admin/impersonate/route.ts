import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const IMPERSONATION_DURATION = 15 * 60 * 1000 // 15 minutes

interface ImpersonationToken {
  originalUserId: string
  targetUserId: string
  iat: number
  exp: number
}

// Store active impersonation sessions (in production, use Redis)
const activeSessions = new Map<string, ImpersonationToken>()

export async function POST(request: NextRequest) {
  try {
    const { targetUserId } = await request.json()

    if (!targetUserId) {
      return NextResponse.json({ error: 'Target user ID required' }, { status: 400 })
    }

    // Get current user from Supabase
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify super-admin role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || userData?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Verify target user exists
    const { data: targetUser, error: targetError } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('id', targetUserId)
      .single()

    if (targetError || !targetUser) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 })
    }

    // Prevent impersonating other super-admins
    if (targetUser.role === 'super_admin') {
      return NextResponse.json({ error: 'Cannot impersonate super-admin' }, { status: 403 })
    }

    // Create impersonation token
    const expiresAt = new Date(Date.now() + IMPERSONATION_DURATION)
    const tokenPayload: ImpersonationToken = {
      originalUserId: user.id,
      targetUserId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(expiresAt.getTime() / 1000)
    }

    const sessionToken = jwt.sign(tokenPayload, JWT_SECRET)

    // Store session
    activeSessions.set(sessionToken, tokenPayload)

    // Log impersonation start
    await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'impersonation_start',
        details: {
          target_user_id: targetUserId,
          target_email: targetUser.email,
          session_token: sessionToken.substring(0, 10) + '...' // Partial token for logging
        },
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      })

    return NextResponse.json({
      sessionToken,
      expiresAt: expiresAt.toISOString(),
      targetUser: {
        id: targetUser.id,
        email: targetUser.email,
        role: targetUser.role
      }
    })

  } catch (error) {
    console.error('Impersonation start error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Invalid authorization header' }, { status: 401 })
    }

    const sessionToken = authHeader.substring(7)

    // Verify and decode token
    let tokenPayload: ImpersonationToken
    try {
      tokenPayload = jwt.verify(sessionToken, JWT_SECRET) as ImpersonationToken
    } catch (error) {
      return NextResponse.json({ error: 'Invalid session token' }, { status: 401 })
    }

    // Remove from active sessions
    activeSessions.delete(sessionToken)

    // Log impersonation end
    const supabase = createClient()
    await supabase
      .from('audit_logs')
      .insert({
        user_id: tokenPayload.originalUserId,
        action: 'impersonation_end',
        details: {
          target_user_id: tokenPayload.targetUserId,
          session_token: sessionToken.substring(0, 10) + '...'
        },
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Impersonation end error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Invalid authorization header' }, { status: 401 })
    }

    const sessionToken = authHeader.substring(7)

    // Verify token
    let tokenPayload: ImpersonationToken
    try {
      tokenPayload = jwt.verify(sessionToken, JWT_SECRET) as ImpersonationToken
    } catch (error) {
      return NextResponse.json({ error: 'Invalid session token' }, { status: 401 })
    }

    // Check if session is still active
    if (!activeSessions.has(sessionToken)) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Check expiration
    if (Date.now() > tokenPayload.exp * 1000) {
      activeSessions.delete(sessionToken)
      return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }

    return NextResponse.json({
      valid: true,
      originalUserId: tokenPayload.originalUserId,
      targetUserId: tokenPayload.targetUserId,
      expiresAt: new Date(tokenPayload.exp * 1000).toISOString()
    })

  } catch (error) {
    console.error('Impersonation verify error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
