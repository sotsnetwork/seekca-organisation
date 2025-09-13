-- Fix security issue: Restrict profile visibility to only the profile owner
-- This prevents unauthorized access to personal information

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Create a restrictive policy that only allows users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Note: If you need hirers to view professional profiles for business purposes,
-- you can create an additional policy like:
-- CREATE POLICY "Hirers can view professional profiles" 
-- ON public.profiles 
-- FOR SELECT 
-- USING (
--   get_user_role(auth.uid()) = 'hirer' AND 
--   get_user_role(user_id) = 'professional'
-- );