-- Test query to check if jobs exist in the database
-- Run this in your Supabase SQL Editor

-- 1. Check all jobs in the jobs table
SELECT 
    id,
    title,
    description,
    budget_min,
    budget_max,
    currency,
    skills,
    location,
    remote_allowed,
    project_duration,
    status,
    user_id,
    created_at
FROM jobs
ORDER BY created_at DESC;

-- 2. Check jobs with their hirer profiles
SELECT 
    j.id,
    j.title,
    j.description,
    j.budget_min,
    j.budget_max,
    j.currency,
    j.skills,
    j.location,
    j.remote_allowed,
    j.project_duration,
    j.status,
    j.user_id,
    j.created_at,
    p.full_name as hirer_name,
    p.nickname as hirer_nickname
FROM jobs j
LEFT JOIN profiles p ON j.user_id = p.user_id
ORDER BY j.created_at DESC;

-- 3. Check active jobs only
SELECT 
    id,
    title,
    description,
    status,
    created_at
FROM jobs
WHERE status = 'active'
ORDER BY created_at DESC;
