import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { 
  Search, 
  Users, 
  MapPin, 
  Globe, 
  Image as ImageIcon,
  Calendar,
  Star,
  Filter,
  X,
  Eye,
  MessageSquare
} from "lucide-react";

export default function Teams() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [showTeamDetails, setShowTeamDetails] = useState(false);

  // Fetch teams
  const { data: teams = [], isLoading } = useQuery({
    queryKey: ["teams", searchTerm, skillFilter, locationFilter],
    queryFn: async () => {
      let query = supabase
        .from("team_search_view")
        .select("*");

      // Apply search filters
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (skillFilter) {
        query = query.contains("skills", [skillFilter]);
      }

      if (locationFilter) {
        query = query.ilike("location", `%${locationFilter}%`);
      }

      const { data, error } = await query
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
  });

  // Fetch detailed team info for modal
  const { data: teamDetails } = useQuery({
    queryKey: ["team-details", selectedTeam?.id],
    queryFn: async () => {
      if (!selectedTeam?.id) return null;

      // Get team details
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("*")
        .eq("id", selectedTeam.id)
        .single();

      if (teamError) throw teamError;

      // Get team members
      const { data: membersData, error: membersError } = await supabase
        .rpc("get_team_members", { team_uuid: selectedTeam.id });

      if (membersError) throw membersError;

      return {
        ...teamData,
        members: membersData,
      };
    },
    enabled: !!selectedTeam?.id,
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSkillFilter("");
    setLocationFilter("");
  };

  const hasActiveFilters = searchTerm || skillFilter || locationFilter;

  const handleTeamClick = (team: any) => {
    setSelectedTeam(team);
    setShowTeamDetails(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Professional Teams</h1>
          <p className="text-muted-foreground text-lg">
            Discover skilled teams ready to work on your projects
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Find Teams
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search teams by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Filter by Skill</label>
                <Input
                  placeholder="e.g., Web Development"
                  value={skillFilter}
                  onChange={(e) => setSkillFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Filter by Location</label>
                <Input
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

        {/* Teams Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading teams...</p>
          </div>
        ) : teams.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No teams found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or check back later for new teams.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <Card 
                key={team.id} 
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => handleTeamClick(team)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={team.team_avatar_url} />
                      <AvatarFallback>
                        {team.name?.charAt(0) || "T"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                        {team.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {team.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {team.skills?.slice(0, 4).map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {team.skills?.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{team.skills.length - 4} more
                      </Badge>
                    )}
                  </div>

                  {/* Team Info */}
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{team.member_count} members</span>
                    </div>
                    {team.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{team.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Created {new Date(team.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTeamClick(team);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement contact team functionality
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Team Details Modal */}
      <Dialog open={showTeamDetails} onOpenChange={setShowTeamDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={teamDetails?.team_avatar_url} />
                <AvatarFallback>
                  {teamDetails?.name?.charAt(0) || "T"}
                </AvatarFallback>
              </Avatar>
              {teamDetails?.name}
            </DialogTitle>
            <DialogDescription>
              {teamDetails?.description}
            </DialogDescription>
          </DialogHeader>

          {teamDetails && (
            <div className="space-y-6">
              {/* Team Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Team Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{teamDetails.members?.length || 0} members</span>
                    </div>
                    {teamDetails.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{teamDetails.location}</span>
                      </div>
                    )}
                    {teamDetails.website_url && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <a 
                          href={teamDetails.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                    {teamDetails.portfolio_url && (
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        <a 
                          href={teamDetails.portfolio_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View Portfolio
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {teamDetails.skills?.map((skill: string) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div>
                <h4 className="font-semibold mb-3">Team Members</h4>
                <div className="grid gap-3 md:grid-cols-2">
                  {teamDetails.members?.map((member: any) => (
                    <div key={member.user_id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={member.avatar_url} />
                        <AvatarFallback>
                          {member.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">{member.full_name}</p>
                          {member.role === "organizer" && (
                            <Badge variant="default" className="text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Organizer
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {member.email}
                        </p>
                        {member.skills && member.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {member.skills.slice(0, 3).map((skill: string) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {member.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{member.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Team */}
              <div className="flex gap-3 pt-4 border-t">
                <Button className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Team
                </Button>
                <Button variant="outline">
                  <Star className="w-4 h-4 mr-2" />
                  Save Team
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
