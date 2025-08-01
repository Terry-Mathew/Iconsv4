/**
 * Environment Variable Type Definitions for ICONS HERALD
 * 
 * This file provides TypeScript type safety for all environment variables
 * used throughout the application.
 */

declare namespace NodeJS {
  interface ProcessEnv {
    // ===== SUPABASE CONFIGURATION =====
    /** Supabase project URL (public) */
    NEXT_PUBLIC_SUPABASE_URL: string
    
    /** Supabase anonymous key for client-side access (public) */
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    
    /** Supabase service role key for admin operations (private) */
    SUPABASE_SERVICE_ROLE_KEY: string
    
    /** Supabase project ID for type generation */
    NEXT_PUBLIC_SUPABASE_PROJECT_ID?: string

    // ===== CLAUDE AI CONFIGURATION =====
    /** Claude API key for AI bio polishing (private) */
    CLAUDE_API_KEY: string
    
    /** Enable/disable AI features */
    AI_FEATURES_ENABLED: string
    
    /** AI rate limiting - requests per window */
    AI_RATE_LIMIT_REQUESTS?: string
    
    /** AI rate limiting - time window */
    AI_RATE_LIMIT_WINDOW?: string

    // ===== RAZORPAY CONFIGURATION =====
    /** Razorpay key ID for payment processing (public) */
    NEXT_PUBLIC_RAZORPAY_KEY_ID: string
    
    /** Razorpay key secret for server-side operations (private) */
    RAZORPAY_KEY_SECRET: string
    
    /** Razorpay webhook secret for signature verification (private) */
    RAZORPAY_WEBHOOK_SECRET: string

    // ===== APPLICATION CONFIGURATION =====
    /** Application URL for authentication callbacks */
    NEXTAUTH_URL: string
    
    /** Secret for NextAuth.js session encryption */
    NEXTAUTH_SECRET: string
    
    /** Node.js environment */
    NODE_ENV: 'development' | 'production' | 'test'
    
    /** Application encryption key for sensitive data */
    ENCRYPTION_KEY?: string

    // ===== EMAIL CONFIGURATION (OPTIONAL) =====
    /** SMTP server hostname */
    SMTP_HOST?: string
    
    /** SMTP server port */
    SMTP_PORT?: string
    
    /** SMTP authentication username */
    SMTP_USER?: string
    
    /** SMTP authentication password */
    SMTP_PASS?: string
    
    /** Default sender email address */
    FROM_EMAIL?: string
    
    /** Email service provider (sendgrid, mailgun, etc.) */
    EMAIL_PROVIDER?: string

    // ===== ANALYTICS & MONITORING (OPTIONAL) =====
    /** Google Analytics measurement ID */
    NEXT_PUBLIC_GA_MEASUREMENT_ID?: string
    
    /** Sentry DSN for error tracking */
    SENTRY_DSN?: string
    
    /** LogRocket app ID for session recording */
    LOGROCKET_APP_ID?: string

    // ===== SECURITY & RATE LIMITING =====
    /** Rate limiting - requests per window */
    RATE_LIMIT_REQUESTS?: string
    
    /** Rate limiting - time window */
    RATE_LIMIT_WINDOW?: string
    
    /** CORS allowed origins */
    CORS_ORIGINS?: string
    
    /** JWT secret for custom tokens */
    JWT_SECRET?: string

    // ===== STORAGE & CDN (OPTIONAL) =====
    /** AWS S3 bucket name */
    AWS_S3_BUCKET?: string
    
    /** AWS access key ID */
    AWS_ACCESS_KEY_ID?: string
    
    /** AWS secret access key */
    AWS_SECRET_ACCESS_KEY?: string
    
    /** AWS region */
    AWS_REGION?: string
    
    /** CloudFront distribution ID */
    CLOUDFRONT_DISTRIBUTION_ID?: string

    // ===== DEVELOPMENT & TESTING =====
    /** Enable debug logging */
    DEBUG?: string
    
    /** Test database URL */
    TEST_DATABASE_URL?: string
    
    /** Mock external APIs in development */
    MOCK_EXTERNAL_APIS?: string
    
    /** Playwright test configuration */
    PLAYWRIGHT_TEST_BASE_URL?: string

