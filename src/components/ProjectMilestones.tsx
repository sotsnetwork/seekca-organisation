import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Plus,
  Edit,
  Check,
  X
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Milestone {
  id: string;
  title: string;
  description?: string;
  amount: number;
  due_date?: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected' | 'paid';
  submitted_at?: string;
  approved_at?: string;
  paid_at?: string;
  created_at: string;
}

interface ProjectMilestonesProps {
  projectId: string;
}

export default function ProjectMilestones({ projectId }: ProjectMilestonesProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);

  // Fetch milestones for the project
  const { data: milestones = [], isLoading } = useQuery({
    queryKey: ['project-milestones', projectId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('project_milestones')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching milestones:', error);
          return [];
        }

        return data || [];
      } catch (err) {
        console.error('Exception fetching milestones:', err);
        return [];
      }
    },
    enabled: !!projectId,
  });

  // Create milestone mutation
  const createMilestoneMutation = useMutation({
    mutationFn: async (milestoneData: {
      title: string;
      description?: string;
      amount: number;
      due_date?: string;
    }) => {
      const { data, error } = await supabase
        .from('project_milestones')
        .insert([{
          project_id: projectId,
          ...milestoneData
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-milestones', projectId] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Milestone Created",
        description: "The milestone has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create milestone: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update milestone status mutation
  const updateMilestoneStatusMutation = useMutation({
    mutationFn: async ({ milestoneId, status }: { milestoneId: string; status: string }) => {
      const updateData: any = { status };
      
      if (status === 'submitted') {
        updateData.submitted_at = new Date().toISOString();
      } else if (status === 'approved') {
        updateData.approved_at = new Date().toISOString();
      } else if (status === 'paid') {
        updateData.paid_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('project_milestones')
        .update(updateData)
        .eq('id', milestoneId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-milestones', projectId] });
      toast({
        title: "Milestone Updated",
        description: "The milestone status has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update milestone: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'submitted': return <AlertCircle className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const canManageMilestones = true; // This should be based on user role and project permissions
  const isProfessional = true; // This should be determined from project data

  const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
  const paidAmount = milestones
    .filter(m => m.status === 'paid')
    .reduce((sum, m) => sum + m.amount, 0);
  const progressPercentage = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading milestones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Milestone Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
          <CardDescription>
            Track milestone completion and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Total Budget: ${totalAmount.toLocaleString()}</span>
              <span>Paid: ${paidAmount.toLocaleString()}</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progressPercentage.toFixed(1)}% Complete</span>
              <span>${(totalAmount - paidAmount).toLocaleString()} Remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Milestones</h3>
          {canManageMilestones && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Milestone
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Milestone</DialogTitle>
                </DialogHeader>
                <CreateMilestoneForm 
                  onSubmit={(data) => createMilestoneMutation.mutate(data)}
                  isLoading={createMilestoneMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {milestones.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Milestones Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create milestones to break down the project into manageable phases.
              </p>
              {canManageMilestones && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Milestone
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {milestones.map((milestone) => (
              <Card key={milestone.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{milestone.title}</h4>
                        <Badge className={getStatusColor(milestone.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(milestone.status)}
                            {milestone.status}
                          </div>
                        </Badge>
                      </div>
                      
                      {milestone.description && (
                        <p className="text-sm text-muted-foreground">
                          {milestone.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>${milestone.amount.toLocaleString()}</span>
                        </div>
                        {milestone.due_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {new Date(milestone.due_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Status-specific actions */}
                      <div className="flex gap-2 mt-3">
                        {milestone.status === 'pending' && isProfessional && (
                          <Button
                            size="sm"
                            onClick={() => updateMilestoneStatusMutation.mutate({
                              milestoneId: milestone.id,
                              status: 'submitted'
                            })}
                            disabled={updateMilestoneStatusMutation.isPending}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Mark as Submitted
                          </Button>
                        )}

                        {milestone.status === 'submitted' && !isProfessional && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateMilestoneStatusMutation.mutate({
                                milestoneId: milestone.id,
                                status: 'approved'
                              })}
                              disabled={updateMilestoneStatusMutation.isPending}
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateMilestoneStatusMutation.mutate({
                                milestoneId: milestone.id,
                                status: 'rejected'
                              })}
                              disabled={updateMilestoneStatusMutation.isPending}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}

                        {milestone.status === 'approved' && !isProfessional && (
                          <Button
                            size="sm"
                            onClick={() => updateMilestoneStatusMutation.mutate({
                              milestoneId: milestone.id,
                              status: 'paid'
                            })}
                            disabled={updateMilestoneStatusMutation.isPending}
                          >
                            <DollarSign className="w-4 h-4 mr-2" />
                            Mark as Paid
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Create Milestone Form Component
function CreateMilestoneForm({ 
  onSubmit, 
  isLoading 
}: { 
  onSubmit: (data: any) => void; 
  isLoading: boolean; 
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    due_date: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formData.title,
      description: formData.description || undefined,
      amount: parseFloat(formData.amount),
      due_date: formData.due_date || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="e.g., Design Phase, Development Phase"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe what needs to be completed for this milestone"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount">Amount ($) *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <Label htmlFor="due_date">Due Date</Label>
          <Input
            id="due_date"
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Milestone'}
        </Button>
      </div>
    </form>
  );
}
