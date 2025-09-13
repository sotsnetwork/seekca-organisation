-- Create jobs table for SeekCa
-- Run this SQL in your Supabase SQL Editor

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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS jobs_hirer_id_idx ON jobs(hirer_id);
CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs(status);
CREATE INDEX IF NOT EXISTS jobs_created_at_idx ON jobs(created_at);
CREATE INDEX IF NOT EXISTS jobs_skills_idx ON jobs USING GIN(skills);

-- Enable Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample jobs for testing
INSERT INTO jobs (hirer_id, title, description, budget_min, budget_max, currency, skills, location, remote_allowed, project_duration, status) VALUES
(
  (SELECT id FROM auth.users LIMIT 1), -- This will use the first user as hirer
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
