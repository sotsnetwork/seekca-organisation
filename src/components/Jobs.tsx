import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, DollarSign, Search, Filter, Users, Clock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

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
  experience_level: string | null;
  project_duration: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function Jobs() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs', searchTerm, locationFilter, skillFilter, experienceFilter],
    queryFn: async () => {
      let query = supabase
        .from('jobs')
        .select('*')
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

      if (experienceFilter) {
        query = query.eq('experience_level', experienceFilter);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Job[];
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
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading jobs</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
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
            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Experience Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
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
                        {job.experience_level && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {job.experience_level}
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
                      <Button size="sm">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or check back later for new opportunities.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setLocationFilter("");
                    setSkillFilter("");
                    setExperienceFilter("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}