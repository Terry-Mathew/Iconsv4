import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

/**
 * Creates a Supabase client for browser/client-side operations
 * Includes robust environment variable validation and error handling
 *
 * @returns Configured Supabase client for browser use
 * @throws Error if required environment variables are missing
 */
export const createClient = () => {
  // Get environment variables with fallback handling
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Validate required environment variables
  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set in environment variables')
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL. Please add it to your .env.local file.')
  }

  if (!supabaseAnonKey) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in environment variables')
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Please add it to your .env.local file.')
  }

  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch {
    console.error('❌ Invalid NEXT_PUBLIC_SUPABASE_URL format:', supabaseUrl)
    throw new Error('Invalid NEXT_PUBLIC_SUPABASE_URL format. Please check your .env.local file.')
  }

  console.log('✅ Supabase client initialized successfully')
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}
