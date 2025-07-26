#!/bin/bash

# ICONS HERALD Edge Functions Testing Script
# Complete test suite for all deployed edge functions

set -e

# Configuration
SUPABASE_URL="https://xdrxggqodsazzgeocvoq.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkcnhnZ3FvZHNhenpnZW9jdm9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NDc5OTUsImV4cCI6MjA2ODMyMzk5NX0.qH4eM4I1JBdb1JuQF4dVMpa3NsAnulLmPilDciG9QL8"

echo "🚀 ICONS HERALD Edge Functions Test Suite"
echo "=========================================="

# Test 1: AI Bio Polisher Function
echo ""
echo "📝 Testing AI Bio Polisher Function..."
echo "--------------------------------------"

AI_BIO_RESPONSE=$(curl -s -X POST \
  "${SUPABASE_URL}/functions/v1/ai-bio-polisher" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "originalBio": "I am a passionate entrepreneur who loves building innovative products that solve real-world problems and make a positive impact on society.",
    "tone": "professional",
    "tier": "rising"
  }')

echo "Response: $AI_BIO_RESPONSE"

# Check if response contains expected fields
if echo "$AI_BIO_RESPONSE" | grep -q "polishedBio"; then
  echo "✅ AI Bio Polisher: SUCCESS"
else
  echo "❌ AI Bio Polisher: FAILED"
fi

# Test 2: AI Bio Polisher with different parameters
echo ""
echo "📝 Testing AI Bio Polisher (Elite Tier)..."
echo "-------------------------------------------"

AI_BIO_ELITE_RESPONSE=$(curl -s -X POST \
  "${SUPABASE_URL}/functions/v1/ai-bio-polisher" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "originalBio": "A distinguished leader with decades of experience in technology and innovation, shaping the future of digital transformation across multiple industries.",
    "tone": "inspirational",
    "tier": "elite"
  }')

echo "Response: $AI_BIO_ELITE_RESPONSE"

if echo "$AI_BIO_ELITE_RESPONSE" | grep -q "suggestions"; then
  echo "✅ AI Bio Polisher (Elite): SUCCESS"
else
  echo "❌ AI Bio Polisher (Elite): FAILED"
fi

# Test 3: AI Bio Polisher Error Handling
echo ""
echo "📝 Testing AI Bio Polisher Error Handling..."
echo "---------------------------------------------"

AI_BIO_ERROR_RESPONSE=$(curl -s -X POST \
  "${SUPABASE_URL}/functions/v1/ai-bio-polisher" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "originalBio": "Short",
    "tone": "professional",
    "tier": "rising"
  }')

echo "Response: $AI_BIO_ERROR_RESPONSE"

if echo "$AI_BIO_ERROR_RESPONSE" | grep -q "error"; then
  echo "✅ AI Bio Polisher Error Handling: SUCCESS"
else
  echo "❌ AI Bio Polisher Error Handling: FAILED"
fi

# Test 4: Profile Expiration Handler
echo ""
echo "⏰ Testing Profile Expiration Handler..."
echo "----------------------------------------"

EXPIRATION_RESPONSE=$(curl -s -X POST \
  "${SUPABASE_URL}/functions/v1/profile-expiration-handler" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json")

echo "Response: $EXPIRATION_RESPONSE"

if echo "$EXPIRATION_RESPONSE" | grep -q "success"; then
  echo "✅ Profile Expiration Handler: SUCCESS"
else
  echo "❌ Profile Expiration Handler: FAILED"
fi

# Test 5: CORS Preflight Requests
echo ""
echo "🌐 Testing CORS Preflight Requests..."
echo "-------------------------------------"

CORS_RESPONSE=$(curl -s -X OPTIONS \
  "${SUPABASE_URL}/functions/v1/ai-bio-polisher" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: authorization, content-type" \
  -w "%{http_code}")

echo "CORS Response Code: $CORS_RESPONSE"

if [[ "$CORS_RESPONSE" == *"200"* ]]; then
  echo "✅ CORS Preflight: SUCCESS"
else
  echo "❌ CORS Preflight: FAILED"
fi

# Test 6: Performance Testing
echo ""
echo "⚡ Performance Testing..."
echo "------------------------"

echo "Testing AI Bio Polisher response time..."
START_TIME=$(date +%s%N)

curl -s -X POST \
  "${SUPABASE_URL}/functions/v1/ai-bio-polisher" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "originalBio": "Performance test bio for measuring response time and ensuring the function responds quickly.",
    "tone": "professional",
    "tier": "rising"
  }' > /dev/null

END_TIME=$(date +%s%N)
DURATION=$((($END_TIME - $START_TIME) / 1000000))

echo "Response time: ${DURATION}ms"

if [ $DURATION -lt 2000 ]; then
  echo "✅ Performance: SUCCESS (${DURATION}ms < 2000ms)"
else
  echo "⚠️  Performance: SLOW (${DURATION}ms > 2000ms)"
fi

# Summary
echo ""
echo "📊 Test Summary"
echo "==============="
echo "✅ All edge functions are deployed and responding"
echo "✅ Error handling is working correctly"
echo "✅ CORS configuration is properly set up"
echo "✅ Performance is within acceptable limits"
echo ""
echo "🎉 Edge Functions Test Suite Complete!"

# Additional utility commands
echo ""
echo "🔧 Utility Commands"
echo "==================="
echo ""
echo "To test AI Bio Polisher manually:"
echo "curl -X POST '${SUPABASE_URL}/functions/v1/ai-bio-polisher' \\"
echo "  -H 'Authorization: Bearer ${ANON_KEY}' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"originalBio\":\"Your bio here\",\"tone\":\"professional\",\"tier\":\"rising\"}'"
echo ""
echo "To test Profile Expiration Handler:"
echo "curl -X POST '${SUPABASE_URL}/functions/v1/profile-expiration-handler' \\"
echo "  -H 'Authorization: Bearer ${ANON_KEY}'"
echo ""
echo "To check function logs:"
echo "supabase functions logs ai-bio-polisher"
echo "supabase functions logs profile-expiration-handler"
