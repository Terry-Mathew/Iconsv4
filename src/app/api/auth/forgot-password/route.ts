import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_ATTEMPTS = 3

interface RecaptchaResponse {
  success: boolean
  score?: number
  action?: string
  'error-codes'?: string[]
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY
    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY not configured')
      return false
    }

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}`
    })

    const data: RecaptchaResponse = await response.json()
    
    // For reCAPTCHA v3, check score (0.0 to 1.0, higher is more likely human)
    if (data.success && data.score !== undefined) {
      return data.score >= 0.5 // Adjust threshold as needed
    }
    
    // For reCAPTCHA v2, just check success
    return data.success
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return false
  }
}

function checkRateLimit(identifier: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitStore.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return { allowed: true }
  }

  if (record.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return { allowed: false, resetTime: record.resetTime }
  }

  record.count++
  return { allowed: true }
}

export async function POST(request: NextRequest) {
  try {
    const { email, recaptchaToken } = await request.json()

    if (!email || !recaptchaToken) {
      return NextResponse.json(
        { error: 'Email and reCAPTCHA token required' },
        { status: 400 }
      )
    }

    // Verify reCAPTCHA
    const recaptchaValid = await verifyRecaptcha(recaptchaToken)
    if (!recaptchaValid) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed' },
        { status: 400 }
      )
    }

    // Rate limiting by IP and email
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown'
    const ipLimit = checkRateLimit(`ip:${clientIP}`)
    const emailLimit = checkRateLimit(`email:${email}`)

    if (!ipLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many requests from this IP',
          resetTime: ipLimit.resetTime
        },
        { status: 429 }
      )
    }

    if (!emailLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many requests for this email',
          resetTime: emailLimit.resetTime
        },
        { status: 429 }
      )
    }

    const supabase = createClient()

    // Check if user exists (prevent email enumeration by always returning success)
    const { data: user } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('email', email.toLowerCase())
      .single()

    // Always return success to prevent email enumeration
    // But only send email if user actually exists
    if (user) {
      // Send password reset email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`
      })

      if (resetError) {
        console.error('Password reset error:', resetError)
        // Still return success to prevent enumeration
      } else {
        // Log password reset request
        await supabase
          .from('audit_logs')
          .insert({
            user_id: user.id,
            action: 'password_reset_requested',
            details: {
              email: user.email,
              ip_address: clientIP,
              user_agent: request.headers.get('user-agent') || 'unknown'
            },
            ip_address: clientIP,
            user_agent: request.headers.get('user-agent') || 'unknown'
          })
      }
    }

    // Always return success message
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Cleanup expired rate limit entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000) // Clean up every 5 minutes
