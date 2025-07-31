#!/usr/bin/env node

/**
 * Credential Validation Script for ICONS HERALD
 * 
 * This script validates all required API credentials and configurations
 * Run with: npm run validate:credentials
 */

require('dotenv').config({ path: '.env.local' })

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function log(color, symbol, message, details = '') {
  console.log(`${color}${symbol} ${message}${colors.reset}${details ? ` ${details}` : ''}`)
}

function logSuccess(message, details) {
  log(colors.green, '✅', message, details)
}

function logError(message, details) {
  log(colors.red, '❌', message, details)
}

function logWarning(message, details) {
  log(colors.yellow, '⚠️ ', message, details)
}

function logInfo(message, details) {
  log(colors.blue, 'ℹ️ ', message, details)
}

async function validateSupabase() {
  logInfo('Validating Supabase configuration...')
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url) {
    logError('NEXT_PUBLIC_SUPABASE_URL is missing')
    return false
  }
  
  if (!anonKey) {
    logError('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing')
    return false
  }
  
  if (!serviceKey) {
    logError('SUPABASE_SERVICE_ROLE_KEY is missing')
    return false
  }
  
  // Validate URL format
  if (!url.startsWith('https://') || !url.includes('.supabase.co')) {
    logError('NEXT_PUBLIC_SUPABASE_URL format is invalid', `Expected: https://xxx.supabase.co, Got: ${url}`)
    return false
  }
  
  // Validate key formats
  if (!anonKey.startsWith('eyJ')) {
    logError('NEXT_PUBLIC_SUPABASE_ANON_KEY format is invalid', 'Should start with "eyJ"')
    return false
  }
  
  if (!serviceKey.startsWith('eyJ')) {
    logError('SUPABASE_SERVICE_ROLE_KEY format is invalid', 'Should start with "eyJ"')
    return false
  }
  
  try {
    // Test connection
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(url, anonKey)
    
    // Simple query to test connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error && !error.message.includes('relation "profiles" does not exist')) {
      throw error
    }
    
    logSuccess('Supabase configuration is valid')
    return true
  } catch (error) {
    logError('Supabase connection test failed', error.message)
    return false
  }
}

async function validateClaude() {
  logInfo('Validating Claude AI configuration...')
  
  const apiKey = process.env.CLAUDE_API_KEY
  const featuresEnabled = process.env.AI_FEATURES_ENABLED
  
  if (!apiKey) {
    logError('CLAUDE_API_KEY is missing')
    return false
  }
  
  if (!apiKey.startsWith('sk-ant-api03-')) {
    logError('CLAUDE_API_KEY format is invalid', 'Should start with "sk-ant-api03-"')
    return false
  }
  
  if (featuresEnabled !== 'true') {
    logWarning('AI_FEATURES_ENABLED is not set to "true"', 'AI features may be disabled')
  }
  
  try {
    // Test API key validity
    const Anthropic = require('@anthropic-ai/sdk')
    const anthropic = new Anthropic({ apiKey })
    
    // Simple test request
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Hello' }]
    })
    
    if (response && response.content) {
      logSuccess('Claude AI configuration is valid')
      return true
    } else {
      throw new Error('Invalid response format')
    }
  } catch (error) {
    if (error.status === 401) {
      logError('Claude API key is invalid or expired')
    } else if (error.status === 429) {
      logWarning('Claude API rate limit reached', 'Key is valid but quota exceeded')
      return true
    } else {
      logError('Claude AI test failed', error.message)
    }
    return false
  }
}

async function validateRazorpay() {
  logInfo('Validating Razorpay configuration...')
  
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
  
  if (!keyId) {
    logError('NEXT_PUBLIC_RAZORPAY_KEY_ID is missing')
    return false
  }
  
  if (!keySecret) {
    logError('RAZORPAY_KEY_SECRET is missing')
    return false
  }
  
  if (!webhookSecret) {
    logWarning('RAZORPAY_WEBHOOK_SECRET is missing', 'Webhook verification will fail')
  }
  
  // Validate key formats
  if (!keyId.startsWith('rzp_test_') && !keyId.startsWith('rzp_live_')) {
    logError('NEXT_PUBLIC_RAZORPAY_KEY_ID format is invalid', 'Should start with "rzp_test_" or "rzp_live_"')
    return false
  }
  
  if (keyId.startsWith('rzp_live_')) {
    logInfo('Using Razorpay LIVE credentials', 'Ensure this is intended for production')
  } else {
    logInfo('Using Razorpay TEST credentials', 'Good for development')
  }
  
  try {
    // Test Razorpay credentials
    const Razorpay = require('razorpay')
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    })
    
    // Test by fetching payment methods (this doesn't create anything)
    await razorpay.payments.all({ count: 1 })
    
    logSuccess('Razorpay configuration is valid')
    return true
  } catch (error) {
    if (error.statusCode === 401) {
      logError('Razorpay credentials are invalid')
    } else {
      logError('Razorpay test failed', error.message)
    }
    return false
  }
}

function validateEnvironment() {
  logInfo('Validating environment configuration...')
  
  const nodeEnv = process.env.NODE_ENV
  const nextAuthUrl = process.env.NEXTAUTH_URL
  const nextAuthSecret = process.env.NEXTAUTH_SECRET
  
  let isValid = true
  
  if (!nodeEnv) {
    logWarning('NODE_ENV is not set', 'Defaulting to development')
  } else {
    logInfo(`Environment: ${nodeEnv}`)
  }
  
  if (!nextAuthUrl) {
    logError('NEXTAUTH_URL is missing')
    isValid = false
  } else if (nodeEnv === 'production' && !nextAuthUrl.startsWith('https://')) {
    logError('NEXTAUTH_URL must use HTTPS in production')
    isValid = false
  } else {
    logSuccess('NEXTAUTH_URL is configured')
  }
  
  if (!nextAuthSecret) {
    logError('NEXTAUTH_SECRET is missing')
    isValid = false
  } else if (nextAuthSecret.length < 32) {
    logWarning('NEXTAUTH_SECRET should be at least 32 characters long')
  } else {
    logSuccess('NEXTAUTH_SECRET is configured')
  }
  
  return isValid
}

async function main() {
  console.log(`${colors.bold}${colors.blue}🔍 ICONS HERALD - API Credentials Validation${colors.reset}\n`)
  
  const results = {
    supabase: false,
    claude: false,
    razorpay: false,
    environment: false
  }
  
  try {
    results.supabase = await validateSupabase()
    console.log()
    
    results.claude = await validateClaude()
    console.log()
    
    results.razorpay = await validateRazorpay()
    console.log()
    
    results.environment = validateEnvironment()
    console.log()
    
    // Summary
    const totalChecks = Object.keys(results).length
    const passedChecks = Object.values(results).filter(Boolean).length
    
    console.log(`${colors.bold}📊 Validation Summary:${colors.reset}`)
    console.log(`   Passed: ${passedChecks}/${totalChecks}`)
    
    if (passedChecks === totalChecks) {
      logSuccess('All credentials are properly configured! 🎉')
      process.exit(0)
    } else {
      logError(`${totalChecks - passedChecks} configuration(s) need attention`)
      process.exit(1)
    }
    
  } catch (error) {
    logError('Validation script failed', error.message)
    process.exit(1)
  }
}

// Run validation
if (require.main === module) {
  main()
}

module.exports = {
  validateSupabase,
  validateClaude,
  validateRazorpay,
  validateEnvironment
}
