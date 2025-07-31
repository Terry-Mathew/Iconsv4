-- Migration to update tier system from 3 tiers to 4 tiers
-- This migration adds new tier values and provides backward compatibility

-- Add new tier values to the existing enum
ALTER TYPE profile_tier ADD VALUE 'emerging';
ALTER TYPE profile_tier ADD VALUE 'accomplished';
ALTER TYPE profile_tier ADD VALUE 'distinguished';

-- Create a function to migrate existing profiles to new tier names
CREATE OR REPLACE FUNCTION migrate_profile_tiers()
RETURNS void AS $$
BEGIN
  -- Update existing profiles to use new tier names
  -- rising -> accomplished (mid-tier positioning)
  UPDATE profiles 
  SET tier = 'accomplished'::profile_tier 
  WHERE tier = 'rising'::profile_tier;
  
  -- elite -> distinguished (premium positioning)
  UPDATE profiles 
  SET tier = 'distinguished'::profile_tier 
  WHERE tier = 'elite'::profile_tier;
  
  -- legacy remains the same (memorial service)
  -- No changes needed for legacy tier
  
  -- Update nominations table as well
  UPDATE nominations 
  SET assigned_tier = 'accomplished'::profile_tier 
  WHERE assigned_tier = 'rising'::profile_tier;
  
  UPDATE nominations 
  SET assigned_tier = 'distinguished'::profile_tier 
  WHERE assigned_tier = 'elite'::profile_tier;
  
  -- Update payments table
  UPDATE payments 
  SET tier = 'accomplished'::profile_tier 
  WHERE tier = 'rising'::profile_tier;
  
  UPDATE payments 
  SET tier = 'distinguished'::profile_tier 
  WHERE tier = 'elite'::profile_tier;
  
END;
$$ LANGUAGE plpgsql;

-- Execute the migration function
SELECT migrate_profile_tiers();

-- Drop the migration function as it's no longer needed
DROP FUNCTION migrate_profile_tiers();

-- Add comments to document the new tier structure
COMMENT ON TYPE profile_tier IS 'Profile tier system: emerging (entry), accomplished (mid), distinguished (premium), legacy (memorial)';

-- Create indexes for better performance on tier-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_tier ON profiles(tier);
CREATE INDEX IF NOT EXISTS idx_nominations_assigned_tier ON nominations(assigned_tier);
CREATE INDEX IF NOT EXISTS idx_payments_tier ON payments(tier);
