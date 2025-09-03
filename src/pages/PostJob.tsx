import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Briefcase, MapPin, DollarSign, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export default function PostJob() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    budget: '',
    duration: '',
    requirements: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // TODO: Implement actual job posting logic with Supabase
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ 
        type: 'success', 
        text: 'Job posted successfully! Professionals will be able to see and apply for your opportunity.' 
      });
      
      // Clear form
      setJobData({
        title: '',
        description: '',
        category: '',
        location: '',
        budget: '',
        duration: '',
        requirements: ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to post job. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setJobData(prev => ({ ...prev, [field]: value }));
  };

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to post jobs.
            </p>
            <Button asChild className="w-full">
              <Link to="/auth">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
            Post a New Job
          </h1>
          <p className="text-xl text-muted-foreground">
            Find the perfect professional for your project. Describe your needs and get matched with qualified experts.
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        {/* Job Posting Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Job Details
            </CardTitle>
            <CardDescription>
              Provide comprehensive information about your project to attract the right professionals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Home Renovation Specialist Needed"
                    value={jobData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Service Category *</Label>
                  <Select value={jobData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                                                              <SelectContent>
                        <SelectItem value="exterior">Exterior Home Care</SelectItem>
                        <SelectItem value="cleaning">Cleaning & Organization</SelectItem>
                        <SelectItem value="repairs">Home Repairs & Maintenance</SelectItem>
                        <SelectItem value="renovations">Renovations & Upgrades</SelectItem>
                        <SelectItem value="landscaping">Landscaping & Outdoor Services</SelectItem>
                        <SelectItem value="installation">Installation & Assembly</SelectItem>
                        <SelectItem value="pest">Pest Control</SelectItem>
                        <SelectItem value="architecture">Architecture & Design</SelectItem>
                        <SelectItem value="surveying">Surveying & Engineering</SelectItem>
                        <SelectItem value="automotive">Automotive & Mechanical</SelectItem>
                        <SelectItem value="welding">Welding & Metalwork</SelectItem>
                        <SelectItem value="construction">Construction & Trades</SelectItem>
                        <SelectItem value="specialized">Specialized Services</SelectItem>
                        <SelectItem value="trending">Trending Services</SelectItem>
                        <SelectItem value="events">Events</SelectItem>
                        <SelectItem value="wellness">Health & Wellness</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="location"
                      placeholder="e.g., Lagos, Nigeria"
                      value={jobData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="budget">Budget Range *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="budget"
                      placeholder="e.g., $500 - $2000"
                      value={jobData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="duration">Project Duration</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="duration"
                    placeholder="e.g., 2-3 weeks"
                    value={jobData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project in detail. Include specific requirements, timeline, and any special considerations..."
                  value={jobData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <div>
                <Label htmlFor="requirements">Professional Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="What qualifications, experience, or certifications are you looking for? (Optional)"
                  value={jobData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Posting Job..." : "Post Job"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link to="/">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
