import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  Plus, 
  Settings, 
  MessageSquare, 
  UserPlus, 
  Crown, 
  MoreVertical,
  MapPin,
  Globe,
  Image as ImageIcon,
  Calendar,
  CheckCircle,
  Clock,
  X
} from "lucide-react";
import { toast } from "sonner";
import TeamCreationForm from "./TeamCreationForm";
import ProfessionalSearch from "./ProfessionalSearch";
import TeamChat from "./TeamChat";

export default function TeamDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  // Fetch user's teams
  const { data: userTeams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ["user-teams", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("team_members")
        .select(`
          team_id,
          role,
          status,
          teams (
            id,
            name,
            description,
            skills,
            location,
            website_url,
            portfolio_url,
            created_at,
            team_avatar_url
          )
        `)
        .eq("user_id", user.id)
        .eq("status", "active");

      if (error) throw error;
      return data.map(item => ({
        ...item.teams,
        userRole: item.role,
        userStatus: item.status
      }));
    },
    enabled: !!user,
  });

  // Fetch team members for selected team
  const { data: teamMembers = [] } = useQuery({
    queryKey: ["team-members", selectedTeam],
    queryFn: async () => {
      if (!selectedTeam) return [];
      const { data, error } = await supabase
        .rpc("get_team_members", { team_uuid: selectedTeam });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedTeam,
  });

  // Fetch team invitations
  const { data: invitations = [] } = useQuery({
    queryKey: ["team-invitations", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("team_invitations")
        .select(`
          id,
          team_id,
          inviter_id,
          message,
          status,
          created_at,
          teams (
            name,
            description
          ),
          profiles!team_invitations_inviter_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq("invitee_id", user.id)
        .in("status", ["pending"]);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Accept invitation mutation
  const acceptInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { data: invitation, error: fetchError } = await supabase
        .from("team_invitations")
        .select("team_id")
        .eq("id", invitationId)
        .single();

      if (fetchError) throw fetchError;

      // Add user to team
      const { error: memberError } = await supabase
        .from("team_members")
        .insert({
          team_id: invitation.team_id,
          user_id: user!.id,
          role: "member",
          status: "active",
        });

      if (memberError) throw memberError;

      // Update invitation status
      const { error: updateError } = await supabase
        .from("team_invitations")
        .update({ 
          status: "accepted",
          responded_at: new Date().toISOString()
        })
        .eq("id", invitationId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      toast.success("Invitation accepted!");
      queryClient.invalidateQueries({ queryKey: ["team-invitations"] });
      queryClient.invalidateQueries({ queryKey: ["user-teams"] });
    },
    onError: (error) => {
      toast.error("Failed to accept invitation: " + error.message);
    },
  });

  // Decline invitation mutation
  const declineInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await supabase
        .from("team_invitations")
        .update({ 
          status: "declined",
          responded_at: new Date().toISOString()
        })
        .eq("id", invitationId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Invitation declined");
      queryClient.invalidateQueries({ queryKey: ["team-invitations"] });
    },
    onError: (error) => {
      toast.error("Failed to decline invitation: " + error.message);
    },
  });

  if (teamsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Collaboration</h2>
          <p className="text-muted-foreground">Manage your teams and collaborate with other professionals</p>
        </div>
        <Dialog open={showCreateTeam} onOpenChange={setShowCreateTeam}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <TeamCreationForm onSuccess={() => setShowCreateTeam(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Pending Invitations ({invitations.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {invitations.map((invitation) => (
              <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={invitation.profiles?.avatar_url} />
                    <AvatarFallback>
                      {invitation.profiles?.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{invitation.teams?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Invited by {invitation.profiles?.full_name}
                    </p>
                    {invitation.message && (
                      <p className="text-sm text-muted-foreground mt-1">
                        "{invitation.message}"
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => declineInvitationMutation.mutate(invitation.id)}
                    disabled={declineInvitationMutation.isPending}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => acceptInvitationMutation.mutate(invitation.id)}
                    disabled={acceptInvitationMutation.isPending}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Teams List */}
      <Tabs defaultValue="teams" className="space-y-4">
        <TabsList>
          <TabsTrigger value="teams">My Teams</TabsTrigger>
          <TabsTrigger value="chat" disabled={!selectedTeam}>
            Team Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="space-y-4">
          {userTeams.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No teams yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first team or wait for invitations from other professionals.
                </p>
                <Button onClick={() => setShowCreateTeam(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Team
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userTeams.map((team) => (
                <Card 
                  key={team.id} 
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedTeam === team.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedTeam(team.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{team.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {team.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-1">
                        {team.userRole === "organizer" && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                        <Badge variant={team.userRole === "organizer" ? "default" : "secondary"}>
                          {team.userRole}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Skills */}
                    <div className="flex flex-wrap gap-1">
                      {team.skills?.slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {team.skills?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{team.skills.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Team Info */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {team.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {team.location}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Created {new Date(team.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTeam(team.id);
                        }}
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Chat
                      </Button>
                      {team.userRole === "organizer" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowInviteDialog(true);
                          }}
                        >
                          <UserPlus className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="chat">
          {selectedTeam ? (
            <TeamChat teamId={selectedTeam} />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Select a team</h3>
                <p className="text-muted-foreground">
                  Choose a team from the list to start chatting with your team members.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invite Professionals to Your Team</DialogTitle>
            <DialogDescription>
              Search for professionals and invite them to collaborate with your team.
            </DialogDescription>
          </DialogHeader>
          {selectedTeam && (
            <ProfessionalSearch 
              teamId={selectedTeam} 
              onInviteSent={() => setShowInviteDialog(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
