import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Calendar,
  AlertCircle,
  Target
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  amount: number;
  due_date?: string;
  status: string;
  submitted_at?: string;
  approved_at?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

interface ProjectMilestonesProps {
  projectId: string;
}

export default function ProjectMilestones({ projectId }: ProjectMilestonesProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    due_date: ''
  });

  // Mock implementation - project milestones feature not yet implemented
  const milestones: ProjectMilestone[] = [];
  const isLoading = false;

  // Mock create milestone mutation
  const createMilestoneMutation = useMutation({
    mutationFn: async (milestoneData: {
      title: string;
      description?: string;
      amount: number;
      due_date?: string;
    }) => {
      console.log('Mock milestone created:', milestoneData);
      throw new Error('Project milestones feature not yet implemented');
    },
    onSuccess: () => {
      setIsDialogOpen(false);
      setFormData({ title: '', description: '', amount: '', due_date: '' });
      toast({
        title: "Milestone Created",
        description: "The milestone has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Creation Error",
        description: `Failed to create milestone: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Mock update milestone mutation
  const updateMilestoneMutation = useMutation({
    mutationFn: async ({ milestoneId, status }: { milestoneId: string; status: string }) => {
      console.log('Mock milestone update:', { milestoneId, status });
      throw new Error('Project milestones feature not yet implemented');
    },
    onSuccess: () => {
      toast({
        title: "Milestone Updated",
        description: "The milestone status has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update Error",
        description: `Failed to update milestone: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in the title and amount.",
        variant: "destructive",
      });
      return;
    }

    createMilestoneMutation.mutate({
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      amount: parseFloat(formData.amount),
      due_date: formData.due_date || undefined
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'submitted': return <AlertCircle className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate progress
  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter(m => m.status === 'paid').length;
  const totalValue = milestones.reduce((sum, m) => sum + m.amount, 0);
  const completedValue = milestones.filter(m => m.status === 'paid').reduce((sum, m) => sum + m.amount, 0);

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
    <div className="space-y-4">
      {/* Milestones Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Project Milestones</h3>
          <p className="text-sm text-muted-foreground">
            Track progress and payments
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Milestone
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Milestone</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Milestone title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what needs to be delivered"
                />
              </div>

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
                  disabled={createMilestoneMutation.isPending}
                >
                  {createMilestoneMutation.isPending ? 'Creating...' : 'Create Milestone'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Overview */}
      {totalMilestones > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Milestones</p>
                  <p className="text-2xl font-bold">{completedMilestones} / {totalMilestones}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Value</p>
                  <p className="text-2xl font-bold">${completedValue.toLocaleString()} / ${totalValue.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completion Progress</span>
                  <span>{totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0}%</span>
                </div>
                <Progress 
                  value={totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0} 
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Milestones List */}
      {milestones.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="text-lg font-semibold mb-2">No Milestones Yet</h4>
            <p className="text-muted-foreground mb-4">
              Feature not yet implemented. Create milestones to track project progress and payments.
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Milestone
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <Card key={milestone.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{milestone.title}</h4>
                      <Badge className={getStatusColor(milestone.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(milestone.status)}
                          {milestone.status}
                        </div>
                      </Badge>
                    </div>
                    
                    {milestone.description && (
                      <p className="text-sm text-muted-foreground mb-3">
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
                          <span>Due: {formatDate(milestone.due_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {milestone.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => updateMilestoneMutation.mutate({ 
                          milestoneId: milestone.id, 
                          status: 'submitted' 
                        })}
                        disabled={updateMilestoneMutation.isPending}
                      >
                        Submit
                      </Button>
                    )}
                    
                    {milestone.status === 'submitted' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateMilestoneMutation.mutate({ 
                            milestoneId: milestone.id, 
                            status: 'rejected' 
                          })}
                          disabled={updateMilestoneMutation.isPending}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateMilestoneMutation.mutate({ 
                            milestoneId: milestone.id, 
                            status: 'approved' 
                          })}
                          disabled={updateMilestoneMutation.isPending}
                        >
                          Approve
                        </Button>
                      </>
                    )}
                    
                    {milestone.status === 'approved' && (
                      <Button
                        size="sm"
                        onClick={() => updateMilestoneMutation.mutate({ 
                          milestoneId: milestone.id, 
                          status: 'paid' 
                        })}
                        disabled={updateMilestoneMutation.isPending}
                      >
                        Mark as Paid
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}