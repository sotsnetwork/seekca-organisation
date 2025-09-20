-- Set default visibility for existing profiles
-- Run this in Supabase SQL Editor

-- 1. Check current visibility settings
SELECT 
  id,
  user_id,
  full_name,
  visibility,
  collaboration_enabled
FROM profiles 
ORDER BY created_at DESC;

-- 2. Set default visibility for profiles that don't have it set
UPDATE profiles 
SET 
  visibility = 'public',
  collaboration_enabled = true
WHERE visibility IS NULL OR visibility = '';

-- 3. Verify the updated visibility settings
SELECT 
  id,
  user_id,
  full_name,
  visibility,
  collaboration_enabled
FROM profiles 
ORDER BY created_at DESC;

-- 4. Test the exact query that the app uses
SELECT 
  p.*,
  ur.role
FROM profiles p
INNER JOIN user_roles ur ON p.user_id = ur.user_id
WHERE ur.role = 'professional'
  AND p.visibility IN ('public', 'professionals_only')
ORDER BY p.created_at DESC;
