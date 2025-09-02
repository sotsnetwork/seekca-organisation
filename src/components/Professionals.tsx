import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Star, Briefcase, MessageSquare, Filter } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface Professional {
  id: string;
  name: string;
  title: string;
  location: string;
  country: string;
  skills: string[];
  rating: number;
  hourlyRate: number;
  completedProjects: number;
  avatar?: string;
  description: string;
  verified: boolean;
}

export default function Professionals() {
  const { user } = useAuth();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [rateFilter, setRateFilter] = useState("");

  // Mock data - in a real app, this would come from your Supabase database
  const mockProfessionals: Professional[] = [
    // Nigeria professionals
    {
      id: "1",
      name: "Sarah Johnson",
      title: "Full-Stack Developer",
      location: "Lagos, Nigeria",
      country: "Nigeria",
      skills: ["React", "Node.js", "TypeScript", "MongoDB"],
      rating: 4.9,
      hourlyRate: 25,
      completedProjects: 47,
      description: "Experienced developer with 5+ years building scalable web applications.",
      verified: true,
    },
    {
      id: "2",
      name: "Michael Chen",
      title: "UI/UX Designer",
      location: "Abuja, Nigeria",
      country: "Nigeria",
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
      rating: 4.8,
      hourlyRate: 30,
      completedProjects: 32,
      description: "Creative designer focused on user-centered design solutions.",
      verified: true,
    },
    {
      id: "3",
      name: "David Okafor",
      title: "DevOps Engineer",
      location: "Port Harcourt, Nigeria",
      country: "Nigeria",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      rating: 4.7,
      hourlyRate: 35,
      completedProjects: 28,
      description: "Infrastructure specialist with cloud and automation expertise.",
      verified: true,
    },
    {
      id: "4",
      name: "Lisa Adebayo",
      title: "Data Scientist",
      location: "Ibadan, Nigeria",
      country: "Nigeria",
      skills: ["Python", "Machine Learning", "SQL", "Data Visualization"],
      rating: 4.9,
      hourlyRate: 40,
      completedProjects: 23,
      description: "Data expert helping businesses make data-driven decisions.",
      verified: true,
    },
    {
      id: "5",
      name: "James Okonkwo",
      title: "Mobile App Developer",
      location: "Enugu, Nigeria",
      country: "Nigeria",
      skills: ["React Native", "Flutter", "iOS", "Android"],
      rating: 4.6,
      hourlyRate: 28,
      completedProjects: 35,
      description: "Mobile development specialist with cross-platform expertise.",
      verified: true,
    },
    // US professionals
    {
      id: "6",
      name: "Alex Thompson",
      title: "Frontend Developer",
      location: "San Francisco, USA",
      country: "USA",
      skills: ["React", "Vue.js", "CSS", "JavaScript"],
      rating: 4.8,
      hourlyRate: 45,
      completedProjects: 52,
      description: "Frontend specialist with modern web technologies.",
      verified: true,
    },
    {
      id: "7",
      name: "Emma Wilson",
      title: "Product Manager",
      location: "New York, USA",
      country: "USA",
      skills: ["Agile", "Scrum", "Product Strategy", "User Research"],
      rating: 4.7,
      hourlyRate: 50,
      completedProjects: 38,
      description: "Strategic product leader with startup experience.",
      verified: true,
    },
    // UK professionals
    {
      id: "8",
      name: "Oliver Brown",
      title: "Backend Developer",
      location: "London, UK",
      country: "UK",
      skills: ["Python", "Django", "PostgreSQL", "AWS"],
      rating: 4.9,
      hourlyRate: 42,
      completedProjects: 41,
      description: "Backend expert specializing in scalable APIs.",
      verified: true,
    },
    // Canada professionals
    {
      id: "9",
      name: "Sophie Martin",
      title: "UX Researcher",
      location: "Toronto, Canada",
      country: "Canada",
      skills: ["User Testing", "Analytics", "Research Methods", "Prototyping"],
      rating: 4.8,
      hourlyRate: 38,
      completedProjects: 29,
      description: "Research-driven UX professional.",
      verified: true,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Filter professionals by user's country
      const userCountry = user?.user_metadata?.country;
      let countryProfessionals = mockProfessionals;
      
      if (userCountry) {
        countryProfessionals = mockProfessionals.filter(
          prof => prof.country.toLowerCase() === userCountry.toLowerCase()
        );
      }
      
      setProfessionals(countryProfessionals);
      setFilteredProfessionals(countryProfessionals);
      setLoading(false);
    }, 1000);
  }, [user]);

  useEffect(() => {
    // Filter professionals based on search and filters
    let filtered = professionals;

    if (searchTerm) {
      filtered = filtered.filter(
        prof =>
          prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prof.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prof.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (skillFilter) {
      filtered = filtered.filter(prof =>
        prof.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()))
      );
    }

    if (rateFilter) {
      const maxRate = parseInt(rateFilter);
      filtered = filtered.filter(prof => prof.hourlyRate <= maxRate);
    }

    setFilteredProfessionals(filtered);
  }, [searchTerm, skillFilter, rateFilter, professionals]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading professionals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
              Professionals in {user?.user_metadata?.country || 'Your Country'}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with verified professionals from your country. Find the perfect match for your project.
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-card rounded-lg border border-border p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search professionals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Skills</SelectItem>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="node">Node.js</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
              </SelectContent>
            </Select>
            <Select value={rateFilter} onValueChange={setRateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Max hourly rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Rate</SelectItem>
                <SelectItem value="20">$20 or less</SelectItem>
                <SelectItem value="30">$30 or less</SelectItem>
                <SelectItem value="40">$40 or less</SelectItem>
                <SelectItem value="50">$50 or less</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredProfessionals.length} of {professionals.length} professionals
          </p>
        </div>

        {/* Professionals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map((professional) => (
            <Card key={professional.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={professional.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(professional.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{professional.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {professional.title}
                      </CardDescription>
                    </div>
                  </div>
                  {professional.verified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {professional.location}
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{professional.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{professional.completedProjects} projects</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {professional.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {professional.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {professional.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{professional.skills.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-lg font-semibold text-primary">
                    ${professional.hourlyRate}/hr
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button size="sm">
                      Hire Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProfessionals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No professionals found</h3>
              <p>Try adjusting your search criteria or filters.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
