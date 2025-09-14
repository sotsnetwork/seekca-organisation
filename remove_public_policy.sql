-- Remove the insecure public policy that still exists
-- This policy allows anyone (including unauthenticated users) to view all profiles

-- Drop the specific policy that allows public access
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

-- Verify the fix by checking remaining policies
-- Run this query after the above to confirm only secure policies remain:
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';
