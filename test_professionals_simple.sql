-- Simple test to check if professionals are being fetched correctly
-- Run this in Supabase SQL Editor

-- 1. Check all profiles
SELECT 
  id,
  user_id,
  full_name,
  nickname,
  skills,
  country,
  hourly_rate,
  location,
  created_at
FROM profiles 
ORDER BY created_at DESC;

-- 2. Check all user roles
SELECT 
  id,
  user_id,
  role,
  created_at
FROM user_roles 
ORDER BY created_at DESC;

-- 3. Test the exact join query that the app uses
SELECT 
  p.id,
  p.user_id,
  p.full_name,
  p.nickname,
  p.skills,
  p.country,
  p.hourly_rate,
  p.location,
  p.created_at,
  ur.role
FROM profiles p
INNER JOIN user_roles ur ON p.user_id = ur.user_id
WHERE ur.role = 'professional'
ORDER BY p.created_at DESC;

-- 4. Count total professionals
SELECT 
  COUNT(*) as total_professionals
FROM profiles p
INNER JOIN user_roles ur ON p.user_id = ur.user_id
WHERE ur.role = 'professional';
