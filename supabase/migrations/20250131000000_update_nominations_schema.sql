-- Update nominations table to match application requirements
-- This migration aligns the database schema with the application code

-- Add missing columns to nominations table
ALTER TABLE nominations 
ADD COLUMN IF NOT EXISTS nominator_name TEXT,
ADD COLUMN IF NOT EXISTS pitch TEXT,
ADD COLUMN IF NOT EXISTS links JSONB,
ADD COLUMN IF NOT EXISTS desired_tier profile_tier,
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Update existing data to use new structure
UPDATE nominations 
SET 
  pitch = description,
  links = supporting_links,
  desired_tier = assigned_tier
WHERE pitch IS NULL;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_nominations_nominator_name ON nominations(nominator_name);
CREATE INDEX IF NOT EXISTS idx_nominations_desired_tier ON nominations(desired_tier);

-- Update RLS policies for new columns
-- The existing policies should still work, but let's ensure they cover the new columns

-- Add helpful comments
COMMENT ON COLUMN nominations.nominator_name IS 'Name of the person making the nomination';
COMMENT ON COLUMN nominations.pitch IS 'Description of why the nominee should be included';
COMMENT ON COLUMN nominations.links IS 'Supporting links as JSON array';
COMMENT ON COLUMN nominations.desired_tier IS 'Tier requested by nominator';
COMMENT ON COLUMN nominations.admin_notes IS 'Internal notes from admin review';

-- Ensure backward compatibility by keeping old columns
-- We'll keep both 'description' and 'pitch' for now
-- We'll keep both 'supporting_links' and 'links' for now
-- This allows gradual migration

-- Create a view for easier querying with both old and new column names
CREATE OR REPLACE VIEW nominations_unified AS
SELECT 
  id,
  nominator_email,
  nominator_name,
  nominee_name,
  nominee_email,
  COALESCE(pitch, description) as pitch,
  COALESCE(pitch, description) as description,
  COALESCE(links, supporting_links) as links,
  COALESCE(links, supporting_links) as supporting_links,
  COALESCE(desired_tier, assigned_tier) as desired_tier,
  assigned_tier,
  status,
  admin_notes,
  reviewed_by,
  reviewed_at,
  created_at,
  updated_at,
  category
FROM nominations;

-- Grant permissions on the view
GRANT SELECT ON nominations_unified TO authenticated;
GRANT SELECT ON nominations_unified TO service_role;

-- Create a function to handle nomination inserts with flexible schema
CREATE OR REPLACE FUNCTION insert_nomination(
  p_nominator_email TEXT,
  p_nominator_name TEXT DEFAULT NULL,
  p_nominee_name TEXT,
  p_nominee_email TEXT DEFAULT NULL,
  p_pitch TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_links JSONB DEFAULT NULL,
  p_supporting_links JSONB DEFAULT NULL,
  p_desired_tier profile_tier DEFAULT NULL,
  p_assigned_tier profile_tier DEFAULT NULL,
  p_category TEXT DEFAULT 'general'
) RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO nominations (
    nominator_email,
    nominator_name,
    nominee_name,
    nominee_email,
    pitch,
    description,
    links,
    supporting_links,
    desired_tier,
    assigned_tier,
    category,
    status
  ) VALUES (
    p_nominator_email,
    p_nominator_name,
    p_nominee_name,
    p_nominee_email,
    COALESCE(p_pitch, p_description),
    COALESCE(p_description, p_pitch),
    COALESCE(p_links, p_supporting_links),
    COALESCE(p_supporting_links, p_links),
    COALESCE(p_desired_tier, p_assigned_tier),
    p_assigned_tier,
    p_category,
    'pending'
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION insert_nomination TO authenticated;
GRANT EXECUTE ON FUNCTION insert_nomination TO service_role;

-- Add helpful constraints
ALTER TABLE nominations 
ADD CONSTRAINT check_nomination_has_content 
CHECK (
  (pitch IS NOT NULL AND length(trim(pitch)) > 0) OR 
  (description IS NOT NULL AND length(trim(description)) > 0)
);

-- Ensure we have either nominator_name or can derive it from email
ALTER TABLE nominations 
ADD CONSTRAINT check_nominator_info 
CHECK (
  nominator_name IS NOT NULL OR 
  nominator_email IS NOT NULL
);

-- Create trigger to auto-populate missing fields
CREATE OR REPLACE FUNCTION auto_populate_nomination_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-populate pitch from description if missing
  IF NEW.pitch IS NULL AND NEW.description IS NOT NULL THEN
    NEW.pitch := NEW.description;
  END IF;
  
  -- Auto-populate description from pitch if missing
  IF NEW.description IS NULL AND NEW.pitch IS NOT NULL THEN
    NEW.description := NEW.pitch;
  END IF;
  
  -- Auto-populate links from supporting_links if missing
  IF NEW.links IS NULL AND NEW.supporting_links IS NOT NULL THEN
    NEW.links := NEW.supporting_links;
  END IF;
  
  -- Auto-populate supporting_links from links if missing
  IF NEW.supporting_links IS NULL AND NEW.links IS NOT NULL THEN
    NEW.supporting_links := NEW.links;
  END IF;
  
  -- Auto-populate desired_tier from assigned_tier if missing
  IF NEW.desired_tier IS NULL AND NEW.assigned_tier IS NOT NULL THEN
    NEW.desired_tier := NEW.assigned_tier;
  END IF;
  
  -- Set default category if missing
  IF NEW.category IS NULL THEN
    NEW.category := 'general';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_auto_populate_nomination_fields ON nominations;
CREATE TRIGGER trigger_auto_populate_nomination_fields
  BEFORE INSERT OR UPDATE ON nominations
  FOR EACH ROW
  EXECUTE FUNCTION auto_populate_nomination_fields();

-- Update existing records to ensure consistency
UPDATE nominations 
SET 
  pitch = COALESCE(pitch, description),
  description = COALESCE(description, pitch),
  links = COALESCE(links, supporting_links),
  supporting_links = COALESCE(supporting_links, links),
  desired_tier = COALESCE(desired_tier, assigned_tier),
  category = COALESCE(category, 'general')
WHERE 
  pitch IS NULL OR 
  description IS NULL OR 
  links IS NULL OR 
  supporting_links IS NULL OR 
  desired_tier IS NULL OR 
  category IS NULL;
