# Payment Integration Documentation

## Overview

ICONS HERALD uses Razorpay as the payment gateway for processing profile publication payments. The integration includes order creation, payment verification, webhook handling, and automatic profile publishing.

## Architecture

### Components

1. **Frontend Payment Flow** (`/app/payment/page.tsx`)
   - Razorpay checkout integration
   - Payment success/failure handling
   - User experience optimization

2. **Backend API Routes**
   - `/api/payment/create-order` - Creates Razorpay orders
   - `/api/payment/verify` - Verifies payment signatures
   - `/api/payment/webhook` - Handles Razorpay webhooks

3. **Database Schema**
   - `payments` table with RLS policies
   - Profile status updates
   - Payment tracking

## Tier Pricing

| Tier | Price | Duration | Features |
|------|-------|----------|----------|
| Emerging | ₹2,500 | 1 year | Basic profile, AI bio polishing |
| Accomplished | ₹5,000 | 1 year | QR codes, timeline, 10 gallery photos |
| Distinguished | ₹12,000 | 1 year | Publications, metrics, 20 gallery photos |
| Legacy | ₹50,000 | Lifetime | Memorial service, unlimited gallery |

## Payment Flow

### 1. Order Creation

```typescript
// Frontend initiates payment
const response = await fetch('/api/payment/create-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ profileId, tier })
})
```

### 2. Razorpay Checkout

```typescript
const options = createPaymentOptions(
  order,
  userDetails,
  onPaymentSuccess,
  onPaymentDismiss
)
const razorpay = new window.Razorpay(options)
razorpay.open()
```

### 3. Payment Verification

```typescript
// Verify payment signature
const verifyResponse = await fetch('/api/payment/verify', {
  method: 'POST',
  body: JSON.stringify({
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature
  })
})
```

### 4. Profile Publishing

Upon successful payment verification:
- Payment status updated to 'captured'
- Profile status changed to 'published'
- User redirected to published profile

## Webhook Handling

### Supported Events

1. **payment.captured**
   - Updates payment status
   - Publishes profile
   - Sends confirmation

2. **payment.failed**
   - Updates payment status to failed
   - Logs failure reason

3. **order.paid**
   - Additional order-level processing

### Security

- Webhook signature verification using HMAC SHA256
- Environment-based secret validation
- Service role authentication for database updates

## Environment Variables

```env
# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

## Database Schema

### Payments Table

```sql
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  profile_id UUID REFERENCES profiles(id) NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  status payment_status DEFAULT 'created',
  tier profile_tier NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### RLS Policies

- Users can view/create their own payments
- System can update payment status
- Admins can view all payments

## Error Handling

### Common Scenarios

1. **Invalid Signature**
   - Returns 400 with error message
   - Logs security incident

2. **Payment Not Found**
   - Returns 404 with appropriate message
   - Prevents unauthorized access

3. **Database Errors**
   - Returns 500 with generic message
   - Logs detailed error for debugging

## Testing

### Unit Tests

- Payment signature verification
- Tier pricing validation
- Webhook event handling
- Order creation validation

### Integration Tests

- End-to-end payment flow
- Database transaction integrity
- RLS policy enforcement

## Monitoring

### Key Metrics

- Payment success rate
- Average payment processing time
- Failed payment reasons
- Webhook delivery success

### Logging

- All payment events logged
- Webhook processing tracked
- Error details captured for debugging

## Security Considerations

1. **PCI Compliance**
   - No card data stored locally
   - Razorpay handles sensitive data

2. **Signature Verification**
   - All payments verified server-side
   - Webhook signatures validated

3. **Access Control**
   - RLS policies enforce data isolation
   - User authentication required

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Webhook URL registered with Razorpay
- [ ] Database migrations applied
- [ ] SSL certificate installed
- [ ] Payment flow tested end-to-end
- [ ] Webhook delivery tested
- [ ] Error handling verified
- [ ] Monitoring configured

## Support

For payment-related issues:
1. Check Razorpay dashboard for transaction details
2. Review application logs for errors
3. Verify webhook delivery status
4. Contact Razorpay support if needed

## API Reference

### Create Order

**POST** `/api/payment/create-order`

**Request:**
```json
{
  "profileId": "uuid",
  "tier": "emerging|accomplished|distinguished|legacy"
}
```

**Response:**
```json
{
  "order": {
    "id": "order_xxx",
    "amount": 250000,
    "currency": "INR"
  },
  "payment": {
    "id": "uuid",
    "status": "created"
  }
}
```

### Verify Payment

**POST** `/api/payment/verify`

**Request:**
```json
{
  "razorpay_payment_id": "pay_xxx",
  "razorpay_order_id": "order_xxx",
  "razorpay_signature": "signature_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified and profile published successfully"
}
```
