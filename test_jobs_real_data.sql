-- Test script to verify real jobs data
-- Run this in your Supabase SQL Editor

-- 1. Check all jobs in the database
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

-- 2. Check jobs with hirer information
SELECT 
    j.id,
    j.title,
    j.description,
    j.budget_min,
    j.budget_max,
    j.currency,
    j.skills,
    j.location,
    j.status,
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

-- 4. Count total jobs
SELECT COUNT(*) as total_jobs FROM jobs;

-- 5. Count active jobs
SELECT COUNT(*) as active_jobs FROM jobs WHERE status = 'active';
