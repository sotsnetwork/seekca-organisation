-- Script to clean up malformed skills data in existing profiles
-- Run this in your Supabase SQL Editor

-- 1. First, let's see the current skills data
SELECT 
  id,
  user_id,
  full_name,
  nickname,
  skills
FROM profiles 
WHERE skills IS NOT NULL AND array_length(skills, 1) > 0
ORDER BY created_at DESC;

-- 2. Clean up the skills data by removing escaped quotes and extra spaces
UPDATE profiles 
SET skills = array(
  SELECT trim(both '"' from trim(both ' ' from unnest(skills)))
)
WHERE skills IS NOT NULL 
  AND array_length(skills, 1) > 0
  AND EXISTS (
    SELECT 1 FROM unnest(skills) AS skill 
    WHERE skill LIKE '%"%' OR skill LIKE '% %'
  );

-- 3. Verify the cleaned skills data
SELECT 
  id,
  user_id,
  full_name,
  nickname,
  skills
FROM profiles 
WHERE skills IS NOT NULL AND array_length(skills, 1) > 0
ORDER BY created_at DESC;

-- 4. Show all professionals with their cleaned skills
SELECT 
  p.id,
  p.user_id,
  p.full_name,
  p.nickname,
  p.country,
  p.skills,
  ur.role,
  u.email
FROM profiles p
LEFT JOIN user_roles ur ON p.user_id = ur.user_id
LEFT JOIN auth.users u ON p.user_id = u.id
WHERE ur.role = 'professional'
ORDER BY p.created_at DESC;
