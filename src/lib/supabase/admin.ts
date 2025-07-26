import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

/**
 * Creates a Supabase client with service role key for admin operations
 * This client bypasses RLS (Row Level Security) and should only be used server-side
 * 
 * @returns Configured Supabase admin client
 * @throws Error if required environment variables are missing
 */
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Validate required environment variables
  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set for admin client')
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL. Please add it to your .env.local file.')
  }

  if (!supabaseServiceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set for admin client')
    throw new Error(`
      Missing SUPABASE_SERVICE_ROLE_KEY. Please follow these steps:
      
      1. Go to your Supabase Dashboard: https://supabase.com/dashboard
      2. Select your project: Icons Herald
      3. Go to Settings > API
      4. Copy the 'service_role' key (NOT the anon key)
      5. Add to your .env.local file:
         SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
      
      ⚠️  WARNING: Never expose the service role key in client-side code!
    `)
  }

  // Validate URL format
  try {
    new URL(supabaseUrl)
  } catch {
    console.error('❌ Invalid NEXT_PUBLIC_SUPABASE_URL format for admin client:', supabaseUrl)
    throw new Error('Invalid NEXT_PUBLIC_SUPABASE_URL format. Please check your .env.local file.')
  }

  console.log('✅ Supabase admin client initialized successfully')
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * Helper function to check if admin operations are available
 * @returns boolean indicating if service role key is configured
 */
export const isAdminAvailable = (): boolean => {
  return !!(process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL)
}
