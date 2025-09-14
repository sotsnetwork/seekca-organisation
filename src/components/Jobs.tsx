import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, DollarSign, Search, Filter, Clock, Briefcase, Shield, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import JobApplication from "./JobApplication";

interface Job {
  id: string;
  title: string;
  description: string;
  budget_min: number | null;
  budget_max: number | null;
  currency: string;
  skills: string[];
  location: string | null;
  remote_allowed: boolean;
  project_duration: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  hirer: {
    id: string;
    full_name: string;
    nickname: string;
    avatar_url?: string;
  };
}

export default function Jobs() {
  const { user } = useAuth();
  const { data: userRole, isLoading: roleLoading } = useUserRole();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  

  // Jobs will be fetched from Supabase database

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs', searchTerm, locationFilter, skillFilter],
    queryFn: async () => {
      try {
        let query = supabase
          .from('jobs')
          .select(`
            *,
            hirer:profiles!jobs_user_id_fkey(full_name, nickname, avatar_url)
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (searchTerm) {
          query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
        }

        if (locationFilter) {
          query = query.ilike('location', `%${locationFilter}%`);
        }

        if (skillFilter) {
          query = query.contains('skills', [skillFilter]);
        }

        const { data, error } = await query;
        
        if (error) {
          console.error('Database query error (this is expected if jobs table doesn\'t exist yet):', error);
          return [];
        }
        
        return (data || []).map(job => {
          // Safely handle potentially null hirer data
          let hirerData;
          if (job.hirer !== null && typeof job.hirer === 'object' && !('error' in job.hirer)) {
            hirerData = job.hirer;
          } else {
            hirerData = { id: job.user_id, full_name: 'Hirer', nickname: 'Hirer' };
          }
          
          return {
            ...job,
            hirer: hirerData
          };
        }) as Job[];
      } catch (err) {
        console.error('Error fetching jobs (this is expected if database tables don\'t exist yet):', err);
        return [];
      }
    },
    enabled: !!user,
  });

  const formatBudget = (min: number | null, max: number | null, currency: string) => {
    if (!min && !max) return "Budget not specified";
    if (min && max) return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `${currency} ${min.toLocaleString()}+`;
    if (max) return `Up to ${currency} ${max.toLocaleString()}`;
    return "Budget not specified";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading job opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-4">Database Setup Required</h3>
          <p className="text-muted-foreground mb-6">
            The jobs table hasn't been created yet. Please run the database setup script in your Supabase dashboard.
          </p>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Setup Steps:</strong>
            </p>
            <ol className="text-sm text-left text-muted-foreground space-y-1">
              <li>1. Go to your Supabase dashboard</li>
              <li>2. Navigate to SQL Editor</li>
              <li>3. Run the create_jobs_table.sql script</li>
              <li>4. Refresh this page</li>
            </ol>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while checking user role
  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Restrict access to professionals only
  if (userRole !== 'professional') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-4">Access Restricted</h2>
            <p className="text-muted-foreground mb-6">
              Only professionals can browse jobs. Hirers can post jobs and manage their listings instead.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/post-job">Post a Job</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/profile">Update Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Find Your Next Project
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover exciting opportunities from companies worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-lg border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input
              placeholder="Skill"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {jobs && jobs.length > 0 ? (
            jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {formatBudget(job.budget_min, job.budget_max, job.currency)}
                        </div>
                        {job.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                            {job.remote_allowed && " (Remote OK)"}
                          </div>
                        )}
                        {job.project_duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.project_duration}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        Posted {formatDate(job.created_at)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-4 line-clamp-3">
                    {job.description}
                  </p>
                  
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {job.remote_allowed && (
                        <Badge variant="outline">Remote Friendly</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Save
                      </Button>
                      <JobApplication 
                        job={{
                          id: job.id,
                          title: job.title,
                          description: job.description,
                          budget: job.budget_max || job.budget_min || 0,
                          location: job.location || '',
                          skills_required: job.skills || [],
                          created_at: job.created_at,
                          hirer: job.hirer
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">No job opportunities yet</h3>
                <p className="text-muted-foreground mb-6 text-lg">
                  We're working on bringing you the best job opportunities. Check back soon or complete your profile to get notified when jobs are posted!
                </p>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Tip:</strong> Complete your professional profile to be the first to know about new opportunities
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                      <Link to="/profile">Complete Profile</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/settings">Notification Settings</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}