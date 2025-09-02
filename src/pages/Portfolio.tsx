import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Edit, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export default function Portfolio() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please sign in to view your portfolio.</p>
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">Portfolio</h1>
              <p className="text-muted-foreground">Showcase your work and projects</p>
            </div>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Portfolio Items */}
          <Card className="group hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
              <div className="text-muted-foreground text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Eye className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm">Project Screenshot</p>
              </div>
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">E-commerce Platform</CardTitle>
                  <CardDescription>React + Node.js + MongoDB</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                A full-stack e-commerce platform with real-time inventory management, user authentication, and payment processing.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">React</Badge>
                <Badge variant="outline">Node.js</Badge>
                <Badge variant="outline">MongoDB</Badge>
                <Badge variant="outline">Stripe</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completed: Dec 2024</span>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
              <div className="text-muted-foreground text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Eye className="w-8 h-8 text-secondary" />
                </div>
                <p className="text-sm">Project Screenshot</p>
              </div>
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Task Management App</CardTitle>
                  <CardDescription>Vue.js + Firebase</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                A collaborative task management application with real-time updates, team collaboration, and progress tracking.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">Vue.js</Badge>
                <Badge variant="outline">Firebase</Badge>
                <Badge variant="outline">Vuex</Badge>
                <Badge variant="outline">Tailwind</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completed: Nov 2024</span>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
              <div className="text-muted-foreground text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Eye className="w-8 h-8 text-accent" />
                </div>
                <p className="text-sm">Project Screenshot</p>
              </div>
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Weather Dashboard</CardTitle>
                  <CardDescription>React + OpenWeather API</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                A weather dashboard application with location-based forecasts, interactive maps, and weather alerts.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">React</Badge>
                <Badge variant="outline">OpenWeather API</Badge>
                <Badge variant="outline">Chart.js</Badge>
                <Badge variant="outline">Geolocation</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completed: Oct 2024</span>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p className="text-sm">Start building your portfolio by adding your first project.</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Project
          </Button>
        </div>
      </div>
    </div>
  );
}