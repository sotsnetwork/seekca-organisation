-- Allow job owners to view their own jobs (including non-active statuses)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE polname = 'Job owners can view their jobs' AND tablename = 'jobs'
  ) THEN
    CREATE POLICY "Job owners can view their jobs"
    ON public.jobs
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
END $$;


