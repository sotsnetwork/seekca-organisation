-- Complete Database Setup for SeekCa
-- Run this SQL in your Supabase SQL Editor to set up all tables

-- 1. Create profiles table
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

-- 2. Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('professional', 'hirer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hirer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  skills TEXT[],
  location TEXT,
  remote_allowed BOOLEAN DEFAULT FALSE,
  project_duration TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  professional_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hirer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cover_letter TEXT,
  proposed_rate DECIMAL(10,2),
  estimated_duration INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, professional_id)
);

-- 5. Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE UNIQUE NOT NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  professional_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hirer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  total_budget DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled', 'disputed')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create project_milestones table
CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'approved', 'rejected', 'paid')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create project_messages table
CREATE TABLE IF NOT EXISTS project_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'milestone_update', 'payment_request', 'file_upload')),
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create project_files table
CREATE TABLE IF NOT EXISTS project_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Create payment_records table
CREATE TABLE IF NOT EXISTS payment_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  milestone_id UUID REFERENCES project_milestones(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  transaction_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create all indexes
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_country_idx ON profiles(country);
CREATE INDEX IF NOT EXISTS profiles_skills_idx ON profiles USING GIN(skills);

CREATE INDEX IF NOT EXISTS user_roles_user_id_idx ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS user_roles_role_idx ON user_roles(role);

CREATE INDEX IF NOT EXISTS jobs_hirer_id_idx ON jobs(hirer_id);
CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs(status);
CREATE INDEX IF NOT EXISTS jobs_created_at_idx ON jobs(created_at);
CREATE INDEX IF NOT EXISTS jobs_skills_idx ON jobs USING GIN(skills);

CREATE INDEX IF NOT EXISTS job_applications_job_id_idx ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS job_applications_professional_id_idx ON job_applications(professional_id);
CREATE INDEX IF NOT EXISTS job_applications_hirer_id_idx ON job_applications(hirer_id);
CREATE INDEX IF NOT EXISTS job_applications_status_idx ON job_applications(status);

CREATE INDEX IF NOT EXISTS projects_professional_id_idx ON projects(professional_id);
CREATE INDEX IF NOT EXISTS projects_hirer_id_idx ON projects(hirer_id);
CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status);

CREATE INDEX IF NOT EXISTS project_milestones_project_id_idx ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS project_milestones_status_idx ON project_milestones(status);

CREATE INDEX IF NOT EXISTS project_messages_project_id_idx ON project_messages(project_id);
CREATE INDEX IF NOT EXISTS project_messages_sender_id_idx ON project_messages(sender_id);

CREATE INDEX IF NOT EXISTS project_files_project_id_idx ON project_files(project_id);

CREATE INDEX IF NOT EXISTS payment_records_project_id_idx ON payment_records(project_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
-- Restrict profile access to authenticated users only to prevent public exposure of personal data
CREATE POLICY "Authenticated users can view profiles" ON profiles
  FOR SELECT TO authenticated USING (true);

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

-- Create RLS policies for jobs
CREATE POLICY "Anyone can view active jobs" ON jobs
  FOR SELECT USING (status = 'active');

CREATE POLICY "Hirers can view their own jobs" ON jobs
  FOR SELECT USING (hirer_id = auth.uid());

CREATE POLICY "Hirers can create jobs" ON jobs
  FOR INSERT WITH CHECK (hirer_id = auth.uid());

CREATE POLICY "Hirers can update their own jobs" ON jobs
  FOR UPDATE USING (hirer_id = auth.uid());

CREATE POLICY "Hirers can delete their own jobs" ON jobs
  FOR DELETE USING (hirer_id = auth.uid());

-- Create RLS policies for job_applications
CREATE POLICY "Users can view applications for their jobs" ON job_applications
  FOR SELECT USING (
    hirer_id = auth.uid() OR 
    professional_id = auth.uid()
  );

CREATE POLICY "Professionals can create applications" ON job_applications
  FOR INSERT WITH CHECK (professional_id = auth.uid());

CREATE POLICY "Hirers can update application status" ON job_applications
  FOR UPDATE USING (hirer_id = auth.uid());

-- Create RLS policies for projects
CREATE POLICY "Users can view their projects" ON projects
  FOR SELECT USING (
    professional_id = auth.uid() OR 
    hirer_id = auth.uid()
  );

CREATE POLICY "Hirers can create projects" ON projects
  FOR INSERT WITH CHECK (hirer_id = auth.uid());

CREATE POLICY "Project participants can update projects" ON projects
  FOR UPDATE USING (
    professional_id = auth.uid() OR 
    hirer_id = auth.uid()
  );

-- Create RLS policies for project_milestones
CREATE POLICY "Project participants can view milestones" ON project_milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_milestones.project_id 
      AND (professional_id = auth.uid() OR hirer_id = auth.uid())
    )
  );

CREATE POLICY "Project participants can manage milestones" ON project_milestones
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_milestones.project_id 
      AND (professional_id = auth.uid() OR hirer_id = auth.uid())
    )
  );

-- Create RLS policies for project_messages
CREATE POLICY "Project participants can view messages" ON project_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_messages.project_id 
      AND (professional_id = auth.uid() OR hirer_id = auth.uid())
    )
  );

CREATE POLICY "Project participants can send messages" ON project_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_messages.project_id 
      AND (professional_id = auth.uid() OR hirer_id = auth.uid())
    )
  );

-- Create RLS policies for project_files
CREATE POLICY "Project participants can view files" ON project_files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_files.project_id 
      AND (professional_id = auth.uid() OR hirer_id = auth.uid())
    )
  );

CREATE POLICY "Project participants can upload files" ON project_files
  FOR INSERT WITH CHECK (
    uploaded_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_files.project_id 
      AND (professional_id = auth.uid() OR hirer_id = auth.uid())
    )
  );

-- Create RLS policies for payment_records
CREATE POLICY "Project participants can view payments" ON payment_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = payment_records.project_id 
      AND (professional_id = auth.uid() OR hirer_id = auth.uid())
    )
  );

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

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_milestones_updated_at
  BEFORE UPDATE ON project_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO jobs (hirer_id, title, description, budget_min, budget_max, currency, skills, location, remote_allowed, project_duration, status) VALUES
(
  (SELECT id FROM auth.users LIMIT 1),
  'React Developer Needed',
  'We are looking for an experienced React developer to help build a modern web application. The project involves creating responsive components, integrating with APIs, and implementing state management.',
  50.00,
  100.00,
  'USD',
  ARRAY['React', 'JavaScript', 'TypeScript', 'CSS'],
  'New York, NY',
  true,
  '2-4 weeks',
  'active'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'UI/UX Designer for Mobile App',
  'Seeking a talented UI/UX designer to create beautiful and intuitive mobile app designs. Must have experience with Figma and mobile design principles.',
  75.00,
  150.00,
  'USD',
  ARRAY['UI Design', 'UX Design', 'Figma', 'Mobile Design'],
  'San Francisco, CA',
  true,
  '3-6 weeks',
  'active'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Backend API Development',
  'Need a backend developer to build RESTful APIs using Node.js and Express. Experience with databases and authentication required.',
  60.00,
  120.00,
  'USD',
  ARRAY['Node.js', 'Express', 'MongoDB', 'REST API'],
  'London, UK',
  false,
  '4-8 weeks',
  'active'
);

-- Insert sample profile data for existing users
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

-- Insert sample user roles for existing users
INSERT INTO user_roles (user_id, role)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'role', 'professional')
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_roles);
