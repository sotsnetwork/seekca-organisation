-- Check and fix profiles for existing users
-- Run this in your Supabase SQL Editor

-- 1. Check what users exist in auth.users
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'full_name' as full_name,
  raw_user_meta_data->>'nickname' as nickname,
  raw_user_meta_data->>'role' as role,
  created_at
FROM auth.users 
ORDER BY created_at DESC;

-- 2. Check what profiles exist
SELECT 
  p.id,
  p.user_id,
  p.full_name,
  p.nickname,
  p.country,
  ur.role
FROM profiles p
LEFT JOIN user_roles ur ON p.user_id = ur.user_id
ORDER BY p.created_at DESC;

-- 3. Check what user_roles exist
SELECT 
  ur.id,
  ur.user_id,
  ur.role,
  u.email,
  u.raw_user_meta_data->>'full_name' as full_name,
  u.raw_user_meta_data->>'nickname' as nickname
FROM user_roles ur
LEFT JOIN auth.users u ON ur.user_id = u.id
ORDER BY ur.created_at DESC;

-- 4. Find users without profiles
SELECT 
  u.id,
  u.email,
  u.raw_user_meta_data->>'full_name' as full_name,
  u.raw_user_meta_data->>'nickname' as nickname,
  u.raw_user_meta_data->>'role' as role,
  ur.role as actual_role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.user_id
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE p.user_id IS NULL
ORDER BY u.created_at DESC;

-- 5. Create profiles for users who don't have them
INSERT INTO profiles (user_id, full_name, nickname, country, bio, skills, hourly_rate, location)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', 'User'),
  COALESCE(u.raw_user_meta_data->>'nickname', 'User'),
  COALESCE(u.raw_user_meta_data->>'country', 'Nigeria'),
  COALESCE(u.raw_user_meta_data->>'bio', 'Professional on SeekCa'),
  COALESCE((u.raw_user_meta_data->>'skills')::TEXT[], ARRAY[]::TEXT[]),
  COALESCE((u.raw_user_meta_data->>'hourly_rate')::DECIMAL, 25.00),
  COALESCE(u.raw_user_meta_data->>'location', 'Lagos, Nigeria')
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.user_id
WHERE p.user_id IS NULL;

-- 6. Create user_roles for users who don't have them
INSERT INTO user_roles (user_id, role)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'role', 'professional')
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.user_id IS NULL;

-- 7. Check the final result
SELECT 
  p.id,
  p.user_id,
  p.full_name,
  p.nickname,
  p.country,
  ur.role,
  u.email
FROM profiles p
LEFT JOIN user_roles ur ON p.user_id = ur.user_id
LEFT JOIN auth.users u ON p.user_id = u.id
WHERE ur.role = 'professional'
ORDER BY p.created_at DESC;
