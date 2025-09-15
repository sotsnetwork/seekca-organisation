import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Users, MapPin, Globe, Image } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const teamFormSchema = z.object({
  name: z.string().min(2, "Team name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  location: z.string().optional(),
  website_url: z.string().url().optional().or(z.literal("")),
  portfolio_url: z.string().url().optional().or(z.literal("")),
});

type TeamFormData = z.infer<typeof teamFormSchema>;

const SKILL_OPTIONS = [
  "Plumbing", "Electrical Work", "HVAC Installation", "Carpentry",
  "Masonry", "Roofing", "Flooring Installation", "Painting",
  "Tile Installation", "Concrete Work", "Drywall Installation", "Framing",
  "Auto Repair", "Welding", "Landscaping", "Cleaning Services",
  "Moving Services", "Handyman Services", "Appliance Repair", "Lock Services"
];

export default function TeamCreationForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamFormSchema),
  });

  const createTeamMutation = useMutation({
    mutationFn: async (data: TeamFormData) => {
      if (!user) throw new Error("User not authenticated");

      const { data: team, error } = await supabase
        .from("teams")
        .insert({
          name: data.name,
          description: data.description,
          skills: data.skills,
          organizer_id: user.id,
          location: data.location || null,
          website_url: data.website_url || null,
          portfolio_url: data.portfolio_url || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Add the organizer as the first team member
      const { error: memberError } = await supabase
        .from("team_members")
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: "organizer",
          status: "active",
        });

      if (memberError) throw memberError;

      return team;
    },
    onSuccess: () => {
      toast.success("Team created successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-teams"] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      reset();
      setSelectedSkills([]);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Failed to create team: " + error.message);
    },
  });

  const addSkill = (skill: string) => {
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const handleAddCustomSkill = () => {
    if (newSkill.trim() && !selectedSkills.includes(newSkill.trim())) {
      addSkill(newSkill.trim());
      setNewSkill("");
    }
  };

  const onSubmit = (data: TeamFormData) => {
    const formData = {
      ...data,
      skills: selectedSkills,
    };
    createTeamMutation.mutate(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Create New Team
        </CardTitle>
        <CardDescription>
          Build a collaborative team of professionals to work together on projects.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Team Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Team Name *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="e.g., Digital Marketing Experts"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Team Description *</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe your team's expertise and what makes you unique..."
              rows={4}
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label>Team Skills *</Label>
            <div className="space-y-3">
              {/* Selected Skills */}
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add Skills */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Search or add skills..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomSkill();
                      }
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddCustomSkill}
                  disabled={!newSkill.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Skill Options */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Popular skills:</p>
                <div className="flex flex-wrap gap-2">
                  {SKILL_OPTIONS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      disabled={selectedSkills.includes(skill)}
                      className="px-3 py-1 text-sm border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {errors.skills && (
              <p className="text-sm text-destructive">{errors.skills.message}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location (Optional)
            </Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="e.g., New York, NY or Remote"
            />
          </div>

          {/* Website URL */}
          <div className="space-y-2">
            <Label htmlFor="website_url" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Website URL (Optional)
            </Label>
            <Input
              id="website_url"
              {...register("website_url")}
              placeholder="https://yourteam.com"
              className={errors.website_url ? "border-destructive" : ""}
            />
            {errors.website_url && (
              <p className="text-sm text-destructive">{errors.website_url.message}</p>
            )}
          </div>

          {/* Portfolio URL */}
          <div className="space-y-2">
            <Label htmlFor="portfolio_url" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Portfolio URL (Optional)
            </Label>
            <Input
              id="portfolio_url"
              {...register("portfolio_url")}
              placeholder="https://yourteam.portfolio.com"
              className={errors.portfolio_url ? "border-destructive" : ""}
            />
            {errors.portfolio_url && (
              <p className="text-sm text-destructive">{errors.portfolio_url.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setSelectedSkills([]);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTeamMutation.isPending}
              className="flex items-center gap-2"
            >
              {createTeamMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Team"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
