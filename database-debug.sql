-- ICONS HERALD Database Constraint Analysis
-- This script helps debug the unique constraint issue

-- 1. Check current profiles table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 2. Check all constraints on profiles table
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    tc.is_deferrable,
    tc.initially_deferred
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name = 'profiles';

-- 3. Check current profiles data
SELECT 
    id,
    user_id,
    status,
    slug,
    is_published,
    created_at,
    updated_at
FROM profiles 
ORDER BY created_at DESC 
LIMIT 10;

-- 4. Check for duplicate user_ids (this should show the constraint violation)
SELECT 
    user_id,
    COUNT(*) as profile_count,
    array_agg(status) as statuses,
    array_agg(slug) as slugs
FROM profiles 
GROUP BY user_id 
HAVING COUNT(*) > 1;

-- 5. Check users table to understand the relationship
SELECT 
    u.id as user_id,
    u.email,
    u.role,
    p.id as profile_id,
    p.status,
    p.slug
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
ORDER BY u.created_at DESC
LIMIT 10;

-- POTENTIAL SOLUTIONS:

-- Option 1: If you want multiple profiles per user (remove unique constraint)
-- ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_id_key;

-- Option 2: If you want one profile per user but allow status changes
-- Keep the unique constraint and always UPDATE existing profiles

-- Option 3: Create a composite unique constraint (user_id + status)
-- This would allow one draft and one published profile per user
-- ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_id_key;
-- ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_status_key UNIQUE (user_id, status);

-- Option 4: Use UPSERT pattern in application code (recommended)
-- INSERT ... ON CONFLICT (user_id) DO UPDATE SET ...
-- This is what we've implemented in the API
