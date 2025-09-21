import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare, 
  FileText,
  Users,
  TrendingUp,
  Target,
  MapPin
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useUserRole } from "@/hooks/use-user-role";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import ProjectMilestones from "./ProjectMilestones";
import ProjectMessages from "./ProjectMessages";
import ProjectFiles from "./ProjectFiles";
import JobApplications from "./JobApplications";

interface Project {
  id: string;
  title: string;
  description: string;
  total_budget: number;
  status: string;
  start_date: string;
  end_date?: string;
  professional: {
    id: string;
    full_name: string;
    nickname: string;
    avatar_url?: string;
  };
  hirer: {
    id: string;
    full_name: string;
    nickname: string;
    avatar_url?: string;
  };
  milestones: Array<{
    id: string;
    title: string;
    amount: number;
    status: string;
    due_date?: string;
  }>;
}

export default function ProjectDashboard() {
  const { user } = useAuth();
  const { data: userRole } = useUserRole();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>('');

  const handleViewApplications = (jobId: string, jobTitle: string) => {
    setSelectedJobId(jobId);
    setSelectedJobTitle(jobTitle);
    setShowApplicationsModal(true);
  };

  // Fetch user's projects/jobs
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['user-projects', user?.id, userRole],
    queryFn: async () => {
      if (!user?.id) return [];
      
      try {
        if (userRole === 'hirer') {
          // For hirers, fetch their posted jobs
          const { data: jobs, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching hirer jobs:', error);
            return [];
          }

          // Transform jobs to project format
          return (jobs || []).map(job => ({
            id: job.id,
            title: job.title,
            description: job.description,
            status: job.status,
            budget: job.budget_max || job.budget_min || 0,
            currency: job.currency,
            location: job.location,
            skills: job.skills || [],
            created_at: job.created_at,
            updated_at: job.updated_at,
            project_duration: job.project_duration,
            remote_allowed: job.remote_allowed,
            // Add default professional and hirer objects to prevent undefined errors
            professional: {
              id: job.user_id || '',
              full_name: 'Professional',
              nickname: 'Professional',
              avatar_url: undefined
            },
            hirer: {
              id: job.user_id || '',
              full_name: 'Hirer',
              nickname: 'Hirer',
              avatar_url: undefined
            }
          }));
        } else {
          // For professionals, this would be their assigned projects
          // For now, return empty array since projects table doesn't exist yet
          console.log('Professional projects feature not yet implemented - returning empty array');
          return [];
        }
      } catch (err) {
        console.error('Exception fetching projects:', err);
        return [];
      }
    },
    enabled: !!user?.id,
  });

  // Calculate project statistics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalEarnings = projects
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + (p.budget || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'disputed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <TrendingUp className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      case 'disputed': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-muted rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Target className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-semibold mb-4">No Projects Yet</h3>
        <p className="text-muted-foreground mb-6 text-lg">
          {userRole === 'hirer' 
            ? "You haven't posted any jobs yet. Create your first job posting to find talented professionals!"
            : "You don't have any active projects. Apply for jobs to get started!"
          }
        </p>
        <div className="space-y-3">
          {userRole === 'professional' && (
            <Button asChild>
              <Link to="/">Browse Jobs</Link>
            </Button>
          )}
          {userRole === 'hirer' && (
            <Button asChild>
              <Link to="/post-job">Post a Job</Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              All time projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              Currently working
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects}</div>
            <p className="text-xs text-muted-foreground">
              Successfully finished
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalEarnings || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From all projects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(project.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(project.status)}
                    {project.status}
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Project Participants */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={project.professional?.avatar_url} />
                      <AvatarFallback>
                        {project.professional?.full_name?.charAt(0) || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{project.professional?.nickname || 'Professional'}</p>
                      <p className="text-xs text-muted-foreground">Professional</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={project.hirer?.avatar_url} />
                      <AvatarFallback>
                        {project.hirer?.full_name?.charAt(0) || 'H'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{project.hirer?.nickname || 'Hirer'}</p>
                      <p className="text-xs text-muted-foreground">Hirer</p>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {userRole === 'hirer' 
                        ? (project.budget_min && project.budget_max 
                            ? `${project.currency} ${(project.budget_min || 0).toLocaleString()} - ${(project.budget_max || 0).toLocaleString()}`
                            : project.budget 
                              ? `${project.currency} ${(project.budget || 0).toLocaleString()}`
                              : 'Budget not specified'
                          )
                        : `$${(project.total_budget || 0).toLocaleString()}`
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {userRole === 'hirer' 
                        ? (project.project_duration || 'No duration specified')
                        : new Date(project.start_date).toLocaleDateString()
                      }
                    </span>
                  </div>
                </div>

                {/* Additional details for hirer jobs */}
                {userRole === 'hirer' && (
                  <>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>Posted {new Date(project.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{project.remote_allowed ? 'Remote OK' : 'On-site'}</span>
                      </div>
                    </div>

                    {/* Location */}
                    {project.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{project.location}</span>
                      </div>
                    )}

                    {/* Skills */}
                    {project.skills && project.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {project.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Milestones Progress */}
                {project.milestones && project.milestones.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Milestones</span>
                      <span>
                        {project.milestones.filter(m => m.status === 'paid').length} / {project.milestones.length}
                      </span>
                    </div>
                    <Progress 
                      value={(project.milestones.filter(m => m.status === 'paid').length / project.milestones.length) * 100} 
                      className="h-2"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {userRole === 'hirer' ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleViewApplications(project.id, project.title)}
                        className="flex-1"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        View Applications
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/post-job?edit=${project.id}`}>
                          <FileText className="w-4 h-4 mr-2" />
                          Edit Job
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => setSelectedProject(project)}
                        className="flex-1"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/project/${project.id}`}>
                          <FileText className="w-4 h-4 mr-2" />
                          Manage
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedProject(null)}
                >
                  ✕
                </Button>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                  <TabsTrigger value="files">Files</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Project Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p><strong>Description:</strong> {selectedProject.description}</p>
                        <p><strong>Budget:</strong> ${(selectedProject.total_budget || 0).toLocaleString()}</p>
                        <p><strong>Status:</strong> 
                          <Badge className={`ml-2 ${getStatusColor(selectedProject.status)}`}>
                            {selectedProject.status}
                          </Badge>
                        </p>
                        <p><strong>Start Date:</strong> {new Date(selectedProject.start_date).toLocaleDateString()}</p>
                        {selectedProject.end_date && (
                          <p><strong>End Date:</strong> {new Date(selectedProject.end_date).toLocaleDateString()}</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Participants</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={selectedProject.professional?.avatar_url} />
                            <AvatarFallback>
                              {selectedProject.professional?.full_name?.charAt(0) || 'P'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{selectedProject.professional?.nickname || 'Professional'}</p>
                            <p className="text-sm text-muted-foreground">Professional</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={selectedProject.hirer?.avatar_url} />
                            <AvatarFallback>
                              {selectedProject.hirer?.full_name?.charAt(0) || 'H'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{selectedProject.hirer?.nickname || 'Hirer'}</p>
                            <p className="text-sm text-muted-foreground">Hirer</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="milestones">
                  <ProjectMilestones projectId={selectedProject.id} />
                </TabsContent>

                <TabsContent value="messages">
                  <ProjectMessages projectId={selectedProject.id} />
                </TabsContent>

                <TabsContent value="files">
                  <ProjectFiles projectId={selectedProject.id} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}

      {/* Job Applications Modal */}
      {selectedJobId && (
        <JobApplications
          jobId={selectedJobId}
          jobTitle={selectedJobTitle}
          isOpen={showApplicationsModal}
          onClose={() => {
            setShowApplicationsModal(false);
            setSelectedJobId(null);
            setSelectedJobTitle('');
          }}
        />
      )}
    </div>
  );
}
