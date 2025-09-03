import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, X } from "lucide-react";
import { skillCategories, SkillCategory } from "@/lib/skills";

interface SkillSelectorProps {
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  maxSkills?: number;
}

export default function SkillSelector({ selectedSkills, onSkillsChange, maxSkills = 20 }: SkillSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAllSkills, setShowAllSkills] = useState(false);

  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      onSkillsChange(selectedSkills.filter(s => s !== skill));
    } else {
      if (selectedSkills.length < maxSkills) {
        onSkillsChange([...selectedSkills, skill]);
      }
    }
  };

  const removeSkill = (skill: string) => {
    onSkillsChange(selectedSkills.filter(s => s !== skill));
  };

  const filteredCategories = skillCategories.filter(category => {
    if (selectedCategory === "all") return true;
    return category.id === selectedCategory;
  });

  const filteredSkills = filteredCategories.flatMap(category => 
    category.skills.filter(skill =>
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getCategoryForSkill = (skill: string): SkillCategory | undefined => {
    return skillCategories.find(category => category.skills.includes(skill));
  };

  return (
    <div className="space-y-6">
      {/* Selected Skills Display */}
      {selectedSkills.length > 0 && (
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Selected Skills ({selectedSkills.length}/{maxSkills})
          </Label>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => {
              const category = getCategoryForSkill(skill);
              return (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1"
                >
                  <span className="text-xs text-muted-foreground">
                    {category?.name}
                  </span>
                  <span className="font-medium">{skill}</span>
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Search and Category Filter */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
        >
          <option value="all">All Categories</option>
          {skillCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Skills Grid */}
      <div className="space-y-4">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="border-2 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                {category.name}
              </CardTitle>
              <CardDescription>
                Select the skills you offer in {category.name.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.skills
                  .filter(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={selectedSkills.includes(skill)}
                        onCheckedChange={() => handleSkillToggle(skill)}
                        disabled={!selectedSkills.includes(skill) && selectedSkills.length >= maxSkills}
                      />
                      <Label
                        htmlFor={skill}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {skill}
                      </Label>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skills Limit Warning */}
      {selectedSkills.length >= maxSkills && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            You've reached the maximum number of skills ({maxSkills}). Remove some skills to add new ones.
          </p>
        </div>
      )}

      {/* No Results */}
      {filteredSkills.length === 0 && searchTerm && (
        <div className="text-center py-8 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No skills found matching "{searchTerm}"</p>
          <p className="text-sm">Try a different search term or browse by category</p>
        </div>
      )}
    </div>
  );
}
