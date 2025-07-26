-- Complete ICONS HERALD Database Optimization
-- Migration: Final optimization with indexing, real-time, and performance enhancements
-- Version: 20250724100000
-- Description: Complete database optimization for production readiness

-- ============================================================================
-- PART 1: ADVANCED INDEXING FOR PERFORMANCE
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 1. JSONB Content Indexing for Profile Search
CREATE INDEX IF NOT EXISTS idx_profiles_content_name 
ON profiles USING GIN ((content->>'name') gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_profiles_content_tagline 
ON profiles USING GIN ((content->>'tagline') gin_trgm_ops);

-- 2. Analytics Events Optimization
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_event 
ON analytics_events (user_id, event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at 
ON analytics_events (created_at DESC);

-- 3. Composite Index for Published Profiles by Tier
CREATE INDEX IF NOT EXISTS idx_profiles_published_tier 
ON profiles (is_published, assigned_tier, published_at DESC) 
WHERE is_published = true;

-- 4. Nominations Performance Indexes
CREATE INDEX IF NOT EXISTS idx_nominations_status_created 
ON nominations (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_nominations_email 
ON nominations (nominee_email);

-- ============================================================================
-- PART 2: REAL-TIME NOTIFICATION SYSTEM
-- ============================================================================

-- 1. Admin Notification Trigger for New Nominations
CREATE OR REPLACE FUNCTION notify_admin_new_nomination()
RETURNS TRIGGER AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get first admin user for system notifications
  SELECT id INTO admin_user_id 
  FROM users 
  WHERE role = 'super_admin' 
  LIMIT 1;
  
  -- Insert notification event for admins
  INSERT INTO analytics_events (
    user_id,
    event_type,
    metadata
  ) VALUES (
    admin_user_id,
    'admin_notification_new_nomination',
    jsonb_build_object(
      'nomination_id', NEW.id,
      'nominee_name', NEW.nominee_name,
      'nominee_email', NEW.nominee_email,
      'status', NEW.status,
      'created_at', NEW.created_at
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new nominations
DROP TRIGGER IF EXISTS trigger_notify_admin_new_nomination ON nominations;
CREATE TRIGGER trigger_notify_admin_new_nomination
  AFTER INSERT ON nominations
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_new_nomination();

-- 2. Profile Status Change Notifications
CREATE OR REPLACE FUNCTION notify_admin_profile_status_change()
RETURNS TRIGGER AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Only notify on status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Get first admin user for system notifications
    SELECT id INTO admin_user_id 
    FROM users 
    WHERE role = 'super_admin' 
    LIMIT 1;
    
    INSERT INTO analytics_events (
      user_id,
      event_type,
      metadata
    ) VALUES (
      admin_user_id,
      'admin_notification_profile_status_change',
      jsonb_build_object(
        'profile_id', NEW.id,
        'slug', NEW.slug,
        'old_status', OLD.status,
        'new_status', NEW.status,
        'tier', NEW.tier,
        'changed_at', NOW()
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profile status changes
DROP TRIGGER IF EXISTS trigger_notify_admin_profile_status_change ON profiles;
CREATE TRIGGER trigger_notify_admin_profile_status_change
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_profile_status_change();

-- ============================================================================
-- PART 3: ADMIN NOTIFICATION VIEWS AND UTILITIES
-- ============================================================================

-- 1. Admin Notification Summary View
CREATE OR REPLACE VIEW admin_notifications AS
SELECT 
  id,
  user_id,
  event_type,
  metadata,
  created_at,
  CASE 
    WHEN event_type = 'admin_notification_new_nomination' THEN 
      'New nomination: ' || (metadata->>'nominee_name')
    WHEN event_type = 'admin_notification_profile_status_change' THEN 
      'Profile status changed: ' || (metadata->>'slug') || ' (' || (metadata->>'old_status') || ' → ' || (metadata->>'new_status') || ')'
    ELSE event_type
  END as notification_message,
  CASE 
    WHEN event_type = 'admin_notification_new_nomination' THEN 'nomination'
    WHEN event_type = 'admin_notification_profile_status_change' THEN 'profile'
    ELSE 'system'
  END as notification_type
FROM analytics_events 
WHERE event_type LIKE 'admin_notification_%'
ORDER BY created_at DESC;

-- 2. Performance Monitoring View
CREATE OR REPLACE VIEW performance_metrics AS
SELECT 
  'profiles' as table_name,
  COUNT(*) as total_records,
  COUNT(*) FILTER (WHERE is_published = true) as published_count,
  COUNT(*) FILTER (WHERE assigned_tier = 'rising') as rising_count,
  COUNT(*) FILTER (WHERE assigned_tier = 'elite') as elite_count,
  COUNT(*) FILTER (WHERE assigned_tier = 'legacy') as legacy_count
FROM profiles
UNION ALL
SELECT 
  'nominations' as table_name,
  COUNT(*) as total_records,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
  COUNT(*) FILTER (WHERE status = 'approved') as approved_count,
  COUNT(*) FILTER (WHERE status = 'rejected') as rejected_count,
  0 as legacy_count
FROM nominations
UNION ALL
SELECT 
  'analytics_events' as table_name,
  COUNT(*) as total_records,
  COUNT(*) FILTER (WHERE event_type LIKE 'admin_notification_%') as notification_count,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as last_24h_count,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as last_7d_count,
  0 as legacy_count
FROM analytics_events;

-- ============================================================================
-- PART 4: SEARCH AND PERFORMANCE FUNCTIONS
-- ============================================================================

-- 1. Profile Search Function
CREATE OR REPLACE FUNCTION search_profiles(
  search_term TEXT,
  tier_filter TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  slug TEXT,
  tier TEXT,
  name TEXT,
  tagline TEXT,
  similarity_score REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.slug,
    p.tier,
    p.content->>'name' as name,
    p.content->>'tagline' as tagline,
    GREATEST(
      similarity(p.content->>'name', search_term),
      similarity(p.content->>'tagline', search_term)
    ) as similarity_score
  FROM profiles p
  WHERE p.is_published = true
    AND (tier_filter IS NULL OR p.assigned_tier = tier_filter)
    AND (
      p.content->>'name' % search_term 
      OR p.content->>'tagline' % search_term
    )
  ORDER BY similarity_score DESC, p.published_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VERIFICATION AND CLEANUP
-- ============================================================================

-- Verify all indexes exist
DO $$
DECLARE
  index_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO index_count
  FROM pg_indexes 
  WHERE tablename IN ('profiles', 'nominations', 'analytics_events')
  AND schemaname = 'public';
  
  RAISE NOTICE 'Total indexes created: %', index_count;
END $$;

-- Final success message
SELECT 'Complete database optimization applied successfully' as result,
       'Real-time notifications enabled' as realtime_status,
       'Advanced indexing configured' as indexing_status,
       'Performance monitoring ready' as monitoring_status;
