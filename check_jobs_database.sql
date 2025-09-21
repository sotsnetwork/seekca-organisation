-- Quick check to see if jobs exist in the database
-- Run this in your Supabase SQL Editor

-- 1. Check if any jobs exist at all
SELECT COUNT(*) as total_jobs FROM jobs;

-- 2. Check active jobs
SELECT COUNT(*) as active_jobs FROM jobs WHERE status = 'active';

-- 3. Show all jobs with basic info
SELECT 
    id,
    title,
    status,
    created_at,
    user_id
FROM jobs
ORDER BY created_at DESC
LIMIT 10;

-- 4. Check if jobs have hirer profiles
SELECT 
    j.id,
    j.title,
    j.status,
    p.full_name as hirer_name,
    p.nickname as hirer_nickname
FROM jobs j
LEFT JOIN profiles p ON j.user_id = p.user_id
ORDER BY j.created_at DESC
LIMIT 5;
