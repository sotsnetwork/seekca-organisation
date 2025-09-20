-- Direct test of the exact query the app uses
-- Run this in Supabase SQL Editor

-- Test the exact join query that the Professionals component uses
SELECT 
  p.id,
  p.user_id,
  p.full_name,
  p.nickname,
  p.bio,
  p.skills,
  p.hourly_rate,
  p.location,
  p.country,
  p.avatar_url,
  p.created_at,
  ur.role
FROM profiles p
INNER JOIN user_roles ur ON p.user_id = ur.user_id
WHERE ur.role = 'professional'
ORDER BY p.created_at DESC;

-- Also test if there are any RLS (Row Level Security) issues
-- by checking if we can see the data as an anonymous user
SELECT 
  COUNT(*) as total_professionals_visible
FROM profiles p
INNER JOIN user_roles ur ON p.user_id = ur.user_id
WHERE ur.role = 'professional';
