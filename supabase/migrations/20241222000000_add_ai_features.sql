-- Add AI usage tracking table
CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feature TEXT NOT NULL CHECK (feature IN ('bio_polish', 'bio_suggestions', 'content_optimization')),
  input_length INTEGER NOT NULL DEFAULT 0,
  output_length INTEGER NOT NULL DEFAULT 0,
  tier TEXT CHECK (tier IN ('rising', 'elite', 'legacy')),
  tone TEXT CHECK (tone IN ('professional', 'casual', 'formal')),
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS ai_usage_logs_user_id_idx ON ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS ai_usage_logs_feature_idx ON ai_usage_logs(feature);
CREATE INDEX IF NOT EXISTS ai_usage_logs_created_at_idx ON ai_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS ai_usage_logs_user_feature_date_idx ON ai_usage_logs(user_id, feature, created_at);

-- Add RLS policies for AI usage logs
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own AI usage logs
CREATE POLICY "Users can view own AI usage logs" ON ai_usage_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own AI usage logs (via API)
CREATE POLICY "Users can insert own AI usage logs" ON ai_usage_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all AI usage logs
CREATE POLICY "Admins can view all AI usage logs" ON ai_usage_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Add auto-save functionality to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS auto_saved_data JSONB;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_auto_save TIMESTAMP WITH TIME ZONE;

-- Add AI enhancement tracking to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_enhanced BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_enhancement_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_ai_enhancement TIMESTAMP WITH TIME ZONE;

-- Add rate limiting table for API endpoints
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL, -- IP address or user ID
  endpoint TEXT NOT NULL,
  requests_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  window_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for rate limiting
CREATE INDEX IF NOT EXISTS rate_limits_identifier_endpoint_idx ON rate_limits(identifier, endpoint);
CREATE INDEX IF NOT EXISTS rate_limits_window_end_idx ON rate_limits(window_end);

-- Add function to clean up expired rate limits
CREATE OR REPLACE FUNCTION cleanup_expired_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limits WHERE window_end < NOW();
END;
$$ LANGUAGE plpgsql;

-- Add payment webhook logs table for better tracking
CREATE TABLE IF NOT EXISTS payment_webhook_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  razorpay_signature TEXT,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for payment webhook logs
CREATE INDEX IF NOT EXISTS payment_webhook_logs_payment_id_idx ON payment_webhook_logs(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS payment_webhook_logs_order_id_idx ON payment_webhook_logs(razorpay_order_id);
CREATE INDEX IF NOT EXISTS payment_webhook_logs_processed_idx ON payment_webhook_logs(processed);

-- Add notification preferences to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
  "email_notifications": true,
  "profile_updates": true,
  "payment_confirmations": true,
  "ai_feature_updates": false,
  "marketing_emails": false
}'::jsonb;

-- Add user activity tracking
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT, -- 'profile', 'nomination', 'payment', etc.
  resource_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for user activity
CREATE INDEX IF NOT EXISTS user_activity_logs_user_id_idx ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS user_activity_logs_action_idx ON user_activity_logs(action);
CREATE INDEX IF NOT EXISTS user_activity_logs_created_at_idx ON user_activity_logs(created_at);

-- Add RLS for user activity logs
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own activity logs
CREATE POLICY "Users can view own activity logs" ON user_activity_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all activity logs
CREATE POLICY "Admins can view all activity logs" ON user_activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'super_admin')
    )
  );

-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers where missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_profiles_updated_at
      BEFORE UPDATE ON profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Add analytics views for admin dashboard
CREATE OR REPLACE VIEW analytics_overview AS
SELECT 
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM users WHERE role = 'member') as total_members,
  (SELECT COUNT(*) FROM profiles WHERE status = 'published') as published_profiles,
  (SELECT COUNT(*) FROM nominations WHERE status = 'pending') as pending_nominations,
  (SELECT COUNT(*) FROM payments WHERE status = 'captured') as successful_payments,
  (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'captured') as total_revenue,
  (SELECT COUNT(*) FROM ai_usage_logs WHERE created_at >= NOW() - INTERVAL '30 days') as ai_usage_30d;

-- Grant necessary permissions
GRANT SELECT ON analytics_overview TO authenticated;

-- Add comment for documentation
COMMENT ON TABLE ai_usage_logs IS 'Tracks AI feature usage for analytics and billing';
COMMENT ON TABLE rate_limits IS 'Stores rate limiting data for API endpoints';
COMMENT ON TABLE payment_webhook_logs IS 'Logs all payment webhook events for debugging';
COMMENT ON TABLE user_activity_logs IS 'Tracks user actions for analytics and security';
COMMENT ON VIEW analytics_overview IS 'Provides overview statistics for admin dashboard';
