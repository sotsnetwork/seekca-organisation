-- Fix security issue: Restrict profile visibility to authenticated users only
-- Replace the overly permissive policy that allows anyone to view all profiles

-- Drop the existing policy that allows public access
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a new policy that restricts access to authenticated users only
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (true);

-- Optional: If you want to restrict even further, you could create a policy
-- that only allows users to view their own profiles:
-- CREATE POLICY "Users can view their own profile" 
-- ON public.profiles 
-- FOR SELECT 
-- USING (auth.uid() = user_id);