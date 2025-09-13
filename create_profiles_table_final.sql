-- Create profiles table for SeekCa
-- Run this SQL in your Supabase SQL Editor

-- First, create the profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT,
  nickname TEXT,
  country TEXT,
  bio TEXT,
  skills TEXT[],
  hourly_rate DECIMAL(10,2),
  location TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('professional', 'hirer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_country_idx ON profiles(country);
CREATE INDEX IF NOT EXISTS profiles_skills_idx ON profiles USING GIN(skills);
CREATE INDEX IF NOT EXISTS user_roles_user_id_idx ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS user_roles_role_idx ON user_roles(role);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_roles
CREATE POLICY "Users can view all roles" ON user_roles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own role" ON user_roles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role" ON user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample profile data for existing users (optional)
-- This will create profiles for any existing users
INSERT INTO profiles (user_id, full_name, nickname, country, bio, skills, hourly_rate, location)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'full_name', 'User'),
  COALESCE(raw_user_meta_data->>'nickname', 'User'),
  COALESCE(raw_user_meta_data->>'country', 'Nigeria'),
  COALESCE(raw_user_meta_data->>'bio', 'Professional on SeekCa'),
  COALESCE((raw_user_meta_data->>'skills')::TEXT[], ARRAY[]::TEXT[]),
  COALESCE((raw_user_meta_data->>'hourly_rate')::DECIMAL, 25.00),
  COALESCE(raw_user_meta_data->>'location', 'Lagos, Nigeria')
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM profiles);

-- Insert sample user roles for existing users (optional)
INSERT INTO user_roles (user_id, role)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'role', 'professional')
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_roles);
