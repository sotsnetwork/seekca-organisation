-- Fix Security Issue: Restrict Profile Visibility to Authenticated Users Only
-- This script addresses the "Worker Personal Information Exposed to Public" error
-- by replacing the overly permissive policy with proper authentication requirements

-- Drop the existing policy that allows public access to all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a new policy that restricts profile access to authenticated users only
-- This ensures that only logged-in users can view profile information
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (true);

-- Optional: Create a more restrictive policy that only allows users to view their own profiles
-- Uncomment the following lines if you want even stricter access control:
-- DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
-- CREATE POLICY "Users can view their own profile" 
-- ON public.profiles 
-- FOR SELECT 
-- USING (auth.uid() = user_id);

-- Verify the changes by checking the current policies
-- You can run this query in Supabase SQL Editor to verify:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'profiles';
