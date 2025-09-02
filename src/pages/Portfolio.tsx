import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Eye, Edit, Trash2, Upload, ExternalLink } from "lucide-react";
import { useState } from "react";

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState("projects");

  const projects = [
    {
      id: 1,
      title: "Modern Office Building Design",
      category: "Architecture",
      description: "Complete architectural design for a 15-story office building with sustainable features.",
      image: "/placeholder.svg",
      client: "TechCorp Solutions",
      completedDate: "March 2024",
      budget: "$2.5M",
      status: "Completed",
      skills: ["AutoCAD", "3D Modeling", "Sustainable Design"]
    },
    {
      id: 2,
      title: "Residential Complex Wiring",
      category: "Electrical",
      description: "Complete electrical installation for a 50-unit residential complex.",
      image: "/placeholder.svg",
      client: "Green Valley Homes",
      completedDate: "January 2024",
      budget: "$180K",
      status: "Completed",
      skills: ["Electrical Installation", "Circuit Design", "Code Compliance"]
    },
    {
      id: 3,
      title: "Smart Home Automation",
      category: "Technology",
      description: "IoT-based home automation system with energy monitoring.",
      image: "/placeholder.svg",
      client: "Private Client",
      completedDate: "February 2024",
      budget: "$45K",
      status: "Completed",
      skills: ["IoT", "Smart Systems", "Energy Management"]
    }
  ];

  const certifications = [
    {
      id: 1,
      title: "Licensed Professional Engineer",
      issuer: "State Engineering Board",
      date: "2020",
      expiryDate: "2025",
      credential: "PE-12345"
    },
    {
      id: 2,
      title: "LEED Accredited Professional",
      issuer: "Green Building Certification Institute",
      date: "2021",
      expiryDate: "2026",
      credential: "LEED-AP-67890"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Portfolio</h1>
            <p className="text-muted-foreground">Showcase your work and achievements</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="add-project">Add Project</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="group hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-1">
                        <Button size="sm" variant="secondary">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary">{project.category}</Badge>
                      <Badge variant={project.status === 'Completed' ? 'secondary' : 'outline'}>
                        {project.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Client:</span>
                        <span>{project.client}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Budget:</span>
                        <span className="font-medium">{project.budget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completed:</span>
                        <span>{project.completedDate}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {project.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {certifications.map((cert) => (
                <Card key={cert.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{cert.title}</CardTitle>
                        <CardDescription>{cert.issuer}</CardDescription>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Issued:</span>
                        <span>{cert.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expires:</span>
                        <span>{cert.expiryDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Credential ID:</span>
                        <span className="font-mono text-xs">{cert.credential}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="add-project" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Project</CardTitle>
                <CardDescription>Showcase your latest work to potential clients</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectTitle">Project Title</Label>
                    <Input id="projectTitle" placeholder="Enter project title" />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" placeholder="e.g., Architecture, Engineering" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe your project..." rows={4} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client">Client</Label>
                    <Input id="client" placeholder="Client name" />
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget</Label>
                    <Input id="budget" placeholder="Project budget" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="skills">Skills Used</Label>
                  <Input id="skills" placeholder="Enter skills separated by commas" />
                </div>
                <div>
                  <Label>Project Images</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop images here, or click to select files
                    </p>
                    <Button variant="outline" className="mt-2">
                      Choose Files
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button>Save Project</Button>
                  <Button variant="outline">Save as Draft</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}