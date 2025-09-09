import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, X, Plus, Loader2, Calendar, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import SkillSelector from "@/components/SkillSelector";

interface PortfolioProject {
  id?: string;
  title: string;
  description: string;
  technologies: string;
  skills: string[];
  images: string[];
  completionDate: string;
  projectUrl?: string;
  githubUrl?: string;
}

interface PortfolioProjectFormProps {
  project?: PortfolioProject;
  onSave: (project: PortfolioProject) => void;
  onCancel: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PortfolioProjectForm({ 
  project, 
  onSave, 
  onCancel, 
  isOpen, 
  onOpenChange 
}: PortfolioProjectFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<PortfolioProject>({
    title: project?.title || "",
    description: project?.description || "",
    technologies: project?.technologies || "",
    skills: project?.skills || [],
    images: project?.images || [],
    completionDate: project?.completionDate || "",
    projectUrl: project?.projectUrl || "",
    githubUrl: project?.githubUrl || "",
  });

  const [selectedSkills, setSelectedSkills] = useState<string[]>(formData.skills);

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      // Update form data with selected skills
      const updatedFormData = { ...formData, skills: selectedSkills };

      // For now, we'll store in user metadata. In a real app, you'd have a separate projects table
      const currentProjects = user.user_metadata?.portfolio_projects || [];
      let updatedProjects;

      if (project?.id) {
        // Update existing project
        updatedProjects = currentProjects.map((p: PortfolioProject) => 
          p.id === project.id ? { ...updatedFormData, id: project.id } : p
        );
      } else {
        // Add new project
        const newProject = {
          ...updatedFormData,
          id: Date.now().toString(), // Simple ID generation
        };
        updatedProjects = [...currentProjects, newProject];
      }

      const { error } = await supabase.auth.updateUser({
        data: {
          portfolio_projects: updatedProjects
        }
      });

      if (error) throw error;

      onSave(updatedFormData);
      onOpenChange(false);
      
      toast({
        title: "Project Saved",
        description: "Your portfolio project has been successfully saved.",
      });
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // For now, we'll create local URLs. In a real app, upload to Supabase Storage
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {project?.id ? "Edit Project" : "Add New Project"}
          </DialogTitle>
          <DialogDescription>
            Showcase your work by adding details about your projects and the skills you used.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="E.g., Modern Kitchen Renovation"
              />
            </div>
            <div>
              <Label htmlFor="technologies">Technologies Used *</Label>
              <Input
                id="technologies"
                value={formData.technologies}
                onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
                placeholder="E.g., Quartz Countertops + Custom Cabinets + LED Lighting"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Project Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your project, the work performed, materials used, and key features..."
              rows={4}
            />
          </div>

          {/* Skills Used */}
          <div>
            <Label>Skills Demonstrated</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Select the skills you used or developed while working on this project.
            </p>
            <SkillSelector
              selectedSkills={selectedSkills}
              onSkillsChange={setSelectedSkills}
              maxSkills={10}
            />
          </div>

          {/* Project Images */}
          <div>
            <Label>Project Images</Label>
            <p className="text-sm text-muted-foreground mb-3">
              Upload screenshots or images of your project (up to 5 images).
            </p>
            
            {/* Image Upload */}
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="project-images"
              />
              <label htmlFor="project-images" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload project images
                </p>
              </label>
            </div>

            {/* Display Uploaded Images */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Project image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Project Links */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="projectUrl">Live Project URL</Label>
              <Input
                id="projectUrl"
                value={formData.projectUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, projectUrl: e.target.value }))}
                placeholder="https://your-portfolio.com/project"
              />
            </div>
            <div>
              <Label htmlFor="githubUrl">Portfolio Gallery</Label>
              <Input
                id="githubUrl"
                value={formData.githubUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                placeholder="https://your-portfolio.com/gallery"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="completionDate">Completion Date *</Label>
            <Input
              id="completionDate"
              type="date"
              value={formData.completionDate}
              onChange={(e) => setFormData(prev => ({ ...prev, completionDate: e.target.value }))}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !formData.title || !formData.description || !formData.technologies || !formData.completionDate}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  {project?.id ? "Update Project" : "Add Project"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
