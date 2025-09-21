import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  User, 
  MapPin, 
  DollarSign, 
  Clock, 
  Star, 
  MessageSquare, 
  CheckCircle, 
  XCircle,
  Calendar,
  Briefcase
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface JobApplication {
  id: string;
  job_id: string;
  professional_id: string;
  proposal: string;
  proposed_rate: number;
  estimated_duration: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  professional: {
    id: string;
    full_name: string;
    nickname: string;
    bio: string;
    skills: string[];
    hourly_rate: number;
    location: string;
    avatar_url?: string;
    rating?: number;
    completed_projects?: number;
  };
}

interface JobApplicationsProps {
  jobId: string;
  jobTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobApplications({ jobId, jobTitle, isOpen, onClose }: JobApplicationsProps) {
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

  // Query for real job applications (when job_applications table exists)
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['jobApplications', jobId],
    queryFn: async () => {
      try {
        // For now, return empty array since we don't have job_applications table yet
        // When the table is created, this query will fetch real applications
        const { data, error } = await supabase
          .from('job_applications')
          .select(`
            *,
            professional:profiles!professional_id(full_name, nickname, bio, skills, hourly_rate, location, avatar_url)
          `)
          .eq('job_id', jobId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching job applications:', error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error('Exception fetching job applications:', error);
        return [];
      }
    },
    enabled: isOpen && !!jobId,
  });

  const handleAcceptApplication = (applicationId: string) => {
    // TODO: Implement accept application logic
    console.log('Accepting application:', applicationId);
  };

  const handleRejectApplication = (applicationId: string) => {
    // TODO: Implement reject application logic
    console.log('Rejecting application:', applicationId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Applications for "{jobTitle}"</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading applications...</p>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8">
            <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
            <p className="text-muted-foreground">
              No professionals have applied for this job yet. Check back later or share the job posting to attract more applicants.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={application.professional.avatar_url} />
                        <AvatarFallback>
                          {application.professional.full_name?.charAt(0) || 'P'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {application.professional.full_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          @{application.professional.nickname}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">
                              {application.professional.rating?.toFixed(1) || 'N/A'}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            • {application.professional.completed_projects || 0} projects
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span>
                        <strong>Proposed Rate:</strong> ${application.proposed_rate}/hour
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>
                        <strong>Duration:</strong> {application.estimated_duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{application.professional.location}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Proposal:</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {application.proposal}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {application.professional.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Applied {new Date(application.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {application.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectApplication(application.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAcceptApplication(application.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
