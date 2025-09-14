import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Clock, 
  DollarSign, 
  Calendar,
  User,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  skills_required: string[];
  created_at: string;
  hirer: {
    id: string;
    full_name: string;
    nickname: string;
    avatar_url?: string;
  };
}

interface JobApplicationProps {
  job: Job;
  onApplicationSubmitted?: () => void;
}

export default function JobApplication({ job, onApplicationSubmitted }: JobApplicationProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    cover_letter: '',
    proposed_rate: '',
    estimated_duration: ''
  });

  // Mock application status for now since job_applications table doesn't exist
  const existingApplication = null;

  // Submit application mutation - mock for now
  const submitApplicationMutation = useMutation({
    mutationFn: async (applicationData: {
      cover_letter: string;
      proposed_rate: number;
      estimated_duration: number;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Mock submission - replace with real implementation when job_applications table exists
      console.log('Mock application submitted:', applicationData);
      return { id: 'mock-id', ...applicationData };
    },
    onSuccess: () => {
      setIsDialogOpen(false);
      setFormData({ cover_letter: '', proposed_rate: '', estimated_duration: '' });
      
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted (mock).",
      });
      
      onApplicationSubmitted?.();
    },
    onError: (error) => {
      toast({
        title: "Application Error", 
        description: `Failed to submit application: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cover_letter.trim() || !formData.proposed_rate || !formData.estimated_duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    submitApplicationMutation.mutate({
      cover_letter: formData.cover_letter.trim(),
      proposed_rate: parseFloat(formData.proposed_rate),
      estimated_duration: parseInt(formData.estimated_duration)
    });
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApplicationStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      case 'withdrawn': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (existingApplication) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-muted-foreground">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium">Application Status</h4>
                <p className="text-sm text-muted-foreground">
                  You have already applied for this job
                </p>
              </div>
            </div>
            <Badge className={getApplicationStatusColor(existingApplication.status)}>
              <div className="flex items-center gap-1">
                {getApplicationStatusIcon(existingApplication.status)}
                {existingApplication.status}
              </div>
            </Badge>
          </div>
          
          {existingApplication.status === 'accepted' && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Congratulations!</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Your application has been accepted. You can now start working on this project.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Send className="w-4 h-4 mr-2" />
          Apply for this Job
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for Job</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Job Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{job.title}</CardTitle>
              <CardDescription className="line-clamp-3">
                {job.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span>Budget: ${job.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Posted: {new Date(job.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>Hirer: {job.hirer.nickname}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>Location: {job.location}</span>
                </div>
              </div>
              
              {job.skills_required && job.skills_required.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills_required.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cover_letter">Cover Letter *</Label>
              <Textarea
                id="cover_letter"
                value={formData.cover_letter}
                onChange={(e) => setFormData(prev => ({ ...prev, cover_letter: e.target.value }))}
                placeholder="Tell the hirer why you're the best fit for this job. Include your relevant experience, approach to the project, and any questions you have..."
                className="min-h-[120px]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="proposed_rate">Your Rate ($) *</Label>
                <Input
                  id="proposed_rate"
                  type="number"
                  step="0.01"
                  value={formData.proposed_rate}
                  onChange={(e) => setFormData(prev => ({ ...prev, proposed_rate: e.target.value }))}
                  placeholder="0.00"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your proposed hourly rate
                </p>
              </div>

              <div>
                <Label htmlFor="estimated_duration">Estimated Duration (days) *</Label>
                <Input
                  id="estimated_duration"
                  type="number"
                  value={formData.estimated_duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimated_duration: e.target.value }))}
                  placeholder="0"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How many days do you need?
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitApplicationMutation.isPending}
              >
                {submitApplicationMutation.isPending ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
