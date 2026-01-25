-- Create profiles table for mock users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18),
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'nonbinary')),
  avatar TEXT NOT NULL,
  bio TEXT NOT NULL,
  interests TEXT[] NOT NULL DEFAULT '{}',
  compatibility INTEGER NOT NULL DEFAULT 50 CHECK (compatibility >= 0 AND compatibility <= 100),
  last_active TEXT NOT NULL DEFAULT 'Just now',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (public read for matching)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read profiles (public dating app)
CREATE POLICY "Profiles are publicly readable"
ON public.profiles
FOR SELECT
USING (true);