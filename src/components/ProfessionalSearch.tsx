import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, 
  UserPlus, 
  MapPin, 
  Star, 
  Clock, 
  CheckCircle,
  Users,
  Filter,
  X
} from "lucide-react";
import { toast } from "sonner";

interface ProfessionalSearchProps {
  teamId: string;
  onInviteSent?: () => void;
}

export default function ProfessionalSearch({ teamId, onInviteSent }: ProfessionalSearchProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedProfessional, setSelectedProfessional] = useState<{
    id: string;
    full_name: string;
    skills: string[];
    location?: string;
  } | null>(null);
  const [inviteMessage, setInviteMessage] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  // Fetch professionals for team invitations
  const { data: professionals = [], isLoading } = useQuery({
    queryKey: ["professionals-for-invite", searchTerm, skillFilter, locationFilter],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select(`
          user_id,
          full_name,
          email,
          avatar_url,
          bio,
          skills,
          hourly_rate,
          location,
          visibility,
          collaboration_enabled,
          user_roles!inner(role)
        `)
        .eq("user_roles.role", "professional")
        .eq("collaboration_enabled", true)
        .in("visibility", ["public", "professionals_only"]);

      // Apply search filters
      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%`);
      }

      if (skillFilter) {
        query = query.contains("skills", [skillFilter]);
      }

      if (locationFilter) {
        query = query.ilike("location", `%${locationFilter}%`);
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;

      // Filter out current user and existing team members
      const currentTeamMembers = await getCurrentTeamMembers();
      const currentTeamMemberIds = currentTeamMembers.map(member => member.user_id);

      return data.filter(prof => 
        prof.user_id !== user?.id && 
        !currentTeamMemberIds.includes(prof.user_id)
      );
    },
    enabled: !!user,
  });

  // Get current team members
  const getCurrentTeamMembers = async () => {
    const { data, error } = await supabase
      .from("team_members")
      .select("user_id")
      .eq("team_id", teamId)
      .eq("status", "active");

    if (error) throw error;
    return data;
  };

  // Get team info
  const { data: teamInfo } = useQuery({
    queryKey: ["team-info", teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("name, description, skills")
        .eq("id", teamId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!teamId,
  });

  // Send invitation mutation
  const sendInvitationMutation = useMutation({
    mutationFn: async ({ professionalId, message }: { professionalId: string; message: string }) => {
      const { error } = await supabase
        .from("team_invitations")
        .insert({
          team_id: teamId,
          inviter_id: user!.id,
          invitee_id: professionalId,
          message: message || `You've been invited to join the "${teamInfo?.name}" team!`,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Invitation sent successfully!");
      queryClient.invalidateQueries({ queryKey: ["professionals-for-invite"] });
      setShowInviteDialog(false);
      setSelectedProfessional(null);
      setInviteMessage("");
      onInviteSent?.();
    },
    onError: (error) => {
      toast.error("Failed to send invitation: " + error.message);
    },
  });

  const handleInviteClick = (professional: { id: string; full_name: string; skills: string[]; location?: string }) => {
    setSelectedProfessional(professional);
    setInviteMessage(`Hi ${professional.full_name}, I'd like to invite you to join our team "${teamInfo?.name}". We're looking for someone with your skills to collaborate on exciting projects!`);
    setShowInviteDialog(true);
  };

  const handleSendInvitation = () => {
    if (!selectedProfessional) return;
    sendInvitationMutation.mutate({
      professionalId: selectedProfessional.user_id,
      message: inviteMessage,
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSkillFilter("");
    setLocationFilter("");
  };

  const hasActiveFilters = searchTerm || skillFilter || locationFilter;

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Find Professionals
          </CardTitle>
          <CardDescription>
            Search for professionals to invite to your team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="skill-filter">Filter by Skill</Label>
              <Input
                id="skill-filter"
                placeholder="e.g., Electrician, Plumber, Carpenter"
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location-filter">Filter by Location</Label>
              <Input
                id="location-filter"
                placeholder="e.g., New York"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Professionals List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Searching professionals...</p>
          </div>
        ) : professionals.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No professionals found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {professionals.map((professional) => (
              <Card key={professional.user_id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={professional.avatar_url} />
                      <AvatarFallback>
                        {professional.full_name?.charAt(0) || "P"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{professional.full_name}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {professional.email}
                      </p>
                      {professional.location && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3" />
                          {professional.location}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Bio */}
                  {professional.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {professional.bio}
                    </p>
                  )}

                  {/* Skills */}
                  {professional.skills && professional.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {professional.skills.slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {professional.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{professional.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Hourly Rate */}
                  {professional.hourly_rate && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-3 h-3" />
                      ${professional.hourly_rate}/hour
                    </div>
                  )}

                  {/* Invite Button */}
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleInviteClick(professional)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite to Team
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Invitation Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Team Invitation</DialogTitle>
            <DialogDescription>
              Send an invitation to {selectedProfessional?.full_name} to join your team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Team Info */}
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium">{teamInfo?.name}</h4>
              <p className="text-sm text-muted-foreground">{teamInfo?.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {teamInfo?.skills?.slice(0, 3).map((skill: string) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Invitation Message */}
            <div>
              <Label htmlFor="invite-message">Invitation Message</Label>
              <Textarea
                id="invite-message"
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                placeholder="Write a personalized invitation message..."
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowInviteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendInvitation}
                disabled={sendInvitationMutation.isPending}
              >
                {sendInvitationMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Send Invitation
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
