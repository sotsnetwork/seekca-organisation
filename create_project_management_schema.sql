-- Project Management System Schema for SeekCa
-- Run this SQL in your Supabase SQL Editor

-- 1. Job Applications Table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL,
  professional_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hirer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cover_letter TEXT,
  proposed_rate DECIMAL(10,2),
  estimated_duration INTEGER, -- in days
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, professional_id)
);

-- 2. Projects Table (created when application is accepted)
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE UNIQUE NOT NULL,
  job_id UUID NOT NULL,
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

-- 3. Project Milestones Table
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

-- 4. Project Messages Table (for project-specific discussions)
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

-- 5. Project Files Table (for file sharing)
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

-- 6. Payment Records Table
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

-- Create Indexes for Performance
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
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job_applications
CREATE POLICY "Users can view applications for their jobs" ON job_applications
  FOR SELECT USING (
    hirer_id = auth.uid() OR 
    professional_id = auth.uid()
  );

CREATE POLICY "Professionals can create applications" ON job_applications
  FOR INSERT WITH CHECK (professional_id = auth.uid());

CREATE POLICY "Hirers can update application status" ON job_applications
  FOR UPDATE USING (hirer_id = auth.uid());

-- RLS Policies for projects
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

-- RLS Policies for project_milestones
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

-- RLS Policies for project_messages
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

-- RLS Policies for project_files
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

-- RLS Policies for payment_records
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
