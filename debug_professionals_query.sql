-- Debug script to check what professionals are in the database
-- Run this in Supabase SQL Editor

-- 1. Check all profiles with their roles
SELECT 
  p.id,
  p.user_id,
  p.full_name,
  p.nickname,
  p.location,
  p.country,
  p.skills,
  ur.role
FROM profiles p
LEFT JOIN user_roles ur ON p.user_id = ur.user_id
ORDER BY p.created_at DESC;

-- 2. Check specifically for professionals
SELECT 
  p.id,
  p.user_id,
  p.full_name,
  p.nickname,
  p.location,
  p.country,
  p.skills,
  ur.role
FROM profiles p
INNER JOIN user_roles ur ON p.user_id = ur.user_id
WHERE ur.role = 'professional'
ORDER BY p.created_at DESC;

-- 3. Check for Bayelsa/Yenagoa professionals specifically
SELECT 
  p.id,
  p.user_id,
  p.full_name,
  p.nickname,
  p.location,
  p.country,
  p.skills,
  ur.role
FROM profiles p
INNER JOIN user_roles ur ON p.user_id = ur.user_id
WHERE ur.role = 'professional'
  AND (p.location ILIKE '%Bayelsa%' OR p.location ILIKE '%Yenagoa%')
ORDER BY p.created_at DESC;

-- 4. Check for Nigeria professionals
SELECT 
  p.id,
  p.user_id,
  p.full_name,
  p.nickname,
  p.location,
  p.country,
  p.skills,
  ur.role
FROM profiles p
INNER JOIN user_roles ur ON p.user_id = ur.user_id
WHERE ur.role = 'professional'
  AND p.country = 'Nigeria'
ORDER BY p.created_at DESC;

-- 5. Count total professionals
SELECT COUNT(*) as total_professionals
FROM profiles p
INNER JOIN user_roles ur ON p.user_id = ur.user_id
WHERE ur.role = 'professional';
