-- Test query to check if professionals are being fetched correctly
-- Run this in Supabase SQL Editor

-- 1. Check if user_roles table has the right data
SELECT 
  ur.id,
  ur.user_id,
  ur.role,
  u.email,
  u.raw_user_meta_data->>'full_name' as full_name
FROM user_roles ur
LEFT JOIN auth.users u ON ur.user_id = u.id
WHERE ur.role = 'professional'
ORDER BY ur.created_at DESC;

-- 2. Check if profiles table has the right data
SELECT 
  p.id,
  p.user_id,
  p.full_name,
  p.nickname,
  p.skills,
  p.country,
  p.hourly_rate,
  p.location
FROM profiles p
ORDER BY p.created_at DESC;

-- 3. Test the exact join query that the app uses
SELECT 
  p.*,
  ur.role
FROM profiles p
INNER JOIN user_roles ur ON p.user_id = ur.user_id
WHERE ur.role = 'professional'
ORDER BY p.created_at DESC;

-- 4. Check if there are any visibility settings that might be hiding profiles
SELECT 
  p.id,
  p.user_id,
  p.full_name,
  p.visibility,
  p.collaboration_enabled,
  ur.role
FROM profiles p
LEFT JOIN user_roles ur ON p.user_id = ur.user_id
WHERE ur.role = 'professional'
ORDER BY p.created_at DESC;
