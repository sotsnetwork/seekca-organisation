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
  'Electrician Needed for Home Wiring',
  'We need a licensed electrician to install new electrical outlets and upgrade our home wiring system. Must have experience with residential electrical work and proper safety protocols.',
  80.00,
  150.00,
  'USD',
  ARRAY['Electrical Work', 'Home Wiring', 'Outlet Installation', 'Safety Compliance'],
  'New York, NY',
  true,
  '2-4 weeks',
  'active'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Interior Designer for Home Renovation',
  'Seeking a talented interior designer to help redesign our living room and kitchen. Must have experience with space planning, color schemes, and furniture selection.',
  100.00,
  200.00,
  'USD',
  ARRAY['Interior Design', 'Space Planning', 'Color Schemes', 'Furniture Selection'],
  'San Francisco, CA',
  true,
  '3-6 weeks',
  'active'
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'Plumber for Bathroom Renovation',
  'Need an experienced plumber to install new fixtures and update plumbing for our bathroom renovation. Must have experience with residential plumbing and local building codes.',
  70.00,
  130.00,
  'USD',
  ARRAY['Plumbing', 'Bathroom Renovation', 'Fixture Installation', 'Building Codes'],
  'London, UK',
  false,
  '4-8 weeks',
  'active'
);
