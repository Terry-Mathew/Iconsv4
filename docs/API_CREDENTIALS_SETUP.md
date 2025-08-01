# API Credentials Configuration Guide

## Overview

This guide provides exact locations and setup instructions for all third-party API credentials required for ICONS HERALD production deployment.

## Required Environment Variables

### Complete Environment Variables List

Create these files with the following variables:

#### Development (`.env.local`)
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Claude AI Configuration
CLAUDE_API_KEY=your_claude_api_key_here
AI_FEATURES_ENABLED=true

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Application Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
NODE_ENV=development

# Email Configuration (Optional)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
FROM_EMAIL=noreply@iconsherald.com

# Rate Limiting
AI_RATE_LIMIT_REQUESTS=5
AI_RATE_LIMIT_WINDOW=1h

# Security
ENCRYPTION_KEY=your_32_character_encryption_key
```

#### Production (Environment Variables in Hosting Platform)
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Claude AI Configuration
CLAUDE_API_KEY=sk-ant-api03-...
AI_FEATURES_ENABLED=true

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=your_live_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Application Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_production_secret_here
NODE_ENV=production

# Email Configuration
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your_production_email
SMTP_PASS=your_production_password
FROM_EMAIL=noreply@your-domain.com

# Rate Limiting
AI_RATE_LIMIT_REQUESTS=10
AI_RATE_LIMIT_WINDOW=1h

# Security
ENCRYPTION_KEY=your_production_32_char_key
```

## Credential Setup Instructions

### 1. Claude AI Configuration

#### Where to Configure:
- **File**: `.env.local` (development) or hosting platform environment variables (production)
- **Variable**: `CLAUDE_API_KEY`

#### How to Obtain:
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up/login to your account
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the key (starts with `sk-ant-api03-`)

#### Usage in Code:
- **Primary file**: `src/lib/ai/claude.ts`
- **API route**: `src/app/api/ai/polish-bio/route.ts`
- **Validation**: `src/lib/ai/claude.ts` - `validateClaudeSetup()`

#### Security Notes:
- ⚠️ **NEVER** expose this key client-side
- ✅ Only used in API routes and server-side functions
- ✅ Validated before each API call

### 2. Razorpay Configuration

#### Where to Configure:
Three separate credentials needed:

##### A. Razorpay Key ID (Public)
- **File**: `.env.local` or environment variables
- **Variable**: `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- **Usage**: Client-side payment initialization
- **Security**: Safe to expose (public key)

##### B. Razorpay Key Secret (Private)
- **File**: `.env.local` or environment variables
- **Variable**: `RAZORPAY_KEY_SECRET`
- **Usage**: Server-side payment verification
- **Security**: ⚠️ **NEVER** expose client-side

##### C. Razorpay Webhook Secret (Private)
- **File**: `.env.local` or environment variables
- **Variable**: `RAZORPAY_WEBHOOK_SECRET`
- **Usage**: Webhook signature verification
- **Security**: ⚠️ **NEVER** expose client-side

#### How to Obtain:
1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up/login to your account
3. Navigate to "Settings" → "API Keys"
4. Generate/download your Key ID and Key Secret
5. For webhook secret:
   - Go to "Settings" → "Webhooks"
   - Create a new webhook endpoint
   - Set URL to: `https://your-domain.com/api/payment/webhook`
   - Generate webhook secret

#### Usage in Code:
- **Payment creation**: `src/app/api/payment/create-order/route.ts`
- **Payment verification**: `src/app/api/payment/verify/route.ts`
- **Webhook handling**: `src/app/api/payment/webhook/route.ts`
- **Client integration**: `src/app/payment/page.tsx`
- **Utility functions**: `src/lib/razorpay.ts`

### 3. Supabase Configuration

#### Where to Configure:
Three credentials needed:

##### A. Supabase URL (Public)
- **Variable**: `NEXT_PUBLIC_SUPABASE_URL`
- **Usage**: Client and server connections
- **Security**: Safe to expose

##### B. Supabase Anon Key (Public)
- **Variable**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Usage**: Client-side database access with RLS
- **Security**: Safe to expose (protected by RLS)

##### C. Supabase Service Role Key (Private)
- **Variable**: `SUPABASE_SERVICE_ROLE_KEY`
- **Usage**: Server-side admin operations
- **Security**: ⚠️ **NEVER** expose client-side

