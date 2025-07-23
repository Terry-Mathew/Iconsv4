-- Migration: Consolidate Profile Schema to Superset JSONB
-- Version: 003
-- Description: Migrate existing profile data to unified superset schema with all fields optional
-- Safety: Includes dry-run mode and rollback procedures

-- Create backup table for safety
CREATE TABLE IF NOT EXISTS profiles_backup_003 AS 
SELECT * FROM profiles WHERE 1=0; -- Structure only initially

-- Function to perform dry-run analysis
CREATE OR REPLACE FUNCTION analyze_profile_migration()
RETURNS TABLE (
  profile_id UUID,
  current_tier profile_tier,
  data_keys TEXT[],
  migration_preview JSONB,
  potential_issues TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.tier,
    ARRAY(SELECT jsonb_object_keys(p.data)) as data_keys,
    -- Preview of migrated structure
    jsonb_build_object(
      'name', COALESCE(p.data->>'name', ''),
      'bio', jsonb_build_object(
        'original', COALESCE(p.data->>'bio', p.data->>'biography', ''),
        'ai_polished', p.data->>'aiPolishedBio'
      ),
      'tagline', p.data->>'tagline',
      'heroImage', p.data->>'heroImage',
      'heroVideo', p.data->>'heroVideo',
      'achievements', COALESCE(p.data->'achievements', '[]'::jsonb),
      'timeline', COALESCE(p.data->'timeline', '[]'::jsonb),
      'gallery', COALESCE(p.data->'gallery', '[]'::jsonb),
      'quote', p.data->'quote',
      'links', COALESCE(p.data->'links', '[]'::jsonb),
      'sections', jsonb_build_object(
        'achievements', jsonb_build_object('visible', true, 'auto_hide_if_empty', true),
        'timeline', jsonb_build_object('visible', true, 'auto_hide_if_empty', true),
        'gallery', jsonb_build_object('visible', true, 'auto_hide_if_empty', true),
        'milestones', jsonb_build_object('visible', true, 'auto_hide_if_empty', true),
        'leadershipHighlights', jsonb_build_object('visible', true, 'auto_hide_if_empty', true),
        'tributes', jsonb_build_object('visible', true, 'auto_hide_if_empty', true)
      )
    ) as migration_preview,
    -- Identify potential issues
    ARRAY(
      SELECT issue FROM (
        SELECT CASE 
          WHEN p.data->>'name' IS NULL OR p.data->>'name' = '' THEN 'Missing required name field'
          WHEN p.data->>'bio' IS NULL AND p.data->>'biography' IS NULL THEN 'Missing required bio field'
          WHEN jsonb_typeof(p.data->'achievements') != 'array' AND p.data->'achievements' IS NOT NULL THEN 'Invalid achievements format'
          WHEN jsonb_typeof(p.data->'timeline') != 'array' AND p.data->'timeline' IS NOT NULL THEN 'Invalid timeline format'
          WHEN jsonb_typeof(p.data->'gallery') != 'array' AND p.data->'gallery' IS NOT NULL THEN 'Invalid gallery format'
          ELSE NULL
        END as issue
      ) issues WHERE issue IS NOT NULL
    ) as potential_issues
  FROM profiles p
  WHERE p.data IS NOT NULL AND p.data != '{}'::jsonb;
END;
$$ LANGUAGE plpgsql;

-- Function to perform actual migration
CREATE OR REPLACE FUNCTION migrate_profile_data(dry_run BOOLEAN DEFAULT true)
RETURNS TABLE (
  operation TEXT,
  profile_count INTEGER,
  success_count INTEGER,
  error_count INTEGER,
  errors TEXT[]
) AS $$
DECLARE
  profile_record RECORD;
  success_cnt INTEGER := 0;
  error_cnt INTEGER := 0;
  error_list TEXT[] := '{}';
  total_profiles INTEGER;
BEGIN
  -- Count total profiles to migrate
  SELECT COUNT(*) INTO total_profiles 
  FROM profiles 
  WHERE data IS NOT NULL AND data != '{}'::jsonb;

  IF dry_run THEN
    -- Dry run mode - just analyze and log
    RAISE NOTICE 'DRY RUN MODE: Analyzing % profiles for migration', total_profiles;
    
    FOR profile_record IN 
      SELECT * FROM analyze_profile_migration()
    LOOP
      RAISE NOTICE 'Profile %: Tier %, Keys %, Issues %', 
        profile_record.profile_id, 
        profile_record.current_tier,
        array_to_string(profile_record.data_keys, ', '),
        array_to_string(profile_record.potential_issues, '; ');
    END LOOP;
    
    RETURN QUERY SELECT 
      'DRY_RUN'::TEXT,
      total_profiles,
      0,
      0,
      ARRAY[]::TEXT[];
  ELSE
    -- Actual migration mode
    RAISE NOTICE 'MIGRATION MODE: Migrating % profiles', total_profiles;
    
    -- Create backup before migration
    INSERT INTO profiles_backup_003 SELECT * FROM profiles;
    RAISE NOTICE 'Backup created with % records', (SELECT COUNT(*) FROM profiles_backup_003);
    
    -- Add content column if it doesn't exist
    BEGIN
      ALTER TABLE profiles ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '{}';
    EXCEPTION WHEN duplicate_column THEN
      RAISE NOTICE 'Content column already exists';
    END;
    
    -- Migrate each profile
    FOR profile_record IN 
      SELECT id, tier, data FROM profiles 
      WHERE data IS NOT NULL AND data != '{}'::jsonb
    LOOP
      BEGIN
        UPDATE profiles SET content = jsonb_build_object(
          'name', COALESCE(profile_record.data->>'name', ''),
          'bio', jsonb_build_object(
            'original', COALESCE(profile_record.data->>'bio', profile_record.data->>'biography', ''),
            'ai_polished', profile_record.data->>'aiPolishedBio'
          ),
          'tagline', profile_record.data->>'tagline',
          'heroImage', profile_record.data->>'heroImage',
          'heroVideo', profile_record.data->>'heroVideo',
          'achievements', COALESCE(profile_record.data->'achievements', '[]'::jsonb),
          'timeline', COALESCE(profile_record.data->'timeline', '[]'::jsonb),
          'gallery', COALESCE(profile_record.data->'gallery', '[]'::jsonb),
          'quote', profile_record.data->'quote',
          'links', COALESCE(profile_record.data->'links', '[]'::jsonb),
          'sections', jsonb_build_object(
            'achievements', jsonb_build_object('visible', true, 'auto_hide_if_empty', true),
            'timeline', jsonb_build_object('visible', true, 'auto_hide_if_empty', true),
            'gallery', jsonb_build_object('visible', true, 'auto_hide_if_empty', true),
            'milestones', jsonb_build_object('visible', true, 'auto_hide_if_empty', true),
            'leadershipHighlights', jsonb_build_object('visible', true, 'auto_hide_if_empty', true),
            'tributes', jsonb_build_object('visible', true, 'auto_hide_if_empty', true)
          ),
          -- Preserve tier-specific data
          'milestones', profile_record.data->'milestones',
          'inspirations', profile_record.data->'inspirations',
          'futureVision', CASE 
            WHEN profile_record.data->>'futureVision' IS NOT NULL 
            THEN jsonb_build_object('original', profile_record.data->>'futureVision')
            ELSE NULL
          END,
          'leadershipHighlights', profile_record.data->'leadershipHighlights',
          'impactMetrics', profile_record.data->'impactMetrics',
          'featuredPress', profile_record.data->'featuredPress',
          'enduringContributions', CASE 
            WHEN profile_record.data->>'enduringContributions' IS NOT NULL 
            THEN jsonb_build_object('original', profile_record.data->>'enduringContributions')
            ELSE NULL
          END,
          'tributes', profile_record.data->'tributes',
          'archivalNotes', CASE 
            WHEN profile_record.data->>'archivalNotes' IS NOT NULL 
            THEN jsonb_build_object('original', profile_record.data->>'archivalNotes')
            ELSE NULL
          END
        )
        WHERE id = profile_record.id;
        
        success_cnt := success_cnt + 1;
        
      EXCEPTION WHEN OTHERS THEN
        error_cnt := error_cnt + 1;
        error_list := array_append(error_list, 
          'Profile ' || profile_record.id || ': ' || SQLERRM);
        RAISE NOTICE 'Error migrating profile %: %', profile_record.id, SQLERRM;
      END;
    END LOOP;
    
    RAISE NOTICE 'Migration completed: % success, % errors', success_cnt, error_cnt;
    
    RETURN QUERY SELECT 
      'MIGRATION'::TEXT,
      total_profiles,
      success_cnt,
      error_cnt,
      error_list;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to rollback migration
CREATE OR REPLACE FUNCTION rollback_profile_migration()
RETURNS BOOLEAN AS $$
DECLARE
  backup_count INTEGER;
BEGIN
  -- Check if backup exists
  SELECT COUNT(*) INTO backup_count FROM profiles_backup_003;
  
  IF backup_count = 0 THEN
    RAISE EXCEPTION 'No backup found. Cannot rollback.';
  END IF;
  
  -- Restore from backup
  TRUNCATE profiles;
  INSERT INTO profiles SELECT * FROM profiles_backup_003;
  
  RAISE NOTICE 'Rollback completed. Restored % profiles from backup.', backup_count;
  RETURN true;
  
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Rollback failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Usage Instructions (commented out for safety):
-- 
-- 1. DRY RUN (recommended first):
-- SELECT * FROM migrate_profile_data(true);
-- 
-- 2. ANALYZE POTENTIAL ISSUES:
-- SELECT * FROM analyze_profile_migration();
-- 
-- 3. ACTUAL MIGRATION (after reviewing dry run):
-- SELECT * FROM migrate_profile_data(false);
-- 
-- 4. ROLLBACK IF NEEDED:
-- SELECT rollback_profile_migration();
-- 
-- 5. CLEANUP AFTER SUCCESSFUL MIGRATION:
-- DROP TABLE profiles_backup_003;
-- DROP FUNCTION analyze_profile_migration();
-- DROP FUNCTION migrate_profile_data(BOOLEAN);
-- DROP FUNCTION rollback_profile_migration();

-- Create indexes for new content column
CREATE INDEX IF NOT EXISTS idx_profiles_content_name ON profiles USING GIN ((content->>'name'));
CREATE INDEX IF NOT EXISTS idx_profiles_content_tier ON profiles USING GIN ((content->>'tier'));
CREATE INDEX IF NOT EXISTS idx_profiles_content_sections ON profiles USING GIN ((content->'sections'));

-- Update RLS policies for content column
DO $$
BEGIN
  -- Allow public read access to published profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Public read access to published profile content'
  ) THEN
    CREATE POLICY "Public read access to published profile content"
      ON profiles FOR SELECT
      USING (status = 'published');
  END IF;
  
  -- Allow profile owners to update their content
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Profile owners can update content'
  ) THEN
    CREATE POLICY "Profile owners can update content"
      ON profiles FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;
