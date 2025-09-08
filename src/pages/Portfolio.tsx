import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Eye, ExternalLink, Github, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import ProfileNavigation from "@/components/ProfileNavigation";
import PortfolioProjectForm from "@/components/PortfolioProjectForm";
import { useToast } from "@/hooks/use-toast";

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  technologies: string;
  skills: string[];
  images: string[];
  completionDate: string;
  projectUrl?: string;
  githubUrl?: string;
}

export default function Portfolio() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | undefined>();

  // Get projects from user metadata
  const projects: PortfolioProject[] = user?.user_metadata?.portfolio_projects || [];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please sign in to view your portfolio.</p>
          <Button asChild>
            <a href="/auth">Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddProject = () => {
    setEditingProject(undefined);
    setIsFormOpen(true);
  };

  const handleEditProject = (project: PortfolioProject) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleSaveProject = (project: PortfolioProject) => {
    setIsFormOpen(false);
    setEditingProject(undefined);
    // The form component handles the actual saving
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingProject(undefined);
  };

  return (
    <div className="min-h-screen bg-background">
      <ProfileNavigation />
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Portfolio</h1>
            <p className="text-muted-foreground">Showcase your work and projects</p>
          </div>
          <Button onClick={handleAddProject}>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>

        {/* Portfolio Grid */}
        {projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-shadow">
                {/* Project Image */}
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  {project.images.length > 0 ? (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-muted-foreground text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Eye className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-sm">No Image</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription>{project.technologies}</CardDescription>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleEditProject(project)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  {/* Skills Used */}
                  {project.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {project.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {/* Project Links and Date */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Completed: {new Date(project.completionDate).toLocaleDateString()}</span>
                    </div>
                    
                    {/* Project Links */}
                    <div className="flex gap-2">
                      {project.projectUrl && (
                        <Button variant="outline" size="sm" asChild className="flex-1">
                          <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button variant="outline" size="sm" asChild className="flex-1">
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 mr-2" />
                            Code
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium mb-2">No projects yet</h3>
              <p className="text-sm">Start building your portfolio by adding your first project.</p>
            </div>
            <Button onClick={handleAddProject}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Project
            </Button>
          </div>
        )}

        {/* Portfolio Project Form */}
        <PortfolioProjectForm
          project={editingProject}
          onSave={handleSaveProject}
          onCancel={handleCancelForm}
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
        />
      </div>
    </div>
  );
}