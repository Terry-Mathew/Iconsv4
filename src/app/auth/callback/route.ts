import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/types/supabase'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Get the user and update their role if needed
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if user exists in our users table
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (!existingUser) {
          // Create user record if it doesn't exist
          await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email!,
              role: 'visitor',
            })
        }
      }
      
      return NextResponse.redirect(requestUrl.origin)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
}
