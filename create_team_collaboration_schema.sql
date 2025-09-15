-- Team Collaboration Feature Database Schema
-- This script creates all necessary tables for team collaboration functionality

-- 1. Add profile visibility settings to existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'professionals_only', 'private')),
ADD COLUMN IF NOT EXISTS collaboration_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2);

-- 2. Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    skills TEXT[] NOT NULL,
    organizer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    team_avatar_url TEXT,
    location VARCHAR(255),
    website_url TEXT,
    portfolio_url TEXT
);

-- 3. Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('organizer', 'co_organizer', 'member')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_skills TEXT[],
    UNIQUE(team_id, user_id)
);

-- 4. Create team_invitations table
CREATE TABLE IF NOT EXISTS public.team_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    inviter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    invitee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    UNIQUE(team_id, invitee_id)
);

-- 5. Create team_messages table for team chat
CREATE TABLE IF NOT EXISTS public.team_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'system')),
    file_url TEXT,
    file_name TEXT,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    edited_at TIMESTAMP WITH TIME ZONE,
    is_edited BOOLEAN DEFAULT false
);

-- 6. Create team_projects table (for team project history)
CREATE TABLE IF NOT EXISTS public.team_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    client_name VARCHAR(255),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'in_progress', 'cancelled')),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teams_organizer_id ON public.teams(organizer_id);
CREATE INDEX IF NOT EXISTS idx_teams_skills ON public.teams USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_teams_is_active ON public.teams(is_active);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON public.team_members(status);
CREATE INDEX IF NOT EXISTS idx_team_invitations_team_id ON public.team_invitations(team_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_invitee_id ON public.team_invitations(invitee_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_status ON public.team_invitations(status);
CREATE INDEX IF NOT EXISTS idx_team_messages_team_id ON public.team_messages(team_id);
CREATE INDEX IF NOT EXISTS idx_team_messages_created_at ON public.team_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_visibility ON public.profiles(visibility);
CREATE INDEX IF NOT EXISTS idx_profiles_collaboration_enabled ON public.profiles(collaboration_enabled);

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_projects ENABLE ROW LEVEL SECURITY;

-- 9. Create RLS policies for teams
-- Teams are visible to all authenticated users (for hirers to browse)
CREATE POLICY "Teams are viewable by authenticated users" ON public.teams
    FOR SELECT TO authenticated USING (true);

-- Only team organizers can update their teams
CREATE POLICY "Team organizers can update their teams" ON public.teams
    FOR UPDATE TO authenticated USING (auth.uid() = organizer_id);

-- Only team organizers can delete their teams
CREATE POLICY "Team organizers can delete their teams" ON public.teams
    FOR DELETE TO authenticated USING (auth.uid() = organizer_id);

-- Anyone can create teams (professionals only)
CREATE POLICY "Authenticated users can create teams" ON public.teams
    FOR INSERT TO authenticated WITH CHECK (true);

-- 10. Create RLS policies for team_members
-- Team members can view their team's members
CREATE POLICY "Team members can view team members" ON public.team_members
    FOR SELECT TO authenticated USING (
        team_id IN (
            SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
        )
    );

-- Team organizers can manage team members
CREATE POLICY "Team organizers can manage team members" ON public.team_members
    FOR ALL TO authenticated USING (
        team_id IN (
            SELECT id FROM public.teams WHERE organizer_id = auth.uid()
        )
    );

-- 11. Create RLS policies for team_invitations
-- Users can view invitations sent to them
CREATE POLICY "Users can view their invitations" ON public.team_invitations
    FOR SELECT TO authenticated USING (invitee_id = auth.uid());

-- Team organizers can view invitations for their teams
CREATE POLICY "Team organizers can view team invitations" ON public.team_invitations
    FOR SELECT TO authenticated USING (
        team_id IN (
            SELECT id FROM public.teams WHERE organizer_id = auth.uid()
        )
    );

-- Team organizers can create invitations
CREATE POLICY "Team organizers can create invitations" ON public.team_invitations
    FOR INSERT TO authenticated WITH CHECK (
        team_id IN (
            SELECT id FROM public.teams WHERE organizer_id = auth.uid()
        )
    );

-- Users can update their own invitation responses
CREATE POLICY "Users can respond to invitations" ON public.team_invitations
    FOR UPDATE TO authenticated USING (invitee_id = auth.uid());

-- 12. Create RLS policies for team_messages
-- Team members can view and send messages
CREATE POLICY "Team members can view messages" ON public.team_messages
    FOR SELECT TO authenticated USING (
        team_id IN (
            SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Team members can send messages" ON public.team_messages
    FOR INSERT TO authenticated WITH CHECK (
        team_id IN (
            SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
        )
    );

-- 13. Create RLS policies for team_projects
-- Team members can view team projects
CREATE POLICY "Team members can view team projects" ON public.team_projects
    FOR SELECT TO authenticated USING (
        team_id IN (
            SELECT team_id FROM public.team_members WHERE user_id = auth.uid()
        )
    );

-- Team organizers can manage team projects
CREATE POLICY "Team organizers can manage team projects" ON public.team_projects
    FOR ALL TO authenticated USING (
        team_id IN (
            SELECT id FROM public.teams WHERE organizer_id = auth.uid()
        )
    );

-- 14. Create functions for team management
-- Function to get user's teams
CREATE OR REPLACE FUNCTION public.get_user_teams(user_uuid UUID)
RETURNS TABLE (
    team_id UUID,
    team_name VARCHAR,
    role VARCHAR,
    status VARCHAR,
    member_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id as team_id,
        t.name as team_name,
        tm.role,
        tm.status,
        COUNT(tm2.user_id) as member_count
    FROM public.teams t
    JOIN public.team_members tm ON t.id = tm.team_id
    LEFT JOIN public.team_members tm2 ON t.id = tm2.team_id AND tm2.status = 'active'
    WHERE tm.user_id = user_uuid
    GROUP BY t.id, t.name, tm.role, tm.status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get team members with profiles
CREATE OR REPLACE FUNCTION public.get_team_members(team_uuid UUID)
RETURNS TABLE (
    user_id UUID,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    role VARCHAR,
    status VARCHAR,
    skills TEXT[],
    joined_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tm.user_id,
        p.full_name,
        p.email,
        p.avatar_url,
        tm.role,
        tm.status,
        p.skills,
        tm.joined_at
    FROM public.team_members tm
    JOIN public.profiles p ON tm.user_id = p.user_id
    WHERE tm.team_id = team_uuid
    ORDER BY tm.joined_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can invite to team
CREATE OR REPLACE FUNCTION public.can_invite_to_team(team_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    is_organizer BOOLEAN;
    is_member BOOLEAN;
BEGIN
    -- Check if user is organizer
    SELECT EXISTS(
        SELECT 1 FROM public.teams 
        WHERE id = team_uuid AND organizer_id = user_uuid
    ) INTO is_organizer;
    
    -- Check if user is already a member
    SELECT EXISTS(
        SELECT 1 FROM public.team_members 
        WHERE team_id = team_uuid AND user_id = user_uuid AND status = 'active'
    ) INTO is_member;
    
    RETURN is_organizer AND NOT is_member;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON public.teams
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 16. Create view for team search (for hirers)
CREATE OR REPLACE VIEW public.team_search_view AS
SELECT 
    t.id,
    t.name,
    t.description,
    t.skills,
    t.location,
    t.team_avatar_url,
    t.created_at,
    COUNT(tm.user_id) as member_count,
    ARRAY_AGG(DISTINCT p.full_name) FILTER (WHERE p.full_name IS NOT NULL) as member_names,
    ARRAY_AGG(DISTINCT p.skills) FILTER (WHERE p.skills IS NOT NULL) as all_skills
FROM public.teams t
LEFT JOIN public.team_members tm ON t.id = tm.team_id AND tm.status = 'active'
LEFT JOIN public.profiles p ON tm.user_id = p.user_id
WHERE t.is_active = true
GROUP BY t.id, t.name, t.description, t.skills, t.location, t.team_avatar_url, t.created_at;

-- Grant access to the view
GRANT SELECT ON public.team_search_view TO authenticated;
