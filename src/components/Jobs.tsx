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

  // Mock job data - in a real app, this would come from your Supabase database
  const mockJobs: Job[] = [
    {
      id: "1",
      title: "Full-Stack Web Developer Needed for E-commerce Platform",
      description: "We're looking for an experienced full-stack developer to help build a modern e-commerce platform. The project involves React frontend, Node.js backend, and PostgreSQL database. You'll work with our team to implement features like user authentication, product catalog, shopping cart, payment integration, and admin dashboard.",
      budget_min: 5000,
      budget_max: 15000,
      currency: "$",
      skills: ["React", "Node.js", "PostgreSQL", "TypeScript", "Stripe API", "AWS"],
      location: "Remote",
      remote_allowed: true,
      experience_level: "intermediate",
      project_duration: "3-6 months",
      status: "active",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z"
    },
    {
      id: "2",
      title: "Mobile App Developer - React Native",
      description: "Seeking a skilled React Native developer to create a cross-platform mobile app for our fitness startup. The app will include user profiles, workout tracking, social features, and in-app purchases. Experience with Firebase and Redux is preferred.",
      budget_min: 8000,
      budget_max: 20000,
      currency: "$",
      skills: ["React Native", "JavaScript", "Firebase", "Redux", "iOS", "Android"],
      location: "San Francisco, CA",
      remote_allowed: true,
      experience_level: "intermediate",
      project_duration: "4-8 months",
      status: "active",
      created_at: "2024-01-14T14:20:00Z",
      updated_at: "2024-01-14T14:20:00Z"
    },
    {
      id: "3",
      title: "UI/UX Designer for SaaS Dashboard",
      description: "We need a creative UI/UX designer to redesign our SaaS dashboard interface. The project involves user research, wireframing, prototyping, and creating a design system. Experience with Figma and user testing is essential.",
      budget_min: 3000,
      budget_max: 8000,
      currency: "$",
      skills: ["UI Design", "UX Research", "Figma", "Prototyping", "Design Systems", "User Testing"],
      location: "New York, NY",
      remote_allowed: true,
      experience_level: "intermediate",
      project_duration: "2-4 months",
      status: "active",
      created_at: "2024-01-13T09:15:00Z",
      updated_at: "2024-01-13T09:15:00Z"
    },
    {
      id: "4",
      title: "DevOps Engineer - AWS Infrastructure",
      description: "Looking for a DevOps engineer to help migrate our infrastructure to AWS and set up CI/CD pipelines. Experience with Docker, Kubernetes, Terraform, and monitoring tools is required. This is a contract position with potential for full-time conversion.",
      budget_min: 6000,
      budget_max: 12000,
      currency: "$",
      skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Monitoring"],
      location: "Austin, TX",
      remote_allowed: true,
      experience_level: "expert",
      project_duration: "2-3 months",
      status: "active",
      created_at: "2024-01-12T16:45:00Z",
      updated_at: "2024-01-12T16:45:00Z"
    },
    {
      id: "5",
      title: "Content Marketing Specialist",
      description: "We're seeking a content marketing specialist to develop and execute our content strategy. You'll create blog posts, social media content, email campaigns, and case studies. Experience with SEO and analytics tools is preferred.",
      budget_min: 2000,
      budget_max: 5000,
      currency: "$",
      skills: ["Content Writing", "SEO", "Social Media", "Email Marketing", "Analytics", "WordPress"],
      location: "Remote",
      remote_allowed: true,
      experience_level: "entry",
      project_duration: "3-6 months",
      status: "active",
      created_at: "2024-01-11T11:30:00Z",
      updated_at: "2024-01-11T11:30:00Z"
    },
    {
      id: "6",
      title: "Data Scientist - Machine Learning Project",
      description: "Join our team to build a recommendation engine for our e-commerce platform. You'll work with large datasets, implement machine learning algorithms, and create data pipelines. Experience with Python, TensorFlow, and cloud platforms is required.",
      budget_min: 10000,
      budget_max: 25000,
      currency: "$",
      skills: ["Python", "Machine Learning", "TensorFlow", "Pandas", "SQL", "AWS"],
      location: "Seattle, WA",
      remote_allowed: true,
      experience_level: "expert",
      project_duration: "6-12 months",
      status: "active",
      created_at: "2024-01-10T13:20:00Z",
      updated_at: "2024-01-10T13:20:00Z"
    },
    {
      id: "7",
      title: "WordPress Developer - Custom Theme",
      description: "We need a WordPress developer to create a custom theme for our corporate website. The theme should be responsive, SEO-friendly, and include custom post types and page builders integration.",
      budget_min: 1500,
      budget_max: 4000,
      currency: "$",
      skills: ["WordPress", "PHP", "CSS", "JavaScript", "SEO", "Responsive Design"],
      location: "Chicago, IL",
      remote_allowed: true,
      experience_level: "intermediate",
      project_duration: "1-2 months",
      status: "active",
      created_at: "2024-01-09T08:45:00Z",
      updated_at: "2024-01-09T08:45:00Z"
    },
    {
      id: "8",
      title: "Blockchain Developer - Smart Contracts",
      description: "Looking for a blockchain developer to create smart contracts for our DeFi project. Experience with Solidity, Web3.js, and Ethereum development is required. Knowledge of DeFi protocols is a plus.",
      budget_min: 12000,
      budget_max: 30000,
      currency: "$",
      skills: ["Solidity", "Web3.js", "Ethereum", "DeFi", "Smart Contracts", "Truffle"],
      location: "Remote",
      remote_allowed: true,
      experience_level: "expert",
      project_duration: "4-8 months",
      status: "active",
      created_at: "2024-01-08T15:10:00Z",
      updated_at: "2024-01-08T15:10:00Z"
    },
    {
      id: "9",
      title: "Video Editor - YouTube Content",
      description: "We need a creative video editor to produce engaging YouTube content for our tech channel. You'll edit tutorials, product reviews, and educational content. Experience with Adobe Premiere Pro and After Effects is required.",
      budget_min: 1000,
      budget_max: 3000,
      currency: "$",
      skills: ["Video Editing", "Adobe Premiere Pro", "After Effects", "Motion Graphics", "Color Grading"],
      location: "Los Angeles, CA",
      remote_allowed: true,
      experience_level: "intermediate",
      project_duration: "2-4 months",
      status: "active",
      created_at: "2024-01-07T12:25:00Z",
      updated_at: "2024-01-07T12:25:00Z"
    },
    {
      id: "10",
      title: "Cybersecurity Consultant",
      description: "We're looking for a cybersecurity consultant to conduct a security audit of our web application and provide recommendations for improvement. Experience with penetration testing and security frameworks is required.",
      budget_min: 5000,
      budget_max: 10000,
      currency: "$",
      skills: ["Cybersecurity", "Penetration Testing", "OWASP", "Security Auditing", "Risk Assessment"],
      location: "Remote",
      remote_allowed: true,
      experience_level: "expert",
      project_duration: "1-2 months",
      status: "active",
      created_at: "2024-01-06T10:15:00Z",
      updated_at: "2024-01-06T10:15:00Z"
    }
  ];

  // Filter mock jobs based on search criteria
  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = !searchTerm || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = !locationFilter || 
      job.location?.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesSkill = !skillFilter || 
      job.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()));
    
    const matchesExperience = !experienceFilter || 
      experienceFilter === 'all' || 
      job.experience_level === experienceFilter;
    
    return matchesSearch && matchesLocation && matchesSkill && matchesExperience;
  });

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs', searchTerm, locationFilter, skillFilter, experienceFilter],
    queryFn: async () => {
      // In a real app, you would query Supabase here
      // For now, we'll use mock data
      return filteredJobs;
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