-- Drop the overly permissive public access policy
DROP POLICY IF EXISTS "Profiles are publicly readable" ON public.profiles;

-- Create a new policy that requires authentication to view profiles
CREATE POLICY "Authenticated users can browse profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);