#### How to Obtain:
1. Visit [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to "Settings" → "API"
4. Copy the Project URL and API keys

#### Usage in Code:
- **Client setup**: `src/lib/supabase/client.ts`
- **Server setup**: `src/lib/supabase/server.ts`
- **Admin operations**: `src/lib/supabase/admin.ts`

## File Locations Summary

### Environment Files:
```
├── .env.local                    # Development environment variables
├── .env.example                  # Template with all required variables
└── .env.production              # Production template (not committed)
```

### Configuration Files:
```
├── src/lib/ai/claude.ts         # Claude AI integration
├── src/lib/razorpay.ts          # Razorpay payment integration
├── src/lib/supabase/client.ts   # Supabase client configuration
├── src/lib/supabase/server.ts   # Supabase server configuration
└── src/lib/supabase/admin.ts    # Supabase admin operations
```

### API Routes Using Credentials:
```
├── src/app/api/ai/polish-bio/route.ts      # Uses CLAUDE_API_KEY
├── src/app/api/payment/create-order/route.ts # Uses Razorpay credentials
├── src/app/api/payment/verify/route.ts     # Uses Razorpay credentials
├── src/app/api/payment/webhook/route.ts    # Uses Razorpay webhook secret
└── src/app/api/admin/*/route.ts            # Uses Supabase service role
```

## Security Best Practices

### 1. Environment Variable Security
- ✅ Use different credentials for development/staging/production
- ✅ Never commit `.env.local` or `.env.production` to version control
- ✅ Use hosting platform's secure environment variable storage
- ✅ Rotate credentials regularly

### 2. Public vs Private Keys
- ✅ **Public keys** (NEXT_PUBLIC_*): Safe for client-side use
- ⚠️ **Private keys**: Server-side only, never expose to client

### 3. Credential Validation
- ✅ Validate all credentials on application startup
- ✅ Implement graceful fallbacks for missing credentials
- ✅ Log credential validation status (without exposing values)

## Verification Steps

### 1. Claude AI Integration Test
```bash
# Test Claude API connection
curl -X POST http://localhost:3000/api/ai/polish-bio \
  -H "Content-Type: application/json" \
  -d '{"bio": "Test bio", "tone": "professional", "tier": "accomplished"}'
```

### 2. Razorpay Integration Test
```bash
# Test payment order creation
curl -X POST http://localhost:3000/api/payment/create-order \
  -H "Content-Type: application/json" \
  -d '{"profileId": "test-id", "tier": "emerging"}'
```

### 3. Supabase Connection Test
```bash
# Test database connection
curl -X GET http://localhost:3000/api/health/database
```

## Deployment Platform Setup

### Vercel
1. Go to your project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add all production environment variables
4. Ensure "Production" environment is selected

### Netlify
1. Go to "Site settings" → "Environment variables"
2. Add all production environment variables
3. Deploy with new environment variables

### Railway/Render
1. Navigate to your project settings
2. Add environment variables in the "Variables" section
3. Redeploy the application

## Troubleshooting

### Common Issues:

1. **Claude API 401 Unauthorized**
   - Check `CLAUDE_API_KEY` is correctly set
   - Verify API key is valid and not expired

2. **Razorpay Payment Failures**
   - Ensure `NEXT_PUBLIC_RAZORPAY_KEY_ID` matches your account
   - Verify `RAZORPAY_KEY_SECRET` is the corresponding secret
   - Check webhook URL is correctly configured

3. **Supabase Connection Issues**
   - Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
   - Check RLS policies are properly configured
   - Ensure service role key has necessary permissions

### Debug Commands:
```bash
# Check environment variables are loaded
npm run env:check

# Test all integrations
npm run test:integrations

# Validate credentials
npm run validate:credentials
```

## Production Checklist

- [ ] All environment variables configured in hosting platform
- [ ] Razorpay webhook URL updated to production domain
- [ ] Claude API key has sufficient credits/quota
- [ ] Supabase project is in production mode
- [ ] SSL certificates are properly configured
- [ ] All API endpoints return expected responses
- [ ] Payment flow tested end-to-end
- [ ] AI bio polishing tested with real requests
- [ ] Database migrations applied
- [ ] RLS policies tested and verified

## Additional Configuration Files

### 1. Create Validation Scripts

Create `scripts/validate-credentials.js`:
```javascript
const { createClient } = require('@supabase/supabase-js')
const Anthropic = require('@anthropic-ai/sdk')

async function validateCredentials() {
  console.log('🔍 Validating API credentials...\n')

  // Validate Supabase
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    console.log('✅ Supabase connection: OK')
  } catch (error) {
    console.log('❌ Supabase connection: FAILED', error.message)
  }

  // Validate Claude AI
  try {
    const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY })
    console.log('✅ Claude AI key: OK')
  } catch (error) {
    console.log('❌ Claude AI key: FAILED', error.message)
  }

  // Validate Razorpay
  try {
    const razorpay = require('razorpay')({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })
    console.log('✅ Razorpay credentials: OK')
  } catch (error) {
    console.log('❌ Razorpay credentials: FAILED', error.message)
  }
}

validateCredentials()
```

### 2. Update package.json Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "validate:credentials": "node scripts/validate-credentials.js",
    "env:check": "node -e \"console.log(Object.keys(process.env).filter(k => k.includes('SUPABASE') || k.includes('CLAUDE') || k.includes('RAZORPAY')))\"",
    "test:integrations": "npm run validate:credentials && npm test -- --testPathPattern=integration"
  }
}
```

### 3. Environment Variable Types

Create `types/env.d.ts`:
```typescript
declare namespace NodeJS {
  interface ProcessEnv {
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    SUPABASE_SERVICE_ROLE_KEY: string

    // Claude AI
    CLAUDE_API_KEY: string
    AI_FEATURES_ENABLED: string

    // Razorpay
    NEXT_PUBLIC_RAZORPAY_KEY_ID: string
    RAZORPAY_KEY_SECRET: string
    RAZORPAY_WEBHOOK_SECRET: string

    // Application
    NEXTAUTH_URL: string
    NEXTAUTH_SECRET: string
    NODE_ENV: 'development' | 'production' | 'test'

    // Optional
    SMTP_HOST?: string
    SMTP_PORT?: string
    SMTP_USER?: string
    SMTP_PASS?: string
    FROM_EMAIL?: string
  }
}
```
