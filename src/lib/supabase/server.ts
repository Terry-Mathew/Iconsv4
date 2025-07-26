import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

/**
 * Creates a Supabase client for server-side operations
 * Includes cookie handling for authentication state persistence
 *
 * @returns Configured Supabase client for server use
 * @throws Error if required environment variables are missing
 */
export const createServerClient = async () => {
  const cookieStore = await cookies()

  // Get environment variables with validation
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Validate required environment variables
  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set in server environment')
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL. Please add it to your .env.local file.')
  }

  if (!supabaseAnonKey) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in server environment')
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Please add it to your .env.local file.')
  }

  console.log('✅ Supabase server client initialized successfully')

  return createSupabaseServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

/**
 * Creates a public Supabase client for server-side operations that don't require authentication
 * Use this for public data like published profiles
 */
export const createPublicServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createSupabaseServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {
          // No-op for public client
        },
      },
    }
  )
}

// Export alias for backward compatibility
export const createClient = createServerClient