    // ===== FEATURE FLAGS =====
    /** Enable beta features */
    ENABLE_BETA_FEATURES?: string
    
    /** Enable admin impersonation */
    ENABLE_ADMIN_IMPERSONATION?: string
    
    /** Enable profile analytics */
    ENABLE_PROFILE_ANALYTICS?: string
    
    /** Enable advanced search */
    ENABLE_ADVANCED_SEARCH?: string

    // ===== THIRD-PARTY INTEGRATIONS (OPTIONAL) =====
    /** LinkedIn API credentials */
    LINKEDIN_CLIENT_ID?: string
    LINKEDIN_CLIENT_SECRET?: string
    
    /** Twitter API credentials */
    TWITTER_API_KEY?: string
    TWITTER_API_SECRET?: string
    
    /** GitHub API token */
    GITHUB_TOKEN?: string
    
    /** Slack webhook URL for notifications */
    SLACK_WEBHOOK_URL?: string

    // ===== PERFORMANCE & CACHING =====
    /** Redis connection URL */
    REDIS_URL?: string
    
    /** Cache TTL in seconds */
    CACHE_TTL?: string
    
    /** Enable ISR (Incremental Static Regeneration) */
    ENABLE_ISR?: string
    
    /** ISR revalidation interval */
    ISR_REVALIDATE_INTERVAL?: string
  }
}

// ===== UTILITY TYPES =====

/** Environment variable validation schema */
export interface EnvironmentConfig {
  required: {
    supabase: {
      url: string
      anonKey: string
      serviceRoleKey: string
    }
    claude: {
      apiKey: string
      featuresEnabled: boolean
    }
    razorpay: {
      keyId: string
      keySecret: string
      webhookSecret: string
    }
    app: {
      url: string
      secret: string
      nodeEnv: string
    }
  }
  optional: {
    email?: {
      host: string
      port: number
      user: string
      pass: string
      from: string
    }
    analytics?: {
      gaId: string
      sentryDsn: string
    }
    features?: {
      betaFeatures: boolean
      adminImpersonation: boolean
      profileAnalytics: boolean
    }
  }
}

/** Environment validation result */
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  config: Partial<EnvironmentConfig>
}

// ===== CONSTANTS =====

/** Required environment variables for basic functionality */
export const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'CLAUDE_API_KEY',
  'NEXT_PUBLIC_RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET'
] as const

/** Optional environment variables that enhance functionality */
export const OPTIONAL_ENV_VARS = [
  'RAZORPAY_WEBHOOK_SECRET',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'FROM_EMAIL',
  'NEXT_PUBLIC_GA_MEASUREMENT_ID',
  'SENTRY_DSN',
  'AI_RATE_LIMIT_REQUESTS',
  'AI_RATE_LIMIT_WINDOW'
] as const

/** Environment-specific variable prefixes */
export const ENV_PREFIXES = {
  PUBLIC: 'NEXT_PUBLIC_',
  PRIVATE: '',
  SUPABASE: 'SUPABASE_',
  CLAUDE: 'CLAUDE_',
  RAZORPAY: 'RAZORPAY_',
  EMAIL: 'SMTP_',
  ANALYTICS: 'GA_'
} as const

// ===== TYPE GUARDS =====

/** Check if running in development environment */
export const isDevelopment = (): boolean => process.env.NODE_ENV === 'development'

/** Check if running in production environment */
export const isProduction = (): boolean => process.env.NODE_ENV === 'production'

/** Check if running in test environment */
export const isTest = (): boolean => process.env.NODE_ENV === 'test'

/** Check if AI features are enabled */
export const isAIEnabled = (): boolean => process.env.AI_FEATURES_ENABLED === 'true'

/** Check if using Razorpay live credentials */
export const isRazorpayLive = (): boolean => 
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith('rzp_live_') ?? false

/** Check if email configuration is available */
export const isEmailConfigured = (): boolean => 
  !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)

// ===== EXPORT TYPES =====
export type RequiredEnvVar = typeof REQUIRED_ENV_VARS[number]
export type OptionalEnvVar = typeof OPTIONAL_ENV_VARS[number]
export type EnvPrefix = typeof ENV_PREFIXES[keyof typeof ENV_PREFIXES]
